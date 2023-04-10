---
title: Attention 和 Transformer
index_img: /gallery/covers/attention.jpg
banner_img: /gallery/covers/attention.jpg
toc: true
date: 2022-09-30 16:00:00
updated: 2023-04-10 12:00:00
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
（题外话，翁小姐的博客简直是 GPT 的技术栈。）

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

## Attention 的定义的数学形式

{% note primary %}
An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.【4】
{% endnote %}

以下是 “Attention Is All You Need”【4】这篇重磅论文中给出的 attention 数学定义。
这个定义虽说是 particular 针对于他们的 scaled dot-product attention，但是整体来说整个 attention 类型方法都是一个逻辑，所以下式可以拿来作为一个整体的广义定义。

$$
\operatorname{Attention}(Q, K, V)=\operatorname{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V
$$

虽然理解分析的时候时我们使用的是向量，但是实际上考虑到整个序列，我们使用矩阵来同时处理多个向量。
即通过关系矩阵 $Q K^T$ 归一化得到的概率分布 $\operatorname{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right)$ 对 $V$ 进行重采样。
其中 $Q$ 为查询矩阵（可以使用上一个 hidden state，用来描述当前位置）。
$K$ 为键矩阵，表示输入中的每个位置。
$V$ 为值矩阵，表示输入中的每个位置的值。
$d_k$ 为键矩阵和查询矩阵的维度，此处用来缩放权重。
当然这个 $Q/K/V$ 在不同场景下可能有着不同的具体含义。
关系矩阵可以认为是 attention 的核心，其直接影响到权重，其计算方式有很多种，这里只是其中一种。
这里的 attention 对应到上一小节可以理解为 context vector（同样为一个向量）。

## Multi-head attention

如下图所示。
简单来说就是将多个 scaled dot-product attention 的值拼接，再通过线形结合输出，如下图所示

<div style="width:80%;margin:auto">{% asset_img multi-head-attention.png multi-head attention%}</div>

具体的，

$$
\operatorname{MultiHead}(Q, K, V)=\operatorname{Concat}\left(\operatorname{head}_1, \ldots\right., head \left._{\mathrm{h}}\right) W^O \\
where \quad \text{head}_i=\operatorname{Attention}\left(Q W_i^Q, K W_i^K, V W_i^V\right)
$$

映射参数为相应的矩阵， $W_i^Q \in \mathbb{R}^{d_{\text {model }} \times d_k}, W_i^K \in \mathbb{R}^{d_{\text {model }} \times d_k}, W_i^V \in \mathbb{R}^{d_{\text {model }} \times d_v}$ and $W^O \in \mathbb{R}^{h d_v \times d_{\text {model }}}$.
不同于直接使用表征 attention，这里要对表征做一个可学习的线性变换，然后再进行 attention。
此外，使用多次 attention 的目的是为了让模型能够学习到不同的关系，而不是仅仅依赖于一个关系。


## Transformer

其模型结构如下图所示。
Multi-head attention 是其主要组成部分。
在 attention 之外，样本的位置（顺序）信息使用 positional encoding 嵌入（因为不像 RNN 有顺序结构）。
下面我们来看看 Transformer 的具体结构。

<div style="width:50%;margin:auto">{% asset_img transformer.png transformer%}</div>

### Encoder

有 N 层 encoder layer，每个 encoder layer 有两个 sub-layer，分别是 multi-head attention 和 feed-forward。
原始输入是原始的词向量组成的矩阵，维度 $(n,k)$，其中 $n$ 为句子长度，$k$ 为 embedding 的维度。
经过 positional encoding 嵌入，得到维度为 $(n,d_k)$ 的矩阵。
$d_k$ 和 $d_v$ 通常相同，其 self-attention 里为输入的维度（因为查询空间和值空间相同）。
此外其与 $d_{\text {model}}$ 之间存在比例关系，即 $d_{\text {model}}/h=d_v$，以满足可以残差连接。

每层 encoder layer 输入都先通过一个 multi-head attention layer，再做一次 residual connection 和 layer normalization。
这一步之后输出的维度应当为 $d_{\text{model}}$。
之后再通过一个 feed-forward layer，再做一次 residual connection 和 layer normalization。
这一步之后输出的维度应当也为 $d_{\text {model}}$。
在多次通过 encoder layer 之后，将原始数据编码到维度为 $(n,d_{\text {model}})$ 的矩阵。

### Decoder

有 N 层 decoder layer，每个 decoder layer 有三个 sub-layer，分别是两个 multi-head attention 和 feed-forward。
原始输入是原始的词向量组成的矩阵，以同样的方式经过 positional encoding 嵌入。

每层 decoder layer 输入都先通过一个 multi-head attention layer，再做一次 residual connection 和 layer normalization。
之后将输出再作为查询向量 $Q$，将 encoder 中编码后的输入作为键值对 $(K,V)$，再通过一次 multi-head attention layer，再做一次 residual connection 和 layer normalization。
之后再通过一个 feed-forward layer，再做一次 residual connection 和 layer normalization。
在多次通过 encoder layer 之后，将输出通过一个全连接层以及 softmax 得到最终的概率输出。

需要注意的是，在训练时， self-attention 中需要有一项 mask，用来屏蔽掉后面的词，因为在预测时，后面的词是不可见的。

### 位置编码

在 Transformer 中，位置信息是通过 positional encoding 嵌入的。
其原理是将位置信息转换为向量，然后将其与原始的词向量相加。
给定一个位置 $i=1,2,\dots,L$ 和对应的 $\delta=1,2,\dots,d$，对应的 Positional Encoding $PE_{(i,j)}$ is defined as:

$$
\mathrm{PE}(i, \delta)= \begin{cases}\sin \left(\frac{i}{10000^{2 \delta^{\prime} / d}}\right) & \text { if } \delta=2 \delta^{\prime} \\ \cos \left(\frac{i}{10000^{2 \delta^{\prime} / d}}\right) & \text { if } \delta=2 \delta^{\prime}+1\end{cases}
$$

<div style="width:100%;margin:auto">{% asset_img sinoidual-positional-encoding.png positional encoding%}</div>

### 更长的文本？Memory

目前 vanilla transformer 的长度是有限的，因为其 attention 机制是基于位置的。
如果要处理更长的文本，可以使用加入 memory 的 transformer。
记忆机制的思想是，将之前的信息存储起来，然后在当前的输入中使用。
通常来说可以使用可微的记忆（Transformer-XL，类似 RNN 的循环）以及不可微的记忆（kNN）。
此处因为可能不太会用得上，所以这里不做详细介绍，需要的时候再加深印象。

### 循环起来！

如果我们固定一个循环次数，Universal Transformer 和多层 Transformer 很像.
<div style="width:100%;margin:auto">{% asset_img universal-transformer.png universal transformer%}</div>

如果只看 decoder 的话，这个东西很像 GPT 的 decoder only 结构了。


## Transformer 应用

- 基于编码器：Bert
- 基于解码器：GPT 系列模型

## Reference
1. [深度学习中Attention与全连接层的区别何在？ - SleepyBag的回答 - 知乎](https://www.zhihu.com/question/320174043/answer/651998472)
2. [Attention机制详解（一）——Seq2Seq中的Attention](https://zhuanlan.zhihu.com/p/47063917)
3. [目前主流的attention方法都有哪些？ - 电光幻影炼金术的回答 - 知乎](https://www.zhihu.com/question/68482809/answer/1876764572)
4. Vaswani, Ashish, et al. "Attention is all you need." Advances in neural information processing systems 30 (2017).
5. [OpenAI ChatGPT（一）：十分钟读懂 Transformer - 绝密伏击的文章 - 知乎](https://zhuanlan.zhihu.com/p/600773858)
6. [The Transformer Family Version 2.0](https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/)