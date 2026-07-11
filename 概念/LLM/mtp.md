---
title: "Multi-Token Prediction (MTP) 多 Token 预测"
category: -concepts
tags: ["mtp", "multi-token-prediction", "speculative-decoding", "inference-optimization", "vllm", "deepseek"]
relationships:
  - target: "概念/speculative-decoding"
    type: related_to
  - target: "概念/deepseek-models"
    type: related_to
  - target: "概念/flash-attention-kernels"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "MTP (Multi-Token Prediction) 是 DeepSeek-V3 引入的推理加速技术——模型在训练时预测多个未来 Token，推理时用 Draft-Verify 机制一次性生成多个 Token，加速 2-3 倍。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
---

# Multi-Token Prediction (MTP)

> **一句话理解**: MTP 是"一次预测多个未来 Token"——DeepSeek-V3 首创，训练时教会模型预测下 N 个 Token，推理时用投机解码加速 2-3 倍。

---

## 1. 核心思想

传统自回归生成：每次只预测 1 个 Token

```
标准自回归（1 Token/步）：
Step 1: [今天] → 预测 "天"
Step 2: [今天天] → 预测 "气"
Step 3: [今天天气] → 预测 "很"
Step 4: [今天天气很] → 预测 "好"
→ 4 步生成 "今天天气很好"
```

MTP：每次预测 N 个未来 Token

```
MTP 多 Token 预测（N=4）：
Step 1: [今天] → 同时预测 "天" "气" "很" "好"
→ 1 步生成 "今天天气很好"
→ 验证全部通过 → 加速 4×
```

---

## 2. MTP 在 DeepSeek-V3 中的实现

| 维度 | 说明 |
|------|------|
| **MTP 模块** | 模型中独立的 MTP 预测头 |
| **预测深度** | 默认预测未来 1-4 个 Token |
| **训练方式** | 主 Loss + MTP Loss 联合训练 |
| **推理方式** | Draft-Verify（投机解码） |
| **加速比** | 推理 2-3× 加速 |

### DeepSeek-V3 MTP 架构

```
DeepSeek-V3 MTP 架构
│
├── 主模型（61 层 MoE）
│   ├── 标准自回归输出
│   └── 隐藏状态 → MTP 模块输入
│
├── MTP 模块（共享参数）
│   ├── MTP Layer 1 → 预测 Token[t+1]
│   ├── MTP Layer 2 → 预测 Token[t+2]
│   ├── MTP Layer 3 → 预测 Token[t+3]
│   └── MTP Layer N → 预测 Token[t+N]
│
└── 训练 Loss
    ├── L_main（主模型 Loss）
    └── L_mtp = Σ L_mtp_i（MTP Loss）
```

---

## 3. MTP vs 传统投机解码

| 维度 | 传统投机解码 | MTP (DeepSeek) |
|------|-----------|----------------|
| **Draft 模型** | 独立小模型 | 模型自带 MTP 头 |
| **额外参数** | 需加载独立 Draft 模型 | 共享主模型参数 |
| **Draft 质量** | 中（小模型） | 高（主模型特征） |
| **接受率** | 60-80% | **80-95%** |
| **加速比** | 1.5-2× | **2-3×** |
| **实现复杂度** | 需两个模型 | 单模型内置 |

---

## 4. 在推理框架中的支持

| 框架 | MTP 支持 | 说明 |
|------|---------|------|
| **vLLM** | ✅ 实验性 | 通过 MTP spec decoding 支持 |
| **SGLang** | ✅ | 原生支持 |
| **TensorRT-LLM** | ⚠️ | 需手动配置 |
| **Ollama** | ❌ | 不支持 |

---

## 5. 加速效果

| 模型 | 方法 | 加速比 | 接受率 |
|------|------|--------|--------|
| DeepSeek-V3 | MTP (N=1) | 1.5× | ~95% |
| DeepSeek-V3 | MTP (N=2) | 2.0× | ~90% |
| DeepSeek-V3 | MTP (N=4) | 2.5-3× | ~80% |
| LLaMA-70B | EAGLE-2 | 2.5× | ~85% |
| 通用模型 | 标准投机解码 | 1.5-2× | 60-80% |

---

## Related

- [[概念/speculative-decoding]] — 投机解码（Draft-Verify）
- [[概念/deepseek-models]] — DeepSeek 模型系列
- [[概念/flash-attention-kernels]] — FlashAttention 算子
- [[概念/prefill-decode]] — Prefill/Decode 推理阶段
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
