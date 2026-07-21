---
title: "ppu-smi APG GPU 监控工具 (APG GPU Monitoring CLI)"
category: -concepts
tags: ["ppu-smi", "apg", "gpu-monitoring", "ai-stack", "chinese-gpu"]
relationships:
  - target: "概念/apg-gpu"
    type: related_to
  - target: "概念/nvidia-smi"
    type: related_to
  - target: "概念/ascend-npu"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "ppu-smi 是阿里云 APG 自研加速卡的监控 CLI 工具，对标 nvidia-smi，提供 GPU 利用率/显存/温度/功耗等实时监控。AI Stack APG 节点的专属监控入口。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: supporting
created: 2026-06-16
updated: 2026-07-21
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

- [[概念/apg-gpu]] — APG 自研加速卡
- [[概念/nvidia-smi]] — nvidia-smi GPU 监控
- [[概念/ascend-npu]] — 华为昇腾 NPU
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 GPU 监控生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **ppu-smi v2** | APG 加速卡监控，支持功耗/温度/显存/利用率 | GA |
| **nvidia-smi (DCGM)** | NVIDIA GPU 监控，支持 NVLink/ECC/健康检查 | GA |
| **npu-smi (CANN)** | 华为昇腾 NPU 监控，支持 Ascend 910B/910C | GA |
| **rocm-smi** | AMD GPU 监控，支持 MI300X | GA |
| **Prometheus GPU Exporter** | 统一采集多厂商 GPU 指标，Grafana 大盘展示 | GA |

## 生产最佳实践

1. **监控全覆盖**：所有 GPU 节点部署对应监控工具，确保无盲区
2. **告警阈值设置**：温度 >85°C、显存 >90%、利用率持续 <10% 时告警
3. **定期健康检查**：每日自动运行 GPU 健康检查，及时发现硬件故障
4. **统一大盘**：使用 Prometheus + Grafana 统一展示多厂商 GPU 指标
5. **日志关联**：GPU 指标与推理服务日志关联，便于问题定位
