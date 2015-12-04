/** @namespace global */
(function (global) {
  'use strict';

  function checkArgs(str, fn) {
    if (typeof str !== 'string' || typeof fn !== 'function') {
      throw new Error('First param should be a String, Second parameter should be an function');
    }
  }

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
    }
  };

  /**
   * EventEmitter - provides event-driven system
   * @class
   * @constructor
   * @memberof global
   */
  function EventEmitter(settings) {
    settings = settings || {};

    this._groups = {};
    this._eventMap = {};
    this._registredListenersCount = 0;
    this._maxListeners = settings.maxListeners || 20;
    this._logger = settings.logger || console;
  }

  _.extend(EventEmitter.prototype, {
    _offEventGroup: function (event, group) {
      var beforeLength = this._eventMap[event].length;
      this._eventMap[event] = this._eventMap[event].filter(_.notGroup, group);
      var afterLength = this._eventMap[event].length;

      var indexEvent = this._groups[group].indexOf(event);
      this._groups[group].splice(indexEvent, 1);

      this._registredListenersCount -= beforeLength - afterLength;
    },

    _offGroup: function (group) {
      var groupEvents = _.arrayCopy(this._groups[group]);

      groupEvents.forEach(function (event) {
        this._offEventGroup(event, group);
      }, this);

      delete this._groups[group];
    },

    _off: function (event, handler) {
      if (typeof handler === 'function') {
        var handlerIndex = _.indexOf(this._eventMap[event], function (meta) {
          return meta.handler === handler;
        });

        if (~handlerIndex) {
          this._eventMap[event].splice(handlerIndex, 1);
        }
        this._registredListenersCount--;
      } else {
        var length = this._eventMap[event];

        this._registredListenersCount -= length;
        delete this._eventMap[event];
      }
    }
  });

  _.extend(EventEmitter.prototype,
    /**
     * @lends EventEmitter.prototype
     * @memberof global
     */
    {
      /**
       * Method provide ability to subscribe on some event by name and react on it by handler
       * @method
       * @param {string} eventName
       * @param {function} handler
       */
      on: function (eventName, handler) {
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
      },

      /**
       * Method allows to remove subscription for specify handler of all event if handler is not defined
       * @method
       * @param {string} eventName
       * @param {function} [handler]
       */
      off: function (eventName, handler) {
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
          this._off(eventName, handler);
        }
      },

      /**
       * Method allows to subscribe on some event and unsubscribe automatically after event will happen
       * @method
       * @param {string} eventName
       * @param {function} handler
       */
      once: function (eventName, handler) {
        checkArgs(eventName, handler);

        var self = this;
        self.on(eventName, decorator);

        function decorator() {
          try {
            handler.apply(this, arguments);
          } finally {
            self.off(eventName, decorator);
          }
        }
      },

      /**
       * Method allows to trigger all handler which are subscribed on some event and also pass any number of arguments
       * @method
       * @param {string} eventName
       * @param {arguments} List of arguments
       */
      emit: function (eventName) {
        if (this._eventMap[eventName]) {
          var args = Array.prototype.slice.call(arguments, 1);

          _.each(this._eventMap[eventName], function (meta) {
            meta.handler.apply(null, args);
          }, this);
        }
      },

      /**
       * Method allows to get max listeners count
       * @method
       * @returns {number} Returns max listeners count
       */
      getMaxListeners: function () {
        return this._maxListeners;
      },

      /**
       * Method allows to set max listeners count
       * @method
       * @param {number} number of max listeners count
       */
      setMaxListeners: function (listenersCount) {
        if (listenersCount > 0) {
          this._maxListeners = listenersCount;
        }
      },

      toString: function () {
        return '[object EventEmitter]';
      }
    });

  //on several declaration
  _.extend(EventEmitter.prototype,
    /**
     * @lends EventEmitter.prototype
     * @memberof global
     */
    {
      /**
       * Method provide ability to subscribe one handler on several event
       * @method
       * @param {Array} eventList
       * @param {function} handler
       */
      onSeveral: function (eventList, handler) {
        if (Array.isArray(eventList)) {
          _.each(eventList, function (event) {
            this.on(event, handler);
          }, this);
        }
      },

      /**
       * Method allows to remove subscription from several events (second parameter handler)
       * @method
       * @param {Array} eventList
       * @param {function} [handler]
       */
      offSeveral: function (eventList, handler) {
        if (Array.isArray(eventList)) {
          _.each(eventList, function (event) {
            this.off(event, handler);
          }, this);
        }
      },

      /**
       * Method allows to trigger all handler which are subscribed on several events and also pass any number of arguments
       * @method
       * @param {string} eventName
       * @param {arguments} List of arguments
       */
      emitSeveral: function (eventList) {
        if (Array.isArray(eventList)) {
          var args = Array.prototype.slice.call(arguments, 1);

          _.each(eventList, function (eventName) {
            var innerArgs = [eventName];
            innerArgs.push.apply(innerArgs, args);

            this.emit.apply(this, innerArgs);
          }, this);
        }
      }
    });

  if (typeof module !== undefined) {
    module.exports = EventEmitter;
  } else if (typeof exports !== undefined) {
    exports.EventEmitter = EventEmitter;
  } else {
    global.EventEmitter = EventEmitter;
  }
})((function () {
  return this;
})());