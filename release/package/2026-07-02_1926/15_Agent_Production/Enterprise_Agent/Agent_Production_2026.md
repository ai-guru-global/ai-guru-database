---
title: AI Agent 生产部署最佳实践 2026
category: 15-agent-production-enterprise-agent
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **一句话理解**: 将AI Agent从Demo部署到生产环境，需要的不仅是代码——而是一套涵盖架构设计、基础设施、监控治理的完整工程体系。本指南总结了2026年企业级Agent部署的最新模式和反模式。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Agent Production 2026"
  - Agent_Production_2026
sources: []

---
# AI Agent 生产部署最佳实践 2026

> **一句话理解**: 将 AI Agent 从 Demo 部署到生产环境，需要的不仅是代码——而是一套涵盖架构设计、基础设施、监控治理的完整工程体系。本指南总结了 2026 年企业级 Agent 部署的最新模式和反模式。

---

## 1. 概述 (Overview)

### Agent生产化的核心挑战

```
从原型到生产的鸿沟:

原型阶段:                      生产阶段:
├── 单次调用                   ├── 多轮对话状态管理
├── 本地运行                   ├── 分布式部署
├── 预定义输入                 ├── 开放域用户输入
├── 快速失败                   ├── 优雅降级
├── 无状态                     ├── 持久化记忆
└── 单人使用                   └── 并发用户支持

成功率数据:
├── 只有20%的Agent原型能进入生产
├── 生产Agent的平均故障恢复时间(MTTR): 4小时
└── 架构设计缺陷导致的故障占比: 60%
```

### 2026年Agent架构演进

```
2024年架构:                    2026年架构:

单体Agent                      分层微服务架构
    │                         ┌──────────────┐
    ▼                         │   Gateway    │
┌─────────┐                   └──────┬───────┘
│  LLM    │                          │
│ +Tools  │          ┌───────────────┼───────────────┐
│ +Memory │          ▼               ▼               ▼
└─────────┘    ┌─────────┐    ┌─────────┐    ┌─────────┐
               │ Reason  │    │ Memory  │    │ Tool    │
               │ Service │    │ Service │    │ Service │
               └─────────┘    └─────────┘    └─────────┘
```

---

## 2. 架构模式

### 2.1 三大核心架构模式

```
模式1: 无状态请求-响应 (Stateless)

适用: 文档分析、数据提取、分类任务

请求 → [Load Balancer] ─┬─→ [Agent Instance 1]
                        ├─→ [Agent Instance 2]  (水平扩展)
                        └─→ [Agent Instance 3]

特点:
✓ 简单，易于扩展
✓ 故障隔离
✗ 无记忆能力
✗ 每次需携带完整上下文

代码示例:
@app.post("/analyze")
async def analyze_document(request: AnalysisRequest):
    # 无状态: 所有信息在request中
    result = await agent.analyze(
        document=request.document,
        instructions=request.instructions
    )
    return result
```

```
模式2: 有状态会话 (Stateful Session)

适用: 客服机器人、代码助手、顾问型Agent

用户 ─→ [Load Balancer with Session Affinity]
                │
                ▼
        [Agent Instance A] ←┐
                │            │
           [Session State] ──┘
                │
           [Redis/DB]

特点:
✓ 支持多轮对话
✓ 用户体验连贯
✗ 需要状态管理
✗ 扩容复杂 (session亲和性)

实现要点:
- Session ID路由
- 分布式状态存储
- 心跳保活
- 超时清理
```

```
模式3: 事件驱动异步 (Event-Driven)

适用: 复杂工作流、长时间任务、多Agent协作

用户请求 ─→ [API Gateway] ─→ [Message Queue]
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
               [Worker 1]     [Worker 2]      [Worker 3]
                    │               │               │
                    └───────────────┴───────────────┘
                                    │
                              [Result Store]
                                    │
                              [Notification]
                                    │
                              [Webhook/SSE]

特点:
✓ 支持长时间任务
✓ 系统解耦
✓ 削峰填谷
✗ 复杂度高
✗ 最终一致性

使用场景:
- 研究报告生成 (5-10分钟)
- 代码库分析 (30+分钟)
- 多Agent协作任务
```

### 2.2 混合架构模式

