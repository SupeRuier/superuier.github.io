---
title: 分布间距离度量
date: 2022-03-24 14:30:00
updated: 2022-03-26 16:00:00
cover: /gallery/covers/distribution-distance.png
category: 
- Math
toc: true
tags: 
- machine-learning
- distribution
- KL-divergence
- JS-divergence

---
<!-- omit in toc -->

对常用的分布间距离度量进行一个学习和复习。
本文仅为初稿，日后随着理解的加深应该会进行修改和填补。

<!-- more -->

参考：
1. [Statistical distance](https://en.wikipedia.org/wiki/Statistical_distance)
2. [Jensen–Shannon divergence](https://en.wikipedia.org/wiki/Jensen–Shannon_divergence)
3. [From GAN to WGAN](https://lilianweng.github.io/posts/2017-08-20-gan/)
4. [令人拍案叫绝的Wasserstein GAN](https://zhuanlan.zhihu.com/p/25071913)
5. [Wasserstein metric](https://en.wikipedia.org/wiki/Wasserstein_metric)
6. [MMD Maximum Mean Discrepancy 最大均值差异](https://zhuanlan.zhihu.com/p/163839117)
7. [马氏距离(Mahalanobis Distance)](https://zhuanlan.zhihu.com/p/46626607)

---------

正式开始之前，我想先总结一下为什么我们需要分布距离的度量。
首先这里的距离并不是指我们常见的欧式距离，而是某种分布间的差异或者相似度。
在我朴素的视角看来，它能为我们解答的最直观的问题是：
- 这两个分布是不是同一个分布？
- 已知一个分布，另一个分布需要多少额外的信息？

这些度量一般需要满足一些性质：正定（大于等于零，且可以取到0），对称，满足三角不等式。
以下就是一些常见的度量。

## Kullback–Leibler Divergence (KL-Divergence)

对于分布 $P$ 和 $Q$，已知其交叉熵，可以得到 $P$ 相对于 $Q$ 的相对熵：

$$
D_{\mathrm{KL}}(p \| q) = H(p, q) - H(p) =-\sum_{x} p(x) \log \frac{q(x)}{p(x)}
$$

相对熵又称为 KL 散度，是两个概率分布 $P$ 和 $Q$ 差别的一种非对称性度量，严格意义上不能理解为距离。
其表示使用基于分布 $Q$ 的编码表来编码服从分布 $P$ 的样本（相比起用 $P$ 自己的分布来编码）所需的额外的平均比特数。
在 KL 散度的基础上可以定义交叉墒，参见我们的{% post_link machine-learning/cross-entropy 另一条博文%}。

KL 散度的一些特征：
- $p(x)$ 概率更大的匹配区域更加重要（一个更大的权重）。
- 不对称性。
- 不满足三角不等式。

## Jensen-Shannon Divergence (JSD)

JSD 解决了 KL-Divergence 非对称的问题。
其形式为两个 KL-Divergence 之和。

$$
D_{\mathrm{JS}}(p \| q) = \frac{1}{2}D_{\mathrm{KL}}(p \| \frac{p+q}{2}) + \frac{1}{2}D_{\mathrm{KL}}(q \| \frac{p+q}{2})
$$

其同样可以推广到多分布情况，在每个分布的权重为 $\pi_{i}$ 的情况下。

$$
D_{\mathrm{JS}}(P_1, P_2,...,P_n) = \sum_{i} \pi_{i} D_{\mathrm{KL}}(P_i \|M) = H(M) - \sum_{i} \pi_{i} H(P_i)\\
where, M = \sum_{i} \pi_{i} P_i
$$


JS 距离的一些特征：
- 在以2为底的情况下，JSD的值域为 $[0, 1]$。

## Maximum Mean Discrepancy (MMD)

迁移学习中常用的损失函数，用来描述两个分布差别。
首先通过一个连续函数 $f$ 将随机变量映射到高阶，再求其期望之差的上界，定义如下：

$$
MMD(P, Q) = \lVert E_{X \sim P}[ f(X) ] - E_{Y \sim Q}[ f(Y) ]\rVert _\mathcal{H}
$$

又由于均值是期望的无偏估计，我们用均值替代:

$$
MMD(P, Q) = \lVert \frac{1}{n} \sum_{i=1}^{n}f(x_i) -\frac{1}{m} \sum_{j=1}^{m}f(y_j) \rVert _\mathcal{H}
$$

当映射函数仅仅为 $f(x)=x$ 时，MMD 表示两个分布均值点的距离。
而当 $f(x)$ 为无穷维时，我们无法直接计算，此时可以使用核技巧，等号两边同时平方，定义核函数来计算（常用高斯核）。

## Wasserstein Distance

又被称为推土机距离 Earth Mover's Distance，来表述把一堆土堆成另一堆土的形状所需要的最小代价。
在连续条件下可以写成如下形式：

$$
W_{p}(\mu ,\nu):=\left(\inf _{\gamma \in \Gamma (\mu ,\nu )}\int _{M\times M}d(x,y)^{p}\,\mathrm {d} \gamma (x,y)\right)^{1/p}
$$

其中 $\gamma$ 是一个边缘分布分别为 $\mu$ 和 $\nu$ 的联合概率分布，称作 coupling。

Wasserstein Distance 具有的优点：
- 可以衡量离散和连续分布间的距离
- 即使两个分布没有重叠，也可以反映他们的远近
- 考虑到概率分布的几何特性
- 可以体现如何从一个分布转换为另一个分布
- 这个距离是平滑的，可以提供梯度信息

### 一维分布下的计算

对于两个分布 $\mu _{1},\mu _{2}\in P_{p}(\mathbb {R} )$ 和他们的 CDF $F_1(X), F_2(X)$，和对应的 inverse-CDF $F_1^{-1}(X), F_2^{-1}(X)$，有：

$$
W_{p}(\mu _{1},\mu _{2})=\int _{0}^{1}\left|F_{1}^{-1}(q)-F_{2}^{-1}(q)\right|^{p}\,\mathrm {d} q
$$

这可以看作分布间差异的的横向求和，可以理解为在 x 维度上对沙土的搬运。
此外，当 $p=1$ 时，可以看作分布间差异的纵向求和：

$$
W_{1}(\mu _{1},\mu _{2})=\int _{\mathbb {R} }\left|F_{1}(x)-F_{2}(x)\right|\,\mathrm {d} x
$$

在运用 Wasserstein 距离的 WGAN中，在对 W 距离进行优化的时候，可以转化为对以下 Loss 进行优化，其中 $P_r$ 和 $P_g$ 分别是真实分布和生成分布：

$$
L = \mathbb{E}_{x \sim P_r} [f_w(x)] - \mathbb{E}_{x \sim P_g} [f_w(x)]
$$

在这个简化的数学形式下，和 MMD 十分相似。

## Bhattacharyya Distance

巴式距离，很好理解，看公式一目了然。
需要注意的是其并不满足三角不等式。

$$
BC(p,q)=\int {\sqrt {p(x)q(x)}}\,dx
$$

## Mahalanobis Distance

这个其实不是分布间距离的度量，而是与欧式距离曼哈顿距离同一个层级的概念。
主要是每天听 dzy 说这个距离，就顺便看一眼。

首先要提到欧式距离的缺点：
- 不同维度等同对待，哪怕单位不同
- 不考虑维度的相关性（非独立同分布）
- 举例：身高体重，量纲不同，两者相关

马氏距离的主要思想在于使用主成分分析中的主成分来进行标准化。
由主成分分析可知，由于主成分就是特征向量方向，每个方向的方差就是对应的特征值，所以只需要按照特征向量的方向旋转，然后缩放特征值倍即可。
当个维度独立同分布，则变为欧式距离。

$$
D_{M}(x, y)=\sqrt{(x-y)^{T} \Sigma^{-1}(x-y)}
$$

其中 $\Sigma$ 是多维随机变量的协方差矩阵。