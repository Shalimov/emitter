var EventEmitter = require('../dist/event-emitter');
var eventEmitter = new EventEmitter();

var ITERATIONS = 1000000;

function estimateOnce(name, fn) {
  console.time(name);
  fn();
  console.timeEnd(name);
}

function estimateFor(name, fn, iterations) {
  console.time(name);
  for (var i = 0; i < iterations; i++) {
    fn();
  }
  console.timeEnd(name);
}

var generateEventNames = function (count, eventName) {
  var events = new Array(ITERATIONS);

  for (var i = 0; i < ITERATIONS; i++) {
    events[i] = eventName || 'event' + i;
  }

  return events;
};

var generateEventNamesWithGroups = function (count, eventNameGroup) {
  var events = new Array(ITERATIONS);

  for (var i = 0; i < ITERATIONS; i++) {
    events[i] = eventNameGroup || 'event' + i + '.group' + i;
  }

  return events;
};

var testHandler = function () {
  console.log('event1 fired');
};

//----------------TESTS------------------------------

estimateFor('on:pure:same:event', function () {
  eventEmitter.on('event1', testHandler);
}, ITERATIONS);

estimateOnce('off:pure:same:event', function () {
  eventEmitter.off('event1');
});

//---------------------------------------------------

eventEmitter = new EventEmitter();

//----------------TESTS------------------------------

var events = generateEventNames(ITERATIONS, 'event1');

estimateOnce('on:several:pure:same:event', function () {
  eventEmitter.on(events, testHandler);
});

estimateOnce('off:pure:same:event', function () {
  eventEmitter.off('event1');
});

//---------------------------------------------------

eventEmitter = new EventEmitter();

//----------------TESTS------------------------------

var events = generateEventNames(ITERATIONS);

estimateOnce('on:several:pure:diff:events', function () {
  eventEmitter.on(events, testHandler);
});

estimateOnce('off:several:pure:diff:event', function () {
  eventEmitter.off(events);
});

//---------------------------------------------------

eventEmitter = new EventEmitter();

//----------------TESTS------------------------------

var events = generateEventNamesWithGroups(ITERATIONS, 'event1.group1');

estimateOnce('on:several:grouped:same:events', function () {
  eventEmitter.on(events, testHandler);
});

estimateOnce('off:several:grouped:same:event', function () {
  eventEmitter.off('event1.group1');
});

//---------------------------------------------------