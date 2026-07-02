---
title: "Hello-Agents (Datawhale) 课程映射：从零开始构建智能体"
category: "90-learn-courses-other"
tags:
  - learning-paths
  - datawhale
  - ai-agents
  - course-catalog
  - hello-agents
sources:
  - "https://github.com/datawhalechina/hello-agents"
  - "_references/hello-agents.md"
summary: "Datawhale Hello-Agents 16 章正课 + 13 个额外章节的完整映射，将每章主题链接到 ai-guru-database 的现有概念页与实战页。"
created: 2026-06-12
updated: 2026-06-12
lifecycle: draft
tier: supporting
base_confidence: 0.82
aliases:
  - "Hello Agents"
  - "hello agents"
  - hello_agents

---
# Hello-Agents (Datawhale) 课程映射：从零开始构建智能体

> **一句话理解**: [Hello-Agents](https://github.com/datawhalechina/hello-agents) 是 Datawhale 出品的开源中文 AI Agent 系统教程，强调“AI Native Agent”而非流程驱动型低代码 Agent。全书 16 章正课 + 13 个 Extra-Chapter，从 Agent 基础到自研 HelloAgents 框架，再到记忆、RAG、协议、Agentic RL、评估与综合项目。本页将课程完整课表映射到 `ai-guru-database` 的对应章节。

---

## 课程概览

| 属性 | 说明 |
|------|------|
| **GitHub 仓库** | [datawhalechina/hello-agents](https://github.com/datawhalechina/hello-agents) |
| **本地克隆路径** | `_raw/github-sources/hello-agents` |
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
| 01 | 初识智能体 | 智能体定义、传感器/执行器、自主性、反射/基于模型/基于目标/基于效用/学习型智能体、反应式/规划式/混合式、符号主义/连接主义 | [[00_AI_Introduction/AI_Fundamentals]]、[[15_Agent_Production/GenAI_L17_AI_Agents]] | [[15_Agent_Production/GenAI_L17_AI_Agents]] |
| 02 | 智能体发展史 | 物理符号系统假说、专家系统、MYCIN、SHRDLU、符号主义瓶颈、连接主义、强化学习、AlphaGo、LLM 驱动智能体 | [[00_AI_Introduction/AI_History_Timeline]]、[[06_Reinforcement_Learning/RL_Fundamentals]] | [[00_AI_Introduction/AI_History_Timeline]] |
| 03 | 大语言模型基础 | N-gram、神经网络语言模型、Transformer、自注意力、提示工程、主流 LLM、能力边界 | [[05_NLP_LLMs/LLM_Architectures/LLM_Architectures]]、[[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]] | [[05_NLP_LLMs/LLM_Architectures/LLM_Architectures]] |

### 第二部分：构建你的大语言模型智能体

| 章号 | 章节名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 04 | 智能体经典范式构建 | ReAct、Plan-and-Solve、Reflection、Thought-Action-Observation 循环、工具调用、HelloAgentsLLM | [[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]]、[[15_Agent_Production/Agent_Workflow/Workflow-in-nutshell]] | [[05_NLP_LLMs/Prompt_Engineering/Hello_Agents_L04_ReAct]] |
| 05 | 基于低代码平台的智能体搭建 | Coze、Dify、FastGPT、n8n、插件/工作流/知识库、每日 AI 简报 | [[15_Agent_Production/Agent_Platforms/Dify_Coze_MLServe_Dive]]、[[14_RAG_Systems/RAG_Frameworks/Dify_Deep_Dive]] | [[15_Agent_Production/Agent_Platforms/Dify_Coze_MLServe_Dive]] |
| 06 | 框架开发实践 | AutoGen 0.7.4、AgentScope、CAMEL 角色扮演、LangGraph 图执行、多智能体协作 | [[15_Agent_Production/Agent_Frameworks/AutoGen_Deep_Dive]]、[[15_Agent_Production/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive]]、[[15_Agent_Production/Agent_Frameworks/AgentScope_Deep_Dive]] | [[15_Agent_Production/Hello_Agents_L06_Frameworks_AutoGen_LangGraph]] |
| 07 | 构建你的 Agent 框架 | HelloAgents 框架、Agent 基类、消息系统、工具系统、ReActAgent / SimpleAgent / ReflectionAgent / PlanAndSolveAgent | [[15_Agent_Production/Agent_Frameworks/README]]、[[15_Agent_Production/Agent_Skills/Agent_Skills_Deep_Dive]] | [[15_Agent_Production/Agent_Frameworks/README]] |

### 第三部分：高级知识扩展

| 章号 | 章节名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 08 | 记忆与检索 | 感觉/工作/长期记忆、情景/语义/程序性记忆、MemoryManager、RAG Pipeline、Qdrant、Neo4j、SQLite | [[14_RAG_Systems/RAG_Systems]]、[[14_RAG_Systems/GenAI_L15_RAG_and_Vector_Databases]]、[[14_RAG_Systems/Vector_Databases/Qdrant_Deep_Dive]] | [[15_Agent_Production/Hello_Agents_L08_Memory_RAG]] |
| 09 | 上下文工程 | Prompt Engineering vs Context Engineering、上下文腐蚀、JIT 上下文、GSSC 流水线、压缩整合、结构化笔记、子代理架构 | [[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]]、[[15_Agent_Production/Agent_Workflow/Workflow-in-nutshell]] | [[05_NLP_LLMs/Prompt_Engineering/Hello_Agents_L09_Context_Engineering]] |
| 10 | 智能体通信协议 | MCP、A2A、ANP、FastMCP、a2a-sdk、服务发现、去中心化网络 | [[15_Agent_Production/Agent_Protocols/A2A_Protocol_Deep_Dive]]、[[_references/awesome-mcp-servers]] | [[15_Agent_Production/Hello_Agents_L10_Agent_Protocols]] |
| 11 | Agentic-RL | 预训练、SFT、奖励建模、PPO、RLHF/RLAIF、Agentic RL、MDP、GRPO、推理与工具使用训练 | [[07_Model_Training/Alignment/GRPO_and_New_Alignment_Methods]]、[[07_Model_Training/Alignment/TRL_RLHF_DPO_Guide]]、[[06_Reinforcement_Learning/RL_Fundamentals]] | [[07_Model_Training/Hello_Agents_L11_Agentic_RL]] |
| 12 | 智能体性能评估 | BFCL、GAIA、ToolBench、API-Bank、AgentBench、WebArena、LLM Judge、准精确匹配、Win Rate | [[08_Model_Evaluation/Benchmarks/Agentic_Benchmark_Guide]]、[[08_Model_Evaluation/Evaluation_Tools/LLM_as_Judge_Guide]]、[[08_Model_Evaluation/Benchmarks/LLM_Benchmark_Suite_2026]] | [[08_Model_Evaluation/Benchmarks/Agentic_Benchmark_Guide]] |

### 第四部分：综合案例进阶

| 章号 | 章节名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 13 | 智能旅行助手 | 多智能体协作、MCP、FastAPI、Vue3、高德地图 API、行程规划、预算计算、地图可视化 | [[15_Agent_Production/GenAI_L17_AI_Agents]]、[[15_Agent_Production/Agent_Protocols/A2A_Protocol_Deep_Dive]] | [[15_Agent_Production/Hello_Agents_L13_Travel_Assistant]] |
| 14 | 自动化深度研究智能体 | DeepResearch、TODO Planner、Task Summarizer、Report Writer、SearchTool、NoteTool、SSE 流式 | [[15_Agent_Production/Agent_Workflow/Workflow-in-nutshell]]、[[14_RAG_Systems/Advanced_RAG/Agentic_RAG_Guide]] | [[14_RAG_Systems/Advanced_RAG/Agentic_RAG_Guide]] |
| 15 | 构建赛博小镇 | Godot 游戏引擎、AI NPC、记忆与好感度系统、2D 像素办公室、情感分析、社会动态模拟 | [[15_Agent_Production/GenAI_L17_AI_Agents]]、[[15_Agent_Production/Hello_Agents_L08_Memory_RAG]] | [[15_Agent_Production/Hello_Agents_L15_Cyber_Town]] |

### 第五部分：毕业设计及未来展望

| 章号 | 章节名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 16 | 毕业设计 | 开源项目提交、选题原则、生产力/学习/创意/数据分析/生活服务类项目、PR 流程 | [[15_Agent_Production/README]]、[[16_AI_Coding/AI_Coding_2026_Guide]] | [[15_Agent_Production/README]] |

---

## 额外章节 (Extra-Chapter)

| 编号 | 名称 | 关键内容 | 相关页面 |
|------|------|----------|----------|
| Extra01 | Agent 面试题总结 + 参考答案 | 岗位相关面试问题与答案 | [[15_Agent_Production/README_for_dummy]] |
| Extra02 | 上下文工程补充知识 | 上下文工程内容扩展 | [[05_NLP_LLMs/Prompt_Engineering/Hello_Agents_L09_Context_Engineering]] |
| Extra03 | Dify 智能体创建保姆级教程 | Dify 实操流程 | [[14_RAG_Systems/RAG_Frameworks/Dify_Deep_Dive]]、[[15_Agent_Production/Agent_Platforms/Dify_Coze_MLServe_Dive]] |
| Extra04 | Hello-Agents 课程常见问题 | FAQ | [[_references/hello-agents]] |
| Extra05 | Agent Skills 与 MCP 对比解读 | Agent Skills vs MCP | [[15_Agent_Production/Agent_Skills/Agent_Skills_Deep_Dive]]、[[_references/awesome-mcp-servers]] |
| Extra06 | GUI Agent 科普与实战 | GUI Agent 多场景实战 | [[15_Agent_Production/OpenClaw_Ecosystem/Manus_My_Computer]] |
| Extra07 | 环境配置 | 本地环境配置 | [[01_Fundamentals/AI_Development_Environment_Setup]] |
| Extra08 | 如何写出好的 Skill | Skill 写作最佳实践 | [[15_Agent_Production/Agent_Skills/Agent_Skills_Practical_Guide]] |
| Extra09 | Agent 应用开发实践踩坑与经验分享 | Code Agent 踩坑总结 | [[15_Agent_Production/README]] |
| Extra10 | Agent Self-Evolution 智能体自进化 | 自进化四类闭环与代表项目 | [[15_Agent_Production/Agentic_Design_Patterns_AndrewNg]] |
| Extra11 | WebAgent 科普与实战 | Web Agent 原理与反爬实战 | WebAgent Guide |
| Extra12 | 旅行助手后训练实战 | 旅行助手 Demo 打磨成 Planner | [[15_Agent_Production/Hello_Agents_L13_Travel_Assistant]] |
| Extra13 | Hello-Agents 视频课录制共创 | 视频课程共创资源 | [[_references/hello-agents]] |

---

## 学习路径建议

1. **快速体验**: 阅读 [[_references/hello-agents]] 了解项目背景，直接跳到 [[15_Agent_Production/Hello_Agents_L13_Travel_Assistant]] 看完整项目效果。
2. **系统学习**: 按 01 → 03 → 04 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 的顺序阅读，配合 [[90_Learn/guides/ai_engineering_roadmap_2026]] 查漏补缺。
3. **工程实战**: 重点看 [[15_Agent_Production/Hello_Agents_L06_Frameworks_AutoGen_LangGraph]]、[[15_Agent_Production/Hello_Agents_L10_Agent_Protocols]]、[[15_Agent_Production/Hello_Agents_L13_Travel_Assistant]]，并结合 [[15_Agent_Production/Agent_Frameworks/AutoGen_Deep_Dive]]、[[14_RAG_Systems/RAG_Frameworks/Dify_Deep_Dive]] 做项目迁移。
