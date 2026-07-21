---
title: "SWIFT 微调框架 (ModelScope SWIFT Fine-tuning Framework)"
category: -concepts
tags: ["swift", "modelscope", "fine-tuning", "lora", "ai-stack", "peft"]
relationships:
  - target: "概念/lora-peft"
    type: related_to
  - target: "概念/modelscope"
    type: related_to
  - target: "概念/torchrun"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "SWIFT (Scalable lightWeight Infrastructure for Fine-Tuning) 是 ModelScope 开源的微调框架，支持 100+ 模型的 LoRA/全参微调，是 AI Stack 训练工具链的推荐选择。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
---

# SWIFT 微调框架

> **一句话理解**: SWIFT 是 ModelScope 的"一键微调工具箱"——支持 Qwen/LLaMA/ChatGLM 等 100+ 模型的 LoRA/全参微调，比 transformers Trainer 更简洁。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全名** | Scalable lightWeight Infrastructure for Fine-Tuning |
| **来源** | ModelScope (魔搭社区) |
| **功能** | LLM 微调（LoRA/QLoRA/全参/DPO/RLHF） |
| **模型支持** | 100+ 模型 |
| **GitHub** | github.com/modelscope/ms-swift |

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **LoRA/QLoRA** | 参数高效微调，显存节省 80% |
| **全参微调** | 完整模型微调 |
| **DPO/RLHF** | 人类偏好对齐 |
| **多模态微调** | 视觉-语言模型微调 |
| **多机多卡** | 分布式微调（DDP/DeepSpeed） |
| **自动量化** | 训练后自动 GPTQ/AWQ 量化 |

---

## 3. 快速使用

```bash
# 安装
pip install ms-swift

# LoRA 微调 Qwen3
swift sft \
  --model Qwen/Qwen3-8B \
  --dataset alpaca-zh \
  --lora_rank 8 \
  --output_dir output

# 推理验证
swift infer \
  --model output/checkpoint-xxx \
  --dataset alpaca-zh
```

---

## 4. AI Stack 训练工具链对比

| 工具 | 定位 | 适用场景 |
|------|------|----------|
| **SWIFT** | 微调框架 ← 本文 | LoRA/全参/DPO 微调 |
| **torchrun** | 分布式启动器 | PyTorch 原生分布式 |
| **accelerate** | 分布式抽象层 | 多卡/多机训练 |
| **DeepSpeed** | 分布式引擎 | ZeRO 优化大规模训练 |
| **Megatron-LM** | 预训练框架 | 百亿级模型预训练 |

---

## 5. 与其他微调框架对比

| 维度 | SWIFT | LLaMA-Factory | transformers | Axolotl |
|------|-------|-------------|-------------|---------|
| **来源** | ModelScope | 社区 | HuggingFace | 社区 |
| **模型支持** | 100+ | 100+ | 通用 | 50+ |
| **界面** | CLI + Web UI | Web UI | Python API | CLI |
| **DPO/RLHF** | ✅ | ✅ | 需手写 | ✅ |
| **中文优化** | ✅ 优秀 | ✅ 优秀 | 一般 | 一般 |
| **中文文档** | ✅ 完整 | ✅ 完整 | 英文 | 英文 |

---

## Related

- [[概念/lora-peft]] — LoRA/PEFT 参数高效微调
- [[概念/modelscope]] — ModelScope 魔搭社区
- [[概念/torchrun]] — torchrun 分布式启动器
- [[概念/accelerate]] — HF Accelerate 分布式训练
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 SWIFT 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **SWIFT** | ModelScope 微调框架 | GA |
| **LoRA/QLoRA** | 参数高效微调 | GA |
| **多模型支持** | 支持多种模型 | GA |
| **分布式训练** | 分布式微调 | GA |
| **Web UI** | 可视化微调 | GA |

## 生产最佳实践

1. **ModelScope 微调**：ModelScope 模型用 SWIFT 微调
2. **LoRA 微调**：大模型微调用 LoRA
3. **分布式训练**：大模型用分布式训练
4. **Web UI**：快速实验用 Web UI
5. **与 LLaMA-Factory 对比**：根据需求选择微调框架
