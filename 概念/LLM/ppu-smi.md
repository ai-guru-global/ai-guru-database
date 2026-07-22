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
6. **容量规划**：根据 GPU 利用率趋势规划扩容计划
7. **固件管理**：定期更新 GPU 固件，修复已知问题

## 多厂商 GPU 监控统一架构

```
┌─────────────────────────────────────────┐
│  Grafana 统一大盘                        │
├─────────────────────────────────────────┤
│  Prometheus / VictoriaMetrics            │
├───────┬───────┬───────┬─────────────────┤
│ nvidia│ ppu   │ npu   │ rocm            │
│ -smi  │ -smi  │ -smi  │ -smi            │
│exporter│exporter│exporter│exporter       │
├───────┼───────┼───────┼─────────────────┤
│NVIDIA │阿里云 │华为   │ AMD             │
│H100   │APG    │昇腾   │ MI300X          │
└───────┴───────┴───────┴─────────────────┘
```

## 关键监控指标对比

| 指标 | nvidia-smi | ppu-smi | npu-smi | rocm-smi |
|------|:----------:|:-------:|:-------:|:--------:|
| GPU 利用率 | ✅ | ✅ | ✅ | ✅ |
| 显存使用 | ✅ | ✅ | ✅ | ✅ |
| 温度 | ✅ | ✅ | ✅ | ✅ |
| 功耗 | ✅ | ✅ | ✅ | ✅ |
| ECC 错误 | ✅ | ✅ | ✅ | ✅ |
| 进程列表 | ✅ | ✅ | ✅ | ✅ |
| NVLink/XGMI | ✅ | - | - | ✅ |
| JSON 输出 | ✅ | ✅ | ✅ | ✅ |

## 延伸阅读

- [[概念/LLM/nvidia-smi|nvidia-smi]]
- [[概念/LLM/rocm-smi|rocm-smi]]
- [[概念/LLM/llm-infrastructure|LLM 基础设施]]
- [[架构基建/AI_Stack_Deep_Dive|AI Stack 深度解析]]
- [[运维/GPU_Monitoring|GPU 监控体系]]
- [[架构基建/GPU_Cluster_Management|GPU 集群管理]]

## 常见运维场景

| 场景 | 命令/操作 | 说明 |
|------|---------|------|
| 日常巡检 | `ppu-smi` | 查看概览状态 |
| 显存泄漏排查 | `ppu-smi --showmeminfo` | 对比进程显存占用 |
| 过热降频 | `ppu-smi --showtemp` | 检查温度是否超阈 |
| 任务挂起 | `ppu-smi --showpids` | 查看占用进程 |
| 性能下降 | `ppu-smi --showuse` | 检查利用率是否异常 |
| 硬件故障 | `ppu-smi --showecc` | 检查 ECC 错误计数 |

## 告警规则示例

```yaml
# Prometheus 告警规则
groups:
  - name: gpu-alerts
    rules:
      - alert: GPU_Temperature_High
        expr: gpu_temperature_celsius > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "GPU 温度过高: {{ $value }}°C"

      - alert: GPU_Memory_Near_Full
        expr: gpu_memory_used_bytes / gpu_memory_total_bytes > 0.95
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "GPU 显存即将耗尽"

      - alert: GPU_Underutilized
        expr: gpu_utilization < 10
        for: 10m
        labels:
          severity: info
        annotations:
          summary: "GPU 利用率过低，可能任务挂起"
```
