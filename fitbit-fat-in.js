const moment = require('moment');

module.exports = function (RED) {
    const nodeFactory = require('./node-factory')(RED);

    nodeFactory("fitbit-fat-in", (data, msg) => {
        const startDate = data(msg, "startDate");
        const endDate = data(msg, "endDate");
        const period = data(msg, "period");

        if (!startDate) {
            throw "Startdate is required.";
        }

        if (startDate && !endDate && !period) {
            const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
            return "https://api.fitbit.com/1/user/-/body/log/fat/date/" + formattedStartDate + ".json";
        } else if (startDate && endDate && !period) {
            const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
            const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
            return "https://api.fitbit.com/1/user/-/body/log/fat/date/" + formattedStartDate + "/" + formattedEndDate + ".json";
        } else if (startDate && !endDate && period) {
            if (!['1d', '7d', '1w', '1m'].includes(period)) throw "Invalid period";

            const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
            return "https://api.fitbit.com/1/user/-/body/log/fat/date/" + formattedStartDate + "/" + period + ".json";
        } else {
            throw "Bad input combination";
        }
    });
}