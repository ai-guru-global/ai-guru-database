"""
OpenAI-Compatible Agent Plugin
================================
Adapter for OpenAI API and compatible services (ChatGPT, Claude via proxy, etc.).
Falls back to MockPlugin in simulation mode.
"""

from .base import AgentPlugin, AgentResponse, PluginRegistry
import time


class OpenAIPlugin(AgentPlugin):
    """Plugin for OpenAI API compatible agents."""

    async def call(self, prompt: str, context: dict | None = None) -> AgentResponse:
        api_key = self.config.get("api_key") or ""
        if not api_key:
            return await self._simulate(prompt)

        try:
            from openai import AsyncOpenAI

            client = AsyncOpenAI(
                api_key=api_key,
                base_url=self.config.get("api_base"),
            )
            start = time.perf_counter()

            messages = []
            if context and context.get("system_prompt"):
                messages.append({"role": "system", "content": context["system_prompt"]})
            messages.append({"role": "user", "content": prompt})

            response = await client.chat.completions.create(
                model=self.config.get("model", "gpt-4o"),
                messages=messages,
                temperature=self.config.get("temperature", 0.7),
                max_tokens=self.config.get("max_tokens", 2048),
            )
            latency = (time.perf_counter() - start) * 1000

            choice = response.choices[0]
            usage = response.usage

            return AgentResponse(
                content=choice.message.content or "",
                latency_ms=round(latency, 1),
                token_input=usage.prompt_tokens if usage else 0,
                token_output=usage.completion_tokens if usage else 0,
                cost_usd=self._calculate_cost(usage),
                tool_calls=[
                    {"name": tc.function.name, "arguments": tc.function.arguments}
                    for tc in (choice.message.tool_calls or [])
                ] if choice.message.tool_calls else [],
            )

        except ImportError:
            return await self._simulate(prompt)
        except Exception as e:
            return AgentResponse(
                content="",
                latency_ms=0,
                token_input=0,
                token_output=0,
                success=False,
                error=str(e),
            )

    async def _simulate(self, prompt: str) -> AgentResponse:
        import random
        latency = 700 + random.gauss(0, 90)
        token_in = len(prompt.split()) * 3 + random.randint(15, 45)
        token_out = random.randint(120, 450)
        model = self.config.get("model", "gpt-4o")
        return AgentResponse(
            content=f"[{model} 模拟] Here is a comprehensive answer to your question...",
            latency_ms=round(max(200, latency), 1),
            token_input=token_in,
            token_output=token_out,
            cost_usd=round(token_in * 0.00001 + token_out * 0.00003, 6),
            metadata={"simulated": True, "model": model},
        )

    def _calculate_cost(self, usage) -> float:
        if not usage:
            return 0.0
        model = self.config.get("model", "gpt-4o")
        # Approximate pricing per 1K tokens
        pricing = {
            "gpt-4o":        {"input": 0.005,  "output": 0.015},
            "gpt-4-turbo":   {"input": 0.01,   "output": 0.03},
            "claude-3-opus": {"input": 0.015,  "output": 0.075},
        }
        rates = pricing.get(model, {"input": 0.005, "output": 0.015})
        cost = (usage.prompt_tokens * rates["input"] +
                usage.completion_tokens * rates["output"]) / 1000
        return round(cost, 6)

    async def health_check(self) -> bool:
        if not self.config.get("api_key"):
            return True
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(
                api_key=self.config["api_key"],
                base_url=self.config.get("api_base"),
            )
            resp = await client.chat.completions.create(
                model=self.config.get("model", "gpt-4o"),
                messages=[{"role": "user", "content": "ping"}],
                max_tokens=5,
            )
            return True
        except Exception:
            return False


PluginRegistry.register("openai_plugin", OpenAIPlugin)
