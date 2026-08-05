---
title: "MIG"
category: -concepts
tags: ["gpu", "nvidia", "virtualization", "multi-tenant", "alibaba-cloud"]
summary: "MIG（Multi-Instance GPU）是 NVIDIA 提供的 GPU 硬件级切片技术，可将单张 GPU 物理划分为多个独立实例，实现强隔离的多租户共享。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Multi-Instance GPU"
  - "NVIDIA MIG"
relationships:
  - target: "概念/gpu"
    type: part_of
  - target: "概念/gpu-sharing"
    type: is_a
  - target: "概念/hami"
    type: related_to
sources: []
name_zh: "多实例 GPU"
---

# MIG

> 中文简称：多实例 GPU

> **一句话理解**: MIG 能把一张 A100/H100 物理切成最多 7 个独立小 GPU，每个实例有自己的显存和计算单元，互不干扰。

## 核心要点

- **硬件级隔离**: 在 GPU 硬件层面划分计算和显存资源。
- **强隔离**: 比时间片虚拟化更安全，适合多租户。
- **支持的 GPU**: A100、H100、H200 等数据中心 GPU。
- **Profile 配置**: 如 `1g.5gb`、`2g.10gb`、`3g.20gb` 等。
- **与 Kubernetes 集成**: 通过 NVIDIA Device Plugin 暴露为 `nvidia.com/mig-1g.5gb` 等资源。

## 常用命令

```bash
# 查看 MIG 状态
nvidia-smi mig -lgi
nvidia-smi mig -lci

# 创建 MIG 实例
nvidia-smi mig -cgi 19 -C
```

## 与 HAMi 对比

| 特性 | MIG | HAMi |
|------|-----|------|
| 隔离级别 | 硬件级 | 软件级 |
| 灵活性 | 固定 profile | 更灵活 |
| 支持 GPU | A100/H100 等 | 多厂商 |
| 显存超卖 | 不支持 | 支持 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，MIG 可用于 A100/H100 GPU 的多租户隔离。工单中「GPU 资源争抢」或「需要强隔离」时，可考虑 MIG。

## Related

