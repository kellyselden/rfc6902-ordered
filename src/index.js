'use strict';

const rfc6902 = require('rfc6902');
const addToObjectAtIndex = require('./add-to-object-at-index');
const matchMovedKeys = require('./match-moved-keys');

const {
  applyPatch: _applyPatch
} = rfc6902;

function get(obj, parts) {
  return parts.reduce((total, next) => {
    if (isPrototypePolluted(next))
      return {}
    return total[next];
  }, obj);
}

function applyPatch(myPackageJson, patch, fromPackageJson, toPackageJson) {
  if (arguments.length > 2) {
    patch = patch.slice();

    for (let patchIndex = 0; patchIndex < patch.length; patchIndex++) {
      let op = patch[patchIndex];
      if (op.op !== 'add') {
        continue;
      }

      let parts = op.path.substr(1).split('/');
      let addKey = parts.pop();
      let toObj = get(toPackageJson, parts);
      let myObj = get(myPackageJson, parts);

      if (!myObj || Array.isArray(myObj)) {
        continue;
      }

      let toKeys = Object.keys(toObj);
      let myKeys = Object.keys(myObj);

      let indexInTo = toKeys.indexOf(addKey);
      let indexInMy = myKeys.indexOf(addKey);

      if (indexInMy !== -1) {
        continue;
      }

      // we should probably add a search threshold here
      // so we don't match keys really far away

      // search subsequent keys for match
      for (let _indexInTo = indexInTo + 1; indexInMy === -1 && _indexInTo < toKeys.length; _indexInTo++) {
        let nextKey = toKeys[_indexInTo];
        indexInMy = myKeys.indexOf(nextKey);
      }

      // search preceding keys for match
      for (let _indexInTo = indexInTo - 1; indexInMy === -1 && _indexInTo >= 0; _indexInTo--) {
        let prevKey = toKeys[_indexInTo];
        indexInMy = myKeys.indexOf(prevKey);
        if (indexInMy !== -1) {
          indexInMy++;
        }
      }

      if (indexInMy === -1) {
        // default to last entry
        indexInMy = myKeys.length;
      }

      addToObjectAtIndex(myObj, addKey, toObj[addKey], indexInMy);

      if (parts.length) {
        let key = parts.pop();
        get(myPackageJson, parts)[key] = myObj;
      } else {
        myPackageJson = myObj;
      }

      patch.splice(patchIndex, 1);
      patchIndex--;
    }
  }

  let returnValue = _applyPatch.call(this, myPackageJson, patch);

  matchMovedKeys(myPackageJson, fromPackageJson, toPackageJson);

  return returnValue;
}

function isPrototypePolluted(key) {
  return ['__proto__', 'constructor', 'prototype'].includes(key);
}

module.exports = rfc6902;
module.exports.applyPatch = applyPatch;
