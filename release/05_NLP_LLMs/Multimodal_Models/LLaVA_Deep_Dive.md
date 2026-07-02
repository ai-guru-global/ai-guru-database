---
title: "LLaVA: 开源多模态大模型"
category: "05-nlp-llms-multimodal-models"
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: "> **一句话理解**: LLaVA 是开源多模态大模型——连接视觉编码器与 LLM 实现图文对话，在 GPT-4V 开源替代中性能领先。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Llava Deep Dive"
  - "LLaVA Deep Dive"
  - LLaVA_Deep_Dive

---
# LLaVA: 开源多模态大模型

> **一句话理解**: LLaVA 是开源多模态大模型——连接视觉编码器与 LLM 实现图文对话，在 GPT-4V 开源替代中性能领先。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级用法](#5-高级用法)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
LLaVA: 开源多模态大模型
═══════════════════════════════════════════════════════════════════

定位: 开源多模态对话模型，连接视觉编码器和 LLM 实现图文理解

核心理念:
───────────────────────────────────────────────────────────────────
• 开源: 完全开源，可本地部署
• 高性能: 对标 GPT-4V 能力
• 易部署: Ollama/LM Studio 支持
• 可微调: 支持垂直领域微调
• 多版本: LLaVA 1.5/1.6/NeXT
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **图文对话** | 支持图像理解和对话 |
| **视频理解** | LLaVA-VIDEO 支持 |
| **文档理解** | 图表、PDF、截图 |
| **视觉推理** | VQA、OCR、定位 |
| **多模态 Agent** | 工具调用、Agent 能力 |
| **高效推理** | INT4 量化支持 |

### 1.3 版本演进

| 版本 | 发布时间 | 视觉编码器 | LLM | 关键改进 |
|------|----------|------------|-----|----------|
| LLaVA 1.0 | 2023.04 | CLIP ViT-L | Vicuna-7B | 开创性工作 |
| LLaVA 1.5 | 2023.11 | CLIP ViT-L | Vicuna-13B | 更高分辨率 |
| LLaVA 1.6 | 2024.01 | CLIP ViT-L | Mistral-7B | 扩展上下文 |
| LLaVA-NeXT | 2024.05 | SigLIP | Qwen-72B | 全面升级 |
| LLaVA-OneVision | 2024.08 | 统一视觉 | 多尺寸 | 单图/视频/多图 |

---

## 2. 核心概念

### 2.1 多模态架构

```
LLaVA 架构
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        LLaVA 架构                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Vision Encoder                            │ │
│  │  CLIP ViT-L / SigLIP                                        │ │
│  │  输入: 图像 → 输出: 视觉特征 [H×W, 1024]                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Projection Layer                          │ │
│  │  Linear Layer: 1024 → 4096                                  │ │
│  │  作用: 视觉特征映射到 LLM 嵌入空间                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    LLM (Vicuna/Qwen)                        │ │
│  │  输入: [图文融合序列]                                        │ │
│  │  输出: 自然语言响应                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

训练策略:
1. 阶段1: 冻结 Vision Encoder，训练 Projection (图文对齐)
2. 阶段2: 冻结 LLM，训练 Vision Encoder + Projection (视觉微调)
```

### 2.2 训练数据

| 数据集 | 规模 | 内容 |
|--------|------|------|
| **LLaVA-150K** | 150K | 图文对话 (GPT-4V 生成) |
| **LAION-CC-SBU** | 558K | 图文对 |
| **COCO** | 133K | 图像描述 |
| **VQA-v2** | 665K | 视觉问答 |
| **DocVQA** | 50K | 文档理解 |

---

## 3. 架构设计

### 3.1 图文融合机制

```
LLaVA 图文融合
═══════════════════════════════════════════════════════════════════

图像输入:
┌──────────────────────────────────────────────────────────────────┐
│                                                                      │
│    ┌─────────────────────────────────────────────────────────┐      │
│    │                    输入图像                               │      │
│    └─────────────────────────────────────────────────────────┘      │
│                              │                                        │
│                              ▼                                        │
│    ┌─────────────────────────────────────────────────────────┐      │
│    │                    Vision Encoder                         │      │
│    │    图像 → 补丁 (576 patches for 224x224)                │      │
│    │    → 视觉特征 [576, 1024]                               │      │
│    └─────────────────────────────────────────────────────────┘      │
│                              │                                        │
│                              ▼                                        │
│    ┌─────────────────────────────────────────────────────────┐      │
│    │                    Linear Projection                     │      │
│    │    [576, 1024] → [576, 4096]                           │      │
│    └─────────────────────────────────────────────────────────┘      │
│                              │                                        │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                          LLM 输入序列                               │
│                                                                      │
│  [IMG] <image_1> <image_2> ... [IMG]  用户: 描述这张图 [SEP]       │
│   │                                   │                             │
│   └───────────────────────────────────┘                             │
│              视觉 token + 文本 token 融合输入                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install llava
```

### 4.2 Ollama 运行

```bash
# 拉取模型
ollama pull llava

# 交互对话
ollama run llava "描述这张图片: ./image.jpg"

# API 服务
ollama serve
```

### 4.3 模型调用

```python
from llava.model.builder import load_pretrained_model
from llava.mm_utils import tokenizer_image_token
from llava.constants import IMAGE_TOKEN, DEFAULT_IMAGE_TOKEN

# 加载模型
model_path = "liuhaotian/llava-v1.6-mistral-7b"
model, tokenizer, image_processor, context_len = load_pretrained_model(model_path)

# 准备输入
from PIL import Image

image = Image.open("image.jpg")
prompt = f"{DEFAULT_IMAGE_TOKEN}\n描述这张图片"

# Tokenize
input_ids = tokenizer_image_token(prompt, tokenizer, IMAGE_TOKEN, return_tensors="pt")

# 生成
with torch.no_grad():
    output = model.generate(
        input_ids.unsqueeze(0),
        images=image.unsqueeze(0),
        max_new_tokens=256
    )

print(tokenizer.decode(output[0]))
```

### 4.4 零代码调用

```python
import requests

# 使用公共 API
response = requests.post(
    "https://api.example.com/llava",
    json={
        "image_url": "https://example.com/image.jpg",
        "prompt": "这张图片里有什么?"
    }
)
print(response.json())
```

---

## 5. 高级用法

### 5.1 微调 LLaVA

```python
# 使用 LLaVA-LoRA 微调
from llava.model.builder import load_pretrained_model
from peft import LoraConfig, get_peft_model

# 加载基础模型
model, tokenizer, _, _ = load_pretrained_model(model_path)

# 配置 LoRA
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# 应用 LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
```

### 5.2 多图理解

```python
# 多图输入
images = [Image.open(f"image_{i}.jpg") for i in range(3)]

prompt = f"{DEFAULT_IMAGE_TOKEN * 3}\n比较这三张图片的异同"

# 生成
output = model.generate(
    input_ids=input_ids,
    images=[images],
    max_new_tokens=256
)
```

### 5.3 工具调用

```python
# LLaVA-Agent 工具调用
tools = [
    {
        "type": "function",
        "function": {
            "name": "search",
            "description": "搜索网络",
            "parameters": {"query": {"type": "string"}}
        }
    }
]

response = model.generate(
    input_ids=input_ids,
    images=[image],
    tools=tools
)

# 解析工具调用
if response.content.tool_calls:
    tool_call = response.content.tool_calls[0]
    print(f"调用工具: {tool_call.function.name}")
```

---

## 6. 对比与选择

### 6.1 开源多模态模型对比

| 模型 | 开发者 | 精度 | 部署难度 | 适用场景 |
|------|--------|------|----------|----------|
| **LLaVA-NeXT** | 微软 | ⭐⭐⭐⭐ | 中 | 通用图文 |
| **Qwen-VL** | 阿里 | ⭐⭐⭐⭐ | 中 | 中文场景 |
| **InternVL** | 智谱 | ⭐⭐⭐⭐ | 中 | 通用 |
| **BakLLaVA** | Mistral | ⭐⭐⭐ | 低 | 快速原型 |
| **OmniLMM** | 清华大学 | ⭐⭐⭐⭐ | 高 | 学术研究 |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 本地部署 | LLaVA (Ollama) |
| 中文场景 | Qwen-VL |
| 英文场景 | LLaVA-NeXT |
| 快速原型 | BakLLaVA |
| 学术研究 | InternVL |

### 6.3 硬件要求

| 模型 | 显存 | 量化后 |
|------|------|--------|
| LLaVA 7B | 14GB | 8GB |
| LLaVA 13B | 26GB | 12GB |
| LLaVA 34B | 68GB | 24GB |
| LLaVA-NeXT 72B | 144GB | 48GB |

---

## 参考资源

- [LLaVA GitHub](https://github.com/haotian-liu/LLaVA)
- [LLaVA 论文](https://arxiv.org/abs/2304.08485)
- [LLaVA 模型](https://huggingface.co/models?search=llava)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[05_NLP_LLMs/Multimodal_Models/Multimodal_Architectures_2026.md|Multimodal_Architectures_2026]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Axolotl_Deep_Dive.md|Axolotl_Deep_Dive]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques.md|Fine_tuning_Techniques]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy.md|Fine_tuning_Techniques_for_dummy]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Model_Merging_2026.md|Model_Merging_2026]]
