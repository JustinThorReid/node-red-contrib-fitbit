'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.foodTimeSeries', () => {

  it('should throw if no argument passed', done => {
    expect(() => UrlFactory.foodTimeSeries()).to.throw("No data specified");
    done();
  });

  it('should throw if no startDate passed', done => {
    const data = {
      foodSeriesPath: "caloriesIn",
    };

    expect(() => UrlFactory.foodTimeSeries(data)).to.throw("Start date is required");
    done();
  });

  it('should throw if no foodSeriesPath passed', done => {
    const data = {
      startDate: Date.now(),
    };
    expect(() => UrlFactory.foodTimeSeries(data)).to.throw("Resource is required");
    done();
  });

  it('should throw if neither end date nor period specified', done => {
    const data = {
      startDate: Date.now(),
      foodSeriesPath: "Weight",
    };
    expect(() => UrlFactory.foodTimeSeries(data)).to.throw("Bad input combination");
    done();
  });

  it('should throw if both end date and period specified', done => {
    const data = {
      startDate: Date.now(),
      foodSeriesPath: "Weight",
      endDate: Date.now(),
      period: "7d"
    };
    expect(() => UrlFactory.foodTimeSeries(data)).to.throw("Bad input combination");
    done();
  });

  it('should provide correct url if endDate specified', done => {
    const data = {
      startDate: 1617358664933,
      foodSeriesPath: "caloriesIn",
      endDate: 1617445064933
    };

    expect(UrlFactory.foodTimeSeries(data)).to.equal("https://api.fitbit.com/1/user/-/foods/log/caloriesIn/date/2021-04-02/2021-04-03.json");

    done();
  });

  it('should provide correct url if period specified', done => {
    const data = {
      startDate: 1617358664933,
      foodSeriesPath: "water",
      period: "7d"
    };

    expect(UrlFactory.foodTimeSeries(data)).to.equal("https://api.fitbit.com/1/user/-/foods/log/water/date/2021-04-02/7d.json");

    done();
  });

});
