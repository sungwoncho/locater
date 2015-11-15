/**
 * Finds the index of the occurence of the target in the given string.
 * Always returns -1 if there is no match.
 * @param target {String | RegExp} - the string or regex to match
 * @param line {String} - the string to match against
 */
function findIndex(target, line) {
  if (typeof target === 'string') {
    return line.indexOf(target);
  } else if (target instanceof RegExp) {
    var match = target.exec(line);

    if (match) {
      return match.index;
    } else {
      return -1;
    }
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

    var index = findIndex(target, line);
    if (index !== -1) {
      var position = {line: lineNumber, cursor: index + 1};

      results.push(position);
    }

    lineNumber++;
  });

  return results;
};
