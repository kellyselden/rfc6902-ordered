# rfc6902-ordered

[![npm version](https://badge.fury.io/js/rfc6902-ordered.svg)](https://badge.fury.io/js/rfc6902-ordered)

https://github.com/chbrown/rfc6902 plus object key ordering

Motivated by https://github.com/chbrown/rfc6902/issues/22

The same as https://github.com/chbrown/rfc6902, except `applyPatch` can take an optional third parameter. It can use the `output` param of `createPatch` to preserve object key order on the object you're patching.

```js
const rfc6902 = require('rfc6902-ordered');

let source = {
  key1: 1,
  key2: 2
};

let theirs = {
  key1: 1,
  key3: 3,
  key2: 2
};

let patch = rfc6902.createPatch(source, theirs);

// patch => [
//   { op: 'add', path: '/key3', value: 3 }
// ]

let ours = {
  key1: 1,
  key2: 2,
  key4: 4
};

rfc6902.applyPatch(ours, patch, source, theirs);

// ours => {
//   key1: 1,
//   key3: 3,
//   key2: 2,
//   key4: 4
// }
```
