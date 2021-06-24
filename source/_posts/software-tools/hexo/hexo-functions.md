---
title: Hexo常用功能说明
date: 2020-11-13
cover: /gallery/covers/test.jpg
category: 
- Software Tools
tag: 
- Master Ma
- Hexo

---

本文档会用作Hexo基本用法记录演示。

<!-- more -->

## Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

## Generate static files + Run server

``` bash
$ hexo clean # Clean local files
$ hexo generate # Generate static files
$ hexo server # Build local server
```

More info: [Server](https://hexo.io/docs/server.html)
More info: [Generating](https://hexo.io/docs/generating.html)

## Deploy to remote sites (use Gitbuh Action)

The procedure is in `.github/workflows/deploy.yml`

When this local git folder has been uploaded to github, the `deploy.yml` would be executed.

More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)

## 文章折叠

```
<!-- more -->
```

## 文章间引用

站内文章引用语法如下。

```
{% post_link file_name Title_of_link %}
```

## Insert figures

不同于markdown的图片引用方法，Hexo有着自己的语法。
图片文件夹位于`_post`目录下

```
{% asset_img test.jpg%}
```
{% asset_img test.jpg%}

同时可以自定义图片大小。
语法与html语法相同。

```
<div style="width:70%;margin:auto">{% asset_img test.jpg%}</div>
```
<div style="width:70%;margin:auto">{% asset_img test.jpg%}</div>

markdown的语法需要配置之后才可以使用，具体配置的方法见{% post_link software-tools/hexo/hexo-trials 这篇文章 %}
```
![Test](test.jpg)
```

![Test](test.jpg)