```
生产环境典型架构:

                       ┌─────────────────┐
                       │   API Gateway   │
                       │  (Auth/Rate Lim)│
                       └────────┬────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        ┌──────────┐     ┌──────────┐      ┌──────────┐
        │ Stateless│     │ Stateful │      │ Async    │
        │  Agent   │     │  Agent   │      │ Worker   │
        │  Pool    │     │  Pool    │      │  Pool    │
        └────┬─────┘     └────┬─────┘      └────┬─────┘
             │                │                 │
             ▼                ▼                 ▼
        ┌──────────┐     ┌──────────┐      ┌──────────┐
        │  Fast    │     │ Session  │      │  Task    │
        │  Queries │     │  Store   │      │  Queue   │
        └──────────┘     └──────────┘      └──────────┘

路由策略:
- /query/*     → Stateless (FAQ、简单查询)
- /chat/*      → Stateful  (对话、顾问)
- /workflow/*  → Async     (复杂任务)
```

---

## 3. 基础设施

### 3.1 部署拓扑

```
Kubernetes部署架构:

┌─────────────────────────────────────────────────────────────┐
│                      Kubernetes Cluster                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Namespace: agent-production                                 │
│  ├── Deployment: agent-gateway (3 replicas)                 │
│  │   └── Service: ClusterIP (port 8080)                    │
│  │                                                          │
│  ├── Deployment: agent-reasoning (5 replicas, HPA)          │
│  │   └── Service: ClusterIP (port 8081)                    │
│  │                                                          │
│  ├── Deployment: agent-memory (3 replicas)                  │
│  │   └── Service: ClusterIP (port 8082)                    │
│  │                                                          │
│  ├── StatefulSet: agent-tool-executor (2 replicas)          │
│  │   └── Service: Headless                                 │
│  │                                                          │
│  └── CronJob: session-cleanup (每小时)                      │
│                                                              │
│  Ingress: agent-api.company.com                             │
│  └── TLS termination, rate limiting                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘

关键配置:
- HPA: CPU>70%或延迟>500ms时扩容
- Pod Disruption Budget: 保证至少2个副本可用
- Resource Limits: 防止单个Pod耗尽资源
- Network Policies: 服务间最小权限通信
```

### 3.2 服务网格与可观测性

```
服务网格架构 (Istio/Linkerd):

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Agent     │◄───►│    Proxy    │◄───►│   Tool      │
│   Service   │     │   (Sidecar) │     │   Service   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         [Metrics]   [Tracing]    [Policy]
         (Prometheus) (Jaeger)   (AuthZ)

可观测性三支柱:
├── Metrics: 延迟分布、错误率、吞吐量、资源使用
├── Logs: 结构化日志，包含trace_id、session_id
└── Traces: 分布式追踪，端到端请求链路

关键SLI/SLO:
├── P99延迟: <2s (简单查询), <10s (复杂任务)
├── 可用性: 99.9%
├── 错误率: <0.1%
└── 资源利用率: CPU 40-70%, Memory <80%
```

### 3.3 模型路由与成本优化

```python
"""智能模型路由实现"""

class ModelRouter:
    """基于任务复杂度智能路由到不同模型"""
    
    def __init__(self):
        self.models = {
            "fast": {
                "name": "gpt-4o-mini",
                "cost_per_1k": 0.00015,
                "max_tokens": 4096,
                "strengths": ["classification", "extraction", "simple_qa"]
            },
            "balanced": {
                "name": "gpt-4o",
                "cost_per_1k": 0.005,
                "max_tokens": 8192,
                "strengths": ["reasoning", "code", "complex_qa"]
            },
            "powerful": {
                "name": "gpt-5.2",
                "cost_per_1k": 0.03,
                "max_tokens": 128000,
                "strengths": ["analysis", "creative", "multi_step"]
            }
        }
    
    async def route(self, request: AgentRequest) -> ModelConfig:
        """
        智能路由决策
        """
        # 1. 意图分类 (使用轻量级模型)
        intent = await self.classify_intent(request.query)
        complexity = await self.assess_complexity(request)
        
        # 2. 路由决策
        if intent in ["greeting", "simple_faq"]:
            return self.models["fast"]
        
        if complexity.score < 0.3 and intent in ["classification", "extraction"]:
            return self.models["fast"]
        
        if complexity.score > 0.8 or "analysis" in intent:
            return self.models["powerful"]
        
        return self.models["balanced"]
    
    async def assess_complexity(self, request) -> ComplexityScore:
        """
        评估请求复杂度
        """
        factors = {
            "query_length": len(request.query) / 1000,  # 归一化
            "context_size": len(request.context) / 10000,
            "required_tools": len(request.available_tools) * 0.1,
            "multi_step_indicator": 0.3 if any(word in request.query 
                for word in ["分析", "比较", "评估", "计划"]) else 0
        }
        
        score = sum(factors.values()) / len(factors)
        return ComplexityScore(score=score, factors=factors)


# 成本监控
class CostMonitor:
    """实时监控Agent运行成本"""
    
    def __init__(self):
        self.daily_budget = 1000  # $1000/天
        self.alerts = []
    
    def record_usage(self, model: str, tokens: int, cost: float):
        """记录使用情况"""
        metric = {
            "timestamp": datetime.now(),
            "model": model,
            "tokens": tokens,
            "cost": cost
        }
        
        # 检查预算
        daily_cost = self.get_daily_cost()
        if daily_cost > self.daily_budget * 0.8:
            self.alerts.append("预算使用超过80%")
        
        # 异常检测
        if cost > 10:  # 单次调用>$10
            self.alerts.append(f"高成本调用: ${cost}")
        
        self.store_metric(metric)
```

