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

  static foodTimeSeries(data) {
    checkData(data);

    if (!data.startDate) {
      throw new Error("Start date is required.");
    }
    if (!data.foodSeriesPath) {
      throw new Error("Resource is required");
    }
    const formattedStartDate = formatDate(data.startDate);

    if (!data.endDate && data.period) {
      return fitbitUrlCurrentUser("foods/log", data.foodSeriesPath, "date", formattedStartDate, data.period);
    } else if (data.endDate && !data.period) {
      const formattedEndDate = formatDate(data.endDate);
      return fitbitUrlCurrentUser("foods/log", data.foodSeriesPath, "date", formattedStartDate, formattedEndDate);
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

  static foodSummary(data) {
    checkData(data);

    if (!data.startDate) {
      throw "Start date is required.";
    }
    const formattedStartDate = formatDate(data.startDate);
    return fitbitUrlCurrentUser("foods/log/date/", formattedStartDate);
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

  static logActivty(data) {
    checkData(data);

    if (data.activityId && data.activityName) {
      throw new Error("Either activityId or activityName should be specified.");
    }

    if (!data.activityId && !data.activityName) {
      throw new Error("activityId or activityName is required.");
    }

    if (!data.manualCalories) {
      throw new Error("manualCalories is required.");
    }

    if (!data.startDate) {
      throw new Error("Start date is required.");
    }

    if (!data.startTime) {
      throw new Error("Start time is required.");
    }

    if (!data.durationSec) {
      throw new Error("Duration is required.");
    }

    const urlObj = new URL(fitbitUrlCurrentUser("activities"));
    if (data.activityId) {
      urlObj.searchParams.append("activityId", data.activityId);
    } else {
      urlObj.searchParams.append("activityName", data.activityName);
    }

    urlObj.searchParams.append("startTime", data.startTime);
    urlObj.searchParams.append("manualCalories", data.manualCalories);
    urlObj.searchParams.append("durationMillis", String(parseInt(data.durationSec) * 1000));
    urlObj.searchParams.append("date", formatDate(data.startDate));
    if (data.distance) {
      urlObj.searchParams.append("distance", data.distance);
    }
    return urlObj.href;
  }

  static deleteActivty(data) {
    checkData(data);

    if (!data.activityLogId) {
      throw new Error("activityLogId is required.");
    }

    return fitbitUrlCurrentUser("activities", data.activityLogId);
  }

  static logFood(data) {
    checkData(data);

    if (!data.foodId) {
      throw new Error("Food ID is required.");
    }

    if (!data.manualCalories) {
      throw new Error("Calories is required.");
    }

    if (!data.startDate) {
      throw new Error("Start date is required.");
    }

    if (!data.mealTypeId) {
      throw new Error("Meal Type Id is required.");
    }

    if (!data.unitId) {
      throw new Error("Unit ID is required.");
    }

    const urlObj = new URL(fitbitUrlCurrentUser("foods/log"));

    urlObj.searchParams.append("foodId", data.foodId);
    urlObj.searchParams.append("amount", data.manualCalories);
    urlObj.searchParams.append("date", formatDate(data.startDate));
    urlObj.searchParams.append("mealTypeId", data.mealTypeId);
    urlObj.searchParams.append("unitId", data.unitId);

    return urlObj.href;
  }

}

module.exports = UrlFactory;
