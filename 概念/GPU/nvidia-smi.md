---
title: "nvidia-smi GPU 监控工具 (NVIDIA System Management Interface)"
category: -concepts
tags: ["nvidia-smi", "gpu-monitoring", "nvidia", "diagnostics", "ai-stack-ops"]
relationships:
  - target: "概念/ai-hardware"
    type: related_to
  - target: "概念/cuda-platform"
    type: related_to
  - target: "概念/gpu-virtualization"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "nvidia-smi 是 NVIDIA GPU 的标准监控诊断工具，提供 GPU 利用率、显存、温度、功耗等实时信息。AI Stack 环境中还有 ppu-smi（APG）和 rocm-smi（AMD）替代方案。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
name_zh: "nvidia-smi GPU 监控工具"
---

# nvidia-smi GPU 监控工具

> 中文简称：nvidia-smi GPU 监控工具

> **一句话理解**: nvidia-smi 是 GPU 运维的"仪表盘"——一行命令看 GPU 状态，AI Stack 生产工具链的核心监控组件。

---

## 1. 定位

nvidia-smi（NVIDIA System Management Interface）是 NVIDIA GPU 的**标准监控和诊断工具**，随 NVIDIA 驱动自动安装：

| 维度 | 信息 |
|------|------|
| **全称** | NVIDIA System Management Interface |
| **类型** | CLI 命令行工具 |
| **安装** | 随 NVIDIA 驱动自动安装 |
| **功能** | GPU 状态监控、进程管理、功耗控制 |
| **输出** | 实时数据 + 历史日志 |

---

## 2. 核心命令

### 2.1 基础状态查看

```bash
# 查看 GPU 概况（最常用）
nvidia-smi

# 输出示例
# +-----------------------------------------------------------------------------+
# | NVIDIA-SMI 535.129.03   Driver Version: 535.129.03   CUDA Version: 12.2     |
# |-------------------------------+----------------------+----------------------+
# | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
# | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
# |===============================+======================+======================|
# |   0  NVIDIA H800         On   | 00000000:01:00.0 Off |                    0 |
# | N/A   35C    P0    75W / 700W |  32768MiB / 81920MiB |     45%      Default |
# +-------------------------------+----------------------+----------------------+
```

### 2.2 常用参数

| 命令 | 说明 |
|------|------|
| `nvidia-smi` | 基础概况 |
| `nvidia-smi -q` | 详细信息（全量） |
| `nvidia-smi -q -d UTILIZATION` | 利用率详情 |
| `nvidia-smi -q -d MEMORY` | 显存详情 |
| `nvidia-smi -q -d POWER` | 功耗详情 |
| `nvidia-smi -q -d TEMPERATURE` | 温度详情 |
| `nvidia-smi --query-gpu=name,memory.used,utilization.gpu --format=csv` | CSV 格式输出 |
| `nvidia-smi dmon -s u` | 持续监控利用率 |
| `nvidia-smi pmon -c 1` | 进程级监控 |
| `nvidia-smi nvlink -s` | NVLink 状态 |
| `nvidia-smi topo -m` | GPU 拓扑矩阵 |

### 2.3 持续监控

```bash
# 每 2 秒刷新 GPU 状态
watch -n 2 nvidia-smi

# 持续监控 GPU 利用率（1秒间隔）
nvidia-smi dmon -d 1 -s u

# 记录到文件
nvidia-smi dmon -d 1 -o D -f gpu_metrics.csv
```

---

## 3. AI Stack 多 GPU 监控工具对比

AI Stack 支持三种 GPU 厂商，各有专用监控工具：

| 工具 | 适用 GPU | 安装方式 | 命令 |
|------|----------|----------|------|
| **nvidia-smi** | NVIDIA GPU | NVIDIA 驱动自带 | `nvidia-smi` |
| **ppu-smi** | APG（阿里云） | AI Stack 系统自带 | `ppu-smi` |
| **rocm-smi** | AMD GPU | ROCm 驱动自带 | `rocm-smi` |

### 功能对比

| 功能 | nvidia-smi | ppu-smi | rocm-smi |
|------|-----------|---------|----------|
| GPU 利用率 | ✅ | ✅ | ✅ |
| 显存使用 | ✅ | ✅ | ✅ |
| 温度监控 | ✅ | ✅ | ✅ |
| 功耗监控 | ✅ | ✅ | ✅ |
| 进程列表 | ✅ | ✅ | ✅ |
| NVLink/互联状态 | ✅ | ✅ (HCCS) | ✅ (xGMI) |
| GPU 虚拟化 (MIG) | ✅ | ✅ | 部分 |
| 时钟频率调节 | ✅ | 有限 | ✅ |
| 持续监控 (dmon) | ✅ | 有限 | ✅ |

