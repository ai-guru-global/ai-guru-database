---
title: Cloud Ops Agent 知识库首页
category: 18-cloud-ops-agent-docs
tags: ["cloud-ops", "devops", "sre", "automation", "ai-agents"]
summary: "欢迎来到 Cloud Ops Agent 的单一可信源（Single Source of Truth）。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []
name_zh: "云运维智能体文档"
name_en: "docs"
---

# Cloud Ops Agent 知识库首页

> 中文简称：云运维智能体文档 ｜ English Name: docs

欢迎来到 Cloud Ops Agent 的单一可信源（Single Source of Truth）。
基于 Agent Harness 的设计理念，本文档库对 Agent 开发、语料工程、测评、架构、产品经理、集成测试六类角色的核心知识点进行了系统性重构与拆分。

---

## 角色视角导航

### 面向不同角色的文档

| 角色 | 文档 | 核心关注点 |
|------|------|-----------|
| **架构师** | [架构设计指南](./architecture/index.md) | 顶层设计、高可用、安全架构 |
| **Agent 开发工程师** | [研发指南](./development/index.md) | 工具开发、Agent 实现、调试部署 |
| **语料工程师** | [语料工程指南](./corpus/index.md) | 训练语料、Prompt 工程、Fine-tuning |
| **测评工程师** | [测试指南](./testing/index.md) | 评测框架、Benchmark、质量度量 |
| **产品经理** | [产品管理指南](./product/index.md) | 需求管理、Roadmap、成功指标 |
| **运维工程师** | [运维指南](./operations/index.md) | 日常运维、故障处理、性能调优 |
| **集成测试工程师** | [集成测试指南](./integration_testing/index.md) | E2E 测试、混沌工程、灰度发布 |

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
- [语料工程](./corpus/index.md) - AI 训练数据
- [产品管理](./product/index.md) - 产品规划
- [集成测试](./integration_testing/index.md) - E2E 测试
- [运维指南](./operations/index.md) - 运维实践

### 移动端产品
- [Mobile AI Ops 设计](../Mobile_AI_Ops_Design.md) - 基于 Google Edge Gallery 的手拍即运维产品设计
1. [CloudOps-in-nutshell.md](../CloudOps-in-nutshell.md) - 速成指南
2. [Cloud_Product_Ops_for_dummy.md](../Cloud_Product_Ops_for_dummy.md) - 入门详解
3. [Cloud_Product_Ops_2026.md](../Cloud_Product_Ops_2026.md) - 完整架构

### 核心文档
- [架构设计](./architecture/index.md) - 系统架构详解
- [研发指南](./development/index.md) - 开发规范
- [测试指南](./testing/index.md) - 评测体系

### 专项文档
- [语料工程](./corpus/index.md) - AI 训练数据
- [产品管理](./product/index.md) - 产品规划
- [集成测试](./integration_testing/index.md) - E2E 测试
- [运维指南](./operations/index.md) - 运维实践

---

## 相关主题

| 主题 | 文档 |
|------|------|
| SRE 实践 | [AI_Ops/SRE_for_AI_Systems.md](../../13_AI_Ops/SRE_for_AI_Systems.md) |
| 事故响应 | [AI_Ops/AI_Incident_Response_Playbook.md](../../13_AI_Ops/AI_Incident_Response_Playbook.md) |
| 可观测性 | [AI_Ops/AI_Observability_Guide.md](../../13_AI_Ops/AI_Observability_Guide.md) |
| Agent Harness | [Agent_Production/Agent_Harness_Complete_2026.md](../../智能体/Agent_Evaluation/Agent_Harness_Complete_2026.md) |

---

*最后更新: 2026-04-15*
*维护者: Cloud Ops Agent 团队*

## Related

- [[_projects/Cloud_Ops_Agent/CloudOps-in-nutshell]] — 云产品运维 Agent 速成指南 (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[_projects/Cloud_Ops_Agent/Cloud_Product_Ops_for_dummy]] — 云产品运维 Agent 入门指南 (for Dummies) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[_projects/Cloud_Ops_Agent/docs/architecture/index]] — 云产品运维 Agent 架构设计指南 (Architecture) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[_projects/Cloud_Ops_Agent/docs/corpus/index]] — 云产品运维 Agent 语料工程指南 (Corpus Engineering) (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[_projects/Cloud_Ops_Agent/docs/templates/arch_template.md|arch_template]]

## MLOps核心流程对比

