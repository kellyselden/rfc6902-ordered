'use strict';

function addToObjectAtIndex(obj, key, value, index) {
  let result = {};
  let keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    if (i === index) {
      result[key] = value;
    }

    let k = keys[i];
    result[k] = obj[k];
  }

  if (index === keys.length) {
    result[key] = value;
  }

  // mutate the original object because it we like that
  // it is already linked somewhere in the package.json tree
  for (let key in obj) {
    delete obj[key];
  }
  for (let key in result) {
    obj[key] = result[key];
  }
}

function get(obj, parts) {
  return parts.reduce((total, next) => {
    return total[next];
  }, obj);
}

module.exports = function applyPatch(myPackageJson, patch, toPackageJson) {
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

  return patch;
};
