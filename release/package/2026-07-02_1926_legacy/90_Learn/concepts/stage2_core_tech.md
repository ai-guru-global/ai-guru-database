---
title: 'Stage 2: 核心技术'
category: '90-learn-concepts'
tags: ["learning", "education", "courses", "study-path"]
summary: '> **"现代 AI 的引擎——理解这些，你就理解了为什么 AI 在 2012 年后开始爆发。"**'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Stage2 Core Tech"
  - "stage2 core tech"
  - stage2_core_tech

---
# Stage 2: 核心技术

> **"现代 AI 的引擎——理解这些，你就理解了为什么 AI 在 2012 年后开始爆发。"**
>
> 本层目标：掌握从神经网络到 Transformer 的核心技术栈，理解 LLM 为什么如此强大。

## 本层概要

| 属性 | 值 |
|------|---|
| 包含核心概念 | 10 个 |
| 预计学习时间 | 10-15 小时 |
| 前置依赖 | [Stage 1: 基础概念](./stage1_foundation.md) |
| 适合人群 | 想深入理解 AI 原理的开发者/研究者 |

---

## 概念列表

### 1. 神经网络 (Neural Network)

- **一句话定义**：受人脑启发的计算模型——由大量"神经元"分层连接组成，每个神经元接收输入、做简单计算、输出结果。
- **为什么重要**：神经网络是深度学习和几乎所有现代 AI 的基础架构。没有它就没有 GPT、没有 AlphaFold、没有自动驾驶。
- **核心结构**：

```
输入层 → 隐藏层1 → 隐藏层2 → ... → 输出层
  │         │          │
(特征)    (计算)      (计算)
```

- **通俗类比**：神经网络像一座有很多层的工厂流水线。每一层工人都把上层的半成品加工一下，传给下一层。加工的"手艺"就是神经元的参数（权重和偏置）。
- **关键概念**：
  - **层 (Layer)**：一组神经元，同一层神经元之间没有连接
  - **权重 (Weight)**：神经元之间连接的强弱，决定信息传递的重要程度
  - **激活函数 (Activation Function)**：给输出加非线性，让网络能学复杂模式（如 ReLU、Sigmoid）
- **入门阅读**：[神经网络核心](../../03_Deep_Learning/Neural_Network_Core/Neural_Network_Core_for_dummy.md)
- **深入学习**：[线性代数基础](../../01_Fundamentals/Linear_Algebra/Linear_Algebra_for_dummy.md)（理解向量/矩阵运算）
- **关联概念**：反向传播、激活函数、深度学习

### 2. 反向传播 (Backpropagation)

- **一句话定义**：计算神经网络中每个参数对最终误差"贡献了多少"的高效算法——从输出层向输入层反向传播梯度。
- **为什么重要**：反向传播让训练深层网络成为可能。1986 年 Rumelhart 等人提出后，深度网络才真正开始学习。
- **直观过程**：
  1. 数据从输入流向输出，得到预测
  2. 计算预测与真实答案的误差（损失函数）
  3. 从输出层反向走，逐层计算每个参数对误差的"责任"
  4. 用梯度下降更新每个参数
- **通俗类比**：反向传播像考试后老师逐题分析——哪道题错了、哪个知识点薄弱，然后把"下次要更注意"的信号传递到每个学生的学习策略中。
- **入门阅读**：[神经网络核心](../../03_Deep_Learning/Neural_Network_Core/Neural_Network_Core_for_dummy.md)
- **关联概念**：梯度下降、损失函数、链式法则 (Chain Rule)

### 3. CNN — 卷积神经网络

- **一句话定义**：专门处理网格化数据（如图像）的神经网络——通过"卷积核"扫描图像提取局部特征。
- **为什么重要**：CNN 是计算机视觉的基石，让 AI 第一次在图像识别上超越人类。它让图像识别从"手工设计特征"进化到"自动学习特征"。
- **核心机制**：卷积核（一个小矩阵）在图像上滑动，每滑动一次做一次"局部特征提取"。多个卷积层叠加，从浅层的"边缘/纹理"到深层的"物体部件/整体"。
- **通俗类比**：CNN 像用放大镜在不同位置观察一幅画——每次只看一小块，先找线条，再找形状，最后理解画面内容。
- **典型应用**：图像分类（ResNet）、目标检测（YOLO）、图像分割（U-Net）
- **入门阅读**：[图像分类与检测](../../04_Computer_Vision/Image_Classification_Detection/Image_Classification_Detection_for_dummy.md)
- **关联概念**：图像处理、特征图 (Feature Map)、池化 (Pooling)

