---
title: Linux 常用命令
date: 2020-12-14 14:56:03
categories:
- Programming
tags: Linux
---

常用到的 linux 命令语句

<!-- more -->

## 进程相关

使用 `ps` 使得命令查询任务。

```bash
# user's running processes
ps r -ef | grep username
```

终止进程

```bash
kill PID
```

高级终止

```bash
# 将用户colin115下的所有进程名以av_开头的进程终止:
ps -u colin115 |  awk '/av_/ {print "kill -9 " $1}' | sh
# 将用户colin115下所有进程名中包含HOST的进程终止
ps -fe| grep colin115 | grep HOST |awk '{print $2}' | xargs kill -9;
```

后台进程
```bash
# 置于后台
ctrl+Z
# 重新拉到前台
fg
# 查询后台进程
jobs
# 删除进程，使用 job 查询到的任务号
kill %1 
```

### 后台运行

使用 `nohup` 使得命令后台运行，同时断网和关闭终端都不会终止任务，适合用来作为任务提交方式。

```bash
nohup /root/start.sh &
```

此外，python 中自带的 `subprocess.popen()` 方法同样可以起到后台运行命令且关闭终端不退出的作用，所以不必要使用 `nohup`。

## 文件处理

### 解压缩

```bash
# 对于 zip 文件
unzip compressed.zip
# 对于 tar.gz 文件
tar -xvzf compressed.tar.gz
```