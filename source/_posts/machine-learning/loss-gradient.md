---
title: 训练集样本对于测试集 loss 的影响
index_img: /gallery/covers/loss-gradient.jpg
banner_img: /gallery/covers/loss-gradient.jpg
toc: true
date: 2022-11-21 18:00:00
updated: 2022-11-21 18:00:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning
- loss
- gradient

---
<!-- omit in toc -->

主动学习中通常要评估样本的重要性/信息量，以选择最有价值样本使得模型提升最大。
这一点在样本可解释性中也有体现，即“什么样的样本对于训练来说更加重要？”
本文是几篇论文【1，2】的阅读笔记，从梯度的角度阐释样本对于最终测试集表现的影响。

<!-- more -->

## 训练样本如何影响测试表现【2】

自然的，去掉一个样本带来的参数变化可以写作 $\hat{\theta}_{-z}-\hat{\theta}$，其中

$$\hat{\theta}_{-z} \stackrel{\text { def }}{=} \arg \min _{\theta \in \Theta} \sum_{z_i \neq z} L\left(z_i, \theta\right)$$

但是对于每一个样本而言，我们不可能总是去掉它并重新训练一个模型。
于是我们可以从 influence function 的角度来理解这个问题。
即计算样本权重变化一个很小的 $\epsilon$ 时所带来的参数变化（原始权重为 $\frac{1}{n}$），在这种情况下

$$\hat{\theta}_{\epsilon, z} \stackrel{\text { def }}{=} \arg \min _{\theta \in \Theta} \frac{1}{n} \sum_{i=1}^n L\left(z_i, \theta\right)+\epsilon L(z, \theta)$$

此时将样本 $z$ 在参数 $\theta$ 上权重增大 $\epsilon$ 时所带来的 influence 写作

$$\left.\mathcal{I}_{\text {up,params }}(z) \stackrel{\text { def }}{=} \frac{d \hat{\theta}_{\epsilon, z}}{d \epsilon}\right|_{\epsilon=0}=-H_{\hat{\theta}}^{-1} \nabla_\theta L(z, \hat{\theta})$$

其中 $H_{\hat{\theta}} \stackrel{\text { def }}{=} \frac{1}{n} \sum_{i=1}^n \nabla_\theta^2 L\left(z_i, \hat{\theta}\right)$ 是正定的 Hessian 矩阵。
在训练集中去掉 $z$ 点就相当于将 $\epsilon$ 设为 $-\frac{1}{n}$，那么参数的变化 $\hat{\theta}_{-z}-\hat{\theta}$ 则可在不重训练模型的情况下近似为 $ -\frac{1}{n} \mathcal{I}_{\text {up,params }}(z)$.
这样在更改 $z$ 权重的情况下，对于一个测试样本的影响的解析解可以写作：

$$\begin{aligned} \mathcal{I}_{\text {up }, \text { loss }}\left(z, z_{\text {test }}\right) &\left.\stackrel{\text { def }}{=} \frac{d L\left(z_{\text {test }}, \hat{\theta}_{\epsilon, z}\right)}{d \epsilon}\right|_{\epsilon=0} \\ &=\left.\nabla_\theta L\left(z_{\text {test }}, \hat{\theta}\right)^{\top} \frac{d \hat{\theta}_{\epsilon, z}}{d \epsilon}\right|_{\epsilon=0} \\ &=-\nabla_\theta L\left(z_{\text {test }}, \hat{\theta}\right)^{\top} H_{\hat{\theta}}^{-1} \nabla_\theta L(z, \hat{\theta}) . \end{aligned}$$

## 主动学习中对这一结论的运用【1】

依赖上一节中的影响力估计，训练集中样本 $x$ 对测试集中样本 $x_j$ 在损失上的影响为

$$I_{\text{loss}}\left(x, x_j\right)=\frac{1}{n} \nabla_\theta L\left(f_\theta\left(x_j\right)\right)^{\top} H_\theta^{-1} \nabla_\theta L\left(f_\theta(x)\right)$$

那么在整个测试集的总影响可以写作

$$\sum_j I_{\text{loss}}\left(x, x_j\right)=\frac{1}{n} \sum_j \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)^{\top} H_\theta^{-1} \nabla_\theta L\left(T^{c+1}(x)\right)$$

其中 $T^{c+1}$ 是在第 $c+1$ 个循环过后的模型。
尽管单一样本可能对某一测试样本有副作用，但是总体来说训练样本对于整个测试集的影响是正面的。
那么，在第 $c+1$ 个循环中移除一个训练样本，得到的测试集损失则变为
$$
\begin{aligned} L_{\text {test}}^{\prime c+1} &=L_{\text {test }}^{c+1}+\sum_j I_{\text {loss }}\left(x, x_j\right) \\ &=L_{\text {test }}^{c+1}+\frac{1}{n} \sum_j \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)^{\top} H_\theta^{-1} \nabla_\theta L\left(T^{c+1}(x)\right) \end{aligned}
$$

由于测试集样本未知，即无法直接得到 $\sum_j \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)^{\top} H_\theta^{-1} \nabla_\theta L\left(T^{c+1}(x)\right)$。
所以我们同时在等式两边取 Frobenius Norm，得到

