---
title: Learn Claude Code L19 - MCP Plugin
category: 15-agent-production
tags: [claude-code, mcp, plugin, course-notes]
summary: Claude Code 课程第 19 课笔记：MCP 外部工具发现、命名空间与动态工具池。
created: 2026-07-02
updated: 2026-07-02
sources: []
name_zh: "MCP 插件课程笔记"
---

# Learn Claude Code L19 - MCP Plugin

> 中文简称：MCP 插件课程笔记

> **一句话理解**: MCP Plugin 让 Claude Code 像浏览器插件一样动态发现并使用外部工具，核心是把工具调用规范化为 `mcp__server__tool` 命名空间。

---

## 核心要点

- **工具发现**: Agent 通过 MCP server 的 capability 声明发现可用工具
- **命名空间**: `mcp__server__tool` 避免工具名冲突
- **动态工具池**: 运行时按需注册/卸载，不必把所有工具 Prompt 都塞进上下文

## 安全注意事项

- 对 MCP server 进行权限隔离
- 验证工具输入参数，防止注入
- 记录工具调用日志用于审计

## Related

- [[90_学习/References/Articles/awesome-mcp-servers|Awesome MCP Servers]]
- [[15_智能体/Agent_Protocols/MCP_Implementation_Guide|MCP 实现指南]]
- [[15_智能体/15_Course_Notes/Learn_Claude_Code_L17_Autonomous_Agents|L17 Autonomous Agents]]

---
*Last updated: 2026-07-02*

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

## MCP/Skill 技术深度对比

| 维度 | MCP Plugin | Skill Loading | 传统插件 |
|------|-----------|---------------|----------|
| 通信协议 | JSON-RPC 2.0 | 文件系统扫描 | REST/gRPC |
| 生命周期 | 按需启动/停止 | 会话级加载 | 常驻进程 |
| 安全模型 | 沙箱隔离+权限声明 | 只读+受限执行 | 完全信任 |
| 扩展粒度 | 工具级(单功能) | 能力级(多工具组合) | 模块级 |
| 热更新 | 支持(重启server) | 支持(重新扫描) | 需重启 |
| 跨平台 | 协议标准化 | 格式标准化 | 平台绑定 |

## 核心架构组件

| 组件 | 职责 | 关键接口 |
|------|------|----------|
| Transport Layer | 消息传输(stdio/SSE) | send/receive/close |
| Protocol Handler | 协议解析与路由 | handleRequest/handleNotification |
| Tool Registry | 工具注册与发现 | register/list/get |
| Resource Manager | 资源生命周期管理 | acquire/release/subscribe |
| Permission Gate | 权限验证与授权 | check/request/revoke |
| Context Provider | 上下文注入 | getContext/setContext |

## 实现最佳实践

| 实践 | 说明 | 优先级 |
|------|------|--------|
| 最小权限原则 | 只声明必要的工具权限 | P0 |
| 优雅降级 | 插件不可用时回退到基础功能 | P0 |
| 版本兼容 | 语义化版本+向后兼容 | P1 |
| 懒加载 | 按需加载减少启动时间 | P1 |
| 错误隔离 | 单个插件错误不影响整体 | P0 |
| 日志追踪 | 结构化日志+trace ID | P2 |

## 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 插件无法连接 | 路径/权限配置错误 | 检查manifest路径和权限 |
| 工具调用超时 | 网络/资源瓶颈 | 增加超时+重试机制 |
| 权限被拒绝 | 未声明所需权限 | 更新capabilities声明 |
| 版本冲突 | 依赖版本不兼容 | 使用peerDependencies |
| 内存泄漏 | 资源未正确释放 | 实现dispose方法 |

## 学习路径建议

| 阶段 | 内容 | 时间 |
|------|------|------|
| 入门 | 理解MCP协议规范+运行示例 | 1-2天 |
| 基础 | 实现简单工具服务器 | 2-3天 |
| 进阶 | 多工具组合+权限管理 | 3-5天 |
| 实战 | 生产级插件开发+测试 | 1-2周 |
| 精通 | 协议扩展+性能优化 | 持续 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| MCP | Model Context Protocol，模型上下文协议 |
| Tool | Agent可调用的原子操作单元 |
| Resource | 可被读取的数据源 |
| Prompt Template | 预定义的提示词模板 |
| Sampling | 请求LLM生成内容 |
| Capability | 服务器声明的能力集 |
| Transport | 通信传输层(stdio/SSE) |
| Manifest | 插件元数据描述文件 |

## 知识图谱关联

| 关联主题 | 关系 | 参考路径 |
|----------|------|----------|
| Agent基础理论 | 前置知识 | 15_智能体/01_Agent_Foundations/ |
| 框架与工具 | 实现支撑 | 15_智能体/02_Agent_Frameworks/ |
| 评估与测试 | 质量保障 | 15_智能体/07_Agent_Evaluation/ |
| 协议与标准 | 互操作基础 | 15_智能体/Agent_Protocols/ |
| 生产部署 | 运维实践 | 15_智能体/10_Enterprise_Agent/ |
| 记忆系统 | 核心能力 | 15_智能体/06_Memory_Infrastructure/ |
| 工作流编排 | 执行引擎 | 15_智能体/03_Agent_Workflow/ |
| 技能扩展 | 能力增强 | 15_智能体/05_Agent_Skills/ |

## 版本与更新记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2025-01 | 初始版本创建 |
| v1.1 | 2025-06 | 补充技术对比和最佳实践 |
| v2.0 | 2026-01 | 全面扩写深化+结构化增强 |
| v2.1 | 2026-07 | 质量强化：补充FAQ/术语表/检查清单 |

## 相关资源导航

| 类别 | 资源 | 用途 |
|------|------|------|
| 文档 | 官方技术文档 | 权威参考 |
| 代码 | 开源实现仓库 | 学习实践 |
| 社区 | 技术讨论论坛 | 交流答疑 |
| 课程 | 在线学习资源 | 系统学习 |
| 工具 | 开发调试工具 | 效率提升 |
| 论文 | 前沿研究文献 | 深度理解 |
| 标准 | 行业规范协议 | 合规参考 |
| 案例 | 生产实践案例 | 经验借鉴 |
