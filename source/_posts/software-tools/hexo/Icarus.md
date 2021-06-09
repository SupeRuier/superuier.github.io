---
title: Icarus 主题设置
date: 2020-11-24 19:46:26
category: 
- Software Tools
tags: 
- Icarus
- Hexo
---

本文内容都与当前使用的主题 Icarus 相关。

具体的主题设置可以见此[链接](https://blog.zhangruipeng.me/hexo-theme-icarus/Configuration/icarus用户指南-主题配置/#more)，对应的 markdown 源代码可以见此[链接](https://raw.githubusercontent.com/ppoffice/hexo-theme-icarus/site/source/_posts/zh-CN/Configuring-Theme.md)。

<!-- more -->

## 布局设施

### 侧边栏

设置`sidebar`中某个侧边栏的`sticky`为`true`来让它的位置固定而不跟随页面滚动。

{% codeblock _config.icarus.yml lang:yaml %}
sidebar:
    left:
        sticky: false
    right:
        sticky: true
{% endcodeblock %}