### 4. RNN / LSTM — 序列模型

- **一句话定义**：专门处理有顺序的序列数据（文本、时间序列、音频）的神经网络——能"记住"之前的信息来处理当前输入。
- **为什么重要**：RNN 是处理文本/语音等序列数据的早期方案，很多 NLP 任务都建立在这个基础上。
- **核心问题**：RNN 有"梯度消失"问题——太长的序列会让早期信息被"遗忘"。LSTM 和 GRU 通过"门控机制"解决了这个问题。
- **通俗类比**：RNN 像读一本小说的读者——读到第10章时，读者脑子里同时记住了前面所有章节的关键情节。LSTM 更聪明，它知道哪些情节重要要记住，哪些可以忘掉。
- **局限性**：RNN 训练慢（无法并行）、长序列仍然难以处理 → 这就是 Transformer 出现的原因。
- **入门阅读**：[序列模型](../../05_NLP_LLMs/Sequence_Models/Sequence_Models_for_dummy.md)
- **关联概念**：文本处理、时间序列、梯度消失

### 5. Attention 机制

- **一句话定义**：让模型在处理某个元素时，能"关注"到其他所有相关元素，而不是只能按顺序处理。
- **为什么重要**：Attention 是 Transformer 的核心，也是现代 AI 最重要的突破之一。它解决了 RNN 的长序列依赖问题，让并行训练成为可能。
- **直观理解**：阅读一段话时，你不会逐字记忆，而是关注关键词之间的关系。Attention 就是让 AI 做同样的事。
- **例子**：翻译 "The cat sat on the mat" 时，"sat" 和 "cat" 关系紧密，Attention 机制让模型知道翻译 "sat" 时要特别关注 "cat"。
- **入门阅读**：[Transformer 革命](../../05_NLP_LLMs/Transformer_Revolution/Transformer_Revolution_for_dummy.md)
- **关联概念**：Self-Attention、Transformer、上下文向量 (Context Vector)

### 6. Transformer 架构

- **一句话定义**：完全基于 Attention 机制的序列处理架构——丢弃 RNN，用 Self-Attention + 前馈网络处理序列，训练速度大幅提升。
- **为什么重要**：Transformer 是 2017 年 Google 提出的，它是 GPT、BERT、ChatGPT、Sora 等所有大模型的底层架构。可以说没有 Transformer，就没有 2020 年后的大模型爆发。
- **核心组成**：

```
输入嵌入 → Self-Attention（多头）→ Add & Norm → 前馈网络 → Add & Norm
            ↑                          ↑            ↑
         关注输入内部的              残差连接         逐位置非线性
         依赖关系                    稳定训练          变换
```

- **三大关键创新**：
  1. **Self-Attention**：序列内任意两个位置可以直接交互（无 RNN 的递归约束）
  2. **多头注意力 (Multi-Head Attention)**：多个 Attention 并行，关注不同类型的关系
  3. **位置编码 (Positional Encoding)**：用数学方式给序列中的位置信息编码，让模型知道词的顺序

- **通俗类比**：RNN 像接力赛跑（必须等前一个人跑完才能开始），Transformer 像拔河比赛（所有人同时用力，信息自由传递）。
- **入门阅读**：[Transformer 革命](../../05_NLP_LLMs/Transformer_Revolution/Transformer_Revolution_for_dummy.md)
- **深入学习**：[LLM 架构基础](../../05_NLP_LLMs/LLM_Architectures/LLM-Basics-in-nutshell.md)
- **关联概念**：Attention、GPT、BERT、位置编码

### 7. 大语言模型 (LLM)

- **一句话定义**：在大规模文本上预训练的、参数规模巨大的 Transformer 模型——具备涌现能力（Emergent Abilities）。
- **为什么重要**：LLM 是 2020-2026 年 AI 领域最重要的事件。GPT、Claude、Gemini 都是 LLM。它们展示了"规模"（更多参数 + 更多数据）带来的质变。
- **涌现能力**：当模型大到一定规模时，突然涌现出在小模型上不存在的能力，如：
  - 思维链 (Chain-of-Thought)：能做复杂推理
  - 上下文学习 (In-Context Learning)：无需微调，给几个例子就能学会新任务
  - 零样本推理 (Zero-Shot)：能处理从未见过的任务
- **主流 LLM 家族**：

