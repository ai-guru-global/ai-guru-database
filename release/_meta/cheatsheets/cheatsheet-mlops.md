---
title: "LLMOps 速查表"
tags: [cheatsheet, llmops, mlops, ci-cd, observability, cost-optimization, prompt-management, deployment]
type: cheatsheet
created: 2026-06-24
updated: 2026-06-24
tier: core
summary: "LLMOps 全栈速查：从 Prompt 管理、CI/CD、灰度发布、可观测性、成本优化到 SLO/Error Budget 的端到端生产级实践框架。"
---

# LLMOps 速查表

> **核心洞察**：LLMOps ≠ 传统 MLOps。LLM 应用的不确定性（temperature > 0 时不可重现）、高 token 成本、Prompt 敏感性使得 LLMOps 需要**三层治理**：Prompt/数据 → 推理服务 → 业务效果。
> 详见 [[11_MLOps_Pipeline]] · [[13_AI_Ops]] · [[LLMOps_2026]] · [[Cost_Optimization_AI_Deep_Dive]] · [[SLO_Error_Budget_AI_Deep_Dive]]

## LLMOps 三大治理层

| 层级 | 治理对象 | 工具 | 关键指标 |
|------|---------|------|---------|
| **L1: Prompt/数据层** | Prompt 版本、数据集、Evaluation | PromptLayer、LangSmith、Promptfoo | Prompt 评分、A/B 胜率 |
| **L2: 推理服务层** | 推理引擎、扩缩容、可观测性 | vLLM、TGI、Kserve、Langfuse | P99 延迟、QPS、成本 |
| **L3: 业务效果层** | 用户反馈、转化率、留存 | PostHog、Mixpanel、Amplitude | 转化、留存、NPS |

## Prompt 管理

### Prompt 版本控制

```yaml
# prompts/customer_service/v1.2.yaml
prompt_id: customer_service_v1.2
version: 1.2.0
created: 2026-06-01
author: alice@aiguru.com
changelog: |
  v1.2: 增加多轮上下文管理
  v1.1: 优化拒答逻辑
  v1.0: 初版

template: |
  你是 {{ brand }} 的客服助手。请基于以下原则回答：
  1. 友好、专业、简洁
  2. 不确定时引导转人工
  3. 涉及退款时严格按 SOP 处理

  上下文: {{ context }}
  用户: {{ query }}
  助手:

parameters:
  temperature: 0.3
  max_tokens: 500
  top_p: 0.95

evaluation:
  golden_set_id: customer_service_golden_v3
  min_pass_rate: 0.92
```

### Prompt 实验框架

| 框架 | 强项 | 适用 |
|------|------|------|
| **PromptLayer** | SaaS、版本控制 | 中小团队 |
| **LangSmith** | LangChain 集成、Tracing | LangChain 用户 |
| **Promptfoo** | 开源、CI 友好 | 工程师团队 |
| **Humanloop** | 协作、Annotation | 大团队 |
| **Agenta** | 开源 Playground | 自托管 |
| **Helicone** | 轻量 Proxy | 快速接入 |

## CI/CD 流水线

### LLM 应用 CI/CD 关键阶段

```
代码变更 (Prompt/Code/Config)
   ↓
[Unit Test]         ← 单元测试（prompt 解析、API 包装）
   ↓
[Golden Set Test]   ← 黄金集回归（不退化 > 2%）
   ↓
[RAGAS Eval]        ← RAG 指标（≥ 阈值）
   ↓
[Safety Test]       ← 安全测试（越狱/PII）
   ↓
[Load Test]         ← 负载测试（P99、成本）
   ↓
[Staging Deploy]    ← 灰度发布 1% → 10% → 50% → 100%
   ↓
[Online A/B]        ← 真实流量对比
   ↓
[Full Deploy]
```

### CI/CD 配置示例

```yaml
# .github/workflows/llm-pipeline.yml
name: LLM Pipeline
on:
  pull_request:
    paths: ['prompts/**', 'src/**', 'configs/**']

jobs:
  unit-test:
    steps:
      - run: pytest tests/unit/

  golden-set:
    needs: unit-test
    steps:
      - run: |
          python eval/run_golden.py \
            --candidate ${{ github.head_ref }} \
            --baseline main \
            --threshold 0.02

  ragas:
    needs: unit-test
    steps:
      - run: |
          python eval/run_ragas.py \
            --candidate ${{ github.head_ref }} \
            --min-faithfulness 0.90 \
            --min-relevancy 0.85

  safety:
    needs: unit-test
    steps:
      - run: |
          python eval/run_safety.py \
            --dataset advbench \
            --max-violation-rate 0.01

  deploy-staging:
    needs: [golden-set, ragas, safety]
    steps:
      - run: kubectl apply -f k8s/staging/
```

