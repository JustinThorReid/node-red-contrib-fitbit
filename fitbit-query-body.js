const moment = require('moment');

module.exports = function (RED) {
    const nodeFactory = require('./node-factory')(RED);

    nodeFactory("fitbit-query-body", (data, msg) => {
        const resource = data(msg, "resource");
        const startDate = data(msg, "startDate");
        const endDate = data(msg, "endDate");
        const period = data(msg, "period");

        if (!startDate) {
            throw "Startdate is required.";
        }
        if (!resource) {
            throw "Resource is required";
        }

        if (startDate && !endDate && period) {
            const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
            return "https://api.fitbit.com/1/user/-/body/" + resource + "/date/" + formattedStartDate + "/" + period + ".json";
        } else if (startDate && endDate && !period) {
            const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
            const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
            return "https://api.fitbit.com/1/user/-/body/" + resource + "/date/" + formattedStartDate + "/" + formattedEndDate + ".json";
        } else {
            throw "Bad input combination";
        }
    });
}