| 模型 | 开发者 | 特点 |
|------|--------|------|
| GPT 系列 (GPT-5.2) | OpenAI | 通用能力强，API 生态完善 |
| Claude 系列 (4.5) | Anthropic | 安全性高，对话体验好 |
| Gemini 系列 | Google | 多模态原生，原生支持视频/音频 |
| LLaMA 系列 | Meta | 开源，可本地部署 |
| Qwen / DeepSeek | 中国团队 | 中文能力强，性价比高 |

- **入门阅读**：[LLM 架构基础](../../05_NLP_LLMs/LLM_Architectures/LLM-Basics-in-nutshell.md)
- **深入学习**：[LLM 架构完整版](../../05_NLP_LLMs/LLM_Architectures/LLM_Architectures_for_dummy.md)
- **关联概念**：Transformer、预训练、微调、涌现能力、Token

### 8. 预训练与微调 (Pretraining & Fine-tuning)

- **一句话定义**：
  - **预训练**：在大规模通用数据上训练模型学"通用能力"（如语言理解）
  - **微调**：在特定任务数据上继续训练，让模型学会"专业技能"（如客服对话、医疗问答）
- **为什么重要**：这是现代 LLM 的标准训练范式。预训练成本极高（GPT-4 训练成本估计超过 1 亿美元），但微调成本低、速度快，可以在开源模型基础上快速定制。
- **微调技术演进**：
  - **全参数微调 (FFT)**：更新所有参数，效果好但成本高
  - **LoRA**：只训练少量附加低秩矩阵，显存减少 90%+
  - **QLoRA**：在 4-bit 量化的模型上做 LoRA，效率更高
  - **RLHF / DPO**：用人类反馈信号对齐模型输出
- **通俗类比**：预训练像一个人读完了十二年通识教育；微调像去读了职业技能培训班。
- **入门阅读**：[微调技术](../../05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy.md)
- **深入学习**：[微调技术详解](../../05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques.md)
- **关联概念**：LLM、RLHF、LoRA、指令微调 (Instruction Tuning)

### 9. 表示学习 (Representation Learning)

- **一句话定义**：让模型自动学习数据的"最佳表示方式"——把原始数据（如文字、图像）转换成模型"能理解"的数值向量。
- **为什么重要**：这是深度学习最核心的价值——告别手工设计特征，让模型自己发现什么是重要的。
- **例子**：
  - 传统 ML：人工设计"词频"作为文本特征 → 效果有限
  - 深度学习：模型自动将每个词编码为一个"意义向量"（词嵌入）→ 语义相近的词在向量空间中相近
- **里程碑**：
  - Word2Vec (2013)：词的分布式表示
  - BERT (2018)：上下文相关的词表示
  - CLIP (2021)：跨模态（图像+文本）的统一表示
- **关联概念**：词嵌入 (Word Embedding)、特征工程、自监督学习

### 10. 扩散模型 (Diffusion Model)

- **一句话定义**：通过"逐步加噪声 → 逐步去噪"学习生成数据的模型——让 AI 能从噪声中"炼"出图像、视频、声音。
- **为什么重要**：扩散模型是 2022 年后图像/视频生成爆炸的核心技术（DALL-E 2、Midjourney、Stable Diffusion、Sora 都基于此）。
- **直观过程**：
  1. **前向过程**：给图片逐步加噪声，直到变成纯噪声
  2. **反向过程**：训练一个神经网络，逐步去噪，最终生成清晰的图片
- **通俗类比**：扩散模型像一位雕塑家——先把这块大理石砸成碎片（加噪声），然后凭感觉一点点拼接回去（去噪），最终雕出艺术品。
- **入门阅读**：[生成模型](../../04_Computer_Vision/Generative_Models/Generative_Models_for_dummy.md)
- **关联概念**：VAE、GAN、图像生成、视频生成

---

## 学完本层的标志

- [ ] 能画出神经网络的基本结构并解释前向传播过程
- [ ] 能解释反向传播的核心思想（从输出向输入传梯度）
- [ ] 能说明 CNN、RNN、Transformer 各自擅长的数据类型
- [ ] 能用自己的话解释 Attention 机制解决了什么问题
- [ ] 能说明 Transformer 相比 RNN 的主要优势
- [ ] 能解释 LLM 的涌现能力是什么意思
- [ ] 能说明预训练和微调的区别，以及常见的微调方法
- [ ] 能简要描述扩散模型生成图像的基本原理

## 下一步

完成 Stage 2 后：
- **想做工程落地** → [Stage 3: 工程实践](./stage3_engineering.md)
- **想深入 LLM / Agent** → 进入 [LLM 工程师路径](../pathways/llm-engineer.md)
- **想读论文做研究** → 进入 [AI 研究者路径](../pathways/ai-researcher.md)
