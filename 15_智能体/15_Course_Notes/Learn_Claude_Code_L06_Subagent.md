---
title: "Learn Claude Code L06：Subagent — 大任务拆小，干净上下文"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - subagent
  - context-isolation
  - multi-agent
sources:
  - "原始/github-sources/learn-claude-code/s06_subagent/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第六课：通过新增 task 工具 spawn 子 Agent，拥有独立 messages[]，只回传结论，避免主对话上下文被中间过程污染。"
provenance:
  extracted: 0.82
  inferred: 0.15
  ambiguous: 0.03
base_confidence: 0.72
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Learn Claude Code L06 Subagent"
  - Learn_Claude_Code_L06_Subagent

---
# Learn Claude Code L06：Subagent — 大任务拆小，干净上下文

> **一句话理解**: 像“开一个新终端”一样 spawn 一个子 Agent，给它独立 messages[] 专心做一件事，做完只把结论写回笔记，主终端继续干活。

## 问题

Agent 修 bug 时读了 30 个文件、聊了 60 轮，messages 涨到 120 条，其中大量“追踪调用链”的中间过程与最终目标无关，导致上下文拥挤、越来越“健忘”。

## 解决方案

新增 `task` 工具：调用时 spawn 子 Agent，子 Agent 有全新的 `messages[]`，跑自己的循环，结束后只把摘要文本回传给主 Agent。

## 关键设计决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 上下文隔离 | 全新 `messages[]` | 子 Agent 中间过程不污染主 Agent |
| 只回传结论 | `extract_text(last_message)` | 不回传整个 messages 列表 |
| 禁止递归 | 子 Agent 无 task 工具 | 防止无限 spawn |
| 安全策略不跳过 | 子 Agent 工具调用也走 PreToolUse hook | 上下文隔离 ≠ 权限隔离 |

## 伪代码

```python
def spawn_subagent(description: str) -> str:
    sub工具 = [bash, read_file, write_file, edit_file, glob]  # 无 task
    messages = [{"role": "user", "content": description}]

    for _ in range(30):  # 安全限制
        response = client.messages.create(...)
        # ... 执行工具 ...

    return extract_text(messages[-1]["content"])
```

## 关联阅读

- [[学习/courses/share_ai/learn_claude_code]] — 完整 20 课映射
- [[学习/Courses/share_ai/learn_claude_code]] — 仓库引用索引
- [[智能体/Course_Notes/Learn_Claude_Code_L15_Agent_Teams]] — 队友（长期协作 Agent）
- [[智能体/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive]] — 多 Agent 框架对比

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

## 核心技术栈对比

| 技术层 | 方案A | 方案B | 方案C | 选型建议 |
|--------|-------|-------|-------|----------|
| 推理引擎 | 自研循环 | ReAct框架 | Plan-and-Execute | 复杂任务用Plan |
| 记忆系统 | 向量数据库 | KV缓存 | 混合存储 | 长期用向量库 |
| 工具调用 | Function Call | MCP协议 | 自定义API | 标准化用MCP |
| 编排层 | 状态机 | DAG工作流 | 动态规划 | 确定性用DAG |
| 评估层 | 单元测试 | E2E测试 | 人工评审 | 组合使用 |
| 部署层 | 容器化 | Serverless | 混合部署 | 高并发用Serverless |

## 架构设计原则

| 原则 | 说明 | 实践 |
|------|------|------|
| 模块化 | 功能解耦独立演进 | 插件化架构+接口抽象 |
| 可观测 | 全链路追踪可审计 | Trace/Metrics/Logging |
| 容错性 | 单点故障不影响全局 | 重试+熔断+降级 |
| 可扩展 | 水平扩展无瓶颈 | 无状态设计+消息队列 |
| 安全性 | 最小权限+沙箱隔离 | RBAC+输入验证 |
| 可测试 | 各层独立可测 | Mock+契约测试 |

## 性能优化策略

| 策略 | 效果 | 适用场景 |
|------|------|----------|
| 提示词缓存 | 减少重复计算30-50% | 多轮对话/固定前缀 |
| 并行工具调用 | 延迟降低40-60% | 独立工具无依赖 |
| 流式输出 | 首token延迟降低80% | 用户交互场景 |
| 模型路由 | 成本降低50-70% | 简单/复杂任务分流 |
| 上下文压缩 | Token消耗降低60% | 长对话/大文档 |
| 批处理 | 吞吐量提升3-5x | 离线评估/数据处理 |

## 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| Agent循环不终止 | 停止条件不明确 | 设置最大步数+明确终止条件 |
| 工具调用失败 | 参数格式/权限问题 | 增加参数验证+错误重试 |
| 上下文溢出 | 对话过长超出窗口 | 摘要压缩+滑动窗口 |
| 幻觉输出 | 知识不足/提示不当 | RAG增强+事实验证 |
| 响应过慢 | 模型/网络瓶颈 | 模型降级+缓存+并行 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础架构 | 1周 | 理解Agent范式 |
| 基础 | 单Agent实现+工具调用 | 2周 | 可运行原型 |
| 进阶 | 多Agent协作+记忆系统 | 2-3周 | 完整系统 |
| 实战 | 生产部署+评估优化 | 3-4周 | 生产级应用 |
| 精通 | 架构设计+前沿研究 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| ReAct | Reasoning+Acting交替执行范式 |
| Tool Use | Agent调用外部工具的能力 |
| Context Window | 模型单次可处理的token上限 |
| Chain-of-Thought | 逐步推理增强输出质量 |
| Orchestration | 多Agent/步骤的编排调度 |
| Grounding | 将输出锚定到事实/数据源 |
| Hallucination | 模型生成不存在的信息 |
| Agentic Loop | Agent的感知-思考-行动循环 |
