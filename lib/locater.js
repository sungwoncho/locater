/**
 * Returns an array of objects containing information of the occurence of the
 * target in the line.
 *
 * If there is no match, returns an empty array.
 * @param target {String | RegExp} - the string or regex to match
 * @param line {String} - the string to match against
 * @return {Array} - array of objects containing index of the match, and
 *         the exact match if target is a RegExp
 */
function findMatches(target, line) {
  var matches = [];

  if (typeof target === 'string') {
    var index = 0;
    var offset = 0;

    while ((index = line.indexOf(target, offset)) !== -1) {
      matches.push({index: index});
      offset = index + 1;
    }
  } else if (target instanceof RegExp) {
    while ((match =  target.exec(line)) !== null) {
      target.lastIndex = match.index + 1;

      matches.push({index: match.index, match: match[0]});
    }
  }

  return matches;
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
    var indexDelta = precedingSourceLines[i].length;

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
 * Converts sting to lines based on \n.
 * @param source {String} - the string split
 */
function splitIntoLines(source) {
  var sourceLines =  source.split('\n');

  for (var i = 0; i < sourceLines.length; i++) {
    sourceLines[i] = sourceLines[i] + "\n";
  }

  return sourceLines;
}

module.exports = {
  find: function (target, source, options) {
    // Default argument for options
    if (!options) {
      options = {
        getGlobalIndices: false,
        getMatches: false
      };
    }

    var sourceLines = splitIntoLines( removeLastLineBreaks(source) );
    var results = [];

    if (!(target instanceof Array)) {
        target = [target]; //convert all targets to array
    }

    sourceLines.forEach(function (line, lineIdx) {
      target.forEach(function(targetElm) {
        var matches = findMatches(targetElm, line, options);

        matches.forEach(function (match) {
          var position = { line: lineIdx + 1, cursor: match.index + 1 };

          if (options.getGlobalIndices) {
            position.globalIndex = getGlobalIndex(sourceLines, lineIdx, match.index);
          }
          if (options.getMatches) {
            position.match = match.match;
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
