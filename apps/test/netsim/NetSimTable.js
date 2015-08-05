var testUtils = require('../util/testUtils');
var assert = testUtils.assert;
var assertEqual = testUtils.assertEqual;
var assertThrows = testUtils.assertThrows;
var netsimTestUtils = require('../util/netsimTestUtils');
var fakeStorageTable = netsimTestUtils.fakeStorageTable;

var NetSimTable = require('@cdo/apps/netsim/NetSimTable');
var NetSimGlobals = require('@cdo/apps/netsim/NetSimGlobals');

/**
 * Helper method for introducing a delay in your test method.
 * @param {number} delayMs - Number of milliseconds to wait before continuing.
 * @param {function} testDone - Chai's "done" callback.
 * @param {function} nextStep - Function to call after the delay.
 */
function delayTest(delayMs, testDone, nextStep) {
  setTimeout(function () {
    try {
      nextStep();
    } catch (e) {
      testDone(e);
    }
  }, delayMs);
}

describe("NetSimTable", function () {
  var apiTable, netsimTable, callback, notified, fakeChannel;

  beforeEach(function () {
    fakeChannel = {
      subscribe: function () {}
    };
    netsimTable = netsimTestUtils.overrideNetSimTableApi(
        new NetSimTable(fakeChannel, 'testShard', 'testTable', {
          // In tests we usually want zero delay to allow fast test runs
          // and immediate reading at any time.
          minimumDelayBeforeRefresh: 0,
          maximumJitterDelay: 0,
          minimumDelayBetweenRefreshes: 0
        }));

    apiTable = netsimTable.api_.remoteTable;
    callback = function () {};
    notified = false;
    netsimTable.tableChange.register(function () {
      notified = true;
    });
  });

  it ("throws if constructed with missing arguments", function () {
    assertThrows(TypeError, function () {
      var _ = new NetSimTable('just-one-argument');
    });

    assertThrows(TypeError, function () {
      var _ = new NetSimTable('just-two', 'arguments');
    });
  });

  describe ("throws if constructed with invalid options", function () {
    describe ("useIncrementalRefresh", function () {
      it ("accepts `undefined`, defaults to false", function () {
        var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          useIncrementalRefresh: undefined
        });
        assertEqual(false, _.useIncrementalRefresh_);
      });

      it ("accepts booelan values", function () {
        var _a = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          useIncrementalRefresh: true
        });

        var _b = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          useIncrementalRefresh: false
        });
      });

      it ("rejects numbers", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            useIncrementalRefresh: 45.302
          });
        });
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            useIncrementalRefresh: -88
          });
        });
      });

      it ("rejects `null`", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            useIncrementalRefresh: null
          });
        });
      });

      it ("rejects strings", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            useIncrementalRefresh: "twenty hours"
          });
        });
      });

      it ("rejects objects", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            useIncrementalRefresh: {}
          });
        });
      });

      it ("rejects Infinities", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            useIncrementalRefresh: Infinity
          });
        });

        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            useIncrementalRefresh: -Infinity
          });
        });
      });

      it ("rejects NaN", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            useIncrementalRefresh: NaN
          });
        });
      });
    });
    
    describe ("minimumDelayBeforeRefresh", function () {
      it ("accepts `undefined`", function () {
        var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          minimumDelayBeforeRefresh: undefined
        });
      });

      it ("accepts ordinary numbers > 0", function () {
        var _a = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          minimumDelayBeforeRefresh: 50.354
        });

        var _b = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          minimumDelayBeforeRefresh: 0
        });
      });

      it ("rejects negative numbers", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBeforeRefresh: -88
          });
        });
      });

      it ("rejects `null`", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBeforeRefresh: null
          });
        });
      });

      it ("rejects strings", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBeforeRefresh: "twenty hours"
          });
        });
      });

      it ("rejects objects", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBeforeRefresh: {}
          });
        });
      });

      it ("rejects Infinities", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBeforeRefresh: Infinity
          });
        });

        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBeforeRefresh: -Infinity
          });
        });
      });

      it ("rejects NaN", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBeforeRefresh: NaN
          });
        });
      });
    });

    describe ("maximumJitterDelay", function () {
      it ("accepts `undefined`", function () {
        var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          maximumJitterDelay: undefined
        });
      });

      it ("accepts ordinary numbers > 0", function () {
        var _a = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          maximumJitterDelay: 50.354
        });

        var _b = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          maximumJitterDelay: 0
        });
      });

      it ("rejects negative numbers", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            maximumJitterDelay: -88
          });
        });
      });

      it ("rejects `null`", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            maximumJitterDelay: null
          });
        });
      });

      it ("rejects strings", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            maximumJitterDelay: "twenty hours"
          });
        });
      });

      it ("rejects objects", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            maximumJitterDelay: {}
          });
        });
      });

      it ("rejects Infinities", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            maximumJitterDelay: Infinity
          });
        });

        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            maximumJitterDelay: -Infinity
          });
        });
      });

      it ("rejects NaN", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            maximumJitterDelay: NaN
          });
        });
      });
    });

    describe ("minimumDelayBetweenRefreshes", function () {
      it ("accepts `undefined`", function () {
        var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          minimumDelayBetweenRefreshes: undefined
        });
      });

      it ("accepts ordinary numbers > 0", function () {
        var _a = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          minimumDelayBetweenRefreshes: 50.354
        });

        var _b = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
          minimumDelayBetweenRefreshes: 0
        });
      });

      it ("rejects negative numbers", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBetweenRefreshes: -88
          });
        });
      });

      it ("rejects `null`", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBetweenRefreshes: null
          });
        });
      });

      it ("rejects strings", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBetweenRefreshes: "twenty hours"
          });
        });
      });

      it ("rejects objects", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBetweenRefreshes: {}
          });
        });
      });

      it ("rejects Infinities", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBetweenRefreshes: Infinity
          });
        });

        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBetweenRefreshes: -Infinity
          });
        });
      });

      it ("rejects NaN", function () {
        assertThrows(TypeError, function () {
          var _ = new NetSimTable(fakeChannel, 'shardID', 'tableName', {
            minimumDelayBetweenRefreshes: NaN
          });
        });
      });
    });
  });

  it ("calls readAll on the API table", function () {
    netsimTable.refresh(callback);
    assertEqual(apiTable.log(), 'readAll');
  });

  it ("calls read on the API table", function () {
    netsimTable.read(1, callback);
    assertEqual(apiTable.log(), 'read[1]');
  });

  it ("calls create on the API table", function () {
    netsimTable.create({}, callback);
    assertEqual(apiTable.log(), 'create[{}]');
  });

  it ("calls update on the API table", function () {
    netsimTable.update(1, {}, callback);
    assertEqual(apiTable.log(), 'update[1, {}]');
  });

  it ("calls delete on the API table", function () {
    netsimTable.delete(1, callback);
    assertEqual(apiTable.log(), 'delete[1]');
  });

  it ("notifies on refresh if any remote row changed", function () {
    netsimTable.create({data: "A"}, callback);

    notified = false;
    netsimTable.refresh(callback);
    assertEqual(notified, false);

    // Remote update - doesn't hit our caches
    apiTable.update(1, {data: "B"}, callback);

    notified = false;
    netsimTable.refresh(callback);
    assertEqual(notified, true);
  });

  it ("notifies on read if the requested remote row changed", function () {
    netsimTable.create({data: "A"}, callback);

    notified = false;
    netsimTable.read(1, callback);
    assertEqual(notified, false);

    // Remote update - doesn't hit our caches
    apiTable.update(1, {data: "B"}, callback);

    notified = false;
    netsimTable.read(1, callback);
    assertEqual(notified, true);
  });

  it ("notifies on every create", function () {
    notified = false;
    netsimTable.create({}, callback);
    assertEqual(notified, true);
  });

  it ("notifies on update if the cache row changed", function () {
    netsimTable.create({data: "A"}, callback);

    notified = false;
    netsimTable.update(1, {data: "A"}, callback);
    assertEqual(notified, false);

    notified = false;
    netsimTable.update(1, {data: "B"}, callback);
    assertEqual(notified, true);
  });

  it ("notifies on delete when row was previously in cache", function () {
    notified = false;
    netsimTable.delete(1, callback);
    assertEqual(notified, false);

    netsimTable.create({}, callback);

    notified = false;
    netsimTable.delete(1, callback);
    assertEqual(notified, true);
  });

  it ("passes new full table contents to notification callbacks", function () {
    var receivedTableData;
    netsimTable.tableChange.register(function (newTableData) {
      receivedTableData = newTableData;
    });

    netsimTable.create({data: "A"}, callback);
    assertEqual(receivedTableData,
        [
          {data: "A", id: 1}
        ]);

    // Remote change
    apiTable.create({data: "B"}, callback);
    netsimTable.refresh(callback);
    assertEqual(receivedTableData,
        [
          {data: "A", id: 1},
          {data: "B", id: 2}
        ]);

    netsimTable.update(2, {data: "C"}, callback);
    assertEqual(receivedTableData,
        [
          {data: "A", id: 1},
          {data: "C", id: 2}
        ]);

    netsimTable.delete(1, callback);
    assertEqual(
        receivedTableData,
        [
          {data: "C", id: 2}
        ]);
  });

  it ("polls table on tick", function () {
    // Initial tick always triggers a poll event.
    netsimTable.tick();
    assertEqual(apiTable.log(), 'readAll');

    // Additional tick does not trigger poll event...
    apiTable.log('');
    netsimTable.tick();
    assertEqual(apiTable.log(), '');

    // Until poll interval is reached.
    netsimTable.lastRefreshTime_ = Date.now() - (netsimTable.pollingInterval_);
    netsimTable.tick();
    assertEqual(apiTable.log(), 'readAll');
  });

  describe ("initial delay coalescing", function () {
    beforeEach(function () {
      // Re-enable 50ms before-refresh delay to coalesce messages
      netsimTable.setMinimumDelayBeforeRefresh(50);
    });

    it ("does not read until minimum delay passes", function (testDone) {
      netsimTable.refreshTable_(callback);
      assertEqual('', apiTable.log());
      delayTest(50, testDone, function () {
        assertEqual('readAll', apiTable.log());
        testDone();
      });
    });

    it ("coalesces multiple rapid requests", function (testDone) {
      netsimTable.refreshTable_(callback);
      netsimTable.refreshTable_(callback);
      netsimTable.refreshTable_(callback);
      assertEqual('', apiTable.log());

      delayTest(25, testDone, function () {
        netsimTable.refreshTable_(callback);
        netsimTable.refreshTable_(callback);
        netsimTable.refreshTable_(callback);
        assertEqual('', apiTable.log());

        delayTest(25, testDone, function () {
          // Only one request at initial delay
          assertEqual('readAll', apiTable.log());

          delayTest(25, testDone, function () {
            // Still only one request has occurred - the calls at 25ms
            // were coalesced into the initial call.
            assertEqual('readAll', apiTable.log());

            testDone();
          });
        });
      });
    });

    it ("does not coalesce if requests are far enough apart", function (testDone) {
      netsimTable.refreshTable_(callback);
      delayTest(50, testDone, function () {
        assertEqual('readAll', apiTable.log());

        // This kicks off another delayed request
        netsimTable.refreshTable_(callback);
        assertEqual('readAll', apiTable.log());

        delayTest(50, testDone, function () {
          // Both requests occur
          assertEqual('readAllreadAll', apiTable.log());

          testDone();
        });
      });
    });
  });

  describe ("refresh throttling", function () {
    beforeEach(function () {
      // Re-enable 50ms refreshTable_ throttle to test throttling feature
      netsimTable.setMinimumDelayBetweenRefreshes(50);
    });

    it ("still reads immediately on first request", function () {
      netsimTable.refreshTable_(callback);
      assertEqual(apiTable.log(), 'readAll');
    });

    it ("coalesces multiple rapid requests", function () {
      for (var i = 0; i < 5; i++) {
        netsimTable.refreshTable_(callback);
      }
      assertEqual(apiTable.log(), 'readAll');
    });

    it ("does not issue trailing request when only one request occurred", function (testDone) {
      netsimTable.refreshTable_(callback);
      delayTest(50, testDone, function () {
        assertEqual(apiTable.log(), 'readAll');
        testDone();
      });
    });

    it ("issues trailing request when multiple requests occurred", function (testDone) {
      for (var i = 0; i < 5; i++) {
        netsimTable.refreshTable_(callback);
      }
      assertEqual('readAll', apiTable.log());
      delayTest(10, testDone, function () {
        assertEqual('readAll', apiTable.log());
        delayTest(40, testDone, function () {
          // See the second request come in by 50ms of delay
          assertEqual('readAllreadAll', apiTable.log());
          testDone();
        });
      });
    });

    it ("throttles requests", function (testDone) {
      assertEqual('', apiTable.log());
      delayTest(10, testDone, function () {

        // Call at 10ms happens immediately, even when delayed
        assertEqual('', apiTable.log());
        netsimTable.refreshTable_(callback);
        assertEqual('readAll', apiTable.log());
        delayTest(10, testDone, function () {

          // Call at 20ms causes no request (yet)
          assertEqual('readAll', apiTable.log());
          netsimTable.refreshTable_(callback);
          assertEqual('readAll', apiTable.log());
          delayTest(40, testDone, function () {

            // Trailing request from second call has already happened, but
            // third call does not cause immediate request.
            assertEqual('readAllreadAll', apiTable.log());
            netsimTable.refreshTable_(callback);
            assertEqual('readAllreadAll', apiTable.log());
            delayTest(60, testDone, function () {

              // Trailing request from third call has arrived
              assertEqual('readAllreadAllreadAll', apiTable.log());
              testDone();
            });
          });
        });
      });
    });
  });

  describe ("refresh jitter", function () {
    beforeEach(function () {
      // Re-enable 50ms jitter to test random refresh delays.
      netsimTable.setMaximumJitterDelay(50);
    });

    it ("waits a random amount of time before reading on each request", function (testDone) {
      NetSimGlobals.setRandomSeed('Jitter test 1');
      // With this seed, the refresh fires sometime between 30-40ms.

      netsimTable.refresh();
      delayTest(30, testDone, function () {
        assertEqual('', apiTable.log());

        delayTest(10, testDone, function () {
          assertEqual('readAll', apiTable.log());
          testDone();
        });
      });
    });

    it ("second example (different random seed)", function (testDone) {
      NetSimGlobals.setRandomSeed('Jitter test 2');
      // With this seed, the refresh fires almost immediately - in under 10 ms.

      netsimTable.refresh();
      assertEqual('', apiTable.log());

      delayTest(10, testDone, function () {
        assertEqual('readAll', apiTable.log());
        testDone();
      });
    });

    it ("recalculated for every refresh", function (testDone) {
      NetSimGlobals.setRandomSeed('Jitter test 3');
      // Without request coalescing, we start two requests at the same time,
      // but they will actually fire with different random delays.

      netsimTable.refresh();
      netsimTable.refresh();

      // Neither fires instantly
      assertEqual('', apiTable.log());

      // First one has fired after 20ms
      delayTest(20, testDone, function () {
        assertEqual('readAll', apiTable.log());

        // Second has fired after 20ms more
        delayTest(20, testDone, function () {
          assertEqual('readAllreadAll', apiTable.log());
          testDone();
        });
      });
    });
  });

  describe ("incremental update", function () {

    beforeEach(function () {
      // New table configured for incremental refresh
      netsimTable = netsimTestUtils.overrideNetSimTableApi(
          new NetSimTable(fakeChannel, 'testShard', 'testTable', {
            useIncrementalRefresh: true,
            minimumDelayBeforeRefresh: 0,
            maximumJitterDelay: 0,
            minimumDelayBetweenRefreshes: 0
          }));

      // Necessary to re-get apiTable when we recreate netsimTable
      apiTable = netsimTable.api_.remoteTable;
    });

    it ("Initially requests from row 1", function () {
      assertEqual('', apiTable.log());
      netsimTable.refreshTable_(callback);
      assertEqual('readAllFromID[1]', apiTable.log());
      assertEqual([], netsimTable.readAll());

      // Keeps requesting from row 1 when there's no content
      apiTable.clearLog();
      assertEqual('', apiTable.log());
      netsimTable.refreshTable_(callback);
      assertEqual('readAllFromID[1]', apiTable.log());
    });

    it ("Requests from beyond most recent row received in refresh", function () {
      netsimTable.create({}, callback);
      netsimTable.create({}, callback);
      netsimTable.create({}, callback);
      assertEqual('create[{}]create[{}]create[{}]', apiTable.log());

      apiTable.clearLog();
      netsimTable.refreshTable_(callback);
      // Intentionally "1" here - we update our internal "latestRowID"
      // until after an incremental or full read.
      assertEqual('readAllFromID[1]', apiTable.log());
      assertEqual([{id:1}, {id:2}, {id:3}], netsimTable.readAll());

      apiTable.clearLog();
      netsimTable.create({}, callback);
      netsimTable.refreshTable_(callback);
      // Got 1, 2, 3 in last refresh, so we read all from 4 this time.
      assertEqual('create[{}]readAllFromID[4]', apiTable.log());
      assertEqual([{id:1}, {id:2}, {id:3}, {id:4}], netsimTable.readAll());
    });

  });

});
