---
title: A Survey of Deep Active Learning
date: 2020-12-20 18:47:07
updated: 2020-12-20 18:47:07
category: 
- Paper Reading
tags:
- active-learning
- survey
---

记录一篇深度主动学习的调研文章。
2020年，这篇 survey 被挂在了 arxiv 上， 见此[链接](https://arxiv.org/abs/2009.00236)。
此篇 survey 全30页，引用189篇参考文献。

<!-- more -->

## Introduction

Background: A rich variety of related work has been published, DeepAL still lacks a unified classification framework.

Challenges of DeepAL:
- Insufficient data for label samples
  - The labeled training samples provided by the classic AL are insufficient to support the training of traditional DL.
  - The non-batch sample query method commonly used in AL is not applicable in the DL context.
- Model uncertainty
  - The softmax response of the final output is unreliable as a measure of confidence, and the performance of this method will thus be even worse than that of random sampling. DL model can be too confident about the output results.
- Processing pipeline inconsistency
  - AL: fixed features + learned classifiers
  - DL: learned features + learned classifiers
  - Only fine-tuning the DL models in the AL framework, or treating them as two separate problems, may thus cause divergent issues.

## Approaches

In general they summarized the corresponding approaches for the challenges.
- Insufficient data for label samples
  - data augmentation
  - assigning pseudo-labels
  - combine supervised and semi-supervised training
  - batch sample
- Model uncertainty
  - Bayesian deep learning
- Processing pipeline inconsistency
  - Modify the combined framework of AL and DL to make the proposed DeepAL model as general as possible

## Query strategies

Batch Mode DAL should be satisfied.
The reference indexes are copied.

1. Uncertainty-based and hybrid query strategies
   - directly use uncertainty sampling (non-batch) [9, 59, 114, 123]
   - query batch sample set representative to the distribution [177:Exploration-P, 183:DBAL, 99:WI-DL]
     - the richer the category content of the dataset, the larger the batch size, and the better the effect of diversity-based methods;
   - query batch sample set representative to the gradient embedded space [10:BADGE]
   - query batch sample set representative by adversarial method [146:WWAL, 150:VAAL, 81:TA-VAAL]
2. Deep Bayesian Active Learning 
   - obtain the posterior distribution of network prediction [47:DBAL, 118:DEBAL, 28:DPEs, 114:ActiveLink]
   - obtain the mutual information between the batch samples and the model parameters [84: BatchBALD]
   - reconstructed the batch structure to optimize the sparse subset approximation [117:ACS-FW]
   - other [54, 105, 126, 147, 175, 179]
3. Density-based Methods
   - core-set approach [49:FF-Active, 138:core-set]
   - discriminative approach [35:Active Palmprint Recognition, 51:DAL]
4. Other 
   - RL approach [37]
   - Adversarial examples[36:DFAL]
   - ensemble [14]
   - flexible acquisition function [57:RAL, 100:DRAL]
   - with NAS [50:Active-iNAS]

## Model training

Normally accompanied with insufficient data (under the view of DAL).

1. assigning pseudo-labels [166:CEAL]
2. combine unsupervised feature learning [99:WI-DL]
3. data augmentation [187:GAAL, 162:BGADL, 107:ARAL]
4. add adversarial task [150:VAAL, 81:TA-VAAL]

## DAL on the generalization of the model

1. Use the final layer output to make query
2. ALso use the middle layer output to make query [59:AL-MV, 178:LLAL, 182]