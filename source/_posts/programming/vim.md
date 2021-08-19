---
title: Vim 常用功能记录
cover: /gallery/covers/vim.png
toc: true
date: 2021-08-18 15:05:14
updated: 2021-08-18 15:05:14
category:
- Programming
tags:
- Linux
- Vim
---

<!-- omit in toc -->
Vim 是一款文本编辑器。
说来惭愧，自己在日常使用中并不熟练，于是此处记录一些有需求的功能，便于查阅。

<!-- more -->

## 四种模式

- 正常模式：`<ESC>` 
- 命令模式：`:` or `/`
- 插入模式：`i` or `a` or `o`（new line）
- 可视模式：`v, V, <Ctrl>+v`

## 正常模式下常用命令

基本：
- 保存退出：`:wq` or `ZZ`
- 不保存退出：`:q!` or `:qa!`
- 光标位置和文件信息：`<Ctrl>+g`
- 显示及取消显示行号：`:set nu` and `:set nonu`
- 定位到 n 行：`:n`
- 翻页：`ctrl+f`（下一页） `ctrl+b`（上一页）

搜索：
- 搜索：`/+<content>`
- 继续搜索：`n`（向下） or `N`（向上）
- 跳转至从哪里来：`<Ctrl>+o`（向后） or `<Ctrl>+i`（向前）
- 对应符号的跳转（例如括号）：`%`

## 正常模式下编辑

插入或更改：
- 插入模式：`i` or `a` or `o`（新一行）
- 替换字符：`r+<char>` or `R+<char>`（多个字符）

删除：
- 删除当前字符：`x`
- 删除当前单词：`dw`
- 删除2个单词：`d2w`
- 删除当前行：`dd`
- 删除2行：`2dd` 
- 删除到当前行尾：`d$`

撤销删除
- 撤销：`u`（单次） or `U`（整行）
- 整行重做：`<Ctrl>+R`

复制粘贴：
- 复制：`y`（在可视模式下选中）
- 粘贴内容：`p`（）

替换文本：
- To substitute new for the first old in a line type    `:s/old/new`
- To substitute new for all 'old's on a line type       `:s/old/new/g`
- To substitute phrases between two line #'s type       `:#,#s/old/new/g`
- To substitute all occurrences in the file type        `:%s/old/new/g`
- To ask for confirmation each time add 'c'             `:%s/old/new/gc`

## 移动光标

行内移动光标：
- 向前移动两个单词至词首：`2w`
- 向前移动两个单词至词尾：`2e`
- 移动到行首：`0`
- 移动到行尾：`$`

跨行移动图标（显示什么内容）：
- 光标定位到第 n 行的行首 `nG`
- 光标定位到第一行的行首 `gg`
- 光标定位到最后一行的行首 `G`
- 光标定位到当前屏幕的第一行行首 `H`
- 光标移动到当前屏幕的中间 `M`
- 光标移动到当前屏幕的尾部 `L`
- 把当前行移动到当前屏幕的最上方，也就是第一行 `zt`
- 把当前行移动到当前屏幕的中间 `zz`
- 把当前行移动到当前屏幕的尾部 `zb`

## 其他功能

大小写转换
- 将光标下的字母改变大小写 `~`
- 将光标位置开始的3个字母改变其大小写 `3~`
- 改变当前行字母的大小写 `g~~`
- 将当前行的字母改成大写 `gUU`
- 将当前行的字母全改成小写 `guu`
- 将从光标开始到下面3行字母改成大写 `3gUU`
- 将光标下的单词改成大写。 `gUw`
- 将光标下的单词改成小写 `guw`

