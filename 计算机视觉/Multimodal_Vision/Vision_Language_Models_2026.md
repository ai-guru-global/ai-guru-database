---
title: '视觉语言模型 (VLM) 深度解析 (2026)'
category: '04-computer-vision-multimodal-vision'
tags: ["computer-vision", "multimodal", "vlm", "llava", "qwen-vl", "vision-language"]
summary: '> **一句话秒懂**: 视觉语言模型让AI同时"看图"和"说话"——从LLaVA的简洁架构到GPT-4o的原生多模态，VLM正在成为AI理解世界的通用接口，2026年已进入"任何模型都能看图"的时代。'
created: '2026-07-19'
updated: '2026-07-19'
tier: deep-dive
aliases:
  - "Vision Language Models 2026"
  - "VLM 2026"
  - Vision_Language_Models_2026
sources: []

---
# 视觉语言模型 (VLM) 深度解析 (2026)

> **一句话秒懂**: 视觉语言模型让AI同时"看图"和"说话"——从LLaVA的简洁架构到GPT-4o的原生多模态，VLM正在成为AI理解世界的通用接口，2026年已进入"任何模型都能看图"的时代。

---

## 目录

- [概述](#概述)
- [核心架构与原理](#核心架构与原理)
- [视觉编码器选择](#视觉编码器选择)
- [多分辨率策略](#多分辨率策略)
- [视觉指令微调](#视觉指令微调)
- [代表模型架构对比](#代表模型架构对比)
- [多模态推理](#多模态推理)
- [实践指南](#实践指南)
- [2026前沿](#2026前沿)
- [相关概念](#相关概念)

---

## 概述

### VLM的定义与范畴

```
视觉语言模型 (Vision-Language Model, VLM):
= 视觉理解 + 语言生成 的统一模型

输入: 图像/视频 + 文本指令
输出: 文本回答 / 结构化信息 / 动作

能力谱:
├── 图像描述 (Image Captioning)
├── 视觉问答 (Visual QA)
├── 图像推理 (Visual Reasoning)
├── 目标定位 (Visual Grounding)
├── OCR / 文档理解
├── 图表理解 (Chart Understanding)
├── 视频理解 (Video Understanding)
├── 多图比较/推理
└── 视觉指令跟随 (Visual Instruction Following)
```

### 发展时间线

```
2021: CLIP — 视觉-语言对齐的基石
  ↓
2022: Flamingo — 少样本多模态学习
  ↓
2023.01: BLIP-2 — Q-Former桥接
  ↓
2023.04: LLaVA — 简洁线性投影 (里程碑)
  ↓
2023.06: GPT-4V — 商业VLM标杆
  ↓
2023.08: Qwen-VL — 中文VLM领先
  ↓
2024.01: LLaVA-NeXT — 多分辨率
  ↓
2024.03: Gemini 1.5 Pro — 长上下文多模态
  ↓
2024.05: GPT-4o — 原生多模态
  ↓
2024.08: Qwen2-VL / InternVL2 — 开源追赶
  ↓
2025: 原生多模态大模型 / 视频原生理解
  ↓
2026: 统一多模态 (图/视频/音频/3D) / 实时交互
```

### 为什么VLM是2024-2026最重要的AI方向？

```
1. 通用性: 一个模型处理所有视觉任务
   - 不再需要: 检测模型+分割模型+OCR模型+VQA模型
   - 一个VLM: 全部搞定

2. 交互性: 自然语言交互
   - "图中有什么?" "左边那个是什么?" "帮我数一下"
   - 零门槛使用

3. 泛化性: 无需针对特定任务训练
   - 新任务: 只需新的prompt
   - 新领域: 少样本/零样本

4. 产业价值: 广泛应用
   - 文档处理、医疗影像、自动驾驶、电商、教育...
```

---

## 核心架构与原理

### VLM通用架构

```
所有VLM的基本组成:

┌─────────────────────────────────────────────────┐
│                VLM 通用架构                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐                               │
│  │ Vision       │  图像/视频 → 视觉Token         │
│  │ Encoder      │  (ViT / SigLIP / InternViT)   │
│  └──────┬───────┘                               │
│         │ Visual Tokens                         │
│         ↓                                       │
│  ┌──────────────┐                               │
│  │ Projector /  │  视觉Token → LLM空间           │
│  │ Connector    │  (Linear / Q-Former / MLP)    │
│  └──────┬───────┘                               │
│         │ Aligned Tokens                        │
│         ↓                                       │
│  ┌──────────────┐                               │
│  │ Language     │  [Visual] + [Text] → Response  │
│  │ Model (LLM)  │  (LLaMA / Qwen / InternLM)    │
│  └──────────────┘                               │
│                                                 │
└─────────────────────────────────────────────────┘

核心思想: 将图像"翻译"为LLM能理解的token序列
```

### 三大架构范式

#### 范式一: 线性投影 (LLaVA系列)

```
LLaVA (2023, UW-Madison):

Image → CLIP ViT-L/14 → 256 visual tokens (1024-d)
                              ↓
                    Linear Projection (1024→4096)
                              ↓
                    [Visual Tokens] + [Text Tokens]
                              ↓
                    LLaMA/Vicuna (7B/13B)
                              ↓
                    Text Response

特点:
✓ 极简: 一个线性层连接
✓ 高效: 无额外参数
✓ 有效: 性能不输复杂方案
✗ 固定分辨率: 224×224 / 336×336
✗ Token数固定: 256/576个

后续改进:
- LLaVA-1.5: 2层MLP替代Linear
- LLaVA-NeXT: 多分辨率 (AnyRes)
- LLaVA-OneVision: 统一图像/视频/多图
```

#### 范式二: Q-Former (BLIP-2系列)

```
BLIP-2 (2023, Salesforce):

Image → Frozen ViT-G → Visual Features
                              ↓
                    Q-Former (可学习)
                    - 32个可学习queries
                    - Cross-Attention with ViT
                    - 压缩: 256→32 tokens
                              ↓
                    Linear → LLM空间
                              ↓
                    Frozen LLM (OPT/FlanT5)
                              ↓
                    Text Response

特点:
✓ 高效: 32 tokens (vs 256)
✓ 解耦: 视觉和语言独立训练
✓ 灵活: 可对接不同LLM
✗ 信息损失: 压缩过度
✗ 训练复杂: 两阶段训练
```

#### 范式三: 原生多模态 (GPT-4o/Gemini)

```
GPT-4o / Gemini (2024-2026):

不是"视觉编码器 + LLM"的拼接
而是: 从预训练阶段就同时处理多模态

训练:
- 文本 + 图像 + 音频 + 视频 联合预训练
- 统一Tokenizer: 所有模态 → 统一token空间
- 从第一天就是多模态

推理:
- 任意模态输入 → 统一处理 → 任意模态输出
- 图像+文本+音频 同时输入
- 文本+图像+语音 同时输出

特点:
✓ 深度多模态融合
✓ 跨模态推理更强
✓ 端到端优化
✗ 训练成本极高
✗ 不开源
```

### 视觉Token化详解

```
图像如何变成Token?

Step 1: Patch Embedding
图像 (H×W×3) → 切分为14×14的patches
→ 每个patch: 14×14×3 = 588维 → 线性投影到D维
→ 得到 (H/14)×(W/14) 个tokens

示例: 336×336图像
→ 24×24 = 576 patches
→ 576个visual tokens (每个1024维)

Step 2: Position Encoding
→ 加入位置信息 (2D RoPE / 绝对位置)

Step 3: Transformer编码
→ 多层Self-Attention
→ 输出: 576个编码后的visual tokens

Step 4: 投影到LLM空间
→ Linear/MLP: 1024维 → 4096维 (匹配LLM)
→ 或 Q-Former: 576 → 32 tokens

最终: 图像 = 一段"视觉语言" token序列
LLM像读文本一样"读"图像
```

---

## 视觉编码器选择

### 主流视觉编码器对比

| 编码器 | 参数量 | 分辨率 | 训练方式 | 特点 | 使用者 |
|--------|--------|--------|----------|------|--------|
| **CLIP ViT-L/14** | 304M | 224/336 | 对比学习 | 语义强、通用 | LLaVA, ShareGPT4V |
| **CLIP ViT-G/14** | 1.8B | 224 | 对比学习 | 最强CLIP | BLIP-2 |
| **SigLIP-SO400M** | 400M | 384 | Sigmoid对比 | 高效、无softmax | PaliGemma, Gemma |
| **InternViT-6B** | 6B | 448 | 对比+生成 | 超大视觉模型 | InternVL |
| **EVA-02-CLIP-E** | 4.4B | 448 | 对比学习 | 强泛化 | Emu, Monkey |
| **DFN (Data Filtering)** | 2B | 378 | 过滤数据 | 数据质量 | DFN-CLIP |
| **SAM ViT-H** | 632M | 1024 | 分割 | 细粒度空间 | LISA |
| **DINOv2** | 1.1B | 518 | 自监督 | 强空间特征 | Depth/Seg下游 |

### 选择策略

```
选择视觉编码器的考量:

1. 语义理解任务 (VQA/Caption):
   → CLIP系列 (语义对齐好)
   → SigLIP (效率高)

2. 细粒度理解 (OCR/小目标):
   → 高分辨率编码器 (InternViT-6B, 448px)
   → 多分辨率策略 (AnyRes)

3. 空间定位 (Grounding/分割):
   → DINOv2 (空间特征强)
   → SAM (像素级)

4. 效率优先 (边缘部署):
   → SigLIP-SO400M (384px, 高效)
   → CLIP ViT-B/16 (小模型)

5. 极致性能:
   → InternViT-6B (最大)
   → 多编码器融合
```

### 视觉编码器的训练方式

```
对比学习 (CLIP/SigLIP):
- 图像-文本对: (image, caption)
- 目标: 匹配对相似度高, 不匹配对低
- 优势: 强语义对齐
- 劣势: 缺乏细粒度空间信息

自监督 (DINOv2/MAE):
- 无标注图像
- 目标: 重建/自蒸馏
- 优势: 强空间/纹理特征
- 劣势: 缺乏语义对齐

混合训练:
- 对比 + 生成 + 分割
- 代表: InternViT (对比+生成)
- 优势: 兼顾语义和空间
```

---

## 多分辨率策略

### 为什么需要多分辨率?

```
问题: 固定分辨率的局限

CLIP默认: 224×224
→ 一张4K图像被压缩到224×224
→ 细节丢失: 小字看不清、小目标消失

示例:
- 文档OCR: A4纸上的小字 → 224px完全看不清
- 图表理解: 折线图的数据点 → 需要高分辨率
- 遥感图像: 地物细节 → 需要超高分辨率
- 医学影像: 微小病灶 → 需要局部放大
```

### AnyRes (LLaVA-NeXT)

```
LLaVA-NeXT AnyRes策略:

原始图像 (任意尺寸)
    ↓
选择最佳网格: 2×2, 3×3, 1×4, 4×1...
    ↓
┌─────────────────────────────────┐
│  全局缩略图 (336×336)            │  → 全局语义
│  + 局部裁剪 (每块336×336)        │  → 局部细节
└─────────────────────────────────┘
    ↓
每块独立过ViT → 各自的visual tokens
    ↓
拼接: [全局tokens] + [局部tokens_1] + [局部tokens_2] + ...
    ↓
送入LLM

示例: 1344×672 图像 → 2×1网格
→ 1个全局(336×336) + 2个局部(336×336)
→ 576 + 576×2 = 1728 visual tokens

优势: 兼顾全局语义 + 局部细节
代价: Token数增加 (计算量增加)
```

### 动态分辨率 (Qwen2-VL)

```
Qwen2-VL 动态分辨率:

创新: 不固定网格, 根据图像原始比例动态分配

流程:
1. 保持原始宽高比
2. 动态计算token数 (基于面积)
3. 2D-RoPE位置编码 (非固定网格)
4. 原生支持任意分辨率

优势:
- 无信息损失 (不强制resize)
- 宽高比保持 (不变形)
- 灵活: 小图少token, 大图多token

Token计算:
tokens = (H/14) × (W/14) / merge_factor
merge_factor = 2 (2×2 token合并)
```

### 多分辨率方案对比

| 方案 | 模型 | 策略 | 最大分辨率 | Token数 | 效果 |
|------|------|------|-----------|---------|------|
| **AnyRes** | LLaVA-NeXT | 网格裁剪 | 2688×2688 | ~3000 | ★★★★ |
| **Dynamic** | Qwen2-VL | 动态比例 | 无限制 | 可变 | ★★★★★ |
| **Tiling** | InternVL2 | 自适应切片 | 4K+ | ~3000 | ★★★★★ |
| **Naive** | LLaVA-1.5 | 固定resize | 336×336 | 576 | ★★★ |
| **Thumbnail+** | Monkey | 缩略图+切片 | 2048 | ~2000 | ★★★★ |
| **Native** | GPT-4o | 原生处理 | 高 | 自适应 | ★★★★★ |

---

## 视觉指令微调

### 训练范式

```
VLM训练通常分三阶段:

Stage 1: 视觉-语言对齐 (Alignment Pre-training)
- 数据: 图像-文本对 (CC3M, LAION, DataComp)
- 训练: 只训练Projector (冻结ViT和LLM)
- 目标: 让LLM"看懂"图像
- 规模: ~600K 样本

Stage 2: 视觉指令微调 (Visual Instruction Tuning)
- 数据: 指令-回答对 (LLaVA-Instruct, ShareGPT4V)
- 训练: 训练Projector + LLM (LoRA或全量)
- 目标: 学会遵循指令、多轮对话
- 规模: ~1M 样本

Stage 3: 偏好对齐 (可选)
- 数据: 人类偏好数据
- 方法: DPO / RLHF
- 目标: 更符合人类期望
- 规模: ~100K 样本
```

### 指令数据构造

```
高质量指令数据来源:

1. GPT-4生成 (LLaVA方法):
   - 输入: 图像描述 + bbox信息
   - GPT-4: 生成对话/推理/描述指令
   - 优势: 多样性高
   - 劣势: 可能有幻觉

2. 人工标注:
   - 专业标注员
   - 质量最高
   - 成本最高

3. 任务数据混合:
   - VQA数据集 (VQAv2, GQA, OKVQA)
   - Caption (COCO, Flickr30k)
   - OCR (TextVQA, DocVQA)
   - 图表 (ChartQA, PlotQA)
   - 推理 (ScienceQA, MathVista)

4. 合成数据 (2025-2026):
   - 强模型生成 + 弱模型蒸馏
   - 自我进化 (Self-play)
   - 数据飞轮
```

### 训练技巧

| 技巧 | 描述 | 效果 |
|------|------|------|
| 冻结ViT | Stage 1-2冻结视觉编码器 | 稳定训练 |
| LoRA微调 | LLM用LoRA (r=128) | 节省显存 |
| 多分辨率训练 | 混合不同分辨率 | 泛化性 |
| 数据混合 | 多任务数据按比例混合 | 全面能力 |
| 课程学习 | 简单→复杂 | 收敛稳定 |
| 长上下文 | 支持多图/长视频 | 扩展能力 |
| 动态分辨率 | 按图像大小调整 | 效率+质量 |

---

## 代表模型架构对比

### 开源VLM对比 (2024-2026)

| 模型 | 视觉编码器 | LLM | 连接方式 | 分辨率 | 参数量 | 特点 |
|------|-----------|-----|----------|--------|--------|------|
| **LLaVA-1.5** | CLIP ViT-L | Vicuna-13B | 2层MLP | 336 | 13B | 简洁基线 |
| **LLaVA-NeXT** | CLIP ViT-L | 多种LLM | 2层MLP | AnyRes | 7-110B | 多分辨率 |
| **Qwen2-VL** | ViT (自研) | Qwen2 | Cross-Attn | 动态 | 2-72B | 动态分辨率 |
| **InternVL2** | InternViT-6B | InternLM2 | MLP | 4K+ | 2-76B | 超大ViT |
| **CogVLM2** | EVA-02 | ChatGLM | Cross-Attn | 1344 | 19B | 视觉专家 |
| **Yi-VL** | CLIP ViT-H | Yi-34B | Linear | 448 | 34B | 大LLM |
| **DeepSeek-VL** | SigLIP+SAM | DeepSeek | MLP | 384 | 7B | 混合编码 |
| **MiniCPM-V** | SigLIP | MiniCPM | Perceiver | 动态 | 2.8B | 轻量高效 |
| **Phi-3-Vision** | CLIP ViT-L | Phi-3 | MLP | 动态 | 4.2B | 小模型强 |
| **Idefics3** | SigLIP | Llama-3 | Perceiver | 多分辨率 | 8B | 高效 |

### 闭源VLM对比

| 模型 | 公司 | 发布时间 | 多模态 | 视频 | 上下文 | 特点 |
|------|------|----------|--------|------|--------|------|
| **GPT-4o** | OpenAI | 2024.05 | 原生 | ✓ | 128K | 全能标杆 |
| **GPT-4V** | OpenAI | 2023.09 | 拼接 | 有限 | 128K | 首个商业VLM |
| **Gemini 2.0** | Google | 2025.01 | 原生 | ✓ | 2M | 超长上下文 |
| **Claude 3.5** | Anthropic | 2024.10 | 拼接 | ✓ | 200K | 推理强 |
| **Gemini 1.5 Pro** | Google | 2024.02 | 原生 | ✓ | 1M | 长视频 |

### 架构设计对比

```
LLaVA系列 (极简):
Image → ViT → Linear/MLP → [tokens] + text → LLM → answer
参数量: Projector仅~20M

Qwen2-VL (动态):
Image → ViT (动态分辨率) → Cross-Attn Pooling → LLM
创新: 2D-RoPE, 动态token数, 视频原生

InternVL2 (大视觉):
Image → InternViT-6B → MLP → LLM
创新: 6B视觉编码器, 像素shuffle下采样

GPT-4o (原生):
多模态 → 统一Tokenizer → 统一Transformer → 多模态输出
创新: 从预训练就是多模态, 非后期拼接
```

---

## 多模态推理

### 视觉推理能力

```
VLM推理能力层次:

Level 1: 感知 (Perception)
- "图中有什么?" → 识别物体
- "这是什么颜色?" → 属性识别

Level 2: 理解 (Understanding)
- "这个人在做什么?" → 动作理解
- "这是什么场景?" → 场景理解

Level 3: 推理 (Reasoning)
- "为什么会这样?" → 因果推理
- "接下来会发生什么?" → 预测

Level 4: 数学/逻辑 (Math/Logic)
- "计算图中的面积" → 数学推理
- "如果A>B, B>C, 则?" → 逻辑推理

Level 5: 创造 (Creation)
- "根据图写一个故事" → 创造性输出
- "设计一个解决方案" → 方案设计
```

### Chain-of-Thought 视觉推理

```
视觉CoT:

传统: Image + Question → Answer (一步)
CoT:  Image + Question → 思考过程 → Answer (多步)

示例:
Q: "图中最贵的产品是哪个?"

无CoT: "产品C"

有CoT:
"让我分析图表:
1. 产品A: 价格$50, 销量100
2. 产品B: 价格$80, 销量60
3. 产品C: 价格$120, 销量30
比较价格: $120 > $80 > $50
所以最贵的是产品C"

训练方法:
- 在指令数据中加入推理过程
- 强化学习奖励正确推理
- 多步视觉推理数据
```

### 多模态推理基准

| 基准 | 能力 | 难度 | 描述 |
|------|------|------|------|
| **MMMU** | 多学科 | ★★★★★ | 大学级多模态理解 |
| **MathVista** | 数学推理 | ★★★★ | 视觉数学问题 |
| **MMBench** | 综合 | ★★★★ | 多维度评估 |
| **SEED-Bench** | 综合 | ★★★ | 12维度评估 |
| **ChartQA** | 图表 | ★★★ | 图表理解 |
| **DocVQA** | 文档 | ★★★ | 文档问答 |
| **RealWorldQA** | 真实世界 | ★★★★ | 实际场景推理 |
| **AI2D** | 科学图 | ★★★ | 科学图表理解 |
| **BLINK** | 感知 | ★★★★ | 人类一眼看出 |
| **VideoMME** | 视频 | ★★★★ | 视频多模态评估 |

---

## 实践指南

### 模型选择指南

```
根据需求选择VLM:

1. 通用对话/问答:
   - 最强: GPT-4o / Gemini 2.0
   - 开源: Qwen2-VL-72B / InternVL2-76B
   - 轻量: Qwen2-VL-7B / LLaVA-NeXT-7B

2. 文档/OCR:
   - 推荐: Qwen2-VL (动态分辨率)
   - 推荐: InternVL2 (高分辨率)
   - 专用: DocOwl, Nougat

3. 视频理解:
   - 最强: Gemini 2.0 (超长上下文)
   - 开源: LLaVA-OneVision, Video-LLaVA
   - 实时: Qwen2-VL (视频原生)

4. 边缘部署:
   - MiniCPM-V 2.6 (2.8B, 手机可跑)
   - Phi-3-Vision (4.2B)
   - Qwen2-VL-2B

5. 视觉定位/分割:
   - Qwen2-VL (bbox输出)
   - Ferret / LISA (分割)
   - Grounding DINO + SAM (Pipeline)
```

### 快速部署

```python
# Qwen2-VL 推理
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
import torch

model = Qwen2VLForConditionalGeneration.from_pretrained(
    "Qwen/Qwen2-VL-7B-Instruct",
    torch_dtype=torch.bfloat16,
    device_map="auto"
)
processor = AutoProcessor.from_pretrained("Qwen/Qwen2-VL-7B-Instruct")

# 构建消息
messages = [
    {"role": "user", "content": [
        {"type": "image", "image": "path/to/image.jpg"},
        {"type": "text", "text": "描述这张图片中的内容"}
    ]}
]

# 推理
text = processor.apply_chat_template(messages, tokenize=False)
inputs = processor(text=[text], images=[image], return_tensors="pt").to("cuda")
output_ids = model.generate(**inputs, max_new_tokens=512)
response = processor.batch_decode(output_ids, skip_special_tokens=True)
```

### 微调实践

```python
# LLaVA风格微调 (使用LLaMA-Factory)

# 1. 准备数据 (JSON格式)
# data.json:
# [
#   {
#     "image": "path/to/image.jpg",
#     "conversations": [
#       {"from": "human", "value": "<image>\n描述这张图"},
#       {"from": "gpt", "value": "这是一张..."}
#     ]
#   }
# ]

# 2. 训练配置
# 使用LLaMA-Factory:
# llamafactory-cli train \
#   --model_name_or_path Qwen/Qwen2-VL-7B-Instruct \
#   --dataset my_vlm_data \
#   --finetuning_type lora \
#   --lora_rank 128 \
#   --output_dir output/ \
#   --per_device_train_batch_size 2 \
#   --gradient_accumulation_steps 8 \
#   --num_train_epochs 3

# 3. 关键超参数
# - Learning rate: 1e-4 (LoRA) / 2e-5 (全量)
# - Batch size: 尽量大 (梯度累积)
# - 分辨率: 与预训练一致
# - 冻结: Stage 1冻结ViT, Stage 2解冻
```

### 推理优化

| 优化方法 | 效果 | 适用场景 |
|----------|------|----------|
| vLLM部署 | 2-5x吞吐 | 服务端批量推理 |
| INT4量化 (AWQ/GPTQ) | 显存减半 | 显存受限 |
| Flash Attention 2 | 速度+显存 | 所有场景 |
| KV Cache | 多轮对话加速 | 对话应用 |
| 图像Token压缩 | 减少视觉token | 长上下文 |
| 投机解码 | 2-3x速度 | 延迟敏感 |
| ONNX/TensorRT | 边缘加速 | 端侧部署 |

### 硬件需求

| 模型规模 | 推理显存 (FP16) | 推理显存 (INT4) | 推荐GPU |
|----------|----------------|----------------|---------|
| 2-3B | 6-8 GB | 3-4 GB | RTX 3060 / 手机 |
| 7-8B | 16-18 GB | 8-10 GB | RTX 4090 |
| 13B | 28-32 GB | 14-16 GB | A100 40G |
| 34B | 70-80 GB | 35-40 GB | A100 80G |
| 72B+ | 150+ GB | 75+ GB | 2×A100 80G |

---

## 2026前沿

### 原生多模态 (Native Multimodal)

```
从"拼接式" → "原生式":

拼接式 (2023-2024):
Vision Encoder (预训练) + Projector + LLM (预训练)
→ 后期对齐, 模态间理解有gap

原生多模态 (2025-2026):
从预训练第一天就:
- 文本 + 图像 + 视频 + 音频 联合训练
- 统一Tokenizer: 所有模态 → 统一token
- 统一Transformer: 无模态边界
- 任意模态输入 → 任意模态输出

代表:
- GPT-4o: 文本/图像/音频 统一
- Gemini 2.0: 文本/图像/视频/音频/代码
- Chameleon (Meta): 早期原生多模态尝试
- Emu3: 统一生成式多模态

优势:
- 更深的跨模态理解
- 更自然的模态切换
- 端到端优化无信息损失
```

### 视频原生理解

```
从"抽帧理解" → "视频原生":

传统: 视频 → 抽取N帧 → 当作多图理解
问题: 丢失时间连续性、运动信息

视频原生 (2026):
- 视频Tokenizer: 时空压缩编码
- 时间建模: 3D注意力 / 状态空间模型
- 长视频: 1小时+ 视频直接输入
- 时间定位: "第3分钟发生了什么?"

代表:
- Gemini 2.0: 原生长视频 (2M tokens)
- Qwen2-VL: 视频原生token化
- Video-LLaVA: 时空对齐
- LLaVA-OneVision: 图像/视频统一

关键能力:
- 时间推理: "之前/之后/同时"
- 动作理解: 连续动作的因果关系
- 事件检测: 关键时刻定位
- 长程依赖: 视频首尾的关联
```

### 多模态Agent

```
VLM → 多模态智能体:

从"看图回答" → "看图行动":

1. GUI Agent:
   - 看屏幕截图 → 执行操作
   - "帮我打开设置，连接WiFi"
   - 代表: CogAgent, SeeClick, OS-Atlas

2. Web Agent:
   - 看网页 → 完成网页任务
   - "帮我订一张明天去北京的机票"
   - 代表: WebVoyager, Mind2Web

3. 机器人:
   - 看环境 → 执行操作
   - "把桌上的杯子放到柜子里"
   - 代表: RT-2, Octo, OpenVLA

4. 通用Agent:
   - 多模态感知 + 工具使用 + 规划
   - 代表: GPT-4o + Tools, Gemini Agent
```

### 统一理解与生成

```
2026趋势: 一个模型同时理解和生成

传统分离:
- 理解: VLM (输入图 → 输出文本)
- 生成: Diffusion (输入文本 → 输出图)

统一模型:
- 输入: 图+文 → 输出: 图+文
- "把图中的猫变成狗" → 输出修改后的图
- "画一个类似风格但不同内容的图" → 生成

代表:
- Chameleon: 统一token (理解+生成)
- Emu: 多模态生成
- SEED-X: 统一多模态
- Janus: 解耦理解与生成

技术挑战:
- 理解需要全局语义
- 生成需要细粒度像素
- 两者对视觉表示的需求不同
```

### 小模型VLM

```
趋势: 强能力 + 小参数量

目标: 在手机/边缘设备运行强VLM

代表:
- MiniCPM-V 2.6 (2.8B): 手机可跑, 性能接近7B
- Phi-3-Vision (4.2B): 小模型强推理
- Qwen2-VL-2B: 轻量多分辨率
- InternVL2-2B: 轻量高性能
- LLaVA-Phi-3-mini (3.8B): 高效

关键技术:
- 知识蒸馏: 大模型→小模型
- 高效架构: Perceiver, 稀疏注意力
- 量化: INT4/INT3
- 数据质量: 高质量数据弥补规模
```

### 3D/空间多模态

```
从2D图像 → 3D空间理解:

方向:
1. 3D场景理解:
   - 点云 + 图像 + 文本
   - "房间中桌子左边有什么?"

2. 空间推理:
   - 3D空间关系理解
   - 距离/方向/遮挡推理

3. 具身多模态:
   - VLM + 机器人操作
   - 视觉-语言-动作 (VLA)

4. AR/VR多模态:
   - 实时场景理解
   - 空间锚定
   - 手势/语音交互

代表:
- 3D-LLM: 3D场景语言模型
- SpatialVLM: 空间推理VLM
- RT-2: 视觉-语言-动作
```

---

## 相关概念

### 本知识库相关页面

- [[CLIP_Deep_Dive]] - CLIP深度解读 (VLM的视觉-语言对齐基础)
- [[ViT_Deep_Dive]] - Vision Transformer (视觉编码器核心)
- [[Visual_Grounding_Deep_Dive]] - 视觉定位 (VLM的Grounding能力)
- [[Multimodal_Vision]] - 多模态视觉总览
- [[Object_Detection_Deep_Dive]] - 目标检测 (VLM检测能力)
- [[Segmentation]] - 图像分割 (VLM分割能力)
- [[3D_Vision]] - 3D视觉 (3D多模态)
- [[3D_Generation_2026]] - 3D生成 (多模态生成)
- [[Video_Generation_2026]] - 视频生成 (视频多模态)
- [[Diffusion_Models_Deep_Dive]] - 扩散模型 (多模态生成)
- [[Generative_Models]] - 生成模型 (统一生成)
- [[Autonomous_Driving_Perception_2026]] - 自动驾驶感知 (VLM在AD中的应用)
- [[CV_Fundamentals]] - 计算机视觉基础
- [[HF_Diffusers_Practical_Guide]] - Diffusers实践

### 关键术语表

| 术语 | 英文 | 含义 |
|------|------|------|
| 视觉语言模型 | Vision-Language Model (VLM) | 同时处理视觉和语言的模型 |
| 视觉指令微调 | Visual Instruction Tuning | 用指令数据训练VLM |
| 多模态大模型 | Multimodal Large Language Model | 多模态LLM |
| 视觉编码器 | Vision Encoder | 将图像转为token的模块 |
| 投影器 | Projector / Connector | 连接视觉和语言的模块 |
| 多分辨率 | Multi-Resolution / AnyRes | 处理不同分辨率图像 |
| 原生多模态 | Native Multimodal | 预训练即多模态 |
| 视觉Token | Visual Token | 图像的token化表示 |
| 跨模态对齐 | Cross-Modal Alignment | 视觉与语言的语义对齐 |
| 多模态推理 | Multimodal Reasoning | 基于视觉+语言的推理 |

---

## 参考资源

### 论文

- LLaVA: Visual Instruction Tuning (2023)
- BLIP-2: Bootstrapping Language-Image Pre-training (2023)
- Qwen2-VL: Enhancing Vision-Language Model's Perception (2024)
- InternVL: Scaling up Vision Foundation Models (2024)
- LLaVA-NeXT: Improved reasoning, OCR, and world knowledge (2024)
- GPT-4V(ision) System Card (2023)
- Gemini: A Family of Highly Capable Multimodal Models (2023)

### 开源项目

- LLaVA: github.com/haotian-liu/LLaVA
- Qwen2-VL: github.com/QwenLM/Qwen2-VL
- InternVL: github.com/OpenGVLab/InternVL
- LLaMA-Factory: github.com/hiyouga/LLaMA-Factory
- vLLM: github.com/vllm-project/vllm (多模态推理)

### 评估基准

- OpenCompass: 综合多模态评估
- MMBench: 多维度VLM评估
- MMMU: 大学级多模态理解
- LMSYS Chatbot Arena: 人类偏好排名

---

> **总结**: 视觉语言模型从2023年LLaVA的简洁范式到2026年的原生多模态，经历了三次跃迁: (1) 从固定分辨率到动态多分辨率; (2) 从图像理解到视频/3D/音频全模态; (3) 从理解到理解+生成+行动的统一。2026年的核心趋势是原生多模态、视频原生理解、多模态Agent、以及小模型高性能。对于开发者，Qwen2-VL + vLLM是当前最具性价比的开源VLM技术栈。
