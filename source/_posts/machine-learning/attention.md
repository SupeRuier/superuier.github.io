---
title: Attention 和 Transformer
index_img: /gallery/covers/attention.jpg
banner_img: /gallery/covers/attention.jpg
toc: true
date: 2022-09-30 16:00:00
updated: 2023-11-06 12:00:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning
- attention

math: true

---
<!-- omit in toc -->

注意力机制和 Transformer 在神经网络应用中已经取得了良好的表现，此处做一个简要的学习。
因为在自己的工作中并不会用到，所以此处更注重一些逻辑上的思路，以加强直观上的理解，具体细节有需要的时候再进行补充。
（题外话，翁小姐的博客简直是 GPT 的技术栈。）

<!-- more -->

> 2023-11 更新：描述准确性提升，修改了一些错误。

# Attention

## Sequence to sequence 是什么？

首先需要介绍序列到序列（Seq2seq）建模。
一般来说存在一个 encoder 和一个 decoder：
- Encoder 将序列数据（一个个排列整齐的 embedding/vectors）编码成一个隐向量（期望含有所有的输入信息）。可以写作 $h_t=f\left(h_{t-1}, x_{t}\right)$，其中 $h_t$ 为隐向量，$x_t$ 为输入序列的第 $t$ 个元素。
- Decoder 将 encoder 传来的隐向量解码成一个序列，即目标任务的输出。可以写作 $y_t=g\left(y_{t-1}, h_{t-1}\right)$，其中 $y_t$ 为输出序列的第 $t$ 个元素，$h_t$ 为隐向量。这个过程通常需要贪心重复，直到输出停止。

这种模式在机器翻译、语音识别、文本摘要等任务中都有应用。
通常来说，encoder 会使用 RNN，decoder 会使用 RNN 或者 CNN（根据不同的下游任务）。

## Attention 机制是什么？

Attention 面对的是 seq2seq 中长程梯度消失的问题。
其关键是允许模型在序列的任何位置直接访问其他位置的信息，从而解决了长距离依赖问题，有着参数少速度快效果好的优点。
具体来说，在 seq2seq 中 attention 是在 decoder 中的一个模块，其将 encoder 中的信息加权求和成为一个背景信息向量（context vector），作为 decoder 每次预测的附加输入。

Attention 做的事情简单来说就是“加权求和”：
- **对什么加权？** 一般来说是对隐含状态加权 $\left(h_1, h_2, \ldots, h_T\right)$。
- **权重是多少？** 权重为一个 attention 分布，而不是固定值，可以写作 $\overrightarrow{\alpha_t}=\operatorname{softmax}\left(\overrightarrow{e_t}\right)$，基于当前输出位置和之前输入位置的关联性 $\overrightarrow{e_t}$，其每个元素为一个评分。
- **求和得到什么？** 背景向量（context vector），$\overrightarrow{c_t}=\sum_{j=1}^T \alpha_{t j} h_j$
- **得到之后怎么用？** 将背景向量作为 decoder 的输入，得到当前位置的状态 $s_t=f\left(s_{t-1}, y_{t-1}, c_t\right)$，以及该位置的输出 $p\left(y_t \mid y_1, \ldots, y_{t-1}, \vec{x}\right)=g\left(y_{i-1}, s_i, c_i\right)$

<div style="width:80%;margin:auto">{% asset_img knowledge_is_power.gif 一个翻译任务的例子%}</div>

一些需要注意的点：
- Decoder 预测目标翻译的时候可以看到 encoder 的所有信息，而不仅局限于原来模型中定长的隐藏向量（例如 RNN 的中间向量），这样不会丧失长程的信息。
- 这个加权求和的过程不可以看作一个全连接层，因为全连接层的权重是固定的，而 attention 的权重是可学习的。
- 全连接的作用是对一个实体进行从一个特征空间到另一个特征空间的映射，而注意力机制是要对来自同一个特征空间的多个实体进行整合。

## Self-Attention 数学形式

{% note primary %}
An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.【4】
{% endnote %}

以下是 “Attention Is All You Need”【4】这篇重磅论文中给出的 attention 数学定义。
虽是针对于文中的 scaled dot-product attention，但是大部分 attention 都是一个逻辑，所以下式可以拿来作为一个整体的广义定义。

