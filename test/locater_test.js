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

    var result = locater(/[a-zA-Z]{7}\s/g, input);

    expect(result[0].line).to.equal(1);
    expect(result[0].cursor).to.equal(7);
    expect(result[1].line).to.equal(1);
    expect(result[1].cursor).to.equal(27);
    expect(result[2].line).to.equal(3);
    expect(result[2].cursor).to.equal(11);
  });

  it("can match more than once for the same line", function() {
    var input = "What ain't no country I've ever heard of. They speak English in What?";
    var result = locater('What', input);

    expect(result[0].line).to.equal(1);
    expect(result[0].cursor).to.equal(1);
    expect(result[1].line).to.equal(1);
    expect(result[1].cursor).to.equal(65);
  });

  it("returns an empty array when no match is present", function() {
    var result = locater('What', "Zed's dead, baby. Zed's dead.");
    expect(result).to.have.length(0);
  });

  it("matches multiple occurences of a string in a line", function() {
    var result = locater('my', 'my mind my soul');
    expect(result[0].line).to.equal(1);
    expect(result[0].cursor).to.equal(1);
    expect(result[1].line).to.equal(1);
    expect(result[1].cursor).to.equal(9);
  });

  it("matches multiple occurences of a regex in a line", function() {
    var result = locater(/[a-zA-Z]{6}/g, 'kaskade - 4AM');
    expect(result.length).to.equal(2);
  });
});
