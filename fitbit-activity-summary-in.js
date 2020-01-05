const moment = require('moment');

module.exports = function (RED) {
    const nodeFactory = require('./node-factory')(RED);

    nodeFactory("fitbit-activity-summary-in", (data, msg) => {
        const startDate = data(msg, "startDate");

        if (!startDate) {
            throw "Startdate is required.";
        }

        if (startDate) {
            const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
            return "https://api.fitbit.com/1/user/-/activities/date/" + formattedStartDate + ".json"
        } else {
            throw "Bad input combination";
        }
    });
}