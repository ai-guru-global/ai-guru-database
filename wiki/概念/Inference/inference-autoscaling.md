---
title: Inference Autoscaling and Load Balancing
category: -concepts
tags: [inference, autoscaling, load-balancing, kubernetes, gpu, performance, hpa, kv-cache]
relationships:
  - target: "概念/Inference/model-serving"
    type: builds_on
  - target: "概念/Inference/model-gateway"
    type: related_to
  - target: "概念/Inference/request-scheduling"
    type: related_to
  - target: "10_部署推理/03_推理优化/Inference_Autoscaling_and_Load_Balancing"
    type: deepened_by
sources:
  - 10_部署推理/03_推理优化/Inference_Autoscaling_and_Load_Balancing.md
summary: 推理弹性扩缩容根据 QPS、延迟、KV Cache 使用率等指标自动调整实例数；负载均衡需考虑 GPU 显存、队列长度和请求特征，不能只看轮询。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-07-21
aliases:
  - "Inference Autoscaling"
  - "inference autoscaling"
  - "推理扩缩容"

name_zh: "推理弹性扩缩容"
---
# Inference Autoscaling and Load Balancing（推理扩缩容与负载均衡）

> 中文简称：推理弹性扩缩容

> 推理扩缩容不是简单 HPA，要综合考虑冷启动、KV Cache 状态、延迟 SLO 和成本。

## 为什么 LLM 扩缩容与 Web 服务不同

| 维度 | 传统 Web 服务 | LLM 推理服务 |
|------|------------|------------|
| 冷启动 | 秒级 | 30s-5min（加载模型权重） |
| 单请求成本 | 低 (ms级 CPU) | 高 (秒级 GPU) |
| 状态 | 无状态 | 有状态 (KV Cache) |
| 资源粒度 | CPU 核 | 整块 GPU (A100/H100) |
| 请求时长方差 | 小 | 极大 (10 token vs 4K token) |
| 扩缩容代价 | 低 | 极高 (GPU 成本 + 冷启动) |

## 触发指标体系

### 核心指标

| 指标 | 说明 | 扩容阈值示例 | 缩容阈值示例 |
|------|------|------------|------------|
| **QPS** | 每秒请求数 | >100 req/s/实例 | <30 req/s/实例 |
| **TTFT P99** | 首 Token 延迟 | >2s | <500ms |
| **TPOT P99** | 每 Token 延迟 | >100ms | <30ms |
| **KV Cache 使用率** | 显存中 KV 占比 | >85% | <40% |
| **队列长度** | 等待处理的请求数 | >50 | <5 |
| **GPU 利用率** | SM 占用率 | >90% | <30% |

### 复合指标策略

```
扩容触发 = (KV_Cache > 80%) OR (TTFT_P99 > 2s) OR (Queue > 50)
缩容触发 = (KV_Cache < 40%) AND (QPS < 30%) AND 持续 5min
```

## 扩缩容策略对比

| 策略 | 原理 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|----------|
| **HPA** | 基于指标自动调整副本数 | K8s 原生、简单 | 冷启动慢 | 通用场景 |
| **VPA** | 调整单实例资源配额 | 无需重启 | GPU 不支持热调整 | CPU 推理 |
| **预热池** | 保持 N 个热备实例 | 零冷启动 | 成本高 | 严格 SLO |
| **预测式扩容** | 基于历史流量预测 | 提前扩容 | 预测不准时浪费 | 周期性流量 |
| **多模型混部** | 小模型填充空闲 GPU | 提高利用率 | 调度复杂 | 成本敏感 |
| **Serverless GPU** | 按需分配、用后释放 | 零闲置成本 | 冷启动长 | 低频突发 |

## Kubernetes HPA 配置示例

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: llm-inference-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vllm-inference
  minReplicas: 2
  maxReplicas: 16
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60    # 快速扩容
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300   # 慢缩容，避免振荡
      policies:
        - type: Pods
          value: 1
          periodSeconds: 120
  metrics:
    - type: Pods
      pods:
        metric:
          name: kv_cache_utilization
        target:
          type: AverageValue
          averageValue: "0.7"
    - type: Pods
      pods:
        metric:
          name: ttft_p99_seconds
        target:
          type: AverageValue
          averageValue: "1.5"
