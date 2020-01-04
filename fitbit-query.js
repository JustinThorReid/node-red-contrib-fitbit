module.exports = function (RED) {
    const oauth = require('./oauth-helper')(RED);

    function fitbitQueryNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        if (!RED.nodes.getNode(config.fitbit)) {
            this.warn(RED._("fitbit.warn.missing-credentials"));
            return;
        }

        node.on('input', function (msg) {
            const credentialsNode = RED.nodes.getNode(config.fitbit);
            const credentials = RED.nodes.getNode(config.fitbit).credentials;
            console.log(credentialsNode);

            oauth.makeRequest("GET", "https://api.fitbit.com/1/user/-/profile.json", credentials, credentialsNode.id).then(data => {
                msg.payload = data;
                node.send(msg);
            })
        });
    }
    RED.nodes.registerType("fitbit-query", fitbitQueryNode);
}