$$
\operatorname{Attention}(Q, K, V)=\operatorname{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V
$$

虽然理解分析的时候时我们使用的是向量，但考虑到整个序列，我们可以使用矩阵来同时处理多个向量。
先通过 $Q K^T$ 得到关系矩阵，再通过归一化得到概率分布 $\operatorname{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right)$ 对 $V$ 进行重采样。
过程可见下图（摘自台大李宏毅老师课件）：

<div style="width:80%;margin:auto">{% asset_img self-attention-1.png 自注意力运行方式%}</div>

<div style="width:80%;margin:auto">{% asset_img self-attention-2.png 自注意力矩阵形式%}</div>

对于提到的符号标记：
- $Q$ 为查询矩阵，用来描述当前位置。
- $K$ 为键矩阵，表示输入中的每个位置。
- $V$ 为值矩阵，表示输入中的每个位置的值。
- $d_k$ 为键矩阵和查询矩阵的维度，此处用来缩放权重。

需要注意的点：
- 在自注意力中 $Q/K/V$ 通常由相同的向量经过不同的线性变换得到。
- 关系矩阵 $Q K^T$ 可以认为是 attention 的核心，其直接影响到权重，其计算方式有很多种，这里的点乘只是其中一种。
- 这里的 attention 对应到上一小节可以理解为 context vector（同样为一个向量）。

## Multi-Head Attention

简单来说是将多个 scaled dot-product attention 的值拼接，再通过线形结合输出。
使用多个 head 是因为相关性可能不止一种，这样可以让模型学习到不同的关系。
不同的 head 需要先进行不同的线性变换，然后再进行 attention。
具体如下图所示。

<div style="width:80%;margin:auto">{% asset_img multi-head-attention.png multi-head attention%}</div>

具体的，

$$
\operatorname{MultiHead}(X_q, X_k, X_v)=\operatorname{Concat}\left(\operatorname{head}_1, \ldots\right., head \left._{\mathrm{h}}\right) W^O \\
where \quad \text{head}_i=\operatorname{Attention}\left(X_q W_i^Q, X_k W_i^K, X_v W_i^V\right)
$$

其中：
- 要对表征做线性变换，维度为 $W_i^Q \in \mathbb{R}^{d_{\text {model}} \times d_k}, W_i^K \in \mathbb{R}^{d_{\text {model}} \times d_k}, W_i^V \in \mathbb{R}^{d_{\text {model}} \times d_v}$, $W^O \in \mathbb{R}^{hd_v \times d_{\text {model}}}$.
- $h$ 为 head 的数目。
- 通常 $X_q, X_k, X_v$ 的维度为 $(n,d_{\text {model}})$。
- 通常 $d_k, d_v$ 与 $d_{\text {model}}$ 之间存在比例关系，即 $d_k = d_v = d_{\text {model}}/h$，以满足 concat 连接。


# Transformer 结构

模型结构如下图所示，包含 encoder 和 decoder 两部分，multi-head attention 是两者中的重要组成部分。
在 attention 之外，样本的位置（顺序）信息使用 positional encoding 嵌入（因为不像 RNN 有顺序结构）。

<div style="width:50%;margin:auto">{% asset_img transformer.png transformer%}</div>

## Encoder

{% note primary %}
Encoder 本质上做的事情：输入一个 vector sequence，输出另一个 vector sequence。
{% endnote %}

Encoder 由 N 层 encoder layer 组成，每个 encoder layer 有两个 sub-layer，分别是 multi-head attention 和 feed-forward。
- 原始输入是词向量组成的矩阵，维度 $(n,k)$，其中 $n$ 为句子长度，$k$ 为 embedding 的维度。
- 经过 positional encoding 嵌入，得到维度为 $(n,d_{model})$ 的矩阵。
- 对于每层 encoder layer：
  - 输入都先通过一个 multi-head attention layer，输入输出的维度都为 $d_{\text {model}}$。
  - 再做一次 residual connection 和 layer normalization，这一步之后输出的维度仍为 $d_{\text{model}}$。Layer norm 是对每个样本而不是对 batch 进行，即使得每一个样本所有 feature 均值为 0，方差为 1。
  - 之后再通过一个 feed-forward layer，以及一次 residual connection 和 layer normalization，输入输出的维度应当也为 $d_{\text {model}}$。
- 在多次通过 encoder layer 之后，将原始数据编码到维度为 $(n,d_{\text {model}})$ 的矩阵。

## Decoder

{% note primary %}
Decoder 本质上做的事情：读入 encoder 的输出，输入 "BEGIN"，逐项输出一系列概率向量并指向一个字符。
{% endnote %}

Encoder 由 N 层 decoder layer组成，每个 decoder layer 有三个 sub-layer，分别是两个 multi-head attention 和 feed-forward。
- 原始输入是原始的词向量组成的矩阵，以同样的方式经过 positional encoding 嵌入。
- 对于每层 decoder layer 
  - 输入都先通过一个 masked multi-head attention layer，再做一次 residual connection 和 layer normalization。mask 屏蔽掉当前位置后面的词，仅计算之前的 attention。
  - 再将输出再作为查询向量 $X_q$，将 encoder 中编码后的输入作为键值对 $(X_k,X_v)$，再通过一次 multi-head attention layer，再做一次 residual connection 和 layer normalization。
  - 之后再通过一个 feed-forward layer，做一次 residual connection 和 layer normalization。
- 将最终输出通过一个全连接层以及 softmax 得到概率输出，并得到输出的 token。

需要注意的点：
- Decoder 通常遵循一种自回归的模式（autoregressive），即前一时刻的输出要放到下一时刻的输入来进行预测。
- Decoder 必须自己决定何时停止输出，需要一个特殊的 token 来表示结束，可以 "END" 来表示。
- 在训练时，self-attention 的 mask 用来屏蔽掉当前时点后面的词，因为在预测时，后面的词是不可见的。
- 注意，encoder 和 decoder 的输入和输出都是一样的长度（词数）。

## 位置编码

在 Transformer 中，位置信息是通过 positional encoding 嵌入的。
其原理是将位置信息转换为向量，然后将其与原始的词向量相加。
给定一个位置 $i=1,2,\dots,L$ 和对应的 $\delta=1,2,\dots,d$，对应的 Positional Encoding $PE_{(i,j)}$ is defined as:

$$
\mathrm{PE}(i, \delta)= \begin{cases}\sin \left(\frac{i}{10000^{2 \delta^{\prime} / d}}\right) & \text { if } \delta=2 \delta^{\prime} \\ \cos \left(\frac{i}{10000^{2 \delta^{\prime} / d}}\right) & \text { if } \delta=2 \delta^{\prime}+1\end{cases}
$$

<div style="width:100%;margin:auto">{% asset_img sinoidual-positional-encoding.png positional encoding%}</div>

## Transformer 训练

和传统的机器学习没有本质的区别，同样是计算输出和 ground truth 的 cross-entropy，并最小化损失。

需要注意训练时 decoder 的输入是真实输出，而测试时 decoder 的输入是自己的输出。
由于训练时 decoder 只看到正确的训练数据，所以一旦测试时有输出错误，就会步步错，这个现象叫做exposure bias。
解决方式是训练时给 decoder 一些错误的答案（scheduled sampling），但是这样会伤害一些并行能力。

## Transformer 应用

- 基于编码器：Bert 作为特征提取器
- 基于解码器：GPT 系列大语言模型

# 其他变体与考虑

## 更长的文本？

### Memory

目前 vanilla transformer 的长度是有限的，因为其 attention 机制是基于位置的。
如果要处理更长的文本，可以使用加入 memory 的 transformer。
记忆机制的思想是，将之前的信息存储起来，然后在当前的输入中使用。
通常来说可以使用可微的记忆（Transformer-XL，类似 RNN 的循环）以及不可微的记忆（kNN）。
此处因为暂时不太会用得上，需要的时候再进行学习。

# Reference
1. [深度学习中Attention与全连接层的区别何在？ - SleepyBag的回答 - 知乎](https://www.zhihu.com/question/320174043/answer/651998472)
2. [Attention机制详解（一）——Seq2Seq中的Attention](https://zhuanlan.zhihu.com/p/47063917)
3. [目前主流的attention方法都有哪些？ - 电光幻影炼金术的回答 - 知乎](https://www.zhihu.com/question/68482809/answer/1876764572)
4. Vaswani, Ashish, et al. "Attention is all you need." Advances in neural information processing systems 30 (2017).
5. [OpenAI ChatGPT（一）：十分钟读懂 Transformer - 绝密伏击的文章 - 知乎](https://zhuanlan.zhihu.com/p/600773858)
6. [The Transformer Family Version 2.0](https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/)
7. [【機器學習2021】Transformer](https://www.youtube.com/watch?v=N6aRv06iv2g)