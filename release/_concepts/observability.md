---
title: "AI 可观测性（LLM Observability）"
tags: [observability, llm-ops, monitoring, tracing, metrics, logs, ai-ops, mlops]
aliases:
  - "LLM Observability"
  - "AI Observability"
  - "可观测性"
category: -concepts
sources:
  - 11_MLOps_Pipeline/Observability/Prometheus_Grafana_Deep_Dive.md
  - 13_AI_Ops/LLM_Observability_Guide.md
  - _meta/cheatsheets/cheatsheet-llm-inference.md
relationships:
  - target: "_concepts/prometheus"
    type: related_to
  - target: "_concepts/grafana"
    type: related_to
  - target: "_concepts/opentelemetry"
    type: core_technology
  - target: "_concepts/agent-eval"
    type: belongs_to
summary: "AI 可观测性是对 LLM 应用进行全链路监控、追踪和日志采集的能力，覆盖 token 成本、推理延迟、提示/响应质量、用户反馈、幻觉率、安全事件等维度，是生产级 LLM 应用的核心保障。"
lifecycle: stable
tier: core
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# AI 可观测性（LLM Observability）

## 一句话定义

**AI 可观测性 = 三大支柱（Metrics / Logs / Traces）+ LLM 特有维度（成本/质量/安全）** —— 在传统软件可观测性基础上，针对 LLM 应用增加 Token 成本、推理延迟、提示/响应质量、用户反馈、幻觉率、安全事件等 AI 特有可观测维度，是生产级 LLM 应用稳定运行的核心保障。

## 三大支柱（传统可观测性）

| 支柱 | 数据形态 | LLM 应用示例 |
|------|---------|-------------|
| **Metrics（指标）** | 时序数值 | QPS / P99 延迟 / Token 用量 / GPU 利用率 |
| **Logs（日志）** | 结构化事件 | 请求/响应内容 / 错误堆栈 / 工具调用记录 |
| **Traces（追踪）** | 链路调用树 | Agent 完整 reasoning chain / RAG 检索路径 |

## LLM 特有可观测维度

### 1. 成本维度（Cost Observability）

```
总成本 = 输入 token × 输入价 + 输出 token × 输出价 + 缓存命中折扣 + 微调摊销

关键指标：
- $/请求（per-request cost）
- $/用户会话（per-session cost）
- $/任务完成（per-task cost）  ← Agent 场景关键
- 缓存命中率（cache hit rate）
- 模型路由节省（router savings）
```

### 2. 质量维度（Quality Observability）

| 维度 | 度量方法 |
|------|---------|
| **事实性 / 幻觉率** | 人工标注 + LLM-as-Judge + RAGAS Faithfulness |
| **答案相关性** | RAGAS Answer Relevancy / 人工评分 |
| **指令遵循** | IFEval / MT-Bench |
| **推理正确性** | GSM8K / MATH / HumanEval |
| **风格一致性** | 风格 Embedding 距离 |
| **拒答率** | 误拒率 + 真拒率分项统计 |

### 3. 安全维度（Safety Observability）

- **PII 检测**：prompt/response 中身份证/手机号/银行卡泄露
- **Prompt Injection 攻击**：检测可疑指令注入尝试
- **Jailbreak 触发率**：统计被绕过安全护栏的请求
- **有害内容**：涉政、涉黄、涉暴、歧视内容
- **数据外泄**：是否回显训练数据中的 PII

### 4. 性能维度（Performance Observability）

- **TTFT**（Time To First Token）：首 token 延迟，反映 prompt 处理速度
- **TPOT**（Time Per Output Token）：每 token 生成时间
- **总延迟**（End-to-End Latency）
- **P50/P95/P99 延迟分布**
- **流式 vs 非流式吞吐**

## LLM Observability 工具栈

### 开源方案

