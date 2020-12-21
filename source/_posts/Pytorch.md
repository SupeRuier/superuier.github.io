---
title: Pytorch 踩坑
date: 2020-12-09 14:55:50
categories:
- Programming
tags: Pytorch
---

使用 Pytorch 时学到的一些知识

<!-- more -->

# 用法

## nn.module 中 \_\_call\_\_ vs forward

call 方法中调用了 forward 函数，区别主要在于如果使用 forward 函数来进行前向传播，则无法使用 pytorch 提供的 hook 功能。

## NLLLoss & CrossEntropyLoss

从文档中：

> This CrossEntropyLoss criterion combines nn.LogSoftmax() and nn.NLLLoss() in one single class.

可以简单理解为：

Softmax + CrossEntropyLoss == LogSoftmax + NLLLoss

那我们为什么要用 LogSoftmax 呢？

因为在实现上，算log值更加便捷，如果直接计算指数值，可能会出现极大或者极其接近0的情况。
所以使用 LogSoftmax 的话数值稳定性可能会更好。
参考[此链接](https://www.zhihu.com/question/358069078/answer/912691444)。

# 设置
## Dataloader 中的 num_workers 造成训练循环缓慢

在本地跑实验，一个简单的网络的训练，发现 Dataloader 中 num_workers 设置的数目越大，在 batch 中训练越耗时，表示莫名其妙。在我的情形下将其设为8要比将其设为0慢了百倍以上。
仔细看了一下 mini-batch 的训练过程并且记录了一下时间，发现主要的时间开销发生于 for 循环遍历 loader 之后退出循环时。
所还还是将其设为了0。

造成这个的主要原因可能是 IO 耗时和模型前/后传耗时之间的 GAP 太大，导致进程间造成了阻塞，详见[这篇文章](https://bbs.cvmart.net/topics/2066)。

# 报错

## RuntimeError: CUDA error: device-side assert triggered

参考[此篇文章](https://cloud.tencent.com/developer/article/1686771)。

一般来说这个错误出现的原因是数据中的类标记label和网络中的类标记label不匹配。包括但不限于以下几种问题。

| pytorch识别的类别 | 数据中的类别 |
| ----------------- | ------------ |
| [0,1,2,3]         | [1,2,3,4]    |
| [0,1]             | [0,1,2,3]    |

解决方法只要找到矛盾发生的地方，对数据中类别的标签进行改动即可。当然有的时候也可能是网络格式写错。