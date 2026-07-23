---
title: "LLMOps"
category: "概念"
tags: ["llmops", "mlops", "llm", "operations", "observability", "prompt-engineering", "evaluation", "rag"]
summary: "LLMOps 是 MLOps 在 LLM 时代的延伸——专注于大语言模型应用的部署、监控、评估和迭代运维。核心关注 Prompt 版本管理、RAG 质量闭环、Token 成本控制、可观测性和安全合规。2026 年已成为 LLM 生产应用的必备方法论。"
created: "2026-06-25"
updated: "2026-07-21"
tier: core
aliases:
  - "LLMOps"
  - "LLM Operations"
  - "LLM Ops"
relationships:
  - target: "概念/Inference/model-serving"
    type: related_to
  - target: "概念/Agent/agent-evaluation-benchmarks"
    type: related_to
sources:
  - 模型运维/LLMOps_2026.md

---
# LLMOps

> **一句话定义**: LLMOps 是将大语言模型（LLM）从实验推向生产的全套运维方法论——涵盖 Prompt 管理、RAG 编排、推理部署、可观测性、评估和安全合规。

## 核心定义

LLMOps (Large Language Model Operations) 是 **MLOps 的进化分支**，专门解决 LLM 应用在生产环境中面临的独特挑战：

- **非确定性输出**: 同样的输入可能产生不同的输出
- **Prompt 即代码**: Prompt 模板需要版本管理和回归测试
- **Token 经济学**: 成本以 token 计量，需要精细的成本控制
- **RAG 架构**: 检索增强生成引入了额外的数据管道和评估维度
- **安全对齐**: 需要防御 Prompt Injection、数据泄漏等新型威胁

## LLMOps vs MLOps

| 维度 | 传统 MLOps | LLMOps |
|------|-----------|--------|
| 模型来源 | 自己训练 | 使用预训练 LLM + Fine-tune/Prompt |
| 核心工件 | 模型权重 (.pkl/.pt) | Prompt 模板 + RAG 配置 |
| 评估指标 | Accuracy / F1 / AUC | Faithfulness / Relevance / Safety |
| 监控重点 | 数据漂移 / 预测分布 | Token 成本 / 延迟 / 幻觉率 |
| 部署单元 | 模型服务 | 推理引擎 + RAG Pipeline + Prompt |
| 迭代速度 | 周级（重训） | 小时级（改 Prompt） |
| 回归测试 | 模型指标对比 | Prompt 输出质量对比 |

## LLMOps 技术栈 (2026)

```
┌─────────────────────────────────────────┐
│              应用层                       │
│  Prompt 管理 | RAG 编排 | Agent 框架      │
├─────────────────────────────────────────┤
│              评估层                       │
│  Ragas | Promptfoo | LangSmith Eval      │
├─────────────────────────────────────────┤
│              可观测层                     │
│  Langfuse | LangSmith | Phoenix          │
├─────────────────────────────────────────┤
│              推理层                       │
│  vLLM | SGLang | LiteLLM Gateway         │
├─────────────────────────────────────────┤
│              数据层                       │
│  Vector DB | Embedding | 文档解析         │
└─────────────────────────────────────────┘
```

## 核心工具链

| 环节 | 工具 | 功能 |
|------|------|------|
| **Prompt 管理** | PromptLayer / Humanloop | 版本控制、A/B 测试 |
| **评估** | Ragas / Promptfoo / DeepEval | RAG 质量、安全性评估 |
| **可观测性** | Langfuse / LangSmith / Phoenix | Trace、成本、延迟监控 |
| **推理网关** | LiteLLM / Portkey | 多模型路由、降级、限流 |
| **RAG 编排** | LlamaIndex / LangChain | 检索增强生成管道 |
| **安全** | Guardrails AI / NeMo Guardrails | 输入输出过滤 |
| **微调** | Axolotl / LLaMA-Factory | LoRA/QLoRA 微调 |

## 核心实践

### 1. Prompt 版本管理

```yaml
# prompt_v2.3.yaml
name: "customer_support"
version: "2.3"
template: |
  你是{{company}}的客服助手。
  背景信息: {{context}}
  用户问题: {{question}}
  请用友好专业的语气回答。
variables: [company, context, question]
tests:
  - input: {question: "如何退款?"}
    expect: contains("退款流程")
```

### 2. RAG 质量闭环

```
Ragas 评估 → 发现问题 → 优化检索/Chunking → 重新评估

核心指标:
├── Faithfulness: 回答是否忠于检索内容 (目标 >0.85)
├── Answer Relevancy: 回答是否切题 (目标 >0.80)
├── Context Precision: 检索是否精准 (目标 >0.75)
└── Context Recall: 检索是否完整 (目标 >0.70)
```

### 3. 成本监控

| 指标 | 监控方式 | 告警阈值 |
|------|----------|----------|
| Token 消耗/用户 | 按 user_id 追踪 | 超日均 3× |
| 单次调用成本 | input + output tokens | >$0.10/次 |
| 月度总成本 | 按功能/模型汇总 | 超预算 80% |
| 缓存命中率 | Prefix Cache hit rate | <40% |

