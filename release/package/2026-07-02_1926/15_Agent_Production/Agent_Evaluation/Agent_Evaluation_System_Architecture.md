---
tier: supporting
title: 云产品智能体评估系统 - 系统架构文档
category: 15-agent-production-agent-evaluation-docs-architecture
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 基于 CAPER 五维模型的四层 Harness 架构"
created: 2026-05-31
updated: 2026-05-31
sources: []
---

# 云产品智能体评估系统 - 系统架构文档

> 基于 CAPER 五维模型的四层 Harness 架构

## 1. 架构概览

```
┌─────────────────────────────────────────────────────────────────┐
│                      Monitoring Harness                          │
│   排行榜可视化 · 结果导出 · 趋势监控 · CI/CD 集成                │
├─────────────────────────────────────────────────────────────────┤
│                      Safety Harness                              │
│   提示注入检测 · 毒性评分 · 偏见检测 · 权限边界 · 信息泄露       │
├─────────────────────────────────────────────────────────────────┤
│                      Evaluation Harness                          │
│   CAPER 指标 · LLM-as-Judge · 加权评分 · 等级映射               │
├─────────────────────────────────────────────────────────────────┤
│                      Test Harness                                │
│   数据集加载 · Agent 插件 · 评估管道 · 并行调度                  │
└─────────────────────────────────────────────────────────────────┘
```

## 2. 四层 Harness 详解

### 2.1 Test Harness（测试层）

**职责**: 管理测试数据集、Agent 插件初始化和评估流程编排

| 组件 | 文件路径 | 功能 |
|------|----------|------|
| EvaluationPipeline | `demo/evaluator/core.py` | 主评估管道，加载配置→数据集→插件→评估→导出 |
| AgentPlugin | `demo/plugins/base.py` | Agent 适配器抽象基类 |
| MockPlugin | `demo/plugins/base.py` | 模拟模式插件，预设质量档案 |
| PluginRegistry | `demo/plugins/base.py` | 插件注册中心 |
| AliyunPlugin | `demo/plugins/aliyun_plugin.py` | 阿里云 DashScope 适配 |
| OpenAIPlugin | `demo/plugins/openai_plugin.py` | OpenAI 兼容 API 适配 |

### 2.2 Evaluation Harness（评估层）

**职责**: 实现 CAPER 五维指标计算和评分聚合

| 组件 | 文件路径 | 功能 |
|------|----------|------|
| CAPERMetrics | `demo/evaluator/metrics.py` | 五维指标计算 |
| CAPERScorer | `demo/evaluator/scorer.py` | 加权评分 + 等级映射 + 排名 |
| LLMJudge | `demo/evaluator/llm_judge.py` | 主观维度 LLM 评估 |

**CAPER 五维权重:**
```
C (知识问答)  25% ─── knowledge_accuracy()
A (任务完成)  25% ─── task_completion()
P (性价比)    20% ─── cost_performance()
E (交互质量)  15% ─── interaction_quality()
R (安全合规)  15% ─── safety_compliance()
```

### 2.3 Safety Harness（安全层）

**职责**: 多维度安全检测和风险评估

| 检测类型 | 严重度 | 方法 |
|---------|--------|------|
| 提示注入 | Critical | 正则匹配 10+ 注入模式（中英文） |
| 敏感信息泄露 | High | 检测身份证/手机/邮箱/API Key/密码 |
| 毒性内容 | High | 关键词匹配 + 语义分析 |
| 偏见检测 | Medium | 性别/种族/年龄偏见模式 |
| 权限越界 | Critical | 超出 Agent 权限边界的操作检测 |

### 2.4 Monitoring Harness（监控层）

**职责**: 结果可视化和持续监控

| 组件 | 文件路径 | 功能 |
|------|----------|------|
| LeaderboardPage | `Web/src/pages/leaderboard.tsx` | React 排行榜页面 |
| RadarChart | `Web/src/components/leaderboard/RadarChart.tsx` | SVG 五维雷达图 |
| leaderboardData | `Web/src/data/leaderboardData.ts` | 排行榜数据 |
| sample_results.json | `demo/results/` | JSON 格式结果导出 |

## 3. 数据流

```
config.yaml
    │
    ▼
EvaluationPipeline.__init__()
    │
    ├── CAPERScorer(weights)
    ├── LLMJudge(simulation=True)
    ├── SafetyChecker()
    └── CAPERMetrics()
    │
    ▼
pipeline.run()
    │
    ├── _load_dataset() × 4        ← datasets/*.json
    ├── _init_agents()              ← PluginRegistry.create()
    │
    ├── for agent in agents:
    │   └── _evaluate_agent()
    │       ├── _get_agent_profile() ← MockPlugin.QUALITY_PROFILES
    │       ├── 计算 C/A/P/E/R 五维分数
    │       └── scorer.score_agent() → AgentScoreCard
    │
    ├── scorer.generate_leaderboard()
    └── export → results/sample_results.json
                    │
                    ▼
            Web 排行榜展示
```

## 4. 插件扩展架构

```
AgentPlugin (ABC)
├── call(prompt, context) → AgentResponse
├── health_check() → bool
└── get_info() → dict

    ├── MockPlugin         (内置模拟)
    ├── AliyunPlugin       (阿里云 DashScope)
    ├── OpenAIPlugin       (OpenAI 兼容)
    └── [自定义插件]        (实现 AgentPlugin 接口)

PluginRegistry
├── register(name, class)  # 注册
├── get(name)              # 查询
├── create(name, **kw)     # 创建实例
└── list_plugins()         # 列出所有
```

## 5. 配置驱动设计

系统通过 `config.yaml` 驱动所有行为：

- **评估模式**: simulation（模拟） / live（真实 API）
- **CAPER 权重**: 可自定义五维权重
- **Agent 列表**: 插件名 + API 配置
- **数据集路径**: 指定各维度测试数据
- **输出配置**: 结果目录、格式、排行榜路径

## 6. 相关文件完整路径

| 类别 | 文件 | 完整路径 |
|------|------|----------|
| 入口 | run_evaluation.py | `_projects/Agent_Evaluation/demo/run_evaluation.py` |
| 配置 | config.yaml | `_projects/Agent_Evaluation/demo/config.yaml` |
| 核心 | core.py | `_projects/Agent_Evaluation/demo/evaluator/core.py` |
| 指标 | metrics.py | `_projects/Agent_Evaluation/demo/evaluator/metrics.py` |
| 评分 | scorer.py | `_projects/Agent_Evaluation/demo/evaluator/scorer.py` |
| LLM | llm_judge.py | `_projects/Agent_Evaluation/demo/evaluator/llm_judge.py` |
| 安全 | safety_checker.py | `_projects/Agent_Evaluation/demo/evaluator/safety_checker.py` |
| 插件 | base.py | `_projects/Agent_Evaluation/demo/plugins/base.py` |
| 阿里云 | aliyun_plugin.py | `_projects/Agent_Evaluation/demo/plugins/aliyun_plugin.py` |
| OpenAI | openai_plugin.py | `_projects/Agent_Evaluation/demo/plugins/openai_plugin.py` |
| 排行榜 | leaderboard.tsx | `Web/src/pages/leaderboard.tsx` |
| 雷达图 | RadarChart.tsx | `Web/src/components/leaderboard/RadarChart.tsx` |
| 数据 | leaderboardData.ts | `Web/src/data/leaderboardData.ts` |

## Related

- [[Agent/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
