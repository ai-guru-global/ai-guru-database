---
title: "OpenRouter: 统一 AI 模型网关与智能路由平台"
category: "15-agent-production-agent-platforms"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **一句话理解**: OpenRouter 是一个统一的 AI 模型 API 网关，通过智能路由、成本优化、多模型聚合等能力，为 Agent 系统提供稳定、高效、低成本的模型访问层。"
created: "2026-05-31"
updated: "2026-05-31"
---

# OpenRouter: 统一 AI 模型网关与智能路由平台

> **一句话理解**: OpenRouter 是一个统一的 AI 模型 API 网关，通过智能路由、成本优化、多模型聚合等能力，为 Agent 系统提供稳定、高效、低成本的模型访问层。

---

## 目录

1. [OpenRouter 概述](#1-openrouter-概述)
2. [核心架构](#2-核心架构)
3. [智能路由机制](#3-智能路由机制)
4. [成本优化策略](#4-成本优化策略)
5. [Agent 集成方案](#5-agent-集成方案)
6. [使用配置](#6-使用配置)
7. [最佳实践](#7-最佳实践)

---

## 1. OpenRouter 概述

### 1.1 什么是 OpenRouter

OpenRouter 是一个**统一 AI 模型网关**，它：

```
OpenRouter 核心价值
═══════════════════════════════════════════════════════════════

传统方式 (每个模型独立集成):
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ GPT-4   │  │Claude   │  │ Gemini  │  │ Llama   │
│ API     │  │ API     │  │ API     │  │ API     │
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     │            │            │            │
     ▼            ▼            ▼            ▼
  ┌─────┐      ┌─────┐      ┌─────┐      ┌─────┐
  │代码  │      │代码  │      │代码  │      │代码  │
  │变更  │      │变更  │      │变更  │      │变更  │
  └─────┘      └─────┘      └─────┘      └─────┘
  
OpenRouter 方式 (统一网关):
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ GPT-4   │  │Claude   │  │ Gemini  │  │ Llama   │
│ API     │  │ API     │  │ API     │  │ API     │
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     │            │            │            │
     └────────────┴─────┬──────┴────────────┘
                        │
                   ┌────▼────┐
                   │OpenRouter│
                   │ Gateway  │
                   └────┬────┘
                        │
                        ▼
                  ┌───────────┐
                  │  统一API   │
                  │ Agent系统  │
                  └───────────┘
```

### 1.2 核心能力

| 能力 | 描述 | 价值 |
|------|------|------|
| **统一 API** | 一个接口访问 100+ 模型 | 简化集成 |
| **智能路由** | 根据任务自动选择最优模型 | 提效降本 |
| **成本优化** | 实时比价、自动切换 | 节省成本 |
| **负载均衡** | 多供应商自动分配 | 提高稳定性 |
| **模型聚合** | 多模型协作输出 | 质量提升 |
| **用量分析** | 详细的使用洞察 | 精细管理 |

### 1.3 支持的模型

```
支持的模型分类
═══════════════════════════════════════════════════════════════

OpenAI 系列:
├── GPT-4o, GPT-4o-mini, GPT-4-Turbo
├── GPT-3.5-Turbo
└── O1-preview, O1-mini

Anthropic 系列:
├── Claude 3.5 Opus, Claude 3.5 Sonnet
├── Claude 3.5 Haiku, Claude 3 Opus
└── Claude 3 Sonnet, Claude 3 Haiku

Google 系列:
├── Gemini 1.5 Pro, Gemini 1.5 Flash
├── Gemini 1.0 Pro, Gemini 1.0 Ultra
└── Gemini-2.0-Flash

Meta/Llama 系列:
├── Llama 3.1 405B, 70B, 8B
├── Llama 3 70B, 8B
└── Code Llama 系列

开源/本地模型:
├── Qwen 2.5, Qwen 1.5
├── Mistral Large, Mistral 7B
├── DeepSeek V3, DeepSeek Coder
└── 本地 Ollama 模型

专用模型:
├── 编程: Codex, Starcoder, Code Llama
├── 嵌入: text-embedding-3, Voyage
└── 语音: Whisper, TTS
```

---

## 2. 核心架构

### 2.1 系统架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OpenRouter 架构                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     Client Layer (客户端层)                        │    │
│  │  • REST API      • SDK (Python/JS/Go)    • Agent 客户端          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Routing Engine (路由引擎)                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │    │
│  │  │ 语义路由器    │  │ 成本路由器    │  │ 延迟路由器    │          │    │
│  │  │ (Task Match) │  │ (Cost-based) │  │ (Latency)   │          │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                  Provider Gateway (供应商网关)                   │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │    │
│  │  │OpenAI  │ │Anthropic│ │Google  │ │Meta    │ │Azure   │        │    │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Observability Layer                           │    │
│  │  • 用量统计      • 成本分析      • 延迟监控      • 错误追踪        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 关键组件

#### 路由引擎 (Routing Engine)

```python
class RoutingEngine:
    """智能路由引擎"""
    
    def __init__(self, config: RouterConfig):
        self.routes = config.routes
        self.models = config.models
        self.cost_tracker = CostTracker()
        self.latency_tracker = LatencyTracker()
    
    async def route(self, request: LLMRequest) -> RoutedRequest:
        """根据策略路由请求"""
        
        # 1. 任务分析
        task_type = self.classify_task(request)
        
        # 2. 获取候选模型
        candidates = self.get_candidates(task_type)
        
        # 3. 多策略综合评分
        scores = []
        for model in candidates:
            score = self.calculate_score(
                model=model,
                task=request,
                strategy=self.config.routing_strategy
            )
            scores.append((model, score))
        
        # 4. 选择最优模型
        best_model = max(scores, key=lambda x: x[1])[0]
        
        return RoutedRequest(
            model=best_model,
            request=request,
            score=scores
        )
    
    def calculate_score(
        self, 
        model: ModelSpec, 
        task: LLMRequest,
        strategy: RoutingStrategy
    ) -> float:
        """综合评分计算"""
        
        # 多维度加权评分
        capability_score = model.capability_matrix.get(task.type, 0)
        cost_score = 1.0 / (model.cost_per_token + 0.001)
        latency_score = 1.0 / (model.avg_latency + 0.1)
        availability_score = model.availability
        
        weights = {
            'capability': 0.4,
            'cost': 0.3,
            'latency': 0.2,
            'availability': 0.1
        }
        
        return (
            weights['capability'] * capability_score +
            weights['cost'] * cost_score +
            weights['latency'] * latency_score +
            weights['availability'] * availability_score
        )
```

---

## 3. 智能路由机制

### 3.1 路由策略

| 策略 | 描述 | 适用场景 |
|------|------|----------|
| **Capability-based** | 根据任务类型匹配模型能力 | 通用场景 |
| **Cost-optimized** | 优先使用最便宜的模型 | 成本敏感 |
| **Latency-optimized** | 优先选择最低延迟 | 实时交互 |
| **Balanced** | 能力-成本-延迟综合平衡 | 生产环境 |
| **Fallback** | 主模型失败时自动切换备选 | 高可用需求 |
| **Ensemble** | 多模型并行，结果聚合 | 高质量需求 |

### 3.2 任务类型路由

```
任务类型 → 模型映射矩阵
═══════════════════════════════════════════════════════════════

┌─────────────────┬─────────────────────────────────────────────────┐
│ 任务类型        │ 推荐模型 (按优先级)                              │
├─────────────────┼─────────────────────────────────────────────────┤
│ 代码生成        │ 1. GPT-4o  2. Claude 3.5 Sonnet  3. Gemini 1.5  │
│ 代码审查        │ 1. Claude 3.5 Opus  2. GPT-4o  3. GPT-4-Turbo   │
│ 数学推理        │ 1. O1-preview  2. GPT-4o  3. Gemini 1.5 Pro    │
│ 创意写作        │ 1. GPT-4o  2. Claude 3.5  3. Gemini 1.5 Pro   │
│ 上下文理解      │ 1. Claude 3.5 Sonnet  2. GPT-4o  3. Gemini    │
│ 快速问答        │ 1. GPT-4o-mini  2. Gemini Flash  3. Haiku     │
│ 长文本处理      │ 1. Claude 3.5  2. Gemini 1.5 Pro  3. GPT-4-Turbo│
│ Agent 规划      │ 1. Claude 3.5 Opus  2. GPT-4o  3. O1-preview  │
└─────────────────┴─────────────────────────────────────────────────┘
```

### 3.3 自适应路由

```python
class AdaptiveRouter:
    """自适应路由: 根据实时表现动态调整"""
    
    async def route_with_feedback(
        self, 
        request: LLMRequest
    ) -> RoutedRequest:
        """带反馈的路由"""
        
        # 1. 获取基准路由
        base_route = await self.base_router.route(request)
        
        # 2. 获取实时性能数据
        perf_data = await self.perf_monitor.get_recent(
            model=base_route.model,
            time_window="5m"
        )
        
        # 3. 动态调整分数
        adjusted_score = self.adjust_score(
            base_score=base_route.score,
            perf_data=perf_data
        )
        
        # 4. 如果性能不佳，考虑备选
        if perf_data.error_rate > 0.05:  # 5% 错误率阈值
            alt_route = await self.find_alternative(request)
            if alt_route.score > adjusted_score * 0.8:
                return alt_route
        
        return base_route
```

---

## 4. 成本优化策略

### 4.1 成本模型

```
Token 成本对比 (示例, 单位: 每1M tokens)
═══════════════════════════════════════════════════════════════

模型                │ 输入成本  │ 输出成本  │ 100次调用成本估算
───────────────────┼──────────┼──────────┼──────────────────
GPT-4o             │ $5.00    │ $15.00   │ $20-50
GPT-4o-mini        │ $0.15    │ $0.60    │ $0.75-2
Claude 3.5 Opus     │ $15.00   │ $75.00   │ $90-200
Claude 3.5 Sonnet   │ $3.00    │ $15.00   │ $18-40
Gemini 1.5 Pro      │ $1.25    │ $5.00    │ $6.25-15
Gemini 1.5 Flash     │ $0.075   │ $0.30    │ $0.375-1

成本节省潜力:
• 从 GPT-4o 切换到 GPT-4o-mini: ~90% 成本节省
• 从 Claude 3.5 Opus 切换到 Sonnet: ~80% 成本节省
• 合理路由平均节省: 40-60%
```

### 4.2 优化策略

```python
class CostOptimizer:
    """成本优化器"""
    
    # 简单任务自动降级映射
    TASK_DOWNGRADE_MAP = {
        "quick_qa": {
            "from": "gpt-4o",
            "to": "gpt-4o-mini",
            "threshold": "similarity > 0.9"
        },
        "format_conversion": {
            "from": "gpt-4o",
            "to": "gpt-4o-mini",
            "threshold": "length < 500"
        },
        "simple_editing": {
            "from": "claude-3-5-sonnet",
            "to": "gpt-4o-mini",
            "threshold": "change_rate < 10%"
        }
    }
    
    async def optimize(self, request: LLMRequest) -> LLMRequest:
        """成本优化"""
        
        # 1. 检测可优化任务
        if self.is_optimizable(request):
            # 2. 尝试用更便宜的模型
            cheaper_request = await self.try_cheaper_model(request)
            
            # 3. 验证质量
            if self.quality_check(cheaper_request):
                return cheaper_request
        
        return request
```

---

## 5. Agent 集成方案

### 5.1 Agent 架构集成

```
OpenRouter 在 Agent 系统中的位置
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Agent System                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐     │
│   │   Planner   │ ───► │   Router    │ ───► │  Executor   │     │
│   │   Agent    │      │  (OpenRouter)│      │    Tool    │     │
│   └─────────────┘      └──────┬──────┘      └─────────────┘     │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐     │
│   │   Memory    │      │   Models   │      │   Results   │     │
│   │   System    │      │  (100+)    │      │   Store     │     │
│   └─────────────┘      └─────────────┘      └─────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 集成示例

```python
from openrouter import OpenRouterClient
from openrouter.models import ChatMessage

# 初始化客户端
client = OpenRouterClient(
    api_key="your-api-key",
    organization="your-org"
)

# Agent 中使用
class AgentWithRouter:
    """使用 OpenRouter 的 Agent"""
    
    def __init__(self):
        self.router = OpenRouterClient()
        self.tools = ToolRegistry()
    
    async def run(self, task: str):
        """执行任务"""
        
        # 1. 规划步骤
        plan = await self.planner.plan(task)
        
        # 2. 通过 OpenRouter 执行每步
        results = []
        for step in plan.steps:
            # 智能路由选择
            response = await self.router.chat(
                messages=[ChatMessage(role="user", content=step)],
                # 自动路由到最合适的模型
                model="auto",  # 或指定模型
                route_strategy="balanced"
            )
            results.append(response)
        
        # 3. 聚合结果
        return self.aggregator.combine(results)
```

### 5.3 多模型协作

```python
# 多模型投票/聚合示例
class EnsembleAgent:
    """多模型协作 Agent"""
    
    MODELS = ["claude-3-5-sonnet", "gpt-4o", "gemini-1-5-pro"]
    
    async def ensemble_decide(self, task: str) -> Decision:
        """多模型投票决策"""
        
        # 并行请求多个模型
        responses = await asyncio.gather(*[
            self.router.chat(
                messages=[ChatMessage(role="user", content=task)],
                model=model
            )
            for model in self.MODELS
        ])
        
        # 多数投票
        votes = [r.content for r in responses]
        winning_vote = self.vote(votes)
        
        # 置信度评估
        confidence = self.calculate_confidence(votes)
        
        return Decision(
            content=winning_vote,
            confidence=confidence,
            votes=votes
        )
```

---

## 6. 使用配置

### 6.1 基础配置

```yaml
# openrouter.yaml
openrouter:
  # API 配置
  api_key: ${OPENROUTER_API_KEY}
  organization: ${OPENROUTER_ORG}
  
  # 默认路由策略
  default_strategy: balanced  # capability, cost, latency, balanced
  
  # 模型配置
  models:
    enabled:
      - gpt-4o
      - gpt-4o-mini
      - claude-3-5-sonnet
      - claude-3-5-haiku
      - gemini-1-5-pro
      - gemini-1-5-flash
    
    # 模型特定配置
    gpt-4o:
      max_tokens: 128000
      temperature: 0.7
      
  # 路由配置
  routing:
    # 任务类型映射
    task_model_map:
      code_generation: [gpt-4o, claude-3-5-sonnet]
      code_review: [claude-3-5-sonnet, gpt-4o]
      reasoning: [gpt-4o, claude-3-5-opus]
      quick_qa: [gpt-4o-mini, gemini-1-5-flash]
    
    # 成本上限
    cost_limits:
      daily: 100.00  # 美元
      per_request: 0.50
  
  # 备用配置
  fallback:
    enabled: true
    max_retries: 2
    retry_delays: [1, 5, 30]  # 秒
```

---

## 7. 最佳实践

### 7.1 路由策略选择

| 场景 | 推荐策略 | 配置 |
|------|----------|------|
| **生产环境** | Balanced | capability:0.4, cost:0.3, latency:0.3 |
| **成本敏感** | Cost-optimized | cost:0.6, capability:0.3, latency:0.1 |
| **延迟敏感** | Latency-optimized | latency:0.6, cost:0.2, capability:0.2 |
| **质量优先** | Capability-based | capability:0.7, cost:0.2, latency:0.1 |

### 7.2 监控与告警

```python
# 关键监控指标
METRICS = {
    # 路由指标
    "route_requests_total": "路由请求总数",
    "route_errors_total": "路由错误数",
    "model_selection_distribution": "模型选择分布",
    
    # 性能指标
    "request_latency_p99": "P99 延迟",
    "tokens_per_second": "Token 吞吐量",
    
    # 成本指标
    "daily_cost": "日成本",
    "cost_per_model": "各模型成本",
    "cost_per_task_type": "各任务类型成本",
    
    # 质量指标
    "fallback_rate": "回退率",
    "quality_score": "输出质量评分",
}
```

---

## 相关资源

- [OpenRouter 官网](https://openrouter.ai)
- [OpenRouter 文档](https://openrouter.ai/docs)
- [Agent Gateway 架构](../../14_AI_Gateway/)
- [多模型 Agent 协作](../Agent_Evaluation/Multi_Agent_Evaluation_2026.md)
