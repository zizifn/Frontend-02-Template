# CSS

1. at-rule
   - @charset
   - @import
   - @media
   - @page
   - @keyframe
2. rule

   - selector
     - selector group
     - simple_selector
       - type
         div p
       - \*
       - . class
       - '#' id #id
       - 属性 [attr=value]
       - : (:hover)
         伪类
       - ::
         伪元素
       - :not()
     - 复合选择器 （同时 match 是与的关系，中间没有空格）
       <简单选择器><简单选择器>
     - 复杂选择器
       - <sp> 祖先节点
       - > 父子
       - ~
       - +
       - ||
   - declaration
     - key
       - variables
       - properties
     - value
       - calc (method)
       - string
       - number

3. 优先级

   ```js
    //  https://specificity.keegan.st/
    // div#a.b .c[id=x]
   [0, 1, 3, 1]; // 属性选择器和class同级别
   // #a:not(#b)
   [0, 2, 0, 0]' // negation pseudo-class (:not()) have no effect on specificity
   // *.a
   [0, 0 , 1, 0];
   // div.a
   [0,0,1,1];
   ```
