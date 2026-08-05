---
title: 推理弹性扩缩容与负载均衡
category: 10-deployment-inference-inference-performance
tags: [inference, autoscaling, load-balancing, kubernetes, gpu, performance]
summary: "> 推理流量波动大、成本高，弹性扩缩容和智能路由是控制成本与保障 SLO 的关键。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
aliases:
  - "Inference Autoscaling And Load Balancing"
  - "Inference Autoscaling and Load Balancing"
  - Inference_Autoscaling_and_Load_Balancing
sources: []

name_zh: "推理弹性扩缩容与负载均衡"
---
# 推理弹性扩缩容与负载均衡

> 中文简称：推理弹性扩缩容与负载均衡

> LLM 推理的流量像海浪——平时很低，高峰时几倍，弹性扩缩容就是不被浪打翻的船。

---

## 1. 为什么推理服务需要专门扩缩容

通用 Web 服务的扩缩容模型不直接适用于 LLM 推理：

| 差异 | 通用 Web | LLM 推理 |
|------|----------|----------|
| 启动时间 | 秒级 | 分钟级（模型加载） |
| 单请求成本 | 低 | 高（GPU 时间） |
| 资源粒度 | CPU/内存 | 整卡 GPU |
| 延迟敏感度 | 中等 | 很高（TTFT/TPOT） |
| 状态 | 无状态 | 有状态（KV Cache） |

因此：

- 冷启动慢，不能等流量来了再扩容。
- 缩容要谨慎，避免反复加载模型。
- 负载均衡不能只看 QPS，要看 GPU 显存和算力余量。

---

## 2. 扩缩容触发指标

| 指标 | 用法 | 注意 |
|------|------|------|
| **QPS / 请求队列长度** | 最直接 | 反应有滞后 |
| **GPU 利用率** | 看是否吃饱 | 高 util 不一定高效 |
| **TTFT / TPOT P99** | SLO 触发 | 延迟超标时扩容 |
| **KV Cache 使用率** | 显存瓶颈 | 接近 100% 必须扩 |
| **等待队列长度** | 请求堆积 | 排队过长说明容量不足 |
| **成本/Token** | FinOps | 超出预算时缩容或换模型 |

---

## 3. 扩缩容策略

### 3.1 水平扩缩容（HPA）

根据指标增减推理 Pod/实例数。

```yaml
# Kubernetes HPA 示例
metrics:
- type: Pods
  pods:
    metric:
      name: llm_time_to_first_token_seconds_p99
    target:
      type: AverageValue
      averageValue: 500m  # 500ms
```

问题：

- 冷启动慢（模型加载 1-5 分钟）。
- 缩容后 KV Cache 丢失（有状态）。

### 3.2 垂直扩缩容（VPA）

调整单实例资源（GPU 数、显存）。

- 适合 TP/PP 扩展。
- 但通常需要重启。

### 3.3 预热池（Warm Pool）

提前启动好若干模型实例，流量来了立即接入。

- 适合高峰前可预测的场景。
- 成本：低谷时也有实例空转。

### 3.4 多模型混部

把高低峰错开的模型放在同一 GPU 上。

- 提高 GPU 利用率。
- 需要 careful 的资源隔离。

### 3.5 预测式扩缩容

根据历史流量预测提前扩容。

- 适合有规律的流量（例如工作日 9 点、晚高峰）。
- 结合 cron + HPA。

---

## 4. 负载均衡策略

### 4.1  Round Robin（轮询）

简单，但不考虑各实例负载。

### 4.2 Least Load / Least KV Cache

把请求发到当前负载最低的实例。

- 考虑 GPU util、KV Cache 占用、队列长度。
- 效果更好，但需要实时状态。

### 4.3 请求长度感知路由

- 长输入请求 → 高算力实例（或 prefill worker）。
- 短输入/长输出请求 → 高带宽实例（或 decode worker）。
- 与 PD 分离架构天然配合。

### 4.4 模型路由（Model Routing）

根据请求特征选择不同模型：

- 简单任务 → 小模型（省钱）。
- 复杂任务 → 大模型（保证质量）。
- 详见 `LLM_Cost_02_优化.md`。

---

## 5. 有状态挑战：KV Cache

### 5.1 问题

一个请求一旦路由到实例 A，后续 token 必须继续走 A（除非迁移 KV Cache）。

### 5.2 解决方案

| 方案 | 说明 |
|------|------|
| **Session Affinity** | 同一 session 固定到同一实例 |
| **KV Cache 迁移** | 缩容时把 KV 传到其他实例 |
| **PD 分离** | prefill 和 decode 独立扩缩，KV 从 prefill 传到 decode |
| **外部 KV 存储** | 把 KV Cache 存到 Redis/RDMA 共享内存 |

---

## 6. 成本与 SLO 平衡

| 策略 | 效果 | 代价 |
|------|------|------|
| 按 P99 延迟扩容 | SLO 保障好 | 成本高 |
| 按 QPS 扩容 | 简单 | 延迟波动大 |
| 混合模型路由 | 省钱 | 质量可能下降 |
| Spot / 抢占式实例 | 成本低 | 可能被中断 |

---

## 7. 一句话总结

> 推理扩缩容不是简单 HPA，要综合考虑冷启动、KV Cache 状态、延迟 SLO 和成本；智能路由能让同样的 GPU 集群撑起更多流量。

---

## Related

- [[概念/model-serving]] — 模型服务
- [[概念/model-gateway]] — AI Gateway
- [[10_部署推理/03_推理优化/README|推理性能专题]]
- [[10_部署推理/03_推理优化/01_推理性能_基础|推理性能基础]]
- [[10_部署推理/03_推理优化/13_Prefill_Decode_Disaggregation|Prefill-Decode 分离]]
- [[10_部署推理/03_推理优化/14_Request_调度_for_LLMs|请求调度]]
- [[10_部署推理/06_成本管理/03_LLM_成本优化|LLM 成本优化]]
