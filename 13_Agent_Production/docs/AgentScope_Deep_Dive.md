# AgentScope: 阿里巴巴多智能体开发平台

> **一句话理解**: AgentScope 是阿里巴巴开源的多智能体(Multi-Agent)开发平台，以"演员-舞台"为核心隐喻，提供丰富的环境交互能力和一键部署支持，让分布式多Agent应用的构建像编排剧本一样简单。

---

## 目录

1. [AgentScope 概述](#1-agentscope-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [多智能体协作](#4-多智能体协作)
5. [工具与资源](#5-工具与资源)
6. [部署与运维](#6-部署与运维)
7. [应用场景](#7-应用场景)
8. [最佳实践](#8-最佳实践)

---

## 1. AgentScope 概述

### 1.1 什么是 AgentScope

AgentScope 是一个**多智能体开发平台**，由阿里巴巴通义实验室开源：

```
传统单 Agent 开发:
┌─────────────────────────────────────┐
│          Single Agent               │
│  ┌───────────────────────────────┐  │
│  │  LLM + Prompt + Tools        │  │
│  └───────────────────────────────┘  │
│                │                     │
│         ┌──────┴──────┐              │
│         ▼             ▼              │
│      Input    →    Output           │
└─────────────────────────────────────┘

AgentScope 多 Agent 开发:
┌─────────────────────────────────────────────────────┐
│                    AgentScope Platform               │
│                                                      │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│    │ Actor 1 │  │ Actor 2 │  │ Actor 3 │          │
│    │(Planner)│  │(Worker) │  │(Review) │          │
│    └────┬────┘  └────┬────┘  └────┬────┘          │
│         │            │            │                 │
│         └────────────┼────────────┘                 │
│                      │                               │
│              ┌───────▼───────┐                      │
│              │    Stage       │                      │
│              │ (Environment)  │                      │
│              └───────────────┘                      │
│                      │                               │
│              ┌───────▼───────┐                      │
│              │  Grader       │                      │
│              │ (Evaluation)  │                      │
│              └───────────────┘                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 1.2 核心特性

| 特性 | 描述 |
|------|------|
| **Actor-Staged 分层** | 清晰分离 Agent 逻辑与执行环境 |
| **一键部署** | 支持本地、云端、边缘一键部署 |
| **丰富工具生态** | 内置 100+ 工具/API 集成 |
| **多模态支持** | 支持文本、图像、音频、视频 |
| **大规模并发** | 支持 100+ Agent 并发协作 |
| **可观测性** | 内置完整的日志、追踪、监控 |

### 1.3 与其他框架对比

| 维度 | LangChain | AutoGen | CrewAI | AgentScope |
|------|-----------|---------|--------|------------|
| **多 Agent 优先** | 一般 | 优秀 | 优秀 | 卓越 |
| **部署便捷性** | 中等 | 中等 | 简单 | 简单 |
| **环境交互** | 基础 | 基础 | 基础 | 丰富 |
| **大规模支持** | 一般 | 一般 | 一般 | 优秀 |
| **中文支持** | 一般 | 一般 | 一般 | 优秀 |

---

## 2. 核心概念

### 2.1 Actor-Staged 架构

```
AgentScope 核心概念
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                         Actor (演员)                             │
│  ─────────────────────────────────────────────────────────────  │
│  • 负责决策和生成                                                │
│  • 每个 Actor 有自己的 LLM、Prompt、Memory                       │
│  • Actor 之间通过消息传递通信                                    │
│                                                                  │
│  示例: PlannerActor, WorkerActor, CriticActor                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 消息传递
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Stage (舞台)                              │
│  ─────────────────────────────────────────────────────────────  │
│  • 执行环境和管理资源                                            │
│  • 维护共享状态和资源池                                          │
│  • 管理 Agent 生命周期                                           │
│                                                                  │
│  示例: SearchStage, CodeStage, DataProcessingStage             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Grader (评判)                             │
│  ─────────────────────────────────────────────────────────────  │
│  • 评估 Actor 输出质量                                            │
│  • 决定是否继续或终止流程                                         │
│  • 提供反馈给 Actor                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

```python
# AgentScope 核心组件

# 1. Actor: 执行决策的 Agent
@agent
class PlannerAgent:
    """规划 Agent"""
    
    def __init__(self, llm_config):
        self.llm = LLMConfig(**llm_config)
        self.memory = Memory(type="buffer", k=10)
    
    @param(scope="city")  # city scope: 城市级别共享
    async def plan(self, task: str) -> Plan:
        """制定执行计划"""
        ...

# 2. Stage: 执行环境
@stage(name="coding", assets=["python", "git"])
class CodeStage:
    """代码执行舞台"""
    
    def setup(self):
        self.executor = DockerExecutor()
        self.workspace = "/workspace"
    
    async def execute(self, code: str) -> ExecutionResult:
        """执行代码"""
        ...

# 3. Grader: 评估器
@grader
class CodeQualityGrader:
    """代码质量评估"""
    
    async def grade(self, code: str, task: str) -> Score:
        """评估代码质量"""
        ...
```

---

## 3. 架构设计

### 3.1 系统架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AgentScope 系统架构                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     Application Layer                            │    │
│  │  • Agent 应用        • 编排配置        • 监控面板               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     Orchestration Layer                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │    │
│  │  │  Pipeline    │  │  Parallel    │  │  Dynamic    │          │    │
│  │  │  Orchestrator│  │  Dispatcher  │  │  Scheduler  │          │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      Actor Layer                                 │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │    │
│  │  │ Planner │  │ Worker  │  │ Critic │  │ Memory  │           │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      Stage Layer                                 │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │    │
│  │  │  Code   │  │ Search  │  │  Data   │  │  API    │           │    │
│  │  │ Stage   │  │ Stage   │  │ Stage   │  │ Stage   │           │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Infrastructure Layer                         │    │
│  │  • Container    • Kubernetes    • Database    • Cache         │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 状态管理

```
状态层级设计
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  Scope: Global (全局)                                            │
│  ─────────────────────────────────────────────────────────────  │
│  • 整个系统的全局状态                                              │
│  • 例如: 全局配置、系统资源余量                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Scope: Team (团队)                                              │
│  ─────────────────────────────────────────────────────────────  │
│  • 一组相关 Agent 的共享状态                                      │
│  • 例如: 项目进度、团队任务分配                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Scope: City (城市)                                              │
│  ─────────────────────────────────────────────────────────────  │
│  • 同一地理位置/部门的 Agent 共享                                  │
│  • 例如: 北京团队、上海团队                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Scope: Agent (个体)                                             │
│  ─────────────────────────────────────────────────────────────  │
│  • 单个 Agent 的私有状态                                          │
│  • 例如: Agent 的个人记忆、偏好                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 多智能体协作

### 4.1 协作模式

| 模式 | 描述 | 适用场景 |
|------|------|----------|
| **Pipeline** | 串行流水线，下游依赖上游 | 顺序执行任务 |
| **Parallel** | 并行分发，结果聚合 | 独立子任务 |
| **Hierarchical** | 层级指挥，层层汇报 | 复杂组织结构 |
| **Debate** | Agent 之间辩论竞争 | 需要多视角分析 |
| **Market** | Agent 像市场一样交易任务 | 动态资源分配 |

### 4.2 Pipeline 模式

```python
# Pipeline 模式示例
@pipeline
class CodingPipeline:
    """代码开发流水线"""
    
    @stage(name="design", actors=[PlannerActor])
    async def design(self, requirement: str) -> Design:
        """需求分析阶段"""
        ...
    
    @stage(name="coding", actors=[CoderActor])
    async def code(self, design: Design) -> Code:
        """编码实现阶段"""
        ...
    
    @stage(name="review", actors=[ReviewerActor])
    async def review(self, code: Code) -> ReviewResult:
        """代码审查阶段"""
        ...
    
    @stage(name="test", actors=[TesterActor])
    async def test(self, code: Code) -> TestResult:
        """测试验证阶段"""
        ...
```

### 4.3 Parallel 模式

```python
# Parallel 模式示例
@parallel
class DataProcessingPipeline:
    """并行数据处理"""
    
    @stage(name="process_1", actors=[ProcessorActor])
    async def process_users(self, data: Data) -> UsersResult:
        """处理用户数据"""
        ...
    
    @stage(name="process_2", actors=[ProcessorActor])
    async def process_orders(self, data: Data) -> OrdersResult:
        """处理订单数据"""
        ...
    
    @stage(name="process_3", actors=[ProcessorActor])
    async def process_inventory(self, data: Data) -> InventoryResult:
        """处理库存数据"""
        ...
    
    @grader
    async def aggregate(self, results: List[Result]) -> AggregatedResult:
        """聚合结果"""
        return AggregatedResult.merge(results)
```

---

## 5. 工具与资源

### 5.1 内置工具

```
AgentScope 内置工具生态
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  代码与开发                                                      │
├─────────────────────────────────────────────────────────────────┤
│  • code_executor: 代码执行 (Python, JS, Bash)                   │
│  • git_manager: Git 操作                                        │
│  • file_manager: 文件系统操作                                    │
│  • search_code: 代码库搜索                                       │
│  • linter: 代码检查                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  数据处理                                                        │
├─────────────────────────────────────────────────────────────────┤
│  • data_processor: 数据清洗/转换                                 │
│  • db_query: 数据库查询                                         │
│  • api_caller: HTTP API 调用                                     │
│  • scraper: 网页爬取                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  搜索与知识                                                      │
├─────────────────────────────────────────────────────────────────┤
│  • web_search: 网络搜索                                          │
│  • knowledge_base: 知识库查询                                    │
│  • rag_retriever: RAG 检索                                       │
│  • embedding_search: 向量检索                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  通信与协作                                                      │
├─────────────────────────────────────────────────────────────────┤
│  • email_sender: 邮件发送                                       │
│  • im_notifier: 即时通讯通知                                     │
│  • calendar_manager: 日历管理                                    │
│  • doc_collaborator: 文档协作                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 自定义工具

```python
@tool(name="custom_api", assets=["api"])
class CustomAPITool:
    """自定义 API 工具"""
    
    def __init__(self, api_config: dict):
        self.base_url = api_config["base_url"]
        self.timeout = api_config.get("timeout", 30)
    
    @tool_config(
        retry=3,
        rate_limit=100,  # 每分钟 100 次
        cache_ttl=300    # 缓存 5 分钟
    )
    async def call(self, endpoint: str, params: dict) -> dict:
        """调用自定义 API"""
        ...
```

---

## 6. 部署与运维

### 6.1 部署模式

| 模式 | 描述 | 适用场景 |
|------|------|----------|
| **Local** | 本地 Docker 部署 | 开发调试 |
| **Kubernetes** | K8s 集群部署 | 生产环境 |
| **Edge** | 边缘设备部署 | 延迟敏感 |
| **Serverless** | 函数即服务 | 弹性伸缩 |

### 6.2 一键部署

```bash
# 方式 1: Docker Compose 快速部署
agentscope deploy --mode local --file docker-compose.yml

# 方式 2: Kubernetes 部署
agentscope deploy --mode k8s --namespace production

# 方式 3: 边缘部署
agentscope deploy --mode edge --device rasp-pi

# 查看部署状态
agentscope status

# 日志查看
agentscope logs -f --tail 100
```

### 6.3 监控与可观测性

```yaml
# agentscope.yaml - 监控配置
monitoring:
  enabled: true
  
  metrics:
    # Agent 指标
    - agent_requests_total
    - agent_request_duration_seconds
    - agent_errors_total
    
    # 资源指标
    - stage_utilization
    - memory_usage_bytes
    - cpu_usage_percent
    
    # 业务指标
    - task_completion_rate
    - task_duration_seconds
    
  tracing:
    enabled: true
    sampler: "always"  # 采样策略
    exporter: "jaeger"
    
  logging:
    level: "INFO"
    format: "json"
    output: ["stdout", "file"]
```

---

## 7. 应用场景

### 7.1 典型场景

| 场景 | Agent 组合 | 工作流 |
|------|-----------|--------|
| **代码开发** | Planner + Coder + Reviewer + Tester | Pipeline |
| **数据分析** | Loader + Cleaner + Analyst + Visualizer | Pipeline |
| **客服系统** | Router + Agent + Escalator | Parallel |
| **内容创作** | Ideator + Writer + Editor + Publisher | Pipeline |
| **研究助理** | Researcher + Analyzer + Summarizer | Parallel |
| **运维自动化** | Monitor + Diagnoser + Fixer + Reporter | Hierarchical |

### 7.2 代码开发示例

```python
# 完整的代码开发 Pipeline
@agentscope_app(name="CodeFactory")
class CodeFactory:
    """AI 代码工厂"""
    
    def __init__(self):
        self.planner = PlannerActor(
            llm="qwen-max",
            prompt_template="You are a senior architect..."
        )
        self.coder = CoderActor(
            llm="qwen-plus",
            workspace="/workspace"
        )
        self.reviewer = ReviewerActor(
            llm="qwen-max",
            rules=["security", "style", "performance"]
        )
        self.tester = TesterActor(
            llm="qwen-plus",
            coverage_target=0.8
        )
    
    @pipeline
    async def develop(self, requirement: str) -> Deliverable:
        """开发流程"""
        
        # 1. 需求分析
        design = await self.planner.plan(requirement)
        
        # 2. 编码实现
        code = await self.coder.implement(design)
        
        # 3. 代码审查
        review = await self.reviewer.review(code)
        if not review.passed:
            # 修复问题
            code = await self.coder.fix(code, review.issues)
        
        # 4. 测试验证
        test_result = await self.tester.test(code)
        
        return Deliverable(code=code, review=review, tests=test_result)
```

---

## 8. 最佳实践

### 8.1 架构设计原则

```
AgentScope 架构最佳实践
═══════════════════════════════════════════════════════════════

1. 单一职责
   ✅ 每个 Actor 只做一件事
   ❌ 不要让一个 Actor 处理所有事情

2. 合适的 Agent 数量
   ✅ 2-5 个核心 Agent 协作
   ❌ 避免 20+ Agent 直接互联 (复杂度过高)

3. 清晰的消息协议
   ✅ 定义清晰的消息格式和协议
   ❌ 不要让 Agent 自由格式对话

4. 适当的评估机制
   ✅ 每个关键节点设置 Grader
   ❌ 不要完全信任 Agent 输出

5. 容错设计
   ✅ 设计失败处理和重试机制
   ❌ 不要假设每个步骤都成功
```

### 8.2 性能优化

```python
# 性能优化技巧

# 1. 合理使用并行
@parallel(workers=4)  # 限制并行数
async def process_items(items):
    ...

# 2. 结果缓存
@tool(cacheable=True, ttl=3600)
async def expensive_operation():
    ...

# 3. 异步优化
async def parallel_api_calls():
    # 批量请求，减少等待
    results = await asyncio.gather(*[call(i) for i in items])
    ...

# 4. 资源隔离
@stage(resources={"cpu": "2", "memory": "4Gi"})
class HeavyComputationStage:
    ...
```

---

## 相关资源

- [AgentScope GitHub](https://github.com/alibaba/agentscope)
- [AgentScope 文档](https://agentscope.readthedocs.io)
- [CoPaw (基于 AgentScope)](./CoPaw_Deep_Dive.md)
- [Multi-Agent 评估框架](../../12_Agent_Evaluation/Multi_Agent_Evaluation_2026.md)
