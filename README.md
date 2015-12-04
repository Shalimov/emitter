# EventEmitter


## How to install
```bower install emitter```

## What for?
It's a simple implementation of event emitter that helps you to implement observers in your application.
This implementation also provide ability to classify event and split them by several groups.

## Lets go:

* [EventEmitter](#global.EventEmitter)
  * [new EventEmitter()](#new_global.EventEmitter_new)
  * [.on(eventNameList, handler)](#global.EventEmitter+on)
  * [.off(evenNameList, [handler])](#global.EventEmitter+off)
  * [.once(eventNameList, handler)](#global.EventEmitter+once)
  * [.emit(eventName, List)](#global.EventEmitter+emit)
  * [.getMaxListeners()](#global.EventEmitter+getMaxListeners)
  * [.setMaxListeners(number)](#global.EventEmitter+setMaxListeners)

<a name="new_global.EventEmitter_new"></a>
#### new EventEmitter()
EventEmitter - provides event-driven system

### Example:
```javascript
 var emitter = new EventEmitter();
```

<a name="global.EventEmitter+on"></a>
#### eventEmitter.on(eventNameList, handler)
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
  console.log('event1 : a + b: ' + (a + b)); 
 });
 
 //register several events
 emitter.on(['event2', 'event3'], function (a, b) { 
  console.log('event23: a + b: ' + (a + b)); 
 });
 
 emitter.emit('event1', 1, 2);
 //result: 'event1 : a + b: 3'
 
 emitter.emit('event2', 4, 5);
 //result: 'event23: a + b: 9'
 
 //register event that is specially defined by using group name
 emitter.on('event4.somegroup', function () {
  console.log('event4.somegroup was emitted');
 });
 
 emitter.emit('event4');
 //result: 'event4.somegroup was emitted'
 
 //register group of event + classified them by using diff group names
 emitter.on(['event2.group1', 'event3.group2'], function (a, b) { 
   console.log('event2 or event3'); 
 });
 
 emitter.emit('event2');
 //result: 'event2 or event3'
 
 emitter.emit('event2');
 //result: 'event2 or event3'
```

<a name="global.EventEmitter+off"></a>
#### eventEmitter.off(evenNameList, [handler])
Method allows to remove events from eventEmitter by eventName, eventName.group, .group, eventNameList

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| evenNameList | <code>string</code> &#124; <code>Array</code> | 
| [handler] | <code>function</code> | 

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
```

<a name="global.EventEmitter+once"></a>
#### eventEmitter.once(eventNameList, handler)
Methods allows you to subscribe on some event(s) and remove subscription automatically after event(s) will happen

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventNameList | <code>string</code> &#124; <code>Array</code> | 
| handler | <code>function</code> | 

<a name="global.EventEmitter+emit"></a>
#### eventEmitter.emit(eventName, List)
Method allows to trigger all handler which are subscribed on some event and also pass any number of arguments

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> |  |
| List | <code>arguments</code> | of arguments |

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

