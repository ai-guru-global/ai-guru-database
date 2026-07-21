---
title: "Megatron-LM"
category: -concepts
tags: ["megatron-lm", "nvidia", "distributed-training", "tensor-parallelism", "pipeline-parallelism", "llm", "training"]
relationships:
  - target: "概念/distributed-training"
    type: extends
  - target: "概念/deepspeed"
    type: related_to
  - target: "概念/fsdp"
    type: related_to
  - target: "概念/tensor-parallelism"
    type: implements
  - target: "概念/pipeline-parallelism"
    type: implements
sources:
  - 模型训练/Distributed_Training/Megatron_LM_Deep_Dive.md
summary: "Megatron-LM 是 NVIDIA 开源的大规模 Transformer 训练框架，以张量并行（TP）和流水线并行（PP）著称，广泛用于千亿参数 GPT/BERT/T5 模型的预训练。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
updated: 2026-07-21
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Megatron Lm"
  - "megatron lm"

---
# Megatron-LM

> NVIDIA 的「大模型训练并行神器」——用张量并行和流水线并行把 Transformer 扩展到千亿参数。

---

## 1. 一句话定义

**Megatron-LM** 是 NVIDIA 开源的大规模 Transformer 训练框架，核心贡献是**张量并行（Tensor Parallelism, TP）**和**流水线并行（Pipeline Parallelism, PP）**。它广泛用于 GPT、BERT、T5 等模型的千亿参数预训练，常与 DeepSpeed 结合使用。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **张量并行（TP）** | 把单个 layer 的矩阵计算切分到多 GPU |
| **流水线并行（PP）** | 把模型按层切分到多 GPU |
| **序列并行（SP）** | 在长序列场景减少激活值内存 |
| **上下文并行（CP）** | 进一步扩展长上下文训练 |
| **数据并行（DP）** | 与 ZeRO/FSDP 结合 |
| **3D 并行** | TP + PP + DP 组合 |
| **混合精度** | FP16/BF16/FP8 支持 |
| **MoE 训练** | 支持专家混合模型 |

---

## 3. 并行策略

```
数据并行（DP）：    同一模型复制到多 GPU，数据分片
张量并行（TP）：    单个 Linear 层切分到多 GPU
流水线并行（PP）：  模型按层切分到多 GPU
```

---

## 4. 典型场景

1. **千亿参数 GPT 预训练**：TP + PP + DP 组合。
2. **长上下文训练**：SP + CP 扩展序列长度。
3. **MoE 模型训练**：如 Mixtral 8x7B。
4. **与 DeepSpeed 结合**：DeepSpeed 做 ZeRO，Megatron 做 TP/PP。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **DeepSpeed** | Megatron 负责 TP/PP，DeepSpeed 负责 ZeRO/Offload |
| **FSDP** | PyTorch 原生数据并行方案 |
| **NeMo** | NVIDIA 基于 Megatron 的上层框架 |
| **Transformer Engine** | 提供 FP8 加速 |

---

## 6. 优势与局限

### 优势
- TP/PP 实现成熟，是大模型训练的行业标准。
- 与 NVIDIA 硬件和软件栈深度优化。
- 支持超长上下文和 MoE。

### 局限
- 代码耦合度高，定制难度大。
- 主要适配 NVIDIA GPU。
- 学习曲线陡峭。

---

## Related

- [[模型训练/Distributed_Training/Megatron_LM_Deep_Dive]] — Megatron-LM 深度解析
- [[概念/distributed-training]] — 分布式训练
- [[概念/deepspeed]] — DeepSpeed
- [[概念/fsdp]] — FSDP
- [[概念/tensor-parallelism]] — 张量并行
- [[概念/pipeline-parallelism]] — 流水线并行
- [[概念/dualpipe]] — DualPipe 双向流水线

---

## 2026 Megatron-LM 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **Megatron-Core** | 模块化重构、更易扩展 | GA |
| **FP8 训练** | H100/H200 原生支持 | GA |
| **MoE 支持** | 专家并行 + 负载均衡 | GA |
| **上下文并行** | 长序列训练 | GA |

## 生产最佳实践

1. **并行策略**：TP 节点内、PP 节点间、DP 扩展吞吐
2. **微批次**：增加微批次数降低 PP 气泡率
3. **混合精度**：BF16/FP8 训练 + FP32 主权重
4. **与 DeepSpeed 结合**：Megatron-DeepSpeed 用于超大规模训练
5. **监控指标**：关注 MFU、通信/计算比、显存峰值
