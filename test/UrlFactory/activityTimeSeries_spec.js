'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.activityTimeSeries', () => {

  it('should throw if no argument passed', done => {
    expect(() => UrlFactory.activityTimeSeries()).to.throw("No data specified");
    done();
  });

  it('should throw if no endDate passed', done => {
    const data = {
      activitiesSeriesPath: "steps"
    };

    expect(() => UrlFactory.activityTimeSeries(data)).to.throw("End date is required");
    done();
  });

  it('should throw if no activitiesSeriesPath specified', done => {
    const data = {
      endDate: Date.now()
    };

    expect(() => UrlFactory.activityTimeSeries(data)).to.throw("Resource is required");
    done();
  });

  it('should throw if both startDate and period specified', done => {
    const data = {
      activitiesSeriesPath: "steps",
      endDate: Date.now(),
      startDate: Date.now(),
      period: "7d"
    };
    expect(() => UrlFactory.activityTimeSeries(data)).to.throw("Bad input combination");
    done();
  });

  it('should throw if neither period nor startDate specified', done => {
    const data = {
      activitiesSeriesPath: "steps",
      endDate: Date.now(),
    };
    expect(() => UrlFactory.activityTimeSeries(data)).to.throw("Bad input combination");
    done();
  });

  it('should provide correct url if period specified', done => {
    const data = {
      activitiesSeriesPath: "steps",
      endDate: 1617445064933,
      period: "7d"
    };

    expect(UrlFactory.activityTimeSeries(data)).to.equal("https://api.fitbit.com/1/user/-/activities/steps/date/2021-04-03/7d.json");

    done();
  });

  it('should provide correct url if start date specified', done => {
    const data = {
      activitiesSeriesPath: "steps",
      endDate: 1617445064933,
      startDate: 1517445064933,
    };

    expect(UrlFactory.activityTimeSeries(data)).to.equal("https://api.fitbit.com/1/user/-/activities/steps/date/2018-02-01/2021-04-03.json");

    done();
  });

});
