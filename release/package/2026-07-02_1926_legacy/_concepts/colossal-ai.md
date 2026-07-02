---
title: "Colossal-AI"
category: -concepts
tags: ["colossal-ai", "distributed-training", "parallelism", "llm", "training", "inference", "optimization", "hpc"]
relationships:
  - target: "_concepts/distributed-training"
    type: extends
  - target: "_concepts/deepspeed"
    type: related_to
  - target: "_concepts/megatron-lm"
    type: related_to
  - target: "_concepts/fsdp"
    type: related_to
sources:
  - 07_Model_Training/Distributed_Training/Colossal_AI_Deep_Dive.md
summary: "Colossal-AI 是潞晨科技开源的统一分布式 AI 系统，整合数据并行、张量并行、流水线并行、序列并行和 ZeRO 等技术，目标是降低大模型训练、微调和推理成本。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Colossal Ai"
  - "colossal ai"

---
# Colossal-AI

> 国产的「大模型训练一体化系统」——把多种并行和优化技术打包，降低训练和推理成本。

---

## 1. 一句话定义

**Colossal-AI** 是潞晨科技（HPC-AI Tech）开源的**统一分布式 AI 系统**，整合了数据并行、张量并行、流水线并行、序列并行、ZeRO、Offload 和推理优化等技术。它提供与 PyTorch 兼容的 API，目标是降低大模型训练、微调和推理的硬件成本。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **多维并行** | 数据/张量/流水线/序列并行自由组合 |
| **ZeRO 优化** | 类似 DeepSpeed 的显存优化 |
| **Gemini 内存管理** | 统一 CPU/GPU/NVMe 内存管理 |
| **Chunk-based 通信** | 提升通信效率 |
| **推理优化** | 支持 Continuous Batching、量化 |
| **大模型示例** | 提供 LLaMA、GPT、OPT 等完整训练脚本 |
| **AI 大模型云平台** | 提供云上训练服务 |

---

## 3. 典型场景

1. **低成本大模型预训练**：用更少 GPU 训练大模型。
2. **长文本训练**：序列并行扩展上下文长度。
3. **国产算力适配**：支持昇腾等国产芯片。
4. **大模型推理服务**：低成本部署开源模型。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **DeepSpeed** | 功能类似，Colossal-AI 更强调统一系统 |
| **Megatron-LM** | Colossal-AI 也支持 TP/PP |
| **FSDP** | Colossal-AI 提供兼容接口 |
| **PyTorch** | 基于 PyTorch 构建 |

---

## 5. 优势与局限

### 优势
- 统一封装多种并行技术，降低使用门槛。
- 国产团队维护，中文支持好。
- 长文本和低成本训练有特色。

### 局限
- 生态成熟度不如 DeepSpeed/Megatron。
- 部分高级功能文档和社区资源较少。

---

## Related

- [[07_Model_Training/Distributed_Training/Colossal_AI_Deep_Dive]] — Colossal-AI 深度解析
- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/deepspeed]] — DeepSpeed
- [[_concepts/megatron-lm]] — Megatron-LM
- [[_concepts/fsdp]] — FSDP
