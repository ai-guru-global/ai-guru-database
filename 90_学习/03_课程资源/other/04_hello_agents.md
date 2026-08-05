---
title: Hello-Agents (Datawhale) 课程映射：从零开始构建智能体
category: 90-learn-courses-other
tags:
- learning-paths
- datawhale
- ai-agents
- course-catalog
- hello-agents
- course
- agent-framework
- external-source
sources:
- https://github.com/datawhalechina/hello-agents
- 原始/github-sources/hello-agents
summary: Datawhale Hello-Agents 16 章正课 + 13 个额外章节的完整映射，将每章主题链接到 ai-guru-database 的现有概念页与实战页。
created: 2026-06-12
updated: '2026-07-10'
lifecycle: draft
tier: supporting
base_confidence: 0.82
aliases:
- Hello Agents
- hello agents
- hello_agents
name_zh: "Hello-Agents 课程映射：从零开始构建智能体"
---
# Hello-Agents (Datawhale) 课程映射：从零开始构建智能体

> 中文简称：Hello-Agents 课程映射：从零开始构建智能体

> **一句话理解**: [Hello-Agents](https://github.com/datawhalechina/hello-agents) 是 Datawhale 出品的开源中文 AI Agent 系统教程，强调“AI Native Agent”而非流程驱动型低代码 Agent。全书 16 章正课 + 13 个 Extra-Chapter，从 Agent 基础到自研 HelloAgents 框架，再到记忆、RAG、协议、Agentic RL、评估与综合项目。本页将课程完整课表映射到 `ai-guru-database` 的对应章节。

---

## 课程概览

| 属性 | 说明 |
|------|------|
| **GitHub 仓库** | [datawhalechina/hello-agents](https://github.com/datawhalechina/hello-agents) |
| **本地克隆路径** | `原始/github-sources/hello-agents` |
| **在线阅读** | [国外访问](https://datawhalechina.github.io/hello-agents/) / [国内加速](https://hello-agents.datawhale.cc) |
| **自研框架** | [HelloAgents](https://github.com/jjyaoao/helloagents)（基于 OpenAI 兼容 API） |
| **正课章节** | 16 章（分五大部分） |
| **额外章节** | 13 个 Extra-Chapter |
| **开源协议** | CC BY-NC-SA 4.0 |

---

## 你将学到什么

- 智能体的定义、分类、历史演进与 LLM 驱动新范式
- Transformer、提示工程、主流 LLM 及其能力边界
- 亲手实现 ReAct、Plan-and-Solve、Reflection 等经典 Agent 范式
- 使用 Coze、Dify、FastGPT、n8n 等低代码/无代码平台
- 使用 AutoGen、AgentScope、CAMEL、LangGraph 等主流框架
- 从零构建 HelloAgents 框架并扩展记忆、RAG、上下文工程、协议、评估
- 理解 MCP、A2A、ANP 等 Agent 通信协议
- 掌握 SFT → GRPO 的 Agentic RL 训练流程
- 完成智能旅行助手、自动化深度研究智能体、赛博小镇等综合项目

---

## 完整课程表与章节映射

### 第一部分：智能体与语言模型基础

| 章号 | 章节名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 01 | 初识智能体 | 智能体定义、传感器/执行器、自主性、反射/基于模型/基于目标/基于效用/学习型智能体、反应式/规划式/混合式、符号主义/连接主义 | [[00_入门/01_基础入门/02_AI基础]]、[[15_智能体/14_GenAI课程/05_GenAI_L17_AI_Agent]] | [[15_智能体/14_GenAI课程/05_GenAI_L17_AI_Agent]] |
| 02 | 智能体发展史 | 物理符号系统假说、专家系统、MYCIN、SHRDLU、符号主义瓶颈、连接主义、强化学习、AlphaGo、LLM 驱动智能体 | [[00_入门/AI_History_Timeline]]、[[06_强化学习/01_强化学习基础/03_RL基础|RL_Fundamentals]] | [[00_入门/AI_History_Timeline]] |
| 03 | 大语言模型基础 | N-gram、神经网络语言模型、Transformer、自注意力、提示工程、主流 LLM、能力边界 | [[05_大模型/04_LLM架构/05_LLM架构]]、[[05_大模型/07_提示工程/16_Prompt工程]] | [[05_大模型/04_LLM架构/05_LLM架构]] |

### 第二部分：构建你的大语言模型智能体

| 章号 | 章节名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 04 | 智能体经典范式构建 | ReAct、Plan-and-Solve、Reflection、Thought-Action-Observation 循环、工具调用、HelloAgentsLLM | [[05_大模型/07_提示工程/16_Prompt工程]]、[[15_智能体/03_Agent工作流/06_工作流_简明指南]] | [[05_大模型/07_提示工程/Hello_Agents_L04_ReAct]] |
| 05 | 基于低代码平台的智能体搭建 | Coze、Dify、FastGPT、n8n、插件/工作流/知识库、每日 AI 简报 | [[15_智能体/09_Agent平台/01_Dify_Coze_MLServe_Dive]]、[[14_RAG系统/06_RAG框架/01_Dify_深入分析]] | [[15_智能体/09_Agent平台/01_Dify_Coze_MLServe_Dive]] |
| 06 | 框架开发实践 | AutoGen 0.7.4、AgentScope、CAMEL 角色扮演、LangGraph 图执行、多智能体协作 | [[15_智能体/02_Agent框架/05_AutoGen_深入分析]]、[[15_智能体/02_Agent框架/04_AutoGen_CrewAI_LangGraph_Dive]]、[[15_智能体/02_Agent框架/02_AgentScope_深入分析]] | [[15_智能体/Hello_Agents_L06_Frameworks_AutoGen_LangGraph]] |
| 07 | 构建你的 Agent 框架 | HelloAgents 框架、Agent 基类、消息系统、工具系统、ReActAgent / SimpleAgent / ReflectionAgent / PlanAndSolveAgent | [[15_智能体/02_Agent框架/README]]、[[15_智能体/05_Agent技能/02_Agent_技能_深入分析]] | [[15_智能体/02_Agent框架/README]] |

### 第三部分：高级知识扩展

| 章号 | 章节名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 08 | 记忆与检索 | 感觉/工作/长期记忆、情景/语义/程序性记忆、MemoryManager、RAG Pipeline、Qdrant、Neo4j、SQLite | [[14_RAG系统/01_RAG基础/07_RAG_系统]]、[[14_RAG系统/01_RAG基础/04_GenAI_L15_RAG_and_向量数据库]]、[[14_RAG系统/03_向量数据库/04_Qdrant_深入分析]] | [[15_智能体/Hello_Agents_L08_Memory_RAG]] |
| 09 | 上下文工程 | Prompt Engineering vs Context Engineering、上下文腐蚀、JIT 上下文、GSSC 流水线、压缩整合、结构化笔记、子代理架构 | [[05_大模型/07_提示工程/16_Prompt工程]]、[[15_智能体/03_Agent工作流/06_工作流_简明指南]] | [[05_大模型/07_提示工程/Hello_Agents_L09_Context_Engineering]] |
| 10 | 智能体通信协议 | MCP、A2A、ANP、FastMCP、a2a-sdk、服务发现、去中心化网络 | [[概念/Agent/a2a-protocol]]、[[90_学习/05_参考资料/Articles/04_awesome_mcp_servers]] | [[15_智能体/Hello_Agents_L10_Agent_Protocols]] |
| 11 | Agentic-RL | 预训练、SFT、奖励建模、PPO、RLHF/RLAIF、Agentic RL、MDP、GRPO、推理与工具使用训练 | [[07_模型训练/06_对齐研究/GRPO_and_New_Alignment_Methods]]、[[07_模型训练/06_对齐训练/05_TRL_RLHF_DPO_指南]]、[[06_强化学习/01_强化学习基础/03_RL基础|RL_Fundamentals]] | [[15_智能体/13_Hello_Agents课程/04_Hello_Agents_L11_Agentic_RL]] |
| 12 | 智能体性能评估 | BFCL、GAIA、ToolBench、API-Bank、AgentBench、WebArena、LLM Judge、准精确匹配、Win Rate | [[08_模型评估/02_基准测试/01_Agentic_基准测试_指南]]、[[08_模型评估/04_评估工具/04_LLM_as_Judge_指南]]、[[08_模型评估/02_基准测试/07_LLM_基准测试_Suite_2026]] | [[08_模型评估/02_基准测试/01_Agentic_基准测试_指南]] |

### 第四部分：综合案例进阶

| 章号 | 章节名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 13 | 智能旅行助手 | 多智能体协作、MCP、FastAPI、Vue3、高德地图 API、行程规划、预算计算、地图可视化 | [[15_智能体/14_GenAI课程/05_GenAI_L17_AI_Agent]]、[[概念/Agent/a2a-protocol]] | [[15_智能体/13_Hello_Agents课程/05_Hello_Agents_L13_Travel_Assistant]] |
| 14 | 自动化深度研究智能体 | DeepResearch、TODO Planner、Task Summarizer、Report Writer、SearchTool、NoteTool、SSE 流式 | [[15_智能体/03_Agent工作流/06_工作流_简明指南]]、[[14_RAG系统/04_高级RAG/02_Agentic_RAG_指南]] | [[14_RAG系统/04_高级RAG/02_Agentic_RAG_指南]] |
| 15 | 构建赛博小镇 | Godot 游戏引擎、AI NPC、记忆与好感度系统、2D 像素办公室、情感分析、社会动态模拟 | [[15_智能体/14_GenAI课程/05_GenAI_L17_AI_Agent]]、[[15_智能体/Hello_Agents_L08_Memory_RAG]] | [[15_智能体/13_Hello_Agents课程/06_Hello_Agents_L15_Cyber_Town]] |

### 第五部分：毕业设计及未来展望

| 章号 | 章节名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 16 | 毕业设计 | 开源项目提交、选题原则、生产力/90_学习/创意/数据分析/生活服务类项目、PR 流程 | [[15_智能体/README]]、[[16_编程/01_编程基础/01_AI编程2026指南]] | [[15_智能体/README]] |

---

## 额外章节 (Extra-Chapter)

| 编号 | 名称 | 关键内容 | 相关页面 |
|------|------|----------|----------|
| Extra01 | Agent 面试题总结 + 参考答案 | 岗位相关面试问题与答案 | [[15_智能体/README]] |
| Extra02 | 上下文工程补充知识 | 上下文工程内容扩展 | [[05_大模型/07_提示工程/Hello_Agents_L09_Context_Engineering]] |
| Extra03 | Dify 智能体创建保姆级教程 | Dify 实操流程 | [[14_RAG系统/06_RAG框架/01_Dify_深入分析]]、[[15_智能体/09_Agent平台/01_Dify_Coze_MLServe_Dive]] |
| Extra04 | Hello-Agents 课程常见问题 | FAQ | [[90_学习/03_课程资源/other/04_hello_agents]] |
| Extra05 | Agent Skills 与 MCP 对比解读 | Agent Skills vs MCP | [[15_智能体/05_Agent技能/02_Agent_技能_深入分析]]、[[90_学习/05_参考资料/Articles/04_awesome_mcp_servers]] |
| Extra06 | GUI Agent 科普与实战 | GUI Agent 多场景实战 | [[15_智能体/11_OpenClaw生态/Manus_My_Computer]] |
| Extra07 | 环境配置 | 本地环境配置 | [[01_数学基础/08_Python工具包/01_AI_开发_Environment_配置]] |
| Extra08 | 如何写出好的 Skill | Skill 写作最佳实践 | [[15_智能体/05_Agent技能/Agent_Skills_Practical_Guide]] |
| Extra09 | Agent 应用开发实践踩坑与经验分享 | Code Agent 踩坑总结 | [[15_智能体/README]] |
| Extra10 | Agent Self-Evolution 智能体自进化 | 自进化四类闭环与代表项目 | [[15_智能体/01_Agent基础/13_Agentic_设计_模式_AndrewNg]] |
| Extra11 | WebAgent 科普与实战 | Web Agent 原理与反爬实战 | [[15_智能体/11_OpenClaw生态/README]] |
| Extra12 | 旅行助手后训练实战 | 旅行助手 Demo 打磨成 Planner | [[15_智能体/13_Hello_Agents课程/05_Hello_Agents_L13_Travel_Assistant]] |
| Extra13 | Hello-Agents 视频课录制共创 | 视频课程共创资源 | [[90_学习/03_课程资源/other/04_hello_agents]] |

---

## 学习路径建议

1. **快速体验**: 阅读 [[90_学习/03_课程资源/other/04_hello_agents]] 了解项目背景，直接跳到 [[15_智能体/13_Hello_Agents课程/05_Hello_Agents_L13_Travel_Assistant]] 看完整项目效果。
2. **系统学习**: 按 01 → 03 → 04 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 的顺序阅读，配合 [[90_学习/04_实践指南/02_AI工程路线图2026]] 查漏补缺。
3. **工程实战**: 重点看 [[15_智能体/Hello_Agents_L06_Frameworks_AutoGen_LangGraph]]、[[15_智能体/Hello_Agents_L10_Agent_Protocols]]、[[15_智能体/13_Hello_Agents课程/05_Hello_Agents_L13_Travel_Assistant]]，并结合 [[15_智能体/02_Agent框架/05_AutoGen_深入分析]]、[[14_RAG系统/06_RAG框架/01_Dify_深入分析]] 做项目迁移。

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