---

## 4. 记忆与状态管理

### 4.1 分层记忆架构

```
记忆层级:

┌─────────────────────────────────────────────────────────────┐
│                     分层记忆系统                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  L1: 工作记忆 (Working Memory)                               │
│  ├── 当前对话上下文                                          │
│  ├── 最近5-10轮对话                                          │
│  └── 存储: 内存 (Redis/本地)                                 │
│                                                              │
│  L2: 短期记忆 (Short-term Memory)                            │
│  ├── 本次会话完整历史                                        │
│  ├── 提取的关键事实                                          │
│  └── 存储: Redis (TTL: 24h)                                  │
│                                                              │
│  L3: 长期记忆 (Long-term Memory)                             │
│  ├── 用户画像和偏好                                          │
│  ├── 跨会话积累的知识                                        │
│  └── 存储: Vector DB (Pinecone/Weaviate)                     │
│                                                              │
│  L4: 持久化知识 (Persistent Knowledge)                       │
│  ├── 结构化业务数据                                          │
│  ├── 文档和知识库                                            │
│  └── 存储: SQL/NoSQL DB                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 记忆实现代码

```python
"""分层记忆系统实现"""

from typing import Optional, List
import redis
from datetime import datetime, timedelta

class HierarchicalMemory:
    """分层记忆管理器"""
    
    def __init__(self):
        self.working_memory = {}  # 本地内存
        self.short_term = redis.Redis(host='redis', port=6379)  # Redis
        self.long_term = VectorStore()  # 向量数据库
    
    async def get_context(
        self,
        session_id: str,
        user_id: str,
        query: str
    ) -> str:
        """
        获取完整上下文
        """
        contexts = []
        
        # 1. 工作记忆 (当前会话)
        working = self.working_memory.get(session_id, [])
        contexts.append("当前对话:\n" + self._format_history(working[-5:]))
        
        # 2. 短期记忆 (今天其他会话)
        short_term_key = f"stm:{user_id}:{datetime.now().date()}"
        short_term = self.short_term.get(short_term_key)
        if short_term:
            contexts.append("今日摘要:\n" + short_term.decode())
        
        # 3. 长期记忆 (相关历史)
        relevant = await self.long_term.similarity_search(
            query=query,
            filter={"user_id": user_id},
            top_k=3
        )
        if relevant:
            contexts.append("相关历史:\n" + "\n".join(relevant))
        
        return "\n\n".join(contexts)
    
    async def update_memory(
        self,
        session_id: str,
        user_id: str,
        interaction: dict
    ):
        """
        更新各层记忆
        """
        # 更新工作记忆
        if session_id not in self.working_memory:
            self.working_memory[session_id] = []
        self.working_memory[session_id].append(interaction)
        
        # 每5轮更新短期记忆
        if len(self.working_memory[session_id]) % 5 == 0:
            await self._summarize_to_stm(session_id, user_id)
        
        # 会话结束更新长期记忆
        if interaction.get("session_end"):
            await self._consolidate_to_ltm(session_id, user_id)
    
    async def _summarize_to_stm(self, session_id: str, user_id: str):
        """将工作记忆总结到短期记忆"""
        history = self.working_memory[session_id]
        
        # 使用LLM生成摘要
        summary = await llm.generate(
            f"总结以下对话的关键信息:\n{self._format_history(history)}"
        )
        
        # 存储到Redis (24小时过期)
        key = f"stm:{user_id}:{datetime.now().date()}"
        self.short_term.setex(key, timedelta(hours=24), summary)
    
    async def _consolidate_to_ltm(self, session_id: str, user_id: str):
        """会话结束，固化到长期记忆"""
        history = self.working_memory[session_id]
        
        # 提取关键事实
        facts = await llm.extract_facts(history)
        
        # 向量化存储
        for fact in facts:
            embedding = await embed(fact)
            await self.long_term.upsert(
                id=f"{user_id}:{hash(fact)}",
                vector=embedding,
                metadata={
                    "user_id": user_id,
                    "fact": fact,
                    "timestamp": datetime.now().isoformat()
                }
            )
        
        # 清理工作记忆
        del self.working_memory[session_id]
