---
title: Learn Claude Code 课程映射：20 课 Harness 工程
category: 90-learn-courses-share-ai
tags:
- learning-paths
- claude-code
- agent-harness
- course-catalog
- ai-agents
- course
- github-repo
- external-source
sources:
- https://github.com/shareAI-lab/learn-claude-code
summary: shareAI-lab Learn Claude Code 20 课完整映射，列出每课引入的 Harness 机制并链接到本库已有概念页。
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.54
lifecycle: draft
tier: supporting
created: '2026-06-12'
updated: '2026-07-10'
aliases:
- Learn Claude Code
- learn claude code
- learn_claude_code
---
# Learn Claude Code 课程映射：20 课 Harness 工程

> **一句话理解**: [Learn Claude Code](https://github.com/shareAI-lab/learn-claude-code) 是一套从零实现 Claude Code 式 Agent Harness 的 20 节渐进式教程。它主张“能动性来自模型，工程人员负责 Harness”，每章在不变的 `while True` 循环上叠加一个机制。本页将课程完整课表映射到 `ai-guru-database` 的对应章节。

---

## 课程概览

| 属性 | 说明 |
|------|------|
| **GitHub 仓库** | [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) |
| **本地克隆** | `原始/github-sources/learn-claude-code` |
| **课时数量** | 20 课 + 综合章 |
| **前置要求** | Python 基础、Anthropic API key；建议先了解 [[15_智能体/GenAI_L17_AI_Agents|AI 代理基础]] |
| **外部引用** | [[90_学习/Courses/share_ai/learn_claude_code]] |

---

## 完整课表与概念映射

### 第一阶段：核心循环与工具（s01-s04）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s01 | Agent Loop | 最小 `while True` 循环；`stop_reason == "tool_use"` 决定是否继续 | [[15_智能体/15_Course_Notes/Learn_Claude_Code_L01_Agent_Loop|L01 笔记]], [[15_智能体/GenAI_L17_AI_Agents|AI 代理]], [[15_智能体/04_Agent_Harness/The_Anatomy_of_an_Agent_Harness|Harness 解剖]] |
| s02 | Tool Use | 工具定义 + `TOOL_HANDLERS` 分发映射；多工具并发安全 | [[15_智能体/GenAI_L11_Integrating_with_Function_Calling|函数调用]], [[15_智能体/05_Agent_Skills/Tool_Calling_Best_Practices|工具调用最佳实践]] |
| s03 | Permission | 三道权限闸门：硬拒绝、规则匹配、用户审批 | [[15_智能体/15_Course_Notes/Learn_Claude_Code_L03_Permission_System|L03 笔记]], [[15_智能体/10_Enterprise_Agent/Agent_Production_2026|Agent 生产治理]] |
| s04 | Hooks | 循环扩展点：`UserPromptSubmit` / `PreToolUse` / `PostToolUse` / `Stop` | [[15_智能体/04_Agent_Harness/Agent_Harness_Architecture_2026|Harness 架构]] |

### 第二阶段：复杂任务处理（s05-s08）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s05 | TodoWrite | `todo_write` 计划工具 + nag reminder，先列清单再执行 | [[15_智能体/03_Agent_Workflow/Workflow-in-nutshell|工作流概述]], [[15_智能体/01_Agent_Foundations/Agentic_Design_Patterns_AndrewNg|代理设计模式]] |
| s06 | Subagent | 子 Agent：独立 `messages[]`、只回传结论、禁止递归 | [[15_智能体/15_Course_Notes/Learn_Claude_Code_L06_Subagent|L06 笔记]] |
| s07 | Skill Loading | 技能两级加载：SYSTEM 放目录，`load_skill` 按需注入完整内容 | [[15_智能体/Learn_Claude_Code_L07_Skill_Loading|L07 笔记]], [[15_智能体/05_Agent_Skills/Skills-in-nutshell|Agent Skills 速览]] |
| s08 | Context Compact | 四层压缩管线：snip / micro / budget / LLM 摘要 + reactive 应急 | [[15_智能体/15_Course_Notes/Learn_Claude_Code_L08_Context_Compact|L08 笔记]] |

### 第三阶段：记忆与恢复（s09-s11）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s09 | Memory | 跨会话记忆：`.memory/` Markdown 文件 + `MEMORY.md` 索引 + 每轮提取/整理 | [[15_智能体/15_Course_Notes/Learn_Claude_Code_L09_Memory_System|L09 笔记]], [[15_智能体/06_Memory_Infrastructure/Agent_Memory_Systems_2026|Agent 记忆系统 2026]] |
| s10 | System Prompt | system prompt 分段定义、按真实状态运行时组装、缓存 | [[15_智能体/04_Agent_Harness/Agent_Harness_Architecture_2026|Harness 架构]], [[05_大模型/08_Prompt_Engineering/Prompt_Engineering|提示工程]] |
| s11 | Error Recovery | 错误恢复：输出截断升级、上下文超限 reactive compact、429/529 指数退避与 fallback 模型 | [[15_智能体/04_Agent_Harness/Harness-in-nutshell|Harness 速览]] |

### 第四阶段：长期运行与调度（s12-s14）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s12 | Task System | 文件持久化任务图：`blockedBy` 依赖、`claim` / `complete` 状态机 | [[15_智能体/15_Course_Notes/Learn_Claude_Code_L12_Task_System|L12 笔记]] |
| s13 | Background Tasks | 慢操作后台线程 + `<task_notification>` 注入，主循环不阻塞 | [[15_智能体/04_Agent_Harness/Agent_Harness_Architecture_2026|Harness 架构]] |
| s14 | Cron Scheduler | 独立调度线程 + `cron_queue` + queue processor，支持 durable / session-only 任务 | [[15_智能体/04_Agent_Harness/Harness-in-nutshell|Harness 速览]], [[11_模型运维/06_CI_CD/ML_CI_CD|ML CI/CD]] |

### 第五阶段：多 Agent 协作（s15-s18）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s15 | Agent Teams | `MessageBus` 文件收件箱；Lead + 持久队友线程并行工作 | [[15_智能体/15_Course_Notes/Learn_Claude_Code_L15_Agent_Teams|L15 笔记]], [[15_智能体/02_Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive|多 Agent 框架对比]] |
| s16 | Team Protocols | 结构化请求-响应协议：`request_id` 关联、`shutdown` / `plan_approval` 握手 | [[15_智能体/16_Agent_Protocols/A2A_Protocol_Deep_Dive|A2A 协议]] |
| s17 | Autonomous Agents | 队友自组织：`idle_poll` 轮询收件箱 + 任务板自动认领 | [[15_智能体/15_Course_Notes/Learn_Claude_Code_L17_Autonomous_Agents|L17 笔记]], [[15_智能体/01_Agent_Foundations/Agentic_Design_Patterns_AndrewNg|代理设计模式]] |
| s18 | Worktree Isolation | 任务绑定 git worktree，队友在独立目录并行执行 | [[15_智能体/08_Agentic_Coding_Tools/Claude_Code_Deep_Dive|Claude Code 深度解析]] |

### 第六阶段：外部能力与综合（s19-s20）

| 课号 | 课程名称 | 引入的 Harness 机制 | 本库相关概念/页面 |
|------|----------|---------------------|-------------------|
| s19 | MCP Plugin | MCP 外部工具发现与调用：`mcp__server__tool` 命名空间、动态工具池 | [[15_智能体/Learn_Claude_Code_L19_MCP_Plugin|L19 笔记]], [[90_学习/References/Articles/awesome-mcp-servers|Awesome MCP Servers]] |
| s20 | Comprehensive Agent | 把 s01-s19 的机制挂回同一个循环，展示完整 harness 数据流 | [[90_学习/Courses/share_ai/learn_claude_code|仓库引用]], [[15_智能体/04_Agent_Harness/The_Anatomy_of_an_Agent_Harness|Harness 解剖]] |

---

## 学习建议

1. **先通读 s01-s04**：理解“循环不变、机制外挂”的设计哲学，再看后续章节会更清晰。
2. **重点突破 s08、s09、s12**：上下文压缩、记忆、任务图是长期运行 Agent 的三大支柱。
3. **多 Agent 部分按顺序读**：s15（团队邮箱）→ s16（协议）→ s17（自治）→ s18（隔离），每层解决一个真实协作问题。
4. **配合本库阅读**：遇到通用概念（如 [[15_智能体/04_Agent_Harness/The_Anatomy_of_an_Agent_Harness|Harness 解剖]]、[[15_智能体/06_Memory_Infrastructure/Agent_Memory_Systems_2026|记忆系统 2026]]）可跳转加深理解。

---

## 相关页面

- [[90_学习/Courses/share_ai/learn_claude_code]] — 仓库外部源引用索引
- [[15_智能体/04_Agent_Harness/The_Anatomy_of_an_Agent_Harness]] — Harness 工程定义
- [[15_智能体/08_Agentic_Coding_Tools/Claude_Code_Deep_Dive]] — Claude Code 产品解析
- [[90_学习/guides/ai_engineering_roadmap_2026]] — AI 工程师学习路线
- [[90_学习/guides/learning_paths_2026]] — 本库 6 条学习路径总览
- [[15_智能体/15_Course_Notes/Learn_Claude_Code_L07_Skill_Loading]] — L07: Skill 两级加载机制
- [[15_智能体/15_Course_Notes/Learn_Claude_Code_L19_MCP_Plugin]] — L19: MCP Plugin 工具发现

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化

## 进阶内容补充

| 主题 | 深度解析 | 实践要点 | 参考资源 |
|------|----------|----------|----------|
| 原理深入 | 底层机制剖析 | 源码阅读+实验验证 | 官方文档+论文 |
| 工程实现 | 生产级代码实践 | 设计模式+测试覆盖 | 开源项目 |
| 性能调优 | 瓶颈定位+优化 | Profiling+基准测试 | 性能工具 |
| 安全加固 | 威胁建模+防护 | 安全审计+渗透测试 | 安全框架 |
| 架构演进 | 系统设计与重构 | 渐进式改造+验证 | 架构书籍 |

## 实践操作指南

| 步骤 | 操作 | 验证方法 | 常见问题 |
|------|------|----------|----------|
| 环境搭建 | 安装依赖+配置 | 运行hello world | 版本冲突 |
| 基础使用 | 核心API调用 | 单元测试通过 | 参数错误 |
| 功能开发 | 业务逻辑实现 | 集成测试通过 | 边界条件 |
| 性能优化 | 热点优化+缓存 | 压测达标 | 内存泄漏 |
| 部署上线 | 容器化+CI/CD | 灰度验证通过 | 配置差异 |

## 技术选型决策

| 考量因素 | 权重 | 评估方法 | 决策标准 |
|----------|------|----------|----------|
| 功能匹配 | 30% | 需求清单对比 | 覆盖核心需求 |
| 性能表现 | 25% | 基准测试 | 满足SLA |
| 社区生态 | 20% | Star/Issue/更新频率 | 活跃维护 |
| 学习成本 | 15% | 文档质量+上手时间 | 团队可接受 |
| 长期维护 | 10% | 路线图+兼容性 | 可持续发展 |

## 故障排查流程

| 阶段 | 动作 | 工具 | 产出 |
|------|------|------|------|
| 复现 | 稳定复现问题 | 日志+断点 | 复现步骤 |
| 定位 | 缩小问题范围 | 二分法+排除法 | 问题模块 |
| 分析 | 找到根本原因 | 源码+文档 | 根因报告 |
| 修复 | 实施修复方案 | 代码修改+测试 | 修复PR |
| 验证 | 确认问题消除 | 回归测试 | 验证报告 |
| 预防 | 防止再次发生 | 监控+文档 | 改进措施 |

## 知识关联图谱

| 关联领域 | 关系 | 学习顺序 |
|----------|------|----------|
| 前置基础 | 必须先掌握 | 先学 |
| 并行技能 | 相互增强 | 同步 |
| 进阶方向 | 深入发展 | 后学 |
| 应用场景 | 价值体现 | 实践 |
| 工具支撑 | 效率提升 | 随时 |

## 持续改进清单

- [ ] 定期回顾和更新知识
- [ ] 实践验证理论认知
- [ ] 关注社区最新动态
- [ ] 参与技术讨论和分享
- [ ] 将经验沉淀为文档
- [ ] 持续优化工作流程
