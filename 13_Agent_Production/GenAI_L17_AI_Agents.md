---
title: "AI代理(Agents)"
category: "course"
tags: ["microsoft-genai-course", "ai-agents", "langchain", "autogen", "taskweaver", "jarvis"]
summary: "详解AI代理概念与四大框架：LangChain Agents、AutoGen、TaskWeaver、JARVIS，涵盖状态管理、工具集成和多代理协作。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/17-ai-agents/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 17
---

## 学习目标

完成本课后，你将能够：

- 解释什么是AI代理以及它们如何使用，理解AI代理的核心组成
- 理解一些流行AI代理框架之间的区别及其差异，能够选择合适的框架
- 理解AI代理的工作原理，以便构建相关应用

## 本课前置知识

建议先了解大型语言模型（LLM）的基本概念、API调用方式以及Python编程基础。了解函数调用（Function Calling）的概念将有助于理解代理如何使用工具。

## 引言：AI代理是生成式AI的下一个前沿

AI代理是生成式AI的一个令人兴奋的进展，使大型语言模型（LLM）能够从助手进化为能够执行操作的代理。

**助手 vs 代理的区别**：

| 维度 | 助手（Assistant） | 代理（Agent） |
|------|-------------------|---------------|
| 角色 | 被动回答问题 | 主动规划和执行任务 |
| 能力 | 只能生成文本 | 可以调用工具、执行操作 |
| 自主性 | 需要明确指令 | 可以分解复杂任务 |
| 状态 | 无持久状态 | 维护对话状态和历史 |
| 工具 | 无 | 可访问数据库、API等 |

AI代理框架使开发人员能够创建让LLM访问工具和状态管理的应用。这些框架还增强了**可视性（Visibility）**，使用户和开发者能够监控LLM计划的操作，从而改进体验管理。

本课将涵盖以下内容：

- 理解什么是AI代理
- 探索四种不同的AI代理框架
- 将AI代理应用于不同的使用场景

## 一、什么是AI代理

### 定义

AI代理是在生成式AI领域非常令人兴奋的一个方向。随之而来的是术语和应用的混淆。为保持简单且涵盖大多数称为AI代理的工具，我们使用如下定义：

> **AI代理允许大型语言模型（LLM）通过给予其访问状态（State）和工具（Tools）来执行任务。**

### 三大核心要素

#### 1. 大型语言模型（LLM）

这是AI代理的大脑，包括本课程提到的模型如GPT-3.5、GPT-4、Llama-2等。LLM负责：

- 理解用户意图
- 规划完成任务所需的步骤
- 决定何时以及如何使用工具
- 整合工具返回的结果
- 生成最终的回答

#### 2. 状态（State）

状态指LLM工作的**上下文（Context）**。包括：

- **对话历史**：之前说了什么
- **操作历史**：之前执行了什么操作，结果如何
- **当前上下文**：用户当前的请求和环境信息

LLM利用过去操作的上下文和当前上下文来指导后续操作的决策。AI代理框架使开发者更容易维护此上下文。

#### 3. 工具（Tools）

为完成用户请求并由LLM规划的任务，LLM需要访问工具。工具可以是：

- **数据库**：查询和操作数据
- **API**：调用外部服务（天气、搜索、支付等）
- **外部应用**：与其他系统集成
- **另一个LLM**：将子任务委托给专门的模型

### AI代理的工作流程

一个典型的AI代理工作流程如下：

```
用户请求
    ↓
LLM理解意图
    ↓
LLM规划任务步骤
    ↓
选择并调用合适的工具
    ↓
接收工具返回的结果
    ↓
更新状态（记忆结果）
    ↓
决定是否需要更多步骤
    ↓
如需要，重复执行；如完成，生成最终回答
```

## 二、LangChain Agents

### 概述

