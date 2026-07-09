---
title: "L10 - 生成对抗网络与艺术风格迁移"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "computer-vision", "generative-models", "gans", "style-transfer"]
summary: "学习生成对抗网络（GAN）的生成器-判别器对抗训练原理，以及基于卷积神经网络特征的艺术风格迁移方法。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/4-ComputerVision/10-GANs/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L10 Gans And Style Transfer"
  - "L10 GANs and Style Transfer"
  - L10_GANs_and_Style_Transfer
sources: []

---
# L10 - 生成对抗网络与艺术风格迁移

> **一句话理解**：用两个神经网络互相“博弈”，让一个网络学会生成足以骗过另一个网络的逼真图像；同时，也可以把一张图片的内容用另一张图片的风格重新绘制出来。

---

## 本课概览

上一课介绍了**变分自编码器（Variational Autoencoder, VAE）**这类生成模型，它能够学习训练数据的潜在分布并生成新样本。但当目标变成生成高分辨率、细节丰富的图像（例如一幅画作）时，VAE 往往收敛困难、画面模糊。本课引入另一类更强大的生成架构——**生成对抗网络（Generative Adversarial Networks, GAN）**。

本课同时介绍一种与 GAN 相关的创意应用：**艺术风格迁移（Style Transfer）**。它不是训练一个生成模型，而是直接优化一张图像，使其在内容上接近原图、在风格上接近参考艺术作品。

学习目标：

- 理解 GAN 中生成器（Generator）与判别器（Discriminator）的分工与对抗关系。
- 掌握 GAN 的训练流程、损失函数与常见的训练难点。
- 了解 DCGAN、渐进式增长（Progressive Growing）等关键改进思路。
- 理解风格迁移中的内容损失、风格损失与总变差损失的组合逻辑。
- 能够运行官方提供的 PyTorch / TensorFlow Notebook，并用自己数据尝试生成与风格化。

---

## 核心概念

### 1. 生成对抗网络（GAN）

GAN 由两个神经网络组成，彼此“对抗”训练：

- **生成器（Generator）**：接收一个随机**潜在向量（latent vector / noise vector）**，输出一张假图像。可以把它理解为“造假者”。
- **判别器（Discriminator）**：接收一张图像，输出它是真实训练样本（标签 1）还是生成器生成样本（标签 0）。可以把它理解为“鉴定师”。

两个网络在训练过程中相互促进：生成器不断改进以骗过判别器，判别器也不断改进以识别出生成器的新伎俩。理想情况下，二者能力同步提升，最终生成器可以输出接近真实分布的样本。

![GAN 架构示意](https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/4-ComputerVision/10-GANs/images/gan_architecture.png)

> 图：GAN 的基本结构。图片来自 Dmitry Soshnikov。

### 2. 深度卷积 GAN（DCGAN）

当生成器和判别器都使用卷积神经网络（Convolutional Neural Network, CNN）时，这种 GAN 被称为 **DCGAN（Deep Convolutional GAN）**。判别器使用普通“卷积 + 池化（Pooling）”逐层下采样；生成器则相反，使用**转置卷积（transposed convolution，也称反卷积 / deconvolution）**或上采样层逐步将低维潜在向量扩展为完整图像，结构类似自编码器的解码器。

![GAN 详细结构](https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/4-ComputerVision/10-GANs/images/gan_arch_detail.png)

> 图：DCGAN 中生成器与判别器的层次对应关系。图片来自 Dmitry Soshnikov。

### 3. 对抗训练目标

GAN 的训练可以看作一个极小极大博弈（min-max game）：

- 判别器希望最大化正确区分真图与假图的能力。
- 生成器希望最小化“被判别器识破”的概率。

形式上，优化目标可写为：

$$
\min_G \max_D V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]
$$

其中 $x$ 来自真实数据分布，$z$ 为随机噪声。实际训练时，生成器和判别器通常分别用各自的损失函数交替更新。

### 4. 艺术风格迁移

风格迁移把一张**内容图像（content image）**和一张**风格图像（style image）**作为输入，生成一张“内容来自前者、风格来自后者”的新图像。核心思想基于预训练 CNN（如 VGG）提取的多层特征：

- **内容损失（Content Loss）**：比较生成图像与内容图像在 CNN 中间层的特征图差异。
- **风格损失（Style Loss）**：使用**格拉姆矩阵（Gram Matrix）**度量生成图像与风格图像在特征通道之间的相关性，从而捕捉纹理、笔触、色彩分布。
- **总变差损失（Total Variation Loss）**：约束相邻像素差异，使生成图像更平滑、减少噪点。

最终通过梯度下降直接优化生成图像像素，使其加权总损失最小。

---

## 关键知识点

