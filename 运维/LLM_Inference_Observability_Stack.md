---
title: "LLM 推理可观测性栈"
category: 13-ai-ops
subcategory: observability
tags: ["llm", "inference", "observability", "metrics", "tracing", "prometheus", "grafana", "alibaba-cloud"]
summary: "面向 LLM 推理服务的可观测性体系建设：定义 TTFT/TPOT/QPS/KV Cache 等关键指标，并给出 Prometheus/Grafana 采集与告警方案。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# LLM 推理可观测性栈

> **一句话理解**: LLM 推理可观测性就是盯着「首 token 多久回来、每个 token 多快、排队长不长、KV Cache 满没满」这几件事，及时发现和定位问题。

## 目录

- [1. 关键指标](#1-关键指标)
- [2. 指标采集](#2-指标采集)
- [3. 日志与链路](#3-日志与链路)
- [4. 告警规则](#4-告警规则)
- [5. Dashboard 设计](#5-dashboard-设计)
- [6. 阿里云专有云关联](#6-阿里云专有云关联)
- [Related](#related)

---

## 1. 关键指标

| 指标 | 说明 | 告警阈值参考 |
|------|------|-------------|
| **TTFT** | 首 token 返回时间 | p99 > 2s |
| **TPOT** | 每个输出 token 时间 | p99 > 100ms |
| **QPS** | 每秒请求数 | 按容量规划 |
| **Queue Depth** | 等待请求数 | 持续增长 |
| **KV Cache Usage** | KV Cache 显存占用 | > 85% |
| **GPU Utilization** | GPU 计算利用率 | 持续 > 95% |
| **GPU Memory Usage** | 显存占用 | > 90% |
| **Error Rate** | 错误率 | > 1% |

---

## 2. 指标采集

### 2.1 vLLM Metrics

vLLM 默认暴露 `/metrics`：

```bash
curl http://<vllm-pod>:8000/metrics
```

关键指标：
- `vllm:time_to_first_token_seconds`
- `vllm:time_per_output_token_seconds`
- `vllm:num_requests_running`
- `vllm:num_requests_waiting`
- `vllm:gpu_cache_usage_perc`

### 2.2 Prometheus ServiceMonitor

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: llm-inference-metrics
spec:
  selector:
    matchLabels:
      app: llm-inference
  endpoints:
    - port: metrics
      path: /metrics
      interval: 15s
```

---

## 3. 日志与链路

### 3.1 日志关键字段

- request_id
- model_name
- input_tokens
- output_tokens
- ttft_ms
- total_latency_ms
- error_code

### 3.2 链路追踪

使用 OpenTelemetry 或 Jaeger 追踪请求从网关到推理服务的完整链路。

---

## 4. 告警规则

```yaml
groups:
  - name: llm_inference
    rules:
      - alert: LLMHighTTFT
        expr: histogram_quantile(0.99, vllm:time_to_first_token_seconds_bucket) > 2
        for: 5m
        annotations:
          summary: "LLM TTFT p99 > 2s"

      - alert: LLMHighQueueDepth
        expr: vllm:num_requests_waiting > 10
        for: 2m
        annotations:
          summary: "LLM queue depth high"
```

---

## 5. Dashboard 设计

建议 Grafana Dashboard 包含：
- 延迟：TTFT/TPOT p50/p95/p99
- 吞吐：QPS、token/s
- 队列：running/waiting requests
- 资源：GPU 利用率、显存、KV Cache
- 错误：错误率、错误码分布

---

## 6. 阿里云专有云关联

在阿里云专有云环境中：
- 可对接 **ARMS 私有化版** 作为 Prometheus/Grafana 替代
- **SLS 私有化版** 收集推理日志
- **PAI-EAS** 自带推理监控看板
- **ASCM** 统一告警中心

---

## Related

- [[概念/vllm|vLLM]]
- [[概念/prometheus|Prometheus]]
- [[概念/grafana|Grafana]]
- [[概念/opentelemetry|OpenTelemetry]]
- [[概念/jaeger|Jaeger]]
- [[运维/SRE_Reliability/LLM_Inference_Slow_Unavailable_Runbook|LLM 推理延迟/不可用 Runbook]]

## 进阶知识拓展

| 主题 | 深度内容 | 应用场景 | 参考资源 |
|------|----------|----------|----------|
| 核心原理 | 底层机制和数学推导 | 深度理解+优化 | 经典教材+论文 |
| 工程实践 | 生产级实现细节 | 项目落地 | 开源项目+案例 |
| 性能优化 | 瓶颈分析+调优策略 | 提升效率 | 性能分析工具 |
| 安全合规 | 安全威胁+防护措施 | 风险管控 | 安全框架+标准 |
| 前沿研究 | 最新进展+未来方向 | 技术预判 | 顶会论文+博客 |

## 实践指南

| 步骤 | 行动 | 工具/方法 | 预期产出 |
|------|------|-----------|----------|
| 1. 学习 | 系统学习核心知识 | 教材/课程/文档 | 知识体系建立 |
| 2. 练习 | 动手实践加深理解 | 实验/项目/练习 | 技能熟练 |
| 3. 应用 | 在实际项目中应用 | 工作项目/开源 | 经验积累 |
| 4. 优化 | 持续改进和优化 | 性能分析/重构 | 质量提升 |
| 5. 分享 | 输出和分享知识 | 博客/演讲/教学 | 影响力建设 |

## 常见误区

| 误区 | 正确认知 | 建议 |
|------|----------|------|
| 只学理论不实践 | 实践是检验理解的唯一标准 | 每学一个概念就动手验证 |
| 追求完美再开始 | 完成比完美更重要 | 先做MVP再迭代 |
| 忽视基础知识 | 基础决定上限 | 定期回顾基础 |
| 盲目追新 | 新技术需要验证 | 评估后再采用 |
| 单打独斗 | 协作效率更高 | 积极参与社区 |

## 知识图谱关联

| 关联主题 | 关系类型 | 参考路径 |
|----------|----------|----------|
| 基础理论 | 前置依赖 | 相关基础目录 |
| 工具实践 | 实现支撑 | 工具/编程相关 |
| 应用场景 | 价值体现 | 行业应用/ |
| 前沿研究 | 发展方向 | 论文精读/ |
| 工程方法 | 质量保障 | 测试/运维/ |

## 版本更新记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-01 | 初始创建 |
| v1.1 | 2025-06 | 内容补充 |
| v2.0 | 2026-01 | 全面扩写 |
| v2.1 | 2026-07 | 质量强化+结构化增强 |

## 快速自检

- [ ] 核心概念能向他人清晰解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案优劣势和适用场景
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态
- [ ] 知识已文档化沉淀
