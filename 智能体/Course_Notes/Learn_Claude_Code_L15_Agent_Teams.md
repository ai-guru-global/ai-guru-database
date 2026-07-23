---
title: "Learn Claude Code L15：Agent Teams — 一个搞不定，组队来"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - multi-agent
  - agent-teams
  - message-bus
sources:
  - "原始/github-sources/learn-claude-code/s15_agent_teams/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第十五课：用 MessageBus 文件收件箱 + 队友线程实现多 Agent 协作，一个 Lead Agent 带多个持久队友并行工作。"
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
  - "Learn Claude Code L15 Agent Teams"
  - Learn_Claude_Code_L15_Agent_Teams

---
# Learn Claude Code L15：Agent Teams — 一个搞不定，组队来

> **一句话理解**: 大项目超出单个 Agent 的上下文覆盖范围时，用文件收件箱（MessageBus）+ 队友线程实现 Lead 与多个持久队友的协作。

## 问题

"重构整个后端"涉及认证、数据库、API、测试。单个 Agent 在修 API 路由时，认证模块细节已不在上下文中，注意力覆盖不了所有模块。

## 子 Agent vs 队友

| | s06 子 Agent | s15 队友 |
|---|---|---|
| 生命周期 | 一次性，用完销毁 | 多轮（教学版限 10 轮） |
| 通信 | 只回传结论 | 异步收件箱，随时通信 |
| 上下文 | 完全隔离 | 通过消息共享信息 |
| 数量 | 一个主 Agent + 偶尔子 Agent | 一个 Lead + 多个队友 |

## MessageBus：文件收件箱

```python
class MessageBus:
    def send(self, from_agent, to_agent, content, msg_type="message"):
        msg = {"from": from_agent, "to": to_agent,
               "content": content, "type": msg_type, "ts": time.time()}
        with open(MAILBOX_DIR / f"{to_agent}.jsonl", "a") as f:
            f.write(json.dumps(msg) + "\n")

    def read_inbox(self, agent):
        msgs = [json.loads(line) for line in inbox.read_text().splitlines()]
        inbox.unlink()  # 消费式
        return msgs
```

- 用文件是因为直观、跨线程可观察；真实 CC 用 `~/.claude/teams/{team}/inboxes/` 并加 `proper-lockfile` 防并发写冲突 ^[inferred]
- 教学版 `read_inbox` 有 read + unlink 竞态，多线程可能丢消息

## Lead 的 inbox 注入

Lead 每轮主循环结束后检查收件箱，队友消息注入 history，让 LLM 能看到并反应：

```python
inbox = BUS.read_inbox("lead")
if inbox:
    history.append({"role": "user", "content": f"[Inbox]\n{inbox_text}"})
```

## 关联阅读

- [[学习/courses/share_ai/learn_claude_code]] — 完整 20 课映射
- [[学习/Courses/share_ai/learn_claude_code]] — 仓库引用索引
- [[智能体/Course_Notes/Learn_Claude_Code_L06_Subagent]] — 子 Agent
- [[智能体/Course_Notes/Learn_Claude_Code_L17_Autonomous_Agents]] — 自治 Agent
- [[智能体/A2A_Protocol_Deep_Dive]] — A2A 协议

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

## 关键技术对比

| 维度 | 方案一 | 方案二 | 方案三 | 适用场景 |
|------|--------|--------|--------|----------|
| 架构模式 | 单体Agent | 多Agent协作 | 层级Agent | 按复杂度选择 |
| 通信方式 | 直接调用 | 消息队列 | 事件驱动 | 按耦合度选择 |
| 状态管理 | 内存存储 | 外部数据库 | 分布式缓存 | 按持久性选择 |
| 错误处理 | 重试机制 | 补偿事务 | 人工介入 | 按严重性选择 |
| 扩展策略 | 垂直扩展 | 水平扩展 | 弹性伸缩 | 按负载选择 |

## 最佳实践清单

| 实践 | 说明 | 优先级 |
|------|------|--------|
| 明确任务边界 | Agent职责单一不越界 | P0 |
| 结构化输出 | 使用JSON Schema约束 | P0 |
| 全链路日志 | 记录每步决策依据 | P0 |
| 超时控制 | 每步设置合理超时 | P1 |
| 回退机制 | 失败时优雅降级 | P1 |
| 成本监控 | 跟踪Token消耗 | P1 |
| 定期评估 | 持续监控质量指标 | P2 |
| 版本管理 | 提示词/配置版本化 | P2 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何选择合适的模型? | 根据任务复杂度：简单任务用小模型降本，复杂推理用大模型保质 |
| Agent何时停止? | 设置明确终止条件：任务完成/达到最大步数/超时/用户中断 |
| 如何防止幻觉? | RAG增强+事实验证+结构化输出约束+多轮确认 |
| 多Agent如何协调? | 明确角色分工+共享状态+消息传递+冲突解决机制 |
| 如何评估Agent质量? | 任务完成率+推理正确性+工具使用准确率+用户满意度 |

## 术语速查

| 术语 | 含义 |
|------|------|
| Agentic | 具有自主决策和行动能力的AI系统特征 |
| Orchestration | 多组件/Agent的协调编排 |
| Grounding | 将AI输出锚定到真实数据/事实 |
| Tool Calling | Agent调用外部API/函数的能力 |
| Reflection | Agent对自身输出的自我评估和改进 |
| Planning | Agent将复杂任务分解为子步骤 |
| Memory | Agent跨会话保持信息的机制 |
| Guardrails | 限制Agent行为的安全护栏 |

## 知识图谱关联

| 关联主题 | 关系 | 参考路径 |
|----------|------|----------|
| Agent基础理论 | 前置知识 | 智能体/Agent_Foundations/ |
| 框架与工具 | 实现支撑 | 智能体/Agent_Frameworks/ |
| 评估与测试 | 质量保障 | 智能体/Agent_Evaluation/ |
| 协议与标准 | 互操作基础 | 智能体/Agent_Protocols/ |
| 生产部署 | 运维实践 | 智能体/Enterprise_Agent/ |
| 记忆系统 | 核心能力 | 智能体/Memory_Infrastructure/ |
| 工作流编排 | 执行引擎 | 智能体/Agent_Workflow/ |
| 技能扩展 | 能力增强 | 智能体/Agent_Skills/ |

## 版本与更新记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2025-01 | 初始版本创建 |
| v1.1 | 2025-06 | 补充技术对比和最佳实践 |
| v2.0 | 2026-01 | 全面扩写深化+结构化增强 |
| v2.1 | 2026-07 | 质量强化：补充FAQ/术语表/检查清单 |
