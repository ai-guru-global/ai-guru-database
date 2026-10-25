---
title: "Learn Claude Code L03：Permission — 执行前做权限判断"
category: 15-agent-production
tags:
  - ai-agents
  - agent-harness
  - claude-code
  - permission
  - security
  - safety
sources:
  - "原始/github-sources/learn-claude-code/s03_permission/README.md"
  - "https://github.com/shareAI-lab/learn-claude-code"
summary: "Learn Claude Code 第三课：在工具执行前插入三道权限闸门——硬拒绝、规则匹配、用户审批——防止模型执行危险操作。"
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
  - "Learn Claude Code L03 Permission System"
  - Learn_Claude_Code_L03_Permission_System

name_zh: "Learn Claude Code L03：Permission — 执行前做权"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Learn Claude Code L03：Permission — 执行前做权限判断

> 中文简称：Learn Claude Code L03：Permission — 执行前做权

> **一句话理解**: 安全不能靠信任模型，要靠代码——在工具执行前插入 `check_permission()`，三道闸门决定放行、拒绝还是问用户。

## 问题

Agent 有 bash 等强力工具。让它“清理一下项目”，理论上可能执行 `rm -rf /`。必须在做之前做权限判断。

## 三道闸门

| 闸门 | 作用 | 命中后 |
|------|------|--------|
| 1. 拒绝列表 | 永远禁止的操作（`rm -rf /`、`sudo`、`shutdown`） | 直接拒绝 |
| 2. 规则匹配 | 取决于上下文的操作（写工作区外、`rm` 文件） | 交给闸门 3 |
| 3. 用户审批 | 规则命中后暂停等用户确认 | 用户决定允许/拒绝 |

三道都没命中 → 直接执行。

## 关键代码模式

```python
def check_permission(block) -> bool:
    # 闸门 1: 硬拒绝
    if block.name == "bash":
        reason = check_deny_list(block.input.get("command", ""))
        if reason:
            return False

    # 闸门 2 + 3: 规则匹配 → 用户审批
    reason = check_rules(block.name, block.input)
    if reason:
        decision = ask_user(block.name, block.input, reason)
        if decision == "deny":
            return False

    return True
```

## 设计要点

- 教学版用简单字符串匹配演示，命令变体可能绕过 ^[extracted]
- 真实 Claude Code 有更复杂的权限同步机制（permissionSync.ts、useSwarmPermissionPoller.ts）^[inferred]
- 权限判断只改变“是否执行”，不改变 agent loop 本身

## 关联阅读

- [[90_学习/03_课程资源/share_ai/01_learn_claude_code]] — 完整 20 课映射
- [[90_学习/03_课程资源/share_ai/01_learn_claude_code]] — 仓库引用索引
- [[15_智能体/10_企业级Agent/03_Agent_生产_2026]] — Agent 生产治理
- [[15_智能体/15_课程笔记/Learn_Claude_Code_L01_Agent_Loop]] — L01 最小循环

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
| Agent基础理论 | 前置知识 | 15_智能体/01_Agent基础/ |
| 框架与工具 | 实现支撑 | 15_智能体/02_Agent框架/ |
| 评估与测试 | 质量保障 | 15_智能体/07_Agent评估/ |
| 协议与标准 | 互操作基础 | 15_智能体/Agent_Protocols/ |
| 生产部署 | 运维实践 | 15_智能体/10_企业级Agent/ |
| 记忆系统 | 核心能力 | 15_智能体/06_记忆基础设施/ |
| 工作流编排 | 执行引擎 | 15_智能体/03_Agent工作流/ |
| 技能扩展 | 能力增强 | 15_智能体/05_Agent技能/ |

## 版本与更新记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2025-01 | 初始版本创建 |
| v1.1 | 2025-06 | 补充技术对比和最佳实践 |
| v2.0 | 2026-01 | 全面扩写深化+结构化增强 |
| v2.1 | 2026-07 | 质量强化：补充FAQ/术语表/检查清单 |
