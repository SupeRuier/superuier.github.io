---
title: 远程服务器配置
index_img: /gallery/covers/server.jpg
banner_img: /gallery/covers/server.jpg
date: 2023-08-09 20:00:00
updated: 2023-11-11 20:00:00
categories:
- Programming
tags: 
- linux
- server
- proxy
---

远程服务器配置相关内容。

<!-- more -->

## 服务器代理设置

由于有时需要在服务器上下载被墙的数据，所以需要设置代理。
通常只会在 Python 场景下使用，可以使用 `os` 模块设置代理。

```python
# Proxy on server.
import os

# 设置代理
os.environ['http_proxy'] = "http://127.0.0.1:7890"
os.environ['https_proxy'] = "http://127.0.0.1:7890"

# 测试代理
result = os.system('curl -v google.com')
print(result)  
```

但是服务器端配置代理比较麻烦，多次尝试 clash 都不能保证稳定运行。
幸好不会重度使用代理，所以可以使用简单的方法，将本地的代理转发到服务器上。
仅需要将 `127.0.0.1` 替换为本地的 IP 地址即可。
（当然前提需要在服务器上可以 ping 通本地 IP）