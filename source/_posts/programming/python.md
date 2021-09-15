---
title: Python
cover: /gallery/covers/python.jpeg
date: 2020-12-15 12:56:03
updated: 2021-09-15 10:50:00
categories:
- Programming
tags: Python
---

这里是个人的 Python 学习笔记。
记录一些常用到但是总忘记的的 Python 知识/语句。
也写一下自己有且被解决的疑问。

<!-- more -->

# 用法

## 星号变量

单个星号代表这个位置接收任意多个非关键字参数，在函数的`*args`位置上将其转化成元组，而双星号代表这个位置接收任意多个关键字参数，在`**args`位置上将其转化成字典。

# 功能

## 格式化字符串

```python
## Basics             ## use "·" to visualize whitespace
"{} {}".format(1, 2)  ## "1·2"
f"{1} {2}"            ## "1·2"

## Padding and alignment
a = "test"
f"{a:10}"             ## "test······"
f"{a:<10}"            ## "test······"
f"{a:>10}"            ## "······test"
f"{a:^10}"            ## "···test···"
f"{a:_<10}"           ## "test______"

f"{a!s}"              ## equals to f"{str(a)}"
f"{a!r:10}"           ## f"{repr(a):10}"

## Floats
b = 0.5
f"{b:5}"              ## "··0.5" !!!
f"{b:<5}"             ## "0.5··"
f"{b!s:5}"            ## "0.5··"

f"{b:05}"             ## "000.5"
f"{b:.3f}"            ## "0.500"
f"{b:.3e}"            ## "5.000e-01"
f"{b:.2%}"            ## "50.00%"
```

Copy from Yu's [blog](https://yzhang-gh.github.io/notes/programming/python/python.html#作用域-scope).

## 将 Traceback 信息保存到 log 文件中

有时候要跑一个运行时间很长的文件，中间会创建 log 文件。
如果跑到一半报错终止，文件中却没有相应记录则很难追踪错误。
所以需要加入报错信息。

```python
import traceback

try:
    main() # The code need to be executed.
except Exception as e:
    logger.error(f"Main program error: {e}")
    logger.error(traceback.format_exc())
```

# 一些疑问及回答

## 同一个可迭代对象的多个迭代器是否独立？

独立。
这问题其实是在问生成的两个迭代器是不是指向同一个内存。
这个显然是不同的。
所以说用两个迭代器同时遍历一个列表，都会是从头开始。

需要注意的是在 pytorch 中，遍历 dataloader 需要使用迭代器。
此时如果用两个迭代器，在第一次迭代生成的样本可能不同。
这个其实是因为你在生成 dataloader 的时候可能传入 `shuffle = True`，所以在生成迭代器的时候会采用不同的顺序读区。
