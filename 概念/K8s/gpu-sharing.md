---
title: "GPU Sharing"
category: -concepts
tags: ["gpu", "virtualization", "kubernetes", "k8s", "multi-tenant", "alibaba-cloud"]
summary: "GPU Sharing 是让多张工作负载共享同一张物理 GPU 的技术，可提升资源利用率，常见实现包括时间片调度、MIG、HAMi 等。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "GPU 共享"
relationships:
  - target: "概念/gpu"
    type: related_to
  - target: "概念/mig"
    type: implemented_by
  - target: "概念/hami"
    type: implemented_by
sources: []
---

# GPU Sharing

> **一句话理解**: GPU 共享就是「一张显卡分给多个任务用」，提高利用率，但共享方式不同，隔离性和性能也不同。

## 核心要点

- **时间片调度**: 多个进程轮流使用 GPU，隔离性弱。
- **MIG**: 硬件级隔离，固定分区。
- **HAMi**: 软件级虚拟化，支持显存超卖和弹性配额。
- **适用场景**: 开发测试、低优先级推理、多租户平台。
- **风险**: 超卖可能导致 OOM 或性能干扰。

## 选型对比

| 方案 | 隔离性 | 灵活性 | 显存超卖 |
|------|--------|--------|---------|
| 时间片 | 低 | 高 | 否 |
| MIG | 高 | 低 | 否 |
| HAMi | 中 | 高 | 是 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，GPU 共享常用于开发测试环境和小规模推理服务。生产环境关键任务建议使用 MIG 或独占 GPU。

## Related

- [[概念/gpu|GPU]]
- [[概念/mig|MIG]]
- [[概念/hami|HAMi]]
- [[概念/time-slicing|Time Slicing]]
- [[概念/gpu-oom|GPU OOM]]
- [[概念/gpu-virtualization|GPU 虚拟化]]

---

## 2026 GPU 共享生态

| 方案 | 隔离性 | 显存超卖 | 适用场景 |
|------|--------|---------|----------|
| **Time Slicing** | 低 | 否 | 开发测试 |
| **MIG** | 高 | 否 | 生产推理 |
| **HAMi** | 中 | 是 | 多租户平台 |
| **vGPU** | 高 | 否 | 企业级 |

## 共享机制详解

### Time Slicing 工作原理

```
GPU 时间轴:
|---Pod A---|---Pod B---|---Pod C---|---Pod A---|
|<-- 时间片 1 -->|<-- 时间片 2 -->|<-- 时间片 3 -->|
```

- 多个 Pod 共享同一 GPU 上下文
- NVIDIA 驱动按时间片轮转调度
- 无显存隔离，可能 OOM

### MIG 硬件分区

```
A100 80GB MIG 分区示例:
|--- 3g.40gb ---|--- 2g.20gb ---|--- 2g.20gb ---|
|    Pod A       |    Pod B       |    Pod C       |
```

- 硬件级显存和计算单元隔离
- 仅支持 A100/A30/H100
- 分区固定，不可超卖

### HAMi 软件虚拟化

```yaml
# HAMi 显存配额示例
resources:
  limits:
    nvidia.com/gpu: 1
    nvidia.com/gpumem: 4096  # 4GB 显存配额
    nvidia.com/gpucores: 25  # 25% 算力配额
```

## 方案详细对比

| 维度 | Time Slicing | MIG | HAMi | vGPU |
|------|-------------|-----|------|------|
| 隔离级别 | 无 | 硬件 | 软件 | 驱动 |
| 显存超卖 | 否 | 否 | 是 | 否 |
| 算力限制 | 否 | 是 | 是 | 是 |
| GPU 要求 | 任意 | A100/H100 | 任意 | 企业卡 |
| 性能损耗 | 中 | 无 | 低 | 低 |
| 适用规模 | 小型 | 中大型 | 中大型 | 企业级 |

## 配置示例

```yaml
# NVIDIA Time Slicing ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: nvidia-device-plugin-config
data:
  config: |
    version: v1
    sharing:
      timeSlicing:
        resources:
          - name: nvidia.com/gpu
            replicas: 4
---
# Pod 请求共享 GPU
apiVersion: v1
kind: Pod
metadata:
  name: shared-gpu-pod
spec:
  containers:
    - name: inference
      image: nvcr.io/nvidia/tritonserver:24.01-py3
      resources:
        limits:
          nvidia.com/gpu: 1  # 实际为 1/4 GPU
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| GPU OOM | 显存无隔离，多任务超限 | 使用 MIG/HAMi 显存配额 |
| 性能干扰 | 时间片争抢 | 关键任务用 MIG 硬件隔离 |
| 利用率仍低 | 任务不并发 | 调整 replicas 数或启用 HAMi |
| 调度失败 | 资源视图不一致 | 检查 Device Plugin 配置 |

## 生产最佳实践

1. **场景匹配**：开发测试用 Time Slicing，生产用 MIG/HAMi
2. **显存监控**：启用显存使用率告警，避免 OOM
3. **配额管理**：设置合理的显存配额，防止资源争抢
4. **性能隔离**：关键任务使用 MIG 硬件隔离
5. **利用率优化**：低负载场景启用 GPU 共享提升利用率
6. **混合策略**：同一集群可组合使用 MIG + Time Slicing

## 监控与告警

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| `DCGM_FI_DEV_GPU_UTIL` | GPU 利用率 | > 90% 持续 5min |
| `DCGM_FI_DEV_FB_USED` | 显存使用 | > 90% |
| `DCGM_FI_DEV_FB_FREE` | 显存剩余 | < 10% |
| Pod 调度失败 | 资源不足 | 任何失败 |

## 成本优化建议

| 策略 | 说明 | 节省比例 |
|------|------|----------|
| 开发环境共享 | Time Slicing 4 副本 | ~75% |
| 测试环境共享 | HAMi 显存配额 | ~50% |
| 生产环境独占 | MIG 或整卡 | 0% |
| 混合调度 | 低优先级填充 | ~30% |

## 相关概念

- [[概念/gpu|GPU]] — 图形处理器
- [[概念/mig|MIG]] — 多实例 GPU
- [[概念/hami|HAMi]] — GPU 虚拟化
- [[概念/time-slicing|Time Slicing]] — 时间片调度

## 总结

GPU 共享是提升昂贵 GPU 资源利用率的关键技术。根据隔离需求选择合适方案：开发测试用 Time Slicing，生产用 MIG/HAMi，多租户平台用 HAMi 显存配额。

---

> 💡 GPU 共享是提升昂贵 GPU 资源利用率的关键技术，根据隔离需求选择合适方案是核心决策点。






