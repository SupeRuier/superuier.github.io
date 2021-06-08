---
title: Docker
date: 2020-11-25 14:56:03
categories:
- Programming
tags: Docker
---

Docker 使用过程中的一点记录。  
大部分内容来源于此[教程](https://www.runoob.com/docker/docker-tutorial.html)。

<!-- more -->

## 简单介绍

Docker 包括三个基本概念:
- 镜像（Image）：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
- 容器（Container）：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
- 仓库（Repository）：仓库可看成一个代码控制中心，用来保存镜像。

Docker 容器通过 Docker 镜像来创建。
容器与镜像的关系类似于面向对象编程中的对象与类。

## 基础命令

Docker run 可以在容器内运行一个应用程序。
```
$ docker run ubuntu /bin/echo "Hello world"
```
以上命令完整的意思可以解释为：Docker 以 ubuntu15.10 镜像创建一个新容器，然后在容器里执行 bin/echo "Hello world"，然后输出结果。

```
$ docker images   #检查有哪些镜像
$ docker ps –a    #检查有哪些容器
```

```
$ docker run -it ubuntu /bin/bash   #运行交互式容器
$ docker run -itd ubuntu /bin/bash   #后台启动容器
$ exit (ctrl+D) #容器内退出容器
$ docker stop [id/name] #停止容器（在容器外）
$ docker start [id/name] 启用停止的容器
$ docker restart [id/name] #重启容器
$ docker exec -it [id/name] #进入容器
$ docker attach [id/name] #进入容器，退出终端导致容器停止
$ docker rm [id/name] #删除容器
$ docker rmi [id/name] #删除镜像
```

## 创建镜像

### 更新镜像

当我们从 docker 镜像仓库中下载的镜像不能满足我们的需求时，需要对镜像进行更改。
一般有两种方法：
1. 从已经创建的容器中更新镜像，并且提交这个镜像
2. 使用 Dockerfile 指令来创建一个新的镜像

此处我们只考虑更新镜像。

```
$ docker run -it ubuntu /bin/bash  # Open a container
$ /#    # Do modification
$ exit  # exit container

# Create image
$ docker commit -m="has update" -a="user" container_id image_name 
```

### 镜像备份 

```
docker save -o image_name.tar image_name
```
执行后，运行 ls 命令即可看到打成的 tar 包 

### 镜像恢复与迁移 

首先我们先删除掉 image_name 镜像，然后执行以下命令进行恢复。

```
docker load -i image_name.tar
```
执行后再次查看镜像，可以看到镜像已经恢复。