"""
Agent Plugin Base Class and Registry
=====================================
Defines the abstract interface for all agent adapters.
New agents only need to implement the AgentPlugin interface.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Optional
import time
import random


@dataclass
class AgentResponse:
    """Standardized response from any agent."""
    content: str
    latency_ms: float
    token_input: int
    token_output: int
    cost_usd: float = 0.0
    tool_calls: list[dict] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)
    success: bool = True
    error: Optional[str] = None


class AgentPlugin(ABC):
    """Abstract base class for all agent adapters."""

    def __init__(self, agent_id: str, name: str, vendor: str,
                 category: str, config: dict | None = None):
        self.agent_id = agent_id
        self.name = name
        self.vendor = vendor
        self.category = category
        self.config = config or {}

    @abstractmethod
    async def call(self, prompt: str, context: dict | None = None) -> AgentResponse:
        """Send a prompt to the agent and return standardized response."""
        ...

    @abstractmethod
    async def health_check(self) -> bool:
        """Check if the agent is reachable."""
        ...

    def get_info(self) -> dict:
        return {
            "id": self.agent_id,
            "name": self.name,
            "vendor": self.vendor,
            "category": self.category,
        }


class MockPlugin(AgentPlugin):
    """
    Mock plugin for simulation mode.
    Generates realistic-looking responses without calling any real API.
    """

    # Predefined quality profiles per agent for deterministic demo results
    QUALITY_PROFILES: dict[str, dict[str, float]] = {
        "tongyi-agent":     {"quality": 0.82, "speed": 0.78, "safety": 0.88},
        "deepseek-agent":   {"quality": 0.85, "speed": 0.90, "safety": 0.83},
        "wenxin-agent":     {"quality": 0.76, "speed": 0.72, "safety": 0.80},
        "doubao-agent":     {"quality": 0.74, "speed": 0.85, "safety": 0.79},
        "yuanqi-agent":     {"quality": 0.72, "speed": 0.75, "safety": 0.77},
        "pangu-agent":      {"quality": 0.70, "speed": 0.68, "safety": 0.82},
        "spark-agent":      {"quality": 0.68, "speed": 0.70, "safety": 0.75},
        "bedrock-agent":    {"quality": 0.84, "speed": 0.82, "safety": 0.90},
        "azure-agent":      {"quality": 0.83, "speed": 0.80, "safety": 0.89},
        "vertex-agent":     {"quality": 0.80, "speed": 0.78, "safety": 0.87},
        "claude-agent":     {"quality": 0.92, "speed": 0.75, "safety": 0.95},
        "chatgpt-agent":    {"quality": 0.90, "speed": 0.80, "safety": 0.92},
        "gemini-agent":     {"quality": 0.86, "speed": 0.83, "safety": 0.88},
        "databricks-agent": {"quality": 0.71, "speed": 0.76, "safety": 0.84},
        "snowflake-agent":  {"quality": 0.67, "speed": 0.74, "safety": 0.82},
        # K8s 专项评测 Agent (通义千问/Kimi/Minimax)
        "qwen-k8s":         {"quality": 0.84, "speed": 0.80, "safety": 0.88, "k8s_corpus": 0.86, "k8s_qa": 0.83},
        "kimi-k8s":         {"quality": 0.81, "speed": 0.82, "safety": 0.85, "k8s_corpus": 0.78, "k8s_qa": 0.80},
        "minimax-k8s":      {"quality": 0.75, "speed": 0.85, "safety": 0.82, "k8s_corpus": 0.70, "k8s_qa": 0.73},
    }

    async def call(self, prompt: str, context: dict | None = None) -> AgentResponse:
        profile = self.QUALITY_PROFILES.get(
            self.agent_id, {"quality": 0.70, "speed": 0.70, "safety": 0.75}
        )
        # Simulate latency based on speed profile
        base_latency = 800 + (1 - profile["speed"]) * 2000
        latency = base_latency + random.gauss(0, 100)
        latency = max(200, latency)

        # Simulate token counts
        token_input = len(prompt.split()) * 2 + random.randint(10, 50)
        token_output = random.randint(100, 500)
        cost = (token_input * 0.00001 + token_output * 0.00003)

        # Generate mock answer based on quality profile
        quality = profile["quality"]
        if quality > 0.85:
            content = f"[高质量模拟回答] 针对您的问题，以下是详细的解答和操作步骤..."
        elif quality > 0.7:
            content = f"[中等质量模拟回答] 关于这个问题，主要的解决方案是..."
        else:
            content = f"[基础模拟回答] 这个问题的答案是..."

        return AgentResponse(
            content=content,
            latency_ms=round(latency, 1),
            token_input=token_input,
            token_output=token_output,
            cost_usd=round(cost, 6),
            metadata={"simulated": True, "profile": profile},
        )

    async def health_check(self) -> bool:
        return True


class PluginRegistry:
    """Registry for agent plugins. Supports dynamic plugin registration."""

    _plugins: dict[str, type[AgentPlugin]] = {}

    @classmethod
    def register(cls, name: str, plugin_class: type[AgentPlugin]) -> None:
        cls._plugins[name] = plugin_class

    @classmethod
    def get(cls, name: str) -> type[AgentPlugin] | None:
        return cls._plugins.get(name)

    @classmethod
    def create(cls, plugin_name: str, **kwargs) -> AgentPlugin:
        """Create a plugin instance. Falls back to MockPlugin for unknown plugins."""
        plugin_class = cls._plugins.get(plugin_name, MockPlugin)
        return plugin_class(**kwargs)

    @classmethod
    def list_plugins(cls) -> list[str]:
        return list(cls._plugins.keys())


# Register built-in plugins
PluginRegistry.register("mock_plugin", MockPlugin)
