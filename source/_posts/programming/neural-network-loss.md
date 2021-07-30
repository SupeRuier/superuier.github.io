---
title: 神经网络损失函数
cover: /gallery/covers/neural-network-loss.jpg
toc: true
date: 2021-07-30 15:16:55
updated: 2021-07-30 15:16:55
category:
- Programming
tags:
- Pytorch
- Python
- neural-network
- machine-learning

mathjax: true
---
<!-- omit in toc -->

由于总是忘记一些 loss 的常用场景和区别，此处记录一些常用的神经网络 loss。

<!-- more -->

Pytorch [官方文档](https://pytorch.org/docs/stable/nn.html#loss-functions)中有十余种 loss 函数，其中常用的主要是`CrossEntropyLoss`、`NLLLoss`、`MSELoss`等。
这里仅先对这些常用 loss 展开。

## NLLLoss

负对数损失，常用于分类任务。
值得注意的是，这里的输入 `X` 需要已经包含对于相应类别的 log-probability。
**使用这个 loss 的时候需要在模型最后加入 `LogSoftmax` 层。**

$$ 
l(X,y) = L = \{l_1,...,l_N\}^\top, \\
l_n = -w_{y_n}X_{n,y_n},
$$

其中 `X` 是输入，`y` 是目标，`w` 是类别的权重，`N` 是 batch size。

## CrossEntropyLoss

交叉墒损失，同样常用于分类任务。
这个标准结合了 LogSoftmax 和 NLLLoss 两个部分。

首相介绍一下 LogSoftmax，其包含 log 函数和 softmax 函数。

$$
\operatorname{LogSoftmax}\left(x_{i}\right)=\log \left(\frac{\exp \left(x_{i}\right)}{\sum_{j} \exp \left(x_{j}\right)}\right)
$$

对于交叉墒损失，值得注意的是，这里的输入 `X` 需要已经包含对每一个类，未经处理的 unformalized score。
**换句话说，使用这个 loss 的时候不需要在模型最后加入 `Softmax` 层。**

$$ 
\operatorname{loss}(x, \text { class })=-\log \left(\frac{\exp (x[\text { class }])}{\sum_{j} \exp (x[j])}\right)=-x[\text { class }]+\log \left(\sum_{j} \exp (x[j])\right)
$$

对于加权的情况，

$$
\operatorname{loss}(x, \text { class })=\text { weight }[\text { class }]\left(-x[\text { class }]+\log \left(\sum_{j} \exp (x[j])\right)\right)
$$

最终的 loss 需要加权平均得到，

$$
\operatorname{loss}(x, \text { class })=\text { weight }[\text { class }]\left(-x[\text { class }]+\log \left(\sum_{j} \exp (x[j])\right)\right)
$$

其中 `x` 是输入，`class` 是目标类，`weight` 是类别的权重，`N` 是 batch size。

