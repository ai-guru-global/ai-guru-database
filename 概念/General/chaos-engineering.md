---
title: "Chaos Engineering"
category: -concepts
tags: ["sre", "reliability", "chaos-engineering", "resilience", "alibaba-cloud"]
summary: "Chaos Engineering（混沌工程）是通过在生产环境中主动注入故障，验证系统韧性和恢复能力的工程实践。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "混沌工程"
  - "Resilience Engineering"
relationships:
  - target: "概念/sre"
    type: part_of
  - target: "概念/incident-response"
    type: related_to
sources: []
---

# Chaos Engineering

> **一句话理解**: 混沌工程就是「主动搞破坏」来验证系统能不能扛住故障，而不是等真出事才发现问题。

## 核心要点

- **稳态假设**: 先定义系统正常行为
- **故障注入**: 网络延迟、Pod 删除、节点宕机、依赖故障
- **真实环境**: 最好在类生产环境执行
- **最小爆炸半径**: 控制影响范围
- **自动恢复**: 验证系统自愈能力

## 常见实验

| 实验 | 目标 |
|------|------|
| Pod 删除 | 验证副本自愈 |
| 网络延迟 | 验证超时与重试 |
| 节点宕机 | 验证调度与数据持久化 |
| 依赖故障 | 验证降级策略 |
| 资源耗尽 | 验证限流与扩容 |

## 工具

- Chaos Mesh
- Litmus
- Gremlin
- PowerfulSeal

## 阿里云专有云关联

在阿里云专有云环境中，可在 ACK 测试集群使用 Chaos Mesh 对 AI 训练/推理服务进行故障演练。

## Related

- [[概念/resilience|Resilience]]
- [[概念/incident-response|Incident Response]]
- [[运维/Chaos_Engineering/Chaos_Engineering_for_AI_Systems|AI 系统混沌工程]]

---

## 2026 混沌工程生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Chaos Mesh** | K8s 原生混沌工程 | GA |
| **Litmus** | K8s 混沌工程 | GA |
| **Gremlin** | 企业级混沌工程 | GA |
| **故障注入** | 网络/Pod/节点故障注入 | GA |
| **AI 系统混沌** | AI 系统韧性测试 | 研究 |

## 生产最佳实践

1. **定期演练**：定期进行混沌工程演练
2. **生产环境**：在生产环境进行混沌工程
3. **自动化**：混沌工程自动化执行
4. **AI 系统**：AI 系统也要混沌工程
5. **事后复盘**：演练后复盘改进
