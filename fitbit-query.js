module.exports = function (RED) {
    const oauth = require('./oauth-helper')(RED);

    function fitbitQueryNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.credentialsNode = RED.nodes.getNode(config.fitbit);
        if (!this.credentialsNode) {
            this.warn(RED._("fitbit.warn.missing-credentials"));
            return;
        }

        console.log(config);
        console.log(this.credentialsNode);
        console.log(RED.nodes.getCredentials(this.credentialsNode.id));
        node.on('input', function (msg) {
            console.log(config);
            const credentials = RED.nodes.getCredentials(config.fitbit);
            node.send(msg);
        });
    }
    RED.nodes.registerType("fitbit-query", fitbitQueryNode);
}