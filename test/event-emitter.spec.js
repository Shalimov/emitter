var EventEmitter = require('../dist/event-emitter');
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


  it('should register event for only two-time invocation by using #many, triggers event by using #emit and check invocation by #emit again', function () {
    eventEmitter.many('some:event', spyHandler, 2);
    spyHandler.called.should.be.False();

    eventEmitter.emit('some:event');
    spyHandler.calledOnce.should.be.True();

    eventEmitter.emit('some:event');
    spyHandler.calledTwice.should.be.True();

    eventEmitter.emit('some:event');
    spyHandler.calledTwice.should.be.True();
  });

  it('should provide ability to register handler on several events', function () {
    eventEmitter.on(['event1', 'event2', 'event3'], spyHandler);

    spyHandler.called.should.be.False();

    eventEmitter.emit('event1');
    spyHandler.calledOnce.should.be.True();

    eventEmitter.emit('event2');
    spyHandler.calledTwice.should.be.True();

    eventEmitter.emit('event3');
    spyHandler.calledThrice.should.be.True();
  });

  it('should provide ability to unsubscribe from several events', function () {
    eventEmitter.on(['event1', 'event2', 'event3'], spyHandler);

    eventEmitter.emit('event1');
    eventEmitter.emit('event2');
    eventEmitter.emit('event3');

    spyHandler.calledThrice.should.be.True();

    eventEmitter.off(['event1', 'event2', 'event3']);

    eventEmitter.emit('event1');
    eventEmitter.emit('event2');
    eventEmitter.emit('event3');

    spyHandler.calledThrice.should.be.True();
  });

  it('should have ability register and remove group of events', function () {
    eventEmitter.on('event.repeater', spyHandler);
    eventEmitter.on('event2.repeater', spyHandler);

    eventEmitter.emit('event');
    spyHandler.calledOnce.should.be.True();

    eventEmitter.emit('event2');
    spyHandler.calledTwice.should.be.True();

    eventEmitter.off('.repeater');

    eventEmitter.emit('event');
    eventEmitter.emit('event2');
    spyHandler.calledTwice.should.be.True();
  });

  it('should have ability register and remove event by using special group', function () {
    eventEmitter.on('event.repeater', spyHandler);
    eventEmitter.on('event.repeater', spyHandler);
    eventEmitter.on('event2.repeater', spyHandler);

    eventEmitter.emit('event');
    spyHandler.calledTwice.should.be.True();

    eventEmitter.off('event.repeater');

    eventEmitter.emit('event');
    spyHandler.calledTwice.should.be.True();

    eventEmitter.emit('event2');
    spyHandler.calledThrice.should.be.True();
  });

  it('should have ability to stop event spreading inside handler', function () {
    eventEmitter.on('event', function () {
      spyHandler();
      this.stop();
    });

    eventEmitter.on('event', spyHandler);
    eventEmitter.on('event', spyHandler);
    eventEmitter.on('event', spyHandler);

    eventEmitter.emit('event');
    eventEmitter.emit('event');
    eventEmitter.emit('event');

    spyHandler.calledThrice.should.be.True();
  });

  it('should override #toString and #toString should return [object EventEmitter]', function () {
    eventEmitter.toString().should.be.eql('[object EventEmitter]');
  });
});