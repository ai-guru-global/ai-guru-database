---
title: "rocm-smi AMD GPU 监控工具 (ROCm System Management Interface)"
category: -concepts
tags: ["rocm-smi", "amd-gpu", "rocm", "gpu-monitoring", "ai-stack"]
relationships:
  - target: "概念/nvidia-smi"
    type: related_to
  - target: "概念/ppu-smi"
    type: related_to
  - target: "概念/cuda-platform"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "rocm-smi 是 AMD GPU 的系统管理 CLI 工具，对标 nvidia-smi。AI Stack 异构 GPU 集群中 AMD 节点的监控入口，支持 MI300X 等数据中心 GPU。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-07-21
aliases:
  - "rocm-smi"
  - "ROCm SMI"
  - "AMD GPU 监控"
---

# rocm-smi AMD GPU 监控工具

> **一句话理解**: rocm-smi 是 AMD GPU 的"nvidia-smi"——ROCm 生态的 GPU 监控 CLI，查看 AMD MI300X 等 GPU 的利用率/显存/温度/功耗。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全名** | ROCm System Management Interface |
| **厂商** | AMD |
| **生态** | ROCm (Radeon Open Compute) |
| **对标** | nvidia-smi (NVIDIA) |
| **适用 GPU** | AMD Instinct MI200/MI300 系列 |

---

## 2. AI Stack GPU 监控完整矩阵

| GPU 类型 | 监控工具 | 厂商 |
|----------|---------|------|
| NVIDIA A100/H100 | nvidia-smi | NVIDIA |
| 阿里云 APG | ppu-smi | 阿里云 |
| **AMD MI300X** | **rocm-smi** ← 本文 | AMD |
| 华为昇腾 | npu-smi | 华为 |

---

## 3. 核心命令

```bash
# 查看 GPU 概览
rocm-smi

# 查看 GPU 利用率
rocm-smi --showuse

# 查看显存使用
rocm-smi --showmeminfo vram

# 查看温度
rocm-smi --showtemp

# 查看功耗
rocm-smi --showpower

# 查看运行进程
rocm-smi --showpids

# 持续监控（JSON 输出，适合 Prometheus）
rocm-smi --json
```

---

## 4. 与 nvidia-smi 对比

| 功能 | nvidia-smi | rocm-smi |
|------|-----------|---------|
| **GPU 利用率** | ✅ | ✅ |
| **显存使用** | ✅ | ✅ |
| **温度/功耗** | ✅ | ✅ |
| **进程列表** | ✅ | ✅ |
| **MIG 支持** | ✅ | ❌ (AMD 无 MIG) |
| **JSON 输出** | ✅ | ✅ |
| **持续监控** | `-l` | `--showuse --watch` |
| **GPU 时钟频率** | ✅ | ✅ |

---

## 5. 2026 年 AMD GPU 生态

| GPU | 定位 | 显存 | AI Stack 支持 |
|-----|------|:----:|:-----------:|
| **MI300X** | 数据中心旗舰 | 192GB HBM3 | ✅ vLLM/ROCm |
| **MI325X** | 升级版 | 256GB HBM3e | ✅ |
| **MI400** (2026) | 下一代 | 288GB | 开发中 |
| **RX 7900** | 消费级 | 24GB | 部分支持 |

> AMD GPU 在 AI Stack 中作为 NVIDIA 的补充，主要用于成本敏感型推理集群。rocm-smi 是运维监控的必备工具。

## 延伸阅读

- [[概念/LLM/nvidia-smi|nvidia-smi]]
- [[概念/LLM/ppu-smi|ppu-smi]]
- [[概念/Inference/model-serving|模型服务]]
- [[架构基建/AI_Stack_Deep_Dive|AI Stack 深度解析]]
