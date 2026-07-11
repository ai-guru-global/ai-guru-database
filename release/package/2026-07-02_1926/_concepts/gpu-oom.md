---
title: "GPU OOM"
category: -concepts
tags: ["gpu", "cuda", "oom", "training", "inference", "troubleshooting", "alibaba-cloud"]
summary: "GPU OOM 指 GPU 显存不足，可分为容器 cgroup OOM、CUDA 显存分配失败、host 内存不足、GPU 虚拟化超卖等类型，是 AI 训练/推理最常见故障之一。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "CUDA OOM"
  - "GPU Out of Memory"
relationships:
  - target: "_concepts/gpu"
    type: related_to
  - target: "_concepts/gradient-checkpointing"
    type: mitigated_by
  - target: "_concepts/deepspeed"
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

- [[_concepts/gradient-checkpointing|Gradient Checkpointing]]
- [[_concepts/deepspeed|DeepSpeed]]
- [[_concepts/qlora|QLoRA]]
- [[_concepts/hami|HAMi]]
- [[_concepts/vllm|vLLM]]
- [[运维/SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]
