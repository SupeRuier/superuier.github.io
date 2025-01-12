---
title: BEVFormer
index_img: /gallery/covers/bevformer.png
banner_img: /gallery/covers/bevformer.png
toc: true
date: 2024-08-10 16:00:00
updated: 2024-08-10 16:00:00
category:
- Autonomous Driving
tags:
- neural-network
- machine-learning
- attention
- transformer
- autonomous-driving
- perception

math: true

---
<!-- omit in toc -->

BEV (Bird's Eye View) 是自动驾驶领域中常见的一种视角，其将车辆周围的环境投影到一个俯视的平面上，以便更好地理解车辆周围的环境。
本文通过对 BEVFormer 的学习，来理解 BEV 如何构建及如何使用。

仅阅读论文可能难以对该方法有全面的认识，之后需要对代码进行阅读以及理解。

<!-- more -->

<!-- {% note primary %}
Decoder 本质上做的事情：读入 encoder 的输出，输入 "BEGIN"，逐项输出一系列概率向量并指向一个字符。
{% endnote %} -->

# 为什么要使用 BEV？

BEV 全称是 Bird's Eye View（鸟瞰视角），实现方法是把原本摄像头 2D 的视角通过算法校正和改变，形成基于上帝视角的俯视图。
从本质上来说，BEV算法就是将传感器输入转换到统一的俯视角度下进行处理，是一种特征融合的方法。

<div style="width:100%;margin:auto">{% asset_img bev.jpeg BEV 示例%}</div>

使用 BEV 有着以下几个优势：
- 第一，BEV 视角下的物体，不会出现图像视角下的尺度（scale）和遮挡（occlusion）问题。
  由于视觉的透视效应，物理世界物体在 2D 图像中很容易受到其他物体遮挡，2D感知只能感知可见的目标，而在BEV空间内，算法可以基于先验知识，对被遮挡的区域进行预测。
- 第二，将不同视角在BEV下进行统一表达，能极大方便后续规划和控制任务。
  主流规划和控制算法，不论上游传感器信息来自什么视角，经过融合之后，都会转换到以自车为中心坐标系中（Vehicle Coordinate System，VCS），对 VCS 来说，最适合的其实就是 BEV 视角，也就是 BEV 感知结果输出的空间是规划和控制任务的标准输入。
- 第三，BEV 能够给系统带来巨大的提升。
  摄像头感知算法工作在 2D 空间，而雷达感知算法工作在 3D 空间，在对 2D 与 3D 几何关系融合过程中，会丢失大量的原始信息，采用 BEV 感知系统中，摄像头、激光雷达、毫米波雷达感知均在 BEV 空间中进行，融合过程提前。
  BEV还可以引入过去时间片段中的数据，实现时序融合，最终使感知效果更加稳定、准确。
- 第四，BEV能够实现端到端优化。
  感知任务中的识别、跟踪和预测本质是一个串行系统，系统上游误差会传递在下游误差，在 BEV 空间内，感知和预测都在同一个空间进行，可以通过神经网络做到端到端的优化，输出“并行”结果，而整个感知网络可以以数据驱动方式来自学习，实现快速迭代。

# BEVFormer 架构

<div style="width:100%;margin:auto">{% asset_img illustration.png 一个示意图%}</div>

BEVFormer 是一个基于 transformer 的模型，用于处理 BEV 空间的感知任务。
如图所示，考虑到了空间 Spatial Attention 和时间 Temporal Attention，以及不同传感器的融合。

## 模型结构

<div style="width:100%;margin:auto">{% asset_img architecture.png 模型结构%}</div>

## 特征提取

- 模型整体的输入为一个六维的张量：（batch size，连续帧数，每帧图像数，图像高度，图像宽度，通道数）
- Backbone + Neck （ResNet-101-DCN + FPN）提取环视图像的多尺度特征
  - 输入为单帧的张量：（batch size，每帧图像数，图像高度，图像宽度，通道数）
  - 对于 nuSences 数据集来说，每帧图像数为 6。
  - 输出为：（batch size，每帧图像数，通道数，特征高度/64，特征宽度/64）

## Encoder 结构

首先使用的是一个 Encoder 结构的 Transformer 模型，包括 Temporal Self-Attention 模块和 Spatial Cross-Attention 模块，完成环视图像特征向 BEV 特征的建模。
两个模块中都运用到了多尺度的可变形注意力模块（Deformable Attention）用于将全局注意力变为局部注意力，用于减少训练时间。该思想来源于 Deformable DETR。
之后再使用 Eecoder 结构来进行下游任务。

### Temporal Self-Attention 模块

通过当前时刻的 BEV Query $Q$ 和上一时刻的 BEV 特征 $B_{t-1}$ ，首先对上一时刻的 BEV 特征进行对齐，$B_{t-1}^{\prime}$ 是经过对齐后的 BEV 特征。
对齐的过程是通过车辆的运动信息进行的，使得相同网格的特征对应到相同的真实世界位置，但是由于物体在真实世界中的运动是不确定的，因此需要通过 Temporal Self-Attention (TSA) 模块来建模特征之间的时序关系。

$$
\operatorname{TSA}\left(Q_p,\left\{Q, B_{t-1}^{\prime}\right\}\right)=\sum_{V \in\left\{Q, B_{t-1}^{\prime}\right\}} \operatorname{DeformAttn}\left(Q_p, p, V\right),
$$

$Q_p$ 指 $p=(x, y)$ 处的 BEV Query。
不同于普通的可变形注意力，时序自注意力中的偏移（offset）$\Delta p$ 是由 $Q$ 和 $B_{t-1}^{\prime}$ 的拼接预测的。
特别地，对于每个序列的第一个样本，时序自注意力将退化为一个没有时序信息的自注意力，其中我们将 BEV 特征 $\left\{Q, B_{t-1}^{\prime}\right\}$ 替换为重复的 BEV 查询 $\{Q, Q\}$。
最后输出的 BEV Query 是对两个 BEV Query 的平均。

<!-- ```txt
各个参数的 shape 情况 
1. value: (2，40000，8，32） # 2: 代表前一时刻的 BEV 特征和后一时刻的 BEV 特征，两个特征在计算的过程中是互不干扰的，
                             # 40000: 代表 bev_query 200 * 200 空间大小的每个位置
                             # 8: 代表8个头，
                             # 32: 每个头表示为 32 维的特征
2. spatial_shapes: (200, 200) # 方便将归一化的 sampling_locations 反归一化
3. level_start_index: 0 # BEV 特征只有一层
4. sampling_locations: (2, 40000, 8, 1, 4, 2)
5. attention_weights: (2, 40000, 8, 1, 4)
6. output: (2, 40000, 8, 32)
``` -->

### Spatial Cross-Attention 模块

用于建模空间维度的信息，同样的，由于多头自注意力的计算量较大，因此仍使用可变形注意力模块来减少计算量。
Spatial Cross-Attention (SCA) 可以写作：

$$
\operatorname{SCA}\left(Q_p, F_t\right)=\frac{1}{\left|\mathcal{V}_{\text {hit }}\right|} \sum_{i \in \mathcal{V}_{\text {hit }}} \sum_{j=1}^{N_{\text {ref }}} \operatorname{DeformAttn}\left(Q_p, \mathcal{P}(p, i, j), F_t^i\right)
$$

其中 $\mathcal{V}_{\text {hit}}$ 是在当前 BEV Query $Q_p$ 中的 2D 点可能命中的相机视角集合，$F_t^i$ 是其中第 $i$ 个相机视角的特征。
$j$ 是参考点的索引，$N_{\text {ref}}$ 是每个 BEV 查询的总参考点数。
对于每个 BEV 查询 $Q_p$，我们使用投影函数 $\mathcal{P}(p, i, j)$ 从第 $i$ 个相机视图中获取第 $j$ 个参考点。

$$
x^{\prime}=\left(x-\frac{W}{2}\right) \times s ; \quad y^{\prime}=\left(y-\frac{H}{2}\right) \times s,
$$

其中 $H, W$ 是 BEV 查询的空间形状，$s$ 是 BEV 网格的分辨率大小，$\left(x^{\prime}, y^{\prime}\right)$ 是车辆位置为原点的坐标。
在 3D 空间中，位于 $\left(x^{\prime}, y^{\prime}\right)$ 处的物体将出现在 $z$ 轴上的高度 $z^{\prime}$ 处。
因此，我们预定义一组锚点高度 $\left\{z_j^{\prime}\right\}_{j=1}^{N_{\text {ref }}}$，以便我们可以捕捉出现在不同高度的线索。
这样，对于每个查询 $Q_p$，我们获得了一根 3D 参考点柱 $\left(x^{\prime}, y^{\prime}, z_j^{\prime}\right)_{j=1}^{N_{\text {ref }}}$。
最后，我们通过相机的投影矩阵将 3D 参考点投影到不同的图像视图中。

$$
\begin{aligned}
\mathcal{P}(p, i, j) & =\left(x_{i j}, y_{i j}\right) \\
\text { where } z_{i j} \cdot\left[\begin{array}{lllll}
x_{i j} & y_{i j} & 1
\end{array}\right]^T & =T_i \cdot\left[\begin{array}{llll}
x^{\prime} & y^{\prime} & z_j^{\prime} & 1
\end{array}\right]^T .
\end{aligned}
$$

这里，$\mathcal{P}(p, i, j)$ 是从第 $i$ 个视图投影的第 $j$ 个 3D 点 $\left(x^{\prime}, y^{\prime}, z_j^{\prime}\right)$ 的 2D 点，$T_i \in \mathbb{R}^{3 \times 4}$ 是第 $i$ 个相机的已知投影矩阵。

### 前向网络及输出

Spatial Cross-Attention 模块的输出通过一个前向网络，得到最终的 BEV 特征。
该 BEV 特征将作为后续 Decoder 的输入，可以用于完成不同的感知任务。

## 下游任务

### 目标检测

需要预测 10 个参数，包括 3 个尺度参数 $(l,w,h)$，3 个中心位置参数 $(x,y,z)$，2 个旋转参数 $(cos(θ),sin(θ))$，2 个速度参数 $(v_x ,v_y)$。
参考 Detr3D 中的 Decoder 模块，推理阶段使用 900 个 object queries，并保留 300 个具有最高置信度分数的预测框。
$L_1$ 损失在训练阶段被使用，对预测值和真值十个维度的差值进行计算。
采用 Transformer 中常用的匈牙利匹配算法，Focal Loss + L1 Loss 的总损失和最小。

### 全景分割

<div style="width:50%;margin:auto">{% asset_img segmentation.png 分割头结构%}</div>

全景分割的模型结构如上图所示，是一个遮罩分割头，参考 Panoptic SegFormer，用 query 来预测每个像素的类别，并生成 segmentation mask。

# 总结

本问介绍了 BEVFormer 的模型结构，主要包括特征提取、Encoder 结构和下游任务。
BEV 作为 Query，贯穿了整个 transformer 模型结构，包含了当前的位置信息。
这种基于 transformer 的模型结构，构建了 BEV 空间，更好的对应了下游的感知任务，也为进一步规划控制任务提供了更好的输入。

# Reference
- [一文看懂BEVFormer技术及其背后价值](https://36kr.com/p/2259709856149378)
- BEVFormer: Learning Bird’s-Eye-View Representation from Multi-Camera Images via Spatiotemporal Transformers
- [万字长文理解纯视觉感知算法 —— BEVFormer - Fangzh的文章 - 知乎](https://zhuanlan.zhihu.com/p/543335939)

