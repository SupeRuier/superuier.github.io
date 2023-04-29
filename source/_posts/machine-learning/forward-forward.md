---
title: Forward Forward Algorithm
index_img: /gallery/covers/forward-forward.jpg
banner_img: /gallery/covers/forward-forward.jpg
toc: true
date: 2023-01-12 16:40:00
updated: 2023-01-12 16:40:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning
- deep-learning
# footnote:
#   enable: true
#   header: '<h2>参考</h2>'

math: true

---
<!-- omit in toc -->

Hinton 在 NeurIPS 2022 提出了 Forward Forward Algorithm[^1]，好像还挺有意思，在此做一个学习。
<!-- more -->

## 说在最前

老爷子的原文的思考角度仍然是以问题出发，先从 back-propagation 所拥有的问题讲起，引出更“人脑式”的 Forward Forward Algorithm（FFA）。
本文不在意算法的具体表现怎样，也不在意具体如何代码实现，仅对文章思想作一个了解。
本文写成于略读了原文，以及一些知乎讨论之后，或许有一些不正确的记载，敬请指正。

## 主要思想

### 单层的模式

不需要通过最后一层将误差一层层反传回来调整权值（即不用 back-propagation），而是在每一层使用正样本（第一次 forward）和负样本（第二次 forward）来对权重进行调整。
两次前想的操作完全相同，除了使用不同的数据和相反的目标。
相似于反向传播中存在的损失函数 loss，FFA 中的目标函数为 goodness（大佬命名的确通俗），如下所示。

$$
p(\text { positive })=\sigma\left(\sum_j y_j^2-\theta\right)
$$

其中 $\theta$ 是一个阈值，而不是参数/权重。
正样本需要调节权重使 goodness 增加，负样本则相反。
具体来说权重如何更新呢？我暂时没有找到相关表述，或许还是使用梯度下降（感觉很多时候梯度下降和反向传播混为一谈了）。

下面是一些相关的原文表述：
> The idea is to replace the forward and backward passes of backpropagation by two forward passes that operate in exactly the same way as each other, but on different data and with opposite objectives. 
> The positive pass operates on real data and adjusts the weights to increase the goodness in every hidden layer. 
> The negative pass operates on "negative data" and adjusts the weights to decrease the goodness in every hidden layer. 
> This paper explores two different measures of goodness – the sum of the squared neural activities and the negative sum of the squared activities, but many other measures are possible.
> 
> The aim of the learning is to make the goodness be well above some threshold value for real data and well below that value for negative data.

个人的理解即为使得在每一层中正样本更容易激活，而负样本更难以激活（即 activity 更小）。

### 多层的模式

在多层网络中，由于上一层已经使得正负样本模长产生区别，所以在输入下一层之前，需要对隐层向量长度进行标准化。

下面是一些相关的原文表述：
> But if the activities of the first hidden layer are then used as input to the second hidden layer, it is trivial to distinguish positive from negative data by simply using the length of activity vector in the first hidden layer.
> There is no need to learn any new features.
> To prevent this, FF normalizes the length of the hidden vector before using it as input to the next layer.
> This removes all of the information that was used to determine the goodness in the first hidden layer and forces the next hidden layer to **use information in the relative activities of the neurons** in the first hidden layer.
> These relative activities are unaffected by the layer-normalization.
> To put it another way, the activity vector in the first hidden layer has a length and an orientation.
> The length is used to define the goodness for that layer and **only the orientation is passed to the next layer**.

## 讨论

把最终的 loss 反传取消，换成了每一层的限制，可能是这个文章最重要的 intuition。
但是好像已经有很多人做过类似的尝试了，比如马毅教授 的 NeurIPS 2020 中稿文章 MCR2[^3]。
（总体来说是我不太熟悉的训练方式，还是有一点意思的。）

## Reference

[^1]: [The Forward-Forward Algorithm: Some Preliminary Investigations](https://www.cs.toronto.edu/~hinton/FFA13.pdf)
[^2]: [如何评价Hinton提出的Forward-Forward方法？ - 刘斯坦的回答 - 知乎](https://www.zhihu.com/question/570153849/answer/2787026263)
[^3]: [如何评价 马毅教授 的 NeurIPS 2020 中稿文章 MCR2 及 自称弄明白深度学习了？ - 刘斯坦的回答 - 知乎](https://www.zhihu.com/question/423767542/answer/1893558922)


