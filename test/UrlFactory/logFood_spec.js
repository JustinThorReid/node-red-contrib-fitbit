'use strict';

const expect = require('chai').expect;
const UrlFactory = require("../../UrlFactory");

describe('UrlFactory.logFood', () => {

  it('should throw if no argument passed', done => {
    expect(() => UrlFactory.logFood()).to.throw("No data specified");
    done();
  });

  it('should throw if empty data passed', done => {
    expect(() => UrlFactory.logFood({})).to.throw("Food ID is required.");
    done();
  });

  it('should throw without foodId', done => {
    const data = {
      manualCalories: 444,
      startDate: 1617358664933,
      unitId: 304,
      // foodId: 23636884,
      mealTypeId: 7
    };

    expect(() => UrlFactory.logFood(data)).to.throw("Food ID is required.");
    done();
  });

  it('should throw without calories', done => {
    const data = {
      // manualCalories: 444,
      startDate: 1617358664933,
      unitId: 304,
      foodId: 23636884,
      mealTypeId: 7
    };

    expect(() => UrlFactory.logFood(data)).to.throw("Calories is required.");
    done();
  });

  it('should throw without date', done => {
    const data = {
      manualCalories: 444,
      // startDate: 1617358664933,
      unitId: 304,
      foodId: 23636884,
      mealTypeId: 7
    };

    expect(() => UrlFactory.logFood(data)).to.throw("Start date is required.");
    done();
  });

  it('should throw without unitId', done => {
    const data = {
      manualCalories: 444,
      startDate: 1617358664933,
      // unitId: 304,
      foodId: 23636884,
      mealTypeId: 7
    };

    expect(() => UrlFactory.logFood(data)).to.throw("Unit ID is required.");
    done();
  });

  it('should throw without mealTypeId', done => {
    const data = {
      manualCalories: 444,
      startDate: 1617358664933,
      unitId: 304,
      foodId: 23636884,
      // mealTypeId: 7
    };

    expect(() => UrlFactory.logFood(data)).to.throw("Meal Type Id is required.");
    done();
  });




  it('should provide correct url', done => {
    const data = {
      manualCalories: 444,
      startDate: 1617358664933,
      unitId: 304,
      foodId: 23636884,
      mealTypeId: 7
    };
    expect(UrlFactory.logFood(data)).to.equal("https://api.fitbit.com/1/user/-/foods/log.json?foodId=23636884&amount=444&date=2021-04-02&mealTypeId=7&unitId=304");
    done();
  });

});
