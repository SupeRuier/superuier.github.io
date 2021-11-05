---
title: 距离矩阵
cover: /gallery/covers/distance-matrix.jpeg
date: 2021-11-05 16:48:00
updated:  2021-11-05 16:48:00
category: 
- Machine Learning
toc: true
tags: 
- machine-learning

---

<!-- omit in toc -->

在看 k-center 的时候发现自己对其距离矩阵的计算不是很清楚，于是在此记录。

<!-- more -->

## 距离矩阵的计算及 Python 实现

给定 $m\times n$ 矩阵 $X$, $X = [x_1, x_2,...,x_n]$，
这里第 $i$ 列向量 $x_i$ 是 $m$ 维向量，任务是计算出一个 $n\times n$ 矩阵，使得：
$D_{ij}=||x_i-x_j||^2$。

具体的，$D_{ij} = (x_i - x_j)^T(x_i-x_j)=x^T_ix_i-2x^T_ix_j+x^T_jx_j$。

用 Gram Matrix 表示，$D_{ij}=G_{ii}-2G_{ij}+G_{jj}$。

放在矩阵的尺度来看，$D = H + K -2G$。
其中，$H_{ij} = G_{ii}, K_{ij} = G_{jj}$。

根据最后一个式子，计算的时候可以避免循环：

``` python
def compute_dist_matrix(X):
  m,n = X.shape
  G = np.dot(X.T, X)
  H = np.tile(np.diag(G), (n, 1)) # Construct an array by repeating the number of times.
  return H + H.T - 2*G
```

Reference:
- [斯坦福CS231N课程笔记（三）-距离矩阵的计算方法](https://zhuanlan.zhihu.com/p/21341296)