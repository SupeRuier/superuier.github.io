---
title: Miniconda
date: 2020-12-04 20:18:50
categories:
- Programming
tags: Conda
---

Miniconda 与 Anaconda 为 conda 的发行版，主要用于包管理，其中 miniconda 更轻量级。
由于日常使用总是会忘记，所以此处记录一些常用的命令。

<!-- more -->

## 安装

首先从清华源下载安装包并安装。

``` bash
wget -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/Miniconda2-4.5.11-Linux-x86_64.sh
bash Miniconda2-4.5.11-Linux-x86_64.sh
source ~/.bashrc
```

Conda 默认的软件源在国外,速度非常的慢,我们可以将其更换为清华源。
可以直接在`.condarc`中添加

{% codeblock .condarc lang:bash %}
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
{% endcodeblock %}

## 配置

创建所需要环境

```
conda create -n py3.8 python=3.8
```
激活环境
```
conda activate py3.8
```
然后下包
```
conda install XXX
```
退出环境
```
conda deactivate py3.8
```