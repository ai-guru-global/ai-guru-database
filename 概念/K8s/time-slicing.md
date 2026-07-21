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

## 生产最佳实践

1. **适用场景**：开发测试、低优先级批量推理
2. **副本数配置**：replicas 建议 2-4，过多影响性能
3. **性能监控**：关注 GPU 利用率、任务等待时间
4. **与 MIG 对比**：需要隔离时用 MIG，成本敏感用 Time Slicing
5. **资源限制**：配合 ResourceQuota 防止资源滥用
