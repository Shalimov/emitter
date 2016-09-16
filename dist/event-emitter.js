(function (global) {
  'use strict';

  function checkArgs(str, fn) {
    if (typeof str !== 'string' || typeof fn !== 'function') {
      throw new Error('First param should be a String, Second parameter should be a function');
    }
  }

  var _ = {
    each: function (collection, iterator, ctx) {
      var i, length;

      if (typeof collection === 'object' || typeof collection === 'string') {
        var keys = Object.keys(collection);

        for (i = 0, length = keys.length; i < length; i++) {
          var key = keys[i];
          if (iterator.call(ctx, collection[key], key, collection) === true) {
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

    inherits: function inherits(Child, Parent) {
      Child.prototype = Object.create(Parent.prototype, {
        constructor: {
          value: Child
        }
      });

      Child._super = Parent.prototype;
    },

    indexOf: function (collection, iterator) {
      var index = -1;

      this.each(collection, function (val, i, coll) {
        if (iterator(val, i, coll)) {
          index = i;
          return true;
        }
      });

      return index;
    },

    contains: function (str, substr) {
      return !!~str.indexOf(substr);
    },

    arrayCopy: function (array) {
      return Array.prototype.slice.call(array);
    },

    notGroup: function (meta) {
      return meta.group !== this;
    },

    notEvent: function (event) {
      return event !== this;
    }
  };

    function EventEmitter(settings) {
    settings = settings || {};

    this._groups = {};
    this._eventMap = {};
    this._registredListenersCount = 0;
    this._maxListeners = settings.maxListeners || 10;
    this._logger = settings.logger || console.warn.bind(console);
    this._emit = settings.async ? this._emitAsync : this._emitSync;
    this._asyncQueue = settings.async ? [] : null;
  }

  function applyEmit(args) {
    this._emitSync.apply(this, args);
  }

  function timeoutCallback(self) {
    self._asyncQueue.forEach(applyEmit, self);
    self._asyncQueue.length = 0;
  }

  _.extend(EventEmitter.prototype, {
    _emitAsync: function (eventName) {
      if (!this._asyncQueue.length) {
        setTimeout(timeoutCallback, 0, this);
      }

      this._asyncQueue.push(arguments);
    },

    _emitSync: function (eventName) {
      if (this._eventMap[eventName]) {
        var args = Array.prototype.slice.call(arguments, 1);
        var stop = false;
        var eventDescriptor = {
          event: eventName,
          group: null,
          stop: function () {
            stop = true;
          }
        };

        _.each(this._eventMap[eventName], function (meta) {
          eventDescriptor.group = meta.group;
          meta.handler.apply(eventDescriptor, args);
          return stop;
        }, this);
      }
    },

    _on: function (eventName, handler) {
      checkArgs(eventName, handler);
      var eventMap = this._eventMap;
      var group;

      if (_.contains(eventName, '.')) {
        var splitted = eventName.split('.');
        var groups = this._groups;
        group = splitted[1];
        eventName = splitted[0];

        if (groups[group]) {
          groups[group].push(eventName);
        } else {
          groups[group] = [eventName];
        }
      }

      if (eventMap[eventName]) {
        eventMap[eventName].push({
          group: group,
          handler: handler
        });
      } else {
        eventMap[eventName] = [{
          group: group,
          handler: handler
        }];
      }

      this._registredListenersCount++;

      if (this._registredListenersCount > this._maxListeners && this._logger) {
        this._logger('Potentially memory leak was detected, max listeners count [' + this._maxListeners +
          '], registred [' + this._registredListenersCount + ']'
        );
      }
    },

    _off: function (eventName, handler) {
      var group;

      if (_.contains(eventName, '.')) {
        var splitted = eventName.split('.');
        eventName = splitted[0];
        group = splitted[1];
      }

      if (eventName && group) {
        this._offEventGroup(eventName, group);
      } else if (group) {
        this._offGroup(group);
      } else {
        this._offEvent(eventName, handler);
      }
    },

    _offEventGroup: function (event, group) {
      if (!this._groups[group] || !this._eventMap[event]) return;

      var beforeLength = this._eventMap[event].length;
      this._eventMap[event] = this._eventMap[event].filter(_.notGroup, group);
      var afterLength = this._eventMap[event].length;

      this._groups[group] = this._groups[group].filter(_.notEvent, event);

      this._registredListenersCount -= beforeLength - afterLength;
    },

    _offGroup: function (group) {
      if (!this._groups[group]) return;

      var groupEvents = _.arrayCopy(this._groups[group]);

      _.each(groupEvents, function (event) {
        this._offEventGroup(event, group);
      }, this);

      delete this._groups[group];
    },

    _offEvent: function (event, handler) {
      if (typeof handler === 'function' && this._eventMap[event]) {
        var handlerIndex = _.indexOf(this._eventMap[event], function (meta) {
          return meta.handler === handler;
        });

        if (~handlerIndex) {
          this._eventMap[event].splice(handlerIndex, 1);
        }
        this._registredListenersCount--;
      } else if (this._eventMap[event]) {
        var length = this._eventMap[event].length;

        _.each(this._eventMap[event], function (meta) {
          if (!meta.group) return;

          var group = this._groups[meta.group];
          var eventIndex = group.indexOf(event);

          group.splice(eventIndex, 1);
        }, this);

        this._registredListenersCount -= length;
        delete this._eventMap[event];
      }
    }
  });

  _.extend(EventEmitter.prototype,
        {
            on: function (eventNameList, handler) {
        if (Array.isArray(eventNameList)) {
          _.each(eventNameList, function (event) {
            this._on(event, handler);
          }, this);
        } else {
          this._on(eventNameList, handler);
        }

        return this;
      },

            off: function (eventNameList, handler) {
        if (Array.isArray(eventNameList)) {
          _.each(eventNameList, function (event) {
            this._off(event, handler);
          }, this);
        } else {
          this._off(eventNameList, handler);
        }

        return this;
      },

            many: function (eventNameList, handler, times) {
        var self = this;
        var counter = 0;
        times = times < 1 || typeof times !== 'number' ? 1 : times;

        self.on(eventNameList, decorator);

        function decorator() {
          try {
            handler.apply(this, arguments);
          } finally {
            counter++;
            if (times <= counter) {
              self.off(eventNameList, decorator);
            }
          }
        }

        return self;
      },

            once: function (eventNameList, handler) {
        return this.many(eventNameList, handler, 1);
      },

            emit: function () {
        return this._emit.apply(this, arguments);
      },

            hasEvent: function (eventName) {
        return this._eventMap.hasOwnProperty(eventName);
      },

            hasGroup: function (groupName) {
        return this._groups.hasOwnProperty(groupName);
      },

            getMaxListeners: function () {
        return this._maxListeners;
      },

            setMaxListeners: function (listenersCount) {
        if (listenersCount > 0) {
          this._maxListeners = listenersCount;
        }
      },

      toString: function () {
        return '[object EventEmitter]';
      }
    });

  _.extend(EventEmitter.prototype, {
    addEventListener: EventEmitter.prototype.on,
    removeEventListener: EventEmitter.prototype.off,
    trigger: EventEmitter.prototype.emit
  });

  _.extend(EventEmitter, {
    isEventEmitter: function (obj) {
      return obj instanceof EventEmitter;
    }
  });

  function GroupAPI(eventEmitter, group) {
    this.eventEmitter = eventEmitter;
    this.group = group.charAt(0) !== '.' ? '.' + group : group;
  }

  _.extend(GroupAPI.prototype, {
    on: function (eventNameList, handler) {
      var transformedEvenList;

      if (Array.isArray(eventNameList)) {
        transformedEvenList = eventNameList.map(function (eventName) {
          return eventName + this.group;
        }, this);
      } else {
        transformedEvenList = eventNameList + this.group;
      }

      this.eventEmitter.on(transformedEvenList, handler);
    },

    emit: function () {
      this.eventEmitter.emit.apply(this.eventEmitter, arguments);
    },

    off: function () {
      this.eventEmitter.off(this.group);
    }
  });

  _.extend(EventEmitter.prototype, {
    group: function (group) {
      return new GroupAPI(this, group);
    }
  });

    function ExtendedEventEmitter() {
    EventEmitter.call(this);

    this._before = new EventEmitter();
    this._after = new EventEmitter();
  }

  _.inherits(ExtendedEventEmitter, EventEmitter);

  _.extend(ExtendedEventEmitter.prototype, {
    before: function () {
      this._before.on.apply(this._before, arguments);
    },

    after: function () {
      this._after.on.apply(this._after, arguments);
    },

    offBefore: function () {
      this._before.off.apply(this._before, arguments);
    },

    offAfter: function () {
      this._after.off.apply(this._after, arguments);
    },

    _emitSync: function (eventName) {
      if(!this.hasEvent(eventName)) {
          return;
      }

      this._before.emit(eventName);
      this.constructor._super._emitSync.apply(this, arguments);
      this._after.emit(eventName);
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = ExtendedEventEmitter;
  } else if (typeof exports !== 'undefined') {
    exports.EventEmitter = ExtendedEventEmitter;
  } else {
    global.EventEmitter = ExtendedEventEmitter;
  }
})(new Function('return this')());
