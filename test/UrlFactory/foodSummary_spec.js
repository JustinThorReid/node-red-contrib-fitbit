'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.foodSummary', () => {

  it('should throw if no argument passed', done => {
    expect(() => UrlFactory.foodSummary()).to.throw("No data specified");
    done();
  });

  it('should throw if no startDate specified', done => {
    expect(() => UrlFactory.foodSummary({})).to.throw("Start date is required");
    done();
  });

  it('should provide correct url if start date specified', done => {
    const data = {
      startDate: 1517445064933
    };

    expect(UrlFactory.foodSummary(data)).to.equal("https://api.fitbit.com/1/user/-/foods/log/date//2018-02-01.json");

    done();
  });

});
