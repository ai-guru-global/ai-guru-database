---
title: "L25 - 多模态网络 CLIP 与 VQGAN"
category: "90-learn"
tags: ["microsoft-ai-course", "multi-modal", "CLIP", "VQGAN", "DALL-E", "contrastive-learning"]
summary: "本课介绍多模态学习的核心范式：CLIP 如何通过对比学习（Contrastive Learning）对齐图像与文本，VQGAN+CLIP 如何实现文本到图像生成，以及 DALL-E 系列的基本思想。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/X-Extras/X1-MultiModal/README.md"
created: "2026-06-12"
updated: "2026-06-12"
---

# L25 - 多模态网络 CLIP 与 VQGAN

> **一句话理解**：Transformer 在 NLP 取得成功后，研究者开始把视觉与语言"绑定"到一个共享语义空间里——CLIP 让图片能听懂文字描述，VQGAN+CLIP 则让文字能直接"画"出图。

## 本课概览

多模态（Multi-Modal）学习的核心目标是：让模型同时理解并关联来自不同通道的信息，比如图像与文本。本课聚焦两个里程碑式工作：

1. **CLIP**（Contrastive Language-Image Pre-Training，对比式语言-图像预训练）：通过海量互联网图文对进行**对比学习**，把图像和文本映射到同一个向量空间，使得语义相近的图文对在空间中距离更近。
2. **VQGAN + CLIP**：利用 CLIP 的跨模态对齐能力来引导**生成模型** VQGAN，把一段文本提示转化为对应图像。

本课还简要介绍了 OpenAI 的 **DALL-E** 系列，作为文本到图像生成的另一条技术路线。

学习目标：

- 理解 CLIP 的训练目标、损失函数与应用方式。
- 了解 CLIP 如何用于零样本图像分类（Zero-Shot Classification）和文本检索图像。
- 理解 VQGAN 与传统 GAN 的差异，以及为什么需要 CLIP 来引导生成。
- 初步了解 DALL-E 1/2 与 CLIP 路线的异同。

## 核心概念

### 1. 对比学习（Contrastive Learning）

对比学习的基本思想是：**拉近正样本、推开负样本**。在 CLIP 中，正样本是"一对配套的图文"（如某张图片和它对应的说明文字），负样本是同一个 batch 内所有不匹配的图文组合。

具体训练流程：

- 从互联网收集 N 对 (image, text)。
- 分别用图像编码器与文本编码器得到向量：I₁, ..., Iₙ 与 T₁, ..., Tₙ。
- 计算图像向量与文本向量之间的**余弦相似度**（Cosine Similarity）。
- 损失函数同时做两件事：
  - 最大化匹配对 (Iᵢ, Tᵢ) 的相似度；
  - 最小化所有非匹配对 (Iᵢ, Tⱼ, i≠j) 的相似度。

这种对称的双向损失让图像侧与文本侧共享一个语义空间，因此可以直接比较图文相关性。

### 2. CLIP 的架构与能力

CLIP 的模型结构包含两个编码器：

- **图像编码器**：通常基于 Vision Transformer（ViT）或 ResNet，将图片编码为固定维度的向量。
- **文本编码器**：基于 Transformer，将文本提示编码为同维度向量。

两个向量被投影到同一空间后，通过余弦相似度判断图文是否匹配。

预训练完成后，CLIP 可直接用于多种下游任务而无需微调：

- **图像分类（Image Classification）**：给定图片与候选文本提示，如 *"a picture of a cat"*、*"a picture of a dog"*、*"a picture of a human"*，选择相似度最高的那个标签。
- **文本检索图像（Text-Based Image Search）**：给定一段文本查询，在图像集合中找出最匹配的图像。

### 3. VQGAN：矢量量化生成对抗网络

VQGAN（Vector-Quantized GAN）是一种适合高分辨率图像生成的生成模型，核心差异点在于：

- **自回归 Transformer + CNN**：先通过 CNN 学习图像的离散视觉 token，再用自回归 Transformer 按序列方式生成这些 token，最终组合成完整图像。
- **子图像判别器（Patch-Based Discriminator）**：不像传统 GAN 只判断"整张图是真是假"，VQGAN 的判别器会检查图像局部区域的真实性，提升细节质量。

### 4. VQGAN + CLIP：用文本引导图像生成

VQGAN 单独生成图像时，输入往往是随机编码向量，容易产生语义不连贯的结果。为了把"文本语义"注入生成过程，研究者引入 CLIP：

1. 从随机初始化的编码向量 z 开始。
2. 将 z 输入 VQGAN，生成一张图像 I。
3. 把 I 与文本提示 P 同时送入 CLIP，计算二者相似度，作为**损失函数**。
4. 通过**反向传播（Backpropagation）**迭代优化 z，使生成图像逐步匹配文本描述。

