---
title: "Learn Claude Code L09：Memory — 压缩会丢细节，要有一层不丢的"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - memory
  - persistence
sources:
  - "原始/github-sources/learn-claude-code/s09_memory/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第九课：用文件系统实现跨压缩、跨会话的记忆层——.memory/ Markdown 文件 + MEMORY.md 索引 + 每轮结束后的提取器。"
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
  - "Learn Claude Code L09 Memory System"
  - Learn_Claude_Code_L09_Memory_System

name_zh: "Learn Claude Code L09：Memory — 压缩会丢细节，要有"
---
# Learn Claude Code L09：Memory — 压缩会丢细节，要有一层不丢的

> 中文简称：Learn Claude Code L09：Memory — 压缩会丢细节，要有

> **一句话理解**: LLM 没有持久状态，上下文压缩又会丢细节。记忆层用文件系统保存稳定偏好和项目知识，跨压缩、跨会话保留。

## 问题

s08 的 autoCompact 会把当前目标写进摘要，但细节会丢失（如“用 tab 缩进”被简化成“用户有代码风格偏好”）。而且新开会话连摘要也没了。

## 解决方案

- 存储：`.memory/` 目录下每个记忆一个 `.md` 文件，带 YAML frontmatter（`name` / `description` / `type`）
- 索引：`MEMORY.md` 一行一个链接，常驻 SYSTEM prompt
- 加载：按需把相关记忆注入当前 user turn
- 写入：每轮对话结束后由提取器自动保存新记忆

## 四类记忆

| 类型 | 回答什么 | 示例 |
|------|---------|------|
| user | 你是谁 | “用 tab 不用空格” |
| feedback | 怎么做事 | “别 mock 数据库” |
| project | 正在发生什么 | “auth 重写是合规驱动” |
| reference | 东西在哪找 | “pipeline bug 在 Linear INGEST” |

## 加载路径

1. **索引常驻 SYSTEM**：`build_system()` 把 `MEMORY.md` 清单注入 prompt（可被 prompt cache 缓存）^[extracted]
2. **相关记忆按需注入**：每轮开始时用轻量 side-query 选出相关记忆文件，再读内容注入 user turn（最多 5 条）^[extracted]

## 写入时机

`extract_memories()` 在模型停止且没有 tool_use 时运行：先检查是否已有重复，再用 LLM 提取 `{name, type, description, body}` JSON 数组，只有确实有新信息时才写文件。

## 关联阅读

- [[90_学习/03_课程资源/share_ai/01_learn_claude_code]] — 完整 20 课映射
- [[90_学习/03_课程资源/share_ai/01_learn_claude_code]] — 仓库引用索引
- [[15_智能体/15_课程笔记/Learn_Claude_Code_L08_Context_Compact]] — 上下文压缩
- [[15_智能体/06_记忆基础设施/01_Agent_Memory_系统_2026]] — Agent 记忆系统 2026

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
