---
title: Pytorch 踩坑
date: 2020-12-09 14:55:50
updated: 2020-12-09 14:55:50
categories:
- Programming
tags: Pytorch
---

使用 Pytorch 时学到的一些知识

<!-- more -->

# 1. 用法

## 1.1. 随机种子

> 在导入文件之前，先导入与随机种子相关的包，这样导入的文件随机数也被确定。

在文件的开头添加以下代码：

```python
def seed_torch(seed=1029):
	random.seed(seed)
	os.environ['PYTHONHASHSEED'] = str(seed) # 为了禁止hash随机化，使得实验可复现
	np.random.seed(seed)
	torch.manual_seed(seed)
	torch.cuda.manual_seed(seed)
	torch.cuda.manual_seed_all(seed) # if you are using multi-GPU.
	torch.backends.cudnn.benchmark = False
	torch.backends.cudnn.deterministic = True

seed_torch()
```

## 1.2. zero_grad optimizer or net？

> `model.zero_grad()` and `optimizer.zero_grad()` are the same IF all your model parameters are in that optimizer. 
It is safer to call `model.zero_grad()` to make sure all grads are zero. 
e.g. if you have two or more optimizers for one model.

## 1.3. 初始化网络

网络参数初始化会对模型表现产生影响，一般通过一些随机的方式初始化参数。具体的影响可以见[这篇博文](https://zhuanlan.zhihu.com/p/25110150)。
具体如何实现网络权重初始化，可以通过对模型每一层遍历赋值实现，参见如下代码。

```python
params = list(net.parameters())
torch.nn.init.xavier_uniform(layer) for layer in params
```

## 1.4. nn.module 中 `__call__` vs `forward`

> call 方法中调用了 forward 函数，区别主要在于如果使用 forward 函数来进行前向传播，则无法使用 pytorch 提供的 hook 功能。

## 1.5. NLLLoss & CrossEntropyLoss

从文档中：

> This CrossEntropyLoss criterion combines nn.LogSoftmax() and nn.NLLLoss() in one single class.

可以简单理解为：

> Softmax + CrossEntropyLoss == LogSoftmax + NLLLoss

那我们为什么要用 LogSoftmax 呢？

> 因为在实现上，算log值更加便捷，如果直接计算指数值，可能会出现极大或者极其接近0的情况。
所以使用 LogSoftmax 的话数值稳定性可能会更好。
参考[此链接](https://www.zhihu.com/question/358069078/answer/912691444)。

## 1.6. tensor 非 contiguous 导致无法使用 view()

当使用 tensor 操作时，新建了一份 tensor 元信息，并重新制定 stride，导致其不连续，无法使用 view()。

最简单的解决方法是使用`tensor.contiguous()`, 此时会重新开辟一块内存储存底层数据。

若不介意底层数据是否使用了新的内存，用`reshape()`则更方便。

[这篇文章](https://zhuanlan.zhihu.com/p/64551412)提供了一个非常完善的解释。

## 1.7. pytorch 中 hook 的使用

Pytorch 中的 hook 为我们提供了一个较为方便的方式来访问网络某一层的输入与输出（前向的话返回 feature，反向的话返回梯度。）

具体的使用方法，首先要在相应的层上打开前向或者反向的 hook：

```python
# forward
# 定义 forward hook function
def hook_fn_forward(module, input, output):
    print(module) # 用于区分模块
    print('input', input) # 首先打印出来
    print('output', output)
    total_feat_out.append(output) # 然后分别存入全局 list 中
    total_feat_in.append(input)

# Add hook on the layer you want
modules = model.named_children() # 
for name, module in modules:
    module.register_forward_hook(hook_fn_forward)

###############################################
# backward
def hook_fn_backward(module, grad_input, grad_output):
    print(module) # 为了区分模块
    # 为了符合反向传播的顺序，我们先打印 grad_output
    print('grad_output', grad_output) 
    # 再打印 grad_input
    print('grad_input', grad_input)
    # 保存到全局变量
    total_grad_in.append(grad_input)
    total_grad_out.append(grad_output)

modules = model.named_children()
for name, module in modules:
    module.register_backward_hook(hook_fn_backward)
```

注意 register 函数接受的是一个函数，会为传入的函数传递三个参数 module， grad_input， grad_output。
这里的 input 和 output 都是以前向网络的方向来进行标记的。

反向传播中对于线性模块：o=W*x+b ，它的输入端包括了W、x 和 b 三部分，因此 grad_input 就是一个包含三个元素的 tuple。
而在 forward hook 中，input 是 x，而不包括 W 和 b。

详见这篇非常好的[讲解](https://zhuanlan.zhihu.com/p/75054200)。

## 1.8. 查看某一层梯度

hook 是一种提取梯度的方法，同样的，还有其他方法可以提取梯度。

```python
# 一个全链接层举例
list(model.modules())[5].weight.grad
```

## 1.9. 计算某一层梯度

其实如果使用 `loss.backward()` 然后再利用 hook来提取梯度会有一些耗费时间，因为反向传播是要从尾到头的，如果你只需要倒数几层的梯度的话，其实可以直接计算。

`torch.autograd.grad` 方法提供了一个计算梯度的方式，可以看以下例子，此方法返回的对象是一个元祖。

```python
# 计算梯度
# 如果需要多次计算的话记得保留计算图
grad= torch.autograd.grad(outputs=loss, inputs=W, retain_graph=True, only_inputs=True)[0]
```

## 1.10. 计算梯度的时间

在我的实验终有一个计算每一样本对梯度贡献的需求，有两种方法计算：
- 将 `batch_size` 设为1，然后使用 `torch.autograd.grad` 计算梯度。
- 用非1的 `batch_size`，计算 loss 时，不 reduce，这样得出来的 loss 是一个向量。遍历这个向量，对向量中每一个tensor使用 `torch.autograd.grad` 计算梯度。

但是发现一个问题。
在 batch 下，平均每个样本的前向时间是要远小于不使用 batch。
但是平均每个样本的后向时间是要远大于不使用 batch。
（这里远小远大是指数量级）。

推测原因为如果遍历向量的话的话，获得的 tensor 中 `grad_fn` 是 UnbindBackward 而不是 nlllossbackward。
所以尝试在计算 loss 之前就对样本进行遍历，但是其实时间上和遍历 loss 是一样的。
因为是用 loss 计算梯度是要使用之前的计算图，遍历网络输出会使遍历的每一个输出的 `grad_fn` 变化。
用这种方式虽然看起来 loss 的 `grad_fn` 还是 nlllossbackward，但是在梯度的计算过程中还是会遇到 UnbindBackward。

所以这个问题没有想到具体的解决方法，就选取了耗费时间相对较短的方法。


# 2. 设置
## 2.1. Dataloader 中的 num_workers 造成训练循环缓慢

在本地跑实验，一个简单的网络的训练，发现 Dataloader 中 num_workers 设置的数目越大，在 batch 中训练越耗时，表示莫名其妙。在我的情形下将其设为8要比将其设为0慢了百倍以上。
仔细看了一下 mini-batch 的训练过程并且记录了一下时间，发现主要的时间开销发生于 for 循环遍历 loader 之后退出循环时。
所还还是将其设为了0。

造成这个的主要原因可能是 IO 耗时和模型前/后传耗时之间的 GAP 太大，导致进程间造成了阻塞，详见[这篇文章](https://bbs.cvmart.net/topics/2066)。

# 3. 报错

## 3.1. RuntimeError: CUDA error: device-side assert triggered

参考[此篇文章](https://cloud.tencent.com/developer/article/1686771)。

一般来说这个错误出现的原因是数据中的类标记label和网络中的类标记label不匹配。包括但不限于以下几种问题。

| pytorch识别的类别 | 数据中的类别 |
| ----------------- | ------------ |
| [0,1,2,3]         | [1,2,3,4]    |
| [0,1]             | [0,1,2,3]    |

解决方法只要找到矛盾发生的地方，对数据中类别的标签进行改动即可。当然有的时候也可能是网络格式写错。

## 3.2. RuntimeError: CUDA out of memory

起因在于丢了49000张 mnist 数据进去没有分 batch，本来以为数据的大小只占了450m内存应该不会有问题，但是发现跑了一个前向就加了七八个g的显存，甚至一个模型直接把24g的显卡显存跑炸了。

分析原因应该是因为 batch size 较大的时候，前向输入模型，在某一层计算时申请了很大的 tensor 导致消耗了成倍与数据大小的显存。
这个在小 batch 的情况下应该并不会有太大影响，所以说还是需要使用 batch。

当然还是可以在需要的时候释放缓存，治标不治本。
```python
torch.cuda.empty_cache() 
```

[这篇文章](https://blog.csdn.net/weixin_38278334/article/details/105575403)简要介绍了 pytorch 的缓存机制。
