---
title: 树模型知识小结
index_img: /gallery/covers/tree-models.jpg
banner_img: /gallery/covers/tree-models.jpg
toc: true
date: 2022-04-13 12:00:00
updated: 2023-04-13 12:00:00
category:
- Machine Learning
tags:
- machine-learning
- tree-models

math: true

---
<!-- omit in toc -->

之前对于树模型仅停留在普通的树 + 一些简单的 bagging 方法。
这里对树模型做一个学习总结，包含决策树以及其集成化的方法。
本文不涉及一些先进的计算库，这些将在后续的文章中介绍。

<!-- more -->

## 决策树 Decision Tree

这是一个比较熟的模型，通过递归的方式来构建一棵树，每个节点都是一个特征，每个分支都是一个特征的取值。
最终的叶子节点是一个类别。
构建决策树的关键是如何选择每个节点的特征。
通常来说，特征的选择需要通过一系列的信息度量。

### 信息度量

可以使用熵来衡量一个特征的信息量。
若选择一个特征，使得熵下降最多，则可以认为这个特征最富含信息量，也就是最适合作为节点的特征。
这个下降的量称为信息增益。
这个是 **ID3 算法**的思路。

但是，ID3 倾向于选择取值较多的特征，因为熵的计算中包含了特征的取值个数。
于是，**C4.5 算法**引入了信息增益率来衡量特征的信息量。
即在信息增益的基础上，除以特征的取值个数。

C4.5 算法仍然存在一个问题，即当特征的取值个数较多时，信息增益率会很小。
于是，**CART 算法**引入了基尼指数来衡量特征的信息量。
基尼指数衡量一个集合（类别上）的纯合度，取值越小，集合越纯。
因此，CART 算法选择基尼指数下降最多（使得子集合更纯的）的特征作为节点的特征。

### 其他考虑

**连续情况**：在上述信息度量时，我们大多考虑的是离散的特征。
对于连续的特征，通常需要将连续的特征离散化，然后再使用上述的信息度量方法。
即可以将连续值其离散化为多个区间。
二分法是一种常用的离散化方法，即将连续值分为两个区间（仅有两种取值的特征）。

**回归情况**：CART 决策树也可以用于回归问题。
在回归问题中，输出是一个连续值，但是决策树的叶子节点通常是一个类别（离散值）。
回归树中，叶子结点的值是该叶子结点中所有样本的平均值或中位数。
分割的时候通常使用均方误差（MSE）或者平均绝对误差（MAE）或者均方差来定义分割的好坏。

**剪枝情况**：如果树足够深，树的叶子节点多，很可能导致过拟合。
因此，需要对树进行剪枝以提高泛化能力。
主要有两种方式，一种是预剪枝，即在树构建的过程中，就对树进行剪枝。
通常可以通过限制树的最大深度，或者限制叶子节点的最小样本数。
另一种是后剪枝，即在树构建完成后，再对树进行剪枝。

## Bagging of Trees

单个决策树通常具有较高的方差，因此可以通过 bagging 的方式来降低方差。
即通过构建多个决策树，然后对这些决策树的结果进行投票，来得到最终的结果。
构建过程使用的是 bootstrap 抽样，即从训练集中随机抽取样本，有放回的抽取。
这样可以保证每个决策树的训练集都是不同的，使得基模型具有“多样性”。

## Random Forest

随机森林是一种基于Bagging思想的集成学习算法。
在构建决策树的过程中，在 bootstrap 之外还引入了特征随机选择的策略，进一步提高了模型的性能和泛化能力。
特征的随机选取通常发生在节点的特征选择过程中。
即划分节点时，只选择部分特征（通常为特征数目的平方根），然后在这些特征中选择最优的特征。
实际应用中，随机森林通常比单独的决策树和Bagging of trees具有更好的性能。

## Adaboost

Adaboost (Adaptive Boosting)是一种基于Boosting思想的集成学习算法。
其不仅可以使用在决策树上，也可以使用在其他模型上。
Adaboost的思想是通过迭代的方式来构建弱分类器，然后将这些弱分类器进行加权求和，得到最终的分类器。
每次迭代，都会对上一次迭代中被错误分类的样本进行加权，使得这些样本在下一次迭代中更加重要。
后面的弱分类器更加关注那些被前面的弱分类器错误分类的样本，这样最终的强分类器可以更好的对这些样本进行分类。

