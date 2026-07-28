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
sources: []

name_zh: "AI Stack 训练启动器指南"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# AI Stack 训练启动器指南

> 中文简称：AI Stack 训练启动器指南

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

- [[12_架构基建/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_架构基建/AI_Stack_GPU_Monitoring_Guide|AI Stack GPU 监控指南]]
- [[12_架构基建/AI_Stack_Model_Management_Guide|AI Stack 模型下载与管理指南]]
- [[07_模型训练/04_Distributed_Training/Distributed_Training_2026|分布式训练 2026]]
- [[07_模型训练/04_Distributed_Training/HF_Accelerate_DeepSpeed_Guide|HF Accelerate & DeepSpeed 指南]]
- [[07_模型训练/04_Distributed_Training/ms_swift_Deep_Dive|ms-swift 深度解析]]
- [[07_模型训练/07_Monitoring/Training_Monitoring_2026|训练监控与实验追踪 2026]]
- [[概念/distributed-parallelism|分布式并行策略]]

## 架构核心组件对比

| 组件层 | 功能 | 关键技术 | 选型考量 |
|--------|------|----------|----------|
| 计算层 | 07_模型训练/推理 | GPU/TPU/NPU集群 | 算力需求+成本 |
| 存储层 | 数据/模型/检查点 | 分布式存储/对象存储 | 容量+IOPS+成本 |
| 网络层 | 节点间通信 | RDMA/RoCE/InfiniBand | 带宽+延迟 |
| 调度层 | 资源编排 | K8s/Slurm/Ray | 弹性+效率 |
| 服务层 | 模型服务化 | vLLM/TGI/Triton | 吞吐+延迟 |
| 网关层 | 流量管理 | API Gateway/负载均衡 | 可用性+安全 |
| 监控层 | 可观测性 | Prometheus/Grafana/OTel | 全面+实时 |

## 架构设计原则

| 原则 | 说明 | 实践方法 |
|------|------|----------|
| 高可用 | 消除单点故障 | 多副本+故障转移+多AZ |
| 可扩展 | 水平扩展无瓶颈 | 无状态设计+分片 |
| 高性能 | 最小化延迟 | 缓存+并行+异步 |
| 安全性 | 纵深防御 | 加密+认证+审计 |
| 可观测 | 全链路可见 | Trace+Metrics+Logging |
| 成本优化 | 资源利用率最大化 | 弹性伸缩+混合部署 |

## 性能基准参考

| 场景 | 关键指标 | 目标值 | 优化方向 |
|------|----------|--------|----------|
| 模型推理 | 首Token延迟 | <500ms | 模型优化+缓存 |
| 批量推理 | 吞吐量 | >1000 req/s | 批处理+并行 |
| 训练任务 | GPU利用率 | >85% | 数据管道+通信优化 |
| 存储读写 | IOPS | >100K | NVMe+分布式 |
| 网络通信 | 带宽利用率 | >90% | RDMA+拓扑优化 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 |
|------|----------|----------|
| GPU利用率低 | 数据加载瓶颈 | 预取+多worker+NVMe |
| 推理延迟高 | 模型过大/批处理不当 | 量化+动态batch |
| 存储IO瓶颈 | 检查点写入集中 | 异步写入+分布式存储 |
| 网络拥塞 | AllReduce通信密集 | 梯度压缩+拓扑优化 |
| 资源碎片 | 调度策略不当 | Gang调度+资源预留 |

## 技术选型决策树

| 决策点 | 选项A | 选项B | 选择依据 |
|--------|-------|-------|----------|
| 训练框架 | PyTorch DDP | DeepSpeed/Megatron | 模型规模>10B用后者 |
| 推理引擎 | vLLM | TensorRT-LLM | 灵活性vs极致性能 |
| 存储方案 | 本地NVMe | 分布式存储(Ceph) | 数据规模+共享需求 |
| 网络方案 | 以太网 | InfiniBand | 集群规模+预算 |
| 调度系统 | K8s | Slurm | 云原生vs HPC传统 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 基础架构概念+组件认知 | 1-2周 | 理解全景图 |
| 基础 | 单一组件深入(存储/网络) | 2-3周 | 掌握核心原理 |
| 进阶 | 系统集成+性能优化 | 3-4周 | 能设计完整方案 |
| 实战 | 生产环境部署运维 | 4-6周 | 独立运维能力 |
| 精通 | 架构演进+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| RDMA | 远程直接内存访问(绕过CPU) |
| NVLink | GPU间高速互联 |
| InfiniBand | 高性能网络互连技术 |
| Checkpoint | 训练中间状态保存点 |
| Gang Scheduling | 一组Pod同时调度 |
| Data Parallelism | 数据并行(每GPU处理不同数据) |
| Model Parallelism | 模型并行(模型分片到多GPU) |
| Pipeline Parallelism | 流水线并行(层间流水) |
| Tensor Parallelism | 张量并行(层内切分) |
| KV Cache | 推理时缓存注意力键值 |

## 检查清单

- [ ] 理解AI基础设施全景架构
- [ ] 掌握计算/存储/网络核心组件
- [ ] 了解主流框架和工具链
- [ ] 能进行基本的性能分析和优化
- [ ] 熟悉生产环境最佳实践
- [ ] 关注硬件和架构演进趋势
