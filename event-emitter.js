(function () {
  'use strict';

  var _ = {
    each: function (collection, iterator, ctx) {
      var i, length;

      if (Array.isArray(collection)) {
        for (i = 0, length = collection.length; i < length; i++) {
          if (iterator.call(ctx, collection[i], i, collection)) {
            break;
          }
        }
      } else if (typeof collection === 'object') {
        var keys = Object.keys(collection);

        for (i = 0, length = keys.length; i < length; i++) {
          var key = keys[i];
          if (iterator.call(ctx, collection[key], key, collection)) {
            break;
          }
        }
      }
    },

    extend: function extend(dest, source) {
      this.each(source, function (val, key) {
        dest[key] = val;
      });
    },

    hash: function (text) {
      return text.split("").reduce(this.symbolHash, 0);
    },

    symbolHash: function (a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }
  };

  function EventEmitter(settings) {
    settings = settings || {};

    this._events = {};
    this._handlers = {};
    this._currentListenersCount = 0;
    this._maxListeners = 30;
    this._logger = settings.logger || console;
  }

  _.extend(EventEmitter.prototype, {
    get maxListeners() {
      return this._maxListeners;
    },

    set maxListeners(listenersCount) {
      if (listenersCount > 0) {
        this._maxListeners = listenersCount;
      }
    },

    on: function (eventName, handler) {
      if (typeof eventName !== 'string' || typeof handler !== 'function') {
        throw new Error('First param should be a String, Second parameter should be an function');
      }

      var hash = _.hash(eventName + handler.toString());

      if (this._events.hasOwnProperty(eventName) && !this._handlers.hasOwnProperty(hash)) {
        this._events[eventName].push(hash);
        this._currentListenersCount++;
      } else if (!this._handlers.hasOwnProperty(hash)) {
        this._events[eventName] = [hash];
        this._currentListenersCount++;
      }

      this._handlers[hash] = handler;

      if (this._currentListenersCount > this._maxListeners) {
        this._logger.warn('Warning! Detected [' + this._currentListenersCount + '] more than [' + this._maxListeners + '] registered event listeners.');
      }
    },

    onSeveral: function (eventList, handler) {
      if (Array.isArray(eventList)) {
        _.each(eventList, function (event) {
          this.on(event, handler);
        }, this);
      }
    },

    once: function (eventName, handler) {
      var self = this;

      if (typeof eventName !== 'string' || typeof handler !== 'function') {
        throw new Error('First param should be a String, Second parameter should be an function');
      }

      self.on(eventName, decorator);

      function decorator() {
        try {
          handler.apply(this, arguments);
        } finally {
          self.off(eventName, decorator);
        }
      }
    },

    off: function (eventName, handler) {
      if (handler) {
        var hash = _.hash(eventName + handler.toString());

        var handlerIndex = this._events[eventName].indexOf(hash);
        this._events[eventName].splice(handlerIndex, 1);

        this._currentListenersCount--;
        delete this._handlers[hash];
      } else {
        _.each(this._events[eventName], function (hash) {
          this._currentListenersCount--;
          delete this._handlers[hash];
        }, this);

        delete this._events[eventName];
      }
    },

    offSeveral: function (eventList, handler) {
      if (Array.isArray(eventList)) {
        _.each(eventList, function (event) {
          this.off(event, handler);
        }, this);
      }
    },

    emit: function (eventName) {
      if (this._events.hasOwnProperty(eventName)) {
        var args = Array.prototype.slice.call(arguments, 1);

        _.each(this._events[eventName], function (hash) {
          this._handlers[hash].apply(null, args);
        }, this);
      }
    },

    emitSeveral: function (eventList) {
      if (Array.isArray(eventList)) {
        var args = Array.prototype.slice.call(arguments, 1);

        _.each(eventList, function (eventName) {
          var innerArgs = [eventName];
          innerArgs.push.apply(innerArgs, args);

          this.emit.apply(this, innerArgs);
        }, this);
      }
    },

    toString: function () {
      return '[object EventEmitter]';
    }
  });

  if (typeof module !== undefined) {
    module.exports = EventEmitter;
  } else if (typeof exports !== undefined) {
    exports.EventEmitter = EventEmitter;
  } else {
    this.EventEmitter = EventEmitter;
  }
})();