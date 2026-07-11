---
title: "LLM-as-Judge 评估完全指南"
category: "08-model-evaluation"
tags: ["evaluation", "llm-as-judge", "benchmark", "ragas", "deepeval", "quality"]
summary: "使用 LLM 评估 LLM 输出质量的方法论,含评分框架、常用工具(Ragas/DeepEval/Promptfoo)、基准测试和最佳实践。"
sources:
  - "https://docs.ragas.io/"
  - "https://docs.confident-ai.com/"
  - "https://promptfoo.dev/"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "Llm As Judge Guide"
  - "LLM as Judge Guide"
  - LLM_as_Judge_Guide

---
# LLM-as-Judge 评估完全指南

> **一句话理解**: 使用 LLM 评估 LLM 输出质量的方法论,含评分框架、常用工具(Ragas/DeepEval/Promptfoo)、基准测试和最佳实践。

## 什么是 LLM-as-Judge?

用一个更强的 LLM(如 GPT-4o)来评估另一个 LLM 的输出质量。这是目前最实用的 LLM 评估方法之一。

## 为什么需要 LLM-as-Judge?

| 评估方式 | 优势 | 劣势 |
|----------|------|------|
| 人工评估 | 高质量 | 贵、慢、不可扩展 |
| 自动指标(BLEU/ROUGE) | 快速、便宜 | 与人类判断相关性低 |
| LLM-as-Judge | 接近人工质量、可扩展 | 有偏见、成本中等 |
| 基准测试 | 标准化、可对比 | 可能过拟合 |

## 评估维度

### 通用维度
| 维度 | 定义 | 评分范围 |
|------|------|---------|
| **相关性** | 回答是否切题 | 1-5 |
| **准确性** | 事实是否正确 | 1-5 |
| **完整性** | 是否覆盖所有要点 | 1-5 |
| **连贯性** | 逻辑是否清晰 | 1-5 |
| **有用性** | 对用户是否有帮助 | 1-5 |

### RAG 专用维度
| 维度 | 定义 |
|------|------|
| **忠实度** | 回答是否基于检索到的上下文 |
| **上下文精度** | 检索到的文档是否相关 |
| **上下文召回** | 相关文档是否被检索到 |
| **答案相关性** | 回答是否回应了问题 |

## 常用工具

### Ragas
- **定位**: RAG 评估专用框架
- **指标**: 忠实度、上下文精度/召回、答案相关性
- **优势**: 与 LangChain/LlamaIndex 深度集成
- **链接**: [ragas.io](https://docs.ragas.io/)

### DeepEval
- **定位**: 通用 LLM 评估框架
- **指标**: 9+ 种内置指标
- **优势**: 支持对话评估、红队测试
- **链接**: [deepeval.com](https://docs.confident-ai.com/)

### Promptfoo
- **定位**: Prompt 评估与对比工具
- **特性**: 多模型对比、CI/CD 集成
- **优势**: 本地运行、可视化界面
- **链接**: [promptfoo.dev](https://promptfoo.dev/)

## 评估流程

```
1. 定义评估维度和评分标准
2. 准备测试数据集(golden dataset)
3. 运行 LLM 生成回答
4. 使用 Judge LLM 评分
5. 分析结果、迭代优化
```

## 最佳实践

1. **使用比被评估模型更强的 Judge**: 如用 GPT-4o 评估 GPT-3.5
2. **多 Judge 取平均**: 减少单个 Judge 的偏见
3. **提供详细评分标准**: 减少评分歧义
4. **定期校准**: 用人工评估校准 LLM Judge
5. **关注失败案例**: 分析低分案例改进系统

## 常见基准测试

| 基准 | 测试内容 | 链接 |
|------|---------|------|
| MMLU | 多任务语言理解 | Papers with Code |
| HumanEval | 代码生成 | OpenAI |
| MT-Bench | 多轮对话 | LMSYS |
| AlpacaEval | 指令跟随 | Stanford |
| Chatbot Arena | 人类偏好排名 | LMSYS |

> **关联**: -> [[模型评估/README|模型评估]] | [[测试/Testing_Frameworks/DeepEval_Deep_Dive|DeepEval]] | [[测试/RAGAS_Deep_Dive|RAGAS]] | [[测试/Testing_Frameworks/Promptfoo_Deep_Dive|Promptfoo]]

