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
---

# Resilience

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
