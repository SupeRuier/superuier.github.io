---
title: Cuda 使用记录
date: 2020-12-04 15:02:50
categories:
- Programming
tags: Cuda
---

在服务器上使用cuda遇到一些问题，在此记录。

<!-- more -->

## 在 torch.cuda.is_available() 返回 False
最主要的问题是在 python 中输入`torch.cuda.is_available()`时，返回 False。
猜测应该是某种版本不匹配造成的问题。
于是先查询版本。

通过`nvidia-smi` 查询到的版本为 `CUDA Version: 11.0`， 和我安装的pytorch对应的cuda10.0不兼容。
于是下载对应版本即可解决，注意与 python 发行版的冲突。(下载贼慢)

```
conda install pytorch torchvision cudatoolkit=11.0 -c pytorch
```

## 查询版本

查询版本有[三种方法](https://blog.csdn.net/weixin_44023916/article/details/107256522)。

```
nvidia-smi
```
这个命令既可以查cuda的驱动API版本，也可以查看GPU运行状态。
查询到的版本为：
`NVIDIA-SMI 450.57  Driver Version: 450.57  CUDA Version: 11.0 `。  
最终需要匹配的版本以此命令为准。

```
cat /usr/local/cuda/version.txt
```
`CUDA Version 10.0.130`

```
nvcc --version
```
`Cuda compilation tools, release 10.0, V10.0.130`

有时会显示command not found，解决方法[见此](#nvcc---version-command-not-found)。

## nvcc --version command not found

首先查看
``` bash
ls /usr/local/cuda/bin
```
存在nvcc命令，此时配置环境变量即可。

{% codeblock .bashrc lang:bash %}
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
{% endcodeblock %}

然后更新配置文件。
``` bash
source ~/.bashrc
``` 
