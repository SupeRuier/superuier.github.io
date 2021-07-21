---
title: Gaussian Process
date: 2021-07-21 16:34:53
updated: 2021-07-21 16:34:53
category: 
- Math
toc: true
tags: 
- math
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

---------

## 模型的理解

高斯分布一般用来做回归。
其原理是把回归当成一个采样过程。
在 n 个测试样本上预测的情况，可以想象成在一个 n 维的高斯分布下进行采样。
在每个维度上的采样结果可以当作在这个样本上的预测值。
所以说回归问题转化为如何构建这个 n 维的高斯分布，一旦构建完成则可以用来预测。

直接对预测数据$X$构建这个先验分布$P(X)$是困难的，所以说在有训练数据$Y$的情况下，我们期望找到的是一个后验概率分布$P(X|Y)$。

---------
## 目标模型的构建

### 1. 包含训练数据的先验分布

首先我们需要先得到一个包含训练点 $X_a$ 和测试点 $X_b$ 先验分布 $P (X_a,X_b)$，维度为 $|X_a|+|X_b| = p + q$。
这个先验分布同样也是高斯分布 $P(X_a,X_b) \sim \mathcal{N}(\mu,\,\Sigma)$。
具体来说，

$$X=\begin{bmatrix}X_a\\X_b\end{bmatrix}_{p+q}\quad\mu=\begin{bmatrix}\mu_a\\\mu_b\end{bmatrix}_{p+q}\quad \Sigma=\begin{bmatrix}\Sigma_{aa}&\Sigma_{ab}\\\Sigma_{ba}&\Sigma_{bb}\end{bmatrix}_{p + q, p + q}$$

在这里我们需要定义 $\mu$ 和 $\Sigma$。
对于均值 $\mu$，$\mu_a$ 是从训练集中得到的数值，$\mu_b$则需要人为设定或取 $\mu_a$ 的均值。
一般在数据归一化的情况下，先验均值可以设为 0 函数。

对于协方差矩阵 $\Sigma$，则可以用核函数来生成。
核函数，一般用来表示一种相似度的度量，这里用每个样本的特征 $x$ 建立样本间的相似度，再用其作为每个维度之间的协方差。
此处的核函数有多种选择方式，同时也可以组合起来使用。
通过不同核函数的选择可以起到添加人类的先验知识的作用。
通过这一个步骤可以建立起联合分布的高斯分布表达式。

### 2. 通过先验分布得到后验分布

此时我们可以通过条件作用从 $P(X_a,X_b)$ 得到 $P(X_b|X_a)$。
这样是从一个维度为$|X_a|+|X_b|$的高斯分布得到一个维度为维度为 $|X_b|$ 的高斯分布。
条件作用之后均值和标准差会发生变化，依据高斯分布的性质可以得到以下条件分布，

$$X_b|X_a\sim N(\mu_{b|a},\Sigma_{b|a})$$

其中，
$\mu_{b|a}=\Sigma_{ba}\Sigma^{-1}_{aa}(X_a-\mu_a)+\mu_b$，
$\Sigma_{b|a}=\Sigma_{bb}-\Sigma_{ba}\Sigma^{-1}_{aa}\Sigma_{ab}$。

直观上讲，训练点是为候选的函数设了一个限定范围，所得到的函数需要通过训练点。
所以在结果中，靠近训练数据点的区域预测不确定性会小，离得越远，不确定性越大。

--------
## 在无限维的条件下

对于观测点 $X$ 与其对应值 $Y$，所有的非观测点 $X^*$ 的值定义为 $f(X^*)$。
这里我们再把均值向量替换为均值函数。
那么有，

$$\begin{bmatrix}Y\\f(X^*)\end{bmatrix}\sim N(\begin{bmatrix}\mu(X)\\\mu(X^*)\end{bmatrix}，\begin{bmatrix}k(X,X)& k(X,X^*)\\k(X^*,X)&k(X^*,X^*)\end{bmatrix})$$

同样的我们可以得到条件分布，

$$f(X^*)|Y\sim N(\mu^*,k^*)$$

其中, $\mu^\ast=k(X^\ast,X)k(X,X)^{-1}(Y-\mu(X))+\mu(X^\ast)$，$k^\ast=k(X^\ast,X^\ast)-k(X^\ast,X)k(X,X)^{-1}k(X,X^\ast)$。

同样的，一般在数据归一化的情况下，先验均值可以设为 0 函数。
在 `sklean` 中，可以通过调节参数 `normalize_y=True` 实现。