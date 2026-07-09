---
title: "AI Stack GPU 监控指南"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "gpu", "monitoring", "nvidia-smi", "ppu-smi", "rocm-smi", "pmon"]
summary: "> **一句话理解**: AI Stack 支持 NVIDIA、国产 PPU（平头哥）、AMD 等多种加速器，分别使用 nvidia-smi、ppu-smi、rocm-smi 做卡级监控，pmon 做进程级细粒度监控。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Ai Stack Gpu Monitoring Guide"
  - "AI Stack GPU Monitoring Guide"
  - AI_Stack_GPU_Monitoring_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# AI Stack GPU 监控指南

> **一句话理解**: AI Stack 支持 NVIDIA、国产 PPU（平头哥）、AMD 等多种加速器，分别使用 `nvidia-smi`、`ppu-smi`、`rocm-smi` 做卡级监控，`pmon` 做进程级细粒度监控。

---

## 1. 工具选型矩阵

| 工具 | 硬件 | 监控粒度 | 核心命令 |
|------|------|----------|----------|
| **nvidia-smi** | NVIDIA GPU | 卡级 / 进程级 | `nvidia-smi`、`nvidia-smi dmon`、`nvidia-smi nvlink` |
| **ppu-smi** | 国产 PPU（平头哥） | 卡级 / 进程级 | `ppu-smi`、`ppu-smi -l 1` |
| **rocm-smi** | AMD GPU | 卡级 | `rocm-smi --showmeminfo` |
| **pmon** | 通用（进程级） | 进程级 | `pmon` |

---

## 2. 常用命令

### 2.1 nvidia-smi

```bash
# 静态快照：卡状态、驱动、CUDA 版本、每个进程占用
nvidia-smi

# 持续监控（每秒刷新，dmon = device monitoring）
nvidia-smi dmon -s pucm -d 1

# 查看 NVLink / 卡间互联状态
nvidia-smi nvlink -e
nvidia-smi nvlink -r  # 重置计数器

# 查看 GPU 功耗与温度
nvidia-smi -q -d TEMPERATURE,POWER

# 查看指定 GPU 上进程
nvidia-smi pmon -s um -o T
```

### 2.2 ppu-smi（平头哥 PPU）

```bash
# 静态快照
ppu-smi

# 每秒刷新一次
ppu-smi -l 1

# 查看每个进程的 PPU 占用
ppu-smi -p
```

### 2.3 rocm-smi（AMD GPU）

```bash
# 查看显存信息
rocm-smi --showmeminfo

# 持续刷新
rocm-smi --showuse --csv
```

### 2.4 pmon（进程级监控）

```bash
# 查看每个进程的 GPU 占用
pmon

# 通常与 sort 配合，按显存占用排序
pmon | sort -k4 -n
```

---

## 3. 生产环境 Checklist

- [ ] 关键节点部署 `nvidia-smi dmon` / `ppu-smi -l 1` 的 systemd timer 或 node-exporter 插件，持续采集 GPU 利用率、显存、温度、功耗。
- [ ] 设置显存占用 > 90%、温度 > 阈值、Xid 错误码的告警。
- [ ] 训练/推理任务启动前，先用监控工具确认目标 GPU 空闲，避免抢占。
- [ ] 多卡训练场景，使用 `nvidia-smi nvlink` 验证卡间互联带宽是否正常。
- [ ] 记录基线：空闲/满载时的温度、功耗、显存占用，用于后续异常对比。
- [ ] 容器内监控需确保 `/dev/nvidiactl`、`/dev/nvidia-uvm` 和 GPU 设备已正确映射。

---

## 4. 故障排查速查

| 现象 | 排查命令 | 常见原因 |
|------|----------|----------|
| GPU 利用率持续为 0 | `nvidia-smi dmon` | 数据加载瓶颈、CPU 预处理慢、进程卡住 |
| 显存溢出 OOM | `nvidia-smi` 查看 `Memory-Usage` | batch size 过大、KV Cache 过长、内存泄漏 |
| 温度/功耗异常 | `nvidia-smi -q -d TEMPERATURE,POWER` | 散热故障、风扇停转、机柜风道堵塞 |
| 多卡训练卡慢 | `nvidia-smi nvlink -e` | NVLink/RoCE 链路降速、拓扑未优化 |
| PPU 进程无输出 | `ppu-smi -p` | 驱动未加载、进程未绑定 PPU |
| 监控命令找不到设备 | `lspci \| grep -i nvidia/amd/ppu` | 驱动未安装、PCIe 设备未识别 |

---

## 5. 关键指标说明

| 指标 | 含义 | 健康参考 |
|------|------|----------|
| GPU Util | GPU 计算单元利用率 | 训练通常 > 80%；推理视并发而定 |
| Memory-Usage | 显存已用 / 总量 | 长期 > 90% 需警惕 OOM |
| Temperature | GPU 温度 | 一般 < 85°C（NVIDIA A100/H100） |
| Power Draw | 实际功耗 | 接近 TDP 为正常满载 |
| NVLink/RCCL BW | 卡间通信带宽 | 应接近理论带宽，低于 50% 需排查 |

---

## Related

- [[架构基建/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[架构基建/AI_Stack_Container_Runtime_Guide|AI Stack 容器与运行时指南]]
- [[架构基建/AI_Stack_Inference_Serving_Guide|AI Stack 推理服务指南]]
- [[架构基建/AI_Stack_Training_Launchers_Guide|AI Stack 训练启动器指南]]
- [[部署推理/Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[模型训练/Monitoring/Training_Monitoring_2026|训练监控与实验追踪 2026]]
- [[_concepts/gpu-operator|GPU Operator]]
