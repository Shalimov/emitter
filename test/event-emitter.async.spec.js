var EventEmitter = require('../dist/event-emitter');
var sinon = require('sinon');

describe('EventEmitter sync spec', function () {
  var eventEmitter;
  var spyHandler;

  beforeEach(function () {
    eventEmitter = new EventEmitter({async: true});
    spyHandler = sinon.spy();
  });
});