# EventEmitter


## Install
``` bower install emitter```
## What for?
It's a simple implementation of event emitter that helps you to implement observers in your application.
This implementation also provide ability to classify event and split them by several groups.

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

<a name="global.EventEmitter+on"></a>
#### eventEmitter.on(eventNameList, handler)
Method provide ability to subscribe on some event(s) by name and react on it(them) by handler

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventNameList | <code>string</code> &#124; <code>Array</code> | 
| handler | <code>function</code> | 

<a name="global.EventEmitter+off"></a>
#### eventEmitter.off(evenNameList, [handler])
Method allows to remove events from eventEmitter by eventName, eventName.group, .group, eventNameList

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| evenNameList | <code>string</code> &#124; <code>Array</code> | 
| [handler] | <code>function</code> | 

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

