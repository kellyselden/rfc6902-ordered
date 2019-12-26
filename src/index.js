'use strict';

const rfc6902 = require('rfc6902');
const addToObjectAtIndex = require('./add-to-object-at-index');
const matchMovedKeys = require('./match-moved-keys');

const {
  applyPatch: _applyPatch
} = rfc6902;

function get(obj, parts) {
  return parts.reduce((total, next) => {
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

      let indexInMy = -1;

      // we should probably add a search threshold here
      // so we don't match keys really far away

      // search subsequent keys for match
      for (let _indexInTo = indexInTo + 1; _indexInTo < toKeys.length; _indexInTo++) {
        let nextKey = toKeys[_indexInTo];
        let _indexInMy = myKeys.indexOf(nextKey);
        if (_indexInMy !== -1) {
          indexInMy = _indexInMy;
          break;
        }
      }

      if (indexInMy === -1) {
        // search preceding keys for match
        for (let _indexInTo = indexInTo - 1; _indexInTo >= 0; _indexInTo--) {
          let prevKey = toKeys[_indexInTo];
          let _indexInMy = myKeys.indexOf(prevKey);
          if (_indexInMy !== -1) {
            indexInMy = _indexInMy + 1;
            break;
          }
        }

        if (indexInMy === -1) {
          // default to last entry
          indexInMy = myKeys.length;
        }
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

  matchMovedKeys(myPackageJson, fromPackageJson, toPackageJson);

  matchMovedKeys(myPackageJson, fromPackageJson, toPackageJson);

  let returnValue = _applyPatch.call(this, myPackageJson, patch);

  return returnValue;
}

module.exports = rfc6902;
module.exports.applyPatch = applyPatch;
