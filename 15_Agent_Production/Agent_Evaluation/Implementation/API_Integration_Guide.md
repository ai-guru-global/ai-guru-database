---
title: API 集成指南
category: 15-agent-production-agent-evaluation-implementation
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 各云产品智能体 API 调用方式与集成规范"
created: 2026-05-31
updated: 2026-05-31
---

# API 集成指南

> 各云产品智能体 API 调用方式与集成规范

## 概述

本文档提供 15+ 款云产品智能体的 API 调用方式，用于自动化测评集成。

---

## 通用调用封装

```python
import abc
from dataclasses import dataclass
from typing import Optional

@dataclass
class AgentResponse:
    content: str
    latency_ms: float
    input_tokens: int
    output_tokens: int
    model: str
    finish_reason: str
    
    @property
    def total_tokens(self) -> int:
        return self.input_tokens + self.output_tokens
    
    @property
    def cost_estimate(self) -> float:
        return 0.0

class CloudAgentClient(abc.ABC):
    @abc.abstractmethod
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        pass
    
    @abc.abstractmethod
    async def chat_with_context(self, question: str, context: str = "", system: str = "") -> AgentResponse:
        pass
```

---

## 国内云厂商

### 1. 通义千问 Agent（阿里云）

```python
import dashscope
from dashscope import Generation

class QwenAgentClient(CloudAgentClient):
    def __init__(self, api_key: str, model: str = "qwen-plus"):
        dashscope.api_key = api_key
        self.model = model
    
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        import time
        start = time.time()
        response = Generation.call(
            model=self.model,
            messages=messages,
            result_format='message',
            **kwargs
        )
        latency = (time.time() - start) * 1000
        
        return AgentResponse(
            content=response.output.choices[0].message.content,
            latency_ms=latency,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
            model=self.model,
            finish_reason=response.output.choices[0].finish_reason
        )
    
    async def chat_with_context(self, question: str, context: str = "", system: str = "") -> AgentResponse:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        if context:
            messages.append({"role": "system", "content": f"参考资料：\n{context}"})
        messages.append({"role": "user", "content": question})
        return await self.chat(messages)

# 使用示例
# client = QwenAgentClient(api_key="sk-xxx")
# response = await client.chat_with_context("ECS 突发性能实例适合什么场景？")
```

### 2. 腾讯元器 Agent（腾讯云）

```python
import httpx

class TencentYuanqiClient(CloudAgentClient):
    def __init__(self, bot_id: str, api_key: str):
        self.bot_id = bot_id
        self.api_key = api_key
        self.base_url = "https://hunyuan.tencentcloudapi.com"
    
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        import time
        start = time.time()
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": "hunyuan-lite", "messages": messages}
            )
        latency = (time.time() - start) * 1000
        data = response.json()
        return AgentResponse(
            content=data["choices"][0]["message"]["content"],
            latency_ms=latency,
            input_tokens=data.get("usage", {}).get("prompt_tokens", 0),
            output_tokens=data.get("usage", {}).get("completion_tokens", 0),
            model="hunyuan-lite",
            finish_reason=data["choices"][0].get("finish_reason", "stop")
        )
```

### 3. 文心智能体（百度智能云）

```python
import qianfan

class WenxinAgentClient(CloudAgentClient):
    def __init__(self, access_key: str, secret_key: str, model: str = "ernie-4.0-8k"):
        self.client = qianfan.ChatCompletion(
            ak=access_key,
            sk=secret_key
        )
        self.model = model
    
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        import time
        start = time.time()
        response = self.client.do(
            model=self.model,
            messages=messages,
            **kwargs
        )
        latency = (time.time() - start) * 1000
        return AgentResponse(
            content=response.body["result"],
            latency_ms=latency,
            input_tokens=response.body.get("usage", {}).get("prompt_tokens", 0),
            output_tokens=response.body.get("usage", {}).get("completion_tokens", 0),
            model=self.model,
            finish_reason=response.body.get("finish_reason", "stop")
        )
```

### 4. DeepSeek Agent

```python
from openai import AsyncOpenAI

class DeepSeekAgentClient(CloudAgentClient):
    def __init__(self, api_key: str, model: str = "deepseek-chat"):
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com"
        )
        self.model = model
    
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        import time
        start = time.time()
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            **kwargs
        )
        latency = (time.time() - start) * 1000
        return AgentResponse(
            content=response.choices[0].message.content,
            latency_ms=latency,
            input_tokens=response.usage.prompt_tokens,
            output_tokens=response.usage.completion_tokens,
            model=self.model,
            finish_reason=response.choices[0].finish_reason
        )
```

---

## 国际云厂商

### 5. AWS Bedrock Agent

```python
import boto3
import time

class AWSBedrockAgentClient(CloudAgentClient):
    def __init__(self, region: str = "us-east-1", model_id: str = "anthropic.claude-3-5-sonnet-20241022-v2:0"):
        self.client = boto3.client("bedrock-runtime", region_name=region)
        self.model_id = model_id
    
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        import json
        start = time.time()
        
        system_message = ""
        chat_messages = []
        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            else:
                chat_messages.append({"role": msg["role"], "content": msg["content"]})
        
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 4096,
            "messages": chat_messages,
        }
        if system_message:
            body["system"] = system_message
        
        response = self.client.invoke_model(
            modelId=self.model_id,
            body=json.dumps(body)
        )
        latency = (time.time() - start) * 1000
        result = json.loads(response["body"].read())
        
        return AgentResponse(
            content=result["content"][0]["text"],
            latency_ms=latency,
            input_tokens=result["usage"]["input_tokens"],
            output_tokens=result["usage"]["output_tokens"],
            model=self.model_id,
            finish_reason=result.get("stop_reason", "end_turn")
        )
```

