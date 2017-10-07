'use strict';

const expect = require('chai').expect;
const matchMovedKeys = require('../src/match-moved-keys');

function test(options) {
  let myPackageJson = options.myPackageJson;
  let fromPackageJson = options.fromPackageJson;
  let toPackageJson = options.toPackageJson;
  let expected = options.expected;

  matchMovedKeys(myPackageJson, fromPackageJson, toPackageJson);

  expect(JSON.stringify(myPackageJson)).to.equal(JSON.stringify(expected));
}

describe('Unit - matchMovedKeys', function() {
  it('reorders', function() {
    test({
      myPackageJson: {
        test1: 1,
        test2: 1
      },
      fromPackageJson: {
        test1: 1,
        test2: 1
      },
      toPackageJson: {
        test2: 1,
        test1: 1
      },
      expected: {
        test2: 1,
        test1: 1
      }
    });
  });

  it('reorders nested', function() {
    test({
      myPackageJson: {
        test: {
          test1: 1,
          test2: 1
        }
      },
      fromPackageJson: {
        test: {
          test1: 1,
          test2: 1
        }
      },
      toPackageJson: {
        test: {
          test2: 1,
          test1: 1
        }
      },
      expected: {
        test: {
          test2: 1,
          test1: 1
        }
      }
    });
  });

  it('reorders with missing key in top of "my"', function() {
    test({
      myPackageJson: {
        test1: 1,
        test2: 1
      },
      fromPackageJson: {
        test3: 1,
        test1: 1,
        test2: 1
      },
      toPackageJson: {
        test3: 1,
        test2: 1,
        test1: 1
      },
      expected: {
        test2: 1,
        test1: 1
      }
    });
  });

  it('reorders with missing key in middle of "my"', function() {
    test({
      myPackageJson: {
        test1: 1,
        test2: 1
      },
      fromPackageJson: {
        test1: 1,
        test3: 1,
        test2: 1
      },
      toPackageJson: {
        test2: 1,
        test3: 1,
        test1: 1
      },
      expected: {
        test2: 1,
        test1: 1
      }
    });
  });

  it('reorders with missing key in bottom of "my"', function() {
    test({
      myPackageJson: {
        test1: 1,
        test2: 1
      },
      fromPackageJson: {
        test1: 1,
        test2: 1,
        test3: 1
      },
      toPackageJson: {
        test2: 1,
        test1: 1,
        test3: 1
      },
      expected: {
        test2: 1,
        test1: 1
      }
    });
  });

  it('doesn\'t break if key missing from "from"', function() {
    test({
      myPackageJson: {
        test1: 1,
        test2: 1
      },
      fromPackageJson: {
        test1: 1,
        test2: 1
      },
      toPackageJson: {
        test2: 1,
        test1: 1,
        test3: 1
      },
      expected: {
        test2: 1,
        test1: 1
      }
    });
  });

  it('doesn\'t break if key missing from "to"', function() {
    test({
      myPackageJson: {
        test1: 1,
        test2: 1
      },
      fromPackageJson: {
        test1: 1,
        test2: 1,
        test3: 1
      },
      toPackageJson: {
        test2: 1,
        test1: 1
      },
      expected: {
        test2: 1,
        test1: 1
      }
    });
  });

  it('uses value from "my"', function() {
    test({
      myPackageJson: {
        test1: 1,
        test2: 1
      },
      fromPackageJson: {
        test1: 2,
        test2: 2
      },
      toPackageJson: {
        test2: 2,
        test1: 2
      },
      expected: {
        test2: 1,
        test1: 1
      }
    });
  });

  it('preserves complicated ordering', function() {
    test({
      myPackageJson: {
        test1: 1,
        test6: 1,
        test4: 1,
        test2: 1,
        test10: 1,
        test8: 1,
        test0: 1
      },
      fromPackageJson: {
        test1: 1,
        test3: 1,
        test5: 1,
        test2: 1,
        test7: 1,
        test9: 1,
        test0: 1
      },
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
});
