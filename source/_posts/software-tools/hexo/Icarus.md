---
title: Icarus 主题设置
cover: /gallery/covers/icarus.png
date: 2020-11-24 19:46:26
updated:  2021-08-11 22:44:00
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

## 样式更改

### 字体更改

觉得自带 Ubuntu 字体太丑了。
更改字体需要更改两个文件。

这个文件是告诉浏览器使用哪个字体的。
{% codeblock /Users/rui/Documents/Note/node_modules/hexo-theme-icarus/include/style/base.styl lang:yaml %}
// line 9
$family-sans-serif ?= 'Open Sans', 'Noto Serif SC', 'Microsoft YaHei', sans-serif
{% endcodeblock %}

这个文件是告诉浏览器下载哪个字体的。
{% codeblock /Users/rui/Documents/Note/node_modules/hexo-theme-icarus/layout/common/head.jsx lang:yaml %}
// line 54
// 输入需要下载的字体即可
default: fontcdn('Open+Sans:wght@400;600&family=Source+Code+Pro', 'css2'),
{% endcodeblock %}

同时部署时需要把文件拷进去。

参考：
- [github hexo blog web font 적용하기](https://chinsun9.github.io/tags/web-font/)
- [博客相关问题一揽子记录](http://81.70.200.6/2020/12/16/博客相关问题一揽子记录/)