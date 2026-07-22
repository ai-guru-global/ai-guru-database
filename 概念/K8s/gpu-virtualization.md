---
title: "GPU 虚拟化 (GPU Virtualization)"
category: -concepts
tags: ["gpu-virtualization", "gpu-sharing", "MIG", "vGPU", "multi-instance", "isolation"]
relationships:
  - target: "概念/ai-hardware"
    type: builds_on
  - target: "概念/model-serving"
    type: enables
  - target: "概念/heterogeneous-gpu"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "GPU 虚拟化将单块物理 GPU 切分为多个虚拟实例，支持多租户共享。主要方案包括 NVIDIA MIG（硬件级）、vGPU（驱动级）、算力/显存隔离（软件级）和时间分片。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-07-21
aliases:
  - "Gpu Virtualization"
  - "gpu virtualization"

---
# GPU 虚拟化 (GPU Virtualization)

> 一块 GPU 切给多个用户用——从独占到共享的资源效率革命。

---

## 1. 定义

**GPU 虚拟化**是将单块物理 GPU 的计算资源（算力/显存）切分给多个租户或任务共享使用的技术。核心目标：提高 GPU 利用率（从典型 30% 提升到 80%+），降低多租户场景下的单位推理成本。

---

## 2. 主要方案对比

| 方案 | 级别 | 隔离性 | 粒度 | 代表 |
|------|------|--------|------|------|
| **MIG** (Multi-Instance GPU) | 硬件级 | 强（独立 SM/L2/显存） | 固定分区 | NVIDIA A100/H100 |
| **vGPU** | 驱动级 | 中（共享物理 GPU） | 灵活配置 | NVIDIA GRID, Intel GVT-g |
| **算力/显存隔离** | 软件级 | 弱（进程级隔离） | 任意比例 | AI Stack GPU 共享模式 |
| **时间分片** | OS 级 | 最弱（上下文切换） | 时间片 | MPS, CUDA Context |
| **容器化 GPU** | 容器级 | 中（cgroup 隔离） | 整卡/部分 | NVIDIA Device Plugin (K8s) |

---

## 3. NVIDIA MIG (Multi-Instance GPU)

MIG 将单块 GPU 硬件切分为最多 7 个独立实例，每个实例拥有专属的 SM、L2 Cache 和显存：

```
A100 80GB (完整 GPU)
├── 1g.10gb  ×7  (每实例: 1/7 SM, 10GB 显存)
├── 2g.20gb  ×3  (每实例: 2/7 SM, 20GB 显存)
├── 3g.40gb  ×2  (每实例: 3/7 SM, 40GB 显存)
└── 7g.80gb  ×1  (整卡)
```

| 特性 | 说明 |
|------|------|
| **硬件隔离** | SM、L2 Cache、显存完全独立 |
| **ECC 显存** | 每个实例的显存有独立 ECC 保护 |
| **QoS 保障** | 实例间互不干扰，延迟可预测 |
| **故障隔离** | 一个实例故障不影响其他 |
| **限制** | 仅 A100/H100/B200 支持，分区粒度固定 |

### H100 MIG 配置

| 实例类型 | 数量 | SM 占比 | 显存 | 适用场景 |
|----------|------|---------|------|----------|
| 1g.12gb | 7 | 1/8 | 12 GB | 小模型推理、开发测试 |
| 2g.24gb | 3 | 2/8 | 24 GB | 中等模型推理 |
| 3g.40gb | 2 | 3/8 | 40 GB | 大模型推理 |
| 7g.80gb | 1 | 全部 | 80 GB | 训练/满血推理 |

---

## 4. AI Stack GPU 共享模式

AI Stack 支持两种 GPU 共享模式：

| 模式 | 说明 | 隔离维度 |
|------|------|----------|
| **算力共享** | 按比例分配 GPU 计算能力 | 算力百分比隔离 |
| **显存隔离** | 限制每个租户的显存使用上限 | 显存硬性隔离 |
| **GPU 独享** | 整卡分配给单一租户 | 完全独占 |

```
GPU 共享模式决策树
│
├── 性能优先 → GPU 独享（单租户独占整卡）
│
├── 均衡模式 → 算力共享 + 显存隔离
│   └── 多租户推理，各租户有显存上限保障
│
└── 最大密度 → 算力共享（不限制显存）
    └── 多租户共享，需应用层协调
```

---

## 5. 虚拟化对推理的影响

| 指标 | 独享 GPU | MIG 分区 | 软件共享 |
|------|---------|---------|---------|
| **吞吐量** | 100% | ~90%（分区开销） | ~70-85%（调度开销） |
| **延迟** | 最低 | 接近独享 | 可能有抖动 |
| **利用率** | ~30%（轻载） | ~70%（多实例） | ~80%+ |
| **隔离性** | 完全 | 硬件级 | 软件级 |
| **单位成本** | 高 | 中 | 低 |

