'use strict';

const expect = require('chai').expect;
const applyPatch = require('../src').applyPatch;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

describe('Unit - applyPatch', function() {
  function test(options) {
    let myPackageJson = options.myPackageJson;
    let patch = options.patch;
    let toPackageJson = options.toPackageJson;
    let expected = options.expected;

    let patchClone = clone(patch);

    applyPatch(myPackageJson, patch, toPackageJson);

    expect(JSON.stringify(myPackageJson)).to.equal(JSON.stringify(expected));

    expect(patch, 'it does not mutate your patch').to.deep.equal(patchClone);
  }

  it('works in the beginning', function() {
    test({
      myPackageJson: {
        test6: 1,
        test1: 1,
        test2: 1
      },
      patch: [
        { op: 'add', path: '/test4', value: 1 }
      ],
      toPackageJson: {
        test3: 1,
        test4: 1,
        test5: 1,
        test1: 1,
        test2: 1
      },
      expected: {
        test6: 1,
        test4: 1,
        test1: 1,
        test2: 1
      }
    });
  });

  it('works in the middle', function() {
    test({
      myPackageJson: {
        test1: 1,
        test6: 1,
        test2: 1
      },
      patch: [
        { op: 'add', path: '/test4', value: 1 }
      ],
      toPackageJson: {
        test1: 1,
        test3: 1,
        test4: 1,
        test5: 1,
        test2: 1
      },
      expected: {
        test1: 1,
        test6: 1,
        test4: 1,
        test2: 1
      }
    });
  });

  it('works at the end', function() {
    test({
      myPackageJson: {
        test1: 1,
        test2: 1,
        test6: 1
      },
      patch: [
        { op: 'add', path: '/test4', value: 1 }
      ],
      toPackageJson: {
        test1: 1,
        test2: 1,
        test3: 1,
        test4: 1,
        test5: 1
      },
      expected: {
        test1: 1,
        test2: 1,
        test6: 1,
        test4: 1
      }
    });
  });

  it('handles multiple patch', function() {
    test({
      myPackageJson: {
        test1: 1,
        test6: 1,
        test2: 1,
        test10: 1,
        test0: 1
      },
      patch: [
        { op: 'add', path: '/test4', value: 1 },
        { op: 'add', path: '/test8', value: 1 }
      ],
      toPackageJson: {
        test1: 1,
        test3: 1,
        test4: 1,
        test5: 1,
        test2: 1,
        test7: 1,
        test8: 1,
        test9: 1,
        test0: 1
      },
      expected: {
        test1: 1,
        test6: 1,
        test4: 1,
        test2: 1,
        test10: 1,
        test8: 1,
        test0: 1
      }
    });
  });

  it('handles nested objects', function() {
    test({
      myPackageJson: {
        test: {
          test1: 1,
          test6: 1,
          test2: 1
        }
      },
      patch: [
        { op: 'add', path: '/test/test4', value: 1 }
      ],
      toPackageJson: {
        test: {
          test1: 1,
          test3: 1,
          test4: 1,
          test5: 1,
          test2: 1
        }
      },
      expected: {
        test: {
          test1: 1,
          test6: 1,
          test4: 1,
          test2: 1
        }
      }
    });
  });

  it('performs upstream options as well', function() {
    test({
      myPackageJson: {
        test1: 1,
        test2: [1]
      },
      patch: [
        { op: 'add', path: '/test2/-', value: 2 },
        { op: 'remove', path: '/test1' }
      ],
      toPackageJson: {
        test2: [1, 2],
        ignored: 1
      },
      expected: {
        test2: [1, 2]
      }
    });
  });
});
