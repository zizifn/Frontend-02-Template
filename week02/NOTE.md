学习笔记 (2020 年 7 月 12 日)

1. 学习了产生式 BNF 语法。
2. 学习了 JS 的基本类型。
   - Number
     理解了内部的标准 IEEE 754。
   - String
     - encode/decode
     - Unicode
       - UTF8/16 etc
   - etc
3. 学习了 JS 的对象。
4. 为了完成 “找出 JavaScript 标准里面所有具有特殊行为的对象”作业， 去看了 ECMAScript Spec,然后发现其实是可以看懂的。 这可能就是溯源吧。。

   - 如果想对某些 JS 的对象有深入了解，可以先去看 MDN 的基本用法，然后再去 Spec 找更深层次的解释。比如下面例子。

   > 简单说明下内部方法[[DefineOwnProperty]]和 `Object.defineProperty()`的区别。`Object.defineProperty()` 执行时候，JS 引擎会内部调用[[DefineOwnProperty]]。
   > ECMAScript Spec: https://tc39.es/ecma262/#sec-definepropertyorthrow

5. 估计后来的 JS 知识，也是需要去参考 Spec。。