## 推理服务部署

### 部署模式选型

| 模式 | 代表 | 适合规模 | 成本 | 复杂度 |
|------|------|---------|------|--------|
| **API 直连** | OpenAI / Anthropic | 0-1M token/月 | 高 | 极低 |
| **Serverless** | Modal / Replicate | 突发流量 | 中 | 低 |
| **托管实例** | Bedrock / Vertex | 1M-100M token/月 | 中 | 中 |
| **自建 K8s** | vLLM + KServe | 100M+ token/月 | 低 | 高 |
| **混合** | 自建 + API fallback | 任意 | 灵活 | 中 |

### 推理引擎选型

| 引擎 | 强项 | 弱项 | 适合 |
|------|------|------|------|
| **vLLM** | 通用、高吞吐 | 启动稍慢 | 90% 场景 |
| **TGI** | Rust、稳定 | 多模态弱 | 生产稳定 |
| **TensorRT-LLM** | NVIDIA 极致优化 | 配置复杂 | 性能优先 |
| **SGLang** | Agent / 复杂控制 | 生态新 | 复杂推理 |
| **llama.cpp** | CPU / 边缘 | 性能有限 | 边缘部署 |
| **LMDeploy** | 中文优化 | 国际生态弱 | 中文场景 |

### Kubernetes 部署参考

```yaml
# k8s/vllm-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-qwen-7b
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        args:
          - --model=Qwen/Qwen2.5-7B-Instruct
          - --tensor-parallel-size=1
          - --max-model-len=32768
          - --gpu-memory-utilization=0.92
        resources:
          limits:
            nvidia.com/gpu: 1
            memory: 32Gi
        ports:
          - containerPort: 8000
        livenessProbe:
          httpGet: { path: /health, port: 8000 }
          periodSeconds: 30
        readinessProbe:
          httpGet: { path: /health, port: 8000 }
          periodSeconds: 5
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vllm-hpa
spec:
  scaleTargetRef: { name: vllm-qwen-7b }
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: gpu_utilization
      target: { type: Utilization, averageUtilization: 70 }
```

## 可观测性

### 三大支柱

| 支柱 | 工具 | LLM 特有 |
|------|------|---------|
| **Metrics** | Prometheus + Grafana | Token/s、成本、QPS |
| **Logs** | Loki / ELK | Prompt/Response/工具调用 |
| **Traces** | Tempo / Jaeger | Agent reasoning chain |

### LLM 可观测平台

| 平台 | 类型 | 强项 |
|------|------|------|
| **Langfuse** | 开源 SaaS/自托管 | OpenTelemetry 兼容 |
| **Arize Phoenix** | 开源 | RAG/Agent 追踪 |
| **Helicone** | SaaS | 一行代码接入 |
| **Datadog LLM** | 商业 | 企业级 APM |
| **New Relic AI** | 商业 | 传统 APM 集成 |
| **Weights & Biases** | SaaS | 实验追踪 |

### 关键 SLO 指标

```yaml
# SLO 范例
slo:
  availability:
    target: 99.9%
    window: 30d
    error_budget: 43m/month

  latency:
    ttft_p99: 500ms       # Time To First Token
    total_p99: 3000ms      # End-to-End
    tpot_p99: 50ms         # Time Per Output Token

  quality:
    faithfulness: >= 0.90
    answer_relevancy: >= 0.85
    refusal_rate: 5-15%
    user_satisfaction: >= 4.2/5

  cost:
    per_request: < $0.05
    per_session: < $0.30
    monthly_budget: $50000

  safety:
    jailbreak_success_rate: < 1%
    pii_leak_rate: 0%
    harmful_content_rate: < 0.1%
```

## 成本优化

### 六大降本杠杆

| 杠杆 | 节省潜力 | 实现难度 |
|------|---------|---------|
| **1. Prompt 优化** | 10-30% | 低 |
| **2. 模型选择（小模型优先）** | 30-70% | 中 |
| **3. 缓存（语义/精确）** | 30-80% | 中 |
| **4. 批处理（Batching）** | 20-50% | 中 |
| **5. Token 压缩** | 20-40% | 中 |
| **6. 自托管 vs API** | 50-90%（大规模）| 高 |

### 缓存策略

