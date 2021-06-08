---
title: Hexo文档更新时间设置
date: 2021-06-08 19:02:05
updated: 2021-06-08 19:02:05
category: 
- Utilities
- Hexo
tag: 
- Master Ma
- Hexo
---
<!-- omit in toc -->
Hexo 的文档存在以编译时间作为更新时间的问题。
这个问题导致每次编译时，所有的文章都显示更新，其时间相同。
具体解决方法则是在状态栏加入`updated:`项，则编译过后的更新时间以此为准。
具体有无可以使其自动更新的方法目前还没有关注。

<!-- more -->

# 批量加入更新时间

这里对之前原有的 post 我们可以按照生成时间 `date` 来批量添加 `updated。`
具体事项过程即在 _post 目录下运行以下代码：
``` bash
for file in `ls .`; do value=`gawk '/date:/{print "updated: "$2" "$3}' ${file}`; echo ${value}; gsed "3 a\\${value}" -i ${file}; done;
```
需要注意的是，awk 和 sed 命令在 MacOS 下使用方法与 Linux 不同，此处应该使用 gawk 和 gsed。