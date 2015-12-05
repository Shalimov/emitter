var EventEmitter = require('../src/event-emitter');
var sinon = require('sinon');

describe('Memory consumption spec', function () {
  var ee;
  var sh;

  beforeEach(function () {
    ee = new EventEmitter();
    sh = sinon.spy();
  });

  it('should remove all event listeners', function () {
    ee.on(['e1', 'e1', 'e1', 'e1'], sh);
    ee._eventMap['e1'].length.should.be.eql(4);
    ee._registredListenersCount.should.be.eql(4);

    ee.off('e1');
    ee._eventMap.hasOwnProperty('e1').should.be.False();

    Object.keys(ee._groups).length.should.be.eql(0);
    ee._registredListenersCount.should.be.eql(0);
  });
});