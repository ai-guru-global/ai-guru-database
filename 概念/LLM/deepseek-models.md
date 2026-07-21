---
title: "DeepSeek 模型系列 (DeepSeek Model Family)"
category: -concepts
tags: ["deepseek", "deepseek-r1", "deepseek-v3", "deepseek-v4", "moe", "mla", "mtp", "open-source-llm"]
relationships:
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/multi-head-latent-attention"
    type: contains
  - target: "概念/speculative-decoding"
    type: contains
  - target: "概念/mixture-of-experts"
    type: related_to
  - target: "概念/knowledge-distillation"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "DeepSeek（深度求索）是中国 AI 公司推出的开源大模型系列，以 MLA 注意力架构、MTP 投机解码、MoE 稀疏激活三大创新著称，AI Stack 预置 R1/V3/V4 全系列模型。"
provenance:
  extracted: 0.60
  inferred: 0.30
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-12
updated: 2026-07-21
---

# DeepSeek 模型系列

> **一句话理解**: DeepSeek 是 2024-2026 年最具影响力的开源大模型系列——用 MLA 压缩 KV Cache、用 MoE 稀疏激活、用 MTP 加速推理，性能对标 GPT-4 且完全开源。

---

## 1. 公司背景

| 维度 | 信息 |
|------|------|
| **公司名** | 深度求索 (DeepSeek) |
| **投资方** | 幻方量化 (High-Flyer) |
| **成立时间** | 2023 年 |
| **核心定位** | 开源 AGI 研究 |
| **代表成果** | DeepSeek-V2/V3/V4/R1 系列 |
| **开源许可** | MIT License（大部分模型） |

---

## 2. 模型系列全景

```
DeepSeek 模型家族
│
├── 推理旗舰
│   ├── DeepSeek-R1-0528 — 最新推理模型（BF16/INT8）
│   ├── DeepSeek-R1-Distill-Qwen-32B — R1 蒸馏小模型
│   └── DeepSeek-R1-Distill-Llama-70B — R1 蒸馏大模型
│
├── 通用基座
│   ├── DeepSeek-V4-Flash-INT8 — V4 Flash 轻量版
│   ├── DeepSeek-V3.2 — 最新 V3 版本（BF16/INT8）
│   ├── DeepSeek-V3.1 — V3.1 版本
│   └── DeepSeek-V3-0324 — V3 基础版（BF16/INT8）
│
├── 蒸馏系列
│   ├── R1-Distill-Qwen-32B — 基于 Qwen 32B
│   ├── R1-Distill-Qwen-14B — 基于 Qwen 14B
│   ├── R1-Distill-Qwen-7B — 基于 Qwen 7B
│   └── R1-Distill-Llama-8B — 基于 Llama 8B
│
└── 代码专用
    ├── DeepSeek-Coder-V2 — 代码生成与理解
    └── DeepSeek-Coder-33B — 大参数代码模型
```

---

## 3. 三大核心创新

### 3.1 MLA：Multi-head Latent Attention

KV Cache 显存降低 **7-28×**，质量退化 <0.2 pt：

| 方案 | 每 token 每层 | 128K 总 KV Cache | 压缩比 |
|------|-------------|-----------------|--------|
| 标准 MHA | 28.7 KB | 213.5 GB | 1× 基线 |
| MLA (latent) | 1.0 KB | 7.6 GB | **28×** |
| MLA + FP8 | 576 B | 3.8 GB | **56×** |

> 详见 [[概念/multi-head-latent-attention]]

### 3.2 MoE：Mixture of Experts

DeepSeek-V3 采用 256 个专家、每次激活 8 个：

| 参数 | 数值 |
|------|------|
| 总参数量 | 671B |
| 每次激活 | 37B（5.5%） |
| 专家总数 | 256 + 1 (shared) |
| 每次路由 | Top-8 |

> 详见 [[概念/mixture-of-experts]]

### 3.3 MTP：Multi-Token Prediction

训练时预测 next + next-next token，推理时作为投机解码：

```
标准 NTP：  h_t → predict(t+1)             # 1 信号/token
DeepSeek MTP：h_t → predict(t+1) + predict(t+2)  # 2 信号/token
```

- 接受率 >85%，每步输出 1+k 个 token
- 吞吐提升 **2-3×**，不改变输出分布

> 详见 [[概念/speculative-decoding]]

---

## 4. AI Stack 预置模型

AI Stack V2.14.0 预置以下 DeepSeek 模型：

