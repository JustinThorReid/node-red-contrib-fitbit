function typedDataFactory(RED, config, node) {
    return function getTypedInput(msg, key) {
        const type = key + 'Type';

        switch (config[type]) {
            case 'str':
                return config[key];
            case 'date':
                return new Date();
            case 'msg':
                return RED.util.getObjectProperty(msg, config[key]);
            case 'flow':
                return node.context().flow.get(config[key]);
            case 'global':
                return node.context().global.get(config[key]);

            default:
                break;
        }
    }
}

module.exports = function (RED) {
    const oauth = require('./oauth-helper')(RED);
    return function (name, func) {
        function fitbitNode(config) {
            RED.nodes.createNode(this, config);
            const node = this;
            const data = typedDataFactory(RED, config, node);

            if (!RED.nodes.getNode(config.fitbit)) {
                this.warn(RED._("fitbit.warn.missing-credentials"));
                return;
            }

            node.on('input', function (msg) {
                let url;
                try {
                    url = func(data, msg);
                } catch (err) {
                    node.error(err, msg);
                    return;
                }

                if (!url) {
                    node.error("Could not build api url", msg);
                    return;
                }

                const credentialsNode = RED.nodes.getNode(config.fitbit);
                const credentials = RED.nodes.getNode(config.fitbit).credentials;

                oauth.makeRequest("GET", url, credentials, credentialsNode.id).then(data => {
                    msg.payload = data.body;
                    node.send(msg);
                })
            });
        }
        RED.nodes.registerType(name, fitbitNode);
    }
}
