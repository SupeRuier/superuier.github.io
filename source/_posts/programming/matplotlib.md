---
title: Matplotlib 学习笔记
index_img: /gallery/covers/matplotlib.jpeg
banner_img: /gallery/covers/matplotlib.jpeg
date: 2021-09-24 15:00:03
updated: 2021-09-24 15:00:03
categories:
- Programming
tags: 
- Python
- Matplotlib
---

这里是个人的 Matplotlib 学习笔记。
记录一些作图的过程。

<!-- more -->

# 用法

## 减小空白边界

由于使用 Latex 排版时需要严格控制图片位置、大小、排布方式，所以任何冗余的空间都是需要极力避免的。
在做图的时候可以直接将图片空白边界抹去。

``` python
plt.savefig('test.png', bbox_inches='tight')
```

但是这个方法有一个问题就是多个图片的留白可能不一致，导致如果多子图放置于 latex 文档中会出现排版无法对齐的情况。
此时需要手动对边界进行设置。

``` python
plt.subplots_adjust(left=0.12, right=0.97, top=0.98, bottom=0.1)
```
