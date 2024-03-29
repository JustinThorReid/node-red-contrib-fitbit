const moment = require('moment');

function fitbitUrl(...uri) {
  return "https://api.fitbit.com/1/" + uri.join("/") + ".json";
}

function fitbitUrlCurrentUser(...uri) {
  return fitbitUrl("user", "-", ...uri);
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function checkData(data) {
  if (!data)
    throw new Error("No data specified");
}

function checkValidPeriod(data) {
  if (!['1d', '7d', '1w', '1m'].includes(data.period)) throw new Error("Invalid period");
}

class UrlFactory {

  static bodyTimeSeries(data) {
    checkData(data);

    if (!data.startDate) {
      throw new Error("Start date is required.");
    }
    if (!data.bodySeriesPath) {
      throw new Error("Resource is required");
    }
    const formattedStartDate = formatDate(data.startDate);

    if (!data.endDate && data.period) {
      return fitbitUrlCurrentUser("body", data.bodySeriesPath, "date", formattedStartDate, data.period);
    } else if (data.endDate && !data.period) {
      const formattedEndDate = formatDate(data.endDate);
      return fitbitUrlCurrentUser("body", data.bodySeriesPath, "date", formattedStartDate, formattedEndDate);
    } else {
      throw new Error("Bad input combination");
    }
  }

  static bodyWeightLog(data) {
    checkData(data);

    if (!data.startDate) {
      throw new Error("Start date is required.");
    }
    const formattedStartDate = formatDate(data.startDate);
    const bodyUri = "body/log/weight/date";

    if (!data.endDate && !data.period) {
      return fitbitUrlCurrentUser(bodyUri, formattedStartDate);
    } else if (data.endDate && !data.period) {
      const formattedEndDate = formatDate(data.endDate);
      return fitbitUrlCurrentUser(bodyUri, formattedStartDate, formattedEndDate);
    } else if (!data.endDate && data.period) {
      checkValidPeriod(data);
      return fitbitUrlCurrentUser(bodyUri, formattedStartDate, data.period);
    } else {
      throw new Error("Bad input combination");
    }
  }

  static activityTimeSeries(data) {
    checkData(data);

    if (!data.activitiesSeriesPath) {
      throw new Error("Resource is required");
    }
    if (!data.endDate) {
      throw new Error("End date is required.");
    }
    const formattedEndDate = formatDate(data.endDate);

    if (!data.startDate && data.period) {
      return fitbitUrlCurrentUser("activities", data.activitiesSeriesPath, "date", formattedEndDate, data.period);
    } else if (data.startDate && !data.period) {
      const formattedStartDate = formatDate(data.startDate);
      return fitbitUrlCurrentUser("activities", data.activitiesSeriesPath, "date", formattedStartDate, formattedEndDate);
    } else {
      throw new Error("Bad input combination");
    }
  }

  static activitySummary(data) {
    checkData(data);

    if (!data.startDate) {
      throw "Start date is required.";
    }
    const formattedStartDate = formatDate(data.startDate);
    return fitbitUrlCurrentUser("activities/date/", formattedStartDate);
  }

  static devices() {
    return fitbitUrlCurrentUser("devices");
  }

  static sleepLog(data) {
    checkData(data);

    if (!data.startDate) {
      throw new Error("Start date is required.");
    }

    const formattedStartDate = formatDate(data.startDate);
    return fitbitUrlCurrentUser("sleep/date/" + formattedStartDate);
  }

  static bodyFatLog(data) {
    checkData(data);

    if (!data.startDate) {
      throw new Error("Start date is required.");
    }
    const formattedStartDate = formatDate(data.startDate);
    const fatUri = "body/log/fat/date"

    if (!data.endDate && !data.period) {
      return fitbitUrlCurrentUser(fatUri, formattedStartDate);
    } else if (data.endDate && !data.period) {
      const formattedEndDate = formatDate(data.endDate);
      return fitbitUrlCurrentUser(fatUri, formattedStartDate, formattedEndDate);
    } else if (!data.endDate && data.period) {
      checkValidPeriod(data);

      return fitbitUrlCurrentUser(fatUri, formattedStartDate, data.period);
    } else {
      throw new Error("Bad input combination");
    }
  }
}

module.exports = UrlFactory;
