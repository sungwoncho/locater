/**
 * Returns an array of indices of the occurence of the target in the line.
 * If there is no match, returns an empty array.
 * @param target {String | RegExp} - the string or regex to match
 * @param line {String} - the string to match against
 */
function findIndices(target, line) {
  var indices = [];

  if (typeof target === 'string') {
    var index = 0;
    var offset = 0;

    while ((index = line.indexOf(target, offset)) !== -1) {
      indices.push(index);
      offset = index + 1;
    }
  } else if (target instanceof RegExp) {
    while ((match =  target.exec(line)) !== null) {
      target.lastIndex = match.index + 1;
      indices.push(match.index);
    }
  }

  return indices;
}

module.exports = {
  find: function (target, source) {
    var sourceLines = source.split('\n');
    var lineNumber = 1;
    var results = [];

    sourceLines.forEach(function (line, idx) {
      // Do not count the last line that is empty
      if (idx === sourceLines.length - 1 && ! line) {
        return;
      }

      var indices = findIndices(target, line);

      indices.forEach(function (index) {
        var position = {line: lineNumber, cursor: index + 1};

        results.push(position);
      });

      lineNumber++;
    });

    return results;
  },

  findOne: function (target, source) {
    var sourceLines = source.split('\n');
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
