---
title: Contrastive Learning 再次学习
index_img: /gallery/covers/contrastive-learning-again.jpg
banner_img: /gallery/covers/contrastive-learning-again.jpg
date: 2023-02-21 18:00:00
updated:  2023-02-21 18:00:00
category: 
- Machine Learning
toc: true
tags: 
- machine-learning
- contrastive-learning
- self-supervised-learning

math: true
---
<!-- omit in toc -->

由于最近工作需要用到对比损失，这里对近期看到的一些资料进行整理。
之前我们也对对比学习做过一个初步学习，具体详见{% post_link machine-learning/contrastive-learning 此笔记%}。

<!-- more -->

本文主要是对以下三篇资料的学习：
- SimCSE: Simple Contrastive Learning of Sentence Embeddings [[2021, EMNLP]](https://arxiv.org/pdf/2104.08821.pdf)
- Prototypical Contrastive Learning of Unsupervised Representations [[2021, ICLR]](https://arxiv.org/pdf/2005.04966.pdf)
- **Tutotial:** Contrastive Data and Learning for Natural Language Processing [[2022, NAACL]](https://contrastive-nlp-tutorial.github.io/files/contrastive_nlp_tutorial.pdf)

# SimCSE

同时有监督式和无监督式对比学习，standard **dropout** used as noise：
1. Unsupervised approach:
   - 使用两次 dropout 并互为正样本。
   - Unsupervised SimCSE essentially improves uniformity while avoiding degenerated alignment via dropout noise, thus improving the expressiveness of the representations.
2. Supervised approach:
   - 将标注样本加入对比学习。
   - Takes alignment between semantically-related positive pairs and uniformity of the whole representation space to measure the quality of learned embeddings.
3. 对比了其他的正样本生成方式：
   -  crop / word deletion / synonym replacement
4. 使用 supervised  和 unsupervised CL：
   - 目测这个 supervised 里面已经包含了 unsupervised？
   - 在他自己的分析中，他们这种使用 dropout 的方法保证了 uniformity 和 alignment。

# Prototypical Contrastive Learning

同时使用无监督对比表征学习和聚类。
1. It encodes semantic structures discovered by clustering into the learned embedding space.
2. Propose ProtoNCE loss, a generalized version of the InfoNCE loss for contrastive learning, which encourages representations to be closer to their assigned prototypes.
   - 包含一项 infoNCE，to retain the property of local smoothness and help bootstrap clustering.
   - 也包含一项 cluster 相关的 loss，形式和 infoNCE 很像，只是把 augmented examples 替换成了 cluster centroids。这个其实可以看做某种半/无监督类型的对比，因为本质上是使用了 pseudo-labels。

# Contrastive Data and Learning for NLP

这个是 NAACL 上的一个 Toturial，此处记录一些自认为重要的点：
1. Contrastive Learning = Contrastive Data Creation + Contrastive Objective Optimization
2. Noise Contrastive Estimation (NCE) 仅是对比学习中的一类 loss。
3. Normalized Temperature-scaled Cross-Entropy (NT-Xent) 即为 InfoNCE with Cosine Similarity on Normalized Embeddings。
4. Hard negative mining: find hard negative examples. We want to ancher-neg is greater than anchor-pos, at least by the margin.
5. 更大的批选取通常有更好的表现。
6. Two geometric forces on the hypersphere: alignment & uniformity

# My Questions?

本次阅读这些文章主要是为了回答自己的两个问题：
1. 在文本上如何进行正负样本的构建？（图像上的构建方式在上一次的学习笔记中已经提到不少。）
   - crop / word deletion / synonym replacement / back-translation / cut-off / mixup
2. 同时添加 supervised 和 unsupervised contrastive loss 这种方式有时表现不错，如何解释？
   - 前两篇文章都有监督损失和非监督损失的结合，都取得了较好的表现。
   - 或许是因为两种结合可以更好的保证学得表征的 alignment & uniformity。
