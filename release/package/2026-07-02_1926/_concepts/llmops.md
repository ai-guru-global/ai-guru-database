---
title: "LLMOps"
category: "_concepts"
tags: ["llmops", "mlops", "llm", "operations", "observability", "prompt-engineering"]
summary: "LLMOps 是 MLOps 在 LLM 时代的延伸——专注于大语言模型应用的部署、监控、评估和迭代运维。"
created: "2026-06-25"
updated: "2026-06-25"
tier: core
aliases:
  - "LLMOps"
  - "LLM Operations"
  - "LLM Ops"
sources: []

---
# LLMOps

> **一句话定义**: LLMOps 是将大语言模型（LLM）从实验推向生产的全套运维方法论——涵盖 Prompt 管理、RAG 编排、推理部署、可观测性、评估和安全合规。

---

## 核心定义

LLMOps (Large Language Model Operations) 是 **MLOps 的进化分支**，专门解决 LLM 应用在生产环境中面临的独特挑战：

- **非确定性输出**: 同样的输入可能产生不同的输出
- **Prompt 即代码**: Prompt 模板需要版本管理和回归测试
- **Token 经济学**: 成本以 token 计量，需要精细的成本控制
- **RAG 架构**: 检索增强生成引入了额外的数据管道和评估维度
- **安全对齐**: 需要防御 Prompt Injection、数据泄漏等新型威胁

---

## LLMOps vs MLOps

| 维度 | 传统 MLOps | LLMOps |
|------|-----------|--------|
| 模型来源 | 自己训练 | 使用预训练 LLM + Fine-tune/Prompt |
| 核心工件 | 模型权重 (.pkl/.pt) | Prompt 模板 + RAG 配置 |
| 评估指标 | Accuracy / F1 / AUC | Faithfulness / Relevance / Safety |
| 监控重点 | 数据漂移 / 预测分布 | Token 成本 / 延迟 / 幻觉率 |
| 部署单元 | 模型服务 | 推理引擎 + RAG Pipeline + Prompt |
| 迭代速度 | 周级（重训） | 小时级（改 Prompt） |

---

## LLMOps 技术栈

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

---

## 核心实践

1. **Prompt 版本管理**: 将 Prompt 模板存入 Git，每次修改跑回归测试
2. **RAG 质量闭环**: Ragas 评估 → 发现问题 → 优化检索/Chunking → 重新评估
3. **成本监控**: 按用户/功能/模型追踪 token 消耗，设置预算告警
4. **安全防护**: 输入过滤（Prompt Injection 检测）+ 输出过滤（PII/有害内容）
5. **A/B 测试**: 新 Prompt / 新模型上线前做 Champion-Challenger 对比

---

## Related

- [[MLOps/LLMOps_2026]] — LLMOps 全景深度解析
- [[_concepts/mlops]] — MLOps 概念
- [[MLOps/Evaluation/LLM_Evaluation_Pipeline]] — LLM 评估流水线
- [[MLOps/Observability/LLM_Observability]] — LLM 可观测性
