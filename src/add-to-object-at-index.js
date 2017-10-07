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

module.exports = addToObjectAtIndex;
