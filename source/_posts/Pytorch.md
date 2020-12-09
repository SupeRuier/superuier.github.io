---
title: Pytorch 踩坑
date: 2020-12-09 14:55:50
categories:
- Programming
tags: Pytorch
---

用 Pytorch 时出现一些坑，在此记录一下。

<!-- more -->

## Dataloader 中的 num_workers 造成训练循环缓慢

在本地跑实验，一个简单的网络的训练，发现 Dataloader 中 num_workers 设置的数目越大，在 batch 中训练越耗时，表示莫名其妙。在我的情形下将其设为8要比将其设为0慢了百倍以上。
仔细看了一下 mini-batch 的训练过程并且记录了一下时间，发现主要的时间开销发生于 for 循环遍历 loader 之后退出循环时。
所还还是将其设为了0。

造成这个的主要原因可能是 IO 耗时和模型前/后传耗时之间的 GAP 太大，导致进程间造成了阻塞，详见[这篇文章](https://bbs.cvmart.net/topics/2066)。

