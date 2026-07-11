"""
Alibaba Cloud (Aliyun) Agent Plugin
====================================
Adapter for Tongyi Qianwen / DashScope API.
Falls back to MockPlugin in simulation mode.
"""

from .base import AgentPlugin, AgentResponse, PluginRegistry
import time


class AliyunPlugin(AgentPlugin):
    """Plugin for Alibaba Cloud Tongyi Qianwen Agent via DashScope API."""

    async def call(self, prompt: str, context: dict | None = None) -> AgentResponse:
        api_key = self.config.get("api_key") or ""
        if not api_key:
            # Simulation mode: generate mock response with Aliyun-specific traits
            return await self._simulate(prompt)

        # ---- Live mode (requires dashscope SDK) ----
        try:
            import dashscope
            from dashscope import Generation

            dashscope.api_key = api_key
            start = time.perf_counter()
            response = Generation.call(
                model=self.config.get("model", "qwen-max"),
                prompt=prompt,
                result_format="message",
            )
            latency = (time.perf_counter() - start) * 1000

            if response.status_code == 200:
                content = response.output.choices[0].message.content
                usage = response.usage
                return AgentResponse(
                    content=content,
                    latency_ms=round(latency, 1),
                    token_input=usage.get("input_tokens", 0),
                    token_output=usage.get("output_tokens", 0),
                    cost_usd=self._calculate_cost(usage),
                )
            else:
                return AgentResponse(
                    content="",
                    latency_ms=round(latency, 1),
                    token_input=0,
                    token_output=0,
                    success=False,
                    error=f"DashScope error: {response.code} - {response.message}",
                )
        except ImportError:
            return await self._simulate(prompt)

    async def _simulate(self, prompt: str) -> AgentResponse:
        """Aliyun-specific simulation with higher Chinese language scores."""
        import random
        latency = 650 + random.gauss(0, 80)
        token_in = len(prompt) * 2 + random.randint(20, 60)
        token_out = random.randint(150, 400)
        return AgentResponse(
            content="[通义千问模拟] 根据阿里云官方文档，该问题的解决方案如下...",
            latency_ms=round(max(200, latency), 1),
            token_input=token_in,
            token_output=token_out,
            cost_usd=round(token_in * 0.000008 + token_out * 0.000024, 6),
            metadata={"simulated": True, "provider": "aliyun"},
        )

    def _calculate_cost(self, usage: dict) -> float:
        # Qwen-max pricing (approximate)
        input_cost = usage.get("input_tokens", 0) * 0.00004 / 1000
        output_cost = usage.get("output_tokens", 0) * 0.00012 / 1000
        return round(input_cost + output_cost, 6)

    async def health_check(self) -> bool:
        if not self.config.get("api_key"):
            return True  # Simulation mode always healthy
        try:
            import dashscope
            dashscope.api_key = self.config["api_key"]
            resp = dashscope.Generation.call(model="qwen-turbo", prompt="ping")
            return resp.status_code == 200
        except Exception:
            return False


PluginRegistry.register("aliyun_plugin", AliyunPlugin)
