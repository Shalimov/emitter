# Simple EventEmitter for your FE(mb BE)

## How to install
```bower install is-emitter```

## What for?
It's a simple implementation of event emitter that helps you to implement observers in your application.
This implementation also provides an ability to classify events and split them by several groups.

## Lets go:

* [EventEmitter](#global.EventEmitter)
  * [new EventEmitter()](#new_global.EventEmitter_new)
  * [.on(eventNameList, handler)](#global.EventEmitter+on)
  * [.off(evenNameList, [handler])](#global.EventEmitter+off)
  * [.once(eventNameList, handler)](#global.EventEmitter+once)
  * [.many(eventNameList, handler, times)](#global.EventEmitter+many)
  * [.emit(eventName, List) => sync and async](#global.EventEmitter+emit)
  * [.getMaxListeners()](#global.EventEmitter+getMaxListeners)
  * [.setMaxListeners(number)](#global.EventEmitter+setMaxListeners)
* [```this``` inside event handler](#this-inside)
* [Angular JS Example](#angular-example)

<a name="new_global.EventEmitter_new"></a>
#### new EventEmitter()
EventEmitter - provides event-driven system

### Example:
```javascript
 var settings = {
  maxListeners: 10, //10 listeners by default
  async: false, //sync mode by default
  logger: console.warn.bind(console) //console warn by default
 };
 
 var emitter = new EventEmitter(settings);
```

<a name="global.EventEmitter+on"></a>
#### eventEmitter.on(eventNameList, handler)
#### eventEmitter.addEventListener(eventNameList, handler)

Method provide ability to subscribe on some event(s) by name and react on it(them) by handler

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventNameList | <code>string</code> &#124; <code>Array</code> | 
| handler | <code>function</code> |

### Examples:
```javascript
 var emitter = new EventEmitter();
 
 //register event
 emitter.on('event1', function (a, b) {
  console.log(this.event + ' : a + b: ' + (a + b)); 
 });
 
 //register several events
 emitter.on(['event2', 'event3'], function (a, b) { 
  console.log(this.event + ' : a + b: ' + (a + b)); 
 });
 
 emitter.emit('event1', 1, 2);
 //result: 'event1 : a + b: 3'
 
 emitter.emit('event2', 4, 5);
 //result: 'event2 : a + b: 9'
 
 //register event that is specially defined by using group name
 emitter.on('event4.somegroup', function () {
  console.log(this.event + '.' +  this.group + 'was emitted');
 });
 
 emitter.emit('event4');
 //result: 'event4.somegroup was emitted'
 
 //register group of event + classified them by using diff group names
 emitter.on(['event2.group1', 'event3.group2'], function (a, b) { 
   console.log(this.event); 
 });
 
 emitter.emit('event2');
 //result: 'event2'
 
 emitter.emit('event3');
 //result: 'event3'
```

<a name="global.EventEmitter+off"></a>
#### eventEmitter.off(eventNameList, [handler])
#### eventEmitter.removeEventListener(eventNameList, [handler])
Method allows to remove events from eventEmitter by eventName, eventName.group, .group, eventNameList

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| evenNameList | <code>string</code> &#124; <code>Array</code> | 
| [handler] | <code>function</code> | 

### Examples: 

```javascript
var emitter = new EventEmitter();

emitter.on(['event1', 'event2'], function () { 
 console.log('event1 or event2');
});

//you can get rid of these events by using of in this way
emitter.off('event1');
emitter.off('event2');

//or this way
emitter.off(['event1', 'event2']);

//Register classified events
emitter.on(['e1.group1', 'e2.group1', 'e3.group2', 'e4'], function () {
 console.log(this.event);
});

//Remove all events with .group1 classifier
emitter.off('.group1');

//Remove all events with .group2 and e4
emitter.off(['.group2', 'e4']);

emitter.on('e1.class1', function () { console.log('Hello World 1'); });
emitter.on('e1.class1', function () { console.log('Hello World 2'); });
emitter.on('e1', function () { console.log('hello world 3'); });

emitter.emit('e1');
//'Hello World 1'
//'Hello World 2'
//'hello world 3'

emitter.off('e1.class1');
emitter.emit('e1');
//'hello world 3'
```

<a name="global.EventEmitter+once"></a>
#### eventEmitter.once(eventNameList, handler)
Methods allows you to subscribe on some event(s) and remove subscription automatically after event(s) will happen (one time)

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventNameList | <code>string</code> &#124; <code>Array</code> | 
| handler | <code>function</code> |

### Example:
```javascript
var eventEmitter = new EventEmitter();
var counter = 0;

eventEmitter.once('event', function () {
 counter++;
});

eventEmitter.emit('event');
eventEmitter.emit('event');
eventEmitter.emit('event');

console.log(counter); // => 1
```

<a name="global.EventEmitter+many"></a>
#### eventEmitter.many(eventNameList, handler, times)
Methods allows you to subscribe on some event(s) and remove subscription automatically after event(s) will happen (several times)

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventNameList | <code>string</code> &#124; <code>Array</code> | 
| handler | <code>function</code> |
| times | <code>number</code> | 

### Example:
```javascript
var eventEmitter = new EventEmitter();
var counter = 0;

eventEmitter.many('event', function () {
 counter++;
}, 2);

eventEmitter.emit('event');
eventEmitter.emit('event');
eventEmitter.emit('event');
eventEmitter.emit('event');

console.log(counter); // => 2
```

<a name="global.EventEmitter+emit"></a>
#### eventEmitter.emit(eventName, argumentsList)
#### eventEmitter.trigger(eventName, argumentsList)
Method allows to trigger all handler which are subscribed on some event and also pass any number of arguments

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> |  |
| argumentsList | <code>arguments</code> | of arguments |

### Example Sync and Async mode: 
```javascript

//sync mode example
var ee = new EventEmitter();

ee.on('event', function () {
 console.log('hello world sync');
});

(function () {
 ee.emit('event');
 console.log('after hello world');
})();
//'hello world sync'
//'after hello world'

ee = null;
//////////////////////////////////////////////////////////////////////////////
//async mode example
var ee = new EventEmitter({async: true});

ee.on('event', function () {
  console.log('hello world async');
});

(function () {
 ee.emit('emit');
 console.log('hello world here but happens before emit result');
})();
//'hello world here but happens before emit result'
//'hello world async'

```

<a name="global.EventEmitter+getMaxListeners"></a>
#### eventEmitter.getMaxListeners()
Method allows to get max listeners count

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  
**Returns**: <code>number</code> - Returns max listeners count  
<a name="global.EventEmitter+setMaxListeners"></a>
#### eventEmitter.setMaxListeners(number)
Method allows to set max listeners count

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | of max listeners count |

<a name="this-inside"></a>
## ```this``` inside event handler

Explanation: 
```javascript
var ee = new EventEmitter();

ee.on('event', function () {
 this.event; //event -> string (name of event)
 this.group; //group -> string (name of group)
 this.stop; //stop -> function (method stops event propagation to other handlers)
});

```

Stop Example:
```javascript
var ee = new EventEmitter();

var counter = 1;
var handler = function () {
 console.log('Counter:HELLO');
 if(counter > 2) {
  counter = 1;
  this.stop();
 }
 counter++;
};

ee.on('event', handler);
ee.on('event', handler);
ee.on('event', handler);
ee.on('event', handler);
ee.on('event', handler);
ee.on('event', handler);

ee.emit('event'); // => results:
//'Counter:HELLO'
//'Counter:HELLO'

ee.emit('event'); // => results:
//'Counter:HELLO'
//'Counter:HELLO'

ee.off('event');
```

<a name="angular-example"></a>
## Angular Example

```javascript

(function (ng, EventEmitter) {
 'use strict';
 ng.module('yourAppModule')
  .factory('EventEmitterFactory', EventEmitterFactory)
  .factory('GlobalEventEmitter', GlobalEventEmitter)
  .factory('SomeServiceOfYourApp', SomeServiceOfYourApp)
  .directive('someDirective', someDirective); 
 
 function EventEmitterFactory() {
  return {
   create: function (settings) {
    return new EventEmitter(settings);
   }
  };
 }
 
 function GlobalEventEmitter(emitterFactory) {
  return emitterFactory.create();
 }
 
 //using with other services
 
 SomeServiceOfYourApp.$inject = ['GlobalEventEmitter'];
 function SomeServiceOfYourApp (emitter) {
  var state = null;
  
  return {
   setState: function (currState) {
    state = currState;
    emitter.emit('STATE_CHANGE', state);
   },
   
   onStateChange: function (componentName, handler) {
    //using group to mark registred handlers for component
    emitter.on('STATE_CHANGE.' + componentName, handler);
   };
   
   offStateChange: function (componentName) {
    //using remove event handler according to the specific group
    emitter.off('.' + componentName);
   };
  };
 }
 
 someDirective.$inject = ['SomeServiceOfYourApp'];
 function someDirective(someService) {
  return  {
   restrict: 'EA',
   link: function (scope) {
    someService.onStateChange('myDirectiveName', function () {
     console.log('hello world');
    });
    
    someService.onStateChange('myDirectiveName', function () {
     console.log('hello world 2');
    });
    
    scope.$on('$destroy', function () {
     //remove all handlers for this component
     someService.offStateChange('myDirectiveName');
    });
   }
  }
 }
 
})(angular, EventEmitter);

```

Use [jsbin](http://jsbin.com/xezuvowozo/edit?html,js,output) to see the example of using EventEmitter with angular routes  

## DOCS IN PROGRESS))
