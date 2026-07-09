---
title: "GPU OOM 排障指南"
category: 13-ai-ops
subcategory: sre-reliability
tags: ["gpu", "cuda", "oom", "training", "inference", "kubernetes", "k8s", "hami", "alibaba-cloud"]
summary: "区分 host OOM、container OOMKilled、CUDA OOM、HAMi vGPU oversell 四类场景，给出 K8s 环境下的定位命令与修复阶梯。"
created: 2026-06-26
updated: 2026-06-26
tier: core
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# GPU OOM 排障指南

> **一句话理解**: GPU OOM 不只有一种——要分清是 Linux 把容器 kill 了、CUDA 显存分配失败、还是 HAMi 等虚拟化层超卖导致，才能对症下药。

## 目录

- [1. 四类 OOM 速查](#1-四类-oom-速查)
- [2. Container OOMKilled](#2-container-oomkilled)
- [3. CUDA Out of Memory](#3-cuda-out-of-memory)
- [4. Host 内存不足](#4-host-内存不足)
- [5. HAMi / vGPU 显存超卖](#5-hami--vgpu-显存超卖)
- [6. 修复阶梯](#6-修复阶梯)
- [7. 阿里云专有云关联](#7-阿里云专有云关联)
- [Related](#related)

---

## 1. 四类 OOM 速查

| 类型 | 典型信号 | 发生位置 |
|------|---------|---------|
| **Container OOMKilled** | `kubectl describe` 显示 `Reason: OOMKilled`，exit code 137 | K8s cgroup memory limit |
| **CUDA Out of Memory** | 日志中 `RuntimeError: CUDA out of memory` | NVIDIA 驱动 / 显存 |
| **Host 内存不足** | 节点 `MemoryPressure`，系统 OOM killer 杀进程 | Linux 主机 |
| **HAMi / vGPU 显存超卖** | 日志显存足够但分配失败，或 HAMi 调度异常 | GPU 虚拟化层 |

---

## 2. Container OOMKilled

### 2.1 识别

```bash
kubectl describe pod <pod> -n <ns> | grep -A 5 "Last State"
# 输出示例：
# Last State: Terminated
#   Reason:    OOMKilled
#   Exit Code: 137
```

### 2.2 根因

Pod 的 `resources.limits.memory` 被突破，Linux cgroup OOM killer 终止容器。

注意：GPU 训练任务的 **host 内存**（非显存）也可能很大，因为：
- 数据加载缓存
- 数据预处理
- 优化器状态（Adam 需要额外内存）
- NCCL buffer

### 2.3 处理

1. 增大 `resources.limits.memory` 和 `requests.memory`
2. 减小 `num_workers`（减少数据加载进程内存）
3. 使用 `pin_memory=False`（PyTorch DataLoader）
4. 把数据预处理移到训练前完成

---

## 3. CUDA Out of Memory

### 3.1 识别

```bash
kubectl logs <pod> -n <ns> --previous | grep -i "out of memory"
# RuntimeError: CUDA out of memory. Tried to allocate X.XX GiB
```

### 3.2 根因

GPU 显存不够容纳：
- 模型参数
- 优化器状态
- 梯度
- 激活值
- KV Cache（推理时）

### 3.3 快速定位显存占用

```bash
# 在节点上执行
nvidia-smi

# 持续监控
nvidia-smi dmon -s u

# 看进程级显存
nvidia-smi pmon -s um

# 查看显存详细信息
nvidia-smi -q -d MEMORY | grep -A 20 "FB Memory Usage"

# 查看历史峰值（若 DCGM 已部署）
dcgmi dmon -e 1001,1002,1003,1004
```

### 3.4 处理阶梯

| 步骤 | 训练场景 | 推理场景 |
|------|---------|---------|
| 1 | 减小 batch size | 减小 max_tokens / batch size |
| 2 | 缩短序列长度 | 缩短 context length |
| 3 | 降低 LoRA rank / 用 QLoRA | 使用量化模型 |
| 4 | 开启 gradient_checkpointing | 开启 vLLM prefix caching |
| 5 | DeepSpeed ZeRO-2/3 / FSDP | Tensor/pipeline parallelism |
| 6 | 更多 GPU / 更大显存 | 更多 GPU / 更大显存 |

---

## 4. Host 内存不足

### 4.1 识别

```bash
kubectl describe node <node>
# Conditions 中出现 MemoryPressure

# 节点上
free -h
dmesg | grep -i "out of memory"
```

### 4.2 根因

节点上所有 Pod 的内存总和超过物理内存，触发系统 OOM killer。

### 4.3 处理

1. 驱逐低优先级 Pod
2. 增大节点内存
3. 减少单节点并发训练任务数
4. 使用内存优化的数据加载

---

## 5. HAMi / vGPU 显存超卖

### 5.1 识别

```bash
# 看 HAMi scheduler 日志
kubectl logs -n kube-system -l app=hami-scheduler

# 看 vGPU 分配情况
kubectl describe node <node> | grep -i hami
```

### 5.2 根因

HAMi 等 GPU 虚拟化方案允许显存超卖（oversell），但当多个任务实际显存使用超过物理显存时，会出现分配失败或性能骤降。

### 5.3 处理

1. 检查 HAMi 的 `memorySchedulerPolicy`
2. 避免过度超卖，按实际峰值显存分配
3. 监控 `hami_vgpu_memory_limit` vs 实际使用
4. 必要时关闭超卖，使用独占 GPU

---

## 6. 修复阶梯

```text
Step 1: 确认 OOM 类型（cgroup / CUDA / host / HAMi）
Step 2: 采集 nvidia-smi / kubectl describe / 日志
Step 3: 软件层优化：batch size、seq length、checkpointing、量化
Step 4: 框架层优化：DeepSpeed/FSDP/TP/PP
Step 5: 资源层扩容：更多 GPU、更大显存、更多 host 内存
Step 6: 调度层优化：避免超卖、Gang Scheduling、队列管理
```

---

## 7. 阿里云专有云关联

在阿里云专有云环境中，GPU OOM 场景常见于：

- **PAI-DLC 训练任务**：需同时看 PAI 日志和底层 K8s Pod 事件
- **ACK 专有版 + 神龙 GPU 节点**：显存为物理 GPU 显存，需注意 HAMi 超卖策略
- **AI Stack 一体机**：使用 HAMi 做 GPU 共享，需关注 vGPU 配额和实际使用

**排查入口**：
- ASCM 告警中心查看 GPU/内存告警
- 天基 OpsBox 登录节点执行 `nvidia-smi`
- PAI-DLC 控制台查看任务日志与资源使用

---

## Related

- [[_concepts/gpu-oom|GPU OOM]]
- [[_concepts/hami|HAMi]]
- [[_concepts/mig|MIG]]
- [[_concepts/gradient-checkpointing|Gradient Checkpointing]]
- [[_concepts/qlora|QLoRA]]
- [[AI运维/SRE_Reliability/GPU_Troubleshooting_Cheat_Sheet|GPU 故障排查速查表]]
- [[_concepts/deepspeed|DeepSpeed]]
- [[_concepts/vllm|vLLM]]
- [[模型训练/Monitoring/LLM_Fine_Tuning_Job_Failure_Runbook_on_K8s|LLM 微调任务 K8s 失败排障]]
- [[模型训练/Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]