- GAN 与 VAE 的侧重点不同：VAE 显式建模概率分布并通过重参数化采样；GAN 通过对抗方式隐式学习分布，通常能生成更清晰、更锐利的图像。
- 训练 GAN 是“双人博弈”，损失函数不再单调下降；理想状态下生成器损失与判别器损失应呈现震荡而非持续下降。
- 判别器训练步骤：用真图标签 1、生成图标签 0 训练二分类器。
- 生成器训练步骤：将生成器 + 判别器拼接，固定判别器参数，以“骗过判别器”为目标（期望输出标签 1）反向传播更新生成器。
- **模式坍塌（Mode Collapse）**：生成器只学会生成少数几种能骗过判别器的样本，导致多样性不足。
- **超参数敏感**：学习率、批大小、网络容量、训练比例稍有不同就可能不收敛。
- **生成器与判别器能力失衡**：若判别器太强、损失过快降到 0，生成器梯度会消失，无法继续学习。常用技巧包括：为两者设置不同学习率、当判别器损失过低时跳过本轮判别器训练。
- 高分辨率生成困难：深层上采样容易引入棋盘状伪影。**渐进式增长**先训练低分辨率层，再逐步加入更高分辨率层；**多尺度梯度 GAN（Multi-Scale Gradient GAN）**则通过多分辨率跳跃连接缓解该问题。
- 风格迁移不是训练网络权重，而是把生成图像本身当作可优化变量，通过 CNN 特征层面的损失进行像素级优化。

---

## 代码/实验说明

本课提供 3 份官方 Jupyter Notebook，均位于 [lessons/4-ComputerVision/10-GANs](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/10-GANs) 目录下。

### 1. GAN Notebook（TensorFlow / Keras）

- 文件：`GANTF.ipynb`
- 在线入口：[GANTF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/10-GANs/GANTF.ipynb)
- 内容概述：使用 Keras 搭建生成器与判别器，在 MNIST 或类似图像数据集上训练，展示生成的手写数字或简单图像如何随训练迭代逐步改善。

### 2. GAN Notebook（PyTorch）

- 文件：`GANPyTorch.ipynb`
- 在线入口：[GANPyTorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/10-GANs/GANPyTorch.ipynb)
- 内容概述：使用 PyTorch 实现同样的对抗训练流程，包含自定义网络、损失函数与训练循环，便于对比两个框架的 API 差异。

两份 GAN Notebook 的核心训练循环通常如下：

```text
for epoch in range(num_epochs):
    # 1. 训练判别器
    real_batch = 从训练集采样
    fake_batch = generator(随机噪声 z)
    d_loss = BCE_loss(discriminator(real_batch), 1) +
             BCE_loss(discriminator(fake_batch.detach()), 0)
    d_loss.backward()
    optimizer_D.step()

    # 2. 训练生成器
    fake_batch = generator(随机噪声 z)
    g_loss = BCE_loss(discriminator(fake_batch), 1)  # 希望被判别为真
    g_loss.backward()
    optimizer_G.step()
```

> 注意：这是示意性伪代码，具体实现请参考官方 Notebook。

### 3. 风格迁移 Notebook

- 文件：`StyleTransfer.ipynb`
- 在线入口：[StyleTransfer.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/10-GANs/StyleTransfer.ipynb)
- 内容概述：加载预训练 VGG 网络，提取内容和风格特征并构建 Gram 矩阵，初始化一张噪声图像（或内容图像），通过多次优化迭代生成风格化结果。

```text
content_img = load_image("content.jpg")
style_img = load_image("style.jpg")
generated_img = initialize_image(content_img)

for step in range(num_steps):
    content_loss = mse_loss(vgg_features(generated_img, content_layers),
                            vgg_features(content_img, content_layers))
    style_loss = sum(gram_mse(vgg_features(generated_img, style_layers),
                              vgg_features(style_img, style_layers)))
    tv_loss = total_variation_loss(generated_img)

    total_loss = alpha * content_loss + beta * style_loss + gamma * tv_loss
    total_loss.backward()
    optimizer.step()
```

> 权重 α、β、γ 和内容/风格层的选择会显著影响最终效果，可在 Notebook 中自行实验。

---

## 本课不覆盖与延伸

- **不覆盖**：GAN 的理论收敛证明、Wasserstein GAN（WGAN）、条件 GAN（cGAN）、CycleGAN 等进阶变体；风格迁移的实时前馈网络（如 Johnson 等人的 fast style transfer）与基于扩散模型的现代图像生成。
- **延伸**：
  - 想了解现代高分辨率图像生成，可阅读本库 [[计算机视觉/Generative_Models/Diffusion_Models_Deep_Dive]]。
  - 想了解生成模型整体脉络，可阅读 [[计算机视觉/Generative_Models/Generative_Models]]。
  - 想深入了解 CNN 与图像特征提取，可回顾本课前置课程 [[90_Learn/courses/microsoft/L07_CNN_and_Architectures]] 或 [[计算机视觉/Image_Classification_Detection/Image_Classification_Detection]]。

---

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：[[计算机视觉/Generative_Models/Generative_Models]]
- 微软官方 Notebook 文件夹：[lessons/4-ComputerVision/10-GANs](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/10-GANs)
- 扩展资源：
  - [10 Lessons I Learned Training GANs for one Year](https://towardsdatascience.com/10-lessons-i-learned-training-generative-adversarial-networks-gans-for-a-year-c9071159628)
  - [StyleGAN](https://en.wikipedia.org/wiki/StyleGAN)
  - [Creating Generative Art using GANs on Azure ML](https://soshnikov.com/scienceart/creating-generative-art-using-gan-on-azureml/)
