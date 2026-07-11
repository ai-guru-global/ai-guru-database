---
title: AI SRE (站点可靠性工程)
category: 架构基建/AI_SRE
tags: [sre, reliability, slo, incident-response, ai-infrastructure]
summary: AI 系统的站点可靠性工程实践，包括 SLO 管理、事故响应、容量规划和混沌工程。
---

# AI SRE (站点可靠性工程)

本目录收录 AI 系统 SRE 相关文档，专注于 AI 基础设施的可靠性保障。

## 内容导航

| 文档 | 说明 | 适用读者 |
|------|------|---------|
| [[AI_SRE_Runbook]] | AI SRE 运维手册：SLO/SLI 定义、事故响应流程、容量规划 | SRE、运维工程师 |

## 核心关注点

- **可靠性目标**: SLO/SLI/Error Budget 在 AI 系统中的定义
- **事故响应**: GPU 故障、推理服务降级、模型回归的标准化处理流程
- **容量规划**: GPU 利用率预测、弹性扩缩容策略
- **混沌工程**: 主动注入故障以验证系统韧性

## 边界说明

> **AI SRE (本目录)** vs **运维/ (运维目录)**:
> - 本目录聚焦**架构层面**的 SRE 设计原则和 SLO 体系
> - [[../../运维/SRE_Reliability/SRE_for_AI_Systems|运维 SRE]] 聚焦**执行层面**的 Runbook 和排障命令

## Related

- [[../../运维/SRE_Reliability/SRE_for_AI_Systems|AI 系统 SRE 实践]]
- [[../../运维/Troubleshooting/K8s_Troubleshooting_Playbook|K8s 排障手册]]
- [[../Architecture_Overview/System_Architecture|系统架构]]
- [[../CNCF_Cloud_Native_AI/|CNCF 云原生 AI]]
