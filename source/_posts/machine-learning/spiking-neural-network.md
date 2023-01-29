---
title: Spiking Neural Network
index_img: /gallery/covers/Spiking.jpg
banner_img: /gallery/covers/Spiking.jpg
toc: true
date: 2023-01-29 16:30:00
updated: 2023-01-29 16:30:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning
- spiking-neural-network

math: true
---
<!-- omit in toc -->

此处记录对于 Spiking Neural Network（脉冲神经网络）的学习。
SNN 号称是 BP 网络之后的第三代神经网络，名头很响，但好像并没有看到太多应用。
这里不求甚解，只希望把最基本的与 ANN 的对应关系简要了解。

<!-- more -->

#  Spiking Neural Network 脉冲神经网络

总的来说 SNN 与传统的 ANN 比较相似，不同点主要在于以下几个地方：
1. 信息载体使用脉冲而不是浮点数。
2. 神经元使用类膜电压变化来产生脉冲而不是乘加运算。
3. 主要使用突触可塑性而不是仅用 BP。

## 神经元基本运算

神经元由 ANN 中处理浮点数转化为 SNN 这里的处理脉冲信号。
<div style="width:70%;margin:auto">{% asset_img neural.jpg 神经元%}</div>

多受到刺激超过阈值时，生成新脉冲，并进入一段时间的不应期。
<div style="width:70%;margin:auto">{% asset_img neural_process.jpg 脉冲信号的处理%}</div>

## 模型如何训练

### 脉冲时间的可塑性

应用在脉冲神经网络的最常见的学习方法是依赖脉冲时间的可塑性(Spiking Time Dependency Plastic)，以下简称STDP。

突触的权重改变量依赖输入输出脉冲时间间隔。
如果存在因果性，则加大权重：
1. 如前神经元发出一个脉冲，后神经元紧接着产生了一个脉冲，前后脉冲时间差极小且为正值，其中有较强的因果性，其突触权重应该大大增加。
2. 当前神经元发出一个脉冲，过了很久后神经元也产生了一个脉冲，前后脉冲时间差极大，则其中因果关系不明显，突触权重不变化。
3. 当后神经元发出了一个脉冲，其处于不应期，这时前神经元输入了一个脉冲，脉冲时间差为负，其非因果，突触权重应大大减小。

在STDP中没有涉及到任何标签、误差信息，这是一种非监督学习。

### ANN 到 SNN 的转换

在输入上，要将输入信号编码为脉冲序列。
所有神经元用相应的 spiking neuron 替换，所得权重要进行量化。

### BP 算法

预估网络中得变化参数得梯度从而进行反向传播。
离散的输出不可导的，但是我们可以创造一个函数去逼近它，只要符号是对的，我们的梯度下降的方向就是对的，尽管不一定能最速下降，但好歹也能下降。
这样得算法虽然还存在争论但它确实在某种程度上降低了SNN得训练复杂度，这样得算法比如有 spikeprop, Slayer 等等。

# Reference

- [Spiking Neural Network简述 - Yannan的文章 - 知乎](https://zhuanlan.zhihu.com/p/260539428)
- [脉冲神经网络 (Spiking Neural Network) 解读 (一) - 科技猛兽的文章 - 知乎](https://zhuanlan.zhihu.com/p/416187474)
- [脉冲神经网络 Spiking Neural Network - 张丰麒的文章 - 知乎](https://zhuanlan.zhihu.com/p/485170683)

