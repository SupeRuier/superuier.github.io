---
title: Attention 和 Transformer
cover: /gallery/covers/attention.jpg
toc: true
date: 2022-09-30 16:00:00
updated: 2022-09-30 16:00:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning
- attention

---
<!-- omit in toc -->

注意力机制和 Transformer 在神经网络中已经取得了良好的表现，此处做一个简要的学习。
因为在自己的工作中并不会用到，所以此处可能更注重一些逻辑上的思路，以加强直观上的理解，具体细节有需要的时候再进行补充。

<!-- more -->

## Attention 机制是什么？

Attention 最初面对的是长程梯度消失以及中间隐变量信息含量有限的问题。
其通过将输入中的样本信息指导输出过程，来解决这一问题。
其有着参数少速度快效果好的优点。

Attention 做的事情简单来说就是“加权求和”：
- 对什么加权？对 feature 或者一系列输入信息加权。
- 权重是多少？权重为一个函数，而不是固定值。（若为固定值的话则可视为全连接层了。）一般来说这个权重即为 attention 分布，基于输入位置和输出位置的关联性。
- 求和得到什么？所需的输出。

<div style="width:80%;margin:auto">{% asset_img knowledge_is_power.gif 一个翻译任务的例子%}</div>

## Attention 定义

以下是 “Attention Is All You Need”【4】这篇重磅论文中给出的定义。
这个定义虽说是针对于他们的 scaled dot-product attention，但是整体来说整个 attention 都是一个思路，所以可以拿来作为定义。

$$
\operatorname{Attention}(Q, K, V)=\operatorname{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V
$$

即通过关系矩阵 $Q K^T$ 归一化得到的概率分布 $\operatorname{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right)$ 对 $V$ 进行重采样。
当然这个 $QKV$ 在不同场景下可能有着不同的具体含义。

## Multi-head attention

如下图所示。
简单来说就是将多个 scaled dot-product attention 的值拼接，再通过线形结合输出。

<div style="width:80%;margin:auto">{% asset_img multi-head-attention.png multi-head attention%}</div>

具体的，

$$
\operatorname{MultiHead}(Q, K, V)=\operatorname{Concat}\left(\operatorname{head}_1, \ldots\right., head \left._{\mathrm{h}}\right) W^O \\
where \quad \text{head}_i=\operatorname{Attention}\left(Q W_i^Q, K W_i^K, V W_i^V\right)
$$

## Transformer

其模型结构如下图所示。
Multi-head attention 是其主要组成部分。
在 attention 之外，样本的位置（顺序）信息使用 positional encoding 嵌入（因为不像 RNN 有顺序结构）。

<div style="width:50%;margin:auto">{% asset_img transformer.png transformer%}</div>

## Reference
1. [深度学习中Attention与全连接层的区别何在？ - SleepyBag的回答 - 知乎](https://www.zhihu.com/question/320174043/answer/651998472)
2. [Attention机制详解（一）——Seq2Seq中的Attention](https://zhuanlan.zhihu.com/p/47063917)
3. [目前主流的attention方法都有哪些？ - 电光幻影炼金术的回答 - 知乎](https://www.zhihu.com/question/68482809/answer/1876764572)
4. Vaswani, Ashish, et al. "Attention is all you need." Advances in neural information processing systems 30 (2017).