```

## 负载均衡策略

| 策略 | 原理 | 适用场景 |
|------|------|----------|
| **Round Robin** | 轮询 | 请求均匀时（不推荐 LLM） |
| **Least Connections** | 最少活跃连接 | 通用场景 |
| **Least Load** | 最低 KV Cache + 队列 | LLM 推理首选 |
| **请求长度感知** | 短请求→轻载实例，长请求→重载实例 | 混合负载 |
| **Session Affinity** | 同用户路由到同实例 | 多轮对话 KV Cache 复用 |
| **模型路由** | 根据模型/版本分流 | 多模型部署 |
| **Prefill/Decode 分离** | Prefill→高算力节点，Decode→大显存节点 | 大规模部署 |

### 负载均衡决策流程

```
请求到达 Gateway
    ↓
解析请求特征（模型、输入长度、优先级）
    ↓
查询各实例状态（KV Cache、队列、GPU 利用率）
    ↓
加权评分: score = w1×(1-kv_usage) + w2×(1-queue_len/max_q) + w3×(1-gpu_util)
    ↓
路由到最高分实例
```

## 冷启动优化

| 方法 | 效果 | 实现复杂度 |
|------|------|----------|
| 模型预加载到共享存储 | 30s→10s | 低 |
| 内存快照 (CRIU) | 10s→2s | 高 |
| 预热池 (warm pool) | 0s | 中（成本高） |
| 模型分片并行加载 | 50%加速 | 中 |
| GPU 实例不释放 (scale-to-zero 禁用) | 0s | 低（成本高） |

## 生产最佳实践

1. **快扩慢缩**: 扩容窗口 60s，缩容窗口 300s，避免振荡
2. **多指标组合**: 不要只看 QPS，结合 KV Cache + 延迟 P99
3. **预热池保底**: 始终保持 minReplicas 个热实例
4. **请求队列缓冲**: 扩容期间用队列吸收突发，而非直接拒绝
5. **成本感知**: 低峰期缩容到最小副本，用延迟换成本
6. **监控报警**: KV Cache >90% 立即告警，避免 OOM 崩溃

## Related

- [[概念/Inference/model-serving|模型服务]]
- [[概念/Inference/model-gateway|AI Gateway]]
- [[概念/Inference/request-scheduling|Request Scheduling]]
- [[10_部署推理/03_推理优化/15_推理_Autoscaling_and_负载均衡|弹性扩缩容与负载均衡]]
- [[概念/Inference/cuda-graph|CUDA Graph]]

## 扩缩容策略对比

| 策略 | 触发条件 | 响应速度 | 适用场景 |
|------|---------|---------|----------|
| **基于 QPS** | 请求量超阈值 | 中 | 流量可预测 |
| **基于队列深度** | 积压请求数 | 快 | 延迟敏感 |
| **基于 GPU 利用率** | GPU 使用率 >80% | 中 | 资源优化 |
| **基于 TTFT** | 首 Token 延迟超标 | 快 | SLA 保障 |
| **定时扩缩** | 时间规则 | 慢 | 流量规律明显 |
| **预测式** | ML 预测流量 | 极快 | 大规模生产 |

## K8s 扩缩容配置示例

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: llm-inference-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vllm-inference
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Pods
    pods:
      metric:
        name: gpu_utilization
      target:
        type: AverageValue
        averageValue: "75"
  - type: Pods
    pods:
      metric:
        name: request_queue_depth
      target:
        type: AverageValue
        averageValue: "10"
```

## 生产最佳实践

1. **多指标组合**：GPU 利用率 + 队列深度 + TTFT 综合判断
2. **缩容延迟**：缩容设置 5-10min 冷却期，避免频繁波动
3. **预热新实例**：新实例加载模型需 30s-5min，提前扩容
4. **最小副本数**：至少保持 2 个副本，避免单点故障
5. **成本监控**：扩缩容与成本挂钩，设置预算上限

---

## 2026 推理自动扩缩容生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **KServe 自动扩缩** | 基于 GPU 利用率的模型扩缩 | GA |
| **KEDA GPU 指标** | 自定义 GPU 指标触发扩缩 | GA |
| **Knative 缩容到零** | 无流量时释放 GPU 资源 | GA |
| **预测性扩容** | 基于历史流量预测提前扩容 | GA |
| **多模型调度** | GPU 共享 + 模型热切换 | GA |

## 生产最佳实践

1. **指标选择**：用 GPU 利用率 + 请求队列长度双指标触发
2. **缩容延迟**：设置 5-10 分钟缩容冷却，避免频繁扩缩
3. **最小副本**：至少保持 2 个副本，避免单点故障
4. **预热时间**：考虑模型加载时间，提前扩容
5. **成本优化**：低峰期缩容到最小副本，节省 GPU 成本
