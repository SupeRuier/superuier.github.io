---
title: Hello World 6
---
Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

本文档会用作Hexo基本用法记录演示。

## Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)

### Insert figures

不同于markdown的图片引用方法，Hexo有着自己的语法。
图片文件夹位于`_post`目录下

```
{% asset_img IMG_5264.PNG%}
```
{% asset_img IMG_5264.PNG%}

同时可以自定义图片大小。

```
<div style="width:70%;margin:auto">{% asset_img IMG_5264.PNG%}</div>
```
<div style="width:70%;margin:auto">{% asset_img IMG_5264.PNG%}</div>

markdone的语法需要配置之后才可以使用，具体配置的方法见{% post_link Hexo-Trials 这篇文章 %}
```
![Test](IMG_5264.PNG)
```

![Test](IMG_5264.PNG)

### 文章间引用

站内文章引用语法如下。

```
{% post_link file_name Title_of_link %}
```
