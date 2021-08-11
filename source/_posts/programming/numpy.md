---
title: Numpy 相关
cover: /gallery/covers/numpy.png
toc: true
date: 2021-08-11 14:07:55
updated: 2021-08-11 14:07:55
category:
- Programming
tags:
- Python
- numpy
---

一些在使用 Numpy 时需要注意的东西

<!-- more -->

## 随机数生成

为保证实验结果可复现，一般我们使用 `np.random.seed(number)` 来固定随机种子，之后可保证调用随机数生成器产生的结果相同。

但是在项目规模较大，且需要导入其他包时，这种固定随机种子的办法可能会出现一定问题。
原因在于其他的包中，可能同样会设定其他的全局随机种子 `np.random.seed(other_number)`。
导致之后生成的样本不是按照自己设定的随机种子来生成。

> “The preferred best practice for getting reproducible pseudorandom numbers is to instantiate a generator object with a seed and pass it around” — Robert Kern, [NEP19](https://numpy.org/neps/nep-0019-rng-policy.html).

解决方法是定义一个随机数生成器，并将其传送到需要使用随机数的地方。

``` python
import numpy as np
>>> rng = np.random.default_rng(2021)
>>> rng.random(4)
array([0.75694783, 0.94138187, 0.59246304, 0.31884171])
```

Reference:
- [Stop using numpy.random.seed()](https://towardsdatascience.com/stop-using-numpy-random-seed-581a9972805f)
- [NEP 19 — Random Number Generator Policy](https://numpy.org/neps/nep-0019-rng-policy.html)