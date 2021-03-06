---
title: Python
date: 2020-12-15 12:56:03
categories:
- Programming
tags: Python
---

常用到但是总忘记的的 Python 知识/语句

<!-- more -->

## 功能

### 格式化字符串

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

### 将 Traceback 信息保存到 log 文件中

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