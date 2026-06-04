---
title: 原生多模态架构深度解析
category: 04-nlp-llms-multimodal
tags: [multimodal, native-multimodal, architecture, vision-language, gpt-4v, gemini, flamingo, modality-alignment]
summary: 从拼接式多模态到原生多模态的架构演进，深度解析 GPT-4V、Gemini、Flamingo 等主流架构的模态融合机制与设计哲学。
date: 2026-06-01
---

# 原生多模态架构深度解析

## 一句话理解

原生多模态架构不是"把图片编码后塞进文本模型"，而是**从预训练阶段就让模型在统一的表示空间中同时学习文本、图像、音频和视频**，使不同模态成为同一套神经表示的不同投影。

---

## 一、架构演进的三代范式

### 第一代：拼接式多模态 (Bolt-on Multimodality)

**代表**: CLIP + GPT-3、VisualBERT、ViLBERT

**设计**: 
- 独立训练视觉编码器 (ViT/ResNet) 和语言模型
- 通过投影层将视觉特征映射到语言模型的输入空间
- 视觉和文本的交互仅发生在浅层对齐层

**本质缺陷**:
```
视觉编码器冻结 → 投影层 → 语言模型冻结/微调
         ↑                    ↓
      信息瓶颈              模态割裂
```

- **信息瓶颈**: 投影层通常只有 1-2 层 MLP，丰富的视觉细节被压缩成固定维度的 token
- **模态割裂**: 视觉和文本的预训练目标不一致，联合理解能力弱
- **能力天花板**: 只能做"看图说话"，无法理解图像中的细微逻辑关系

### 第二代： early-fusion 多模态 (Early-Fusion Multimodality)

**代表**: Flamingo、BLIP-2、LLaVA

**设计**:
- 冻结预训练好的 LLM 和视觉编码器
- 在两者之间插入可训练的 "Adapter" 或 "Q-Former"
- 通过跨模态注意力实现早期融合

**关键创新**:
- **Flamingo 的 Gated Cross-Attention**: 在 LLM 的每一层插入门控交叉注意力层，让文本 token 动态地 attending 到视觉特征
- **BLIP-2 的 Q-Former**: 用一组可学习的 Query token 从视觉编码器中提取与文本最相关的特征
- **LLaVA 的线性投影**: 极简设计——一个线性层将 ViT 输出映射到 LLM 的 embedding 空间

**局限**:
- 视觉编码器仍然冻结，无法根据语言任务调整视觉表示
- 适配器容量有限，复杂视觉推理能力受限

### 第三代：原生多模态 (Native Multimodality)

**代表**: Gemini、GPT-4o、Chameleon

**核心设计哲学**:
> "从预训练的第一天起，模型就不知道什么是'文本'、什么是'图像'——它只看到一个统一的 token 流。"

**实现方式**:

| 维度 | 拼接式 | 原生多模态 |
|---|---|---|
| 预训练目标 | 文本 LM + 图像对比学习 | 统一的多模态 next-token prediction |
| 输入表示 | 文本 token + 视觉特征向量 | 统一的离散 token 序列 |
| 模型结构 | 分离编码器 + 浅层融合 | 单一 Transformer 处理所有模态 |
| 模态交互 | 仅在输入层/浅层 | 贯穿所有层 |
| 涌现能力 | 有限 | 跨模态推理、模态转换 |

---

## 二、原生多模态的三大技术路径

### 路径 A：统一 Token 化 (Unified Tokenization)

**代表**: Chameleon (Meta)、Show-o

**核心思想**: 将所有模态都离散化为同一个词汇表的 token。

**图像 Token 化**:
```python
# VQ-VAE 或 VQ-GAN 将图像编码为离散 token
image → Encoder → Quantization → Codebook indices
256×256 image → 32×32 = 1024 visual tokens
```

**关键问题**:
- **Codebook 大小**: 通常 8192 或 16384。太小则重建质量差，太大则训练不稳定
- **信息损失**: 1024 个 token 要表达 256×256×3 = 196,608 像素的图像，压缩比高达 192:1
- **文本-视觉 token 比例**: 一张图 = 1024 token，而一句话 ≈ 20 token。导致训练时视觉 token 占主导，语言能力退化

**解决方案**:
- **Chameleon 的模态感知归一化**: 不同模态的梯度尺度差异巨大，需要独立的归一化策略
- **Show-o 的混合表示**: 文本用离散 token，图像用连续特征 + 离散 token 混合表示

### 路径 B：连续-离散混合 (Continuous-Discrete Hybrid)

**代表**: Gemini (Google)、InternVL

**核心思想**: 视觉保持连续表示，文本用离散 token，在 Transformer 内部统一处理。

**架构**:
```
Image → ViT → 连续视觉特征 (256-dim)
Text  → Tokenizer → 离散文本 token

两者都投影到统一的 embedding 空间 → 单一 Transformer
```

