---
title: 早停与验证集损失
index_img: /gallery/covers/early-stopping.png
banner_img: /gallery/covers/early-stopping.png
toc: true
date: 2021-08-10 14:32:55
updated: 2021-08-10 14:32:55
category:
- Programming
tags:
- neural-network
- machine-learning
- loss

math: true
---
<!-- omit in toc -->

一些有关神经网络训练早停及验证集损失的记录。
实验中发现验证集损失与其准确度不严格单调负相关，所以搜索一下答案。

<!-- more -->

## 早停

训练神经网络时，随着训练迭代次数的增加，训练损失会下降。
而验证集损失一般会经历一个先下降后上升的过程，上升时则为过拟合出现。
在此情况下，一般选用早停来结束当前模型的训练。

对于某种评估指标，假设其越低越好（/越高越好），在训练过程中，如果在一定数量的 epoch 的容忍度之内，其没有比之前的最好评估要低（/高），则停止训练，并重载之前表现最好时的模型参数作为最终的模型输出。

一般的，我们使用在验证集上的损失来作为早停的依据，如果验证集损失不进一步下降，那么则停止训练。（这也是目前来看大多数人用的依据。）
但是早停的依据到底是使用验证集上的 loss 还是 accuracy（或者其他相应的 metric）并没有看到一个统一的说法，互联网上两派的支持者有之。

对于这种情况，George 在其[博文](http://alexadam.ca/ml/2018/08/03/early-stopping.html)中指出了早停的一些问题。
其中最重要的一点是，验证集准确度并不随着验证集损失的减小而严格单调递增，如下图所示。

<div style="width:70%;margin:auto">{% asset_img training_curves.gif%}</div>

所以之后 George 实现了一种双重标准的早停，只有当损失和准确率都变糟糕时才早停。

## 验证集损失与准确率

一般来说，验证集损失与准确率呈负相关关系。
但是有些时候，存在验证集损失上升，但是验证集准确性仍进一步提高的情况。

这出现于模型对于预测过于自信和极端的情况。
换句话说，模型倾向于输出较为极端的预测值，这样使得在同样数量分错的情况下，少数预测错的样本主导了 loss，但是对整体准确率影响不大。

以下是一些可能出现的原因：
- 训练集验证集数据分布不一致
- 训练集过小未包含验证集所有情况

Github 上也有一个 [Repo](https://github.com/thegregyang/LossUpAccUp) 来讨论此现象。
对于解决方法来说似乎没有一个明确的结论。
作者在尝试了较小模型和批正则化后仍然会出现此问题。

## Reference

- [Early Stopping and its Faults](http://alexadam.ca/ml/2018/08/03/early-stopping.html)
- [验证集loss上升，准确率却上升该如何理解？ - 刘国洋的回答 - 知乎](https://www.zhihu.com/question/318399418/answer/1202932315)
- https://stats.stackexchange.com/questions/282160/how-is-it-possible-that-validation-loss-is-increasing-while-validation-accuracy