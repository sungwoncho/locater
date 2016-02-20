/**
 * Returns an array of indices of the occurence of the target in the line.
 * If there is no match, returns an empty array.
 * @param target {String | RegExp} - the string or regex to match
 * @param line {String} - the string to match against
 */
function findIndices(target, line) {
  var indices = [];

  //converts all targets to regex
  if (!(target instanceof RegExp)) {
    target = new RegExp('\\b' + target + '\\b', "g");
  }

  while ((match =  target.exec(line)) !== null) {
    target.lastIndex = match.index + 1;
    indices.push(match.index);
  }

  return indices;
}

/**
 * Removes the last line break from a string.
 * @param source {String} - the string to remove line break from
 */
function removeLastLineBreaks(source) {
  return source.replace(/[\n]+$/, '');
}

/**
 * Converts sting to lines based on \n. Also removes last line break
 * @param source {String} - the string split
 */
function splitIntoLines(source) {
  return source.split('\n');
}

module.exports = {
  find: function (target, source) {
    var sourceLines = splitIntoLines( removeLastLineBreaks(source) );
    var results = [];

    if (!(target instanceof Array)) {
        target = [target]; //convert all targets to array
    }

    sourceLines.forEach(function (line, lineIdx) {
      target.forEach(function(currentValue) {
        var indices = findIndices(currentValue, line);

        indices.forEach(function (index) {
          results.push( { line: lineIdx + 1, cursor: index + 1 } );
        });
      });
    });

    return results;
  },

  findOne: function (target, source) {
    var sourceLines = splitIntoLines( removeLastLineBreaks(source) );
    var position;

    if (typeof target === 'string') {
      for (var i = 0; i < sourceLines.length; i++) {
        var index = sourceLines[i].indexOf(target);
        if (index !== -1) {
          position = {line: i + 1, cursor: index + 1};
          return position;
        }
      }

      // if for-loop terminates without returning a position, there is no match
      return null;
    } else if (target instanceof RegExp) {
      for (var j = 0; j < sourceLines.length; j++) {
        var match = target.exec(sourceLines[j]);
        if (match) {
          position = {line: j + 1, cursor: match.index + 1};
          return position;
        }
      }

      return null;
    }
  },

  any: function (target, source) {
    if (typeof target === 'string') {
      var index = source.indexOf(target);

      if (index === -1) {
        return false;
      } else {
        return true;
      }
    } else if (target instanceof RegExp) {
      return target.test(source);
    }
  }
};
