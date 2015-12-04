<a name="global"></a>
## global : <code>object</code>
**Kind**: global namespace  

* [global](#global) : <code>object</code>
  * [.EventEmitter](#global.EventEmitter)
    * [new EventEmitter()](#new_global.EventEmitter_new)
    * [.on(eventName, handler)](#global.EventEmitter+on)
    * [.off(eventName, [handler])](#global.EventEmitter+off)
    * [.once(eventName, handler)](#global.EventEmitter+once)
    * [.emit(eventName, List)](#global.EventEmitter+emit)
    * [.getMaxListeners()](#global.EventEmitter+getMaxListeners) ⇒ <code>number</code>
    * [.setMaxListeners(number)](#global.EventEmitter+setMaxListeners)
    * [.onSeveral(eventList, handler)](#global.EventEmitter+onSeveral)
    * [.offSeveral(eventList, [handler])](#global.EventEmitter+offSeveral)
    * [.emitSeveral(eventName, List)](#global.EventEmitter+emitSeveral)

<a name="global.EventEmitter"></a>
### global.EventEmitter
**Kind**: static class of <code>[global](#global)</code>  

* [.EventEmitter](#global.EventEmitter)
  * [new EventEmitter()](#new_global.EventEmitter_new)
  * [.on(eventName, handler)](#global.EventEmitter+on)
  * [.off(eventName, [handler])](#global.EventEmitter+off)
  * [.once(eventName, handler)](#global.EventEmitter+once)
  * [.emit(eventName, List)](#global.EventEmitter+emit)
  * [.getMaxListeners()](#global.EventEmitter+getMaxListeners) ⇒ <code>number</code>
  * [.setMaxListeners(number)](#global.EventEmitter+setMaxListeners)
  * [.onSeveral(eventList, handler)](#global.EventEmitter+onSeveral)
  * [.offSeveral(eventList, [handler])](#global.EventEmitter+offSeveral)
  * [.emitSeveral(eventName, List)](#global.EventEmitter+emitSeveral)

<a name="new_global.EventEmitter_new"></a>
#### new EventEmitter()
EventEmitter - provides event-driven system

<a name="global.EventEmitter+on"></a>
#### eventEmitter.on(eventName, handler)
Method provide ability to subscribe on some event by name and react on it by handler

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventName | <code>string</code> | 
| handler | <code>function</code> | 

<a name="global.EventEmitter+off"></a>
#### eventEmitter.off(eventName, [handler])
Method allows to remove subscription for specify handler of all event if handler is not defined

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventName | <code>string</code> | 
| [handler] | <code>function</code> | 

<a name="global.EventEmitter+once"></a>
#### eventEmitter.once(eventName, handler)
Method allows to subscribe on some event and unsubscribe automatically after event will happen

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventName | <code>string</code> | 
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
#### eventEmitter.getMaxListeners() ⇒ <code>number</code>
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

<a name="global.EventEmitter+onSeveral"></a>
#### eventEmitter.onSeveral(eventList, handler)
Method provide ability to subscribe one handler on several event

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventList | <code>Array</code> | 
| handler | <code>function</code> | 

<a name="global.EventEmitter+offSeveral"></a>
#### eventEmitter.offSeveral(eventList, [handler])
Method allows to remove subscription from several events (second parameter handler)

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type |
| --- | --- |
| eventList | <code>Array</code> | 
| [handler] | <code>function</code> | 

<a name="global.EventEmitter+emitSeveral"></a>
#### eventEmitter.emitSeveral(eventName, List)
Method allows to trigger all handler which are subscribed on several events and also pass any number of arguments

**Kind**: instance method of <code>[EventEmitter](#global.EventEmitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> |  |
| List | <code>arguments</code> | of arguments |

