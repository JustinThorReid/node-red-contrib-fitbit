'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.sleepLog', () => {

  it('should throw if no argument passed', done => {
    expect(() => UrlFactory.sleepLog()).to.throw("No data specified");
    done();
  });

  it('should throw if no startDate specified', done => {
    expect(() => UrlFactory.sleepLog({})).to.throw("Start date is required");
    done();
  });

  it('should provide correct url if start date specified', done => {
    const data = {
      startDate: 1517445064933
    };

    expect(UrlFactory.sleepLog(data)).to.equal("https://api.fitbit.com/1/user/-/sleep/date/2018-02-01.json");

    done();
  });

});
