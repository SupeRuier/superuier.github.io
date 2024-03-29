---
title: 集成学习复习总结
index_img: /gallery/covers/ensemble-learning.jpg
banner_img: /gallery/covers/ensemble-learning.jpg
toc: true
date: 2022-04-12 12:00:00
updated: 2022-04-12 12:00:00
category:
- Machine Learning
tags:
- machine-learning
- ensemble-learning

math: true

---
<!-- omit in toc -->

集成学习的一个复习总结。
主要记录一些个人认为比较重要的细节。
此博文不涉及到具体模型以及数学定义。

<!-- more -->

集成学习是一个“元”学习方法，其整体思想是利用一系列的弱学习器来构建一个强学习器。
通常来说，弱学习器的表现要比强学习器差，但是它们的表现要比随机猜测要好。
集成学习的思路分为两类，bagging 和 boosting。

## Bagging

Bagging 是 bootstrap Aggregating 的缩写，通常通过多次采样构建一系列的弱学习器，再将这些弱学习器的结果进行整合。

### 构建弱学习器

通常使用不同的子训练集来并行构建不同的弱学习器。
子训练集可以使用 bootstrap 的方式来构建，即有放回地从原始训练集中采样，每次采样的样本数目和原始训练集的样本数目相同。

### 整合弱学习器

最简单的方法是对每个弱学习器的结果进行平均。
平均的方式有很多种，比如平均值（回归任务）投票（分类任务）等等。

### Bagging 的特点

- 通过整理合并一系列 high variance & low bias 的弱学习器，可以得到一个 low variance 的强学习器（因为使用了平均）。
- 较好的并行计算性能。
- 对 Bias 影响较小，所以适用于用于本来就 low bias 的模型。

## Boosting

Boosting 的思路是构建一系列弱学习器，并通过加权求和的方式来整合这些弱学习器。

### 构建弱学习器

Boosting 通常使用串行的方式来构建弱学习器。
每个弱学习器都是基于上一个弱学习器的结果来构建的。
换句话说，就是希望新训练的学习器能够更好地拟合训练集中没有被上一个学习器拟合的部分。
这个可以通过对错分样本加权，或者计算残差来实现。
这样随着学习器的增多，我们就能够逐渐地拟合整个训练集。

### 整合弱学习器

Boosting 通常使用加权求和的方式来整合弱学习器。
权重通常与子分类器构建的过程有关。
例如 adaboost 基于每个学习器的表现来确定的，该学习器目前的表现越好，那么它的权重就越大。

### Boosting 的特点

- 通过整理合并一系列 high bias 的弱学习器，得到一个 low bias 的强学习器。

## 个人看法

某种程度上来说，不论是 bagging 还是 boosting 集成学习具有一定的可解释性。
因为每个弱学习器都是基于上一个学习器的结果来构建的，所以我们可以通过观察每个学习器的结果来了解整个集成学习的结果。
对于 bagging 来说，我们可以通过观察每个弱学习器的结果来了解模型对于不同部分的拟合情况。
对于 boosting 来说，我们可以通过观察每个弱学习器的结果来了解每个学习器对于解决该问题的重要性。