```python
# 三层缓存架构
class LLMCache:
    def __init__(self):
        self.exact_cache = Redis(ttl=3600)         # 精确匹配，TTL 1h
        self.semantic_cache = Qdrant()              # 语义匹配，TTL 24h
        self.prefix_cache = BuiltInCache()           # 前缀缓存（vLLM 内置）

    async def get_or_generate(self, prompt, threshold=0.95):
        # L1: 精确缓存
        exact = await self.exact_cache.get(prompt)
        if exact: return exact

        # L2: 语义缓存（找相似 query）
        similar = await self.semantic_cache.search(prompt, threshold=threshold)
        if similar: return similar.response

        # L3: 前缀缓存（共享 system prompt）
        # 由 vLLM prefix caching 自动处理

        # Fallback: 生成
        response = await llm.generate(prompt)
        await self.exact_cache.set(prompt, response)
        await self.semantic_cache.add(prompt, response)
        return response
```

### 模型路由

```python
# 按 query 复杂度路由到不同模型
class ModelRouter:
    def __init__(self):
        self.simple_llm = "gpt-4o-mini"      # 简单任务
        self.complex_llm = "gpt-4o"           # 复杂任务
        self.escalate_llm = "o1"              # 最复杂

    async def route(self, query):
        # 1. 估算复杂度
        complexity = self.estimate_complexity(query)

        # 2. 路由
        if complexity < 0.3:
            return await self.call(self.simple_llm, query)
        elif complexity < 0.7:
            return await self.call(self.complex_llm, query)
        else:
            return await self.call(self.escalate_llm, query)
```

## A/B Testing

### 实验设计

```
┌────────────────────────────────────────────────┐
│           Experiment: prompt_v2              │
├────────────────────────────────────────────────┤
│  Traffic Split:                                │
│    A (control, prompt_v1): 50%                │
│    B (treatment, prompt_v2): 50%              │
├────────────────────────────────────────────────┤
│  Primary Metric: User Satisfaction (👍/👎)    │
│  Secondary: Task Completion Rate, Latency      │
│  Guardrail: Refusal Rate, Cost per Query      │
├────────────────────────────────────────────────┤
│  Duration: 7 days minimum                      │
│  Sample Size: 10K queries (95% CI, 2% MDE)    │
└────────────────────────────────────────────────┘
```

### 显著性检验

```python
from scipy import stats

# Z-test for proportions
def is_significant(success_a, n_a, success_b, n_b, alpha=0.05):
    p_a = success_a / n_a
    p_b = success_b / n_b
    p_pool = (success_a + success_b) / (n_a + n_b)
    se = (p_pool * (1 - p_pool) * (1/n_a + 1/n_b)) ** 0.5
    z = (p_b - p_a) / se
    p_value = 2 * (1 - stats.norm.cdf(abs(z)))
    return p_value < alpha, z, p_value
```

## 常见事故与应急

| 事故 | 现象 | 应急 |
|------|------|------|
| **Prompt 泄露** | 用户诱导出 system prompt | 定期红队 + 加防御层 |
| **Prompt Injection** | 用户突破约束 | 输入过滤 + 输出验证 |
| **幻觉泛滥** | LLM 编造事实 | 加引用约束 + RAG |
| **成本失控** | 账单爆炸 | 设配额 + 路由到小模型 |
| **服务雪崩** | 流量过载 | 限流 + 队列 + 降级 |
| **PII 泄露** | 输出含个人隐私 | 输出过滤 + 审计 |
| **模型下线** | 推理失败 | 多模型 fallback |
| **数据污染** | 训练/推理混淆 | 严格环境隔离 |

## LLMOps 工具栈速查

| 类别 | 开源 | 商业 |
|------|------|------|
| **Prompt 管理** | Promptfoo、Agenta | PromptLayer、Humanloop |
| **LLM Observability** | Langfuse、Phoenix | Datadog、New Relic |
| **Evaluation** | RAGAS、TruLens、Promptfoo | Scale AI、Honeycomb |
| **部署** | vLLM、TGI、KServe | Bedrock、Vertex |
| **CI/CD** | GitHub Actions + 自定义 | CircleCI + LLMOps 插件 |
| **数据标注** | Label Studio | Scale AI、Labelbox |
| **特征存储** | Feast | Tecton |
| **实验追踪** | W&B、MLflow | Comet、Neptune |

---

**参见**：[[11_MLOps_Pipeline]] · [[13_AI_Ops]] · [[LLMOps_2026]] · [[Cost_Optimization_AI_Deep_Dive]] · [[SLO_Error_Budget_AI_Deep_Dive]] · [[LLM_Observability]] · [[_concepts/observability]]