---
title: Cloud Ops Agent 知识库首页
category: 18-cloud-ops-agent-docs
tags: ["cloud-ops", "devops", "sre", "automation", "ai-agents"]
summary: "欢迎来到 Cloud Ops Agent 的单一可信源（Single Source of Truth）。"
created: 2026-05-31
updated: 2026-05-31
---

# Cloud Ops Agent 知识库首页

欢迎来到 Cloud Ops Agent 的单一可信源（Single Source of Truth）。
基于 Agent Harness 的设计理念，本文档库对 Agent 开发、语料工程、测评、架构、产品经理、集成测试六类角色的核心知识点进行了系统性重构与拆分。

---

## 角色视角导航

### 面向不同角色的文档

| 角色 | 文档 | 核心关注点 |
|------|------|-----------|
| **架构师** | [架构设计指南](architecture/index.md) | 顶层设计、高可用、安全架构 |
| **Agent 开发工程师** | [研发指南](development/index.md) | 工具开发、Agent 实现、调试部署 |
| **语料工程师** | [语料工程指南](corpus/index.md) | 训练语料、Prompt 工程、Fine-tuning |
| **测评工程师** | [测试指南](testing/index.md) | 评测框架、Benchmark、质量度量 |
| **产品经理** | [产品管理指南](product/index.md) | 需求管理、Roadmap、成功指标 |
| **运维工程师** | [运维指南](operations/index.md) | 日常运维、故障处理、性能调优 |
| **集成测试工程师** | [集成测试指南](integration_testing/index.md) | E2E 测试、混沌工程、灰度发布 |

---

## 文档体系架构

```
Cloud Ops Agent 文档体系
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│                         Cloud_Product_Ops_2026.md                    │
│                         (综合概述文档)                               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           角色视角文档                                │
├─────────────┬─────────────┬─────────────┬─────────────┬────────────┤
│  架构设计   │   研发指南   │   语料工程   │   测试指南   │   产品管理 │
│  Architecture│ Development │   Corpus    │  Testing    │  Product   │
├─────────────┼─────────────┼─────────────┼─────────────┼────────────┤
│  • 整体架构 │  • 开发环境  │  • 语料设计  │  • Harness  │  • 用户画像│
│  • 组件设计 │  • 工具开发  │  • Prompt   │  • Benchmark │  • 需求管理│
│  • 高可用   │  • Agent实现  │  • SFT/RLHF │  • 质量度量  │  • Roadmap │
│  • 安全架构 │  • 调试部署  │  • 评估数据  │  • 回归测试  │  • 定价    │
├─────────────┼─────────────┼─────────────┼─────────────┼────────────┤
│             │   运维指南   │  集成测试   │                         │
│             │  Operations  │Integration  │                         │
│             ├─────────────┼─────────────┤                         │
│             │  • 日常运维 │  • E2E 测试 │                         │
│             │  • 故障处理 │  • 混沌工程 │                         │
│             │  • 变更管理 │  • 性能测试 │                         │
│             │  • 容量规划 │  • 灰度发布 │                         │
└─────────────┴─────────────┴─────────────┴─────────────────────────┘
```

---

## 核心设计原则

| 原则 | 说明 | 实现方式 |
|------|------|---------|
| **模块化 (Modular)** | 各能力解耦为独立组件 | Sub Agent 独立部署 |
| **可观测 (Observable)** | 一切操作均可追踪 | 全链路 Tracing |
| **可插拔 (Pluggable)** | 工具与插件热加载 | Tool Registry |
| **安全 (Secure)** | 零信任安全模型 | RBAC + 审计 |
| **容错 (Resilient)** | 故障自动恢复 | 熔断 + 自愈 |

---

## 最佳实践标准

每个子指南中均包含标准的**最佳实践**章节，统一涵盖：

- **性能调优参数**: 推荐的系统参数配置
- **灰度发布策略**: 新版本的渐进式发布
- **故障演练步骤**: 定期进行故障模拟
- **可观测性指标模板**: 关键监控指标

---

### 专项文档
- [语料工程](corpus/index.md) - AI 训练数据
- [产品管理](product/index.md) - 产品规划
- [集成测试](integration_testing/index.md) - E2E 测试
- [运维指南](operations/index.md) - 运维实践

### 移动端产品
- [Mobile AI Ops 设计](../Mobile_AI_Ops_Design.md) - 基于 Google Edge Gallery 的手拍即运维产品设计
1. [CloudOps-in-nutshell.md](../CloudOps-in-nutshell.md) - 速成指南
2. [Cloud_Product_Ops_for_dummy.md](../Cloud_Product_Ops_for_dummy.md) - 入门详解
3. [Cloud_Product_Ops_2026.md](../Cloud_Product_Ops_2026.md) - 完整架构

### 核心文档
- [架构设计](architecture/index.md) - 系统架构详解
- [研发指南](development/index.md) - 开发规范
- [测试指南](testing/index.md) - 评测体系

### 专项文档
- [语料工程](corpus/index.md) - AI 训练数据
- [产品管理](product/index.md) - 产品规划
- [集成测试](integration_testing/index.md) - E2E 测试
- [运维指南](operations/index.md) - 运维实践

---

## 相关主题

| 主题 | 文档 |
|------|------|
| SRE 实践 | [AI_Ops/SRE_for_AI_Systems.md](../../16_AI_Ops/SRE_for_AI_Systems.md) |
| 事故响应 | [AI_Ops/AI_Incident_Response_Playbook.md](../../16_AI_Ops/AI_Incident_Response_Playbook.md) |
| 可观测性 | [AI_Ops/AI_Observability_Guide.md](../../16_AI_Ops/AI_Observability_Guide.md) |
| Agent Harness | [Agent_Production/Agent_Harness_Complete_2026.md](../../13_Agent_Production/16_Agent_Evaluation/Agent_Harness_Complete_2026.md) |

---

*最后更新: 2026-04-15*
*维护者: Cloud Ops Agent 团队*

## Related

- [[18_Cloud_Ops_Agent/CloudOps-in-nutshell]] — 云产品运维 Agent 速成指南 (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/Cloud_Product_Ops_for_dummy]] — 云产品运维 Agent 入门指南 (for Dummies) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/docs/architecture/index]] — 云产品运维 Agent 架构设计指南 (Architecture) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/docs/corpus/index]] — 云产品运维 Agent 语料工程指南 (Corpus Engineering) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/docs/templates/arch_template.md|arch_template]]