---

## 4. 关键指标解读

### 4.1 GPU 利用率

| 数值范围 | 状态 | 含义 |
|----------|------|------|
| 0-10% | 空闲 | GPU 未被充分利用 |
| 10-50% | 低负载 | 可能是内存瓶颈或 CPU 瓶颈 |
| 50-80% | 正常 | 推理服务正常运行 |
| 80-100% | 高负载 | 接近饱和 |
| 100% | 满载 | 需关注是否排队 |

### 4.2 显存使用

| 指标 | 说明 |
|------|------|
| Memory-Usage | 已用/总显存 |
| BAR1 | PCIe BAR 内存映射 |
| FB | Frame Buffer（显存主体） |

### 4.3 功耗与温度

| 指标 | 正常范围 | 警告 |
|------|----------|------|
| 温度 | 30-75°C | >85°C 需关注 |
| 功耗 | <80% TDP | 接近 TDP 上限 |
| 风扇 | 自动调节 | 异常噪音 |

---

## 5. pmon 进程级监控

```bash
# 查看哪些进程占用 GPU
nvidia-smi pmon -c 1

# 输出示例
# # gpu   pid  type    sm   mem   enc   dec  fb   command
# # Idx     #   C/G     %     %     %     %   MB   name
#    0  1234   C      45    12     0     0 32768  python
#    0  5678   C      30     8     0     0 16384  python
```

| 列 | 说明 |
|----|------|
| sm | SM (Shader) 利用率 |
| mem | 显存控制器利用率 |
| enc | 编码器利用率 |
| dec | 解码器利用率 |
| fb | Frame Buffer 使用量 |

---

## 6. GPU 拓扑查看

```bash
# 查看 GPU 间互联拓扑
nvidia-smi topo -m

# 输出示例（8 卡 NVLink）
#        GPU0    GPU1    GPU2    GPU3
# GPU0    X     NV18    NV18    NV18
# GPU1   NV18    X      NV18    NV18
# GPU2   NV18   NV18     X      NV18
# GPU3   NV18   NV18    NV18     X
```

| 连接类型 | 说明 | 带宽 |
|----------|------|------|
| NV18 | NVLink 第 18 代 | 900 GB/s |
| NV12 | NVLink 第 12 代 | 600 GB/s |
| PIX | PCIe Switch | ~64 GB/s |
| PHB | PCIe Host Bridge | ~32 GB/s |
| SYS | 跨 NUMA | ~12 GB/s |

---

## 7. 在 AI Stack 运维中的角色

```
AI Stack GPU 监控流程
│
├── 日常巡检
│   ├── nvidia-smi / ppu-smi — 快速查看 GPU 状态
│   ├── AI Stack 控制台 — GPU 监控面板
│   └── 告警管理 — P1-P4 自动告警
│
├── 故障排查
│   ├── nvidia-smi pmon — 进程级 GPU 占用
│   ├── nvidia-smi dmon — 持续性能监控
│   └── nvidia-smi nvlink — 互联链路状态
│
└── 性能调优
    ├── GPU 利用率分析 — 识别瓶颈
    ├── 显存碎片检查 — MIG 配置优化
    └── 功耗管理 — 动态频率调整
```

---

## Related

- [[概念/ai-hardware]] — AI 硬件
- [[概念/cuda-platform]] — CUDA 计算平台
- [[概念/gpu-virtualization]] — GPU 虚拟化
- [[概念/gpu-interconnect]] — GPU 互联
- [[概念/checkpoint]] — Checkpoint 检查点
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 nvidia-smi 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **nvidia-smi 560+** | NVIDIA 官方 GPU 监控工具 | GA |
| **DCGM** | 数据中心级 GPU 监控 | GA |
| **NVML API** | 编程式 GPU 管理接口 | GA |
| **Prometheus 集成** | GPU 指标导出到 Prometheus | GA |
| **MIG 监控** | 多实例 GPU 分区监控 | GA |

## 生产最佳实践

1. **持续监控**：生产环境用 DCGM 而非 nvidia-smi 轮询
2. **告警阈值**：GPU 温度 > 85°C、利用率 < 10% 持续 5min 告警
3. **显存监控**：跟踪显存使用率，接近 100% 需扩容
4. **日志记录**：定期记录 GPU 状态，用于容量规划
5. **MIG 分区**：多租户场景用 MIG 隔离 GPU 资源