本质上，Adaboost 的优化目标是降低指数损失函数的值。
指数损失函数是指对于每个样本，如果被错误分类，则损失为指数级别的增长。
对于一个 adaboost 模型 $h=\operatorname{sign}\left(\sum_{k=1}^K \alpha_k h_k\right)$，指数损失如下式所示。

$$
E=\frac{1}{n} \sum_{i=1}^n \exp \left(-y_i \sum_{k=1}^K \alpha_k h_k\left(\mathbf{x}_i\right)\right)
$$

其中，$y_i$ 是样本的真实标签，$h_k(\mathbf{x}_i)$ 是第 $k$ 个弱分类器对样本 $\mathbf{x}_i$ 的预测结果，$\alpha_k$ 是第 $k$ 个弱分类器的权重。
此时，假设前 $k-1$ 个弱分类器和权重已经确定，那么第 $k$ 个弱分类器 $h_k(\mathbf{x})$ 和权重 $\alpha_k$ 可以通过最小化以下指数损失求解。

$$
\begin{aligned}
E & =\frac{1}{n} \sum_{i=1}^n \exp \left(-y_i \sum_{j=1}^k \alpha_j h_j\left(\mathbf{x}_i\right)\right) \\
& =\frac{1}{n} \sum_{i=1}^n \exp \left(-y_i \sum_{j=1}^{k-1} \alpha_j h_j\left(\mathbf{x}_i\right)\right) \exp \left(-y_i \alpha_k h_k\left(\mathbf{x}_i\right)\right) \\
& =\sum_{i=1}^n w_k(i) \exp \left(-y_i \alpha_k h_k\left(\mathbf{x}_i\right)\right)
\end{aligned}
$$

其中，$w_k(i)$ 是样本 $\mathbf{x}_i$ 在第 $k$ 次迭代中的权重。
$$
w_k(i)=\frac{1}{n} \exp \left(-y_i \sum_{j=1}^{k-1} \alpha_j h_j\left(\mathbf{x}_i\right)\right)
$$

样本的权重可以写成递归的形式，
$$
w_1(i)=\frac{1}{n} \quad \text { and } \quad w_{k+1}(i)=w_k(i) \exp \left(-y_i \alpha_k h_k\left(\mathbf{x}_i\right)\right)
$$

那么优化目标可以写成

$$
\begin{aligned}
E & =\sum_{i=1}^n w_k\left(\mathbf{x}_i\right) \exp \left(-y_i \alpha_k h_k\left(\mathbf{x}_i\right)\right) \\
& =e^{\alpha_k} \sum_{\mathbf{x}_i \in M} w_k\left(\mathbf{x}_i\right)+e^{-\alpha_k} \sum_{\mathbf{x}_i \in T} w_k\left(\mathbf{x}_i\right) \\
& =\left(e^{\alpha_k}-e^{-\alpha_k}\right) \sum_{\mathbf{x}_i \in M} w_k\left(\mathbf{x}_i\right)+e^{-\alpha_k} \sum_{\mathbf{x}_i \in M} w_k\left(\mathbf{x}_i\right)+e^{-\alpha_k} \sum_{\mathbf{x}_i \in T} w_k\left(\mathbf{x}_i\right) \\
& =\left(e^{\alpha_k}-e^{-\alpha_k}\right) \sum_{i=1}^n w_k\left(\mathbf{x}_i\right) \delta\left(h_k\left(\mathbf{x}_i\right) \neq y_i\right)+e^{-\alpha_k} \sum_{i=1}^n w_k\left(\mathbf{x}_i\right)
\end{aligned}
$$

其中，$M$ 是被错误分类的样本集合，$T$ 是被正确分类的样本集合，$\delta$ 是指示函数。
式中 $e^{-\alpha_k} \sum_{i=1}^n w_k\left(\mathbf{x}_i\right)$ 项和 $\left(e^{\alpha_k}-e^{-\alpha_k}\right)$ 项与 $h_k(\mathbf{x})$ 无关。
所以优化目标可以写成

