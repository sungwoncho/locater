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

    return indices;
  } else if (target instanceof RegExp) {
    while ((match =  target.exec(line)) !== null) {
      indices.push(match.index);
    }

    return indices;
  }
}

module.exports = function (target, source) {
  var sourceLines = source.split('\n');
  var lineNumber = 1;
  var results = [];

  sourceLines.forEach(function (line, idx) {
    // Do not count the last line that is empty
    if (idx === sourceLines.length - 1 && ! line) {
      return;
    }

    var indices = findIndices(target, line);

    if (indices.length > 0) {
      indices.forEach(function (index) {
        var position = {line: lineNumber, cursor: index + 1};

        results.push(position);
      });
    }

    lineNumber++;
  });

  return results;
};
