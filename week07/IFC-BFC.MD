# IFC

### inline

1. respect left & right margins and padding, but not top & bottom
2. cannot have a width and height set
3. allow other elements to sit to their left and right.
4. see very important side notes on this here.

### block

- respect all of those
- force a line break after the block element
- acquires full-width if width not defined

### inline-block

- allow other elements to sit to their left and right
- respect top & bottom margins and padding
- respect height and width

# block

1. block container: 里面有 BFC 的
   - 能够容纳正常流的盒, 里面就有 BFC
   - display: block
   - display: inline-block
   - flex item
   - table cell
   - etc
2. block-level Box: 外面有 BFC 的
   - 能放进 BFC 的盒子
   - display: block vs inline-block
   - display: flex vs
   - display: table vs
   - etc
3. Block Box
   - 里外都有 BFC

## 什么时候会创建 BFC

- floats
- absolute position
- block container 当然会创建 BFC
- block boxes with 'overflow' other than 'visible'

## BFC

# BFC 合并 (block box && overflow:visible)

- BFC 合并 边距折叠
- BFC 合并 float

BFC 合并的例子再[BFC.html](./BFC.html)

##

IFC 就是排行
BFC 就是排列
