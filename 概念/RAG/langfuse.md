---
title: "Langfuse (开源 LLM 可观测性平台)"
category: -concepts
tags: ["observability", "llm", "tracing", "evaluation", "open-source", "monitoring"]
relationships:
  - target: "概念/langsmith"
    type: related_to
  - target: "概念/opik"
    type: related_to
  - target: "概念/helicone"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "开源的 LLM 可观测性与评估平台，提供 Tracing、评估、Prompt 管理和数据集管理，可自托管，是 LangSmith 的开源替代方案。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
---

# Langfuse

[Langfuse](https://github.com/langfuse/langfuse) 是一个**开源的 LLM 可观测性与评估平台**，提供 Tracing（链路追踪）、Evaluation（评估）、Prompt Management（Prompt 管理）和 Dataset Management（数据集管理）等核心能力。与 LangSmith 类似但**完全开源可自托管**，是企业在数据合规和隐私要求下的首选 LLM 观测方案。

## 核心架构

```
Langfuse 架构:

LLM 应用 (LangChain/LlamaIndex/自定义)
    │
    ▼ (SDK / OpenTelemetry)
┌─────────────────────────┐
│     Langfuse Server      │
│  ┌───────────────────┐  │
│  │ Trace Ingestion    │  │  链路追踪数据
│  ├───────────────────┤  │
│  │ Trace Store        │  │  PostgreSQL + ClickHouse
│  ├───────────────────┤  │
│  │ Evaluation Engine  │  │  LLM-as-Judge + 规则
│  ├───────────────────┤  │
│  │ Prompt Manager     │  │  版本化 Prompt
│  ├───────────────────┤  │
│  │ Dataset Manager    │  │  测试数据集
│  ├───────────────────┤  │
│  │ Dashboard UI       │  │  可视化分析
│  └───────────────────┘  │
└─────────────────────────┘
```

## 核心特性

### 1. Tracing (链路追踪)

```python
from langfuse import Langfuse

langfuse = Langfuse(
    public_key="pk-...",
    secret_key="sk-...",
    host="http://localhost:3000"  # 自托管
)

# 创建 Trace
trace = langfuse.trace(name="chat-completion")

# 记录 LLM 调用
generation = trace.generation(
    name="gpt-4-call",
    model="gpt-4",
    input=[{"role": "user", "content": "Hello"}],
    output={"role": "assistant", "content": "Hi there!"},
    usage={"prompt_tokens": 10, "completion_tokens": 20},
    metadata={"temperature": 0.7}
)

# 记录工具调用
span = trace.span(
    name="search-tool",
    input={"query": "AI trends"},
    output={"results": [...]},
    metadata={"latency_ms": 150}
)
```

### 2. 自动集成

```python
# LangChain 自动追踪
from langfuse.callback import CallbackHandler
langfuse_handler = CallbackHandler()

chain.invoke(input, config={"callbacks": [langfuse_handler]})

# LlamaIndex 自动追踪
from llama_index.callbacks.langfuse import LangfuseCallbackManager
callback_manager = LangfuseCallbackManager()

# OpenAI 自动追踪 (装饰器)
from langfuse.decorators import observe, langfuse_context

@observe()
def my_llm_function(query: str):
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": query}]
    )
    return response.choices[0].message.content
```

### 3. 评估 (Evaluation)

```python
# LLM-as-Judge 评估
score = trace.score(
    name="relevance",
    value=0.85,
    comment="Highly relevant response"
)

# 自动评估 (内置 Evaluator)
# Langfuse 支持配置自动评估:
# - 毒性检测
# - 幻觉检测
# - 相关性评估
# - 自定义 LLM Judge
```

### 4. Prompt 管理

```python
# 版本化 Prompt
langfuse.create_prompt(
    name="summarize",
    prompt="Summarize the following text in {{max_words}} words: {{text}}",
    config={"model": "gpt-4", "temperature": 0.3},
    labels=["production"]
)

# 获取最新版本
prompt = langfuse.get_prompt("summarize")
compiled = prompt.compile(text="...", max_words=100)
```

### 5. 数据集管理

```python
# 创建测试数据集
dataset = langfuse.create_dataset("qa-evaluation")

# 添加测试用例
dataset.create_item(
    input={"question": "What is AI?"},
    expected_output={"answer": "Artificial Intelligence..."},
    metadata={"difficulty": "easy"}
)

# 运行评估
for item in dataset.items:
    output = my_chain.invoke(item.input)
    item.link(
        trace=trace,
        run_name="v2-evaluation",
        run_metadata={"model": "gpt-4-turbo"}
    )
```

## 与 LangSmith / Opik / Helicone 对比

| 维度 | Langfuse | LangSmith | Opik | Helicone |
|------|----------|-----------|------|----------|
| **开源** | ✅ (MIT) | ❌ (SaaS) | ✅ | 部分 |
| **自托管** | ✅ | ❌ | ✅ | ❌ |
| **Tracing** | ✅ | ✅ | ✅ | ✅ |
| **评估** | ✅ | ✅ | ✅ | 有限 |
| **Prompt 管理** | ✅ | ✅ | 有限 | ❌ |
| **数据集** | ✅ | ✅ | ✅ | ❌ |
| **定价** | 免费(自托管) | 按量付费 | 免费 | 按量付费 |
| **数据主权** | ✅ (完全控制) | ❌ (Anthropic) | ✅ | ❌ |

## 典型应用场景

- **企业合规**: 自托管满足 GDPR/SOC2 数据驻留要求
- **开发调试**: 追踪 LLM 调用的每一步输入输出
- **A/B 测试**: 对比不同 Prompt/模型的评估结果
- **成本监控**: 追踪 Token 使用和 API 成本
- **质量保障**: 自动评估 + 人工标注 + 持续改进

## K8s 自托管部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: langfuse
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: langfuse
        image: ghcr.io/langfuse/langfuse:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          value: "postgres://user:pass@postgres-svc:5432/langfuse"
        - name: CLICKHOUSE_URL
          value: "http://clickhouse-svc:8123"
        - name: SALT
          valueFrom:
            secretKeyRef:
              name: langfuse-secret
              key: salt
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: langfuse-secret
              key: auth-secret
---
apiVersion: v1
kind: Service
metadata:
  name: langfuse-svc
spec:
  selector:
    app: langfuse
  ports:
  - port: 3000
```

## 安装

```bash
# Docker Compose (推荐)
docker compose up -d  # Langfuse + Postgres + ClickHouse

# Python SDK
pip install langfuse
```

## 参考资源

- [Langfuse GitHub](https://github.com/langfuse/langfuse)
- [Langfuse 文档](https://langfuse.com/docs)
- [Langfuse Cloud](https://cloud.langfuse.com/)

## 相关概念

- [[概念/langsmith]] — LangSmith LLM 可观测性
- [[概念/opik]] — Opik LLM 可观测性平台
- [[概念/helicone]] — Helicone LLM API 监控
- [[概念/wandb]] — Weights & Biases 实验追踪

---

## 2026 Langfuse 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Langfuse 2.x** | 开源 LLM 可观测性平台 | GA |
| **Tracing** | 请求级调用链追踪 | GA |
| **评估** | 自动化 + 人工评估 | GA |
| **Prompt 管理** | Prompt 版本管理和 A/B 测试 | GA |
| **成本追踪** | Token 消耗和成本分析 | GA |

## 生产最佳实践

1. **全链路追踪**：从用户请求到 LLM 响应全链路追踪
2. **评估闭环**：建立自动化评估 + 人工审核闭环
3. **Prompt 版本**：Prompt 变更必须版本化，支持回滚
4. **成本监控**：设置成本告警，防止超支
5. **隐私保护**：敏感数据脱敏后再上传 Langfuse
