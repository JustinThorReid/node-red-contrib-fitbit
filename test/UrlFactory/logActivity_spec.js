'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.logActivity', () => {

  it('should throw if no argument passed', done => {
    expect(() => UrlFactory.logActivty()).to.throw("No data specified");
    done();
  });

  it('should throw if no activityLogId or activityId passed', done => {
    expect(() => UrlFactory.logActivty({})).to.throw("activityId or activityName is required");
    done();
  });

  it('should throw without activityId and activityName', done => {
    const data = {
      manualCalories: 444,
      startDate: 1617358664933,
      startTime: "17:00",
      durationSec: 888
    };

    expect(() => UrlFactory.logActivty(data)).to.throw("activityId or activityName is required");
    done();
  });

  it('should throw without manualCalories', done => {
    const data = {
      activityId: 1517,
      startDate: 1617358664933,
      startTime: "17:00",
      durationSec: 888
    };

    expect(() => UrlFactory.logActivty(data)).to.throw("manualCalories is required");
    done();
  });

  it('should throw without startDate', done => {
    const data = {
      activityId: 1517,
      manualCalories: 444,
      startTime: "17:00",
      durationSec: 888
    };

    expect(() => UrlFactory.logActivty(data)).to.throw("Start date is required.");
    done();
  });

  it('should throw without startTime', done => {
    const data = {
      activityId: 1517,
      startDate: 1617358664933,
      manualCalories: 444,
      durationSec: 888
    };

    expect(() => UrlFactory.logActivty(data)).to.throw("Start time is required.");
    done();
  });

  it('should throw without durationSec', done => {
    const data = {
      activityId: 1517,
      startDate: 1617358664933,
      manualCalories: 444,
      startTime: "17:00",
    };

    expect(() => UrlFactory.logActivty(data)).to.throw("Duration is required.");
    done();
  });


  it('should provide correct url for data with activityId without distance', done => {
    const data = {
      activityId: 1517,
      manualCalories: 444,
      startDate: 1617358664933,
      startTime: "17:00",
      durationSec: 888
    };

    expect(UrlFactory.logActivty(data)).to.equal("https://api.fitbit.com/1/user/-/activities.json?activityId=1517&startTime=17%3A00&manualCalories=444&durationMillis=888000&date=2021-04-02");
    done();
  });

  it('should provide correct url for data with activityId with distance', done => {
    const data = {
      activityId: 1517,
      manualCalories: 444,
      startDate: 1617358664933,
      startTime: "17:00",
      durationSec: 888,
      distance: 33.8
    };

    expect(UrlFactory.logActivty(data)).to.equal("https://api.fitbit.com/1/user/-/activities.json?activityId=1517&startTime=17%3A00&manualCalories=444&durationMillis=888000&date=2021-04-02&distance=33.8");
    done();
  });

  it('should provide correct url for data with activityName without distance', done => {
    const data = {
      activityName: "Walk",
      manualCalories: 150,
      startDate: "2021-07-21",
      startTime: "12:33",
      durationSec: 56.5
    };

    expect(UrlFactory.logActivty(data)).to.equal("https://api.fitbit.com/1/user/-/activities.json?activityName=Walk&startTime=12%3A33&manualCalories=150&durationMillis=56000&date=2021-07-21");
    done();
  });

  it('should provide correct url for data with activityName with distance', done => {
    const data = {
      activityName: "Walk",
      manualCalories: 150,
      startDate: "2021-07-21",
      startTime: "12:33",
      durationSec: 56.5,
      distance: 1.566
    };

    expect(UrlFactory.logActivty(data)).to.equal("https://api.fitbit.com/1/user/-/activities.json?activityName=Walk&startTime=12%3A33&manualCalories=150&durationMillis=56000&date=2021-07-21&distance=1.566");
    done();
  });


});
