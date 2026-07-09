---
tier: supporting
title: 插件 API 参考文档
category: 15-agent-production-agent-evaluation-docs-api
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> Agent Plugin 接口定义和使用指南"
created: 2026-05-31
updated: 2026-05-31
sources: []
---

# 插件 API 参考文档

> Agent Plugin 接口定义和使用指南

## 1. 核心接口

### 1.1 AgentResponse

```python
@dataclass
class AgentResponse:
    content: str              # 回答内容
    latency_ms: float         # 响应延迟 (毫秒)
    token_input: int          # 输入 Token 数
    token_output: int         # 输出 Token 数
    cost_usd: float = 0.0    # 单次调用成本 (美元)
    tool_calls: list[dict]    # 工具调用记录
    metadata: dict[str, Any]  # 自定义元数据
    success: bool = True      # 是否成功
    error: Optional[str]      # 错误信息
```

### 1.2 AgentPlugin (抽象基类)

```python
class AgentPlugin(ABC):
    def __init__(self, agent_id, name, vendor, category, config=None):
        ...

    @abstractmethod
    async def call(self, prompt: str, context: dict | None = None) -> AgentResponse:
        """发送 prompt 到 Agent，返回标准化响应"""

    @abstractmethod
    async def health_check(self) -> bool:
        """检查 Agent 是否可达"""

    def get_info(self) -> dict:
        """返回 Agent 基本信息"""
```

### 1.3 PluginRegistry

```python
class PluginRegistry:
    @classmethod
    def register(cls, name: str, plugin_class: type[AgentPlugin]) -> None:
        """注册插件类"""

    @classmethod
    def create(cls, plugin_name: str, **kwargs) -> AgentPlugin:
        """创建插件实例（未知插件自动回退到 MockPlugin）"""

    @classmethod
    def list_plugins(cls) -> list[str]:
        """列出所有已注册插件"""
```

## 2. 创建自定义插件

### 2.1 最小实现

```python
from plugins.base import AgentPlugin, AgentResponse, PluginRegistry

class MyPlugin(AgentPlugin):
    async def call(self, prompt: str, context=None) -> AgentResponse:
        response = await my_api.chat(prompt)
        return AgentResponse(
            content=response.text,
            latency_ms=response.latency,
            token_input=response.input_tokens,
            token_output=response.output_tokens,
            cost_usd=response.cost,
        )

    async def health_check(self) -> bool:
        return await my_api.ping()

# 注册
PluginRegistry.register("my_plugin", MyPlugin)
```

### 2.2 配置使用

```yaml
agents:
  - id: "my-agent"
    name: "My Custom Agent"
    vendor: "My Company"
    category: "domestic_cloud"
    plugin: "my_plugin"
    config:
      api_key: "xxx"
      model: "my-model-v1"
```

## 3. 内置插件列表

| 插件名 | 类名 | 用途 |
|--------|------|------|
| `mock_plugin` | MockPlugin | 模拟模式，预设质量档案 |
| `aliyun_plugin` | AliyunPlugin | 阿里云 DashScope API |
| `openai_plugin` | OpenAIPlugin | OpenAI 兼容 API |

## 4. 评估器 API

### 4.1 CAPERScorer

```python
scorer = CAPERScorer(weights={"knowledge": 0.25, ...})

# 计算加权总分
composite = scorer.compute_composite(dimensions)

# 分配等级
grade = scorer.assign_grade(composite)  # "S"/"A"/"B"/"C"/"D"

# 生成完整排行榜
leaderboard = scorer.generate_leaderboard(scorecards)
```

### 4.2 EvaluationPipeline

```python
pipeline = EvaluationPipeline(config_path="config.yaml")
result = asyncio.run(pipeline.run())
# result = {"metadata": {...}, "overall_ranking": [...], ...}
```

## 5. 数据格式

### 5.1 测试数据集格式

```json
{
  "metadata": {"category": "knowledge_qa", "total": 50},
  "questions": [
    {
      "id": "k001",
      "question": "问题内容",
      "expected_answer": "期望答案",
      "category": "ECS",
      "difficulty": "medium",
      "keywords": ["关键词1", "关键词2"]
    }
  ]
}
```

### 5.2 评估结果格式

```json
{
  "metadata": {"total_agents": 15, "version": "2026 Q2", "weights": {...}},
  "overall_ranking": [
    {
      "rank": 1,
      "agent_id": "claude-agent",
      "agent_name": "Claude Agent",
      "composite_score": 90.51,
      "grade": "S",
      "dimensions": {"knowledge": 88.9, "task_completion": 95.4, ...}
    }
  ],
  "category_rankings": {...},
  "dimension_rankings": {...}
}
```

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
