---
title: 交叉熵小结
cover: /gallery/covers/cross-entropy.jpg
toc: true
date: 2021-08-09 21:54:55
updated: 2021-08-09 21:54:55
category:
- Math
tags:
- neural-network
- machine-learning
- loss

mathjax: true
---
<!-- omit in toc -->

这里对机器学习中常用到的交叉熵做一个总结。

<!-- more -->

## 信息论中的交叉熵

首先我们要定义一下信息熵。

$$H(X)=\mathbb{E}_{X}[I(x)]=\sum_{x \in \mathcal{X}} - p(x) \log _{2}\left({p(x)}\right)$$

其中$\mathcal{X}$为有限个事件$x$的集合，$X$是定义在$\mathcal{X}$上的随机变量。
信息熵是随机事件不确定性的度量，也可以看作是信息量的期望。
同时，信息熵是信源编码定理中，压缩率的下限。
当我们用少于信息熵的资讯量做编码，那么我们一定有资讯的损失。

交叉熵也是信息论中的一个概念。
典型情况下，$p$ 表示数据的真实分布，$q$ 表示数据的理论分布、估计的模型分布、或$p$的近似分布。
在此基础上定义交叉熵，

$$
H(p, q)=\mathrm{E}_{p}[-\log q]=H(p)+D_{\mathrm{KL}}(p \| q)
$$

其中 $H(p)$ 是 $p$ 的熵， $D_{\mathrm{KL}}(p \| q)$ 是从 $p$ 与 $q$ 的KL散度(也被称为 $p$ 相对于 $q$ 的相对熵。

$$
D_{\mathrm{KL}}(p \| q)=-\sum_{x} p(x) \ln \frac{q(x)}{p(x)}
$$

KL散度是两个概率分布 $p$ 和 $Q$ 差别的非对称性的度量。
其用来度量使用基于 $Q$ 的分布来编码服从 $p$ 的分布的样本所需的额外的平均比特数。

所以对于离散分布 $p$ 和 $q$, 这意味着其交叉熵为：
$$
H(p, q)=-\sum_{x} p(x) \log q(x)
$$

基于相同事件测度的两个概率分布 $p$ 和 $q$ 的交叉熵指，当基于一个“非自然”（相对于“真实”分布 $p$ 而言）的概率分布 $q$ 进行编码时，在事件集合中唯一标识一个事件所需要的平均比特数（bit）。
(说人话就是使用基于$q$的分布来编码服从$p$的分布的样本所需的平均比特数。)

## 机器学习中的交叉熵损失

机器学习中，常用交叉熵作为神经网络的损失函数。
其形式为，

$$
loss = -\sum_{i=1}^{n} y \log(\hat{y}_{i})
$$

其中$\hat{y}_{i}$是第 $i$ 个样本在不同类别上的概率，$y$ 是第 $i$ 个样本的真实标记（长度为 $c$ 的向量）。
神经网络中这个概率常常使用 softmax 函数，或者 sigmoid 函数得到。

## Pytorch 中实现交叉熵损失

在 pytorch 中有两种方式实现交叉熵损失。
可以参考之前的{% post_link programming/neural-network-loss 这篇笔记%}。
可以调用`NLLLoss()`或`CrossEntropyLoss()`两个函数。
两函数的不同点主要在于输入不同：
- 最后一层全连接层的输出可以直接调用`CrossEntropyLoss()`
- 对于`NLLLoss()`，要将最后一层全连接层的输出再通过一次`LogSoftmax()`计算才能调用。

同时如果类别不平衡也可以在每一个类别上加上相应的权重。

## 交叉熵的求导

因为之前要的工作要手动计算损失函数反向传播时对最后一层参数的梯度，所以需要对交叉熵损失求导。
此处我们只需要考虑对最后一层全连接层的输出求导即可，对参数可以之后再进一步求导。

先考虑一下正向的过程（在 n 个类别下使用 softmax 的情况），对于一个样本在最后一层全连接层的输出 $X = [x_1,...,x_n]$，我们考虑第 $i$ 个类，

$$
x_i
\xrightarrow[i_{th} output]{LogSoftmax}
- \ln (\frac{\exp (x_{i})}{\sum_{j=1}^{n} \exp (x_{j})}) 
\xrightarrow[]{Y}
- y_i \ln (\frac{\exp (x_{i})}{\sum_{j=1}^{n} \exp (x_{j})}) 
$$

当考虑所有类别时，一般是将最右端这一项加权平均或加权求和。
此处我们假设权重相等，对所有类别相加，则可以得到总损失。
$$
loss = - \sum_{i=1}^{n}y_i \ln (\frac{\exp (x_{i})}{\sum_{j=1}^{n} \exp (x_{j})}) = - y_c \ln (\frac{\exp (x_{i})}{\sum_{j=1}^{n} \exp (x_{j})}) 
$$

其中$y_c = 1$，指当前样本的真实标记是 $c$。

$$
loss = - \ln (\frac{\exp (x_{c})}{\sum_{j=1}^{n} \exp (x_{j})})  = - \ln(Softmax(x_c)) = - \ln(S(x_c))
$$

此处进行求导，

$$
\frac{\partial loss}{\partial x_i} = - \frac{1}{S(x_c)} \frac{\partial S(x_c)}{\partial x_i}
$$

而对于 softmax 函数求导需要分类讨论：
- 当$i=c$时, $\frac{\partial S(x_c)}{\partial x_i} = S(x_c)(1-S(x_c))$
- 当$i\neq c$时, $\frac{\partial S(x_c)}{\partial x_i} = - S(x_i)S(x_c)$

所以导数为：
- 当$i=c$时, $\frac{\partial loss}{\partial x_i} = S(x_i)-1$
- 当$i\neq c$时, $\frac{\partial loss}{\partial x_i} = S(x_i)-0$


## Reference

- [Cross entropy - From Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Cross_entropy)
- [Kullback–Leibler divergence - From Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Kullback–Leibler_divergence)
- [Information theory - From Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Information_theory)
- [Softmax以及Cross Entropy Loss求导](https://zhuanlan.zhihu.com/p/131647655)