```

---

## 5. 工具系统

### 5.1 工具注册与发现

```python
"""企业级工具系统"""

from typing import Callable, Dict, Any
from pydantic import BaseModel
import asyncio

class ToolRegistry:
    """工具注册中心"""
    
    def __init__(self):
        self.tools: Dict[str, Tool] = {}
        self.categories: Dict[str, list] = {}
    
    def register(
        self,
        name: str,
        description: str,
        parameters: dict,
        handler: Callable,
        category: str = "general",
        permissions: list = None,
        rate_limit: dict = None
    ):
        """注册新工具"""
        tool = Tool(
            name=name,
            description=description,
            parameters=parameters,
            handler=handler,
            category=category,
            permissions=permissions or [],
            rate_limit=rate_limit
        )
        
        self.tools[name] = tool
        
        if category not in self.categories:
            self.categories[category] = []
        self.categories[category].append(name)
    
    async def execute(
        self,
        tool_name: str,
        parameters: dict,
        context: ExecutionContext
    ) -> ToolResult:
        """
        执行工具调用
        """
        tool = self.tools.get(tool_name)
        if not tool:
            raise ToolNotFoundError(f"Tool {tool_name} not found")
        
        # 1. 权限检查
        if not self._check_permissions(tool, context.user):
            raise PermissionError(f"User {context.user} cannot use {tool_name}")
        
        # 2. 速率限制
        if not await self._check_rate_limit(tool, context.user):
            raise RateLimitError(f"Rate limit exceeded for {tool_name}")
        
        # 3. 参数验证
        validated_params = self._validate_parameters(tool, parameters)
        
        # 4. 执行 (带超时和重试)
        try:
            result = await asyncio.wait_for(
                self._execute_with_retry(tool, validated_params),
                timeout=tool.timeout
            )
            
            # 5. 审计日志
            await self._log_execution(context, tool_name, result)
            
            return ToolResult(success=True, data=result)
            
        except Exception as e:
            await self._log_error(context, tool_name, e)
            return ToolResult(success=False, error=str(e))


# 预置工具示例
class PrebuiltTools:
    """企业常用工具集"""
    
    @staticmethod
    def register_all(registry: ToolRegistry):
        """注册所有预置工具"""
        
        # 数据库查询工具
        registry.register(
            name="query_database",
            description="执行只读SQL查询",
            parameters={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "SQL SELECT语句"},
                    "database": {"type": "string", "enum": ["analytics", "users"]}
                },
                "required": ["query", "database"]
            },
            handler=DatabaseTool.execute,
            category="data",
            permissions=["db:read"],
            rate_limit={"requests": 100, "window": 60}  # 100 req/min
        )
        
        # API调用工具
        registry.register(
            name="call_external_api",
            description="调用外部API",
            parameters={
                "type": "object",
                "properties": {
                    "endpoint": {"type": "string"},
                    "method": {"type": "string", "enum": ["GET", "POST"]},
                    "body": {"type": "object"}
                }
            },
            handler=APITool.execute,
            category="integration",
            permissions=["api:external"],
            rate_limit={"requests": 50, "window": 60}
        )
        
        # 文档检索工具
        registry.register(
            name="search_documents",
            description="搜索企业内部文档",
            parameters={
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "departments": {"type": "array", "items": {"type": "string"}}
                }
            },
            handler=DocumentTool.search,
            category="knowledge",
            permissions=["docs:read"]
        )
        
        # 代码执行工具 (沙箱化)
        registry.register(
            name="execute_python",
            description="在沙箱中执行Python代码",
            parameters={
                "type": "object",
                "properties": {
                    "code": {"type": "string"},
                    "timeout": {"type": "integer", "default": 30}
                }
            },
            handler=SandboxTool.execute_python,
            category="code",
            permissions=["code:execute"],
            rate_limit={"requests": 10, "window": 60}
        )