| 阶段 | 关键活动 | 工具链 | 质量指标 |
|------|----------|--------|----------|
| 数据管理 | 采集/清洗/标注/版本化 | DVC/LakeFS/Label Studio | 数据质量分/覆盖率 |
| 模型训练 | 实验管理/超参搜索/分布式训练 | MLflow/W&B/Ray | 收敛速度/最终精度 |
| 模型评估 | 离线评估/对比实验/偏差检测 | Great Expectations/Evidently | 准确率/公平性指标 |
| 模型部署 | 容器化/服务化/灰度发布 | K8s/Seldon/vLLM | 延迟/吞吐/可用性 |
| 模型监控 | 漂移检测/性能退化/告警 | Prometheus/Evidently/Grafana | 漂移分数/告警准确率 |
| 模型迭代 | A/B测试/自动重训/版本回滚 | Argo/Kubeflow/MLflow | 迭代周期/线上指标 |

## 运维关键指标体系

| 指标类别 | 具体指标 | 目标值 | 监控频率 |
|----------|----------|--------|----------|
| 可用性 | 服务可用率 | >99.9% | 实时 |
| 性能 | P99推理延迟 | <2s | 实时 |
| 质量 | 模型准确率 | >基线5% | 每日 |
| 漂移 | 数据/概念漂移分数 | <阈值 | 每小时 |
| 成本 | GPU利用率/每请求成本 | >80%利用率 | 每日 |
| 安全 | 对抗攻击检测率 | >95% | 实时 |

## 常见运维问题与解决方案

| 问题 | 根因 | 解决方案 | 预防措施 |
|------|------|----------|----------|
| 模型性能退化 | 数据分布漂移 | 触发重训/回滚 | 漂移监控+自动告警 |
| 推理延迟飙升 | 流量突增/资源不足 | 自动扩容+限流 | 容量规划+压测 |
| GPU OOM | 批处理过大/显存泄漏 | 减小batch/重启 | 显存监控+限制 |
| 数据管道中断 | 上游变更/格式错误 | Schema验证+告警 | 契约测试+版本化 |
| 模型版本混乱 | 缺乏版本管理 | MLflow统一注册 | 强制版本化流程 |

## 模型生命周期管理

| 阶段 | 状态 | 关键操作 | 负责人 |
|------|------|----------|--------|
| 开发 | Staging | 训练+评估+注册 | ML工程师 |
| 验证 | Validating | 集成测试+性能测试 | QA+ML工程师 |
| 发布 | Released | 灰度发布+监控 | MLOps工程师 |
| 运行 | Active | 监控+维护+告警 | SRE+MLOps |
| 退役 | Archived | 流量切换+归档 | MLOps工程师 |

## 自动化运维实践

| 实践 | 实现方式 | 收益 |
|------|----------|------|
| CI/CD for ML | 自动化训练-评估-部署流水线 | 迭代速度提升5x |
| 自动重训 | 漂移触发+定时触发 | 模型始终保持最新 |
| 自动扩缩容 | HPA基于QPS/GPU利用率 | 成本优化30-50% |
| 自动回滚 | 指标异常自动切回旧版本 | 故障恢复<5min |
| 自动告警 | 多级告警+智能降噪 | 减少误报80% |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | MLOps概念+基础工具 | 1-2周 | 理解全流程 |
| 基础 | 模型部署+基础监控 | 2-3周 | 能部署和监控模型 |
| 进阶 | 自动化流水线+漂移检测 | 3-4周 | 构建CI/CD流水线 |
| 实战 | 生产级运维体系 | 4-6周 | 独立运维能力 |
| 精通 | 平台化+规模化运维 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| MLOps | 机器学习运维(ML+DevOps) |
| Model Drift | 模型性能随时间退化 |
| Data Drift | 输入数据分布变化 |
| Concept Drift | 目标关系变化 |
| Canary Release | 金丝雀发布(小流量验证) |
| Blue-Green | 蓝绿部署(双环境切换) |
| Feature Store | 特征存储(统一管理特征) |
| Model Registry | 模型注册中心(版本管理) |
| Serving | 模型服务化(在线推理) |
| Batch Inference | 批量推理(离线处理) |

## 检查清单

- [ ] 模型版本管理和注册中心已建立
- [ ] 自动化CI/CD流水线已配置
- [ ] 模型监控和漂移检测已部署
- [ ] 自动扩缩容策略已配置
- [ ] 告警规则和响应流程已定义
- [ ] 回滚机制已测试验证
- [ ] 成本监控和优化持续进行
- [ ] 安全审计和合规检查已覆盖
