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

  it('should remove eventDep from groups properly when we remove event', function () {
    ee.on('e1.group', sh);
    ee._eventMap['e1'].length.should.be.eql(1);
    ee._groups['group'].length.should.be.eql(1);
    ee._registredListenersCount.should.be.eql(1);

    ee.off('e1');
    ee._eventMap.hasOwnProperty('e1').should.be.False();
    ee._groups['group'].indexOf('e1').should.be.eql(-1);
    ee._registredListenersCount.should.be.eql(0);
  });

  it('should remove eventDeps from groups ...', function () {
    ee.on(['e1.group1', 'e1.group1', 'e1', 'e2.group', 'e3.group'], sh);
    ee._registredListenersCount.should.be.eql(5);
    ee._eventMap['e1'].length.should.be.eql(3);
    ee._groups['group1'].length.should.be.eql(2);

    ee.off('e1.group1');
    ee._eventMap['e1'].length.should.be.eql(1);
    ee._registredListenersCount.should.be.eql(3);
    ee._groups['group1'].length.should.be.eql(0);

    ee.off('.group');
    ee._registredListenersCount.should.be.eql(1);
    ee._groups.hasOwnProperty('group').should.be.False();

    ee.off('e1');
    ee._registredListenersCount.should.be.eql(0);
  });
});