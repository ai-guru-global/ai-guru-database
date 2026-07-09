---
title: "ppu-smi APG GPU 监控工具 (APG GPU Monitoring CLI)"
category: -concepts
tags: ["ppu-smi", "apg", "gpu-monitoring", "ai-stack", "chinese-gpu"]
relationships:
  - target: "_concepts/apg-gpu"
    type: related_to
  - target: "_concepts/nvidia-smi"
    type: related_to
  - target: "_concepts/ascend-npu"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "ppu-smi 是阿里云 APG 自研加速卡的监控 CLI 工具，对标 nvidia-smi，提供 GPU 利用率/显存/温度/功耗等实时监控。AI Stack APG 节点的专属监控入口。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: supporting
---

# ppu-smi APG GPU 监控工具

> **一句话理解**: ppu-smi 是 APG 加速卡的"nvidia-smi"——阿里云自研 GPU 的专属监控 CLI，实时查看 GPU 利用率/显存/温度/功耗。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **工具名** | ppu-smi (PPU System Management Interface) |
| **适用硬件** | 阿里云 APG 自研加速卡 |
| **对标** | nvidia-smi (NVIDIA) |
| **功能** | GPU 状态监控、显存查看、温度/功耗 |
| **AI Stack** | APG 节点预装 |

---

## 2. AI Stack GPU 监控工具矩阵

| GPU 类型 | 监控工具 | 厂商 |
|----------|---------|------|
| **APG** | ppu-smi ← 本文 | 阿里云 |
| **NVIDIA** | nvidia-smi | NVIDIA |
| **AMD** | rocm-smi | AMD |
| **昇腾** | npu-smi | 华为 |
| **通用** | gpustat | 开源 |

---

## 3. 与 nvidia-smi 对比

| 功能 | nvidia-smi | ppu-smi |
|------|-----------|---------|
| **GPU 利用率** | ✅ | ✅ |
| **显存使用** | ✅ | ✅ |
| **温度监控** | ✅ | ✅ |
| **功耗监控** | ✅ | ✅ |
| **GPU 型号** | ✅ | ✅ |
| **CUDA 版本** | ✅ | N/A（兼容 CUDA API） |
| **进程列表** | ✅ | ✅ |
| **持续监控** | `-l` / `--query-gpu` | `-l` |
| **导出 CSV** | `--query-gpu --format=csv` | 支持 |

---

## 4. 典型使用场景

```bash
# 查看 APG GPU 状态概览
ppu-smi

# 持续监控（每 2 秒刷新）
ppu-smi -l 2

# 查看 GPU 显存使用
ppu-smi --query-gpu=memory.used,memory.total

# 查看 GPU 温度
ppu-smi --query-gpu=temperature.gpu

# 查看运行中的推理进程
ppu-smi --query-compute-apps
```

---

## 5. 在 AI Stack 监控体系中的位置

```
AI Stack GPU 监控体系
│
├── APG 节点
│   ├── ppu-smi（命令行）← 本文
│   └── AI Stack 监控面板（Web UI）
│
├── NVIDIA 节点
│   ├── nvidia-smi（命令行）
│   └── pmon（持续监控）
│
├── 昇腾节点
│   └── npu-smi（命令行）
│
└── 统一监控
    └── Prometheus + Grafana 采集
```

---

## Related

- [[_concepts/apg-gpu]] — APG 自研加速卡
- [[_concepts/nvidia-smi]] — nvidia-smi GPU 监控
- [[_concepts/ascend-npu]] — 华为昇腾 NPU
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
