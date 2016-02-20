var expect = require('chai').expect;
var fs = require('fs');
var locater = require('../lib/locater');

describe("locater", function() {
  describe(".find", function() {
    it("matches array of strings and returns locations of results", function() {
      var input = fs.readFileSync(
        './test/fixtures/sample_input.txt', {encoding: 'utf8'});

      var result = locater.find(['my', 'me'], input);

      expect(result[0].line).to.equal(1);
      expect(result[0].cursor).to.equal(4);
      expect(result[1].line).to.equal(2);
      expect(result[1].cursor).to.equal(1);
      expect(result[2].line).to.equal(2);
      expect(result[2].cursor).to.equal(16);
      expect(result[3].line).to.equal(3);
      expect(result[3].cursor).to.equal(27);
    });

    it("matches array of regexes and returns locations of results", function() {
      var input = "Bacon tastes gooood.\nPork chops taste gooood.";
      var result = locater.find([/[a-zA-Z]{6}\./g, /Pork/g], input);

      expect(result[0].line).to.equal(1);
      expect(result[0].cursor).to.equal(14);
      expect(result[1].line).to.equal(2);
      expect(result[1].cursor).to.equal(18);
      expect(result[2].line).to.equal(2);
      expect(result[2].cursor).to.equal(1);
    });

    it("matches array of regexes and strings, and returns locations of results", function() {
      var input = "Bacon tastes gooood.\nPork chops taste gooood.";
      var result = locater.find([/[a-zA-Z]{6}\./g, 'Pork'], input);

      expect(result[0].line).to.equal(1);
      expect(result[0].cursor).to.equal(14);
      expect(result[1].line).to.equal(2);
      expect(result[1].cursor).to.equal(18);
      expect(result[2].line).to.equal(2);
      expect(result[2].cursor).to.equal(1);
    });

    it("matches string and returns locations of results", function() {
      var input = fs.readFileSync(
        './test/fixtures/sample_input.txt', {encoding: 'utf8'});
      var result = locater.find('my', input);

      expect(result[0].line).to.equal(1);
      expect(result[0].cursor).to.equal(4);
      expect(result[1].line).to.equal(2);
      expect(result[1].cursor).to.equal(1);
      expect(result[2].line).to.equal(3);
      expect(result[2].cursor).to.equal(27);
    });

    it("does not return global indices if no option is specified", function() {
      var input = 'Bacon tastes gooood.\nPork chops taste gooood.';
      var result = locater.find('gooood', input);

      expect(result[0].line).to.equal(1);
      expect(result[0].cursor).to.equal(14);
      expect(result[0].globalIndex).to.be.an('undefined');
      expect(result[1].line).to.equal(2);
      expect(result[1].cursor).to.equal(18);
      expect(result[1].globalIndex).to.be.an('undefined');
    });

    it("also returns indices if getGlobalIndices option is set", function() {
      var input = 'Bacon tastes gooood.\nPork chops taste gooood.';
      var result = locater.find('gooood', input, {getGlobalIndices: true});

      expect(result[0].line).to.equal(1);
      expect(result[0].cursor).to.equal(14);
      expect(result[0].globalIndex).to.equal(13);
      expect(result[1].line).to.equal(2);
      expect(result[1].cursor).to.equal(18);
      expect(result[1].globalIndex).to.equal(38);
    });

    it("matches regex and returns locations of results", function() {
      var input = fs.readFileSync(
        './test/fixtures/sample_input.txt', {encoding: 'utf8'});

      var result = locater.find(/[a-zA-Z]{7}\s/g, input);

      expect(result[0].line).to.equal(1);
      expect(result[0].cursor).to.equal(7);
      expect(result[1].line).to.equal(1);
      expect(result[1].cursor).to.equal(27);
      expect(result[2].line).to.equal(3);
      expect(result[2].cursor).to.equal(11);
    });

    it("can match more than once for the same line", function() {
      var input = "What ain't no country I've ever heard of. They speak English in What?";
      var result = locater.find('What', input);

      expect(result[0].line).to.equal(1);
      expect(result[0].cursor).to.equal(1);
      expect(result[1].line).to.equal(1);
      expect(result[1].cursor).to.equal(65);
    });

    it("returns an empty array when no match is present", function() {
      var result = locater.find('What', "Zed's dead, baby. Zed's dead.");
      expect(result).to.have.length(0);
    });

    it("matches multiple occurences of a string in a line", function() {
      var result = locater.find('my', 'my mind my soul');
      expect(result[0].line).to.equal(1);
      expect(result[0].cursor).to.equal(1);
      expect(result[1].line).to.equal(1);
      expect(result[1].cursor).to.equal(9);
    });

    it("matches multiple occurences of a regex in a line", function() {
      var result = locater.find(/[a-zA-Z]{6}/g, 'kaskade - 4AM');
      expect(result.length).to.equal(2);
    });
  });

  describe(".findOne", function() {
    it("returns the position of the first match against string", function() {
      var result = locater.findOne('world', "this is\nhello world");
      expect(result).to.be.an('object');
      expect(result.line).to.equal(2);
      expect(result.cursor).to.equal(7);
    });

    it("returns null if there is no match against string", function() {
      var result = locater.findOne('truck', "this is\nhello world");
      expect(result).to.equal(null);
    });

    it("returns the position of the first match against regex", function() {
      var result = locater.findOne(/\d{3}/, "this is\nexample 123 world");
      expect(result).to.be.an('object');
      expect(result.line).to.equal(2);
      expect(result.cursor).to.equal(9);
    });

    it("returns null if there is no match against regex", function() {
      var result = locater.findOne(/\d{3}/, "this is\nexample world");
      expect(result).to.equal(null);
    });
  });

  describe(".any", function() {
    it("returns true if there is at least one match with string", function() {
      var result = locater.any('hello', 'hello world');
      expect(result).to.equal(true);
    });

    it("returns false if there is no match with string", function() {
      var result = locater.any('foo', 'Say what again');
      expect(result).to.equal(false);
    });

    it("returns true if there is at least one match with regex", function() {
      var result = locater.any(/[a-z]{5}/g, 'hello world');
      expect(result).to.equal(true);
    });

    it("returns false if there is no match with regex", function() {
      var result = locater.any(/\d+/g, 'hello world');
      expect(result).to.equal(false);
    });
  });
});
