---
title: Hexo-Trials
date: 2020-11-13 00:00:33
tags:
---

本文记录使用Hexo中遇到的很多坑，以后可能会重复遇到，记录在此，以观后效。

<!-- more -->

## 功能&支持

### Markdown image insertion grammar support

具体配置的方法

```
_config.yml

post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true
```

## 运行&测试坑

### Local server

存在local server无法打开或打开极慢，但是GitHub Action正常部署的情况。
此时使用全局代理可解决。
经查原因为在编译HTML时，难以获取all.css文件，fontawesome.com需要代理访问。
将该网站加入代理规则即可解决。