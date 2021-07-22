---
title: Hexo-Trials
date: 2021-07-22 14:51:00
updated: 2021-07-22 14:51:00
category: 
- Software Tools
tags:
- Hexo
- cloud
---

本文记录在腾讯云服务器上部署 Hexo 搭建的博客时遇到的问题。

<!-- more -->

# 腾讯云相关

## 远程连接

需要在本地使用 ssh 连接云端 root 账户或者普通账户。
首先在腾讯云里 ubuntu 下管理员账户名为 ubuntu 而不是 root。

第一次链接出现管理员账户无法使用密码和密钥连接其普通账户也无法使用密码登录的情况。
这时需要在腾讯云实例的控制台中对 ssh 进行相关设置。
具体来说修改以下文件 `/etc/ssh/sshd_config`。

``` bash
PasswordAuthentication yes # 开启密码登录权限
PubkeyAuthentication yes # 使用密钥登录
```

之后重启服务 `sudo service sshd restart` 即可。
之后使用 ssh 和下载好的密钥进行连接，详见[官方文档](https://cloud.tencent.com/document/product/1207/44643#.E4.BD.BF.E7.94.A8.E5.AF.86.E9.92.A5.E7.99.BB.E5.BD.95)。

## 使用 nginx 部署 Server

详见这篇文档：
- [云服务器搭建网站全过程](https://zhuanlan.zhihu.com/p/108720935)

## ssh 连接服务器长时间不操作断开

具体来说修改以下文件 `~/.ssh/config`。
增添以下内容。

```bash
Host *
        # 断开时重试连接的次数
        ServerAliveCountMax 5
        # 每隔5秒自动发送一个空的请求以保持连接
        ServerAliveInterval 5
```

参考[这篇文章](https://www.pkslow.com/archives/ssh-keep-alive)。

## 使用 webhook 对 repo 的更新进行监控

详见这几篇文档：
- [使用Github的Webhooks+Node完成网站的自动化部署](https://zhuanlan.zhihu.com/p/116136090)
- [使用 GitHub Webhook 实现静态网站自动化部署](https://jimmysong.io/blog/github-webhook-website-auto-deploy/)
- [使用Github的webhooks进行网站自动化部署](https://jelly.jd.com/article/6006b1025b6c6a01506c878a)