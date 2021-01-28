const UrlFactory = require('./UrlFactory');

function parseFitbitData(body) {
    if (!body)
        throw "Fitbit API returned an empty response";

    let result_json;
    try {
        result_json = JSON.parse(body);
    } catch (e) {
        throw "Json parse error: " + e.message;
    }

    if (result_json.hasOwnProperty("errors"))
        throw "Fitbit API error: " + result_json.errors.map(e=>e.message).join(", ");

    return result_json;
}

function typedDataFactory(RED, config, node) {
    return function getTypedInput(msg, key) {
        const type = key + 'Type';

        if (!config[type]) return config[key];

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

    const RESOURCE_TYPES = {
        "body-fat-log": {
            display: RED._("fitbit.resources.body-fat-log"),
            inputs: ["startDate", "endDate", "period"],
            func: UrlFactory.bodyFatLog
        },
        "body-weight-log": {
            display: RED._("fitbit.resources.body-weight-log"),
            inputs: ["startDate", "endDate", "period"],
            func: URLSearchParams.bodyWeightLog
        },
        "body-timeseries": {
            display: RED._("fitbit.resources.body-timeseries"),
            inputs: ["bodySeriesPath", "startDate", "endDate", "period"],
            func: UrlFactory.bodyTimeSeries
        },
        "activity-timeseries": {
            display: RED._("fitbit.resources.activity-timeseries"),
            inputs: ["activitiesSeriesPath", "startDate", "endDate", "period"],
            func: UrlFactory.activityTimeSeries
        },
        "activity-summary": {
            display: RED._("fitbit.resources.activity-summary-in"),
            inputs: ["startDate"],
            func: UrlFactory.activitySummary
        },
        "devices": {
            display: RED._("fitbit.resources.devices-in"),
            inputs: [],
            func: UrlFactory.devices
        },
        "sleep-log": {
            display: RED._("fitbit.resources.sleep-log"),
            inputs: ["startDate"],
            func: UrlFactory.sleepLog
        }
    };

    function fitbitInNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const getTypedData = typedDataFactory(RED, config, node);

        const errorReport = function (errorText, msg) {
            node.error(errorText, msg);
            node.status({text: errorText , fill: "red"});
            node.send(null);
        };

        if (!RED.nodes.getNode(config.fitbit)) {
            this.warn(RED._("fitbit.warn.missing-credentials"));
            return;
        }

        if (!config.resource) {
            this.warn(RED._("fitbit.warn.missing-resource"));
            return;
        }

        const resource = RESOURCE_TYPES[config.resource];

        node.on('input', function (msg) {
            let url;
            node.status("");
            try {
                let data = {};
                resource.inputs.forEach((input) => {
                    data[input] = getTypedData(msg, input);
                });

                url = resource.func(data);
            } catch (err) {
                errorReport(err, msg);
                return;
            }

            if (!url) {
                errorReport("Could not build api url", msg);
                return;
            }

            const credentialsNode = RED.nodes.getNode(config.fitbit);
            const credentials = RED.nodes.getNode(config.fitbit).credentials;

            oauth.makeRequest("GET", url, credentials, credentialsNode.id).then(data => {
                try {
                    msg.payload = parseFitbitData(data);
                } catch (err) {
                    errorReport(err, msg);
                    return;
                }

                node.send(msg);
            })
        });
    }
    RED.nodes.registerType("fitbit", fitbitInNode);


    RED.httpAdmin.get('/fitbit/resources', function (req, res) {
        res.send(RESOURCE_TYPES);
    });
}
