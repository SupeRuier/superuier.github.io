---
title: Hexo文档更新时间设置
date: 2021-06-08 19:02:05
updated: 2021-06-08 20:55:04
category: 
- Utilities
- Hexo
tag: 
- Master Ma
- Hexo
---
<!-- omit in toc -->
Hexo 在使用远程部署时，默认 `update_option: mtime`, 即以最后修改时间作为更新时间。
这个问题导致每次编译时，文章提交到远程，所有的文章都显示更新，且时间相同。
具体解决方法则是在 Front-matter 中加入`updated:`项，则编译过后的更新时间以此为准。
目前看来没有可以使其自动更新的方法。

<!-- more -->
# 批量加入更新时间

这里对之前原有的 post 我们可以按照生成时间 `date` 来批量添加 `updated：`
具体事项过程即在 _post 目录下运行以下代码：
``` bash
for file in `ls .`; do value=`gawk '/date:/{print "updated: "$2" "$3}' ${file}`; echo ${value}; gsed "3 a\\${value}" -i ${file}; done;
```
需要注意的是，awk 和 sed 命令在 MacOS 下使用方法与 Linux 不同，此处应该使用 gawk 和 gsed。

# 手动更新时间

在 `_config.yml` 中设置 `update_option: date`，则更新时间与文章创建时间一致。
虽然这样起不到“更新时间”的作用，但是至少不会无缘无故的对未更新的文件进行更新。
如果出现一些重要的文章修改，手动更新时间添加 `updated:` 即可。