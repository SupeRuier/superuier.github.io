---
title: Attention 和 Transformer
index_img: /gallery/covers/attention.jpg
banner_img: /gallery/covers/attention.jpg
toc: true
date: 2022-09-30 16:00:00
updated: 2023-04-04 02:00:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning
- attention

math: true

---
<!-- omit in toc -->

注意力机制和 Transformer 在神经网络中已经取得了良好的表现，此处做一个简要的学习。
因为在自己的工作中并不会用到，所以此处可能更注重一些逻辑上的思路，以加强直观上的理解，具体细节有需要的时候再进行补充。

<!-- more -->

## Sequence to sequence 是什么？

或需要先说清楚这件事，什么是序列到序列建模。
一般来说是存在一个 encoder 和一个 decoder。
Encoder 将序列数据（一个个排列整齐的 embedding/vector）编码成一个隐向量（supposed to 含有所有的信息），decoder 则将这个向量解码成一个序列（即我们目标任务的输出）。

首先 encoder 将输入序列编码成一个隐向量 $h_t=f\left(h_{t-1}, x_{t}\right)$，其中 $h_t$ 为隐向量，$x_t$ 为输入序列的第 $t$ 个元素。
Decoder 则将这个隐向量解码成一个序列 $y_t=g\left(y_{t-1}, h_t\right)$ 或者 $y_t=g\left(y_{t-1}\right)$，其中 $y_t$ 为输出序列的第 $t$ 个元素。

这种模式在机器翻译、语音识别、文本摘要等任务中都有应用。
通常来说，encoder 会使用 RNN，decoder 会使用 RNN 或者 CNN（根据不同的下游任务）。

## Attention 机制是什么？

Attention 面对的是 seq2seq 中长程梯度消失以及中间隐变量信息含量有限的问题。
其关键是利用输入中的样本信息指导输出过程，以解决遗忘输入信息这一问题。
其有着参数少速度快效果好的优点。
具体来说，attention 是在 decoder 中的一个模块，其将 encoder 中的信息加权求和成为一个背景信息（context vector）向量，作为 decoder 每次预测的附加输入。

Attention 做的事情简单来说就是“加权求和”：
- 对什么加权？对 feature 或者一系列输入信息加权。一般来说是隐含状态（hidden state）$\left(h_1, h_2, \ldots, h_T\right)$。
- 权重是多少？权重为一个函数，而不是固定值。
  （若为固定值的话则可视为全连接层了。）
  一般来说这个权重即为 attention 分布，基于输出位置和之前输入位置的关联性 $\overrightarrow{\alpha_t}=\operatorname{softmax}\left(\overrightarrow{e_t}\right)$。
  其中 $\overrightarrow{e_t}$ 为一个向量，其每个元素为一个评分，表示当前输出位置与之前输入位置的关联性。
- 求和得到什么？背景向量（context vector），$\overrightarrow{c_t}=\sum_{j=1}^T \alpha_{t j} h_j$
- 得到之后怎么用？将背景向量作为 decoder 的输入。$s_t=f\left(s_{t-1}, y_{t-1}, c_t\right)$，以及该位置的输出 $p\left(y_t \mid y_1, \ldots, y_{t-1}, \vec{x}\right)=g\left(y_{i-1}, s_i, c_i\right)$

<div style="width:80%;margin:auto">{% asset_img knowledge_is_power.gif 一个翻译任务的例子%}</div>

当 decoder 预测目标翻译的时候可以看到 encoder 的所有信息，而不仅局限于原来模型中定长的隐藏向量（例如 RNN 的中间向量），这样不会丧失长程的信息。
这个加权求和的过程不可以看作一个全连接层，因为全连接层的权重是固定的，而 attention 的权重是可学习的。
全连接的作用的是对一个实体进行从一个特征空间到另一个特征空间的映射，而注意力机制是要对来自同一个特征空间的多个实体进行整合。

## Attention 中权重的计算

以下是 “Attention Is All You Need”【4】这篇重磅论文中给出的 attention 定义。
这个定义虽说是针对于他们的 scaled dot-product attention，但是整体来说整个 attention 类型方法都是一个逻辑，所以下式可以拿来作为一个整体的计算思路。

$$
\operatorname{Attention}(Q, K, V)=\operatorname{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V
$$

即通过关系矩阵 $Q K^T$ 归一化得到的概率分布 $\operatorname{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right)$ 对 $V$ 进行重采样。
当然这个 $Q/K/V$ 在不同场景下可能有着不同的具体含义。
关系矩阵可以认为是 attention 的核心，其直接影响到权重，其计算方式有很多种，这里只是其中一种。

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