### 6. Azure AI Agent

```python
from azure.identity import DefaultAzureCredential
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage

class AzureAIAgentClient(CloudAgentClient):
    def __init__(self, endpoint: str, model: str = "gpt-5.2"):
        credential = DefaultAzureCredential()
        self.client = ChatCompletionsClient(
            endpoint=endpoint,
            credential=credential
        )
        self.model = model
    
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        import time
        start = time.time()
        
        azure_messages = []
        for msg in messages:
            if msg["role"] == "system":
                azure_messages.append(SystemMessage(content=msg["content"]))
            elif msg["role"] == "user":
                azure_messages.append(UserMessage(content=msg["content"]))
        
        response = self.client.complete(
            messages=azure_messages,
            model=self.model
        )
        latency = (time.time() - start) * 1000
        
        return AgentResponse(
            content=response.choices[0].message.content,
            latency_ms=latency,
            input_tokens=response.usage.prompt_tokens,
            output_tokens=response.usage.completion_tokens,
            model=self.model,
            finish_reason=response.choices[0].finish_reason or "stop"
        )
```

### 7. GCP Vertex AI Agent

```python
import vertexai
from vertexai.generative_models import GenerativeModel

class GCPVertexAgentClient(CloudAgentClient):
    def __init__(self, project: str, region: str = "us-central1", model: str = "gemini-2.5-pro"):
        vertexai.init(project=project, location=region)
        self.model_name = model
    
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        import time
        start = time.time()
        
        model = GenerativeModel(self.model_name)
        chat = model.start_chat()
        
        for msg in messages:
            if msg["role"] == "user":
                response = chat.send_message(msg["content"])
        
        latency = (time.time() - start) * 1000
        
        return AgentResponse(
            content=response.text,
            latency_ms=latency,
            input_tokens=response.usage_metadata.prompt_token_count,
            output_tokens=response.usage_metadata.candidates_token_count,
            model=self.model_name,
            finish_reason="stop"
        )
```

---

## 通用对话 Agent

### 8. ChatGPT Agent

```python
from openai import AsyncOpenAI

class ChatGPTAgentClient(CloudAgentClient):
    def __init__(self, api_key: str, model: str = "gpt-5.2"):
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = model
    
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        import time
        start = time.time()
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            **kwargs
        )
        latency = (time.time() - start) * 1000
        return AgentResponse(
            content=response.choices[0].message.content,
            latency_ms=latency,
            input_tokens=response.usage.prompt_tokens,
            output_tokens=response.usage.completion_tokens,
            model=self.model,
            finish_reason=response.choices[0].finish_reason
        )
```

### 9. Claude Agent

```python
from anthropic import AsyncAnthropic

class ClaudeAgentClient(CloudAgentClient):
    def __init__(self, api_key: str, model: str = "claude-4-5-sonnet-20250514"):
        self.client = AsyncAnthropic(api_key=api_key)
        self.model = model
    
    async def chat(self, messages: list, **kwargs) -> AgentResponse:
        import time
        start = time.time()
        
        system = ""
        chat_msgs = []
        for msg in messages:
            if msg["role"] == "system":
                system = msg["content"]
            else:
                chat_msgs.append(msg)
        
        params = {"model": self.model, "max_tokens": 4096, "messages": chat_msgs}
        if system:
            params["system"] = system
        
        response = await self.client.messages.create(**params)
        latency = (time.time() - start) * 1000
        
        return AgentResponse(
            content=response.content[0].text,
            latency_ms=latency,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
            model=self.model,
            finish_reason=response.stop_reason
        )
```

---

## 批量测评调度器

```python
import asyncio
from typing import Dict, List

class BenchmarkScheduler:
    def __init__(self, agents: Dict[str, CloudAgentClient], test_bank: List[Dict]):
        self.agents = agents
        self.test_bank = test_bank
        self.results = []
    
    async def run_single_test(self, agent_name: str, agent: CloudAgentClient, test: Dict) -> Dict:
        try:
            response = await agent.chat_with_context(
                question=test["question"],
                system=test.get("system_prompt", "")
            )
            return {
                "agent": agent_name,
                "test_id": test["id"],
                "question": test["question"],
                "response": response.content,
                "latency_ms": response.latency_ms,
                "input_tokens": response.input_tokens,
                "output_tokens": response.output_tokens,
                "total_cost_tokens": response.total_tokens,
                "model": response.model
            }
        except Exception as e:
            return {
                "agent": agent_name,
                "test_id": test["id"],
                "error": str(e)
            }
    
    async def run_all(self) -> List[Dict]:
        tasks = []
        for agent_name, agent in self.agents.items():
            for test in self.test_bank:
                tasks.append(self.run_single_test(agent_name, agent, test))
        
        self.results = await asyncio.gather(*tasks)
        return self.results
    
    def export_results(self, filepath: str):
        import json
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
```

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-04 | 初始版本，覆盖 9 个 Agent API + 批量调度器 |

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/demo/README.md|README]]
