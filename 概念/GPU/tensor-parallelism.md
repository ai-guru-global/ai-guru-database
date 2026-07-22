---
title: "Tensor Parallelism"
category: -concepts
tags: ["distributed-training", "inference", "llm", "gpu", "alibaba-cloud"]
summary: "Tensor Parallelism（张量并行）是将单个张量计算拆分到多张 GPU 上并行执行的分布式策略，常用于大模型训练和推理。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "张量并行"
relationships:
  - target: "概念/distributed-training"
    type: related_to
  - target: "概念/model-parallelism"
    type: is_a
  - target: "概念/vllm"
    type: used_by
sources: []
---

# Tensor Parallelism

> **一句话理解**: 张量并行就是把模型的一层计算拆开，让多张 GPU 同时算，这样单张 GPU 装不下的模型也能跑。

## 核心要点

- **按列/行拆分**: 把矩阵乘法的权重按列或按行切分到不同 GPU。
- **通信开销**: 每层需要 AllGather / ReduceScatter 同步。
- **节点内优先**: 通常在同一节点内使用 NVLink，通信更快。
- **框架支持**: Megatron-LM、DeepSpeed、PyTorch Tensor Parallel、vLLM、SGLang。
- **与数据并行结合**: 常与 Data Parallelism 组成 3D 并行。

## 使用示例

```bash
# vLLM 张量并行
python -m vllm.entrypoints.openai.api_server \
  --model /models/Qwen2-7B-Instruct \
  --tensor-parallel-size 2
```

## 与 Pipeline Parallelism 对比

| 并行方式 | 拆分对象 | 通信量 | 典型场景 |
|----------|---------|--------|---------|
| **Tensor Parallelism** | 层内张量 | 大 | 单节点多卡 |
| **Pipeline Parallelism** | 层间 | 小 | 跨节点大模型 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，大模型推理常使用 vLLM/SGLang 的 `--tensor-parallel-size` 参数在单节点多 GPU 上部署。工单中「单卡显存不足」时，张量并行是首选扩展方案。

## Related

- [[概念/distributed-training|分布式训练]]
- [[概念/model-parallelism|Model Parallelism]]
- [[概念/pipeline-parallelism|Pipeline Parallelism]]
- [[概念/vllm|vLLM]]
- [[概念/megatron-lm|Megatron-LM]]

---

## 2026 Tensor Parallelism 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Megatron-LM TP** | NVIDIA 官方张量并行实现 | GA |
| **vLLM TP** | vLLM 推理引擎张量并行 | GA |
| **DeepSpeed TP** | DeepSpeed 张量并行支持 | GA |
| **FSDP2 TP** | PyTorch FSDP2 张量并行 | GA |
| **TP + PP 组合** | 张量并行 + 流水线并行组合 | GA |

## 生产最佳实践

1. **层内切分**：TP 适合切分 Attention/FFN 等大层
2. **NVLink 必用**：TP 通信密集，必须用 NVLink
3. **TP 度数选择**：TP 度数通常为 2/4/8，与 GPU 数匹配
4. **与 PP 组合**：大模型用 TP + PP 组合策略
5. **推理加速**：vLLM 推理用 TP 加速大模型

## 2026 张量并行生态

| 框架 | 说明 | 状态 |
|------|------|------|
| **Megatron-LM** | NVIDIA TP 实现 | GA |
| **DeepSpeed** | 微软 TP 实现 | GA |
| **vLLM** | 推理 TP | GA |
| **TensorRT-LLM** | NVIDIA 推理 | GA |

## 延伸阅读

- [[概念/GPU/model-parallelism|Model Parallelism]] — 模型并行
- [[概念/GPU/pipeline-parallelism|Pipeline Parallelism]] — 流水线并行
- [[概念/GPU/nccl|NCCL]] — 多 GPU 通信

> ℹ️ 张量并行是将单个层的计算分布到多个 GPU 的技术，用于加速大模型训练和推理。

## TP 切分方式

| 切分方式 | 说明 | 适用层 |
|------|------|------|
| **列切分** | 按列切分权重 | Linear |
| **行切分** | 按行切分权重 | Linear |
| **头切分** | 按注意力头切分 | Attention |