| 工具 | 定位 | 强项 |
|------|------|------|
| **Langfuse** | LLM 专用 observability | OpenTelemetry 兼容、prompt 管理、evaluation 内置 |
| **Arize Phoenix** | 开源 LLM eval + observability | RAG 追踪、Drift Detection |
| **Helicone** | LLM API 代理 + 可观测性 | 一行代码接入、缓存、限流 |
| **OpenLLMetry** | OpenTelemetry LLM 扩展 | 与现有 OTel 栈集成 |
| **LangSmith** | LangChain 配套 | Agent 步骤可视化 |
| **Weights & Biases** | 实验追踪 + LLM | 模型对比、prompt versioning |

### 商业方案

| 工具 | 定位 |
|------|------|
| **Datadog LLM Observability** | 集成 APM、Real-time monitoring |
| **New Relic AI Monitoring** | 传统 APM 厂商扩展 |
| **Dynatrace** | 企业级 Full-stack |
| **Honeycomb** | 高基数维度分析 |
| **Snowflake Cortex** | 数据云 + AI 可观测 |

## 实战：典型可观测架构

```
┌─────────────────────────────────────────────────────────────┐
│                  LLM Application                            │
│  (Agent / RAG / Chatbot)                                   │
└────────────────────────┬────────────────────────────────────┘
                         │ OpenTelemetry / OpenLLMetry
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Collector (OTel Collector)                      │
└──────┬──────────────┬──────────────┬────────────────────────┘
       │              │              │
       ▼              ▼              ▼
┌─────────────┐ ┌──────────┐ ┌────────────────┐
│ Prometheus  │ │  Loki    │ │   Tempo /      │
│ (metrics)   │ │  (logs)  │ │   Jaeger       │
└──────┬──────┘ └────┬─────┘ │   (traces)     │
       │             │       └────────┬───────┘
       └─────────────┴────────────────┘
                     ▼
            ┌────────────────┐
            │   Grafana      │
            │  (可视化大盘)   │
            └────────────────┘

   同时 LLM 特有数据流向：
   ┌──────────────────────────────────┐
   │  Langfuse / Arize Phoenix       │
   │  - prompt/response 存储        │
   │  - evaluation 评分              │
   │  - user feedback 收集          │
   └──────────────────────────────────┘
```

## 与传统 APM 的差异

| 维度 | 传统微服务 | LLM 应用 |
|------|----------|----------|
| 延迟分布 | 较稳定 | 高度可变（生成 token 数不确定） |
| 失败模式 | 5xx 错误、超时 | 幻觉、格式错误、上下文超限 |
| 输出验证 | 状态码 / schema | 语义相似度、人工反馈 |
| 成本控制 | CPU/内存利用率 | token 用量（直接折算 ¥/$） |
| 追踪颗粒度 | HTTP / DB / MQ | prompt → retrieval → reasoning → tool call |
| 重放能力 | 强（确定性） | 弱（temperature > 0 时不可重现） |

## SLO 设计示例

```yaml
# LLM 应用 SLO 范例
api_latency_p99: 3000ms           # 99% 请求 3s 内返回首 token
output_quality_score: 0.85         # LLM-as-Judge 评分 ≥ 0.85
hallucination_rate: < 2%          # 幻觉率 ≤ 2%
cost_per_request: < $0.05         # 单次请求成本 ≤ $0.05
availability: 99.9%               # 月度可用性 99.9%
safety_violation_rate: < 0.1%     # 安全违规 ≤ 0.1%
```

## 何时投资 Observability

- **MVP 阶段**：H Helicone / Langfuse 免费版即可
- **生产上线**：完整 OTel + Grafana + Langfuse / Arize Phoenix
- **大规模（亿级 token/月）**：自建 + 商业方案混合
- **企业 / 合规**：Datadog / New Relic + 全链路审计

---

**参见**：[[Prometheus_Grafana_Deep_Dive]] · LLM Observability Guide · [[_concepts/prometheus]] · [[_concepts/grafana]] · [[13_AI_Ops/README|13_AI_Ops]] · [[_meta/cheatsheets/cheatsheet-llm-inference]]