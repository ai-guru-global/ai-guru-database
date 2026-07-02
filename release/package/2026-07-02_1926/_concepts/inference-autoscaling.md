---
title: Inference Autoscaling and Load Balancing
category: -concepts
tags: [inference, autoscaling, load-balancing, kubernetes, gpu, performance]
relationships:
  - target: "_concepts/model-serving"
    type: builds_on
  - target: "_concepts/model-gateway"
    type: related_to
  - target: "10_Deployment_Inference/Inference_Performance/Inference_Autoscaling_and_Load_Balancing"
    type: deepened_by
sources:
  - 10_Deployment_Inference/Inference_Performance/Inference_Autoscaling_and_Load_Balancing.md
summary: 推理弹性扩缩容根据 QPS、延迟、KV Cache 使用率等指标自动调整实例数；负载均衡需考虑 GPU 显存、队列长度和请求特征，不能只看轮询。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Inference Autoscaling"
  - "inference autoscaling"

---
# Inference Autoscaling and Load Balancing（推理扩缩容与负载均衡）

## 核心要点

- **不同于 Web 服务**：LLM 冷启动慢、单请求成本高、有状态（KV Cache）。
- **触发指标**：QPS、TTFT/TPOT P99、KV Cache 使用率、队列长度。
- **扩缩容策略**：HPA、VPA、预热池、多模型混部、预测式扩缩容。
- **负载均衡策略**：Least Load、请求长度感知、模型路由、Session Affinity。

## 一句话解释

> 推理扩缩容不是简单 HPA，要综合考虑冷启动、KV Cache 状态、延迟 SLO 和成本。

## Related

- [[_concepts/model-serving]] — 模型服务
- [[_concepts/model-gateway]] — AI Gateway
- [[10_Deployment_Inference/Inference_Performance/Inference_Autoscaling_and_Load_Balancing|弹性扩缩容与负载均衡]]
- [[_concepts/cuda-graph]] — Cuda Graph
- [[_concepts/request-scheduling]] — Request Scheduling
