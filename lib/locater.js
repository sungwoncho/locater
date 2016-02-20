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
 * Get the index of the match in the context of the whole input
 * @param sourceLines {Array} - the original input split into array by newline
 * @param lineIndex {String} - the index of the element in sourceLines in which
 *        the match lies
 * @param index {Number} - index in the line on which the match occurs.
 * @return {Number} - index of the match in the whole input
 */
function getGlobalIndex(sourceLines, lineIndex, index) {
  var cumulativeIndex = 0;
  var precedingSourceLines = sourceLines.slice(0, lineIndex);

  if (! precedingSourceLines) {
    return index;
  }

  for (var i = 0; i < precedingSourceLines.length; i++) {
    var lineLength = precedingSourceLines[i].length;
    var indexDelta = lineLength + 1; // add 1 to account for linebreak

    cumulativeIndex += indexDelta;
  }

  return cumulativeIndex + index;
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
  find: function (target, source, options) {
    // Default argument for options
    if (!options) {
      options = {
        getGlobalIndices: false
      };
    }

    var sourceLines = splitIntoLines( removeLastLineBreaks(source) );
    var results = [];

    if (!(target instanceof Array)) {
        target = [target]; //convert all targets to array
    }

    sourceLines.forEach(function (line, lineIdx) {
      target.forEach(function(currentValue) {
        var indices = findIndices(currentValue, line);

        indices.forEach(function (index) {
          var position = { line: lineIdx + 1, cursor: index + 1 };

          if (options.getGlobalIndices) {
            position.globalIndex = getGlobalIndex(sourceLines, lineIdx, index);
          }
          results.push(position);
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
