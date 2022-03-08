---
title: Gaussian Process
date: 2021-07-21 16:34:53
updated: 2022-03-28 20:46:00
cover: /gallery/covers/gaussian-process.png
category: 
- Machine Learning
toc: true
tags: 
- machine-learning
- gaussian-process

---
<!-- omit in toc -->

一份理解高斯分布的笔记。

<!-- more -->

参考：
- [A Visual Exploration of Gaussian Processes](https://www.jgoertler.com/visual-exploration-gaussian-processes/)
- [看得见的高斯过程：这是一份直观的入门解读](https://zhuanlan.zhihu.com/p/56562456)
- [如何通俗易懂地介绍 Gaussian Process？](https://www.zhihu.com/question/46631426/answer/1735470753)
- [高斯过程回归：推导，实现和理解](https://zhuanlan.zhihu.com/p/104601803)
- [深度学习基础（高斯过程）](http://sirlis.cn/deep-learning-gaussian-process)

---------

## 模型的理解

高斯分布一般用来做回归。
其原理是把回归当成一个采样过程。
在 $k$ 个测试样本上预测的情况，可以想象成在一个 $k$ 维的高斯分布下进行采样。
在每个维度上的采样结果可以当作在这个样本上的预测值。
所以说回归问题转化为如何构建这个 $k$ 维的高斯分布，一旦构建完成则可以用来回归预测。

直接对预测数据 $X^\ast$ 构建这个先验分布$P(f(X^\ast))$是困难的，所以说在有训练数据$Y$的情况下，我们期望找到的是一个后验概率分布$P(f(X^\ast)|Y)$。

---------
## 多变量高斯分布

我们先从多变量高斯分布说起，介绍其形式和性质。

### 1. 先验分布

对于一个先验分布是高斯分布的一组随机变量 $X \sim \mathcal{N}(\mu,\,\Sigma)$， $X$ 可以由两部分组成 $X_a$ 和 $X_b$，代表原始随机变量的子集，维度为 $|X_a|+|X_b| = p + q$。

具体来说，

$$X=\begin{bmatrix}X_a\\X_b\end{bmatrix}_{p+q}\quad\mu=\begin{bmatrix}\mu_a\\\mu_b\end{bmatrix}_{p+q}\quad \Sigma=\begin{bmatrix}\Sigma_{aa}&\Sigma_{ab}\\\Sigma_{ba}&\Sigma_{bb}\end{bmatrix}_{p + q, p + q}$$

其中 $\mu$ 和 $\Sigma$ 是对应的均值和方差。
1. 均值 $\mu$，一般在数据归一化的情况下，先验均值可以设为 0 函数。
2. 对于协方差矩阵 $\Sigma$，则可以用核函数来生成。

> 核函数，一般用来表示一种距离的度量，这里用现有样本的特征 $x$ 建立随机变量间的距离，再用其作为每个维度之间的协方差。
此处的核函数有多种选择方式，同时也可以组合起来使用。
通过不同核函数的选择可以起到添加先验知识的作用。
通过这一个步骤可以建立起联合分布的高斯分布表达式。

### 2. 通过先验分布得到后验分布

此时我们可以通过条件作用 conditioning 从 $P(X_a,X_b)$ 得到 $P(X_b|X_a)$。
这样是从一个维度为$|X_a|+|X_b|$的高斯分布得到一个维度为维度为 $|X_b|$ 的高斯分布。
条件作用之后均值和标准差会发生变化，依据高斯分布的性质可以得到以下条件分布，

$$X_b|X_a\sim N(\mu_{b|a},\Sigma_{b|a})$$

其中，
$\mu_{b|a}=\Sigma_{ba}\Sigma^{-1}_{aa}(X_a-\mu_a)+\mu_b$，
$\Sigma_{b|a}=\Sigma_{bb}-\Sigma_{ba}\Sigma^{-1}_{aa}\Sigma_{ab}$。

直观上讲，训练点是为候选的函数设了一个限定范围，所得到的函数需要通过训练点。
所以在结果中，靠近训练数据点的区域预测不确定性会小，离得越远，不确定性越大。

至此，当我们确定了样本（$X_a$）之后，就可以得到其回归值（$X_b$）的高斯分布，并取 $\mu_b$ 作为预测得到的回归值。

--------
## 高斯过程

对于观测点 $X$（训练点，注意这里的 $X$ 和上一小节的不同，这里是表示样本的特征）与其对应值 $Y$，所有的非观测点（测试点） $X^\ast$ 的值定义为 $f(X^\ast)$。
我们对预测值 $Y$ 构建多维高斯分布。
这里我们把均值向量替换为均值函数。
那么有，

$$\begin{bmatrix}Y\\f(X^\ast)\end{bmatrix}\sim N(\begin{bmatrix}\mu(X)\\\mu(X^\ast)\end{bmatrix}，\begin{bmatrix}k(X,X)& k(X,X^\ast)\\k(X^\ast,X)&k(X^\ast,X^\ast)\end{bmatrix})$$

同样的我们可以得到条件分布，

$$P(f(X^\ast)|Y,X^\ast,X) \sim N(\mu^\ast,k^\ast)$$

其中, $\mu^\ast=k(X^\ast,X)k(X,X)^{-1}(Y-\mu(X))+\mu(X^\ast)$，$k^\ast=k(X^\ast,X^\ast)-k(X^\ast,X)k(X,X)^{-1}k(X,X^\ast)$。

一般在数据归一化的情况下，先验均值 $\mu(X)$ 和 $\mu(X^\ast)$ 可以设为 0 函数。
在 `sklearn` 中，可以通过调节参数 `normalize_y=True` 实现。