## TP 通信模式

```
TP=4 示例:
GPU 0: W[:, 0:H/4]  → AllReduce → 完整输出
GPU 1: W[:, H/4:H/2] → AllReduce → 完整输出
GPU 2: W[:, H/2:3H/4] → AllReduce → 完整输出
GPU 3: W[:, 3H/4:H] → AllReduce → 完整输出
```

## 生产最佳实践

1. **TP 度数**：TP 度数通常为 2/4/8
2. **NVLink 优先**：TP 用 NVLink 互联
3. **与 PP 组合**：大模型用 TP + PP 组合
4. **推理加速**：vLLM 推理用 TP 加速
5. **通信优化**：用 NCCL 优化通信
6. **负载均衡**：确保各 GPU 负载均衡

## 检查清单

- [ ] TP 度数已选择
- [ ] NVLink 拓扑已确认
- [ ] 通信优化已配置
- [ ] 负载均衡已验证

## TP 配置示例

```python
# Megatron-LM TP 配置
python pretrain_gpt.py \
    --tensor-model-parallel-size 8 \
    --num-layers 96 \
    --hidden-size 12288 \
    --num-attention-heads 96
```

## TP vs PP

| 维度 | TP | PP |
|------|------|------|
| **切分方式** | 层内切分 | 层间切分 |
| **通信频率** | 每层 | 每阶段 |
| **通信量** | 大 | 小 |
| **适用互联** | NVLink | InfiniBand |
| **气泡时间** | 无 | 有 |

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 通信开销大 | 用 NVLink 互联 |
| 负载不均衡 | 调整切分方式 |
| 扩展性差 | 增加 TP 度数 |
| 显存不足 | 增加 TP 度数 |

## 生产最佳实践

1. **节点内 TP**：TP 度数不超过节点内 GPU 数（通常 4/8），避免跨节点通信
2. **NVLink 必用**：TP 通信量极大，必须使用 NVLink/NVSwitch 互联
3. **切分均衡**：确保每个 GPU 分到的参数量和计算量接近
4. **与 PP 组合**：大模型用 TP×PP 组合，TP 在节点内，PP 跨节点
5. **通信重叠**：利用异步 AllReduce 掩盖通信延迟

## 延伸阅读

- [[概念/GPU/pipeline-parallelism|流水线并行]] — PP 层间切分
- [[概念/GPU/model-parallelism|模型并行]] — 并行策略总览
- [[概念/GPU/expert-parallelism|专家并行]] — MoE 专用并行
- [[概念/GPU/nccl|NCCL]] — AllReduce 通信实现
- [[概念/GPU/nvlink|NVLink]] — TP 通信的硬件基础

> ℹ️ 张量并行是大模型节点内并行的核心，2026年 Megatron-LM 支持 TP 度数达 8（NVSwitch 全互联），配合 Sequence Parallelism 进一步降低激活值显存。

## 2026 TP 生态现状

| 框架 | TP 支持 | 最大度数 | 说明 |
|------|------|------|------|
| Megatron-LM | ✅ 成熟 | 8 | 原生 TP + SP |
| DeepSpeed | ✅ 成熟 | 8 | 配合 ZeRO 使用 |
| FSDP2 | ✅ 成熟 | 8 | PyTorch 原生 |
| vLLM | ✅ 成熟 | 8 | 推理 TP |
| TensorRT-LLM | ✅ 成熟 | 8 | 推理优化 |
| JAX/XLA | ✅ 成熟 | 自动 | 自动分片 |

## 检查清单

- [ ] TP 度数与节点内 GPU 数匹配
- [ ] NVLink/NVSwitch 已启用
- [ ] 切分均衡已验证
- [ ] 通信与计算已重叠
- [ ] Sequence Parallelism 已启用
- [ ] 显存分配已均衡
- [ ] 故障恢复机制已配置

> ℹ️ TP 通信量极大，必须使用 NVLink/NVSwitch 互联，跨节点 TP 会严重影响性能。
