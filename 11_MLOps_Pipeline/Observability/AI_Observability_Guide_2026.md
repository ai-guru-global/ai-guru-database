---
title: "AI 可观测性 2026 完全指南"
category: "11-mlops-pipeline"
tags: ["observability", "monitoring", "langfuse", "langsmith", "tracing", "ai-ops"]
summary: "LLM 应用的可观测性体系:追踪、监控、评估、成本分析,含 Langfuse/LangSmith/Helicone 等工具对比。"
sources:
  - "https://langfuse.com/"
  - "https://smith.langchain.com/"
  - "https://helicone.ai/"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: core
---

# AI 可观测性 2026 完全指南

> **一句话理解**: LLM 应用的可观测性体系:追踪、监控、评估、成本分析,含 Langfuse/LangSmith/Helicone 等工具对比。

## 为什么 LLM 应用需要专门的可观测性?

传统 APM (Application Performance Monitoring) 无法覆盖 LLM 特有的关注点:

| 关注点 | 传统 APM | LLM 可观测性 |
|--------|---------|-------------|
| 延迟 | 有 | 有 + 首 token 延迟 |
| 错误率 | 有 | 有 + 幻觉率 |
| 成本 | 无 | Token 级成本追踪 |
| 质量 | 无 | LLM-as-Judge 评估 |
| 安全 | 基础 | 提示注入检测 |
| 追踪 | HTTP 级 | Prompt -> 检索 -> 生成全链路 |

## 可观测性三支柱

### 1. 追踪 (Tracing)
- **全链路追踪**: 用户查询 -> 检索 -> LLM 生成 -> 工具调用
- **Span 级详情**: 每个步骤的输入/输出/耗时/token
- **关联分析**: 从最终回答追溯到具体检索文档

### 2. 监控 (Monitoring)
- **实时指标**: 延迟、吞吐、错误率、token 消耗
- **成本追踪**: 按用户/模型/功能维度的成本分析
- **质量指标**: 用户满意度、评估分数趋势
- **告警**: 异常检测(延迟飙升、成本突增)

### 3. 评估 (Evaluation)
- **在线评估**: 生产流量的实时质量评估
- **离线评估**: 批量测试集的定期评估
- **A/B 测试**: 不同 prompt/模型的效果对比
- **回归检测**: 部署后质量是否下降

## 主流工具对比

| 工具 | 类型 | 特点 | 定价 |
|------|------|------|------|
| [Langfuse](https://langfuse.com/) | 开源+云 | 全链路追踪、评估、Prompt 管理 | 免费/付费 |
| [LangSmith](https://smith.langchain.com/) | 云 | LangChain 生态深度集成 | 付费 |
| [Helicone](https://helicone.ai/) | 开源+云 | API 代理模式、零侵入 | 免费/付费 |
| [Braintrust](https://braintrust.dev/) | 云 | 评估驱动、数据集管理 | 付费 |
| [Phoenix (Arize)](https://phoenix.arize.com/) | 开源 | 可观测性 + 评估 | 免费 |
| [PromptLayer](https://promptlayer.com/) | 云 | Prompt 版本管理 + 监控 | 免费/付费 |

## 实现架构

```
LLM 应用
  |
  +-- SDK 埋点 (Langfuse SDK)
  |     |
  |     v
  |   Langfuse Server (自托管/云)
  |     |
  |     v
  |   Dashboard (追踪/监控/评估)
  |
  +-- 或 API 代理 (Helicone)
        |
        v
      Helicone (零代码接入)
        |
        v
      Dashboard
```

## 关键指标

### 性能指标
| 指标 | 定义 | 目标 |
|------|------|------|
| TTFT (首 token 延迟) | 用户发出请求到收到第一个 token | < 500ms |
| 总延迟 | 完整响应时间 | < 3s |
| 吞吐 | 每秒处理请求数 | 取决于规模 |

### 质量指标
| 指标 | 定义 | 目标 |
|------|------|------|
| 幻觉率 | 包含编造信息的比例 | < 5% |
| 任务完成率 | 成功完成用户任务的比例 | > 90% |
| 用户满意度 | 用户评分/反馈 | > 4/5 |

### 成本指标
| 指标 | 定义 | 目标 |
|------|------|------|
| 每请求成本 | 单次请求的 token 费用 | 取决于模型 |
| 每用户成本 | 每月每用户的平均费用 | < 预算 |
| 缓存命中率 | 命中缓存的比例 | > 30% |

## 最佳实践

1. **从开发阶段就开始追踪**: 不要等到上线才加监控
2. **采样而非全量**: 高流量场景使用采样(如 10%)
3. **成本告警**: 设置每日/每月成本上限
4. **定期审查**: 每周审查低分和高成本的请求
5. **关联业务指标**: 将 LLM 指标与业务指标关联

> **关联**: -> [[13_AI_Ops|AI Ops]] | [[13_AI_Ops/LangSmith_Deep_Dive|LangSmith]] | [[13_AI_Ops/Helicone_Deep_Dive|Helicone]] | [[13_AI_Ops/Phoenix_Deep_Dive|Phoenix]]