- [[概念/gpu|GPU]]
- [[概念/gpu-sharing|GPU Sharing]]
- [[概念/hami|HAMi]]
- [[概念/time-slicing|Time Slicing]]
- [[13_运维/02_SRE与可靠性/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]

---

## 2026 MIG 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **MIG (A100/H100)** | 多实例 GPU，硬件级隔离 | GA |
| **MIG 7 实例** | A100 最多切分 7 个实例 | GA |
| **MIG + K8s** | Kubernetes 原生 MIG 支持 | GA |
| **MIG 监控** | 每实例独立监控指标 | GA |
| **MIG 配置文件** | 预定义 MIG 配置模板 | GA |

## 生产最佳实践

1. **多租户必用**：多租户场景用 MIG 硬件隔离
2. **实例规格选择**：根据任务选择 1g/2g/3g/4g/7g 实例
3. **与 Time-Slicing 对比**：MIG 硬件隔离，Time-Slicing 软件隔离
4. **K8s 集成**：用 NVIDIA Device Plugin 管理 MIG
5. **监控每实例**：监控每个 MIG 实例的利用率

## 2026 MIG 生态

| GPU | MIG 支持 | 最大实例数 |
|------|------|------|
| **H100** | 支持 | 7 |
| **A100** | 支持 | 7 |
| **A30** | 支持 | 4 |

## 延伸阅读

- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — NVIDIA GPU
- [[概念/GPU/gpu|GPU]] — GPU 基础
- [[概念/K8s/kubernetes|Kubernetes]] — 容器编排

> ℹ️ MIG 是 NVIDIA 的多实例 GPU 技术，将单个 GPU 切分为多个独立实例。

## MIG 切分配置

| GPU | 最大实例 | 切分方式 |
|------|------|------|
| **H100 80GB** | 7 | 1g.10gb / 2g.20gb / 3g.40gb / 7g.80gb |
| **A100 80GB** | 7 | 1g.10gb / 2g.20gb / 3g.40gb / 7g.80gb |
| **A100 40GB** | 7 | 1g.5gb / 2g.10gb / 3g.20gb / 7g.40gb |

## MIG 配置示例

```bash
# 启用 MIG
nvidia-smi -i 0 -mig 1

# 创建 MIG 实例
nvidia-smi mig -i 0 -cgi 9,9,9 -C

# 查看 MIG 实例
nvidia-smi mig -i 0 -lgi
nvidia-smi mig -i 0 -lci

# 删除 MIG 实例
nvidia-smi mig -i 0 -dci
nvidia-smi mig -i 0 -dgi
```

## 生产最佳实践

1. **多租户隔离**：MIG 提供硬件级隔离
2. **资源规划**：根据负载规划 MIG 切分
3. **K8s 集成**：用 NVIDIA Device Plugin
4. **监控每实例**：监控每个 MIG 实例
5. **性能测试**：测试 MIG 性能开销

## 检查清单

- [ ] MIG 已启用
- [ ] 切分配置已规划
- [ ] K8s 集成已配置
- [ ] 监控已配置

## 常见问题

| 问题 | 解决方案 |
|------|------|
| MIG 启用失败 | 检查 GPU 型号支持 |
| 实例创建失败 | 检查切分配置 |
| 性能开销 | 测试 MIG 性能影响 |
| K8s 调度失败 | 检查 Device Plugin |

## 适用场景

| 场景 | 推荐度 | 说明 |
|------|------|------|
| **多租户推理** | ⭐⭐⭐⭐⭐ | 硬件级隔离 |
| **开发测试** | ⭐⭐⭐⭐ | 资源切分 |
| **小模型训练** | ⭐⭐⭐ | 资源隔离 |
| **大模型训练** | ⭐ | 不适合 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| MIG 无法启用 | GPU 不支持 | 仅 A100/H100/B200 支持 MIG |
| 实例创建失败 | profile 不兼容 | 检查支持的 profile 组合 |
| 性能下降 | 切分过细 | 减少实例数，使用更大的 profile |
| 容器无法访问 | 未配置 runtime | 使用 `nvidia-container-runtime` + MIG 模式 |
| 显存不足 | 实例显存太小 | 选择更大的 memory profile |

## 延伸阅读

- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — 支持 MIG 的 GPU 型号
- [[概念/GPU/heterogeneous-gpu|异构 GPU]] — GPU 资源管理
- [[概念/K8s/gpu-operator|GPU Operator]] — K8s MIG 调度
- [[概念/GPU/gpustack|GPUStack]] — GPU 集群管理
- [[概念/Inference/model-serving|模型服务]] — 多租户推理部署

> ℹ️ MIG 是 NVIDIA 数据中心 GPU 的硬件级虚拟化，2026年 H100/B200 支持最多 7 个独立实例，适合多租户推理、开发测试等需要资源隔离的场景。

## 2026 MIG 生态现状

| GPU 型号 | 最大实例数 | 显存切分 | 说明 |
|------|------|------|------|
| B200 | 7 | 192GB 切分 | 最新支持 |
| H100 | 7 | 80GB 切分 | 主流部署 |
| A100 | 7 | 80GB 切分 | 存量集群 |
| L40S | 4 | 48GB 切分 | 推理专用 |
| K8s 集成 | ✅ | Device Plugin | 自动调度 |
| 容器支持 | ✅ | nvidia-runtime | 透明访问 |

## 检查清单

- [ ] GPU 型号支持 MIG（A100/H100/B200）
- [ ] MIG 模式已启用
- [ ] profile 组合已规划
- [ ] 容器 runtime 已配置
- [ ] K8s Device Plugin 已部署
- [ ] 资源配额已设置
- [ ] 监控已接入