[LangChain Agents](https://python.langchain.com/docs/how_to/#agents?WT.mc_id=academic-105485-koreyst)实现了上述AI代理的定义，是目前最流行的AI代理框架之一。

### 核心架构

#### 状态管理：AgentExecutor

为管理状态，LangChain使用一个内置函数`AgentExecutor`。该函数接受两个核心参数：

- **`agent`**：已定义的代理（LLM + 提示策略）
- **`tools`**：代理可以使用的工具列表

`AgentExecutor`的核心功能：

- 接收用户输入
- 将输入传递给代理进行决策
- 执行代理选择的工具调用
- 将工具结果返回给代理
- 重复直到代理认为任务完成
- 保存聊天记录以提供对话上下文

#### 工具目录

LangChain提供了一个[工具目录](https://integrations.langchain.com/tools?WT.mc_id=academic-105485-koreyst)，可以导入应用，使LLM能访问它们。这些工具由社区和LangChain团队制作。

工具类型包括：

- **搜索工具**：Google搜索、Bing搜索等
- **数据库工具**：SQL数据库查询
- **API工具**：各种第三方API集成
- **文件工具**：文件读写和处理
- **代码工具**：代码执行和调试

#### 可观测性：LangSmith

可视性是谈论AI代理时另一个重要方面。应用开发者需要了解LLM使用了哪个工具以及原因。为此，LangChain团队开发了**LangSmith**。

LangSmith的功能：

- 追踪代理的每一步操作
- 记录工具调用的输入和输出
- 可视化代理的决策过程
- 帮助调试和优化代理行为

### LangChain Agents的使用模式

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import Tool

tools = [
    Tool(name="Search", func=search_function, description="搜索互联网信息"),
    Tool(name="Calculator", func=calculator_function, description="执行数学计算"),
]

agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)

result = agent_executor.invoke({"input": "今天北京的天气如何？"})
```

## 三、AutoGen（微软）

### 概述

[AutoGen](https://microsoft.github.io/autogen/?WT.mc_id=academic-105485-koreyst)是微软开发的AI代理框架，主要关注**对话**能力。AutoGen的代理既是**可对话的**又是**可定制的**。

### 核心特性

#### 特性一：可对话的代理（Conversable）

LLM可以与另一个LLM开启并继续对话，以完成任务。通过创建`AssistantAgents`并赋予其特定的系统消息实现。

```python
autogen.AssistantAgent(
    name="Coder",
    llm_config=llm_config,
)

pm = autogen.AssistantAgent(
    name="Product_manager",
    system_message="Creative in software product ideas.",
    llm_config=llm_config,
)
```

每个`AssistantAgent`可以有不同的：

- **名称**：标识代理的角色
- **系统消息**：定义代理的行为和专业领域
- **LLM配置**：可以使用不同的模型和参数

#### 特性二：可定制的代理（Customizable）

代理不仅可以定义为LLM，还可以是用户或工具。作为开发者，可以定义一个`UserProxyAgent`，负责与用户互动以获取完成任务的反馈。

```python
user_proxy = UserProxyAgent(name="user_proxy")
```

`UserProxyAgent`的功能：

- 代表人类用户参与对话
- 可以请求用户提供输入
- 可以执行代码
- 可以决定继续或停止任务

### 状态和工具管理

为了更改和管理状态，助手代理生成Python代码以完成任务。

#### 完整工作流程

**步骤1：用系统消息定义LLM**

```python
system_message="For weather related tasks, only use the functions you have been provided with. Reply TERMINATE when the task is done."
```

此系统消息指导该特定LLM哪些函数与其任务相关。AutoGen允许定义多个带有不同系统消息的AssistantAgents。

**步骤2：聊天由用户发起**

```python
user_proxy.initiate_chat(
    chatbot,
    message="I am planning a trip to NYC next week, can you help me pick out what to wear?",
)
```

该来自user_proxy（人类）的消息将启动代理探索应执行函数的过程。

**步骤3：执行函数**

```bash
chatbot (to user_proxy):

***** Suggested tool Call: get_weather *****
Arguments: {"location":"New York City, NY","time_periond:"7","temperature_unit":"Celsius"}
********************************************************
--------------------------------------------------------------------------------

>>>>>>>> EXECUTING FUNCTION get_weather...
user_proxy (to chatbot):
***** Response from calling function "get_weather" *****
112.22727272727272 EUR
****************************************************************
```

初始聊天处理后，代理将发送建议调用的工具。根据配置，该函数可以自动执行和被代理读取，或基于用户输入执行。

### AutoGen的多代理协作模式

AutoGen特别擅长多代理协作：

| 协作模式 | 描述 | 适用场景 |
|----------|------|----------|
| **两人对话** | 两个代理直接对话 | 简单任务分工 |
| **群组对话** | 多个代理参与讨论 | 复杂问题需要多角度 |
| **层级对话** | 有管理者协调的对话 | 需要统筹规划的任务 |
| **人机协作** | 代理与人类交替对话 | 需要人类判断的任务 |

更多[AutoGen代码示例](https://microsoft.github.io/autogen/docs/Examples/?WT.mc_id=academic-105485-koreyst)可以帮助深入了解如何入门构建。

## 四、TaskWeaver（微软）

### 概述

[TaskWeaver](https://microsoft.github.io/TaskWeaver/?WT.mc_id=academic-105485-koreyst)是微软开发的另一个代理框架，被称为"代码优先"代理，因为它不仅处理字符串，还能操作Python中的DataFrame。

### 核心特点

#### 代码优先的优势

- 可以处理复杂的数据结构（DataFrame、数组等）
- 适合数据分析和生成任务
- 支持图表绘制和可视化
- 可以生成和执行随机数等操作

### 架构设计

#### 规划器（Planner）

TaskWeaver使用`Planner`概念来管理对话状态。`Planner`是一个LLM，接收用户请求并规划完成请求所需的任务。

Planner的工作方式：

1. 接收用户请求
2. 分析请求需要哪些步骤
3. 确定每个步骤需要哪些插件
4. 按顺序组织任务执行计划
5. 监控执行过程并处理异常

#### 插件（Plugins）

为完成任务，`Planner`可以访问名为`Plugins`的工具集合。这些可以是：

- **Python类**：封装特定功能的类
- **通用代码解释器**：执行任意代码

插件被存储为**嵌入（Embeddings）**，方便LLM搜索正确的插件。

#### 插件示例

以下是一个处理异常检测的插件示例：

```python
class AnomalyDetectionPlugin(Plugin):
    def __call__(self, df: pd.DataFrame, time_col_name: str, value_col_name: str):
        # 异常检测逻辑实现
        # 处理DataFrame中的时间序列数据
        # 识别异常值并返回结果
        pass
```

**代码验证**：所有代码会在执行前进行验证，确保安全性和正确性。

#### 体验机制（Experience）

TaskWeaver管理上下文的另一特性是`experience`。体验允许：

- 会话上下文长期存储到YAML文件
- 配置后，LLM可以参考过往对话
- 随时间改进特定任务的表现
- 知识积累和复用

### TaskWeaver适用场景

| 场景 | 描述 |
|------|------|
| 数据分析 | 处理和分析大型数据集 |
| 图表生成 | 根据数据生成可视化图表 |
| 异常检测 | 在时间序列数据中识别异常 |
| 报表生成 | 自动化数据报表流程 |
| 随机数据生成 | 生成测试数据和模拟数据 |

## 五、JARVIS（微软）

### 概述

[JARVIS](https://github.com/microsoft/JARVIS?tab=readme-ov-file&WT.mc_id=academic-105485-koreyst)是微软开发的代理框架，其独特之处在于使用一个LLM管理对话的状态，而工具则是其他AI模型。

### 核心架构

#### 四阶段工作流程

**阶段1：任务规划（Task Planning）**

LLM接收用户请求，识别具体任务及完成任务所需的参数/数据：

```python
[{"task": "object-detection", "id": 0, "dep": [-1], "args": {"image": "e1.jpg" }}]
```

LLM将用户请求分解为结构化的任务列表，包含：

- **task**：任务类型（如对象检测、图像描述等）
- **id**：任务标识符
- **dep**：依赖的任务ID
- **args**：任务参数

**阶段2：模型选择（Model Selection）**

系统根据任务类型选择最合适的AI模型。这些AI模型是专用模型，执行特定任务如：

- 对象检测
- 语音转录
- 图像标题生成
- 文本摘要
- 情感分析

**阶段3：任务执行（Task Execution）**

LLM以专用AI模型能理解的格式（如JSON）整理请求，AI模型做出预测。

**阶段4：响应生成（Response Generation）**

LLM接收AI模型的响应，如需多模型协作完成任务，LLM会解析这些模型的响应，然后汇总生成对用户的回复。

### JARVIS的独特优势

| 特点 | 说明 |
|------|------|
| **多模型协作** | 不同专用模型协同完成复杂任务 |
| **LLM作为调度器** | 通用LLM负责规划和协调 |
| **Hugging Face集成** | 直接使用HF上的数千个模型 |
| **任务依赖管理** | 处理模型间的依赖关系 |

### 工作流程示例

当用户请求"描述并计数图片中的物体"时：

1. LLM分析请求，确定需要两个任务：对象检测 + 计数
2. 选择对象检测模型处理图片
3. 获取检测结果（检测到的物体列表）
4. 使用计数逻辑或另一个模型完成计数
5. LLM汇总结果生成自然语言回答

## 六、四大框架对比

| 维度 | LangChain Agents | AutoGen | TaskWeaver | JARVIS |
|------|-----------------|---------|------------|--------|
| **核心定位** | 通用代理框架 | 多代理对话 | 数据分析代理 | 多模型调度 |
| **状态管理** | AgentExecutor | 对话历史 | Planner + Experience | LLM调度 |
| **工具类型** | 通用工具目录 | Python代码 | DataFrame插件 | 专用AI模型 |
| **数据能力** | 文本为主 | 文本 | DataFrame、图表 | 多模态 |
| **多代理** | 支持 | 核心特性 | 不支持 | 不适用 |
| **适合场景** | 通用应用 | 多角色协作 | 数据分析 | 多模型任务 |
| **开源** | 是 | 是（微软） | 是（微软） | 是（微软） |
| **学习曲线** | 中等 | 中等 | 较低 | 较高 |

### 框架选择建议

| 需求 | 推荐框架 | 理由 |
|------|----------|------|
| 通用任务自动化 | LangChain | 丰富的工具生态 |
| 多角色对话/协作 | AutoGen | 专为多代理对话设计 |
| 数据分析和可视化 | TaskWeaver | 原生支持DataFrame |
| 多模型协作 | JARVIS | 专业的模型调度能力 |
| 快速原型 | LangChain/AutoGen | 文档丰富，社区活跃 |
| 企业级应用 | AutoGen/TaskWeaver | 微软支持，企业友好 |

## 七、AI代理的适用场景

### 何时应该使用AI代理

AI代理特别适合以下场景：

- **多步骤任务**：需要分解为多个子任务的复杂请求
- **需要外部数据**：需要从数据库或API获取信息的场景
- **需要执行操作**：不仅是回答问题，还需要采取行动
- **动态决策**：需要根据中间结果调整策略的场景

### 何时不应该使用AI代理

以下场景可能不需要完整的代理框架：

- **简单问答**：直接使用LLM即可
- **单步骤任务**：不需要工具调用的简单任务
- **确定性流程**：步骤固定的自动化任务
- **高可靠性要求**：不允许LLM自主决策的关键任务

## 八、AI代理开发最佳实践

### 1. 明确系统消息

系统消息是指导代理行为的关键。好的系统消息应该：

- 明确代理的角色和能力范围
- 列出可用的工具及其用途
- 定义任务完成的标志
- 设置安全边界和限制

### 2. 工具设计原则

设计代理可用的工具时：

- 每个工具应有清晰的描述
- 工具的输入输出应该类型明确
- 工具应该有错误处理机制
- 避免提供过于强大的工具

### 3. 可观测性和调试

- 记录代理的每一步决策
- 监控工具调用的频率和成功率
- 建立代理行为的可视化追踪
- 设置异常行为的告警

### 4. 安全性考虑

- 限制代理可以执行的操作范围
- 对敏感操作添加人工确认步骤
- 监控和过滤代理的输出
- 实施速率限制防止滥用

## 作业

### 实践任务：使用AutoGen构建多代理应用

使用AutoGen构建以下应用：

1. 模拟教育创业公司不同部门业务会议的应用
2. 创建系统消息，引导LLM理解不同角色和优先事项：
   - 产品经理：关注用户需求和产品价值
   - 工程师：关注技术可行性和实现方案
   - 市场营销：关注市场定位和推广策略
3. 使用户能够推销新产品想法
4. LLM应针对各部门生成后续问题，以完善和改进推销及产品想法

### 进阶挑战

- 尝试使用LangChain Agents实现相同的场景
- 比较不同框架在相同任务上的表现差异
- 为代理添加记忆功能，使其能够学习过去的交互

## 知识检查

**问题**：AI代理与普通LLM助手的核心区别是什么？

1. AI代理只能生成文本，不能调用外部工具
2. AI代理通过赋予LLM访问状态和工具的能力，能够主动规划和执行任务
3. AI代理不使用大型语言模型，完全依赖规则引擎

**答案**：2

**解析**：

AI代理的核心定义是让LLM通过获得状态（上下文）和工具（数据库、API等）的访问权来执行任务，从被动回答问题进化为主动规划和执行操作。选项1描述的是普通助手的能力，选项3描述的是传统自动化工具而非AI代理。

## 扩展阅读

- [[90_Learn/Microsoft_GenAI_For_Beginners]] - 课程总览
- [[13_Agent_Production/Agent_Frameworks/README]] - 代理框架详解
- [[13_Agent_Production/Agentic_Design_Patterns_AndrewNg]] - 代理设计模式
- [[13_Agent_Production/Agent_Workflow/Workflow-in-nutshell]] - 代理工作流
- [[11_RAG_Systems/RAG-in-nutshell]] - RAG与代理的结合
- [[13_Agent_Production/GenAI_L12_Designing_UX_for_AI_Applications]] - AI应用UX设计

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[04_NLP_LLMs/GenAI_L16_Open_Source_Models_and_Hugging_Face|L16 开源模型与Hugging Face]] | [[04_NLP_LLMs/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs|L18 微调大型语言模型]] |
