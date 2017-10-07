'use strict';

const debug = require('debug')('rfc6902-ordered');
const addToObjectAtIndex = require('./add-to-object-at-index');

function finder(indexInTo, toKeys, myKeys) {
  return function find(direction) {
    for (
      let toIndex = indexInTo + (direction ? 1 : -1);
      toIndex >= 0 && toIndex < toKeys.length;
      toIndex += direction ? 1 : -1
    ) {
      let referenceKey = toKeys[toIndex];

      let myIndex = myKeys.indexOf(referenceKey);
      if (myIndex !== -1) {
        return myIndex + (direction ? 0 : 1);
      }
    }

    return -1;
  };
}

function matchMovedKeys(myPackageJson, fromPackageJson, toPackageJson) {
  let myKeys = Object.keys(myPackageJson);
  let fromKeys = Object.keys(fromPackageJson);
  let toKeys = Object.keys(toPackageJson);

  for (let i = 0; i < toKeys.length; i++) {
    let key = toKeys[i];
    let indexInMy = myKeys.indexOf(key);
    let indexInFrom = fromKeys.indexOf(key);
    let indexInTo = toKeys.indexOf(key);

    if (indexInMy === -1) {
      continue;
    }
    if (indexInFrom === -1) {
      continue;
    }

    let myKey = myPackageJson[key];
    let fromKey = fromPackageJson[key];
    let toKey = toPackageJson[key];

    if (![myKey, fromKey, toKey].filter(key => typeof key !== 'object').length) {
      matchMovedKeys(myKey, fromKey, toKey);
    }

    if (indexInFrom === indexInTo) {
      continue;
    }

    let value = myPackageJson[key];

    delete myPackageJson[key];

    myKeys = Object.keys(myPackageJson);

    let find = finder(indexInTo, toKeys, myKeys);

    let newIndex = find(false);
    if (newIndex === -1) {
      newIndex = find(true);
    }
    if (newIndex === -1) {
      debug(`"${key}": no reference key for ordering was found`);
      newIndex = myKeys.length;
    }

    addToObjectAtIndex(myPackageJson, key, value, newIndex);
  }
}

module.exports = matchMovedKeys;
