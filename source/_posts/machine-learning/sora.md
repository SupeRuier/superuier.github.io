---
title: Sora 技术报告，阅读与思考
index_img: /gallery/covers/sora.jpg
banner_img: /gallery/covers/sora.jpg
toc: true
date: 2024-02-16 17:00:00
updated: 2024-02-16 17:00:00
category:
- Machine Learning
tags:
- neural-network
- machine-learning
- diffusion
- video
- generative-model
- OpenAI

math: true

---
<!-- omit in toc -->

今日震撼于 OpenAI 视频生成模型 Sora 的产出效果，在此对技术报告进行阅读学习。
在文末我也会加入一些自己的看法。

<!-- more -->

## Sora 生成效果

被生成的效果所震撼，尤其是视频 3 中列车通过阴影时车窗反射出的倒影。

<video width="80%" height="80%"  src="https://cdn.openai.com/tmp/s/title_0.mp4"  autoplay controls loop></video>
<video width="80%" height="80%"  src="https://cdn.openai.com/sora/videos/closeup-of-womans-eye.mp4"  autoplay controls loop></video>
<video width="80%" height="80%"  src="https://cdn.openai.com/sora/videos/train-window.mp4"  autoplay controls loop></video>

## 技术报告内容

> This technical report focuses on (1) our method for turning visual data of all types into a unified representation that enables large-scale training of generative models, and (2) qualitative evaluation of Sora’s capabilities and limitations. Model and implementation details are not included in this report.

首先指出报告主要由两部分组成，第一部分是将各种类型的视觉数据转换为统一的表示，以便大规模训练生成模型。第二部分是对 Sora 的能力和局限性进行定性评估。模型和实现细节不包括在此报告中。

>  Sora is a generalist model of visual data—it can generate videos and images spanning diverse durations, aspect ratios and resolutions, up to a full minute of high definition video.

首先指出先前模型的缺点，引出了 Sora，它可以生成各种长度、分辨率、比例的视频。
主要有以下几个关键步骤。

### 1. Turning visual data into patches

同样是使用大模型，在互联网级别的数据上进行训练。
受到语言模型对于 token 操作的启发，Sora 将视觉数据转换为补丁（patches）。

<div style="width:100%;margin:auto">{% asset_img figure-patches.png%}</div>

宏观来看，先将视频压缩到低维空间，然后再将其解码到时空补丁（spacetime patches）。

### 2. Video compression network

训练一个 1 中提到的将原始视频降维的神经网络。

> This network takes raw video as input and outputs a latent representation that is compressed both temporally and spatially. 

其中时间和空间信息同被压缩。

> Sora is trained on and subsequently generates videos within this compressed latent space. 

Sora 之后的生成过程都在这个压缩的潜在空间中进行。

> We also train a corresponding decoder model that maps generated latents back to pixel space.

同样的，训练一个解码器，将潜在空间的数据映射回像素空间。

### 3. Spacetime Latent Patches

> Given a compressed input video, we extract a sequence of spacetime patches which act as transformer tokens. This scheme works for images too since images are just videos with a single frame. 

这些 patches 在训练时被当作 transformer 的 token 进行处理。
视频和图像有着相同的处理方式。

> Our patch-based representation enables Sora to train on videos and images of variable resolutions, durations and aspect ratios. 

这种表示方式使得 Sora 可以在不同分辨率、持续时间和宽高比的视频和图像上进行训练。

> At inference time, we can control the size of generated videos by arranging randomly-initialized patches in an appropriately-sized grid.

在推理时，可以通过将随机初始化的补丁排列在适当大小的网格中来控制生成的视频的大小。

### 4. Scaling transformers for video generation

> Sora is a diffusion model; given input noisy patches (and conditioning information like text prompts), it’s trained to predict the original “clean” patches. 
> Importantly, Sora is a **diffusion transformer**.

Sola 是一个 **diffusion transformer**，它通过输入噪声补丁（和文本提示等条件信息），训练来预测原始的“干净”补丁。

<div style="width:100%;margin:auto">{% asset_img figure-diffusion.png%}</div>

> In this work, we find that diffusion transformers scale effectively as video models as well. Below, we show a comparison of video samples with fixed seeds and inputs as training progresses. Sample quality improves markedly as training compute increases.

在这项工作中，我们发现 diffusion transformer 在视频模型中也能有效扩展。随着训练计算量的增加，样本质量显著提高。

### 5. Variable durations, resolutions, aspect ratios

> Past approaches to image and video generation typically resize, crop or trim videos to a standard size – e.g., 4 second videos at 256x256 resolution. We find that instead training on data at its native size provides several benefits.

之前的方法都会将视频调整到标准大小，例如 4 秒的视频，分辨率为 256x256。
但我们发现，训练原始大小的数据提供了几个好处。