$$
\begin{aligned} L_{\text {test}}^{\prime c+1} &=\left\|L_{\text {test }}^{c+1}+\frac{1}{n} \sum_j \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)^{\top} H_\theta^{-1} \nabla_\theta L\left(T^{c+1}(x)\right)\right\| \\ & \leq L_{\text {test }}^{c+1}+\frac{1}{n}\left\|\sum_j \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)^{\top} H_\theta^{-1} \nabla_\theta L\left(T^{c+1}(x)\right)\right\| \\ &=L_{\text {test }}^{c+1}+\frac{1}{n}\left\|\nabla_\theta L\left(T^{c+1}(x)\right)^{\top} \sum_j H_\theta^{-1} \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)\right\| \\ & \leq L_{\text {test }}^{c+1}+\frac{1}{n}\left\|\nabla_\theta L\left(T^{c+1}(x)\right)\right\| \cdot\left\|\sum_j H_\theta^{-1} \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)\right\| \end{aligned}
$$

而对于一个固定的测试集来说，$\left\|\sum_j H_\theta^{-1} \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)\right\|$ 可以看做一个不变项。
所以 $L_{\text {test}}^{\prime c+1}$ 的上界主要依赖于 $\left\|\nabla_\theta L\left(T^{c+1}(x)\right)\right\|$。
但是在第 $c$ 个循环，模型 $T^{c+1}$ 不可知，所以使用模型 $T^{c}$ 来做一个近似，即

$$
\begin{aligned} L_{\text {test}}^{\prime c+1} & \leq L_{\text {test }}^{c+1}+\frac{1}{n}\left\|\nabla_\theta L\left(T^{c+1}(x)\right)\right\| \cdot\left\|\sum_j H_\theta^{-1} \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)\right\| \\ & \lesssim L_{\text {test }}^{c+1}+\frac{1}{n}\left\|\nabla_\theta L\left(T^c(x)\right)\right\| \cdot\left\|\sum_j H_\theta^{-1} \nabla_\theta L\left(T^{c+1}\left(x_j\right)\right)\right\| \end{aligned}
$$

那么在主动学习的范畴下，更高的 $\left\|\nabla_\theta L\left(T^{c}(x)\right)\right\|$ 可以使得 $L_{\text {test }}^{c+1}$ 的上界更低。
所以应当选择梯度范数更低的样本。

具体梯度的计算需要通过 loss function 使用反向传播。
然而具体的真实标记并未获得，所以需要特地设计损失函数来计算梯度。
文章中提到了两种梯度的计算，第一种是 Expected-Gradnorm Scheme

$$
\begin{equation}
L_{exp}\left(T^c(x)\right)=\sum_{i=1}^N P\left(y_i \mid x\right) L_i\left(T^c(x), y_i\right)
\end{equation}
$$

另一种是 Entropy-Gradnorm Scheme

$$
\begin{equation}
L_{e n t}\left(T^c(x)\right)=-\sum_{i=1}^N P\left(y_i \mid x\right) \log P\left(y_i \mid x\right)
\end{equation}
$$

## 主动学习相关

当然也有很多其他的主动学习工作使用到了梯度，但是他们考虑问题的入手角度不同。
本文介绍的这种通过梯度的评估本质上是考虑其对测试误差的提升。
而其他的基于梯度方法通常是来评估样本对模型可能带来多大的改变，比如 EGL 和 BADGE。
尤其是 EGL，在形式上和本文介绍的方法很相似，不同的是其仅计算最后一层的梯度。

## 一些数学基础：Hessian 矩阵

黑塞/海森矩阵是在求多元函数的所有二阶偏导数。
具体来说，假设有一个实值函数 $f\left(x_1, x_2, \ldots, x_n\right)$，其所有的二阶偏导数在定义域内连续，那么函数的黑塞矩阵为

$$
\begin{equation}
\mathbf{H}=\left[\begin{array}{cccc}
\frac{\partial^2 f}{\partial x_1^2} & \frac{\partial^2 f}{\partial x_1 \partial x_2} & \cdots & \frac{\partial^2 f}{\partial x_1 \partial x_n} \\
\frac{\partial^2 f}{\partial x_2 \partial x_1} & \frac{\partial^2 f}{\partial x_2^2} & \cdots & \frac{\partial^2 f}{\partial x_2 \partial x_n} \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial^2 f}{\partial x_n \partial x_1} & \frac{\partial^2 f}{\partial x_n \partial x_2} & \cdots & \frac{\partial^2 f}{\partial x_n^2}
\end{array}\right]
\end{equation}
$$

用下标记号表示为 $\mathbf{H}_{i j}=\frac{\partial^2 f}{\partial x_i \partial x_j}$。

可以在泰勒展开中理解这个矩阵。
在一元函数中，泰勒展开式为

$$
f(x)=f\left(x_0\right)+f^{\prime}\left(x_0\right) \Delta x+\frac{f^{\prime \prime}\left(x_0\right)}{2 !} \Delta x^2+\cdots
$$

相应的，在多元函数中

$$
f(x)=f\left(x_0\right)+\nabla f\left(x_0\right)^{\mathrm{T}} \Delta x+\frac{1}{2} \Delta x^{\mathrm{T}} \mathbf{H}\left(x_0\right) \Delta x+\cdots
$$

## Reference
1. Wang, Tianyang, et al. "Boosting active learning via improving test performance." Proceedings of the AAAI Conference on Artificial Intelligence. Vol. 36. No. 8. 2022.
2. Koh, Pang Wei, and Percy Liang. "Understanding black-box predictions via influence functions." International conference on machine learning. PMLR, 2017.
3. https://en.wikipedia.org/wiki/Hessian_matrix