**优势**:
- 视觉信息无离散化损失
- 可以复用成熟的文本 tokenizer
- 训练稳定性更好

**挑战**:
- 连续特征和离散 token 的注意力动态不同
- 需要设计特殊的 position embedding：2D 图像位置 vs 1D 文本位置

**Gemini 的具体实现**:
- 音频直接编码为连续频谱特征
- 视频按帧抽取视觉 token，加上时间编码
- 所有模态共享同一个 attention 计算

### 路径 C：模态专家混合 (Modality-MoE)

**代表**: 部分前沿研究模型

**核心思想**: 不同模态使用不同的专家子网络，但通过共享 attention 实现跨模态交互。

**架构**:
```
Input → Modality Router → 
  ├─ Text Expert (Dense Transformer)
  ├─ Vision Expert (Sparse attention + 2D PE)
  └─ Audio Expert (Spectral conv + 1D PE)
  
All experts share: Cross-modal attention layers
```

**优势**: 每个模态可以用最适合的架构
**劣势**: 增加了系统复杂度，跨模态一致性更难保证

---

## 三、模态对齐的深层机制

### 3.1 表示空间对齐 (Representation Alignment)

**目标**: 让 "狗" 的文本 embedding 和狗图片的视觉 embedding 在向量空间中相近。

**方法对比**:

| 方法 | 原理 | 代表 | 局限 |
|---|---|---|---|
| 对比学习 (Contrastive) | 拉近正样本、推开负样本 | CLIP, ALIGN | 需要大量配对数据 |
| 生成式对齐 (Generative) | 用文本生成图像/用图像生成文本 | DALL-E, Parti | 生成质量不稳定 |
| 掩码重建 (Masked Reconstruction) | 遮住部分模态，用另一模态重建 | FLAVA, MAViL | 细粒度对齐弱 |
| 统一生成 (Unified Generation) | 任意模态作为输入，任意模态作为输出 | Chameleon, CM3Leon | 训练成本极高 |

### 3.2 注意力层面的模态交互

**标准 Self-Attention 的问题**:
```
Q_text @ K_visual^T → 文本 token  attending 到图像 patch
```

但图像有 2D 空间结构，文本是 1D 序列。直接用标准 attention 会丢失空间信息。

**解决方案**:

**1. 2D Position Embedding + 1D Text Position 拼接**:
```python
# Gemini 的做法
image_tokens.pos_emb = 2D_sinusoidal(x, y)
text_tokens.pos_emb = 1D_sinusoidal(pos)

# 统一为相对位置编码
rel_pos = concat(image_2d_pe, text_1d_pe)
```

**2. Modality-Aware Attention Mask**:
```python
# 允许文本看图像，但图像 token 之间不看文本（保持视觉局部性）
mask = torch.ones(n_image + n_text, n_image + n_text)
mask[:n_image, n_image:] = 0  # 图像不能 attend 到文本
```

**3. Cross-Modal Rotary Position Embedding (X-RoPE)**:
- 对图像 token 使用旋转位置编码的 2D 扩展
- 对文本使用标准 1D RoPE
- 在 Q@K^T 计算时，通过复数乘法统一处理

### 3.3 训练目标设计

**原生多模态的统一目标**:

```
L_total = λ₁·L_next_token_text + λ₂·L_next_token_image + λ₃·L_cross_modal_alignment
```

**关键超参数**:
- **λ 比例**: Chameleon 发现 λ_image : λ_text = 1:1 时语言能力严重退化，最终采用课程学习——前期文本权重高，后期逐步增加视觉权重
- **数据配比**: Gemini 使用了 "多模态数据 > 纯文本数据 > 纯视觉数据" 的配比，确保模型不会"偏科"

---

## 四、主流架构深度对比

### GPT-4o (OpenAI)

**架构推测** (基于公开信息和技术报告):
- **输入**: 文本 token + 图像 patch embeddings (连续表示)
- **骨干**: 大规模 Transformer (decoder-only)
- **视觉编码**: 可能使用 CLIP-style ViT 的改进版，分辨率动态调整
- **训练策略**: 多阶段——先文本预训练，再加视觉适配器，最后端到端微调

**关键能力**:
- 实时语音对话：音频直接编码为 token，延迟 < 300ms
- 视觉理解：可以解析图表、公式、手写体
- 跨模态推理："这张图中哪个物体在物理上不可能存在？"

**可能的不足**:
- 视觉细节理解（如小字体、纹理）可能不如专用视觉模型
- 视频理解可能是帧级而非时序级

### Gemini 1.5 Pro / 2.5 (Google)

