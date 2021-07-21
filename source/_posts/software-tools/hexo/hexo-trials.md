---
title: Hexo-Trials
date: 2020-11-13 00:00:33
updated: 2021-07-21 21:13:00
category: 
- Software Tools
tags:
- Hexo
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

## 写作排版坑

### 公式支持

使用 `\\` 时不换行，原因是hexo使用的markdown引擎造成的。
其将第一个 `\` 识别为转义符号。
解决方法是换一个引擎，如下：

```
npm uninstall --save hexo-renderer-marked
npm install --save hexo-renderer-kramed
```

参考：
- https://jdhao.github.io/2017/10/06/hexo-markdown-latex-equation/
- https://lanlan2017.github.io/blog/eb86e892/

### 行内公式无法编译

换用 kramed 作为 markdown 的渲染引擎之后，行内公式有时无法渲染。
一般情况下是因为其对 $\ast$ 和 $_$ 的支持有些不同。
在行内公式时优先会考虑 markdown 语法（这两个符号会优先认为是在定义*斜体*），其次才是公式支持，所以这种情况下无法编译。

解决方法是对文件 `/node_modules/kramed/lib/rules/inline.js` 进行修改。
```js
//  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
em: /^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
```

这样可以解决下划线的问题。同时 markdown 中星号使用 `\ast` 代替。

此外在部署的时候同时记得将远程的文件替换或修改即可。


参考：
- https://suixinblog.cn/2018/10/hexo-latex.html