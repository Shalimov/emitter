var EventEmitter = require('../event-emitter');
var sinon = require('sinon');

describe('EventEmitter spec', function () {
  var eventEmitter;
  var spyHandler;

  beforeEach(function () {
    eventEmitter = new EventEmitter();
    spyHandler = sinon.spy();
  });

  it('should register event by using #on, triggers event without additional args by using #emit and unregister event by #off', function () {
    eventEmitter.on('some:event', spyHandler);
    spyHandler.called.should.be.False();

    eventEmitter.emit('some:event');
    spyHandler.calledOnce.should.be.True();

    eventEmitter.emit('some:event');
    spyHandler.calledTwice.should.be.True();

    eventEmitter.off('some:event');
    eventEmitter.emit('some:event');
    spyHandler.calledTwice.should.be.True();
  });


  it('should register event by using #on, triggers event with args by using #emit and unregister event by #off', function () {
    eventEmitter.on('some:event', spyHandler);
    eventEmitter.emit('some:event', ['args1', 'args2'], {key: 'value'});
    spyHandler.calledOnce.should.be.True();
    spyHandler.getCall(0).args.should.match([['args1', 'args2'], {key: 'value'}]);

    eventEmitter.emit('some:event', 1, 2, 3, 4);
    spyHandler.calledTwice.should.be.True();
    spyHandler.getCall(1).args.should.match([1, 2, 3, 4]);

    eventEmitter.off('some:event');
    eventEmitter.emit('some:event');
    spyHandler.calledTwice.should.be.True();
  });


  it('should register event for only one-time invocation by using #once, triggers event by using #emit and check invocation by #emit again', function () {
    eventEmitter.once('some:event', spyHandler);
    spyHandler.called.should.be.False();

    eventEmitter.emit('some:event');
    spyHandler.calledOnce.should.be.True();

    eventEmitter.emit('some:event');
    spyHandler.calledOnce.should.be.True();
  });

  it('should override #toString and #toString should return [object EventEmitter]', function () {
    eventEmitter.toString().should.be.eql('[object EventEmitter]');
  });

  it('should prevent registration the same function per one event more than one time', function () {
    eventEmitter.on('some:event', spyHandler);
    eventEmitter.on('some:event', spyHandler);
    eventEmitter.on('some:event', spyHandler);

    eventEmitter.emit('some:event');
    spyHandler.calledOnce.should.be.True();

    eventEmitter.on('some:event', spyHandler);

    eventEmitter.emit('some:event');
    spyHandler.calledTwice.should.be.True();
  });
});