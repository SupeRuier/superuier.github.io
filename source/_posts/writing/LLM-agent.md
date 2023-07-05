---
title: 大语言模型代理
date: 2023-07-05 12:00:00
updated: 2023-07-05 12:00:00
index_img: /gallery/covers/LLM-agent.jpg
banner_img: /gallery/covers/LLM-agent.jpg
toc: true
categories:
- Writing
tags: 
- 随笔
- 互联网
- chatgpt
---

其实自己一直在想大语言模型（仅讨论 LLM，其他任务上的 transformer 生成模型不考虑）可以做什么，绝大多数人的想象力都是有限的，我也不例外。
我的主要观点一直在不断的坚定，即“非结构化数据处理”的问题，当然这个问题在哪里还需要广泛深度的调研。
昨天终于有空读了 Lilian Weng 的 LLM Powered Autonomous Agents[^1]，这篇博客从“术”的层面，介绍了大语言模型可以在能力边界上做什么扩展。
这一类工作被称为“自动代理”，面向特定任务。

<!-- more -->

# 文章关键内容

个人认为此博客比较细致，谈到了方方面面，此处我们粒度不需要那么细。
文章中最重要的内容我认为是对整体技术脉络的把控（**技术树**）以及对大语言模型的能力边界的划分（**局限性/挑战**）。
本节内容全部摘录自博客原文。

<div style="width:80%;margin:auto">{% asset_img agent-overview.png Agent 概览%}</div>

**Challenges：**
- **Finite context length**: The restricted context capacity limits the inclusion of historical information, detailed instructions, API call context, and responses. The design of the system has to work with this limited communication bandwidth, while mechanisms like self-reflection to learn from past mistakes would benefit a lot from long or infinite context windows. Although vector stores and retrieval can provide access to a larger knowledge pool, their representation power is not as powerful as full attention.
- Challenges in **long-term planning** and **task decomposition**: Planning over a lengthy history and effectively exploring the solution space remain challenging. LLMs struggle to adjust plans when faced with unexpected errors, making them less robust compared to humans who learn from trial and error.
- **Reliability of natural language interface**: Current agent system relies on natural language as an interface between LLMs and external components such as memory and tools. However, the reliability of model outputs is questionable, as LLMs may make formatting errors and occasionally exhibit rebellious behavior (e.g. refuse to follow an instruction). Consequently, much of the agent demo code focuses on parsing model output.

# 个人思考

核心观点仍旧是“LLM 的强项在且仅在于非结构化数据处理”，但是从这一角度细化下去还是有很多东西可以谈。
- 什么是“非结构化数据”？
  - 这类型的数据在哪个领域大量存在？这个数据在哪个领域十分重要？
  - 在这些领域上“非结构化数据”带来的挑战是不是以前无法解决的？即之前我们没有很好的办法来处理这些数据？（或许这个要讨论调研 NLP 方向以及智能决策方向的大多数任务。）
- “数据处理”的输出是什么？
  - 是要处理为结构化数据吗？那么似乎可以用于专用的领域强模型。
  - 是要处理为另一种非结构化数据吗？那么似乎直接用于需要非结构化数据的任务。
- “数据处理”之后要做什么？
  - 之前能做但是没做好的任务。
  - 之前不能做的任务。

还是没想清楚 LLM 带来了什么本质上的不同，似乎只是在“非结构化数据处理”这一步上有了更好的方法，但是这个方法能做什么，能做到什么程度，还是需要思考。

# Reference

[^1]: [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)
