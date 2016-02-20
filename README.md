# Locater

[![Build Status](https://travis-ci.org/sungwoncho/locater.svg?branch=master)](https://travis-ci.org/sungwoncho/locater)

Find line number and cursor of string or Regex in a multi-line input

## Install

    npm install locater

## Usage

Below is an example of how locater may be used.

*input.txt*
```txt
In my younger and more vulnerable years
my father gave me some advice that
I've been turning over in my mind ever since.
```

*js*
```js
var locater = require('locater');
var input = fs.readFileSync('./input.txt', {encoding: 'utf8'});

locater.find('my', input);
// => [{ line: 1, cursor: 4 }, { line: 2, cursor: 1 }, { line: 3, cursor: 27 }]

locater.find(['my', 'some'], input);
// => [ { line: 1, cursor: 4 }, { line: 2, cursor: 1 }, { line: 2, cursor: 19 },
//      { line: 3, cursor: 27 } ]

locater.find(/[a-zA-Z]{7}\s/g, input);
// => [{ line: 1, cursor: 7 }, { line: 1, cursor: 27 }, { line: 3, cursor: 11 }]

locater.find([/[a-zA-Z]{7}\s/g, /my/g], input);
// => [ { line: 1, cursor: 7 }, { line: 1, cursor: 27 }, { line: 1, cursor: 4 },
//      { line: 2, cursor: 1 }, { line: 3, cursor: 11 }, { line: 3, cursor: 27 } ]

locater.find([/[a-zA-Z]{7}\s/g, 'me'], input);
//=> [ { line: 1, cursor: 7 }, { line: 1, cursor: 27 }, { line: 2, cursor: 16 },
//     { line: 3, cursor: 11 } ]

locater.findOne('my', input);
// => { line: 1, cursor: 4 }

locater.findOne('shiny unicorn', input);
// => null

locater.any('mind', input);
// => true
```

## API

### find(pattern, input, [options])

Returns an array of positions of occurrences of `pattern` in `input`. A position
is represented by an object with keys `line` and `cursor`. If there is no match,
locater returns an empty array.

`pattern` can be either String, Regex or an Array.

An array can have a combination of String and Regex as its elements. For instance,
you can provide `[/[a-zA-Z]{5}/g, 'foo']` as an argument. Any Regex should be
declared as **global**.

`options` is an optional. Default value is as follows:

```js
{
  getGlobalIndices: false,
  getMatches: false
}
```

* `getGlobalIndices`: return a global index of the match in the position object.
The global index is the index of the match in the context of the whole input.

* `getMatches`: return exact matches for the regexes in the position object.

e.g.

```js
locater.find('gooood', 'Bacon tastes gooood.\nPork chops taste gooood.', {
  getGlobalIndices: true
});
// => [ { line: 1, cursor: 14, globalIndex: 13 },
//      { line: 2, cursor: 18, globalIndex: 38 } ]
```

```js
locater.find(/[a-zA-Z]{6}\./g, input, {getMatches: true});
// => [ { line: 1, cursor: 14, match: 'gooood.' },
//      { line: 2, cursor: 18, match: 'gooood.' } ]
```


### findOne(pattern, input)

Returns the position of the first occurrence of `pattern` in `input`.

More efficient than `find` if you are interested in the first occurrence only.

### any(pattern, input)

Checks if there is any occurrence of `pattern` in `input`. Returns `true` if
there is a match, and `false` otherwise.

## Contributing

Run `npm test` to run tests.

Feel free to open issues with bugs and feature requests. If you submit a PR with
a new feature, please write a simple test.

## License

MIT
