var EventEmitter = require('../dist/event-emitter');
var sinon = require('sinon');

describe('EventEmitter sync spec', function () {
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
    eventEmitter.emit('some:event', ['args1', 'args2'], {
      key: 'value'
    });
    spyHandler.calledOnce.should.be.True();
    spyHandler.getCall(0)
      .args.should.match([
        ['args1', 'args2'], {
          key: 'value'
        }
      ]);

    eventEmitter.emit('some:event', 1, 2, 3, 4);
    spyHandler.calledTwice.should.be.True();
    spyHandler.getCall(1)
      .args.should.match([1, 2, 3, 4]);

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

    eventEmitter.trigger('event');
    eventEmitter.emit('event2');
    spyHandler.calledTwice.should.be.True();
  });

  it('should have ability register and remove event by using special group', function () {
    eventEmitter.on('event.repeater', spyHandler);
    eventEmitter.on('event.repeater', spyHandler);
    eventEmitter.on('event2.repeater', spyHandler);

    eventEmitter.emit('event');
    spyHandler.calledTwice.should.be.True();

    eventEmitter.removeEventListener('event.repeater');

    eventEmitter.emit('event');
    spyHandler.calledTwice.should.be.True();

    eventEmitter.emit('event2');
    spyHandler.calledThrice.should.be.True();
  });

  it('should have ability to stop event spreading inside handler', function () {
    eventEmitter.addEventListener('event', function () {
      spyHandler();
      this.stop();
    });

    eventEmitter.addEventListener('event', spyHandler);
    eventEmitter.on('event', spyHandler);
    eventEmitter.on('event', spyHandler);

    eventEmitter.emit('event');
    eventEmitter.emit('event');
    eventEmitter.trigger('event');

    spyHandler.calledThrice.should.be.True();
  });

  it('should have to check whether event exists or not', function () {
    eventEmitter.on('event', spyHandler);

    eventEmitter.hasEvent('event')
      .should.be.True();
    eventEmitter.hasEvent('event2')
      .should.be.False();
  });

  it('should have to check whether group exists or not', function () {
    eventEmitter.on('event.g1', spyHandler);

    eventEmitter.hasGroup('g1')
      .should.be.True();
    eventEmitter.hasGroup('g2')
      .should.be.False();
  });

  it('should be able to register "before" handlers that will be invoked before event handlers invocation', function () {

    var beforeCounter = 0;

    eventEmitter.on('event1', function () {
      beforeCounter.should.be.eql(1);
    });

    eventEmitter.on('event2', function () {
      beforeCounter.should.be.eql(2);
    });

    eventEmitter.before(['event1', 'event2'], function () {
      beforeCounter += 1;
    });

    eventEmitter.emit('event1');
    eventEmitter.emit('event2');
  });

  it('should be able to register "after" handlers that will be invoked before event handlers invocation', function () {
    var afterCounter = 0;

    eventEmitter.on('event1', function () {
      afterCounter.should.be.eql(0);
    });

    eventEmitter.on('event2', function () {
      afterCounter.should.be.eql(1);
    });

    eventEmitter.after(['event1', 'event2'], function () {
      afterCounter += 1;
    });

    eventEmitter.emit('event1');
    eventEmitter.emit('event2');

    afterCounter.should.be.eql(2);
  });

  it('should be able to unregister "after" and "before" handlers', function () {
    var beforeCounter = 0;
    var afterCounter = 0;

    var expectedCounterValue = 2;

    eventEmitter.on('event1', function () {
      beforeCounter.should.be.eql(1);
      afterCounter.should.be.eql(0);
    });

    eventEmitter.on('event2', function () {
      beforeCounter.should.be.eql(2);
      afterCounter.should.be.eql(1);
    });

    eventEmitter.before(['event1', 'event2'], function () {
      beforeCounter += 1;
    });

    eventEmitter.after(['event1', 'event2'], function () {
      afterCounter += 1;
    });

    eventEmitter.emit('event1');
    eventEmitter.emit('event2');

    afterCounter.should.be.eql(2);

    eventEmitter.offBefore(['event1', 'event2']);
    eventEmitter.offAfter(['event1', 'event2']);
    eventEmitter.off(['event1', 'event2']);

    eventEmitter.on('event1', function () {
      beforeCounter.should.be.eql(2);
      afterCounter.should.be.eql(2);
    });

    eventEmitter.on('event2', function () {
      beforeCounter.should.be.eql(2);
      afterCounter.should.be.eql(2);
    });

    eventEmitter.emit('event1');
    eventEmitter.emit('event2');

    beforeCounter.should.be.eql(2);
    afterCounter.should.be.eql(2);
  });

  it('should override #toString and #toString should return [object EventEmitter]', function () {
    eventEmitter.toString()
      .should.be.eql('[object EventEmitter]');
  });

  /* NCH */
  describe('Group API spec', function () {
    it('should have method #group and create group with ability to be deleted', function () {
      var g1 = eventEmitter.group('group1');
      g1.on('event', spyHandler);
      g1.on('event1', spyHandler);

      spyHandler.called.should.be.False();

      g1.emit('event');
      eventEmitter.emit('event1');

      spyHandler.calledTwice.should.be.True();

      g1.off('event');

      eventEmitter.emit('event');
      g1.emit('event1');

      spyHandler.calledThrice.should.be.True();
    });

    it('should remove events only for specific group', function () {
      var g1 = eventEmitter.group('group1');
      g1.on('event', spyHandler);
      eventEmitter.on('event', spyHandler);

      eventEmitter.emit('event');

      spyHandler.calledTwice.should.be.True();

      g1.off();

      eventEmitter.emit('event');

      spyHandler.calledThrice.should.be.True();
    });
  });
});
