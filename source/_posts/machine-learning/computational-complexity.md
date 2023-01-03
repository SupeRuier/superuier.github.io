---
title: 深度神经网络模型复杂度
index_img: /gallery/covers/computational-complexity.jpg
banner_img: /gallery/covers/computational-complexity.jpg
date: 2022-10-20 13:00:00
updated: 2022-10-20 13:00:00
category: 
- Machine Learning
toc: true
tags: 
- machine-learning
- deep-learning
- high-performance-computing

mathjax: true
---
<!-- omit in toc -->

深度学习计算量/复杂度相关知识。
个人在此方面的知识较少，导致上周高性能计算的讲座好多都没有听懂，在此做一个学习。

<!-- more -->


## 一些基础概念

首先介绍一些概念：
- FLOPS：floating point operations per second 的缩写，意指每秒浮点运算次数，理解为计算速度，是衡量硬件性能的指标。（常与 FLOPs 混淆）
- FLOPs：floating point operations 的缩写，意指浮点运算数，理解为计算量，可以用来衡量算法/模型的复杂度。
- MACs：multiply–accumulate operations，意为乘加计算数，通常与 FLOPs 存在一个两倍的关系。

关于什么是浮点数可以看这篇文章【2】，个人觉得深入浅出写的比较清晰。

## 如何计算

其实就是计算有多少次运算，对于不同的模型结构计算数目不同。
此处不涉及具体公式，仅介绍 FLOPs 计算思路，MACs（又乘又加）的话通常为 FLOPs 的两倍左右。

1. 卷积层：在卷积层参数数目的基础上乘以输出的 feature map 大小（输出的每一个 feature 都是通过一次卷积层得到的）。
2. 全联接层：即为全联接层参数数目。
3. 激活层：不同激活函数的计算量不同。通常来说不重点计算。

## Reference

1. [CNN 模型所需的计算力（flops）和参数（parameters）数量是怎么计算的？ - 泓宇的回答](https://www.zhihu.com/question/65305385/answer/451060549)
2. [浮点数浮点型到底是什么，能说的简单一点吗，就是用高中生能理解的语言。它们的作用是什么？ - 木木的回答](https://www.zhihu.com/question/425741425/answer/2584045783)
3. [CNN的参数量、计算量（FLOPs、MACs）与运行速度](https://blog.csdn.net/weixin_39833897/article/details/105807172)

