'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.bodyFatLog', () => {

  it('should throw if no argument passed', done => {
    expect(() => UrlFactory.bodyFatLog()).to.throw("No data specified");
    done();
  });

  it('should throw if no startDate passed', done => {
    const data = {
    };

    expect(() => UrlFactory.bodyFatLog(data)).to.throw("Start date is required");
    done();
  });

  it('should throw if both end date and period specified', done => {
    const data = {
      startDate: Date.now(),
      endDate: Date.now(),
      period: "7d"
    };
    expect(() => UrlFactory.bodyFatLog(data)).to.throw("Bad input combination");
    done();
  });

  it('should provide correct url if neither period nor endDate specified', done => {
    const data = {
      startDate: 1617358664933,
    };

    expect(UrlFactory.bodyFatLog(data)).to.equal("https://api.fitbit.com/1/user/-/body/log/fat/date/2021-04-02.json");

    done();
  });

  it('should provide correct url if correct period specified', done => {
    const makeData = period => {
      return {
        startDate: 1617358664933,
        bodySeriesPath: "Weight",
        period: period
      }
    };

    expect(UrlFactory.bodyFatLog(makeData("1d"))).to.equal("https://api.fitbit.com/1/user/-/body/log/fat/date/2021-04-02/1d.json");
    expect(UrlFactory.bodyFatLog(makeData("7d"))).to.equal("https://api.fitbit.com/1/user/-/body/log/fat/date/2021-04-02/7d.json");
    expect(UrlFactory.bodyFatLog(makeData("1w"))).to.equal("https://api.fitbit.com/1/user/-/body/log/fat/date/2021-04-02/1w.json");
    expect(UrlFactory.bodyFatLog(makeData("1m"))).to.equal("https://api.fitbit.com/1/user/-/body/log/fat/date/2021-04-02/1m.json");

    done();
  });

  it('should throw if incorrect period specified', done => {
    const makeData = period => {
      return {
        startDate: 1617358664933,
        bodySeriesPath: "Weight",
        period: period
      }
    };

    expect(() => UrlFactory.bodyFatLog(makeData("1"))).to.throw("Invalid period");
    expect(() => UrlFactory.bodyFatLog(makeData("7"))).to.throw("Invalid period");

    expect(() => UrlFactory.bodyFatLog(makeData("2d"))).to.throw("Invalid period");
    expect(() => UrlFactory.bodyFatLog(makeData("3d"))).to.throw("Invalid period");
    expect(() => UrlFactory.bodyFatLog(makeData("5w"))).to.throw("Invalid period");
    expect(() => UrlFactory.bodyFatLog(makeData("2m"))).to.throw("Invalid period");

    done();
  });

  it('should provide correct url if end date specified', done => {
    const data = {
        startDate: 1617358664933,
        bodySeriesPath: "Weight",
        endDate: 1617445064933
    };

    expect(UrlFactory.bodyFatLog(data)).to.equal("https://api.fitbit.com/1/user/-/body/log/fat/date/2021-04-02/2021-04-03.json");

    done();
  });

});
