---
title: RAGAS
type: index
created: 2026-07-02
updated: 2026-07-11
sources: []
tags: [auto-index]
name_zh: "RAGAS 专题"
---

# RAGAS

> 中文简称：RAGAS 专题

RAGAS — RAG 系统评估框架（evaluation framework），涵盖 Faithfulness、Answer Relevance 与 Context Recall 等指标。

## 文件导航

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| [[09_测试/02_Testing_Frameworks/RAGAS_Deep_Dive|RAGAS Deep Dive]] | RAGAS deep dive: RAG evaluation metrics system and automated scoring pipeline | RAG developers / evaluation engineers |

## Related

- [[09_测试/index|测试首页]]
- [[14_RAG系统/07_RAG_Evaluation/RAG_Evaluation_index|RAG Evaluation]]
- [[14_RAG系统/index|RAG系统]]

## 核心概念

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Faithfulness | 答案忠实于检索内容 | 幻觉检测 |
| Answer Relevancy | 答案与问题相关性 | 质量评估 |
| Context Precision | 检索内容精确度 | 检索质量 |
| Context Recall | 检索内容召回率 | 完整性 |
| Answer Correctness | 答案正确性 | 事实核查 |

## RAGAS 指标体系

| 指标 | 计算方式 | 达标标准 |
|------|----------|----------|
| Faithfulness | LLM 判断句子支持度 | >0.8 |
| Answer Relevancy | 余弦相似度 | >0.7 |
| Context Precision | 排序质量 | >0.6 |
| Context Recall | 覆盖率 | >0.7 |
| Answer Correctness | F1/语义相似 | >0.75 |

## RAGAS vs 其他评估框架

| 框架 | 优势 | 局限 | 适用场景 |
|------|------|------|----------|
| RAGAS | 无需参考答案 | 依赖 LLM 判断 | RAG 系统 |
| DeepEval | 全面指标 | 配置复杂 | 通用 LLM |
| Promptfoo | 灵活断言 | 需手动定义 | Prompt 测试 |
| TruLens | 可解释性 | 生态较小 | 调试分析 |

## 学习路径建议

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | RAGAS Deep Dive 主文档 | 理解指标体系 |
| 实践 | 评估一个 RAG 系统 | 掌握工具使用 |
| 进阶 | 自定义指标 + CI 集成 | 自动化评估 |

## 常见问题

| 问题 | 解答 |
|------|------|
| RAGAS 需要参考答案吗？ | 大部分指标不需要 |
| 评估一次需要多少 Token？ | 约 100-500 token/样本 |
| 如何提升 Faithfulness？ | 优化 Prompt + 检索质量 |
| 推荐配合工具？ | LangChain, LlamaIndex |

## 统计

| 指标 | 数值 |
|------|------|
| 子域文件数 | 1 |
| 核心指标数 | 5+ |
| 评估成本 | ~$0.01/样本 |
| 支持框架 | LangChain, LlamaIndex |

> 💡 RAGAS 是 RAG 系统评估的事实标准，其无参考评估特性使其特别适合生产环境监控。

## 附录：RAGAS 评估流程

| 步骤 | 操作 | 工具 |
|------|------|------|
| 1. 准备数据 | 构建 QA 测试集 | 手动/LLM 生成 |
| 2. 运行 RAG | 获取检索+生成结果 | LangChain |
| 3. 计算指标 | 调用 RAGAS API | ragas.evaluate() |
| 4. 分析结果 | 查看各维度分数 | Dashboard |
| 5. 优化迭代 | 针对低分维度改进 | Prompt/检索优化 |
| 6. CI 集成 | 自动化回归检测 | GitHub Actions |

## 附录：RAGAS 指标详解

| 指标 | 输入 | 计算逻辑 | 优化方向 |
|------|------|----------|----------|
| Faithfulness | answer, contexts | 句子级支持度 | 减少幻觉 |
| Answer Relevancy | question, answer | 语义相似度 | 提升相关性 |
| Context Precision | contexts, answer | 排序质量 | 优化检索排序 |
| Context Recall | contexts, reference | 覆盖率 | 提升召回率 |
| Answer Correctness | answer, reference | F1+语义 | 提升准确性 |

## 附录：RAGAS 代码示例

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from datasets import Dataset

# 准备评估数据
eval_data = {
    "question": ["..."],
    "answer": ["..."],
    "contexts": [["..."]],
    "ground_truth": ["..."],
}
dataset = Dataset.from_dict(eval_data)

# 运行评估
results = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy,
             context_precision, context_recall],
)
print(results)
```

## 附录：RAGAS 优化策略

| 低分指标 | 可能原因 | 优化方案 |
|----------|----------|----------|
| Faithfulness 低 | 模型幻觉 | 优化 Prompt + 温度调低 |
| Relevancy 低 | 答案偏离问题 | 优化问题理解 |
| Precision 低 | 检索噪声多 | 优化 Embedding/重排序 |
| Recall 低 | 检索不完整 | 增加 top_k + 查询扩展 |
| Correctness 低 | 事实错误 | 优化知识库质量 |

## 附录：2026 年 RAG 评估趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 多模态 RAG 评估 | 图像/表格检索评估 | 指标扩展 |
| 实时评估 | 生产环境持续监控 | 主动优化 |
| 自动化测试生成 | LLM 生成测试用例 | 降低构建成本 |
| 细粒度评估 | 句子/段落级评估 | 精准定位问题 |

## 附录：RAGAS 术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 忠实度 | Faithfulness | 答案忠于检索内容 |
| 相关性 | Relevancy | 答案与问题匹配 |
| 精确率 | Precision | 检索内容质量 |
| 召回率 | Recall | 检索内容覆盖 |
| 正确性 | Correctness | 答案事实准确 |
| 无参考评估 | Reference-free | 无需标准答案 |

## 附录：RAGAS 检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 测试集构建 | QA 对准备 | ☐ |
| 指标选择 | 匹配评估目标 | ☐ |
| 阈值设定 | 明确达标线 | ☐ |
| CI 集成 | 自动化评估 | ☐ |
| 结果分析 | 低分维度定位 | ☐ |
| 迭代优化 | 持续改进 | ☐ |

## 附录：RAGAS 快速导航

| 我想... | 去看 | 难度 |
|---------|------|------|
| 了解 RAGAS 基础 | 本文档核心概念 | ★☆☆ |
| 理解指标 | 指标详解表 | ★★☆ |
| 运行评估 | 代码示例 | ★★☆ |
| 优化低分 | 优化策略表 | ★★☆ |

## 附录：RAGAS 资源

| 资源 | 类型 | 特点 |
|------|------|------|
| RAGAS 文档 | 官方文档 | 全面指南 |
| RAGAS GitHub | 代码 | 开源框架 |
| RAGAS 论文 | 论文 | 理论基础 |
| 本文档 | 知识库 | 中文体系化 |

## 附录：RAGAS 统计

| 指标 | 数值 |
|------|------|
| 核心指标 | 5+ |
| 评估成本 | ~$0.01/样本 |
| 支持框架 | LangChain, LlamaIndex |
| 无参考评估 | 支持 |

---
*Last updated: 2026-07-21*
