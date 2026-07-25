---
title: "GPU OOM"
category: -concepts
tags: ["gpu", "cuda", "oom", "training", "inference", "troubleshooting", "alibaba-cloud"]
summary: "GPU OOM 指 GPU 显存不足，可分为容器 cgroup OOM、CUDA 显存分配失败、host 内存不足、GPU 虚拟化超卖等类型，是 AI 训练/推理最常见故障之一。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "CUDA OOM"
  - "GPU Out of Memory"
relationships:
  - target: "概念/gpu"
    type: related_to
  - target: "概念/gradient-checkpointing"
    type: mitigated_by
  - target: "概念/deepspeed"
    type: mitigated_by
sources: []
---

# GPU OOM

> **一句话理解**: GPU OOM 就是 GPU 显存「不够用」了，可能发生在框架层（CUDA 分配失败）、容器层（cgroup limit）或虚拟化层（HAMi 超卖）。

## 核心要点

- **CUDA OOM**: 框架请求显存超过 GPU 剩余显存，报 `CUDA out of memory`。
- **Container OOMKilled**: K8s cgroup memory limit 被突破，容器被 kill。
- **Host OOM**: 节点物理内存不足，系统 OOM killer 介入。
- **vGPU Oversell**: HAMi 等虚拟化层超卖显存，实际物理显存不足。
- **常见诱因**: batch size 过大、序列过长、模型过大、KV Cache 过大、并发太高。

## 诊断命令

```bash
# 查看显存使用
nvidia-smi
nvidia-smi dmon -s u

# 查看 Pod 状态
kubectl describe pod <pod> -n <ns>

# 查看训练日志
kubectl logs <pod> -n <ns> --previous | grep -i "out of memory"
```

## 缓解措施

| 措施 | 效果 |
|------|------|
| 减小 batch size | 直接降低显存 |
| 缩短序列长度 | 降低激活值和 KV Cache |
| Gradient checkpointing | 以时间换空间 |
| DeepSpeed ZeRO-2/3 / FSDP | 多卡分片 |
| 量化训练/推理 | 降低权重显存 |
| 增加 GPU 数量/显存 | 资源扩容 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，GPU OOM 常见于 PAI-DLC 训练任务和 AI Stack 一体机推理服务。排查时需要同时看 PAI 平台日志、K8s Pod 事件和节点 `nvidia-smi`。

## Related

