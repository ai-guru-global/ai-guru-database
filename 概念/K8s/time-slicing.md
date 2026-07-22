---
title: "Time Slicing"
category: -concepts
tags: ["gpu", "virtualization", "kubernetes", "k8s", "multi-tenant", "alibaba-cloud"]
summary: "GPU Time Slicing 是 NVIDIA 提供的一种软件级 GPU 共享机制，让多个容器按时间片轮流使用同一张 GPU，适合延迟不敏感场景。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "GPU Time Slicing"
  - "时间片调度"
relationships:
  - target: "概念/gpu"
    type: related_to
  - target: "概念/gpu-sharing"
    type: implements
sources: []
---

# Time Slicing

> **一句话理解**: GPU 时间片就是「多个任务排队轮流用 GPU」，成本低但互相可能影响性能。

## 核心要点

- **软件级共享**: 不需要 MIG 支持的 GPU。
- **时间片轮转**: 每个容器按配置的时间片访问 GPU。
- **配置简单**: 通过 NVIDIA Device Plugin 配置 `time-slicing`。
- **隔离性弱**: 任务间可能互相干扰。
- **适用场景**: 开发测试、低优先级批量推理。

## 配置示例

```yaml
sharing:
  timeSlicing:
    renameByDefault: false
    resources:
      - name: nvidia.com/gpu
        replicas: 4
```

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，Time Slicing 可用于不支持 MIG 的 GPU 机型，或多租户开发环境。工单中「GPU 利用率低」时，可考虑启用 Time Slicing。

## Related

- [[概念/gpu|GPU]]
- [[概念/gpu-sharing|GPU Sharing]]
- [[概念/mig|MIG]]
- [[概念/hami|HAMi]]
- [[概念/gpu-virtualization|GPU 虚拟化]]

---

## 2026 Time Slicing 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **NVIDIA Device Plugin** | 原生支持 | GA |
| **K8s 集成** | 标准资源请求 | GA |
| **与 MIG 对比** | 无需硬件支持 | - |

## 工作原理

```
GPU 时间轴（replicas=4）:
|---Pod A---|---Pod B---|---Pod C---|---Pod D---|---Pod A---|
|<--- 时间片轮转 --->|<--- 时间片轮转 --->|

特点:
- 所有 Pod 共享同一 GPU 上下文
- 显存无隔离，各 Pod 可能 OOM
- 计算单元按时间片轮流使用
```

## 完整配置示例

```yaml
# 1. 创建 Time Slicing ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: nvidia-plugin-configs
  namespace: kube-system
data:
  config: |
    version: v1
    sharing:
      timeSlicing:
        renameByDefault: false
        failRequestsGreaterThanOne: true
        resources:
          - name: nvidia.com/gpu
            replicas: 4
---
# 2. GPU Operator 配置
apiVersion: nvidia.com/v1
kind: ClusterPolicy
metadata:
  name: gpu-cluster-policy
spec:
  devicePlugin:
    config:
      name: nvidia-plugin-configs
      default: config
---
# 3. Pod 请求共享 GPU
apiVersion: v1
kind: Pod
metadata:
  name: dev-notebook
spec:
  containers:
    - name: jupyter
      image: nvcr.io/nvidia/pytorch:24.01-py3
      resources:
        limits:
          nvidia.com/gpu: 1  # 实际为 1/4 GPU
```

## Time Slicing vs MIG vs MPS

| 维度 | Time Slicing | MIG | MPS |
|------|-------------|-----|-----|
| 隔离级别 | 无 | 硬件 | 进程级 |
| 显存隔离 | 否 | 是 | 否 |
| 算力限制 | 否 | 是 | 是 |
| GPU 要求 | 任意 | A100/H100 | 任意 |
| 配置复杂度 | 低 | 中 | 高 |
| 性能损耗 | 中 | 无 | 低 |
| K8s 集成 | Device Plugin | Device Plugin | 手动 |

## 适用场景分析

| 场景 | 是否适用 | 说明 |
|------|----------|------|
| 开发测试 | ✅ | 多人共享 GPU 降低成本 |
| 低优先级推理 | ✅ | 延迟不敏感的批量推理 |
| 生产推理 | ❌ | 性能干扰不可接受 |
| 训练任务 | ❌ | 需要稳定算力 |
| Jupyter Hub | ✅ | 多用户共享开发环境 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| GPU OOM | 多任务显存累加超限 | 减少 replicas 或用 MIG |
| 性能下降 | 时间片争抢 | 降低并发数或升级 MIG |
| 配置不生效 | ConfigMap 未挂载 | 重启 Device Plugin Pod |
| 调度异常 | 资源视图不一致 | 检查 `failRequestsGreaterThanOne` |

## 生产最佳实践

1. **适用场景**：开发测试、低优先级批量推理
2. **副本数配置**：replicas 建议 2-4，过多影响性能
3. **性能监控**：关注 GPU 利用率、任务等待时间
4. **与 MIG 对比**：需要隔离时用 MIG，成本敏感用 Time Slicing
5. **资源限制**：配合 ResourceQuota 防止资源滥用
6. **故障预防**：设置 `failRequestsGreaterThanOne: true` 防止单 Pod 请求多份

## 监控与告警

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| `DCGM_FI_DEV_GPU_UTIL` | GPU 利用率 | > 90% 持续 5min |
| `DCGM_FI_DEV_FB_USED` | 显存使用 | > 90% |
| `DCGM_FI_DEV_GPU_TEMP` | GPU 温度 | > 85°C |
| Pod 等待时间 | 调度延迟 | > 30s |

## 升级路径

```
Time Slicing 升级路径:

1. 评估隔离需求
   ├─ 无隔离需求 → 继续 Time Slicing
   ├─ 需要显存隔离 → 升级 MIG
   └─ 需要算力限制 → 升级 HAMi

2. MIG 升级步骤
   ├─ 确认 GPU 型号支持 (A100/H100)
   ├─ 启用 MIG 模式
   ├─ 创建 MIG 实例
   └─ 更新 Device Plugin 配置
```

## 相关概念

- [[概念/gpu|GPU]] — 图形处理器
- [[概念/gpu-sharing|GPU Sharing]] — GPU 共享技术
- [[概念/mig|MIG]] — 多实例 GPU

## 总结

Time Slicing 是最简单的 GPU 共享方案，通过 NVIDIA Device Plugin 配置即可启用。适用于开发测试和低优先级场景，生产环境建议使用 MIG 或 HAMi。

> 💡 Time Slicing 是最简单的 GPU 共享方案，零硬件要求，但无隔离性，仅适合开发测试和低优先级场景。
