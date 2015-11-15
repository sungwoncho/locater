var expect = require('chai').expect;
var fs = require('fs');
var locater = require('../lib/locater');

describe("locater", function() {
  it("matches string and returns locations of results", function() {
    var input = fs.readFileSync(
      './test/fixtures/sample_input.txt', {encoding: 'utf8'});

    var result = locater('my', input);

    expect(result[0].line).to.equal(1);
    expect(result[0].cursor).to.equal(4);
    expect(result[1].line).to.equal(2);
    expect(result[1].cursor).to.equal(1);
    expect(result[2].line).to.equal(3);
    expect(result[2].cursor).to.equal(27);
  });

  it("matches regex and returns locations of results", function() {
    var input = fs.readFileSync(
      './test/fixtures/sample_input.txt', {encoding: 'utf8'});

    var result = locater(/[a-zA-Z]{7}/, input);

    expect(result[0].line).to.equal(1);
    expect(result[0].cursor).to.equal(7);
    expect(result[1].line).to.equal(3);
    expect(result[1].cursor).to.equal(11);
  });
});
