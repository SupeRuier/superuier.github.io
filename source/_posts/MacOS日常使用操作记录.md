---
title: 苹果日常使用操作记录
date: 2020-11-14 15:47:07
category: 
- Utilities
- MacOS
tags:
- MacOS
---

不得不说在多年的MacOS使用过程中还是有很多不方便的地方。
本帖记录一些经常遇到的问题与解决方法。

<!-- more -->

## 外接显示器音频设置

MacOS是不可以通过HDMI/DP控制外接显示器的音量输出的。
但是黑苹果是一定要外接显示器，同时使用显示器自带的扬声器是极为方便的，所以这是一个需要解决的问题。
目前来看有三种解决方案：
- Soundflower配套方案
- Monitor Control插件
- Sound Control插件

其中Monitor Control在我的黑苹果上只可以调节亮度无法调节声音。
Sound Control试用期内可以使用（单独条件app声音），但是试用期过后无法通过调节全局声音来调整显示器输出。
Soundflower方案之前在黑苹果上一直使用，后来重装系统之后出现了蜂鸣现象。
考虑到SF方案体验很不错，于是尝试解决蜂鸣现象。

先简要介绍，SF方案需要下载[Soundflower插件](https://github.com/mattingalls/Soundflower/releases/tag/2.0b2)与相应的客户端[Soundflower Bed](https://github.com/MonitorControl/MonitorControl/releases/tag/v2.1.0)（菜单栏插件）。
简单配置即可使用，此处省略，可以使用全局的音量调节调整显示器音量。

但是使用过程中存在播放一定时间后，出现蜂鸣Humming/Bizz，在之后便无音量输出，由于SF项目已经多年未维护，所以在issue里看大家讨论的结果。
问题出现的直接原因是Buffer size过小，溢出时就会出现此问题。
治标不治本的方法时直接选择最大的Buffer size，但是时间过长时还是会出现此类问题。
从大家的[讨论](https://code.google.com/archive/p/soundflower/issues/24)中得出，问题出现的根本原因是Soundflower可能存在内置时钟与设备时钟不符，才导致缓冲区最终会溢出。
一篇[2014年的帖](http://mac.8miu.com/thread-1096414-1-1.html)子给出了方案.
新建一个"聚合设备"（名称必须用英文），时钟源设置为"Soundflower(2ch)"，实体设备显示器勾上“漂移修正”，然后就可以拿给Soundflower用了。
问题解决。

<div style="width:70%; margin:auto">{% asset_img soundflower.png%}</div>


## 外接2K显示屏开启HiDPI

Macbook外接大部分2K显示器时并不会开启HiDPI，需要手动开启。
开启方法很多帖子写的很详细了，详见[此链接](https://www.smslit.top/2019/01/02/mac_hidpi/)。
印象中是有一些坑，待下次再设置的时候更新。

## Google Software Update 自启动

详见[这篇文章](https://www.imore.com/how-stop-googlesoftwareupdateapp-trying-run-your-mac)。
