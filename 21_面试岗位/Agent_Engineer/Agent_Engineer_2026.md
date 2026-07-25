---
title: Agent Engineer 岗位面试指南 (2026)
category: 21-interviews-agent-engineer
tags: [interviews, career, agent, llm, react, multi-agent, tool-use, memory, system-design, production]
summary: 面向 Agent 工程师岗位（L3-L5+）的面试准备指南，覆盖岗位定位、核心考点（ReAct / Plan-and-Execute / Multi-Agent / Memory / Tool Use）、系统设计题、代码题、行为面试与领导力题，以及学习路径推荐。
created: 2026-07-01
updated: 2026-07-01
tier: supporting
aliases:
  - Agent Engineer Interview
  - Agent 工程师面试
sources: []
---

# Agent Engineer 岗位面试指南 (2026)

> **一句话理解**: Agent Engineer 是连接大模型能力与企业业务系统的桥梁，既要懂 LLM 的行为边界与提示工程，又要能设计、实现并运维具备记忆、工具调用与多 Agent 协作能力的生产级 Agent 系统。

---

## Table of Contents

- [1. 岗位定位与技能栈](#1-岗位定位与技能栈)
  - [1.1 岗位定位](#11-岗位定位)
  - [1.2 核心技能栈](#12-核心技能栈)
  - [1.3 与相近岗位的区别](#13-与相近岗位的区别)
- [2. 核心考点](#2-核心考点)
  - [2.1 ReAct 与推理-行动循环](#21-react-与推理-行动循环)
  - [2.2 Plan-and-Execute 架构](#22-plan-and-execute-架构)
  - [2.3 Multi-Agent 协作](#23-multi-agent-协作)
  - [2.4 Memory 设计与长期记忆](#24-memory-设计与长期记忆)
  - [2.5 Tool Use 与 Function Calling](#25-tool-use-与-function-calling)
  - [2.6 Agent 安全与护栏](#26-agent-安全与护栏)
- [3. 系统设计题](#3-系统设计题)
  - [3.1 设计一个客服 Agent](#31-设计一个客服-agent)
  - [3.2 设计一个多 Agent 协作平台](#32-设计一个多-agent-协作平台)
- [4. 代码题](#4-代码题)
  - [4.1 Function Calling 解析与执行](#41-function-calling-解析与执行)
  - [4.2 RAG 检索增强生成](#42-rag-检索增强生成)
  - [4.3 Agent 主循环实现](#43-agent-主循环实现)
- [5. 行为面试与领导力面试题](#5-行为面试与领导力面试题)
  - [5.1 行为面试题](#51-行为面试题)
  - [5.2 领导力面试题](#52-领导力面试题)
- [6. 面试 Checklist](#6-面试-checklist)
- [7. 学习路径推荐](#7-学习路径推荐)
- [Related](#related)

---

## 1. 岗位定位与技能栈

### 1.1 岗位定位

Agent Engineer（Agent 工程师）是 2024-2026 年快速兴起的一类工程岗位，核心职责是**将大语言模型从“聊天机器人”升级为能够自主规划、调用工具、持续学习并与外部系统交互的智能体**。与传统的 ML Engineer 或 Backend Engineer 不同，Agent Engineer 的工作重心不是训练模型，而是：

- **设计 Agent 架构**: 选择单 Agent 还是多 Agent、ReAct 还是 Plan-and-Execute、有状态还是无状态。
- **构建工具生态（Tooling）**: 定义、注册、封装、测试可被 Agent 安全调用的外部 API、数据库、代码执行环境。
- **实现记忆系统（Memory）**: 管理短期上下文、长期用户画像、任务轨迹与知识库索引。
- **保障生产可靠性**: 设计超时、重试、Fallback、成本监控、护栏（Guardrails）与可观测性。
- **评估与迭代**: 建立任务成功率、工具选择准确率、用户满意度等指标，并持续优化 Prompt、工具与策略。

在生产环境中，Agent Engineer 往往需要与产品经理、业务专家、SRE、安全团队紧密协作，因为 Agent 的错误成本远高于单次 LLM 调用：一次错误的工具调用可能触发真实世界的副作用（如误下单、误发邮件、误修改数据库）。

### 1.2 核心技能栈

Agent Engineer 的技能栈横跨模型理解、系统工程与产品设计三个层面：

| 维度 | 关键技能 | 常见工具/框架 |
|------|---------|--------------|
| LLM 基础 | 模型能力边界、Prompt 工程、上下文管理、输出约束（JSON/XML） | OpenAI API、Anthropic API、vLLM、Ollama |
| 推理模式 | ReAct、Plan-and-Execute、Reflexion、Tree-of-Thoughts | LangChain、LlamaIndex、AutoGen、CrewAI、Semantic Kernel |
| 工具调用 | Function Calling / Tool Calling、Schema 定义、API 封装、Sandbox | OpenAI Function Calling、MCP、E2B、Daytona、Firecracker |
| 记忆系统 | 短期记忆（Buffer/Window）、长期记忆（Vector DB、Graph DB）、Episodic/Semantic 记忆 | Redis、Milvus、Pinecone、Neo4j、Mem0 |
| 多 Agent | 角色定义、通信协议、任务分解、冲突解决、编排器设计 | AutoGen、CrewAI、OpenAI Swarm、LangGraph |
| 生产工程 | K8s 部署、可观测性、成本监控、限流、熔断、安全护栏 | Prometheus、Grafana、OpenTelemetry、Langfuse、LangSmith |
| 评估测试 | 任务成功率、轨迹评估、LLM-as-Judge、A/B 测试 | RAGAS、TruLens、AgentBench、SWE-bench、WebArena |
| 安全合规 | Prompt Injection 防御、PII 过滤、权限控制、审计日志 | Llama Guard、Nemo Guardrails、Guardrails AI |

面试中，面试官通常会要求候选人在以上至少两到三个维度上有深度经验，并能够在系统设计中体现对生产 trade-off 的理解。

### 1.3 与相近岗位的区别

| 岗位 | 核心关注点 | 与 Agent Engineer 的差异 |
|------|-----------|------------------------|
| LLM Platform Engineer | 推理平台、模型服务化、成本优化 | 更偏基础设施，Agent Engineer 更偏应用逻辑与编排 |
| MLOps Engineer | 训练/推理流水线、CI/CD、模型监控 | 更关注模型生命周期，Agent Engineer 关注 Agent 行为生命周期 |
| AI Security Engineer | 对抗攻击、红队、模型安全 | 更偏安全研究，Agent Engineer 需要将安全护栏落地到系统 |
| NLP Engineer | 文本模型、RAG、信息抽取 | 更偏模型与算法，Agent Engineer 需要自主决策与工具调用能力 |
| Prompt Engineer | 提示策略、输出质量优化 | 更偏单点提示调优，Agent Engineer 需要设计状态机与多轮策略 |

理解这些差异有助于在面试中准确定位自己的优势领域，并在回答问题时突出“端到端 Agent 系统”的视角。

---

## 2. 核心考点

### 2.1 ReAct 与推理-行动循环

ReAct（Reasoning + Acting）是当前 Agent 系统最基础的推理模式之一。其本质是让 LLM 在每一轮中交替进行**思考（Thought）**、**行动（Action）**、**观察（Observation）**，直到任务完成或达到最大迭代次数。

典型 ReAct 循环：

```text
Question: 用户询问“北京明天天气如何？”
Thought 1: 用户需要天气信息，我需要调用天气 API 获取北京明天的天气。
Action 1: get_weather(city="北京", date="明天")
Observation 1: {"temperature": "25°C", "condition": "晴"}
Thought 2: 我已经获得天气信息，可以直接回答用户。
Final Answer: 北京明天晴天，气温约 25°C。
```

面试常见问题：

1. **ReAct 与 CoT（Chain-of-Thought）的区别是什么？**
   - CoT 只产生推理链，不与外部世界交互；ReAct 在推理中间插入行动，能获取实时信息并修正推理。

2. **ReAct 容易出现哪些问题？**
   - **循环陷阱（Loop）**: Agent 反复调用同一工具而无法收敛。
   - **幻觉工具**: LLM 编造不存在的工具或参数。
   - **错误传播**: 早期 Observation 错误会导致后续推理全部偏离。
   - **上下文爆炸**: 多轮 Thought/Action/Observation 会快速占满上下文窗口。

3. **如何优化 ReAct？**
   - 设置最大迭代次数与 Early Stop 条件。
   - 引入 Reflection 机制，让 Agent 在失败后复盘原因。
   - 使用更严格的输出格式（JSON Schema）与工具描述。
   - 对历史轨迹进行压缩或摘要，控制上下文长度。

### 2.2 Plan-and-Execute 架构

当任务复杂、需要多步骤协作时，ReAct 的“边想边做”模式可能效率低下。Plan-and-Execute 模式先让 LLM 制定一个**全局计划（Plan）**，再按步骤执行（Execute），并在必要时重新规划。

典型流程：

```text
User Query → Planner → Plan [Step1, Step2, Step3] → Executor → Step Result
                                              ↓
                                       Re-plan if needed
```

面试常见问题：

1. **什么时候用 ReAct，什么时候用 Plan-and-Execute？**
   - ReAct 适合工具少、决策路径短、需要快速反馈的任务（如客服问答）。
   - Plan-and-Execute 适合步骤多、依赖关系复杂、需要全局优化的任务（如旅行规划、代码生成）。

2. **如何处理计划执行中的失败？**
   - 为每个 Step 设置独立重试与 Fallback。
   - 执行失败后将错误信息反馈给 Planner，触发 Re-planning。
   - 引入 Human-in-the-loop，在关键步骤请求人工确认。

3. **Plan-and-Execute 的挑战是什么？**
   - 计划可能过于乐观，未考虑执行中的异常。
   - 长计划会占用大量上下文，需要分层计划（Hierarchical Planning）。
   - 并行步骤的依赖管理复杂，需要引入 DAG 调度器。

### 2.3 Multi-Agent 协作

多 Agent 系统通过将复杂任务分解为多个子任务，由不同角色的 Agent 协作完成。常见模式包括：

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| 分工协作 | 每个 Agent 负责一个子任务，按流水线执行 | 内容创作、数据分析 |
| 辩论/评审 | 多个 Agent 对同一问题提出不同观点并互相评审 | 代码审查、策略评估 |
| 层级管理 | Manager Agent 分配任务，Worker Agent 执行 | 软件开发、复杂项目管理 |
| 竞争/拍卖 | Agent 竞标任务，由协调器选择最优方案 | 资源调度、方案选择 |

面试常见问题：

1. **多 Agent 系统中通信协议如何设计？**
   - 同步调用：直接 Function Call，适合强依赖场景。
   - 消息队列：通过 Redis/RabbitMQ/Kafka 解耦，适合异步协作。
   - 共享内存/黑板系统：所有 Agent 可读写共享状态。
   - 结构化协议：如 A2A（Agent-to-Agent）协议、MCP（Model Context Protocol）。

2. **如何避免多 Agent 系统中的冲突与死锁？**
   - 明确定义每个 Agent 的职责边界与权限。
   - 引入 Orchestrator 进行全局状态协调。
   - 设置超时与终止条件，防止无限循环。
   - 使用版本化共享状态，避免读写冲突。

3. **Multi-Agent 与单 Agent + 多个工具的区别？**
   - 单 Agent + 多工具：所有决策由一个 LLM 完成，适合任务边界清晰、工具数量有限的场景。
   - Multi-Agent：每个 Agent 可拥有独立 Prompt、记忆与工具，适合任务复杂、需要专业化分工的场景。

### 2.4 Memory 设计与长期记忆

记忆是 Agent 从“无状态聊天”升级为“持续学习助手”的关键。生产中的记忆通常分为以下几类：

| 类型 | 说明 | 存储方式 |
|------|------|---------|
| 短期记忆 | 当前对话上下文 | 上下文窗口、Redis |
| 工作记忆 | 当前任务中的中间状态 | 进程内存、状态数据库 |
| 长期记忆 - Semantic | 用户的稳定偏好、事实知识 | Vector DB（Milvus/Pinecone） |
| 长期记忆 - Episodic | 历史对话片段、任务轨迹 | Vector DB + 时间戳 |
| 长期记忆 - Procedural | Agent 的策略、工具使用经验 | 规则库、 fine-tuned 模型 |

面试常见问题：

1. **如何设计一个可扩展的长期记忆系统？**
   - 写入时：对对话进行摘要、抽取实体与关系，生成 Embedding。
   - 检索时：结合用户当前 Query 做 Hybrid Search（向量 + 关键词），必要时 Rerank。
   - 更新时：处理记忆冲突与过期，避免陈旧记忆干扰。

2. **记忆检索的召回率与精确率如何平衡？**
   - 使用 Rerank（Cross-encoder、ColBERT）提升 Top-K 精确率。
   - 引入时间衰减因子，优先召回近期记忆。
   - 对关键记忆做显式标签（如“用户偏好”“订单历史”）。

3. **记忆系统的隐私与合规风险？**
   - PII 数据需要脱敏或加密存储。
   - 用户需要能够查看、导出、删除自己的记忆。
   - 不同地区的合规要求（GDPR、PIPL）需要数据本地化。

### 2.5 Tool Use 与 Function Calling

工具调用是 Agent 与外部世界交互的“手”。面试中需要理解：

1. **工具描述（Tool Description）**: LLM 如何选择工具取决于工具名称、描述与参数 Schema 的质量。
2. **参数解析**: 需要严格校验 LLM 输出的参数类型、必填字段与取值范围。
3. **执行隔离**: 尤其是代码执行类工具，必须在 Sandbox（E2B、Daytona、Firecracker）中运行。
4. **结果回传**: 工具执行结果需要格式化后重新输入 LLM，作为下一步推理的 Observation。

面试常见问题：

1. **如何提高工具选择的准确率？**
   - 精简工具数量，避免功能重叠。
   - 编写清晰、具体、带示例的工具描述。
   - 对工具做 Embedding 索引，先召回相关工具再让 LLM 选择。
   - 在复杂场景中使用二级决策：先分类意图，再选择工具。

2. **工具调用失败如何处理？**
   - 参数校验失败：返回错误信息，让 LLM 重试。
   - API 超时：设置超时时间，触发 Fallback 或降级策略。
   - API 返回错误码：映射为 LLM 可理解的 Observation。
   - 工具不可用：切换到备用工具或告知用户。

3. **代码执行工具的安全风险？**
   - 必须在隔离环境中运行，禁止访问主机文件系统、网络与敏感环境变量。
   - 设置 CPU/内存/执行时间限制。
   - 对输入代码做静态扫描，防止恶意代码注入。

### 2.6 Agent 安全与护栏

Agent 的安全问题是面试中的高频考点，尤其是生产落地场景：

- **Prompt Injection**: 攻击者通过用户输入诱导 Agent 执行非预期操作。防御手段包括输入过滤、输出护栏、权限最小化、Human-in-the-loop。
- **Jailbreak**: 绕过模型安全对齐。防御手段包括系统提示加固、多层护栏、意图检测。
- **工具滥用**: Agent 调用本不该调用的工具。防御手段包括工具级权限控制、调用审批流程、审计日志。
- **数据泄露**: Agent 在工具调用中泄露敏感信息。防御手段包括 PII 检测、输出脱敏、最小必要数据原则。

生产 checklist：

- [ ] 所有用户输入经过 Prompt Injection 检测。
- [ ] 工具调用前进行权限校验。
- [ ] 高风险操作（写操作、资金操作）需要人工确认。
- [ ] 所有 Agent 行为记录审计日志。
- [ ] 定期红队测试与护栏策略更新。

---

## 3. 系统设计题

### 3.1 设计一个客服 Agent

**题目**: 请设计一个面向电商平台的智能客服 Agent，能够处理订单查询、退换货、物流追踪、商品推荐与转人工等任务。要求支持 10K 并发，平均响应延迟 < 2s，并能在无法处理时平滑转人工。

**答题框架**:

1. **需求澄清**
   - 支持的渠道：Web、App、微信小程序、电话语音。
   - 业务复杂度：是否需要接入订单系统、库存系统、物流系统、CRM。
   - 安全要求：用户身份校验、数据权限、敏感操作审批。

2. **高层架构**

```text
用户消息 → Gateway → 意图识别 → Router → 子 Agent / 工具
                       ↓
                知识库 (RAG)
                       ↓
                记忆系统 (用户画像/会话历史)
                       ↓
                护栏 / 安全层
                       ↓
                人工客服 (Fallback)
```

3. **核心组件**
   - **意图识别**: 轻量级分类模型或 LLM，决定进入哪个子 Agent 或直接回答。
   - **子 Agent**: 订单 Agent、售后 Agent、推荐 Agent、FAQ Agent。
   - **RAG 知识库**: 商品信息、退换货政策、常见问题。
   - **记忆系统**: 当前会话状态、用户历史订单与偏好。
   - **工具层**: 订单查询 API、物流查询 API、售后创建 API、推荐引擎。
   - **护栏层**: 输入过滤、输出审核、敏感操作人工确认。
   - **人工接管**: 置信度低、用户要求、多次失败时触发。

4. **关键决策与 trade-off**
   - 单 Agent vs 多 Agent：推荐多 Agent，因为客服场景任务边界清晰，便于独立迭代。
   - 有状态 vs 无状态：客服必须有状态，会话状态存储在 Redis + 数据库。
   - 同步 vs 异步：复杂售后流程可异步处理，通过消息通知用户。
   - LLM 选型：意图识别可用小模型（如 Llama-3-8B）降低成本，生成回答可用大模型（GPT-4o / Claude 3.5）。

5. **可观测性**
   - 监控指标：响应延迟、任务完成率、转人工率、用户满意度、成本/千次对话。
   - 追踪：每轮 Thought/Action/Observation 的全链路 Trace。

### 3.2 设计一个多 Agent 协作平台

**题目**: 请设计一个多 Agent 协作平台，支持企业内部多种 Agent（如代码助手、数据分析助手、文档助手、销售助手）的注册、发现、协作与权限管理。

**答题框架**:

1. **核心抽象**
   - **Agent Registry**: 统一管理 Agent 元数据（名称、能力、输入输出 Schema、权限、版本）。
   - **Orchestrator**: 负责解析用户请求、拆解任务、调度 Agent、管理状态。
   - **Message Bus**: Agent 之间异步通信的基础设施。
   - **Shared Memory**: 跨 Agent 共享的上下文与状态。
   - **Policy Engine**: 权限、审计、配额、熔断策略。

2. **架构图**

```text
用户请求 → Orchestrator → Task Decomposer → Agent Scheduler
                              ↓
                        Agent A → Agent B → Agent C
                              ↓
                        Shared Memory / Message Bus
                              ↓
                        Policy Engine / Audit Log
                              ↓
                        统一响应
```

3. **关键设计点**
   - **Agent 发现**: 用户可通过自然语言描述需求，平台通过 Embedding 匹配最合适的 Agent。
   - **任务分解**: 使用 Planner LLM 将复杂任务拆分为 DAG，支持并行与串行。
   - **通信协议**: 支持 A2A、MCP 或自定义 JSON-RPC 协议。
   - **权限隔离**: 每个 Agent 有独立的 OAuth Scope，调用其他 Agent 需要显式授权。
   - **版本管理**: Agent 的 Prompt、Skill、Config 版本化，支持灰度发布与回滚。

4. **生产挑战**
   - **循环依赖**: Orchestrator 需要检测 Agent 调用图，防止死锁。
   - **超时与降级**: 单个 Agent 失败不应导致整个任务失败。
   - **成本归因**: 记录每个 Agent 的 LLM Token 消耗与运行时间。
   - **安全审计**: 所有跨 Agent 调用记录可追溯。

---

## 4. 代码题

### 4.1 Function Calling 解析与执行

**题目**: 实现一个函数调用解析器，能够从 LLM 输出中提取函数名与参数，并调用对应的本地函数。要求支持参数校验与错误处理。

```python
import json
from typing import Callable, Dict, Any
from pydantic import BaseModel, ValidationError

class CalculatorArgs(BaseModel):
    a: float
    b: float

def add(args: CalculatorArgs) -> float:
    return args.a + args.b

class ToolRegistry:
    def __init__(self):
        self.tools: Dict[str, Callable] = {}
        self.schemas: Dict[str, type[BaseModel]] = {}

    def register(self, name: str, schema: type[BaseModel], func: Callable):
        self.tools[name] = func
        self.schemas[name] = schema

    def execute(self, raw_output: str) -> dict:
        """
        raw_output 格式示例:
        {"name": "add", "arguments": {"a": 1, "b": 2}}
        """
        try:
            call = json.loads(raw_output)
            name = call.get("name")
            arguments = call.get("arguments", {})
            if name not in self.tools:
                return {"error": f"Tool {name} not found"}
            validated = self.schemas[name](**arguments)
            result = self.tools[name](validated)
            return {"tool": name, "result": result}
        except json.JSONDecodeError as e:
            return {"error": f"Invalid JSON: {e}"}
        except ValidationError as e:
            return {"error": f"Parameter validation failed: {e}"}
        except Exception as e:
            return {"error": f"Execution failed: {e}"}

# 使用示例
registry = ToolRegistry()
registry.register("add", CalculatorArgs, add)
print(registry.execute('{"name": "add", "arguments": {"a": 1, "b": 2}}'))
```

面试追问：
- 如果 LLM 输出不是标准 JSON，如何处理？（可用正则、JSON Repair、更严格的输出格式要求）
- 如何防止工具被越权调用？（权限检查、白名单、调用前审计）

### 4.2 RAG 检索增强生成

**题目**: 实现一个简单的 RAG Agent，能够根据用户问题从向量数据库中检索相关文档片段，并将结果组织为上下文输入 LLM 生成回答。

```python
from typing import List
import numpy as np

class SimpleVectorStore:
    def __init__(self, embedding_fn):
        self.embedding_fn = embedding_fn
        self.docs: List[str] = []
        self.vectors: List[np.ndarray] = []

    def add(self, text: str):
        self.docs.append(text)
        self.vectors.append(self.embedding_fn(text))

    def search(self, query: str, top_k: int = 3) -> List[str]:
        q_vec = self.embedding_fn(query)
        scores = [np.dot(q_vec, v) for v in self.vectors]
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [self.docs[i] for i in top_indices]

class RAGAgent:
    def __init__(self, vector_store, llm_client):
        self.store = vector_store
        self.llm = llm_client

    def answer(self, question: str) -> str:
        contexts = self.store.search(question, top_k=3)
        context_text = "\n---\n".join(contexts)
        prompt = f"""基于以下参考资料回答问题。如果资料不足，请说明无法回答。

参考资料：
{context_text}

问题：{question}
"""
        return self.llm.generate(prompt)
```

面试追问：
- 如何评估 RAG 检索质量？（Recall@K、MRR、NDCG、上下文相关性）
- 如果检索到的片段互相矛盾，怎么办？（引入 Rerank、冲突检测、多来源摘要）

### 4.3 Agent 主循环实现

**题目**: 实现一个基于 ReAct 的 Agent 主循环，支持最大迭代次数、工具调用与终止条件。

```python
from typing import List, Dict, Callable

class ReActAgent:
    def __init__(self, llm_client, tools: Dict[str, Callable], max_steps: int = 5):
        self.llm = llm_client
        self.tools = tools
        self.max_steps = max_steps

    def run(self, query: str) -> str:
        trajectory = [f"Question: {query}"]
        for step in range(self.max_steps):
            prompt = self._build_prompt(trajectory)
            response = self.llm.generate(prompt)
            trajectory.append(f"Thought {step + 1}: {response}")

            if "Final Answer:" in response:
                return response.split("Final Answer:")[-1].strip()

            action = self._parse_action(response)
            if action:
                tool_name, args = action
                if tool_name in self.tools:
                    try:
                        obs = self.tools[tool_name](**args)
                        trajectory.append(f"Observation {step + 1}: {obs}")
                    except Exception as e:
                        trajectory.append(f"Observation {step + 1}: Error - {e}")
                else:
                    trajectory.append(f"Observation {step + 1}: Tool {tool_name} not found")
        return "无法在规定时间内完成回答。"

    def _build_prompt(self, trajectory: List[str]) -> str:
        base = "You are a helpful assistant. Solve the question by thinking step by step.\n"
        base += "Available tools: " + ", ".join(self.tools.keys()) + "\n"
        base += "\n".join(trajectory)
        base += "\nNext Thought/Action:"
        return base

    def _parse_action(self, response: str):
        # 简化示例：假设格式为 "Action: tool_name(arg1=value1, arg2=value2)"
        import re
        match = re.search(r"Action:\s*(\w+)\((.*)\)", response)
        if not match:
            return None
        tool_name = match.group(1)
        args_str = match.group(2)
        args = {}
        for pair in args_str.split(","):
            if "=" in pair:
                k, v = pair.split("=", 1)
                args[k.strip()] = v.strip().strip('"').strip("'")
        return tool_name, args
```

面试追问：
- 如何防止 Agent 进入无限循环？（最大步数、重复 Action 检测、循环中断策略）
- 如何支持更复杂的工具参数类型（列表、嵌套对象）？（使用 JSON Schema + Pydantic 校验）

---

## 5. 行为面试与领导力面试题

### 5.1 行为面试题

1. **请介绍一个你参与的 Agent 项目，你的角色是什么，解决了什么问题？**
   - 建议用 STAR 法则：Situation（背景）、Task（任务）、Action（行动）、Result（结果）。
   - 强调量化指标：任务成功率提升、延迟下降、成本节省、用户满意度变化。

2. **你在 Agent 项目中遇到的最大失败是什么？如何解决的？**
   - 可谈 Prompt 漂移、工具调用错误率上升、生产事故等。
   - 重点展示复盘能力、监控体系建设与持续迭代。

3. **如何与产品经理/业务方沟通 Agent 的能力边界？**
   - 明确告知哪些任务适合 Agent、哪些必须人工介入。
   - 通过 Demo、Bad Case 集合、SLA 指标管理预期。

4. **当 Agent 的准确率不达标时，你会如何排查？**
   - 分解为 Prompt、工具、检索、记忆、模型五个维度。
   - 使用 Trace 回放、错误分类、A/B 实验定位根因。

5. **你如何保证 Agent 系统的可维护性？**
   - Prompt 版本化、工具 Schema 版本化、配置即代码。
   - 自动化测试：单元测试、集成测试、端到端回归测试。

### 5.2 领导力面试题

1. **如果你要搭建一个 Agent 工程团队，你会如何组建？**
   - 核心角色：Agent Architect、Backend Engineer、ML Engineer、Safety Engineer、Product Manager。
   - 强调跨职能协作与文化：快速实验、重视安全、数据驱动。

2. **如何权衡 Agent 的智能化程度与风险？**
   - 建立风险分级：低风险任务可自动执行，高风险任务需人工确认。
   - 通过护栏、审计、A/B 测试逐步放开权限。

3. **你如何推动 Agent 项目从 POC 走向生产？**
   - 定义清晰的 MVP 与成功指标。
   - 建立生产 checklists：安全、可观测性、成本、合规。
   - 分阶段灰度发布，收集真实反馈。

4. **面对业务方对 Agent 的高期望，你如何管理？**
   - 设定 realistic baseline，展示渐进式能力提升路线图。
   - 用数据和案例说话，避免过度承诺。

---

## 6. 面试 Checklist

面试前建议逐项确认：

- [ ] 熟悉至少一种 Agent 框架（LangChain / LlamaIndex / AutoGen / CrewAI / LangGraph）。
- [ ] 能手写 ReAct 主循环与 Function Calling 解析器。
- [ ] 能清晰解释 ReAct vs Plan-and-Execute vs Multi-Agent 的适用场景。
- [ ] 能设计一个完整的客服 Agent 或多 Agent 协作平台。
- [ ] 理解 Memory 的分层设计与 Vector DB 检索流程。
- [ ] 掌握 Agent 安全护栏的核心风险与防御手段。
- [ ] 准备 2-3 个与 Agent 相关的项目案例，能用 STAR 法则表达。
- [ ] 了解当前主流模型（GPT-4o、Claude 3.5/4、Gemini、Llama 3/4、Qwen3）的 Function Calling 能力差异。
- [ ] 了解 Agent 评估指标与工具（RAGAS、AgentBench、SWE-bench、LLM-as-Judge）。
- [ ] 能够讨论成本、延迟、准确率之间的 trade-off。

---

## 7. 学习路径推荐

### 7.1 基础阶段（1-2 个月）

1. **LLM 基础**: 理解 Transformer、Prompt Engineering、Function Calling、输出约束。
2. **Agent 框架入门**: 用 LangChain 或 LlamaIndex 实现一个简单的 ReAct Agent。
3. **工具调用**: 学习 OpenAI Function Calling、MCP 协议，封装 3-5 个常用工具。
4. **RAG 基础**: 实现一个基于 Vector DB 的问答 Agent。

### 7.2 进阶阶段（2-3 个月）

1. **Multi-Agent**: 使用 AutoGen 或 CrewAI 实现多 Agent 协作任务。
2. **Memory 系统**: 设计并实现短期记忆 + 长期记忆的混合记忆方案。
3. **生产工程**: 学习 K8s 部署、可观测性（OpenTelemetry、Langfuse）、成本监控。
4. **安全护栏**: 实践 Prompt Injection 防御、输出审核、工具权限控制。

### 7.3 专家阶段（持续）

1. **Agent 评估**: 建立任务成功率、轨迹评估、LLM-as-Judge 评估体系。
2. **领域专精**: 选择一个垂直领域（客服、代码、数据分析、金融）深入。
3. **开源贡献**: 参与 LangChain、LlamaIndex、AutoGen、CrewAI 等框架的贡献。
4. **前沿跟踪**: 关注 A2A、MCP、Agentic AI、推理模型（o1-class、DeepSeek-R1、Qwen3）的发展。

---

## Related

- [[21_面试岗位/README|AI 面试准备 (Interviews)]]
- [[21_面试岗位/jobs|AI 相关岗位与工种清单]]
- [[21_面试岗位/System_Design_for_AI|System Design for AI Interviews]]
- [[15_智能体/README|Agent 生产 (Agent Production)]]
- [[15_智能体/Agent_Production_Deployment_Runbook|Agent 生产部署 Runbook]]
- [[15_智能体/Agent_Overview|Agent 技术概览]]
- [[09_测试/03_Agent_Evaluation/Agent_Evaluation_Deep_Dive|Agent 评估深度解析]]
- [[10_部署推理/01_Deployment_Fundamentals/LLM_Production_Deployment_Runbook|LLM 生产部署 Runbook]]
- [[06_强化学习/06_Multi_Agent/Multi_Agent_Systems|多智能体系统]]
- [[11_模型运维/LLM_Guardrails_and_Safety_Ops_2026|LLM 护栏与安全运维]]
