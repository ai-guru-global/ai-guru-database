---
title: "LLM 微调任务 K8s 失败排障 Runbook"
category: 07-model-training
subcategory: monitoring
tags: ["llm", "fine-tuning", "training", "kubernetes", "k8s", "troubleshooting", "lora", "qlora", "alibaba-cloud"]
summary: "面向阿里云专有云 K8s 环境的 LLM 微调任务失败排障手册：把框架层训练错误与 K8s Pod 事件、日志、资源信号结合起来，快速定位根因。"
created: 2026-06-26
updated: 2026-06-26
tier: core
---

# LLM 微调任务 K8s 失败排障 Runbook

> **一句话理解**: 这本 Runbook 教你把「微调任务为什么失败」从框架报错（LoRA/数据/优化器）翻译到 K8s 运行信号（OOM、镜像拉取、Pending、重启），再给出修复动作。

## 目录

- [1. 总线：先看 K8s 层还是框架层](#1-总线先看-k8s-层还是框架层)
- [2. Pod 状态驱动的初筛](#2-pod-状态驱动的初筛)
- [3. 典型失败模式与定位](#3-典型失败模式与定位)
- [4. 阿里云专有云关联](#4-阿里云专有云关联)
- [5. 常用命令速查](#5-常用命令速查)
- [Related](#related)

---

## 1. 总线：先看 K8s 层还是框架层

拿到微调失败工单，先判断失败发生在哪一层：

```text
K8s 层（Pod/节点/网络/存储）
  └── Pod 未 Running / 被驱逐 / OOM / 镜像拉取失败
框架层（训练代码 / 数据 / 模型）
  └── Pod 已 Running，但训练报错退出
```

**先执行**：

```bash
kubectl get pods -n <ns> -l job-name=<job-name> -o wide
kubectl describe pod <pod-name> -n <ns>
kubectl logs <pod-name> -n <ns> --previous
```

---

## 2. Pod 状态驱动的初筛

| Pod 状态 | 含义 | 优先排查 |
|----------|------|---------|
| `Pending` | 未调度或资源不足 | 节点 GPU/CPU/内存、调度约束、镜像拉取 |
| `ContainerCreating` | 卡在存储/运行时 | PVC 绑定、CSI、镜像层下载 |
| `ImagePullBackOff` | 镜像拉取失败 | 镜像地址、ACR/Harbor 权限、网络 |
| `CrashLoopBackOff` | 启动后反复崩溃 | 入口命令、环境变量、数据路径、依赖 |
| `OOMKilled` | 内存超限 | batch size、LoRA rank、序列长度、ZeRO stage |
| `Evicted` | 节点驱逐 | 磁盘/内存压力、日志占满 |
| `Error` / `Failed` | 框架报错退出 | 训练日志、数据格式、模型路径 |
| `Completed` | Job 成功结束 | 检查输出模型是否写入目标路径 |

---

## 3. 典型失败模式与定位

### 3.1 OOMKilled / CUDA Out of Memory

**K8s 信号**：
- `Reason: OOMKilled`
- 容器 `lastState.terminated.exitCode: 137`
- 日志中出现 `CUDA out of memory`

**框架层根因**：
- batch size 过大
- 序列长度过长
- LoRA rank 过高
- 未开 gradient checkpointing
- ZeRO stage 不够激进
- HAMi vGPU 显存超卖

**排查命令**：

```bash
# 查看 Pod 事件
kubectl describe pod <pod> -n <ns>

# 看最后日志
kubectl logs <pod> -n <ns> --previous | tail -n 100

# 看 GPU 显存峰值（若节点可访问）
nvidia-smi
```

**修复阶梯**：

| 步骤 | 操作 | 影响 |
|------|------|------|
| 1 | 减小 batch size / per_device_train_batch_size | 训练速度下降 |
| 2 | 缩短 max_seq_length | 可能损失长样本 |
| 3 | 降低 LoRA rank / 使用 QLoRA | 可训练参数减少 |
| 4 | 开启 gradient_checkpointing=True | 时间换显存 |
| 5 | 使用 DeepSpeed ZeRO-2/3 或 FSDP | 多卡拆分到数据并行 |
| 6 | 换更大显存 GPU 或增加卡数 | 成本上升 |
| 7 | 检查 HAMi vGPU 配置，避免显存 oversell | 资源规划 |

### 3.2 NaN / Loss Spike

**K8s 信号**：
- Pod 状态为 `Error` 或 `Completed`（代码可能正常退出但 loss 异常）
- 训练日志打印 `loss=nan` 或 loss 大幅震荡

**框架层根因**：
- 学习率过大
- 数据中存在异常样本
- 混合精度 overflow
- LoRA alpha/rank 设置不当
- 权重初始化/加载错误

**排查命令**：

```bash
kubectl logs <pod> -n <ns> | grep -E "loss|nan|overflow|grad_norm"
```

**修复**：
- 降低 learning rate（如 5e-5 → 1e-5）
- 增加 warmup steps
- 检查数据：`dataset[0]`、token length 分布
- 关闭/调整 fp16，改用 bf16
- 检查 LoRA target_modules 是否包含输出层

### 3.3 数据格式 / 路径错误

**K8s 信号**：
- `CrashLoopBackOff` 或 `Error`
- 启动即退出

**常见报错**：
- `FileNotFoundError: /data/train.jsonl`
- `JSON parse error`
- `dataset is empty`
- `conversation format mismatch`

**排查命令**：

```bash
kubectl logs <pod> -n <ns> --previous | head -n 50
kubectl exec -it <pod> -n <ns> -- ls -l /data
```

**修复**：
- 检查 PVC 挂载路径与训练脚本 `--data_path` 一致
- 确认数据文件格式（jsonl / parquet / arrow）
- 验证样本字段（instruction/input/output 或 conversations）
- 检查挂载的 ConfigMap/Secret 是否正确

### 3.4 NCCL / 分布式初始化失败

**K8s 信号**：
- 多卡 Job 中部分 Pod `Error`，其余 `Running`
- 日志卡在 `Initializing distributed`

**常见报错**：
- `NCCL error in: ... unhandled system error`
- `Connection refused by rank 0`
- `TIMEOUT`

**详细排查见**：[[07_Model_Training/Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障 Runbook]]

### 3.5 镜像拉取失败

**K8s 信号**：
- `ImagePullBackOff`
- `ErrImagePull`

**排查**：

```bash
kubectl describe pod <pod> -n <ns> | grep -A 5 Events
kubectl get secret -n <ns> | grep image-pull
```

**修复**：
- 确认镜像 tag 存在
- 配置 imagePullSecret 或 nodes 已登录 ACR
- 检查节点到 ACR 的网络策略（洛神安全组、NetworkPolicy）

### 3.6 Checkpoint 保存失败

**K8s 信号**：
- Pod 运行一段时间后 `Error`
- 日志中出现 `No space left on device` 或 `Permission denied`

**排查**：

```bash
kubectl exec -it <pod> -n <ns> -- df -h /output
kubectl exec -it <pod> -n <ns> -- ls -ld /output
```

**修复**：
- 清理旧 checkpoint
- 增大 PVC 容量
- 检查 StorageClass 是否支持扩容
- 使用异步 checkpoint（async checkpointing）

### 3.7 HPA / 资源配额导致 Pending

**K8s 信号**：
- `Pending`
- Events: `0/3 nodes are available: 3 Insufficient nvidia.com/gpu`

**修复**：
- 申请更多 GPU 节点
- 检查 ResourceQuota / LimitRange
- 使用 Volcano / Kueue 排队

---

## 4. 阿里云专有云关联

在阿里云专有云 ACK 环境中，微调任务通常以以下方式运行：

| 场景 | 入口 | K8s 资源 |
|------|------|---------|
| 交互式开发 | PAI-DSW / DLC Notebook | StatefulSet / Deployment |
| 提交训练任务 | PAI-DLC / ack-ai-dashboard | Job / PyTorchJob / TFJob |
| 专属集群 | ACK 专有版 + 神龙 GPU 节点 | NodePool + Tianji 运维 |

**专有云排障要点**：
- 通过 ASCM 查看项目配额、告警、事件
- 通过天基 OpsBox 登录神龙 GPU 节点，检查 `nvidia-smi`、MOC 卡状态
- 镜像仓库通常使用 ACR EE 私有化实例或 Harbor
- 训练数据/模型/输出通常放在盘古 NAS/OSS 或 PAI 数据集挂载

---

## 5. 常用命令速查

```bash
# 查看训练 Job 的 Pod
kubectl get pods -n <ns> -l training.kubeflow.org/job-name=<job>

# 实时跟踪日志
kubectl logs -f <pod> -n <ns>

# 查看上一个容器的日志（崩溃后）
kubectl logs <pod> -n <ns> --previous

# 进入运行中的训练容器
kubectl exec -it <pod> -n <ns> -- /bin/bash

# 看 GPU 使用
kubectl top pod <pod> -n <ns>
nvidia-smi dmon -s u

# 看事件
kubectl get events -n <ns> --sort-by='.lastTimestamp' | tail -30

# 查看 Volcano 队列状态
kubectl get queue -n volcano-system

# 查看 Pod 资源限制
kubectl get pod <pod> -n <ns> -o jsonpath='{.spec.containers[*].resources}'
```

---

## Related

- [[07_Model_Training/Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障 Runbook]]
- [[07_Model_Training/Monitoring/Training_Job_Diagnosis_Workflow|训练任务诊断工作流]]
- [[13_AI_Ops/SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]
- [[13_AI_Ops/SRE_Reliability/K8s_AI_Troubleshooting_Cheat_Sheet|K8s for AI 排查速查表]]
- [[_concepts/lora-peft|LoRA / PEFT]]
- [[_concepts/qlora|QLoRA]]
- [[_concepts/deepspeed|DeepSpeed]]
- [[_concepts/fsdp|FSDP]]
- [[_concepts/gradient-checkpointing|Gradient Checkpointing]]
- [[_concepts/nccl|NCCL]]
- [[12_Architecture_Infrastructure/Alibaba_Cloud_Proprietary_K8s_Context|阿里云专有云 K8s 上下文]]
- [[13_AI_Ops/Kubernetes_Troubleshooting_Playbook|Kubernetes 运维排障 Playbook]]