| 模型 | 精度 | 说明 |
|------|------|------|
| **DeepSeek-R1-0528-BF16** | BF16 | 最新 R1 满血版 |
| **DeepSeek-R1-0528-INT8** | INT8 | R1 量化版，显存减半 |
| **DeepSeek-V3.2-BF16** | BF16 | 最新 V3 满血版 |
| **DeepSeek-V3.2-INT8** | INT8 | V3.2 量化版 |
| **DeepSeek-V3.1-INT8** | INT8 | V3.1 量化版 |
| **DeepSeek-V3-0324-BF16** | BF16 | V3 基础满血版 |
| **DeepSeek-V3-0324-INT8** | INT8 | V3 基础量化版 |
| **DeepSeek-V4-Flash-INT8** | INT8 | V4 Flash 轻量版 |
| **DeepSeek-R1-Distill-Qwen-32B** | — | R1 蒸馏 32B 小模型 |

### 部署建议

| 场景 | 推荐模型 | 推荐精度 |
|------|----------|----------|
| 精度优先 | R1-0528 或 V3.2 | BF16 |
| 均衡推荐 | R1-0528 或 V3.2 | INT8 |
| 轻量部署 | R1-Distill-Qwen-32B | BF16 |
| 极致性价比 | V4-Flash | INT8 |

---

## 5. 版本演进时间线

| 时间 | 版本 | 核心突破 |
|------|------|----------|
| 2024.05 | DeepSeek-V2 | MLA 首次提出 |
| 2024.12 | DeepSeek-V3 | MoE + MTP + FP8 训练 |
| 2025.01 | DeepSeek-R1 | 强化学习推理模型 |
| 2025.03 | DeepSeek-V3-0324 | V3 更新版 |
| 2025.05 | DeepSeek-R1-0528 | R1 最新版本 |
| 2025.xx | DeepSeek-V3.1 | V3.1 迭代 |
| 2025.xx | DeepSeek-V3.2 | V3.2 迭代 |
| 2025.xx | DeepSeek-V4-Flash | V4 Flash 轻量版 |

---

## 6. 与竞品对比

| 维度 | DeepSeek-V3 | GPT-4o | Llama 3.1-405B | Qwen3-235B |
|------|-------------|--------|----------------|------------|
| **架构** | MoE 256专家 | MoE（未公开） | Dense | MoE |
| **注意力** | MLA | MHA/GQA | GQA | GQA |
| **总参数** | 671B | 未知 | 405B | 235B |
| **激活参数** | 37B | 未知 | 405B | 22B |
| **开源** | MIT | 闭源 | Llama License | Apache 2.0 |
| **上下文** | 128K | 128K | 128K | 128K |
| **训练成本** | ~$5.6M | ~$100M+ | ~$100M+ | 未知 |

---

## 7. 开源生态影响

| 影响领域 | 具体贡献 |
|----------|----------|
| **FlashMLA** | DeepSeek 开源 MLA 注意力算子库 |
| **DeepGEMM** | FP8 GEMM 算子库 |
| **DualPipe** | 双向流水线并行调度 |
| **3FS** | 分布式文件系统 |
| **训练方法论** | 论文公开 FP8 训练、MoE 路由、MTP 等细节 |

---

## Related

- [[概念/multi-head-latent-attention]] — MLA 注意力架构
- [[概念/speculative-decoding]] — 投机解码 / MTP
- [[概念/mixture-of-experts]] — MoE 混合专家
- [[概念/knowledge-distillation]] — 知识蒸馏
- [[概念/llm-architectures]] — LLM 架构
- [[概念/flash-attention-kernels]] — FlashMLA 算子
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
- [[治理/modern-ai-training-stack|现代 AI 训练栈]] — 从预训练到推理扩展的统一视 角

---

## 2026 DeepSeek 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **DeepSeek-V3** | MoE + MLA，671B 参数，激活 37B | GA |
| **DeepSeek-R1** | RL 驱动推理模型，开源可复现 | GA |
| **DeepSeek-V4** | 下一代模型，性能进一步提升 | 预览 |
| **MLA 注意力** | 低秩 KV 压缩，KV Cache 减少 7-28x | GA |
| **MTP 投机解码** | 多 Token 预测，推理加速 2x | GA |

## 生产最佳实践

1. **开源优势**：DeepSeek 完全开源，可本地部署，数据隐私有保障
2. **MLA 必用**：部署 DeepSeek 必须启用 MLA，KV Cache 减少 7-28x
3. **MoE 降本**：MoE 架构推理成本低，适合高并发场景
4. **推理模型**：数学/代码/逻辑用 DeepSeek-R1
5. **与 GPT 对比**：生产前对比 DeepSeek 与 GPT 的效果和成本