1. 采样的灵活性：从 1920*1080 到 1080*1920 中的任意尺寸。
2. 构图上的提升：不容易出现主体仅部分存在于画面的情况。

### 6. Language understanding

> Training text-to-video generation systems requires a large amount of videos with corresponding text captions. We apply the re-captioning technique introduced in DALL·E 330 to videos. 

将 DALL·E 330 中的重新标注技术应用到视频中。

> We first train a highly descriptive captioner model and then use it to produce text captions for all videos in our training set. 

先训练一个描述模型对所有视频进行描述。

> We find that training on highly descriptive video captions improves text fidelity as well as the overall quality of videos.
> Similar to DALL·E 3, we also leverage GPT to turn short user prompts into longer detailed captions that are sent to the video model. 

同样使用 GPT 将短提示转换为详细的描述。

### 7. Prompting with images and videos

> Sora can also be prompted with other inputs, such as pre-existing images or video. 
> This capability enables Sora to perform a wide range of image and video editing tasks—creating perfectly looping video, animating static images, extending videos forwards or backwards in time, etc.

同样可以使用照片以及视频作为提示，这使得 Sora 可以执行各种图像和视频编辑任务。

### 8. Image generation capabilities

> The model can generate images of variable sizes—up to 2048x2048 resolution.

模型可以生成不同尺寸的图像，最高分辨率为 2048x2048。

### 9. Emerging simulation capabilities

> We find that video models exhibit a number of interesting emergent capabilities when trained at scale. These capabilities enable Sora to simulate some aspects of people, animals and environments from the physical world.

我们发现，当大规模训练视频模型时，会出现一些有趣的新能力。这些能力使得 Sora 可以模拟一些来自物理世界的人、动物和环境的一些方面。

1. 3D consistency：在摄像机移动时，模型能够保持物体的一致性。
2. Long-range coherence and object permanence：即使物体被遮挡或者离开了屏幕，模型也能够保留它的存在。
3. Interacting with the world：视频中具体的交互行为会留下痕迹，比如画痕和咬痕。
4. Simulating digital worlds：比如我的世界中的玩家行为视频。

## 个人感想

总的来说，在语言模型之外，再一次证明了堆数据量的可靠性。
那么在大规模数据下，工程上如何设计任务便成了重中之重。
从当下表现的角度，同时考虑到未来一段时间可能的飞速进展，我有着以下几个问题，以及一些自己的看法。

### 从大量的训练视频中到底学到了什么信息？

首先不必多言的就是 low-level 的表征信息，即“如何读视频”。
在海量的数据输入下，类似于 LLM，Sora 已经可以学到视频的统计信息。

但更重要的，我认为是 high-level 的信息，即“视频中那些不言而喻的正确事实”。
浅层一些就是“石头是硬的”，“玻璃是脆的”，“河是流动的”，“船是浮着的”。
深层一些就是，在视觉下，所有的宏观物理定律都投影在了二维平面上。
这也是为什么在生成的视频中，基本上都满足物理规律以及几何原理。
个人觉得如果将这个手段用于科学模拟以及发现会比较有意思。

### 于 2D 相比我们是否需要 3D？

这就引出了第二个问题，作为人而言，我们接触的世界是三维的，但是我们的视觉输入是二维的。
初看 Sora 的时候，我还以为他会进行一些三维的推断，但是实际上并没有。
这也许是因为 2D 的信息已经足够了，或者说 2D 的信息已经包含了 3D 的信息。
这个也和特斯拉的纯视觉方案有些类似，其并未使用激光雷达三维点云。
所以我们还需要 3D 吗？

这个问题或许可以拆成：
1. 在哪里我们一定需要 3D 以及为什么？（如果我们绝大多数的输入是以 2D 呈现的话）
2. 如果有一定需要 3D 的场景，2D 训练数据生成的方式是否可以？（目前已经产生了良好的透视关系）

### 相比于图像，视频有着什么优势？应用场景在哪里？

图像就是单帧的视频。
个人作为摄影爱好者一直在思考这个问题，目前仍没有明确的答案。
或许之后可以新开一篇文章，可能会形而上一些。

但是从 Sora 的角度来看，它似乎第一次证明了视频的生成质量。
可以用于之前大部分使用图像进行宣传的地方，比如广告、电商、游戏等。
其还可以用于影视行业起到一些降本增效的辅助作用，比如特效、动画等。
那么之外呢？如果说视频的生产成本降低了，那是不是视频会越来越多呢？
换句话说是否会有更广阔的视频呈现空间（而不是其他空间）来冲刷大家的有限的空闲时间呢？

# Reference
- [Video generation models as world simulators](https://openai.com/research/video-generation-models-as-world-simulators)