# Object

这就意味着，所有的 Object 都有内部方法。

- [[GetPrototypeOf]]
- [[SetPrototypeOf]]
- [[IsExtensible]]
- [[PreventExtensions]]
- [[GetOwnProperty]]
- [[DefineOwnProperty]]
- [[HasProperty]]
- [[Get]]
- [[Set]]
- [[Delete]]
- [[OwnPropertyKeys]]

简单说明下内部方法[[DefineOwnProperty]]和 `Object.defineProperty()`的区别。`Object.defineProperty()` 执行时候，JS 引擎会内部调用[[DefineOwnProperty]]。
ECMAScript Spec: https://tc39.es/ecma262/#sec-definepropertyorthrow

# Function / GeneratorFunction / AsyncGeneratorFunction

Function 当然拥有一切 Object 的内部方法， 另外还多两个。
Spec:https://tc39.es/ecma262/#sec-ecmascript-function-objects

- [[Call]]
- [[Construct]]
- [[Environment]]
- [[FormalParameters]]
- etc

# String

https://tc39.es/ecma262/#sec-properties-of-string-instances

- [[StringData]]

# RegExp

-[[RegExpMatcher]], [[OriginalSource]], and [[OriginalFlags]]

# Symbol

- [[SymbolData]]

# Error

- [[ErrorData]]

# Number / BigInt

- [[NumberData]] / [[BigIntData]]

# Date

- [[DateValue]]

# Array

Array 当然拥有一切 Object 的内部方法.

我没有在 spec 找到任何关于 Array 独有的内部方法.

# TypedArray

- [[TypedArrayName]]
- [[ViewedArrayBuffer]]
- [[ByteLength]]
- [[ByteOffset]]
- [[ArrayLength]]

# Map

Map 当然拥有一切 Object 的内部方法.
https://tc39.es/ecma262/#sec-properties-of-map-instances

- [[MapData]]

# Set

Set 当然拥有一切 Object 的内部方法.
https://tc39.es/ecma262/#sec-properties-of-set-instances

- [[SetData]]

# WeakMap

WeakMap 当然拥有一切 Object 的内部方法.
https://tc39.es/ecma262/#sec-properties-of-weakmap-instances

- [[WeakMapData]]

# WeakSet

https://tc39.es/ecma262/#sec-properties-of-weakset-instances

- [[WeakSetData]]

# ArrayBuffer

https://tc39.es/ecma262/#sec-properties-of-the-arraybuffer-instances

- [[ArrayBufferData]]
- [[ArrayBufferByteLength]]
- [[ArrayBufferDetachKey]]

# SharedArrayBuffer

- [[ArrayBufferByteLength]]

# DataView

- [[DataView]], [[ViewedArrayBuffer]], [[ByteLength]], and [[ByteOffset]]

# AsyncGenerator

- [[AsyncGeneratorState]]
- [[AsyncGeneratorContext]]
- [[AsyncGeneratorQueue]]

# Generator

- [[GeneratorState]]
- [[GeneratorContext]]

# Promise

- [[PromiseState]]
- [[PromiseResult]]
- [[PromiseFulfillReactions]]
- [[PromiseRejectReactions]]
- [[PromiseIsHandled]]

# Proxy Revocation Functions

- [[RevocableProxy]]
