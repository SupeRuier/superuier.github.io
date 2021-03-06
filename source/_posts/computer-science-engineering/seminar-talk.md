---
title: 讲座及研讨班记录
date: 2020-11-23 18:26:53
category: 
- Computer Science and Engineering
toc: true
tags: cs-seminar
---
<!-- omit in toc -->

本篇Blog用于记录参加的讲座，不定期更新。

<!-- more -->
# 搜索引擎的技术趋势和精准度提高【常毅】

<br>

**主讲人**：常毅教授，吉林大学人工智能学院院长
**日期**：2020/11/23

## 1. Introduction

**搜索引擎架构**：
- 网页爬虫
- 倒排索引（word > document 拿空间换时间的一个过程）
- 网页检索&网页排序（0.2s内）

**PageRank 算法**：

Google最先提出的一种网页排名算法。
大众一般误认为google精准是仅仅是因为PageRank这一项技术，事实上是因为其很多黑科技的结合。

**搜索引擎进化史**：
- 1994-1998 Syntactic matching关键字匹配
- 1998-2006 PageRank，外加利用指向信息，点击信息等
- 2006-2014 垂直搜索，知识图谱
- 2014～ mobile search，私人助手，聊天机器人等

搜索引擎后发劣势（追赶者很难超越）：用户数据积累较少导致效果较差。

深度学习在搜索引擎里的优势远远小于我们所期待的（至少在2016年）。

## 2. Web search ranking review

**排序问题的变换**：
- pointwise：退化为回归问题，用gradient boosting类回归
- pairwise：排错对数越来越少
- listwise

## 3. Yahoo web search ranking practice

简要介绍了2015年KDD best paper的工作。
这是一个系统性的工作，并不仅仅单一的提出了一个算法。

**Practical challenges**：
- avoid ugly result on the top
- Semantic gap between query and document
- Search queues follows a long tail distributions

### 3.1. 排序学习的算法

2010 Yahoo learning rank challenge中前十名都是使用tree-based算法。
2010年得出的结果中lambdaMart > logisticRank。

2015年KDD best paper中logisticRank则好于lambdaMart和2010年结果相悖。

根据2015年的结果总结得出造成这一现象的原因是以前的community都或多或少忽略了"over 99% query-url pairs are bad"这一现象。

### 3.2. 查询改写的方法

机器翻译需要平行语料库，需要以用户反馈来学习查询语料对训练翻译模型。

**举个例子**：
` Tesla Price => How much is a Tesla`

使用用户查询关键字与点击情况进行匹配。

### 3.3. Click similarity feature

当前存在很多feature types，如图所示：
<div style="width:60%; margin:auto">{% asset_img 201123feature_types.jpg%}</div>

Click similarity feature是一种特征提取的方法。
通过二分图对Query进行特征构建

比deep learning效果好。
在特征提取的问题上DL不会dominant，**为什么**？
- Web search ranking is an 'easy' and well studies task -李航
- DL更适用数据初识表示和解决问题的合适表示相距甚远时 -周志华
- DL适用于信息complete的时候，WSR中这一条件并不总是成立。