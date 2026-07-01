---
title: "FlashInfer 算子库 (FlashInfer Kernel Library)"
category: -concepts
tags: ["flashinfer", "inference-kernel", "attention", "paged-attention", "mlsys", "sglang"]
relationships:
  - target: "_concepts/flash-attention-kernels"
    type: related_to
  - target: "_concepts/paged-attention"
    type: related_to
  - target: "_concepts/speculative-decoding"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "FlashInfer 是面向 LLM Serving 的高性能注意力算子库，MLSys 2025 Best Paper。为 SGLang 提供底层 PagedAttention/FlashInfer 算子，支持 KV Cache 共享和推测解码。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: core
---

# FlashInfer 算子库

> **一句话理解**: FlashInfer 是 LLM 推理的"注意力算子引擎"——MLSys 2025 Best Paper，为 SGLang/vLLM 等框架提供底层高效注意力计算。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **项目** | FlashInfer |
| **来源** | 港大/CMU/SGLang 团队 |
| **荣誉** | MLSys 2025 Best Paper |
| **功能** | LLM Serving 注意力算子库 |
| **语言** | CUDA C++ + Python 绑定 |
| **GitHub** | github.com/flashinfer-ai/flashinfer |

---

## 2. 核心算子

| 算子 | 功能 | 性能 |
|------|------|------|
| **BatchDecode** | 批量解码注意力 | 高吞吐 |
| **BatchPrefill** | 批量预填充注意力 | 低延迟 |
| **Cascade Attention** | 级联注意力（前缀共享） | 减少重复计算 |
| **Paged KV Cache** | 分页式 KV 管理 | 显存高效 |
| **Speculative Decoding** | 推测解码验证 | 2-3× 加速 |
| **Shared Prefix** | 共享前缀注意力 | Multi-turn 优化 |

---

## 3. 在推理框架中的位置

```
LLM 推理引擎架构
│
├── 应用层
│   ├── SGLang ← 主要使用 FlashInfer
│   ├── vLLM ← 使用自研 PagedAttention
│   └── TensorRT-LLM
│
├── 算子层
│   ├── FlashInfer ← 本文
│   ├── FlashAttention (1/2/3)
│   ├── FlashMLA ← DeepSeek
│   └── Triton Kernels
│
└── 硬件层
    └── GPU Tensor Core (CUDA/ROCm)
```

---

## 4. 与同类算子库对比

| 维度 | FlashInfer | FlashAttention | FlashMLA |
|------|-----------|---------------|---------|
| **来源** | 港大/SGLang | Stanford | DeepSeek |
| **专注场景** | LLM Serving | 通用注意力 | MLA 注意力 |
| **KV Cache** | Paged 原生支持 | 不支持 | 支持 |
| **推测解码** | ✅ | ❌ | ❌ |
| **前缀共享** | ✅ Cascade | ❌ | ❌ |
| **框架集成** | SGLang 原生 | 广泛 | vLLM |
| **MLSys Best Paper** | 2025 | 2023 | - |

---

## 5. Cascade Attention 原理

多轮对话中，多个请求共享 System Prompt 前缀：

```
传统方式：每个请求独立计算前缀注意力
Request 1: [System][User1][Reply1]
Request 2: [System][User2][Reply2] → 重复计算 System 部分

Cascade Attention：
├── 共享前缀注意力只计算一次
├── 增量部分独立计算
└── 合并结果
→ 多轮对话场景节省 40-60% 计算量
```

---

## Related

- [[_concepts/flash-attention-kernels]] — FlashAttention 算子系列
- [[_concepts/paged-attention]] — PagedAttention 虚拟内存式 KV 管理
- [[_concepts/speculative-decoding]] — 投机解码
- [[_concepts/continuous-batching]] — Continuous Batching
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