**确认架构** (来自技术报告):
- **原生多模态**: 从预训练阶段就同时处理文本、图像、音频、视频
- **上下文窗口**: 1M-2M token（业界最长）
- **视觉编码**: 动态分辨率 ViT，支持最高 4K 图像
- **视频处理**: 每秒 1 帧采样，加上时间位置编码

**关键创新**:
- **多查询注意力 (MQA) + 滑动窗口**: 在长上下文场景下的注意力优化
- **Confidential Computing**: 训练和推理都在 TEE 中进行

**局限**:
- 视频理解受限于帧采样率，快速动作可能丢失
- 音频理解主要集中在语音，对音乐/环境音的理解较弱

### Chameleon (Meta)

**公开架构**:
- **统一词汇表**: 65,536 token（文本 + 图像共享）
- **图像 tokenizer**: 基于 VQ-VAE，32×32 = 1024 token/图
- **模型规模**: 7B 和 34B
- **训练数据**: 纯文本 + 图文对 + 纯图像

**关键发现**:
- **模态干扰 (Modality Interference)**: 同时训练文本和图像时，文本能力会下降。解决方案是**课程学习**——先训文本，再逐步加入图像
- **归一化挑战**: 视觉 token 的梯度范数是文本 token 的 10-100 倍，需要模态感知的梯度裁剪

---

## 五、设计选择的权衡矩阵

| 设计选择 | 选项 A | 选项 B | 适用场景 |
|---|---|---|---|
| 视觉表示 | 离散 token (VQ-VAE) | 连续特征 (ViT) | 生成任务选 A，理解任务选 B |
| 模态融合位置 | Early (embedding 层) | Late (attention 层) | 需要细粒度对齐选 Early |
| 训练策略 | 端到端统一训练 | 分阶段 (文本→多模态) | 资源充足选 A，稳定性优先选 B |
| 位置编码 | 2D 绝对位置 | 2D 相对位置 (Deformable) | 需要空间推理选 Deformable |
| 视觉分辨率 | 固定 (224/336) | 动态 (任意分辨率) | 文档理解选动态 |

---

## 六、前沿趋势

### 6.1 任意分辨率图像处理

传统 ViT 固定 224×224 或 336×336。但真实世界的图像尺寸差异巨大。

**NaViT (Google)**:
- 去掉图像的固定 patch 划分，直接处理原始尺寸
- 用 2D 绝对位置编码处理不同长宽比
- 训练效率提升 30%+

**Monkey (清华)**:
- 将高分辨率图像分成多个局部窗口
- 每个窗口独立编码，再加全局上下文
- 在文档理解任务上显著提升

### 6.2 视频原生理解

当前主流方法：视频 → 抽帧 → 图像序列 → 时序拼接

**真正原生视频理解的方向**:
- **3D Patch Embedding**: 将视频视为时空立方体，直接做 3D conv/patchify
- **事件驱动采样**: 不是均匀抽帧，而是在运动/变化剧烈处密集采样
- **时序因果注意力**: 视频 token 只能 attend 到过去的帧，保持时序因果性

### 6.3 模态统一到"世界模型"

终极方向：模型不区分模态，只区分"观测"和"动作"。

- **观测**: 文本、图像、音频、视频都是环境状态的不同传感器输出
- **动作**: 生成文本、图像、控制信号都是对环境的干预
- **统一目标**: 预测下一帧/下一 token/下一观测

这与 Yann LeCun 的 JEPA (Joint Embedding Predictive Architecture) 和 World Models 研究高度相关。

---

## 七、实践建议

**如果你要设计一个原生多模态系统**:

1. **数据质量 > 模型架构**: 多模态对齐数据的质量直接决定天花板。优先投资数据清洗和对齐
2. **从连续表示开始**: 不要一开始就追求离散 token 的统一。先用 ViT + 线性投影，验证任务可行性
3. **小心模态干扰**: 同时训练多个模态时，监控每个模态的下游任务性能，及时发现"偏科"
4. **分辨率是瓶颈**: 对于文档理解、医学影像等任务，图像分辨率比模型参数更重要
5. **评估要跨模态**: 不要只测 "图像描述" 和 "文本生成"，要测 "用图像推理文本答案" 和 "用文本指导图像编辑"

---

## Related

- [[04_NLP_LLMs/Multimodal_Models/Multimodal_Architectures_2026]]
- [[04_NLP_LLMs/Multimodal_Models/Modality_Fusion_Mechanisms]]
- [[04_NLP_LLMs/Multimodal_Models/Video_Understanding_Architectures]]
- [[concepts/multimodal-models]]
- [[concepts/transformer-architecture]]
- [[04_NLP_LLMs/LLM_Architectures/LLM_Architectures]]
- [[22_Papers/Attention_Is_All_You_Need_Deep_Dive]]
- [[synthesis/multimodal-rag|多模态 × RAG]] — 多模态内容与 RAG 系统的融合
