'use strict';

const expect = require('chai').expect;
const applyPatch = require('../src').applyPatch;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

describe('Unit - applyPatch', function() {
  function test(myPackageJson, patch, toPackageJson, expected) {
    let patchClone = clone(patch);

    applyPatch(myPackageJson, patch, toPackageJson);

    expect(JSON.stringify(myPackageJson)).to.equal(JSON.stringify(expected));

    expect(patch, 'it does not mutate your patch').to.deep.equal(patchClone);
  }

  it('works in the beginning', function() {
    let myPackageJson = {
      test6: 1,
      test1: 1,
      test2: 1
    };
    let patch = [
      { op: 'add', path: '/test4', value: 1 }
    ];
    let toPackageJson = {
      test3: 1,
      test4: 1,
      test5: 1,
      test1: 1,
      test2: 1
    };
    let expected = {
      test6: 1,
      test4: 1,
      test1: 1,
      test2: 1
    };

    test(myPackageJson, patch, toPackageJson, expected);
  });

  it('works in the middle', function() {
    let myPackageJson = {
      test1: 1,
      test6: 1,
      test2: 1
    };
    let patch = [
      { op: 'add', path: '/test4', value: 1 }
    ];
    let toPackageJson = {
      test1: 1,
      test3: 1,
      test4: 1,
      test5: 1,
      test2: 1
    };
    let expected = {
      test1: 1,
      test6: 1,
      test4: 1,
      test2: 1
    };

    test(myPackageJson, patch, toPackageJson, expected);
  });

  it('works at the end', function() {
    let myPackageJson = {
      test1: 1,
      test2: 1,
      test6: 1
    };
    let patch = [
      { op: 'add', path: '/test4', value: 1 }
    ];
    let toPackageJson = {
      test1: 1,
      test2: 1,
      test3: 1,
      test4: 1,
      test5: 1
    };
    let expected = {
      test1: 1,
      test2: 1,
      test6: 1,
      test4: 1
    };

    test(myPackageJson, patch, toPackageJson, expected);
  });

  it('handles multiple patch', function() {
    let myPackageJson = {
      test1: 1,
      test6: 1,
      test2: 1,
      test10: 1,
      test0: 1
    };
    let patch = [
      { op: 'add', path: '/test4', value: 1 },
      { op: 'add', path: '/test8', value: 1 }
    ];
    let toPackageJson = {
      test1: 1,
      test3: 1,
      test4: 1,
      test5: 1,
      test2: 1,
      test7: 1,
      test8: 1,
      test9: 1,
      test0: 1
    };
    let expected = {
      test1: 1,
      test6: 1,
      test4: 1,
      test2: 1,
      test10: 1,
      test8: 1,
      test0: 1
    };

    test(myPackageJson, patch, toPackageJson, expected);
  });

  it('handles nested objects', function() {
    let myPackageJson = {
      test: {
        test1: 1,
        test6: 1,
        test2: 1
      }
    };
    let patch = [
      { op: 'add', path: '/test/test4', value: 1 }
    ];
    let toPackageJson = {
      test: {
        test1: 1,
        test3: 1,
        test4: 1,
        test5: 1,
        test2: 1
      }
    };
    let expected = {
      test: {
        test1: 1,
        test6: 1,
        test4: 1,
        test2: 1
      }
    };

    test(myPackageJson, patch, toPackageJson, expected);
  });

  it('performs upstream options as well', function() {
    let myPackageJson = {
      test1: 1,
      test2: [1]
    };
    let patch = [
      { op: 'add', path: '/test2/-', value: 2 },
      { op: 'remove', path: '/test1' }
    ];
    let toPackageJson = {
      test2: [1, 2],
      ignored: 1
    };
    let expected = {
      test2: [1, 2]
    };

    test(myPackageJson, patch, toPackageJson, expected);
  });
});
