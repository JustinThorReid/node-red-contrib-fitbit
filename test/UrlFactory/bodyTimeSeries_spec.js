'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.bodyTimeSeries', () => {

  it('should throw if no argument passed', done => {
    expect(() => UrlFactory.bodyTimeSeries()).to.throw("No data specified");
    done();
  });

  it('should throw if no startDate passed', done => {
    const data = {
      bodySeriesPath: "BMI",
    };

    expect(() => UrlFactory.bodyTimeSeries(data)).to.throw("Start date is required");
    done();
  });

  it('should throw if no bodySeriesPath passed', done => {
    const data = {
      startDate: Date.now(),
    };
    expect(() => UrlFactory.bodyTimeSeries(data)).to.throw("Resource is required");
    done();
  });

  it('should throw if neither end date nor period specified', done => {
    const data = {
      startDate: Date.now(),
      bodySeriesPath: "Weight",
    };
    expect(() => UrlFactory.bodyTimeSeries(data)).to.throw("Bad input combination");
    done();
  });

  it('should throw if both end date and period specified', done => {
    const data = {
      startDate: Date.now(),
      bodySeriesPath: "Weight",
      endDate: Date.now(),
      period: "7d"
    };
    expect(() => UrlFactory.bodyTimeSeries(data)).to.throw("Bad input combination");
    done();
  });

  it('should provide correct url if endDate specified', done => {
    const data = {
      startDate: 1617358664933,
      bodySeriesPath: "Weight",
      endDate: 1617445064933
    };

    expect(UrlFactory.bodyTimeSeries(data)).to.equal("https://api.fitbit.com/1/user/-/body/Weight/date/2021-04-02/2021-04-03.json");

    done();
  });

  it('should provide correct url if period specified', done => {
    const data = {
      startDate: 1617358664933,
      bodySeriesPath: "Weight",
      period: "7d"
    };

    expect(UrlFactory.bodyTimeSeries(data)).to.equal("https://api.fitbit.com/1/user/-/body/Weight/date/2021-04-02/7d.json");

    done();
  });


});
