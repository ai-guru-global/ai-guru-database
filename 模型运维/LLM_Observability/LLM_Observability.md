---
title: LLM 可观测性 (LLM Observability)
category: 12-mlops
tags: ["llm-observability", "tracing", "langsmith", "arize", "monitoring"]
summary: "LLM 可观测性完整体系：追踪（Tracing）、评估监控、Prompt 版本管理、异常检测、主流工具（LangSmith/Arize/Phoenix/Langfuse）与 2026 生产实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# LLM 可观测性 (LLM Observability)

## 1. 为什么需要 LLM 可观测性？

```
传统软件: 输入确定 → 输出确定 → 日志/指标/追踪
LLM 应用: 输入不确定 → 输出不确定 → 需要新范式

LLM 可观测性 = 追踪 + 评估 + 监控 + 调试

核心问题:
- 每次 LLM 调用发生了什么? (追踪)
- 输出质量是否在下降? (监控)
- 哪个 Prompt 版本效果更好? (实验)
- 出了 bug 怎么复现? (调试)
- 花了多少钱? (成本)
```

## 2. 追踪 (Tracing)

### 2.1 Trace 结构

```python
# LLM 应用 Trace 结构:

TRACE_EXAMPLE = {
    "trace_id": "abc-123",
    "spans": [
        {
            "name": "user_query",
            "input": "什么是量子计算?",
            "timestamp": "2026-07-21T10:00:00Z",
        },
        {
            "name": "retrieval",
            "input": "量子计算 定义",
            "output": ["doc1", "doc2", "doc3"],
            "latency_ms": 45,
            "metadata": {"top_k": 3, "score_threshold": 0.7},
        },
        {
            "name": "llm_call",
            "model": "gpt-4o",
            "input_tokens": 1250,
            "output_tokens": 380,
            "latency_ms": 2100,
            "cost_usd": 0.015,
            "prompt_version": "v2.3",
            "temperature": 0.7,
        },
        {
            "name": "post_processing",
            "output": "最终回答...",
            "latency_ms": 5,
        },
    ],
    "total_latency_ms": 2150,
    "total_cost_usd": 0.015,
    "user_id": "user_456",
    "session_id": "session_789",
}
```

### 2.2 实现

```python
# 使用 Langfuse (开源) 实现追踪:
from langfuse import Langfuse

langfuse = Langfuse(
    public_key="pk-...",
    secret_key="sk-...",
    host="https://cloud.langfuse.com"
)

# 自动追踪 (装饰器):
@langfuse.trace()
def answer_question(question: str, user_id: str):
    # 检索
    docs = retrieve(question)
    
    # LLM 调用
    response = llm.generate(
        prompt=build_prompt(question, docs),
        model="gpt-4o",
    )
    
    # 记录反馈
    langfuse.score(trace_id=trace.id, name="quality", value=0.9)
    
    return response

# 或使用 OpenTelemetry (标准化):
from opentelemetry import trace
from openinference.instrumentation.openai import OpenAIInstrumentor

OpenAIInstrumentor().instrument()
# 所有 OpenAI 调用自动追踪
```

## 3. 主流工具对比

| 工具 | 类型 | 特色 | 开源 | 价格 |
|------|------|------|------|------|
| LangSmith | SaaS | LangChain 生态/评估 | 否 | $39/月起 |
| Langfuse | 开源+SaaS | 最全面开源方案 | 是 | 免费/云 |
| Arize Phoenix | 开源 | 嵌入可视化/漂移 | 是 | 免费 |
| Weights & Biases | SaaS | 实验追踪 | 否 | $50/月起 |
| Helicone | 开源 | 代理层/简单 | 是 | 免费/云 |
| OpenLIT | 开源 | OTel 原生 | 是 | 免费 |

## 4. 监控告警

```python
LLM_MONITORING_ALERTS = {
    "质量监控": {
        "指标": "LLM-as-Judge 评分 / 用户反馈",
        "告警": "平均分 < 0.7 持续 10 分钟",
        "动作": "通知 + 自动回滚 Prompt",
    },
    "延迟监控": {
        "指标": "TTFT / 总延迟 P50/P99",
        "告警": "P99 > 10s",
        "动作": "扩容 / 降级",
    },
    "错误率": {
        "指标": "API 错误 / 超时 / 拒绝",
        "告警": "错误率 > 5%",
        "动作": "切换备用模型",
    },
    "成本监控": {
        "指标": "每小时/每天 token 消耗",
        "告警": "超出预算 150%",
        "动作": "限流 + 通知",
    },
    "漂移检测": {
        "指标": "输入/输出分布变化",
        "告警": "KL 散度 > 阈值",
        "动作": "触发重新评估",
    },
}
```

## 5. 交叉引用

- [[模型运维/|模型运维]]
- [[运维/Incident_Management/|事故管理]]
- [[测试/|测试]]
- [[概念/General/opentelemetry|OpenTelemetry]]
- [[概念/RAG/langfuse|Langfuse]]
- [[概念/RAG/langsmith|LangSmith]]
