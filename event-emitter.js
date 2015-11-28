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

  function EventEmitter() {
    this._events = {};
    this._handlers = {};
  }

  _.extend(EventEmitter.prototype, {
    on: function (eventName, handler) {

      if (typeof eventName !== 'string' || typeof handler !== 'function') {
        throw new Error('First param should be a String, Second parameter should be an function');
      }

      var hash = _.hash(eventName + handler.toString());

      if (this._events.hasOwnProperty(eventName) && !this._handlers.hasOwnProperty(hash)) {
        this._events[eventName].push(hash);
      } else if (!this._handlers.hasOwnProperty(hash)) {
        this._events[eventName] = [hash];
      }

      this._handlers[hash] = handler;
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

        delete this._handlers[hash];
      } else {
        this._events[eventName].forEach(function (hash) {
          delete this._handlers[hash];
        }, this);

        delete this._events[eventName];
      }
    },

    emit: function (eventName) {
      if (this._events.hasOwnProperty(eventName)) {
        var args = Array.prototype.slice.call(arguments, 1);

        this._events[eventName].forEach(function (hash) {
          this._handlers[hash].apply(null, args);
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