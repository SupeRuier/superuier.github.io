---
title: LSTM
index_img: /gallery/covers/lstm.jpg
banner_img: /gallery/covers/lstm.jpg
toc: true
date: 2022-10-27 21:00:00
updated: 2022-10-27 21:00:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning
- rnn
- lstm

---
<!-- omit in toc -->

最近用到的 ASP-MTL 模型中使用 LSTM 作为特征提取器。
自己对于 RNN 的认知很不成体系，在此进行一个梳理。
对 LSTM 来做一个学习，主要针对结构和预测两方面。

<!-- more -->

## RNN

Recurrent Neural Networks（RNN）指循环神经网络，用来处理序列数据。
每一个时刻的输出或中间信息会被传递到下一个时刻作为一部分输入，以保留时序信息。
具体模式如下图所示。

<div style="width:80%;margin:auto">{% asset_img RNN-unrolled.png 一个 RNN 示例%}</div>

其中处理以往和当前信息的结构十分简单，以一个 tanh 来合并。

<div style="width:60%;margin:auto">{% asset_img simpleRNN.png 简单 RNN 内部结构示例%}</div>


## LSTM

经典的 RNN 存在难以解决长距离依赖（long-term dependency）的问题，即时序上距离过远的相关信息难以被学到。
于是 LSTM 模型被提出，其包含了一个记录长效信息的模块。
LSTM 的结构如下图所示。
最主要的核心观点是维护一个 cell state（细胞状态），以使得信息跨时序传输。
当然这里个人认为翻译成“牢房”更为贴切。
不同于简单的 RNN 中只有一个神经网络，LSTM 中含有四个主要的神经网络（门结构）。

<div style="width:60%;margin:auto">{% asset_img lstm.png LSTM 内部结构示例%}</div>

遗忘门决定要从细胞状态中舍弃什么信息。
<div style="width:60%;margin:auto">{% asset_img LSTM3-focus-f.png 遗忘门 %}</div>

输入门决定保存哪些新信息进入细胞状态。
<div style="width:60%;margin:auto">{% asset_img LSTM3-focus-i.png 输入门%}</div>

旧的状态 $C_{t-1}$ 先 forget 再 input 得到新的状态 $C_t$。
<div style="width:60%;margin:auto">{% asset_img LSTM3-focus-C.png 细胞状态更新%}</div>

输出一个“过滤”后的细胞状态。
<div style="width:60%;margin:auto">{% asset_img LSTM3-focus-o.png 输出门%}</div>

### 模型训练

先由正向传播，算出最终的损失 $J$，再反向计算梯度即可。
详细的正向过程可见【2】。
反向过程可见【3】。
值得注意的是，反向过程的梯度更新需要考虑每一个时间步的输出。

## Reference
1. [Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)
2. [人人都能看懂的LSTM介绍及反向传播算法推导 - 陈楠的文章](https://zhuanlan.zhihu.com/p/83496936)
3. [RNN之随时间反向传播BPTT推导细节，从公式中理解RNN梯度消失与梯度爆炸原因 - 塞巴斯万隆的文章](https://zhuanlan.zhihu.com/p/54775438)



