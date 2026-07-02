---
title: "SGLang Frontend (SGLang API 服务层)"
category: -concepts
tags: ["sglang", "inference", "api-server", "openai-compatible", "streaming"]
relationships:
  - target: "_concepts/sglang"
    type: related_to
  - target: "_concepts/vllm"
    type: related_to
  - target: "_concepts/flash-attn"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "SGLang 推理引擎的 API 服务层，提供 OpenAI 兼容接口、流式输出、Function Calling 等前端能力，将底层高性能推理暴露为生产可用服务。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: supporting
---

# SGLang Frontend

SGLang Frontend 是 [SGLang](https://github.com/sgl-project/sglang) 推理引擎的 **API 服务层**，负责将底层高性能推理内核（RadixAttention、FlashInfer 等）封装为标准 HTTP/gRPC 接口，对外暴露 OpenAI 兼容 API、流式输出、Function Calling、Structured Output 等前端能力。它是 SGLang 从"研究原型"走向"生产服务"的关键桥梁。

## SGLang 整体架构

```
SGLang 架构分层:

┌─────────────────────────────────────────┐
│           Frontend (API Server)          │
│  ┌──────────┬──────────┬─────────────┐  │
│  │ OpenAI   │ SGLang   │ gRPC/       │  │
│  │ Compat   │ Native   │ Streaming   │  │
│  │ API      │ API      │ API         │  │
│  └──────────┴──────────┴─────────────┘  │
├─────────────────────────────────────────┤
│           Scheduler / Router             │
│  (请求调度、Batch 管理、优先级队列)        │
├─────────────────────────────────────────┤
│           RadixAttention Engine          │
│  (前缀缓存、KV Cache 管理)               │
├─────────────────────────────────────────┤
│           Model Runtime                  │
│  (FlashInfer/TensorRT-LLM 内核)          │
└─────────────────────────────────────────┘
```

## 核心能力

### 1. OpenAI 兼容 API

```bash
# 启动 SGLang 服务
python -m sglang.launch_server \
    --model-path meta-llama/Llama-3-8B \
    --port 30000

# OpenAI 兼容调用
curl http://localhost:30000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3-8B",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "stream": true
  }'
```

### 2. 结构化输出 (Structured Output)

```python
import sglang as sgl
import json

@sgl.function
def extract_info(s, text):
    s += f"Extract info from: {text}\n"
    s += "Output JSON: " + sgl.gen(
        "result",
        json_schema={
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "age": {"type": "integer"}
            },
            "required": ["name", "age"]
        }
    )

# Frontend 自动将 JSON Schema 传递给底层内核
# 底层使用 FlashInfer 的 constrained decoding
```

### 3. Function Calling

```python
# OpenAI 风格的 Function Calling
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather info",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"}
                },
                "required": ["city"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="llama-3-8b",
    messages=[{"role": "user", "content": "Beijing weather?"}],
    tools=tools,
    tool_choice="auto"
)
# Frontend 处理工具解析和格式转换
```

### 4. 流式输出

```python
# SSE (Server-Sent Events) 流式
stream = client.chat.completions.create(
    model="llama-3-8b",
    messages=[{"role": "user", "content": "Tell a story"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### 5. Batch 推理 API

```bash
# 批量推理请求
curl http://localhost:30000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3-8b",
    "prompt": ["Hello", "Hi", "Hey"],
    "max_tokens": 100
  }'
# Frontend 自动组装 continuous batch
```

## 与 vLLM API 层对比

| 维度 | SGLang Frontend | vLLM API Server |
|------|----------------|-----------------|
| **OpenAI 兼容** | ✅ | ✅ |
| **流式输出** | ✅ (SSE) | ✅ (SSE) |
| **Function Calling** | ✅ | ✅ |
| **Structured Output** | ✅ (JSON Schema) | ✅ (Guided Decoding) |
| **多模态** | ✅ (Vision) | ✅ |
| **Batch API** | ✅ | ✅ |
| **原生 DSL** | ✅ (SGLang 语法) | ❌ |
| **前缀缓存感知** | ✅ (RadixAttention) | ✅ (Prefix Caching) |
| **性能** | 极高 | 高 |

## Frontend 内部流程

```
请求到达 Frontend:

1. HTTP 解析 → 验证参数
2. Tokenize (如果非 token IDs)
3. 请求入队 → Scheduler
4. Scheduler 组装 Batch
5. Runtime 执行推理
6. Frontend 接收 Token 流
7. Detokenize → SSE 推送
8. 完整结果写入 Metrics
```

## 配置与调优

```bash
python -m sglang.launch_server \
    --model-path meta-llama/Llama-3-70B \
    --tp 8 \                    # 张量并行度
    --port 30000 \
    --host 0.0.0.0 \
    --max-total-tokens 16384 \  # 最大总 Token 数
    --max-running-requests 256 \ # 最大并发请求
    --chunked-prefill-size 8192 \ # 分块 Prefill
    --enable-dp-attention \      # DP Attention
    --log-level info
```

## K8s 生产部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sglang-inference
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: sglang
        image: lmsysorg/sglang:latest
        ports:
        - containerPort: 30000
        args:
        - --model-path
        - meta-llama/Llama-3-8B
        - --port
        - "30000"
        - --host
        - "0.0.0.0"
        resources:
          limits:
            nvidia.com/gpu: 1
        livenessProbe:
          httpGet:
            path: /health
            port: 30000
          initialDelaySeconds: 60
        readinessProbe:
          httpGet:
            path: /health
            port: 30000
---
apiVersion: v1
kind: Service
metadata:
  name: sglang-svc
spec:
  selector:
    app: sglang-inference
  ports:
  - port: 30000
    targetPort: 30000
```

## 参考资源

- [SGLang GitHub](https://github.com/sgl-project/sglang)
- [SGLang 文档](https://sgl-project.github.io/)
- [SGLang Frontend API](https://sgl-project.github.io/backend/openai_api_completions.html)

## 相关概念

- [[_concepts/sglang]] — SGLang 结构化生成语言
- [[_concepts/vllm]] — vLLM 高性能推理引擎
- [[_concepts/flash-attn]] — Flash Attention 高效注意力内核
- [[_concepts/lm-format-enforcer]] — LM Format Enforcer 输出格式约束
