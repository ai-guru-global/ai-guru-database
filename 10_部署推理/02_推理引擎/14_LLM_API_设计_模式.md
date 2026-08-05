---
title: "LLM API Design Patterns"
tags: [deployment, api, llm, rest, streaming, production]
status: complete
last_updated: 2026-07-02
sources: []
name_zh: "LLM API 设计模式"
---

# LLM API Design Patterns

> 中文简称：LLM API 设计模式

## Overview

Designing production-grade APIs for LLM services requires handling unique challenges: long-running requests, streaming responses, token-based billing, and multi-modal inputs. This guide covers industry-standard API patterns.

## OpenAI-Compatible API Standard

The OpenAI API format has become the **de facto standard** for LLM services. Most inference engines (vLLM, TGI, SGLang, Ollama) implement this interface.

### Chat Completions API

```python
# Standard request format
POST /v1/chat/completions
{
    "model": "gpt-4o",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing."}
    ],
    "temperature": 0.7,
    "max_tokens": 1024,
    "top_p": 0.9,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0,
    "stream": false,
    "stop": ["\n\n"],
    "response_format": {"type": "json_object"},
    "tools": [...],
    "tool_choice": "auto"
}
```

### Response Format

```json
{
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1700000000,
    "model": "gpt-4o",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Quantum computing uses..."
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 25,
        "completion_tokens": 150,
        "total_tokens": 175
    }
}
```

## Streaming Patterns

### Server-Sent Events (SSE)

```python
# Streaming response format
POST /v1/chat/completions
{
    "model": "gpt-4o",
    "messages": [...],
    "stream": true
}

# Response: SSE stream
data: {"id":"chatcmpl-abc","choices":[{"delta":{"role":"assistant"},"index":0}]}

data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":"Quantum"},"index":0}]}

data: {"id":"chatcmpl-abc","choices":[{"delta":{"content":" computing"},"index":0}]}

data: {"id":"chatcmpl-abc","choices":[{"delta":{},"finish_reason":"stop","index":0}]}

data: [DONE]
```

### Client-Side Streaming

```python
import httpx

async def stream_chat(prompt: str):
    async with httpx.AsyncClient() as client:
        async with client.stream(
            "POST",
            "https://api.example.com/v1/chat/completions",
            json={
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "stream": True
            },
            headers={"Authorization": f"Bearer {API_KEY}"}
        ) as response:
            async for line in response.aiter_lines():
                if line.startswith("data: ") and line != "data: [DONE]":
                    chunk = json.loads(line[6:])
                    content = chunk["choices"][0]["delta"].get("content", "")
                    print(content, end="", flush=True)

# Python SDK
from openai import OpenAI
client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    stream=True
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## Error Handling

### Standard Error Response

```json
{
    "error": {
        "message": "Rate limit exceeded",
        "type": "rate_limit_error",
        "param": null,
        "code": "rate_limit_exceeded"
    }
}
```

### Error Code Reference

| HTTP Code | Error Type | Description | Client Action |
|-----------|-----------|-------------|---------------|
| 400 | invalid_request | Malformed request | Fix request |
| 401 | authentication_error | Invalid API key | Check credentials |
| 403 | permission_error | Insufficient permissions | Check access |
| 404 | not_found | Model/endpoint not found | Check model name |
| 429 | rate_limit_error | Too many requests | Retry with backoff |
| 500 | server_error | Internal server error | Retry with backoff |
| 503 | service_unavailable | Overloaded | Retry with backoff |

### Retry Pattern

```python
import time
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

@retry(
    retry=retry_if_exception_type((RateLimitError, ServiceUnavailableError)),
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=1, max=60)
)
def call_llm_with_retry(messages, model="gpt-4o"):
    return client.chat.completions.create(
        model=model,
        messages=messages,
        timeout=30
    )
```

## Rate Limiting & Quotas

### Rate Limit Headers

```http
HTTP/1.1 200 OK
x-ratelimit-limit-requests: 600
x-ratelimit-remaining-requests: 599
x-ratelimit-reset-requests: 1s
x-ratelimit-limit-tokens: 150000
x-ratelimit-remaining-tokens: 149825
x-ratelimit-reset-tokens: 1s
```

### Token Bucket Implementation

```python
import asyncio
from collections import deque
import time

class TokenBucketRateLimiter:
    def __init__(self, requests_per_minute: int, tokens_per_minute: int):
        self.rpm_limit = requests_per_minute
        self.tpm_limit = tokens_per_minute
        self.request_times = deque()
        self.token_usage = deque()
        self.lock = asyncio.Lock()
    
    async def acquire(self, estimated_tokens: int = 100):
        async with self.lock:
            now = time.time()
            # Clean old entries
            while self.request_times and now - self.request_times[0] > 60:
                self.request_times.popleft()
            while self.token_usage and now - self.token_usage[0][0] > 60:
                self.token_usage.popleft()
            
            # Check limits
            if len(self.request_times) >= self.rpm_limit:
                wait_time = 60 - (now - self.request_times[0])
                await asyncio.sleep(wait_time)
            
            current_tokens = sum(t for _, t in self.token_usage)
            if current_tokens + estimated_tokens > self.tpm_limit:
                wait_time = 60 - (now - self.token_usage[0][0])
                await asyncio.sleep(wait_time)
            
            self.request_times.append(now)
            self.token_usage.append((now, estimated_tokens))