---

## 6. K8s GPU 调度

| 方案 | 粒度 | 说明 |
|------|------|------|
| **整卡分配** | 1 GPU = 1 Pod | 默认 Device Plugin |
| **GPU 共享** | 分数 GPU | [[概念/hami|HAMi]], Tencent GPU Sharing |
| **MIG 调度** | MIG 实例 | NVIDIA MIG Manager |
| **拓扑感知** | NUMA/NVLink 拓扑 | Topology Aware Scheduling |

---

## 7. 最佳实践

1. **推理场景优先独享**：单模型推理时独占 GPU 性能最优
2. **多租户用 MIG**：需要强隔离时（如金融行业多客户），MIG 是首选
3. **开发测试用共享**：开发环境用 [[概念/hami|HAMi]] 等软件级共享提高 GPU 利用率
4. **多厂商混部用 HAMi**：需要统一纳管 NVIDIA/昇腾/寒武纪/海光等时使用 HAMi
5. **监控显存碎片**：共享模式下显存碎片是常见问题，需 PagedAttention 配合
6. **避免超卖**：算力共享时过度分配会导致 OOM 和性能劣化

---

## 8. 局限与开放问题

1. **MIG 粒度不灵活**：仅支持固定分区比例，不能任意切分
2. **软件隔离的抖动**：进程级隔离在高负载时延迟不可预测
3. **NVLink 共享**：MIG 实例无法跨实例使用 NVLink
4. **国产 GPU 虚拟化**：海光 DCU、昇腾 NPU 的虚拟化能力仍在追赶，可借助 [[概念/hami|HAMi]] 统一纳管

---

## Related

- [[概念/ai-hardware]] — AI 硬件（GPU/TPU/NPU）
- [[概念/model-serving]] — 模型服务（多租户推理）
- [[概念/heterogeneous-gpu]] — 异构 GPU 集群
- [[概念/cdi]] — CDI 容器设备接口（MIG 实例如何注入容器）
- [[概念/dra]] — DRA 动态资源分配（MIG 切片的属性化调度）
- [[概念/gpu-operator]] — NVIDIA GPU Operator（MIG 经其动态管理）
- [[概念/hami]] — HAMi（Kubernetes 异构 GPU 虚拟化中间件）
- [[架构基建/AI_Stack/HAMi_Deep_Dive]] — HAMi 深度解析
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack（GPU 共享模式）

---

## 2026 GPU 虚拟化生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **B200 MIG 新分区** | 支持更细粒度分区（最多 8 实例），显存带宽独立 | GA |
| **DRA 属性化分配** | K8s 1.32+ 按显存/算力属性匹配 MIG 实例，替代计数模型 | Beta |
| **HAMi v2.6** | 支持 NVIDIA/昇腾/寒武纪/海光等 8+ 厂商统一虚拟化 | GA |
| **Confidential Computing** | GPU TEE（可信执行环境），硬件级数据加密隔离 | GA |
| **GPU 池化 (GPU Pooling)** | 跨节点 GPU 资源池化，动态分配给不同租户 | Beta |

## 生产最佳实践

1. **场景分层**：生产推理用 MIG/独享，开发测试用 HAMi 软件共享，最大化资源利用率
2. **显存监控必配**：共享模式下实时监控每容器显存使用，设置 OOM 告警阈值
3. **避免超卖**：算力共享时总分配不超过 100%，显存分配留 10% 余量
4. **定期评估分区方案**：根据业务负载变化调整 MIG 分区，避免资源闲置或不足
5. **多厂商统一纳管**：异构集群使用 HAMi 统一调度接口，降低运维复杂度

## GPU 虚拟化方案对比

| 方案 | 类型 | 隔离性 | 性能损耗 | 适用场景 |
|------|------|------|------|------|
| MIG | 硬件分区 | 强 | 无 | A100/H100 生产 |
| vGPU | 驱动层 | 中 | 5-10% | VDI/云桌面 |
| HAMi | 软件调度 | 中 | 5-15% | 开发测试 |
| Time-slicing | 时间片 | 弱 | 10-20% | 轻量推理 |
| MPS | 进程共享 | 弱 | 5% | 多进程共享 |

## 显存分配策略

| 策略 | 说明 | 适用场景 |
|------|------|------|
| 固定分配 | 预分配固定显存 | 生产推理 |
| 弹性分配 | 按需动态调整 | 开发测试 |
| 超卖 | 总分配 > 物理显存 | 轻量任务 |
| 预留 | 保留部分显存 | 系统稳定性 |

> 💡 GPU 虚拟化的核心目标是「让每张 GPU 都被充分利用」，MIG 是生产首选，HAMi 是云原生新选择。
