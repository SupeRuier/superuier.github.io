---
title: Focal Loss
index_img: /gallery/covers/focal_loss.jpg
toc: true
date: 2022-09-21 15:00:00
updated: 2022-09-21 15:00:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning
- loss-function

---
<!-- omit in toc -->

前几天听到一个关于元学习的报告，里面提到了一下 Focal Loss，意识到总是听人讲起却没有好好看过它到底是什么，于是这里做一个简短的学习。

<!-- more -->

## 类别不平衡问题

Focal loss 是何恺明大神提出的，面向类别不平衡性能损失问题的一个思路。

通常情况下，面对类别不平衡，如果不加干预，模型则更倾向于对优势类有着更好表现。
通常大家的解决思路是对不同类别的样本损失函数加权，降低优势类损失的权重，增强劣势类损失的权重，比例约为不同类别（正负样本）的数量比。

此处 focal loss 本质上也是一个对于 CEloss 的加权，但是它入手的角度是学习样本的难易程度。

## Focal loss 具体形式

首先我们给出 focal loss 的表达式：

$$
L_{f l} =-\left(1-p_t\right)^\gamma \log \left(p_t\right)\\
p_t = \begin{cases}\hat{p} & \text { if } \mathrm{y}=1 \\ 1-\hat{p} & \text { otherwise }\end{cases}
$$

同理也有交叉墒损失函数的表达式:

$$
L_{ce}=- \log \left(p_t\right)\\
$$

两者的主要区别在于 $log$ 项之前的权重。
直观上理解，$p$ 反应了分类的难易程度，分类的置信度越高，代表样本越易分；分类的置信度越低，代表样本越难分。
因此focal loss相当于增加了难分样本在损失函数的权重，使得损失函数倾向于难分的样本，有助于提高难分样本的准确度。
而通常情况下，样本较少的类别天然会难分一些。




## Reference

- [何恺明大神的「Focal Loss」，如何更好地理解？](https://zhuanlan.zhihu.com/p/32423092)
- [focal loss 通俗讲解](https://zhuanlan.zhihu.com/p/266023273)