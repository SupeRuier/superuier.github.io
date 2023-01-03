---
title: Python
index_img: /gallery/covers/python.jpeg
banner_img: /gallery/covers/python.jpeg
date: 2020-12-15 12:56:03
updated: 2022-11-07 16:00:00
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

## 反射

反射是 Python 中很实用的一个功能，他可以通过字符串来导入模块和方法。

```python
package = importlib.import_module(f'{name_of_package}')
class_name = getattr(package, f'{name_of_class}')
class_instance = class_name() # Remember the instantiation.
```

参考这两篇博文：
- [Python 使用反射机制实例化对象](https://blog.csdn.net/lom9357bye/article/details/79107711)
- [Python 动态导入对象, importlib.import_module() 使用](https://blog.csdn.net/xie_0723/article/details/78004649)

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

## `~` 的使用与补码

使用 `~` 进行按位取反，包含符号位。

举例，5 的二进制为 0101：
- 各位取反，1010
- 变为负数，转化为其补码形式（符号位保持不变，各位取反，再加1）
  - 符号位不变，各位取反 1（1101）
  - 再加1（1110），也即 -6

```
>> ~5
>> -6
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

# 使用中的一些坑

## Terminal 传入 Boolean 类型的参数

由于传入的参数以 string 解析，所以还需要对 string 进行判断。

> sys.argv provides you the string representation of cmd line params. 
> 'True' and 'False' are both strings, and if a string has any content in it at all, the boolean representation is True. 
> You should simply change your condition to if test.lower() == 'true'

所以在习惯上还是尽量使用 json 文件传参数。
但是如果使用命令行进行调试时，还是需要输入。
所以目前的解决方案是在 argparse 中默认设置为 False，传入 True 则覆盖。

# 一些常见的报错

有一些经常遇到的报错，在此记录解决方案。

## ModuleNotFoundError: No module named 'xxx'

这个报错经常在服务器上调用子文件夹中的结果分析软件时得到，通常的原因是因为自建的module包所在路径不在 PYTHONPATH 下，此时把根目录路径加入即可。
参考此[博客链接](https://www.cnblogs.com/hi3254014978/p/15202910.html)。

```python
import sys
import os
# 把当前文件所在文件夹的父文件夹路径加入到 PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
```