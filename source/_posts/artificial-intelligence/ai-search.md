---
title: 人工智能的中的搜索
date: 2021-09-27 16:00:00
updated: 2021-09-29 13:00:00
index_img: /gallery/covers/ai-search.jpeg
categories:
- Artificial Intelligence
tags: 
- AI
- search
---

人工智能中关于搜索的一些最基础的知识。

<!-- more -->

## AI 中的搜索

对于一个 goal-based agent，搜索是使其找到一个动作或者一系列动作来达到目标。
有很多例子，比如走迷宫，寻路问题，8-queen 问题等。
一般来说包含树搜索和图搜索等。

## 对于考虑路径的搜索而言

评估策略需考虑以下四个维度：
- Completeness: Does it always find a solution if it exists?
- Time complexity: # nodes generated/expanded.
- Space complexity: maximum # nodes in memory.
- Optimality: Does it always find the least-cost solution?

存在两类搜索策略：
- Uniformed
    - Breadth-first search (BFS): Expand shallowest node
    - Depth-first search (DFS): Expand deepest node
    - Depth-limited search (DLS): Depth first with depth limit
    - Iterative-deepening search (IDS): DLS with increasing limit
    - Uniform-cost search (UCS): Expand least cost node (the cost could be the length between nodes)
- Informed
    - Greedy best-first search: Expand the node that appears to be closest to goal
    - A* search: Minimize the total estimated solution cost (to middle node + node to goal；f=g+h). BFS mode.
    - IDA*: IDS + A*. DLS mode. The cost of space is lower than A*.

对于 A* 中启发式策略而言（h）：
- A good heuristic must be admissible.
- An admissible heuristic never overestimates the cost to reach the goal, that is it is optimistic
- For admissible $h_1$ and $h_2$, if $h_1$(s) ≥ $h_2$(s) for ∀𝑠 ⇒ $h_1$ dominates $h_2$ and is more efficient for search.

UCS vs Greedy Best First vs A*:
- UCS：f(n) = g(n) 
- Greedy Best First: f(n) = h(n) 
- A*: f(n)=g(n)+h(n)

## 对于不考虑路径的搜索

Local search: the path doesn't matter
- Hill climbing
- Genetic algorithms
- Simulated Annealing: Given a chance to jump out the local minimum
