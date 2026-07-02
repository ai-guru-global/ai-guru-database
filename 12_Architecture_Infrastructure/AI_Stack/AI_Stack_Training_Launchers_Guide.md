---
title: "AI Stack 训练启动器指南"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "training", "torchrun", "accelerate", "deepspeed", "swift", "distributed-training"]
summary: "> **一句话理解**: AI Stack 训练层提供 torchrun、accelerate、deepspeed、swift 四种启动方式，覆盖 PyTorch 原生、HuggingFace 生态、大模型分布式和国产魔搭框架。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Ai Stack Training Launchers Guide"
  - "AI Stack Training Launchers Guide"
  - AI_Stack_Training_Launchers_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# AI Stack 训练启动器指南

> **一句话理解**: AI Stack 训练层提供 `torchrun`、`accelerate`、`deepspeed`、`swift` 四种启动方式，覆盖 PyTorch 原生、HuggingFace 生态、大模型分布式和国产魔搭框架。

---

## 1. 工具选型矩阵

| 工具 | 用途 | 推荐场景 | 配置方式 |
|------|------|----------|----------|
| **torchrun** | PyTorch 分布式训练启动器 | 单机多卡、多机 DDPP/FSDP | 命令行参数 |
| **accelerate** | HF Accelerate 启动器 | HuggingFace 生态、快速实验 | `accelerate config` |
| **deepspeed** | DeepSpeed 训练启动器 | 大模型预训练/微调、ZeRO/Offload | `ds_config.json` |
| **swift** | ModelScope SWIFT 训练框架 | 国产/魔搭生态、LoRA/SFT/RLHF | 命令行参数 |

---

## 2. 常用命令

### 2.1 torchrun

```bash
# 单机 8 卡 DDP
torchrun --nproc_per_node=8 train.py \
  --model_name_or_path Qwen/Qwen3-8B \
  --output_dir ./output

# 多机多卡（2 节点，每节点 8 卡）
torchrun \
  --nnodes=2 \
  --node_rank=0 \
  --master_addr=192.168.1.10 \
  --master_port=29500 \
  --nproc_per_node=8 \
  train.py
```

### 2.2 accelerate

```bash
# 首次配置交互式问卷
accelerate config

# 使用 8 卡启动
accelerate launch --num_processes=8 train.py

# 指定配置文件
accelerate launch --config_file ./accelerate_config.yaml train.py

# DeepSpeed 后端
accelerate launch --use_deepspeed --deepspeed_config_file ds_config.json train.py
```

### 2.3 deepspeed

```bash
# 单机 8 卡
deepspeed --num_gpus=8 train.py --deepspeed ds_config.json

# 多机（需配合 hostfile）
deepspeed --hostfile ./hostfile --num_gpus=8 train.py --deepspeed ds_config.json

# ZeRO-3 示例 ds_config.json 关键字段
{
  "train_batch_size": "auto",
  "train_micro_batch_size_per_gpu": "auto",
  "gradient_accumulation_steps": "auto",
  "zero_optimization": {
    "stage": 3,
    "offload_optimizer": {"device": "cpu"},
    "offload_param": {"device": "cpu"}
  },
  "bf16": {"enabled": true}
}
```

### 2.4 swift

```bash
# 全参数 SFT
swift sft \
  --model Qwen/Qwen3-8B \
  --dataset alpaca-zh \
  --num_train_epochs 3 \
  --per_device_train_batch_size 1 \
  --learning_rate 1e-5

# LoRA 微调
swift sft \
  --model Qwen/Qwen3-8B \
  --dataset alpaca-zh \
  --sft_type lora \
  --lora_target_modules ALL \
  --num_train_epochs 3

# RLHF (DPO)
swift dpo \
  --model Qwen/Qwen3-8B \
  --dataset human_preference \
  --rlhf_type dpo
```

---

## 3. 生产环境 Checklist

- [ ] 启动前确认各节点 GPU 可见、驱动/CUDA 版本一致、网络互通（NCCL 测试通过）。
- [ ] 使用 `NCCL_DEBUG=INFO` 初次验证分布式通信；生产稳定后可关闭减少日志。
- [ ] checkpoint 保存到共享存储或对象存储，并设置自动清理策略。
- [ ] 训练日志接入 TensorBoard / W&B / MLflow，记录 loss、learning rate、throughput、GPU 利用率。
- [ ] DeepSpeed ZeRO-3 / Offload 会牺牲速度换显存，需根据模型大小和集群规模做权衡。
- [ ] 多机训练使用 RDMA/RoCE 网络，避免以太网成为 NCCL 通信瓶颈。
- [ ] 训练任务配置 `OMP_NUM_THREADS`、`CUDA_VISIBLE_DEVICES` 等环境变量，避免资源争抢。
- [ ] 使用 `torchrun`/`deepspeed` 的 elastic 能力时，确保 K8s/Slurm 的容错与重试策略匹配。

---

## 4. 故障排查速查

| 现象 | 排查命令 | 常见原因 |
|------|----------|----------|
| NCCL 初始化失败 | `NCCL_DEBUG=INFO torchrun ...` | 节点间网络不通、防火墙、RDMA 配置错误 |
| 多机训练速度卡慢 | `nvidia-smi dmon` + `iftop` | 网络带宽不足、NCCL 走 TCP 而非 RDMA |
| OOM | 减小 batch size / 启用 gradient checkpointing | 模型太大、ZeRO stage 不够、激活占用大 |
| Loss 发散 | TensorBoard | 学习率过高、数据异常、梯度未裁剪 |
| checkpoint 保存失败 | `df -h` | 共享存储满、权限不足 |
| accelerate 配置不生效 | `accelerate env` | 配置文件路径错误、环境变量覆盖 |
| swift 找不到数据集 | `swift list-datasets` | 数据集 ID 拼写错误、未登录 ModelScope |

---

## 5. 选型决策树

```
使用魔搭生态或需要 LoRA/RLHF 快速微调？
  ├─ 是 → swift
  └─ 否 → 模型 > 7B 且需要 ZeRO/Offload？
      ├─ 是 → deepspeed
      └─ 否 → HF Transformers/PEFT 生态？
          ├─ 是 → accelerate
          └─ 否 → torchrun（PyTorch 原生）
```

---

## Related

- [[12_Architecture_Infrastructure/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_Architecture_Infrastructure/AI_Stack_GPU_Monitoring_Guide|AI Stack GPU 监控指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Model_Management_Guide|AI Stack 模型下载与管理指南]]
- [[07_Model_Training/Distributed_Training/Distributed_Training_2026|分布式训练 2026]]
- [[07_Model_Training/Distributed_Training/HF_Accelerate_DeepSpeed_Guide|HF Accelerate & DeepSpeed 指南]]
- [[07_Model_Training/Distributed_Training/ms_swift_Deep_Dive|ms-swift 深度解析]]
- [[07_Model_Training/Monitoring/Training_Monitoring_2026|训练监控与实验追踪 2026]]
- [[_concepts/distributed-parallelism|分布式并行策略]]
