---
title: Batch Normalization
cover: /gallery/covers/batch-norm.jpg
toc: true
date: 2021-09-03 15:00:00
updated: 2021-09-03 15:00:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning

---
<!-- omit in toc -->

此处记录对于 Batch Normalization 的学习。

<!-- more -->

## 神经网络中存在的 ICS 问题

深度学习中存在 Internal Covariate Shift (ICS) 的问题。
类比迁移学习中的 Covariate Shift 指源领域和目标领域数据 marginal distribution 的偏移。
这里 ICS 指神经网络中，由于参数的变化，引起的每一层输出分布的差异变化，换句话说之后下一层的输入在参数变化后，可能基于了另一个分布。
所以下一层在训练过程中就需要不断的去适应这种变化。

于是带来了以下问题：
- 后面一层的参数需要适应不断变化的分布，训练效率降低。
- 对于饱和非线性激活函数，例如 sigmoid 和 tanh，容易落入饱和区。饱和区是指由于输入值极度偏离0点，导致梯度计算接近于0，从而难以起到学习效果。

## 如何解决 ICS 问题

此类由于分布变化带来不良影响的问题，最 naive 的解决方式一般来说都是对分布进行限制。
就比如在迁移学习中，会将源域和目标域的样本来做一个统一（减小分布差异）。
在 ICS 问题中，也可以对分布进行限制。

最初，白化（whitening）被提出，一般来说采用 [PCA](http://ufldl.stanford.edu/tutorial/unsupervised/PCAWhitening/) 或者 ZCA 的方法，使所有特征分布均值为0，方差为1（PCA）或相同（ZCA）。
白话的目的是去除数据特征之间相关性（独立），同时使其具有相同均值和方差（同分布）。
这样每一层网络的输入分布被固定，加速网络收敛。

但是白化也存在一些问题：
- 计算成本高
- 改变数据表达能力，一些参数信息会被丢失
- 不可微，难以通过反向传播训练

所以说我们期望有一种计算代价低廉，且能使标准化的数据尽可能保有表达能力的方法。
这就是 Batch Normalization 提出的背景。

## 什么是 Batch Normalization

主要思路：
- 既然白化计算过程比较复杂，那我们就放松限制一点，尝试只单独对每个特征进行标准化，使其均值为0，方差为1。
- 既然类白化操作减弱了网络中每一层输入数据表达能力，那再加入线性变换操作，让这些数据再能够尽可能恢复本身的表达能力，使其不因规范化而下降。

通用变换框架如下所示，包含两次平移和伸缩变换，在使用 BN 之后，每层神经元输入的样本的均值仅由 $\boldsymbol{b}$ 决定，而不像之前由前面一层神经网络复杂的参数决定：
$$
h=f\left(\boldsymbol{g}\cdot\frac{\boldsymbol{x}-\boldsymbol{\mu}}{\boldsymbol{\sigma}}+\boldsymbol{b}\right)\\
$$

但是好像这个第二次的仿射变换在理论上是否有用，需不需要用还有争议，日后可以再仔细看一下。（挖坑）

同时 BN 有一些变体，在这里不展开了：
- 纵向规范化（最基础）
- 横向规范化
- 参数规范化
- 余弦规范化

## 如何使用 Batch Normalization

适用场景：
- 每个 mini-batch 比较大，数据分布比较接近。
- 在进行训练之前，要做好充分的 shuffle， 否则效果会差很多。
- 因此不适用于 动态的网络结构 和 RNN 网络

测试阶段：
- 保留训练时每一个 batch 的统计量 $\mu_{batch}$ 和 $\sigma^2_{batch}$。
- 使用整个样本的统计量来对Test数据进行归一化，具体来说使用均值与方差的无偏估计。
  - $\mu_{test}=\mathbb{E} (\mu_{batch})$
  - $\sigma^2_{test}=\frac{m}{m-1}\mathbb{E}(\sigma^2_{batch})$

构建阶段：
- 置于 Conv 层或全连接层之后
- 对于饱和非线性激活函数而言，BN 层需要放到 activation 之前。Dropout 则应当置于 activation layer 之后.
- 对于 ReLU 而言，目前并没有定论，不管是实验还是理论争论都比较多，目前看来 BN 放在 ReLU 之后可能表现更好，但是放在 ReLU 前的可能更多一些（BN 原论文是放在了前面）。（**大误**）

## 在 Pytorch 中的 Batch Normalization

在 Pytorch 的实现中，BN 也包含两次平移和伸缩变换，其中第二次变换可以通过调整仿射变换参数 `affine=True` 选择是否打开。
这里可能也体现了这个仿射变换是否有必要的争议。

## Reference

- [详解深度学习中的Normalization，BN/LN/WN - Juliuszh的文章 - 知乎](https://zhuanlan.zhihu.com/p/33173246)
- [Batch Normalization原理与实战 - 天雨粟的文章 - 知乎](https://zhuanlan.zhihu.com/p/34879333)
- [Batch Normalization 和激活函数的使用顺序是什么，神经元的饱和指的又是什么？ - 无双谱的回答 - 知乎](https://www.zhihu.com/question/318354788/answer/640006790)
- https://pytorch.org/docs/stable/generated/torch.nn.BatchNorm2d.html
