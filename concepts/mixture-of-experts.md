---
title: "混合专家模型 (Mixture of Experts, MoE)"
category: concept
tags: ["moe", "mixture-of-experts", "sparse-activation", "routing", "scaling", "deepseek", "qwen"]
relationships:
  - target: "concepts/llm-architectures"
    type: builds_on
  - target: "concepts/transformer-architecture"
    type: builds_on
  - target: "concepts/distributed-parallelism"
    type: related_to
  - target: "09_Deployment_Inference/Inference_Performance/MoE_Inference_Optimization"
    type: optimized_by
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
  - 04_NLP_LLMs/LLM_Architectures
  - 09_Deployment_Inference/Inference_Performance/MoE_Inference_Optimization.md
summary: "MoE 将 FFN 替换为多个专家网络，每次仅激活 Top-K 个专家，实现参数规模↑ 但计算量→不变。2026年主流大模型（DeepSeek-V3/Qwen3.5/Kimi-K2）均采用 MoE 架构。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.92
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-04
---

# 混合专家模型 (Mixture of Experts, MoE)

> 参数规模爆炸但计算成本不变的秘密武器——用稀疏激活实现「大象的身材，猎豹的速度」。

---

## 1. 定义

**混合专家模型**（Mixture of Experts, MoE）将 Transformer 中每个 Block 的 FFN 层替换为**多个专家网络**（Experts），通过路由器（Router/Gate）为每个 token 选择**少量激活的专家**（Top-K），实现：

- **总参数量** = Dense 模型的 5-10×
- **每 token 激活参数** ≈ Dense 模型
- **推理 FLOPs** ≈ Dense 模型

---

## 2. 架构原理

```
标准 Transformer Block:
    x → Multi-Head Attention → FFN → output

MoE Transformer Block:
    x → Multi-Head Attention → MoE Layer → output
                              │
                    ┌─────────┴─────────┐
                    │   Router (Gate)    │
                    │  G(x) → Top-K 权重  │
                    └─────────┬─────────┘
                              │
              ┌───────┬───────┼───────┬───────┐
              │       │       │       │       │
          Expert_1 Expert_2 ... Expert_K ... Expert_N
          (激活)  (激活)           (激活)   (空闲)
```

**路由计算**：

\[
G(x) = \text{Softmax}(W_g \cdot x) \in \mathbb{R}^N
\]

\[
y = \sum_{i \in \text{TopK}(G(x))} G(x)_i \cdot E_i(x)
\]

---

## 3. Dense vs MoE 对比

| 维度 | Dense 模型 | MoE 模型 |
|------|-----------|----------|
| **总参数** | N | N × E（E 为专家数） |
| **激活参数** | N | N × K/E（K 为 Top-K） |
| **推理 FLOPs** | ~2 × N × tokens | ~2 × (激活参数) × tokens |
| **显存占用** | 与参数量正比 | 需加载全部专家权重 |
| **训练效率** | 每 token 全部参数更新 | 每 token 仅更新 K 个专家 |
| **通信开销** | 无 | 需要 Expert Parallelism 通信 |

---

## 4. 路由策略演进

| 策略 | 论文 | 特点 |
|------|------|------|
| **Top-K Gate** | Shazeer 2017 | 经典路由器，选 Top-K 专家 |
| **Expert Choice** | Google 2022 | 专家选 token，解决负载不均衡 |
| **Token Choice** | 标准 MoE | token 选专家，需负载均衡损失 |
| **Shared Expert** | DeepSeek-V2 | 共享专家（始终激活）+ 路由专家 |
| **Soft MoE** | Google 2023 | 可微分的软分配，避免离散路由 |
| **Sparse Upcycling** | 将 Dense → MoE | 复用已训练 Dense 权重 |

### DeepSeek MoE 特色

DeepSeek-V2/V3 采用 **Shared Expert + Top-K Routing**：

| 组件 | 数量 | 说明 |
|------|------|------|
| **Shared Expert** | 1 | 始终激活，捕获通用知识 |
| **Routed Experts** | 256 | Top-8 激活 |
| **总参数/激活** | 671B/37B | 仅 5.5% 参数激活 |
| **辅助损失** | 低 | 负载均衡 + 路由器 z-loss |

---

## 5. 2026 年主流 MoE 模型

| 模型 | 总参数 | 激活参数 | 专家数 | Top-K | 上下文 |
|------|--------|----------|--------|-------|--------|
| **DeepSeek-V3.2** | 671B | 37B | 256 | 8 | 256K |
| **Kimi-K2** | ~1T | 32B | - | - | 256K |
| **Llama 4 Maverick** | 400B | 17B | 128 | - | 10M |
| **Qwen3.5-397B-A17B** | 397B | 17B | - | - | 256K |
| **Qwen3-Coder-480B-A35B** | 480B | 35B | - | - | 256K |
| **Mixtral 8x22B** | 176B | 44B | 8 | 2 | 64K |

---

## 6. 训练挑战

| 挑战 | 说明 | 解决方案 |
|------|------|----------|
| **负载不均衡** | 少数专家被过度选择 | 辅助损失 (auxiliary loss)、Expert Choice |
| **专家坍缩** | 多个专家学习相似表示 | 多样性正则、z-loss |
| **通信瓶颈** | All-to-All 通信限制扩展 | Expert Parallelism、限制专家数 |
| **训练不稳定** | 路由离散性导致梯度问题 | 温度退火、软路由 |
| **显存压力** | 所有专家需常驻显存 | Expert Offloading、分组调度 |

---

## 7. 推理优化

| 优化 | 说明 |
|------|------|
| **Expert Parallelism** | 不同专家分布在不同 GPU |
| **Expert Batching** | 同专家的多 token 批量推理 |
| **Expert Offloading** | 不活跃专家卸载到 CPU/SSD |
| **Speculative MoE** | 用小 MoE 做 draft，大 MoE verify |
| **Expert Pruning** | 剪枝不活跃专家（微调后） |

---

## 8. MoE 在 AI Stack 中的相关性

AI Stack 支持的模型中，多个采用 MoE 架构：

| 模型 | MoE 配置 | AI Stack 支持 |
|------|----------|---------------|
| Qwen3.5-397B-A17B | 397B/17B | BF16 / INT8 |
| Qwen3-Coder-480B-A35B | 480B/35B | BF16 / INT8 |
| DeepSeek-V3.2 | 671B/37B | BF16 / INT8 |
| Qwen3.6-35B-A3B | 35B/3B | 轻量部署 |

> **关键点**：MoE 模型的显存占用由**总参数**决定（需加载所有专家），但推理速度由**激活参数**决定。AI Stack 16 卡版 1.5+ TB 显存可容纳 DeepSeek-V3.2 满血推理。

---

## 9. 局限与开放问题

1. **显存 ≠ 计算**：MoE 推理速度接近 Dense（激活参数），但显存需求接近 Dense（总参数）
2. **Fine-tuning 困难**：微调可能打破路由平衡，推荐 LoRA on shared expert
3. **可解释性**：难以确定哪个专家学到了什么知识
4. **量化挑战**：不同专家的权重量化敏感度不同，需分层量化

---

## Related

- [[04_NLP_LLMs/LLM_Architectures]] — LLM 架构全景
- [[concepts/llm-architectures]] — LLM 架构
- [[concepts/transformer-architecture]] — Transformer 架构
- [[concepts/distributed-parallelism]] — 分布式并行策略（Expert Parallelism）
- [[09_Deployment_Inference/Inference_Performance/MoE_Inference_Optimization|MoE 推理优化]]
