---
title: 腾讯云相关记录
date: 2021-07-22 14:51:00
updated: 2021-08-05 20:11:00
cover: /gallery/covers/tencent-cloud-hexo.png
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

详见[这篇文档](https://zhuanlan.zhihu.com/p/108720935)

其中涉及到不少对 Nginx 的操作，下面记录一些基础命令。

``` bash
# 首先使用 Nginx 命令的时候需要使用管理员权限。
## 开启服务器
sudo systemctl nginx
## 重新启动更新设置
sudo systemctl restart nginx.service 
```
其中 Nginx 的配置文件位于 `/etc/nginx/nginx.conf`，更改过后重启即可。

## 服务器 SSL 证书安装部署

可以参考腾讯云的[这篇文档](https://cloud.tencent.com/document/product/400/35244)。
主要就是将证书上传再再 Nginx 中设置。
需要注意的是颁发证书对应的域名一定要和真是域名相同，不要少前缀。

## 本地 ssh 连接服务器长时间不操作断开问题

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

然而事实是我这次并没有从 webhook 的方向来部署，而是从 github action 中 ssh 到服务器进行操作。
具体的部署步骤放在服务器的 deploy 文件中。