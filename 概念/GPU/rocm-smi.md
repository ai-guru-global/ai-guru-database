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
  - 12_架构基建/AI_Stack_Deep_Dive.md
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

---

## 6. 高级监控与自动化

### Prometheus + Grafana 集成

```bash
# 安装 ROCm SMI Exporter（Prometheus 格式输出）
rocm-smi --json > /tmp/gpu_metrics.json

# 或使用 amd_smi_exporter 持续暴露指标
# 默认端口 :9400/metrics
amd_smi_exporter --port 9400 &
```

```yaml
# prometheus.yml 配置
scrape_configs:
  - job_name: 'amd-gpu'
    static_configs:
      - targets: ['gpu-node-01:9400', 'gpu-node-02:9400']
    scrape_interval: 15s
```

### 关键告警指标

| 指标 | 阈值 | 含义 |
|------|:----:|------|
| GPU 温度 | >85°C | 过热降频风险 |
| VRAM 使用率 | >95% | OOM 风险 |
| GPU 利用率 | <10% 持续5min | 任务可能挂起 |
| 功耗 | >TDP 90% | 接近功率上限 |
| ECC 错误 | >0 | 显存硬件问题 |

### 常见运维命令

```bash
# 查看 ECC 错误计数
rocm-smi --showecc

# 重置 GPU（需停止所有进程）
rocm-smi --gpureset -d 0

# 设置功耗上限（瓦特）
rocm-smi --setpoweroverdrive 300 -d 0

# 查看固件版本
rocm-smi --showfwinfo

# 查看 PCIe 带宽
rocm-smi --showpciebwwidth

# 查看 XGMI 互联拓扑（多卡）
rocm-smi --showtopo
```

---

## 7. ROCm 生态工具链

| 工具 | 用途 | 对标 NVIDIA |
|------|------|------------|
| **rocm-smi** | GPU 监控管理 | nvidia-smi |
| **rocprof** | 性能分析 | Nsight Compute |
| **rocgdb** | GPU 调试 | cuda-gdb |
| **rocBLAS** | 线性代数库 | cuBLAS |
| **MIOpen** | 深度学习原语 | cuDNN |
| **RCCL** | 集合通信 | NCCL |
| **hipBLAS** | 统一 BLAS 接口 | - |

---

## 8. 生产最佳实践

1. **持续监控**：部署 amd_smi_exporter + Prometheus + Grafana 全链路监控
2. **温度管理**：数据中心保持进风温度 <25°C，避免 GPU 降频
3. **ECC 巡检**：每日检查 ECC 错误，发现即换卡
4. **固件更新**：定期更新 GPU 固件，修复已知问题
5. **XGMI 拓扑**：多卡训练前确认 XGMI 互联拓扑最优
6. **功耗调优**：推理场景适当降低功耗上限，节省电费
7. **驱动兼容**：ROCm 版本与内核版本严格匹配，升级前充分测试

## 延伸阅读

- [[概念/GPU/nvidia-smi|nvidia-smi]]
- [[概念/GPU/ppu-smi|ppu-smi]]
- [[概念/Inference/model-serving|模型服务]]
- [[12_架构基建/AI_Stack_Deep_Dive|AI Stack 深度解析]]
- [[13_运维/GPU_Monitoring|GPU 监控体系]]

---

## 2026 ROCm SMI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **ROCm 6.x** | AMD 开源 GPU 计算平台 | GA |
| **rocm-smi** | AMD GPU 监控管理工具 | GA |
| **MI300X 支持** | 最新 AMD 数据中心 GPU | GA |
| **vLLM ROCm** | vLLM 支持 AMD GPU | GA |
| **PyTorch ROCm** | PyTorch 原生支持 ROCm | GA |

## 生产最佳实践

1. **硬件选择**：AMD MI300X 性价比高，但生态成熟度低于 NVIDIA
2. **驱动版本**：ROCm 版本与内核强绑定，必须严格匹配
3. **监控集成**：用 rocm-smi 导出指标到 Prometheus
4. **性能对比**：与 NVIDIA 同级别 GPU 对比实际推理性能
5. **回退方案**：ROCm 不支持的模型回退 CPU 推理