```

### 5.2 工具编排模式

```
工具编排模式:

模式1: 顺序执行 (Sequential)
[Tool A] → [Tool B] → [Tool C]
使用场景: 数据提取 → 处理 → 存储

模式2: 并行执行 (Parallel)
    ┌→ [Tool A] ─┐
    ├→ [Tool B] ─┼→ [Aggregator]
    └→ [Tool C] ─┘
使用场景: 同时查询多个数据源

模式3: 条件执行 (Conditional)
[Tool A] → [Decision] ─┬→ [Tool B]
                       └→ [Tool C]
使用场景: 根据中间结果选择路径

模式4: 循环执行 (Loop)
[Init] → [Tool] → [Condition] ─┬→ [Done]
         └←←←←←←←←←←←←←←←←←←┘
使用场景: 分页获取、迭代处理

模式5: 人机协作 (Human-in-the-loop)
[Tool A] → [Human Review] ─┬→ [Tool B]
                           └→ [Reject]
使用场景: 敏感操作、高风险决策
```

---

## 6. 监控与可观测性

### 6.1 全面监控体系

```python
"""Agent监控实现"""

from prometheus_client import Counter, Histogram, Gauge
import structlog

# Metrics定义
AGENT_REQUESTS = Counter('agent_requests_total', 'Total requests', ['intent', 'status'])
AGENT_LATENCY = Histogram('agent_latency_seconds', 'Request latency', ['operation'])
AGENT_ACTIVE_SESSIONS = Gauge('agent_active_sessions', 'Number of active sessions')
TOOL_CALLS = Counter('tool_calls_total', 'Tool invocations', ['tool_name', 'status'])
LLM_TOKENS = Counter('llm_tokens_total', 'LLM token usage', ['model', 'type'])

logger = structlog.get_logger()

class AgentMonitor:
    """Agent监控器"""
    
    def __init__(self):
        self.error_tracker = ErrorTracker()
    
    async def trace_request(self, request_id: str, func):
        """请求追踪装饰器"""
        start_time = time.time()
        
        try:
            result = await func()
            
            # 记录成功
            AGENT_REQUESTS.labels(
                intent=result.intent,
                status="success"
            ).inc()
            
            logger.info(
                "request_completed",
                request_id=request_id,
                duration=time.time() - start_time,
                intent=result.intent
            )
            
            return result
            
        except Exception as e:
            # 记录失败
            AGENT_REQUESTS.labels(
                intent="unknown",
                status="error"
            ).inc()
            
            self.error_tracker.record(e, request_id)
            
            logger.error(
                "request_failed",
                request_id=request_id,
                error=str(e),
                error_type=type(e).__name__
            )
            raise
    
    def monitor_tool(self, tool_name: str):
        """工具调用监控装饰器"""
        def decorator(func):
            async def wrapper(*args, **kwargs):
                start = time.time()
                try:
                    result = await func(*args, **kwargs)
                    TOOL_CALLS.labels(
                        tool_name=tool_name,
                        status="success"
                    ).inc()
                    return result
                except Exception as e:
                    TOOL_CALLS.labels(
                        tool_name=tool_name,
                        status="error"
                    ).inc()
                    raise
            return wrapper
        return decorator


# 健康检查
class HealthCheck:
    """健康检查端点"""
    
    async def check(self) -> dict:
        """全面健康检查"""
        checks = {
            "llm_api": await self._check_llm_api(),
            "vector_db": await self._check_vector_db(),
            "redis": await self._check_redis(),
            "tool_services": await self._check_tool_services()
        }
        
        healthy = all(c["status"] == "ok" for c in checks.values())
        
        return {
            "status": "healthy" if healthy else "unhealthy",
            "checks": checks,
            "timestamp": datetime.now().isoformat()
        }