$$
h_k^*=\arg \min _{h_k} \sum_{i=1}^n w_k\left(\mathbf{x}_i\right) \delta\left(h_k\left(\mathbf{x}_i\right) \neq y_i\right)
$$

此外，通过损失函数对 $\alpha_k$ 求导求极值，可以得到

$$
\begin{aligned}
\frac{\partial E}{\partial \alpha_k}=\left(e^{\alpha_k}+e^{-\alpha_k}\right) & \sum_{i=1}^n w_k\left(\mathbf{x}_i\right) \delta\left(h_k^*\left(\mathbf{x}_i\right) \neq y_i\right)-e^{-\alpha_k} \sum_{i=1}^n w_k\left(\mathbf{x}_i\right)=0 \\
\frac{e^{-\alpha_k}}{e^{\alpha_k}+e^{-\alpha_k}}&=\frac{\sum_{i=1}^n w_k\left(\mathbf{x}_i\right) \delta\left(h_k^*\left(\mathbf{x}_i\right) \neq y_i\right)}{\sum_{i=1}^n w_k\left(\mathbf{x}_i\right)}=\epsilon_k^* \\
e^{-\alpha_k}&=\left(e^{\alpha_k}+e^{-\alpha_k}\right) \epsilon_k^* \\
\left(1-\epsilon_k^*\right) e^{-\alpha_k}&=\epsilon_k^* e^{\alpha_k} \\
 e^{2 \alpha_k}&=\frac{1-\epsilon_k^*}{\epsilon_k^*} \\
 \alpha_k&=0.5 \log \frac{1-\epsilon_k^*}{\epsilon_k^*}
\end{aligned}
$$

至此，我们已经得到了第 $k$ 个弱分类器 $h_k(\mathbf{x})$ 和权重 $\alpha_k$ 的表达式。
以及样本的权重 $w_k(\mathbf{x})$ 的递归表达式。
那么，我们可以通过迭代的方式，不断地更新弱分类器和样本的权重，直到满足某个条件为止。
此外，为了防止过拟合，我们可以对弱分类器的数量进行限制，即限定迭代最大次数。

Adaboost 分类精度高；可以用各种回归分类模型来构建弱学习器，非常灵活；不容易发生过拟合。
但是对异常点敏感，异常点会获得较高权重。

## GBDT

GBDT（Gradient Boosting Decision Tree）是一种基于决策树的集成学习算法。
其包含三个主要概念：回归树（Regression Decision Tree）、梯度迭代（Gradient Boosting），和缩减（Shrinkage）。

不同于 Adaboost 对样本进行加权，GBDT 以之前树得到的残差作为新的目标函数，然后拟合新的回归树。
模型的预测值表示为：

$$
F_k(x)=\sum_{i=1}^k f_i(x)=F_{k-1}(x)+f_k(x)
$$

这样每次只训练一个基模型，使得 $F_k(x)$ 尽量接近真实值 $y$。
这个残差其实是最小均方损失函数关于预测值的反向梯度，也就是说，预测值和实际值的残差与损失函数的负梯度相同。

$$
-\frac{\partial\left(\frac{1}{2}\left(y-F_k(x)\right)^2\right)}{\partial F_k(x)}=y-F_k(x)
$$

但要注意，基于残差 GBDT 容易对异常值敏感，所以一般回归类的损失函数会用绝对损失（L1 损失）或者 Huber 损失函数（一定范围内平方误差，超出范围绝对误差）来代替平方损失函数。

此外，为了避免过拟合，可以使用和 Adaboost 中相似的方法。
Shrinkage 不直接用残差修复误差，而是每次走一小步逐渐逼近结果而不是每次迈一大步很快逼近结果。
本质上 Shrinkage 为每棵树设置了一个 weight，累加时要乘以这个 weight，当 weight 降低时，基模型数会配合增大。

$$
F_i(x)=F_{i-1}(x)+\mu f_i(x) \quad(0<\mu \leq 1)
$$


## Reference

1. [【机器学习】决策树（中）——Random Forest、Adaboost、GBDT （非常详细） - 阿泽的文章 - 知乎](https://zhuanlan.zhihu.com/p/86263786)
2. Intelligent Data Analysis (SUSTech CSE5002) Lecture 6: Multiple Classiﬁer Systems