这里的关键是：VQGAN 提供图像生成能力，CLIP 提供跨模态语义度量能力，二者互补。

### 5. DALL-E 系列：另一条文本生成图像路线

- **DALL-E 1**：基于 GPT-3 架构，把文本和图像都当作统一的 token 序列来训练，可以直接根据文本生成图像。
- **DALL-E 2**：在真实感与艺术性上进一步提升，采用扩散模型（Diffusion Model）相关技术，生成质量显著优于 DALL-E 1。

与 CLIP+VQGAN 的"编码器引导生成器"路线不同，DALL-E 更像端到端的序列生成模型。

## 关键知识点

- CLIP 的训练数据来自互联网图文对，利用**对比损失**学习跨模态对齐。
- CLIP 支持**零样本图像分类**：无需针对特定类别重新训练，只要构造合适的文本提示即可。
- VQGAN 的核心创新是把图像生成建模为"视觉 token 序列生成"，并引入子图像判别器。
- VQGAN + CLIP 的优化对象是输入编码 z，而不是生成器权重，因此生成过程本质上是"在隐空间里搜索最符合文本描述的图像"。
- DALL-E 1 把图文统一为 token 序列；DALL-E 2 在生成质量上更接近现代扩散模型。

## 代码/实验说明

### 官方 Notebook

本课官方提供一个可运行 Notebook：

- **Clip.ipynb**（位于 [`lessons/X-Extras/X1-MultiModal/Clip.ipynb`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/X-Extras/X1-MultiModal/Clip.ipynb)）

你可以通过 GitHub 直接打开，或在本地克隆仓库后运行。Notebook 主要演示：

1. 加载 OpenAI CLIP 预训练模型（PyTorch 版本）。
2. 准备一组候选文本提示。
3. 对输入图像与文本提示分别编码，计算余弦相似度。
4. 输出最匹配的类别或进行图像检索。

### 核心代码结构示意

```python
import clip
import torch
from PIL import Image

# 加载预训练 CLIP 模型与预处理
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# 候选文本提示
text_prompts = ["a picture of a cat", "a picture of a dog", "a picture of a human"]
text_tokens = clip.tokenize(text_prompts).to(device)

# 图像预处理
image = preprocess(Image.open("example.jpg")).unsqueeze(0).to(device)

# 分别编码
with torch.no_grad():
    image_features = model.encode_image(image)
    text_features = model.encode_text(text_tokens)

# 计算图文相似度
logits_per_image, _ = model(image, text_tokens)
probs = logits_per_image.softmax(dim=-1)

# 取概率最大的类别
predicted = text_prompts[probs.argmax()]
```

> 注意：官方 Notebook 主要提供 **PyTorch 版本**。如果你更熟悉 TensorFlow/Keras，可以搜索 `tensorflow/similarity` 或 `open-clip` 等社区实现作为对照。

### VQGAN + CLIP 的实现参考

社区中一个流行的 VQGAN+CLIP 实现是 [Pixray](https://github.com/pixray/pixray)，它把上述优化流程封装成可直接运行的命令行/Notebook 工具。你可以输入文本提示，Pixray 会自动迭代生成图像。

## 本课不覆盖与延伸

- **不覆盖**：
  - CLIP 训练的具体工程细节（批次规模、数据清洗、训练稳定性）。
  - VQGAN 的量化码本（Codebook）训练与感知损失（Perceptual Loss）的完整推导。
  - DALL-E 2/3 采用的扩散模型细节、Stable Diffusion 的 Latent Diffusion 架构。
  - 多模态大模型（如 GPT-4V、LLaVA、Qwen-VL）的指令微调与对齐方法。

- **延伸**：
  - 想深入 CLIP 的理论与变体，阅读本库 [[05_Computer_Vision/Multimodal_Vision/CLIP_Deep_Dive]]。
  - 想了解多模态模型的全貌与入门概念，阅读 [[04_NLP_LLMs/Multimodal_Models/Multimodal_Models_for_dummy]]。
  - 想了解扩散模型如何成为现代文生图主流，参阅 [[05_Computer_Vision/Generative_Models/Generative_Models]]。
  - 想跑最新多模态实验，可关注 [OpenCLIP](https://github.com/mlfoundations/open_clip)、[Hugging Face Transformers CLIP](https://huggingface.co/docs/transformers/model_doc/clip) 等社区实现。

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[05_Computer_Vision/Multimodal_Vision/CLIP_Deep_Dive]]
  - [[04_NLP_LLMs/Multimodal_Models/Multimodal_Models_for_dummy]]
- 官方论文：
  - CLIP: [Learning Transferable Visual Models From Natural Language Supervision](https://arxiv.org/pdf/2103.00020.pdf)
  - VQGAN: [Taming Transformers for High-Resolution Image Synthesis](https://compvis.github.io/taming-transformers/paper/paper.pdf)
