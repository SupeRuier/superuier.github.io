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
这里对一些相对先进的模型做一个学习总结。

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


## XGBoost

XGBoost 是大规模并行 boosting tree 的工具，它是目前最快最好的开源 boosting tree 工具包，比常见的工具包快 10 倍以上。
XGBoost 和 GBDT 两者都是 boosting 方法，除了工程实现、解决问题上的一些差异外，最大的不同就是目标函数的定义。
XGBoost 不止支持决策树，还支持线性模型，此处我们主要介绍决策树。

### 基础知识

目标函数可以写作：
$$
\begin{aligned}
Obj^{(t)} & =\sum_{i=1}^n l\left(y_i, \hat{y}_i^t\right)+\sum_{i=1}^t \Omega\left(f_i\right) \\
& =\sum_{i=1}^n l\left(y_i, \hat{y}_i^{t-1}+f_t\left(x_i\right)\right)+\sum_{i=1}^t \Omega\left(f_i\right)
\end{aligned}
$$

其中，$\hat{y}_i^t$ 是第 $t$ 次迭代的预测值，$f_t$ 是第 $t$ 次迭代的模型，$\Omega$ 是正则项。
对该式求解可以利用到泰勒展开 $f(x)=\sum_{i=0}^n \frac{f^{(i)}\left(x_0\right)}{i !}\left(x-x_0\right)^i+R_n(x)$。
那么对于一个函数在 $x$ 处的二阶展开可以写作 $f(x+\Delta x) \approx f(x)+f^{\prime}(x) \Delta x+\frac{1}{2} f^{\prime \prime}(x) \Delta x^2$。
那么目标函数可以重写为：

$$
O b j^{(t)}=\sum_{i=1}^n\left[l\left(y_i, \hat{y}_i^{t-1}\right)+g_i f_t\left(x_i\right)+\frac{1}{2} h_i f_t^2\left(x_i\right)\right]+\sum_{i=1}^t \Omega\left(f_i\right)
$$

其中，$g_i$ 和 $h_i$ 分别是损失函数 $l$ 关于 $\hat{y}_i^{t-1}$ 的一阶和二阶导数。
又由于 $l\left(y_i, \hat{y}_i^{t-1}\right)$ 是一个常数，不会对优化目标产生影响，所以

$$
Obj^{(t)} \approx \sum_{i=1}^n\left[g_i f_t\left(x_i\right)+\frac{1}{2} h_i f_t^2\left(x_i\right)\right]+\sum_{i=1}^t \Omega\left(f_i\right)
$$

所以我们只需要求出每一步损失函数的一阶导和二阶导的值（两个值就是常数），然后优化目标函数，就可以得到每一步的 $f_t$。

### 与决策树一起使用

定义决策树为 $f_t\left(x\right)= w_{q(x)}$, 其中 $q(x)$ 是叶子节点的索引，$w_j$ 是叶子节点的取值（权值）。
对于决策树来说，复杂度可以用叶子节点的个数 $T$ 来表示，此外叶子结点的权重 $w_j$ 也是需要优化的参数，所以正则项可以写作

$$
\Omega\left(f_t\right)=\gamma T+\frac{1}{2} \lambda \sum_{j=1}^T w_j^2
$$

那么，目标函数可以写作

$$
\begin{aligned}
O b j^{(t)} & \approx \sum_{i=1}^n\left[g_i f_t\left(x_i\right)+\frac{1}{2} h_i f_t^2\left(x_i\right)\right]+\Omega\left(f_t\right) \\
& =\sum_{i=1}^n\left[g_i w_{q\left(x_i\right)}+\frac{1}{2} h_i w_{q\left(x_i\right)}^2\right]+\gamma T+\frac{1}{2} \lambda \sum_{j=1}^T w_j^2 \\
& =\sum_{j=1}^T\left[\left(\sum_{i \in I_j} g_i\right) w_j+\frac{1}{2}\left(\sum_{i \in I_j} h_i+\lambda\right) w_j^2\right]+\gamma T
& =\sum_{j=1}^T\left[G_j w_j+\frac{1}{2}\left(H_j+\lambda\right) w_j^2\right]+\gamma T
\end{aligned}
$$

其中，$I_j$ 是叶子节点 $j$ 中的样本索引集合, $G_j$ 和 $H_j$ 分别是 $I_j$ 中样本的一阶导数和二阶导数之和。
此时是一个二次规划问题，将目标函数对 $w_j$ 求导，并令其为 0，可以得到

$$
\begin{aligned}
&w_j^*=-\frac{G_j}{H_j+\lambda}
\end{aligned}
$$

所以目标函数可以简化为以下形式，这个值越小，代表这个树的结构越好。

$$
\begin{aligned}
&Obj=-\frac{1}{2} \sum_{j=1}^T \frac{G_j^2}{H_j+\lambda}+\gamma T
\end{aligned}
$$

### 使用时的具体考虑

之后的问题就是如何找到最优的结构，使得 $Obj$ 最小。
需要考虑到的问题有：
1. 如何切分节点：一般来说有两种方法，一种是贪心算法（类似普通决策树），一种是近似算法（针对数据量过大无法读入内存的情况，对于每个特征只考察分位点可以减少计算复杂度）。
2. 加权分位数缩略图：不是简单地按照样本个数进行分位，而是以二阶导数值 $h_i$ 作为样本的权重进行划分
3. 稀疏感知算法：XGBoost 在构建树的节点过程中只考虑非缺失值的数据遍历，而为每个节点增加了一个缺省方向，当样本相应的特征值缺失时，可以被归类到缺省方向上。

实际实现上的考虑（实在是不太懂说啥）：
1. XGBoost 在训练之前对根据特征对数据进行了排序，然后保存到块结构中，并在每个块结构中都采用了稀疏矩阵存储格式进行存储，后面的训练过程中会重复地使用块结构，可以大大减小计算量。在对节点进行分裂时需要选择增益最大的特征作为分裂，这时各个特征的增益计算可以同时进行，这也是 Xgboost 能够实现分布式或者多线程计算的原因。
2. 为了解决缓存命中率低的问题，XGBoost 提出了缓存访问优化算法：为每个线程分配一个连续的缓存区，将需要的梯度信息存放在缓冲区中，这样就是实现了非连续空间到连续空间的转换，提高了算法效率。
3. XGBoost 独立一个线程专门用于从硬盘读入数据，以实现处理数据和读入数据同时进行。

### 特性

1. 精度更高：GBDT 只用到一阶泰勒展开，而 XGBoost 对损失函数进行了二阶泰勒展开。
2. 列抽样：XGBoost 借鉴了随机森林的做法，支持列抽样，不仅能降低过拟合，还能减少计算。
3. 可以并行化操作：块结构可以很好的支持并行计算。

## LightGBM

## CatBoost



## 小结与个人看法



## Reference

1. [【机器学习】决策树（中）——Random Forest、Adaboost、GBDT （非常详细） - 阿泽的文章 - 知乎](https://zhuanlan.zhihu.com/p/86263786)
2. Intelligent Data Analysis (SUSTech CSE5002) Lecture 6: Multiple Classiﬁer Systems
3. [【机器学习】决策树（下）——XGBoost、LightGBM（非常详细） - 阿泽的文章 - 知乎](https://zhuanlan.zhihu.com/p/87885678)

