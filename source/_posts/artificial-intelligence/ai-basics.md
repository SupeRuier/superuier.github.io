---
title: 人工智能的基本概念
date: 2021-09-07 17:00:00
updated: 2021-09-07 17:00:00
index_img: /gallery/covers/ai-basics.jpg
categories:
- Artificial Intelligence
tags: AI
---

人工智能基础知识和一些概念。

<!-- more -->

## AI 是什么？

其实很多地方都给出了不同角度的定义，此处仅记录自己的看法。
> AI 是承载于机器或程序，人为设计或训练，并可以解决特定或一些列特定问题的能力。

其涵盖多个计算机领域：机器学习/优化/搜索/etc.

## 智能体

AI 承载于智能体（Agent），即我的定义中的机器或程序。
> Agent = Architecture + Program

在解决问题的过程中，智能体通过传感器（Sensors）接受外界环境（Environment）的信号，并自我处理信息，之后作出相应行动（Action）。
于是在对一个智能体进行定义时，通常要考虑 **PEAS**：
- Performance
- Environment
- Actuators
- Senors

## 环境

环境有很多重要的类别：
- Fully observable (vs. partially observable)
- Deterministic (vs. stochastic)
- Episodic (vs. sequential)
- Static (vs. dynamic)
- Discrete (vs. continuous)
- Single agent (vs. multi-agent)
- Known (vs. Unknown)

下面是一些具体的例子。

| Environment | Observable | Agents | Deterministic | Static       | Discrete   |
| ----------- | ---------- | ------ | ------------- | ------------ | ---------- |
| 8-puzzle    | Fully      | Single | Deterministic | Static       | Discrete   |
| Chess       | Fully      | Multi  | Deterministic | (Semi)Static | Discrete   |
| Poker       | Partially  | Multi  | Stochastic    | Static       | Discrete   |
| Backgammon  | Fully      | Multi  | Stochastic    | Static       | Discrete   |
| Car         | Partially  | Multi  | Stochastic    | Dynamic      | Continuous |
| Cleaner     | partially  | Single | Stochastic    | Dynamic      | Continuous |