```

## Multi-Modal API

### Image + Text Input

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/image.jpg",
                        "detail": "high"
                    }
                }
            ]
        }
    ]
)
```

### Audio Input

```python
response = client.chat.completions.create(
    model="gpt-4o-audio-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Transcribe this audio."},
                {
                    "type": "input_audio",
                    "input_audio": {
                        "data": base64_audio,
                        "format": "wav"
                    }
                }
            ]
        }
    ]
)
```

## Function Calling / Tool Use

### Tool Definition

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools,
    tool_choice="auto"
)

# Handle tool call
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    function_name = tool_call.function.name
    arguments = json.loads(tool_call.function.arguments)
    
    # Execute function
    result = get_weather(**arguments)
    
    # Send result back
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": "What's the weather in Tokyo?"},
            response.choices[0].message,
            {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result)
            }
        ]
    )
```

## Structured Output

### JSON Mode

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Output valid JSON."},
        {"role": "user", "content": "List 3 programming languages with their years created."}
    ],
    response_format={"type": "json_object"}
)
```

### JSON Schema Enforcement

```python
from pydantic import BaseModel
from openai import OpenAI

class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Extract the event information."},
        {"role": "user", "content": "Alice and Bob are going to a tech conference on Nov 15."}
    ],
    response_format=CalendarEvent
)
event = response.choices[0].message.parsed
```

## Embeddings API

```python
# Standard embeddings endpoint
POST /v1/embeddings
{
    "model": "text-embedding-3-large",
    "input": ["Hello world", "How are you?"],
    "encoding_format": "float"  # or "base64"
}

# Response
{
    "object": "list",
    "data": [
        {
            "object": "embedding",
            "embedding": [0.0023, -0.0091, ...],
            "index": 0
        },
        {
            "object": "embedding",
            "embedding": [0.0055, -0.0032, ...],
            "index": 1
        }
    ],
    "model": "text-embedding-3-large",
    "usage": {"prompt_tokens": 8, "total_tokens": 8}
}
```

## API Gateway Integration

### LiteLLM Proxy (Unified Gateway)

```yaml
# litellm_config.yaml
model_list:
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
  
  - model_name: gpt-4o
    litellm_params:
      model: azure/gpt-4o
      api_base: https://my-azure.openai.azure.com
      api_key: os.environ/AZURE_API_KEY
  
  - model_name: claude-3-opus
    litellm_params:
      model: anthropic/claude-3-opus-20240229
      api_key: os.environ/ANTHROPIC_API_KEY

router_settings:
  routing_strategy: "latency-based-routing"
  num_retries: 3
  timeout: 30
```

### FastAPI LLM Service

```python
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import json

app = FastAPI()

class ChatRequest(BaseModel):
    model: str
    messages: list[dict]
    temperature: float = 0.7
    max_tokens: int = 1024
    stream: bool = False

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    if request.stream:
        return StreamingResponse(
            stream_response(request),
            media_type="text/event-stream"
        )
    
    response = await generate(request)
    return response

async def stream_response(request):
    async for chunk in model.generate_stream(request.messages):
        data = json.dumps({
            "id": "chatcmpl-123",
            "choices": [{"delta": {"content": chunk}, "index": 0}]
        })
        yield f"data: {data}\n\n"
    yield "data: [DONE]\n\n"
```

## Versioning & Deprecation

### API Versioning Strategy

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| URL path | `/v1/chat/completions` | Clear, explicit | URL change breaks clients |
| Header | `OpenAI-Version: 2024-01-01` | No URL change | Hidden |
| Query param | `?api-version=2024-01-01` | Easy to test | Messy URLs |
| Model version | `gpt-4o-2024-05-13` | Granular control | Model proliferation |

### Deprecation Notice

```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Jun 2026 00:00:00 GMT
Link: <https://api.example.com/v2/chat/completions>; rel="successor-version"
```

## Production Checklist

- [ ] OpenAI-compatible API format
- [ ] Streaming support (SSE)
- [ ] Proper error handling with standard codes
- [ ] Rate limiting (per-user, per-model)
- [ ] Authentication (API key + JWT)
- [ ] Request validation (max tokens, model whitelist)
- [ ] Usage tracking (tokens, cost)
- [ ] Health check endpoint
- [ ] API versioning strategy
- [ ] CORS configuration
- [ ] Request/response logging
- [ ] Timeout configuration (30s default, 300s for long context)
- [ ] Graceful degradation (fallback models)

## Related Topics

- [[10_部署推理/02_推理引擎/29_vLLM_深入分析]]: High-performance inference engine
- [[12_架构基建/11_AI网关/10_LLM_Gateway_对比_2026]]: API gateway solutions
- [[10_部署推理/02_推理引擎/01_批处理_API_对比_2026]]: Async batch processing
- [[概念/General/deployment]]: Deployment overview
