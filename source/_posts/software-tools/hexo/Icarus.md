---
title: Icarus 主题设置
cover: /gallery/covers/icarus.png
date: 2020-11-24 19:46:26
updated: 2022-03-22 20:55:00
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

### 主题定制

之后是一定会对主题进行定制的，但是近期没有时间，而且欠缺一些前端方面的知识。
这里记录一些见过的对 lcarus 定制的连接，用于学习和获得灵感。

List：
- [hexo及icarus主题个性定制](https://angericky.github.io/2018/12/24/icarus个性定制/)：文章显示较为好看，而且加了不少插件。
- [hexo icarus 테마 프로필영역 css 수정](https://chinsun9.github.io/tags/hexo/)：这个是加了一个新主题。
- [Icarus 主题自定义](https://www.alphalxy.com/2019/03/customize-icarus)：一些细节改动
- [Hexo博客icarus主题定制](https://blog.it-follower.com/posts/2085550418.html)

## 功能开启或添加

### 加入博客评论区

有很多插件可供选择，这里我们使用了 Gitalk，本质上是在 Github 上面新开一个 Repo，然后在 issue 区记录评论，然后通过 OAuth App 读写并显示到博客中。
具体的设置可以参见 Icarus 的[用户评论插件](https://ppoffice.github.io/hexo-theme-icarus/Plugins/Comment/icarus用户指南-用户评论插件/)。

插件设置好之后可能会出现一些问题：
- gitalk授权登录后报错403：一般来说是版本或 Proxy 的问题，需要升级版本或者更换 proxy，我选择了后者。参考 Gitalk 的 [issue](https://github.com/gitalk/gitalk/issues/433) 和[这篇博客](https://umm.js.org/p/1d1d49e9/)。
- [文章批量初始化](https://eminoda.github.io/2021/06/16/hexo-gitalk-comment-plugins-in-github-issue/)：我由于文章数较少，是一个一个手动初始化的，日后可能会需要用上批量初始化。

之后准备转用 Giscus。