### 4. 安全防护

```
输入 → [Prompt Injection 检测] → LLM → [输出过滤] → 用户
         │                              │
         ├─ 拦截注入攻击              ├─ PII 检测
         ├─ 拦截越狱尝试              ├─ 有害内容过滤
         └─ 输入长度限制              └─ 幻觉检测
```

### 5. 灰度发布

| 阶段 | 流量 | 监控 | 回滚条件 |
|------|:----:|------|----------|
| Canary | 5% | 延迟、错误率、质量 | 错误率 >1% |
| 灰度 | 25% | + 用户反馈、成本 | 质量下降 >5% |
| 全量 | 100% | 全指标 | P0 事故 |

## 2026 趋势

| 趋势 | 说明 |
|------|------|
| **AI 评估 AI** | 用 LLM 自动评估 LLM 输出质量 (LLM-as-Judge) |
| **Agent 可观测** | 多步 Agent 的 Trace、工具调用监控 |
| **成本优化自动化** | 自动模型路由（简单任务→小模型） |
| **Prompt 回归测试 CI** | Prompt 修改自动触发质量回归 |
| **统一网关** | LiteLLM/Portkey 统一管理多模型多供应商 |

## 生产最佳实践

1. **Prompt 纳入 Git**：每次修改跑回归测试，像代码一样管理
2. **RAG 质量定期评估**：每周跑 Ragas，监控 Faithfulness 趋势
3. **设置成本告警**：按用户/功能/模型追踪 token 消耗
4. **输入输出双向过滤**：防御 Prompt Injection + 拦截有害输出
5. **灰度发布新 Prompt/模型**：Champion-Challenger 对比后再全量
6. **全链路 Trace**：每个请求可追溯 Prompt 版本、检索结果、模型输出
7. **定期评估**：每周运行评估套件，追踪质量趋势
8. **成本优化**：监控 token 消耗，设置预算告警

## LLMOps 工具链

| 类别 | 工具 | 用途 |
|------|------|------|
| **评估** | Promptfoo, Ragas, DeepEval | 质量评估 |
| **可观测性** | LangSmith, Langfuse, Arize | 追踪与监控 |
| **部署** | vLLM, TGI, TensorRT-LLM | 推理服务 |
| **编排** | LangChain, LlamaIndex | 应用框架 |
| **护栏** | Guardrails AI, NeMo Guardrails | 安全过滤 |

## LLMOps 成熟度模型

| 级别 | 特征 | 关键实践 |
|------|------|----------|
| L1 基础 | 手动部署，无监控 | 基本日志 |
| L2 标准化 | CI/CD，基本监控 | 自动测试 |
| L3 优化 | 全链路追踪，自动评估 | A/B 测试 |
| L4 卓越 | 自愈，自动优化 | 智能运维 |

## Related

- [[模型运维/LLMOps_2026]] — LLMOps 全景深度解析
- [[概念/Inference/model-serving]] — 模型服务
- [[模型运维/LLM_Evaluation_Pipeline]] — LLM 评估流水线
- [[模型运维/Observability/LLM_Observability]] — LLM 可观测性
- [[大模型/LLM_Production_Deployment_Runbook|LLM 生产部署 Runbook]]
- [[大模型/LLM_Inference_Deep_Dive|LLM 推理深度解析]]

## LLMOps 工具链全景 (2026)

| 环节 | 工具 | 说明 |
|------|------|------|
| **提示管理** | PromptLayer, LangSmith | 版本控制 + A/B 测试 |
| **评估** | Ragas, DeepEval, MT-Bench | 自动化质量评估 |
| **可观测** | LangFuse, Arize, W&B Weave | 链路追踪 + 成本监控 |
| **网关** | Portkey, LiteLLM, OpenRouter | 多模型路由 + 回退 |
| **安全** | Guardrails AI, NeMo Guardrails | 输入输出过滤 |
| **部署** | vLLM, SGLang, TGI | 推理服务 |

## LLMOps vs MLOps vs DevOps

| 维度 | DevOps | MLOps | LLMOps |
|------|--------|-------|--------|
| **核心资产** | 代码 | 模型+数据 | 提示+模型+上下文 |
| **版本控制** | Git | Git+DVC | Git+提示版本 |
| **测试** | 单元/集成 | 数据/模型 | 评估集/回归 |
| **监控** | 延迟/错误 | 数据漂移 | 质量/幻觉/成本 |
| **迭代周期** | 天 | 周 | 小时 (提示调整) |

## 生产最佳实践

1. **提示版本化**：所有提示词纳入版本控制，支持回滚
2. **评估自动化**：每次提示/模型变更自动跑评估集
3. **成本监控**：按用户/功能/模型维度监控 Token 消耗
4. **多模型回退**：主模型失败时自动回退到备用模型
5. **幻觉检测**：生产环境启用幻觉检测 + 事实核查
