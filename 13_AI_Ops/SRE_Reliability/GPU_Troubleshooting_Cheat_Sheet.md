---
title: "GPU 故障排查速查表"
category: 13-ai-ops
subcategory: sre-reliability
tags: ["gpu", "troubleshooting", "cheat-sheet", "nvidia-smi", "cuda", "alibaba-cloud"]
summary: "面向 AI 平台的 GPU 故障排查速查表：涵盖 nvidia-smi、CUDA 版本、驱动、显存、进程、温度等常用命令与诊断流程。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
---

# GPU 故障排查速查表

> **使用方式**: 根据现象定位到对应章节，按命令顺序执行。

---

## 1. 快速确认 GPU 是否可用

```bash
# 查看 GPU 列表与状态
nvidia-smi

# 查看 GPU 详细信息
nvidia-smi -q

# 查看驱动版本
nvidia-smi | grep -i "Driver Version"

# 查看 CUDA 版本
nvcc --version
```

**预期**: 所有 GPU 状态为 `Default`，温度正常，无 `ERR!`。

---

## 2. 显存占用排查

```bash
# 查看各进程显存占用
nvidia-smi pmon -s um

# 查看显存详细信息
nvidia-smi -q -d MEMORY

# 查看占用显存的进程
fuser -v /dev/nvidia*

# 按显存排序查看进程
nvidia-smi --query-compute-apps=pid,process_name,used_memory --format=csv
```

**处理**: 发现僵尸进程 → `kill -9 <pid>`；发现内存泄漏 → 联系业务方修复。

---

## 3. 判断是哪种 OOM

| 类型 | 检查命令 | 典型日志 |
|------|---------|---------|
| Host OOM | `dmesg -T | grep -i "killed process"` | `Out of memory: Kill process ...` |
| Container OOM | `kubectl describe pod <pod>` | `OOMKilled` |
| CUDA OOM | Pod 日志 | `CUDA out of memory` |
| HAMi vGPU oversell | HAMi scheduler 日志 | `insufficient vgpu memory` |

---

## 4. 驱动与运行时问题

```bash
# 检查内核模块
lsmod | grep nvidia

# 查看驱动日志
journalctl -u nvidia-persistenced -n 100

# 检查 CUDA 与驱动兼容性
cat /usr/local/cuda/version.json 2>/dev/null || cat /usr/local/cuda/version.txt

# DCGM 健康检查
dcgmi diag -r 3
```

---

## 5. GPU 温度与功耗

```bash
# 查看温度、功耗、风扇
nvidia-smi dmon -s pucvmet

# 查看 GPU 温度阈值
nvidia-smi -q -d TEMPERATURE,PERFORMANCE,POWER
```

**告警阈值参考**:
- 温度 > 85°C：关注
- 温度 > 92°C：紧急降频或停机
- 功耗持续 < 50% 但负载高：可能遇到 PCI-E 瓶颈

---

## 6. 多节点 GPU 通信

```bash
# 测试 IB/RDMA 带宽
ib_write_bw -d mlx5_0
ib_write_lat -d mlx5_0

# NCCL 调试信息
NCCL_DEBUG=INFO NCCL_DEBUG_SUBSYS=ALL torchrun ...

# 查看 NCCL 网络拓扑
NCCL_TOPO_DUMP_FILE=topo.xml torchrun ...
```

---

## 7. K8s 中 GPU 相关命令

```bash
# 查看节点 GPU 资源
kubectl describe node <node> | grep -i nvidia.com/gpu

# 查看所有 GPU Pod
kubectl get pods --all-namespaces -o custom-columns=\
"NAME:.metadata.name,NAMESPACE:.metadata.namespace,GPU:.spec.containers[*].resources.limits.nvidia\.com/gpu"

# 查看 GPU Operator 状态
kubectl get pods -n gpu-operator

# 查看 Device Plugin 日志
kubectl logs -n kube-system -l name=nvidia-device-plugin-ds
```

---

## Related

- [[13_AI_Ops/SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]
- [[07_Model_Training/Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]
- [[_concepts/nvidia-smi|nvidia-smi]]
