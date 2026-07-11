---
title: "ModelScope 魔搭社区"
category: -concepts
tags: ["modelscope", "alibaba", "model-hub", "chinese-models", "model-download"]
relationships:
  - target: "概念/huggingface"
    type: alternative_to
  - target: "概念/model-registry"
    type: implements
  - target: "概念/embedding-models"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "ModelScope 魔搭是阿里巴巴推出的开源模型社区平台，提供模型下载、数据集、推理工具链。是国内 AI Stack 部署场景下替代 Hugging Face 的主要方案。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# ModelScope 魔搭社区

> 中国版的 Hugging Face——国内模型下载的首选平台。

---

## 1. 定义

**ModelScope**（魔搭社区）是阿里巴巴达摩院于 2022 年推出的开源模型社区平台，提供模型托管、数据集分享、推理工具链和在线体验功能。在国内网络环境下，ModelScope 是替代 Hugging Face Hub 的主要方案。

---

## 2. ModelScope vs Hugging Face

| 维度 | ModelScope 魔搭 | Hugging Face Hub |
|------|----------------|-----------------|
| **运营方** | 阿里巴巴达摩院 | Hugging Face Inc. |
| **模型数量** | 10,000+ | 500,000+ |
| **中文模型** | 丰富（国内首选） | 一般 |
| **网络访问** | 国内快速 | 国内受限 |
| **SDK** | `modelscope` Python 包 | `huggingface_hub` |
| **许可证** | Apache 2.0 | Apache 2.0 |
| **企业版** | 支持私有部署 | Hub Enterprise |
| **推理工具** | 内置 Pipeline API | Transformers 生态 |

---

## 3. 核心功能

| 功能 | 说明 |
|------|------|
| **模型中心** | 托管开源模型（Qwen、ChatGLM、Baichuan 等） |
| **数据集中心** | 托管训练数据集（中文 NLP/CV 数据集） |
| **空间 (Space)** | 在线 Demo 体验 |
| **推理 SDK** | `modelscope.pipeline()` 一键推理 |
| **训练工具** | SWIFT（Scalable lightWeight Infrastructure for Fine-Tuning） |
| **CLI 工具** | `modelscope download` 命令行下载 |

---

## 4. 使用方式

### 4.1 Python SDK

```python
from modelscope import AutoModelForCausalLM, AutoTokenizer

# 加载模型
model = AutoModelForCausalLM.from_pretrained(
    "qwen/Qwen3-235B-A22B",
    device_map="auto",
    torch_dtype="auto"
)
tokenizer = AutoTokenizer.from_pretrained("qwen/Qwen3-235B-A22B")

# 推理
messages = [{"role": "user", "content": "什么是知识蒸馏？"}]
text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
inputs = tokenizer([text], return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=512)
```

### 4.2 CLI 下载

```bash
# 安装
pip install modelscope

# 下载模型
modelscope download --model qwen/Qwen3-235B-A22B --local_dir ./models/qwen3-235b

# 下载数据集
modelscope download --dataset damo/nlp_corpus --local_dir ./datasets/
```

---

## 5. SWIFT 微调框架

ModelScope 提供 **SWIFT**（Scalable lightWeight Infrastructure for Fine-Tuning）微调工具：

| 特性 | 说明 |
|------|------|
| **支持方法** | LoRA、QLoRA、Full-parameter、DoRA |
| **支持模型** | Qwen、DeepSeek、Llama、GLM 等 |
| **训练加速** | DeepSpeed、FSDP、Megatron |
| **量化支持** | AWQ、GPTQ、BNB |
| **评估** | 内置 OpenCompass 评测 |

```bash
# SWIFT 微调示例
swift sft --model_type qwen3-235b-a22b \
          --dataset alpaca-zh \
          --train_type lora \
          --lora_rank 16
```

---

## 6. AI Stack 中的角色

| 场景 | ModelScope 作用 |
|------|----------------|
| **模型下载** | 从 ModelScope 下载模型到 AI Stack 模型仓库 |
| **镜像构建** | 使用 ModelScope SDK 构建推理镜像 |
| **数据准备** | 从 ModelScope 数据集中心获取训练/评测数据 |
| **模型体验** | 在 ModelScope Space 预先体验模型效果 |

---

## 7. 局限与开放问题

1. **生态规模**：模型数量远少于 Hugging Face
2. **国际社区**：国际影响力有限，以中文生态为主
3. **工具链成熟度**：Transformers/TRL 生态更完善
4. **格式兼容**：部分模型使用 ModelScope 专有格式，需转换

---

## Related

- [[概念/huggingface]] — Hugging Face（全球最大的模型社区）
- [[概念/model-registry]] — 模型仓库（ModelScope 是公有模型仓库）
- [[概念/embedding-models]] — 嵌入模型（ModelScope 托管嵌入模型）
- [[概念/lora-peft]] — LoRA/PEFT（SWIFT 微调框架）
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack（模型下载）
