---
title: "Resilience"
category: -concepts
tags: ["sre", "reliability", "resilience", "chaos-engineering", "alibaba-cloud"]
summary: "Resilience（韧性）是指系统在面对故障、负载变化或攻击时，保持可接受服务水平并快速恢复的能力。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "系统韧性"
  - "Fault Tolerance"
relationships:
  - target: "概念/sre"
    type: part_of
  - target: "概念/chaos-engineering"
    type: verified_by
sources: []
name_zh: "系统韧性"
---

# Resilience

> 中文简称：系统韧性

> **一句话理解**: 韧性就是系统「扛揍」的能力——出问题了不崩、慢点了不死、恢复了还快。

## 核心要点

- **容错**: 单个组件失败不影响整体
- **降级**: 核心功能可用，非核心功能可关闭
- **自愈**: 自动检测并恢复
- **限流**: 防止过载
- **冗余**: 多副本、多可用区

## 设计模式

| 模式 | 说明 |
|------|------|
| 重试 | 失败后重试 |
| 熔断 | 失败达到阈值后快速失败 |
| 限流 | 控制请求速率 |
| 隔离 | 舱壁模式，限制故障范围 |
| 兜底 | 备用方案 |

## 阿里云专有云关联

在阿里云专有云环境中，ACK 多可用区部署、推理服务多副本、自动扩缩容都是提升韧性的常见手段。

## Related

- [[概念/sre|SRE]]
- [[概念/chaos-engineering|Chaos Engineering]]
- [[概念/incident-response|Incident Response]]

---

## 2026 韧性工程生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **混沌工程** | 故障注入测试韧性 | GA |
| **熔断器** | 防止级联失败 | GA |
| **限流降级** | 流量控制保护系统 | GA |
| **多活架构** | 异地多活容灾 | GA |
| **自动恢复** | 故障自动检测恢复 | GA |

## 生产最佳实践

1. **混沌工程**：定期混沌工程测试韧性
2. **熔断降级**：关键服务配置熔断降级
3. **多活架构**：核心系统异地多活
4. **自动恢复**：故障自动检测恢复
5. **韧性设计**：系统设计考虑失败场景

## 韧性设计原则

| 原则 | 说明 | 实现方式 |
|------|------|----------|
| 冗余 | 消除单点故障 | 多副本、多可用区 |
| 隔离 | 限制故障范围 | 舱壁模式、Namespace |
| 降级 | 核心功能优先 | 功能开关、限流 |
| 自愈 | 自动恢复 | 健康检查、自动重启 |
| 可观测 | 快速发现问题 | 指标/日志/追踪 |

## 配置示例

```yaml
# K8s 韧性配置
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    spec:
      containers:
        - name: inference
          resources:
            requests:
              cpu: "4"
              memory: 16Gi
            limits:
              cpu: "8"
              memory: 32Gi
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 5
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
```

## AI 服务韧性特殊挑战

| 挑战 | 说明 | 应对策略 |
|------|------|----------|
| GPU 故障 | 硬件故障率高 | 多副本 + 自动转移 |
| 模型加载慢 | 冷启动数分钟 | 预热 + 模型缓存 |
| 推理延迟波动 | 负载敏感 | 自动扩缩容 + 队列 |
| OOM 风险 | 大模型内存需求高 | 资源限制 + 监控 |
| 级联失败 | 依赖服务故障 | 熔断 + 降级 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 服务雪崩 | 级联失败 | 熔断器 + 限流 |
| 恢复慢 | 缺乏自愈 | 健康检查 + 自动重启 |
| 单点故障 | 无冗余 | 多副本 + 多可用区 |
| 过载崩溃 | 无限流 | 限流 + 队列 |

## 相关概念

- [[概念/sre|SRE]] — 站点可靠性工程
- [[概念/General/chaos-engineering|Chaos Engineering]] — 混沌工程
- [[概念/incident-response|Incident Response]] — 事故响应
- [[概念/error-budget|Error Budget]] — 错误预算

## 总结

韧性是系统在面对故障、负载变化或攻击时保持可接受服务水平并快速恢复的能力。通过冗余、隔离、降级、自愈和可观测性设计实现。

---

> 💡 韧性就是系统「抗揍」的能力——出问题了不崩、慢点了不死、恢复了还快。

## 韧性测试方法

| 方法 | 工具 | 说明 |
|------|------|------|
| 故障注入 | Chaos Mesh | 模拟 Pod/节点故障 |
| 网络分区 | Litmus | 模拟网络中断 |
| 负载测试 | k6 / Locust | 模拟流量突增 |
| 依赖故障 | Toxiproxy | 模拟下游服务故障 |
| 资源耗尽 | Stress-ng | 模拟 CPU/内存耗尽 |

## 韧性成熟度模型

| 级别 | 特征 | 典型表现 |
|------|------|----------|
| L1 脆弱 | 无冗余、无监控 | 单点故障导致全局不可用 |
| L2 基本 | 有冗余、有告警 | 故障可发现但恢复慢 |
| L3 弹性 | 自动恢复、限流 | 故障自动恢复 |
| L4 韧性 | 混沌工程、多活 | 主动验证韧性 |
| L5 反脆弱 | 持续改进 | 从故障中学习变强 |

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| Chaos Mesh | 2.7+ | 稳定 |
| Litmus | 3.15+ | 稳定 |
| Istio | 1.24+ | 稳定 |
| Envoy | 1.32+ | 稳定 |
| Hystrix | 维护模式 | 维护 |
| Resilience4j | 2.2+ | 稳定 |

## 生产检查清单

1. **多副本部署**：关键服务至少 3 副本
2. **多可用区**：跨可用区部署消除单点
3. **健康检查**：配置 liveness + readiness probe
4. **资源限制**：设置 CPU/内存 limits
5. **熔断降级**：关键依赖配置熔断器
6. **限流保护**：入口配置限流
7. **混沌测试**：每季度进行混沌工程测试