```

### 6.2 告警与事件响应

```yaml
# 告警规则示例 (Prometheus AlertManager)
groups:
  - name: agent_alerts
    rules:
      # 高错误率告警
      - alert: HighErrorRate
        expr: rate(agent_requests_total{status="error"}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Agent error rate is high"
          description: "Error rate is {{ $value }}% in the last 5 minutes"
      
      # 高延迟告警
      - alert: HighLatency
        expr: histogram_quantile(0.99, rate(agent_latency_seconds_bucket[5m])) > 5
        for: 3m
        labels:
          severity: warning
        annotations:
          summary: "Agent P99 latency is high"
      
      # 成本告警
      - alert: DailyBudgetWarning
        expr: daily_cost_usd > 800
        labels:
          severity: warning
        annotations:
          summary: "Daily cost is approaching budget limit"
```

---

## 7. 持续交付与MLOps

### 7.1 CI/CD流水线

```yaml
# .github/workflows/agent-cd.yml
name: Agent CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run unit tests
        run: pytest tests/unit
      
      - name: Run integration tests
        run: pytest tests/integration
      
      - name: Security scan
        run: |
          bandit -r src/
          safety check
      
      - name: Evaluation tests
        run: python -m evaluation.run_evals
        env:
          EVAL_DATASET: regression_tests.json

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: |
          docker build -t agent:${{ github.sha }} .
          docker tag agent:${{ github.sha }} agent:latest
      
      - name: Push to registry
        run: |
          docker push agent:${{ github.sha }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: |
          kubectl set image deployment/agent agent=agent:${{ github.sha }} -n staging
          kubectl rollout status deployment/agent -n staging
      
      - name: Smoke tests
        run: |
          python scripts/smoke_tests.py --env staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Blue-green deployment
        run: |
          # 部署新版本 (green)
          kubectl apply -f k8s/agent-green.yaml
          kubectl wait --for=condition=ready pod -l version=green
          
          # 切换流量
          kubectl patch service agent -p '{"spec":{"selector":{"version":"green"}}}'
          
          # 监控5分钟
          sleep 300
          
          # 检查错误率
          ERROR_RATE=$(curl -s prometheus/api | jq '.data.result[0].value[1]')
          if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then
            # 回滚
            kubectl patch service agent -p '{"spec":{"selector":{"version":"blue"}}}'
            exit 1
          fi
```

### 7.2 提示词版本管理

```python
"""提示词版本控制系统"""

class PromptVersionManager:
    """提示词版本管理"""
    
    def __init__(self, storage: PromptStorage):
        self.storage = storage
    
    def register(
        self,
        name: str,
        prompt: str,
        version: str,
        metadata: dict = None
    ):
        """注册新版本的提示词"""
        entry = {
            "name": name,
            "version": version,
            "prompt": prompt,
            "metadata": metadata or {},
            "created_at": datetime.now().isoformat(),
            "hash": hashlib.sha256(prompt.encode()).hexdigest()[:16]
        }
        
        self.storage.save(entry)
    
    def get(self, name: str, version: str = None) -> str:
        """获取提示词，默认最新版本"""
        if version is None:
            entry = self.storage.get_latest(name)
        else:
            entry = self.storage.get(name, version)
        
        return entry["prompt"]
    
    def compare_versions(self, name: str, v1: str, v2: str) -> dict:
        """比较两个版本的差异"""
        p1 = self.get(name, v1)
        p2 = self.get(name, v2)
        
        return {
            "version1": v1,
            "version2": v2,
            "diff": unified_diff(p1.splitlines(), p2.splitlines()),
            "token_difference": len(p2.split()) - len(p1.split())
        }
    
    def rollback(self, name: str, to_version: str):
        """回滚到指定版本"""
        entry = self.storage.get(name, to_version)
        self.register(
            name=name,
            prompt=entry["prompt"],
            version=f"{to_version}-rollback-{int(time.time())}",
            metadata={"rolled_back_from": to_version}
        )
```

---

## 8. 参考资源

### 架构模式
- [Azure AI Agent Service Architecture](https://azure.microsoft.com/en-us/services/ai-agent/)
- [AWS Bedrock Agent Patterns](https://aws.amazon.com/bedrock/agents/)
- [Google Vertex AI Agent Builder](https://cloud.google.com/generative-ai-app-builder/docs/agent-intro)

### 开源工具
- [LangServe](https://github.com/langchain-ai/langserve) - Agent 服务化
- [BentoML](https://github.com/bentoml/BentoML) - 模型服务
- [Prometheus](https://prometheus.io/) + [Grafana](https://grafana.com/) - 监控
- [Jaeger](https://www.jaegertracing.io/) - 分布式追踪

### 最佳实践
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Microsoft Azure Architecture Center](https://docs.microsoft.com/en-us/azure/architecture/)
- [Vibe Coding 生产实践](../../编程/Methodology/Vibe_Coding_Production_Practices.md) - AI 辅助编码的生产环境最佳实践

---

*Last updated: 2026-04-01* (Production deployment patterns)

## Related

- [[Agent/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
