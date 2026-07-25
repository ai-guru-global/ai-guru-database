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
| LeaderboardPage | `前端应用/src/pages/leaderboard.tsx` | React 排行榜页面 |
| RadarChart | `前端应用/src/components/leaderboard/RadarChart.tsx` | SVG 五维雷达图 |
| leaderboardData | `前端应用/src/data/leaderboardData.ts` | 排行榜数据 |
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
| 入口 | run_evaluation.py | `15_智能体/07_Agent_Evaluation/demo/run_evaluation.py` |
| 配置 | config.yaml | `15_智能体/07_Agent_Evaluation/demo/config.yaml` |
| 核心 | core.py | `15_智能体/07_Agent_Evaluation/demo/evaluator/core.py` |
| 指标 | metrics.py | `15_智能体/07_Agent_Evaluation/demo/evaluator/metrics.py` |
| 评分 | scorer.py | `15_智能体/07_Agent_Evaluation/demo/evaluator/scorer.py` |
| LLM | llm_judge.py | `15_智能体/07_Agent_Evaluation/demo/evaluator/llm_judge.py` |
| 安全 | safety_checker.py | `15_智能体/07_Agent_Evaluation/demo/evaluator/safety_checker.py` |
| 插件 | base.py | `15_智能体/07_Agent_Evaluation/demo/plugins/base.py` |
| 阿里云 | aliyun_plugin.py | `15_智能体/07_Agent_Evaluation/demo/plugins/aliyun_plugin.py` |
| OpenAI | openai_plugin.py | `15_智能体/07_Agent_Evaluation/demo/plugins/openai_plugin.py` |
| 排行榜 | leaderboard.tsx | `前端应用/src/pages/leaderboard.tsx` |
| 雷达图 | RadarChart.tsx | `前端应用/src/components/leaderboard/RadarChart.tsx` |
| 数据 | leaderboardData.ts | `前端应用/src/data/leaderboardData.ts` |

## Related

- [[15_智能体/07_Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*
