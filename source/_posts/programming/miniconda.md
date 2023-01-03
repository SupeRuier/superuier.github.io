---
title: Miniconda
index_img: /gallery/covers/conda.png
banner_img: /gallery/covers/conda.png
date: 2020-12-04 20:18:50
updated: 2021-08-19 17:22:50
categories:
- Programming
tags: 
- Conda
- Python
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

Conda 默认的软件源在国外,速度非常的慢,我们可以将其更换为[清华源](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)。
可以直接在`.condarc`中添加

{% codeblock .condarc lang:bash %}
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
{% endcodeblock %}

之后需要使用 `conda clean -i` 清除索引缓存，保证用的是镜像站提供的索引。]
注意有的时候会显示 url 错误， 此时换成 https 可能会解决问题。

## 配置

### 对环境更改

创建所需要环境，一般有三种情况。

``` bash
# 创建新环境
conda create -n py3.8 python=3.8
# 克隆环境
conda create --name myclone --clone myenv
# 直接从 yaml 文件生成新环境
conda env create -f environment.yml
```
激活环境
``` bash
conda activate py3.8
```
然后下载所需软件包
``` bash
conda install XXX
```
退出环境
``` bash
conda deactivate py3.8
```
删除环境
``` bash
conda remove --name myenv --all
```

### 批量导入导出组件

导出导入 yml 文件。

``` bash
conda env export --no-builds > environment.yml
conda env create -f environment.yml
conda env create -f environment.yml -n new_env_name # 新名称
conda env update --file environment.yml # 用于对当前环境更新
```

导出导入 txt 文件：
``` bash
conda list -e > requirements.txt
conda create --name py3.8 --file requirements.txt # 顺便创建环境
conda install --yes --file requirements.txt # 不创建新环境
```