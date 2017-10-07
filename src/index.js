'use strict';

const rfc6902 = require('rfc6902');
const addToObjectAtIndex = require('./add-to-object-at-index');

const _applyPatch = rfc6902.applyPatch;

function get(obj, parts) {
  return parts.reduce((total, next) => {
    return total[next];
  }, obj);
}

function applyPatch(myPackageJson, patch, toPackageJson) {
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

      if (Array.isArray(myObj)) {
        continue;
      }

      let toKeys = Object.keys(toObj);
      let myKeys = Object.keys(myObj);

      let indexInTo = toKeys.indexOf(addKey);

      // default to last entry
      let indexInMy = myKeys.length;

      for (let _indexInTo = indexInTo + 1; _indexInTo < toKeys.length; _indexInTo++) {
        let nextKey = toKeys[_indexInTo];
        let _indexInMy = myKeys.indexOf(nextKey);
        if (_indexInMy !== -1) {
          indexInMy = _indexInMy;
          break;
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

  return _applyPatch.call(this, myPackageJson, patch);
}

module.exports = rfc6902;
module.exports.applyPatch = applyPatch;
