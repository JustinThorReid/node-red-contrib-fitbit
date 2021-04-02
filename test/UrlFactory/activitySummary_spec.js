'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.activitySummary', () => {

  it('should throw if no argument passed', done => {
    expect(() => UrlFactory.activitySummary()).to.throw("No data specified");
    done();
  });

  it('should throw if no startDate specified', done => {
    expect(() => UrlFactory.activitySummary({})).to.throw("Start date is required");
    done();
  });

  it('should provide correct url if start date specified', done => {
    const data = {
      startDate: 1517445064933
    };

    expect(UrlFactory.activitySummary(data)).to.equal("https://api.fitbit.com/1/user/-/activities/date//2018-02-01.json");

    done();
  });

});
