---
title: LLM 推理集群调度
category: concepts
tags:
  - llm
  - inference
  - cluster
  - scheduling
  - kubernetes
  - load-balancing
  - serving
aliases:
  - LLM Inference Scheduling
  - 推理集群调度
  - GPU Cluster Scheduling
relationships:
  - target: "_concepts/vllm-practical"
    type: related_to
  - target: "_concepts/prefill-decode-disaggregated"
    type: related_to
  - target: "_concepts/llm-inference-cost-optimization"
    type: related_to
summary: LLM 推理集群调度负责将用户请求分配到合适的 GPU 实例上执行，目标是在满足延迟约束的同时最大化资源利用率和吞吐，涉及负载均衡、自动扩缩容、异构 GPU 管理等。
lifecycle: stable
tier: supporting
created: 2026-06-25
updated: 2026-06-25
---

# LLM 推理集群调度

## 一句话总结

**LLM 推理集群调度**负责将推理请求合理分配到 GPU 资源上，在延迟、吞吐、成本之间取得平衡。

---

## 调度目标

| 目标 | 说明 |
|---|---|
| **低延迟** | 满足 TTFT、TPOT SLA |
| **高吞吐** | 单位时间处理更多请求 |
| **高利用率** | GPU 计算和显存充分利用 |
| **低成本** | 按需使用 cheaper GPU 或 spot 实例 |
| **高可用** | 故障自动切换、负载均衡 |

---

## 调度层级

```mermaid
flowchart TD
    A[请求入口] --> B[Gateway / Load Balancer]
    B --> C[推理实例池]
    C --> D[GPU Node 1]
    C --> E[GPU Node 2]
    C --> F[GPU Node N]
    D --> G[vLLM / TensorRT-LLM]
    E --> G
    F --> G
```

---

## 关键调度策略

### 1. 负载均衡

| 策略 | 说明 |
|---|---|
| **Round Robin** | 轮询，简单但不考虑负载 |
| **Least Connections** | 选择当前连接数最少的实例 |
| **Least GPU Utilization** | 选择 GPU 利用率最低的实例 |
| **Prompt-based Routing** | 按 prompt 长度路由到不同实例 |

### 2. 自动扩缩容

```mermaid
flowchart LR
    A[监控指标] --> B{负载高?}
    B -->|是| C[扩容 GPU 实例]
    B -->|否| D{负载低?}
    D -->|是| E[缩容 GPU 实例]
    D -->|否| F[保持]
```

- 扩容触发：队列长度、P99 延迟、GPU 利用率；
- 缩容触发：持续低负载、空闲时间。

### 3. 请求合并（Batching）

- **Static Batching**：固定 batch size；
- **Continuous Batching**：动态加入新请求（vLLM 原生支持）；
- **Speculative Batching**：结合推测解码。

### 4. 异构 GPU 调度

| GPU 类型 | 适用场景 |
|---|---|
| **H100 / A100** | 大模型、高吞吐 |
| **L40S / A10** | 中小模型、低成本 |
| **T4** | 小模型、低延迟简单任务 |

---

## 常用工具

| 工具 | 用途 |
|---|---|
| **Kubernetes + GPU Operator** | GPU 集群管理和调度 |
| **Knative / KServe** | 模型服务自动扩缩容 |
| **NVIDIA Triton** | 多模型推理服务 |
| **vLLM + Ray Serve** | 分布式推理服务 |
| **BentoML / Seldon** | MLOps 推理平台 |

---

## 常见挑战

| 挑战 | 解决思路 |
|---|---|
| **长 prompt 拖慢整体延迟** | Prefill-Decode 分离 |
| **显存碎片** | PagedAttention、动态显存管理 |
| **冷启动** | 预加载模型、keep-alive 实例 |
| **多模型混部** | 按模型大小和流量分配节点 |
| **故障恢复** | 多副本、健康检查、快速重试 |

---

## 延伸阅读

- [[_concepts/vllm-practical|vLLM 实战]]
- [[_concepts/prefill-decode-disaggregated|Prefill-Decode 分离]]
- [[_concepts/llm-inference-cost-optimization|推理成本优化]]
- [[_concepts/llm-inference-checklist|推理上线检查清单]]
