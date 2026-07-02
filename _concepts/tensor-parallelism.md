---
title: "Tensor Parallelism"
category: -concepts
tags: ["distributed-training", "inference", "llm", "gpu", "alibaba-cloud"]
summary: "Tensor Parallelism（张量并行）是将单个张量计算拆分到多张 GPU 上并行执行的分布式策略，常用于大模型训练和推理。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "张量并行"
relationships:
  - target: "_concepts/distributed-training"
    type: related_to
  - target: "_concepts/model-parallelism"
    type: is_a
  - target: "_concepts/vllm"
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

- [[_concepts/distributed-training|分布式训练]]
- [[_concepts/model-parallelism|Model Parallelism]]
- [[_concepts/pipeline-parallelism|Pipeline Parallelism]]
- [[_concepts/vllm|vLLM]]
- [[_concepts/megatron-lm|Megatron-LM]]