- [[概念/gradient-checkpointing|Gradient Checkpointing]]
- [[概念/deepspeed|DeepSpeed]]
- [[概念/qlora|QLoRA]]
- [[概念/hami|HAMi]]
- [[概念/vllm|vLLM]]
- [[13_运维/02_SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]

---

## 2026 GPU OOM 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **梯度累积** | 小 batch 模拟大 batch，降低显存 | GA |
| **激活检查点** | 重计算激活值，降低显存 | GA |
| **ZeRO 优化** | 优化器状态分片，降低显存 | GA |
| **QLoRA** | 4-bit 量化 + LoRA 微调 | GA |
| **vLLM PagedAttention** | 分页 KV Cache，降低显存 | GA |

## 生产最佳实践

1. **梯度累积**：显存不足时用梯度累积模拟大 batch
2. **激活检查点**：训练大模型启用激活检查点
3. **ZeRO 优化**：用 DeepSpeed ZeRO 优化显存
4. **量化微调**：用 QLoRA 4-bit 量化微调
5. **监控显存**：实时监控显存使用，设置告警

## 2026 显存优化技术

| 技术 | 说明 | 效果 |
|------|------|------|
| **Flash Attention** | 高效注意力 | 显存减少 5-10x |
| **梯度检查点** | 重计算换显存 | 显存减少 50%+ |
| **混合精度** | FP16/BF16 训练 | 显存减少 50% |
| **模型并行** | 分布到多 GPU | 线性扩展 |

## 延伸阅读

- [[概念/GPU/gpu|GPU]] — GPU 基础
- [[概念/GPU/model-parallelism|Model Parallelism]] — 模型并行
- [[概念/Inference/quantization|量化]] — 模型量化

> ℹ️ GPU OOM 是显存不足错误，通过批大小调整、梯度累积、模型并行等技术解决。

## OOM 常见原因

| 原因 | 说明 | 解决方案 |
|------|------|------|
| **批大小过大** | 批大小超过显存 | 减小批大小 |
| **模型过大** | 模型参数过多 | 模型并行 |
| **激活值过大** | 中间激活值占用 | 梯度检查点 |
| **显存碎片** | 显存碎片化 | 重启/清理 |
| **内存泄漏** | 显存未释放 | 检查代码 |

## 显存估算公式

```
训练显存 ≈ 模型参数 + 梯度 + 优化器状态 + 激活值

示例: 7B 参数模型 (BF16)
    模型参数: 7B × 2 bytes = 14 GB
    梯度: 7B × 2 bytes = 14 GB
    优化器 (Adam): 7B × 8 bytes = 56 GB
    激活值: ~10-50 GB (取决于批大小)
    总计: ~100-130 GB
```

## 生产最佳实践

1. **批大小调整**：从大批大小开始，逐步减小
2. **梯度累积**：用梯度累积模拟大批大小
3. **梯度检查点**：用重计算换显存
4. **混合精度**：用 BF16/FP16 训练
5. **模型并行**：大模型用模型并行
6. **量化微调**：用 QLoRA 4-bit 量化微调
7. **监控显存**：实时监控显存使用

## 检查清单

- [ ] 批大小已调整
- [ ] 梯度累积已配置
- [ ] 梯度检查点已启用
- [ ] 混合精度已配置
- [ ] 显存监控已配置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 训练 OOM | batch size 过大 | 减小 batch + 梯度累积 |
| 推理 OOM | KV Cache 超限 | 启用 PagedAttention / 滑动窗口 |
| 显存碎片 | 反复分配释放 | 使用 `torch.cuda.memory.set_per_process_memory_fraction` |
| 多卡不均 | 并行切分不均 | 调整 TP/PP 度数分配 |
| 泄漏 | 张量未释放 | 检查 `.detach()` 和 `del` 引用 |

## 延伸阅读

- [[概念/GPU/mig|MIG]] — 硬件级显存隔离
- [[概念/GPU/model-parallelism|模型并行]] — 分片降低单卡显存
- [[概念/Training/mixed-precision|混合精度]] — FP16/BF16 减半显存
- [[概念/Inference/vllm|vLLM]] — PagedAttention 显存管理
- [[概念/MLOps/observability|可观测性]] — 显存监控告警

> ℹ️ GPU OOM 是大模型工程中最常见的工程问题，2026年通过 ZeRO-3、梯度检查点、PagedAttention、FP8 量化等组合策略，可在有限显存上运行万亿参数模型。

## 2026 显存优化技术对比

| 技术 | 节省比例 | 适用阶段 | 性能影响 |
|------|------|------|------|
| ZeRO-3 | 60-75% | 训练 | 通信增加 10% |
| 梯度检查点 | 50-70% | 训练 | 计算增加 30% |
| PagedAttention | 60-80% | 推理 | 无 |
| FP8 量化 | 50% | 训练+推理 | 精度微降 |
| INT4 量化 | 75% | 推理 | 精度降低 |
| 模型切分 | 按度数 | 训练+推理 | 通信增加 |
| KV Cache 压缩 | 40-60% | 推理 | 精度微降 |
| Offload (CPU/NVMe) | 90%+ | 训练 | 速度降低 2-5x |

## 检查清单

- [ ] 显存预算已计算（参数+梯度+优化器+激活）
- [ ] 混合精度已启用（FP16/BF16）
- [ ] 梯度检查点已启用
- [ ] ZeRO 策略已配置
- [ ] batch size 已优化
- [ ] 显存监控已配置
- [ ] OOM 回退策略已配置
- [ ] 量化策略已评估

> ℹ️ 显存优化需组合使用多种技术，2026年 ZeRO-3 + 梯度检查点 + FP8 是万卡训练标配。

## 显存估算公式

```
训练显存 ≈ 参数×(2+优化器倍数) + 激活值 + 梯度
推理显存 ≈ 参数 + KV Cache + 临时缓冲区
```
