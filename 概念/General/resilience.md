---
title: "Resilience"
category: -concepts
tags: ["sre", "reliability", "resilience", "chaos-engineering", "alibaba-cloud"]
summary: "Resilience（韧性）是指系统在面对故障、负载变化或攻击时，保持可接受服务水平并快速恢复的能力。"
created: 2026-06-26
updated: 2026-06-26
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
