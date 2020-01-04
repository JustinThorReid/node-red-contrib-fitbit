module.exports = function (RED) {
    function fitbitQueryNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            node.send(msg);
        });
    }
    RED.nodes.registerType("fitbit-query", fitbitQueryNode);
}