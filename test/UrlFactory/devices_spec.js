'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.devices', () => {

  it('should provide correct url ', done => {
    expect(UrlFactory.devices()).to.equal("https://api.fitbit.com/1/user/-/devices.json");

    done();
  });

});
