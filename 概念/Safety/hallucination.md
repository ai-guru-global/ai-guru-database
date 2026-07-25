---
title: "Hallucination (幻觉)"
tags: [hallucination, llm-reliability, rag-systems, factuality, agent-security]
created: 2026-06-17
updated: 2026-07-21
tier: core
aliases:
  - Hallucination
  - "幻觉"
  - "LLM 幻觉"
category: -concepts
lifecycle: reviewed
relationships:
  - target: "概念/RAG/rag-systems"
    type: mitigated_by
  - target: "概念/LLM/llmops"
    type: related_to
sources: []
---

# Hallucination (幻觉)

> **一句话理解**: 幻觉 = 大模型“一本正经地胡说八道”——输出看似流畅自信，但与事实不符或无中生有。

## 定义

幻觉（Hallucination）是大语言模型生成的内容与事实不符、缺乏依据或逻辑矛盾的现象。NIST AI 600-1 将其称为“虚构”（Confabulation），是 LLM 系统最核心的可靠性挑战之一。

## 幻觉的成因

| 成因 | 说明 |
|------|------|
| **概率性生成** | 模型预测最可能的下一个词，而非查找正确答案 |
| **训练数据噪声** | 错误/过时信息被内化到权重 |
| **知识截止** | 不知道训练截止后的事件，但可能自信编造 |
| **注意力偏差** | 长上下文中忽略关键约束 |
| **参数记忆局限** | 统计压缩≠精确存储 |

## 幻觉的分类

| 类型 | 描述 | 示例 |
|------|------|------|
| **事实性幻觉** | 与已知事实矛盾 | “爱因斯坦获得了诺贝尔文学奖” |
| **无中生有** | 编造不存在的引用/数据 | 虚构论文 DOI、法律条文 |
| **逻辑矛盾** | 前后文自相矛盾 | 先说 A 正确，后说 A 错误 |
| **指令幻觉** | 未执行用户要求却声称已完成 | Agent 场景中常见 |

## 缓解策略 (2026)

| 策略 | 原理 | 效果 |
|------|------|:----:|
| **RAG** | 检索真实文档作为上下文 | ⭐⭐⭐⭐⭐ |
| **引用源强制** | 要求模型标注来源 | ⭐⭐⭐⭐ |
| **LLM-as-Judge** | 用另一个 LLM 验证事实性 | ⭐⭐⭐⭐ |
| **思维链 (CoT)** | 让模型先推理再回答 | ⭐⭐⭐ |
| **温度调低** | 减少随机性 | ⭐⭐ |
| **微调/RLHF** | 训练模型说“我不知道” | ⭐⭐⭐⭐ |
| **工具调用** | 计算/搜索用工具而非纯生成 | ⭐⭐⭐⭐⭐ |
| **多模型交叉验证** | 多个模型答案对比 | ⭐⭐⭐ |

## 检测工具

| 工具 | 类型 | 说明 |
|------|------|------|
| **G-Eval** | LLM-as-Judge | 用 GPT 评估事实性 |
| **FActScore** | 自动指标 | 原子事实分解 + 验证 |
| **RAGAS** | RAG 评估 | 检测 RAG 回答的忠实度 |
| **DeepEval** | 综合框架 | 内置幻觉检测指标 |
| **Guardrails AI** | 运行时护栏 | 实时检测 + 拦截幻觉输出 |

## 生产最佳实践

1. **RAG 优先**: 任何事实性问答都应接入检索
2. **引用源必标注**: 让用户可验证
3. **置信度阈值**: 低置信度时主动说“不确定”
4. **工具调用**: 计算/搜索/查询用工具，不纯生成
5. **监控幻觉率**: 用 LLM-as-Judge 定期抽样检测
6. **用户反馈回路**: 收集“不准确”反馈迭代优化

## 延伸阅读

- [[概念/RAG/rag-systems|RAG 系统]]
- [[概念/LLM/llmops|LLMOps]]
- [[概念/Safety/adversarial-attack|对抗攻击]]
- [[17_伦理安全/Guardrails/Guardrails_2026|护栏技术 2026]]

## 幻觉检测代码示例

```python
# 使用 RAGAS 检测 RAG 幻觉
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
from datasets import Dataset

# 准备评估数据
eval_data = {
    "question": ["What is quantum computing?"],
    "answer": [model_output],
    "contexts": [[retrieved_docs]],
    "ground_truth": [reference_answer]
}
dataset = Dataset.from_dict(eval_data)

# 评估
result = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy]
)
print(f"忠实度: {result['faithfulness']:.2f}")
print(f"相关性: {result['answer_relevancy']:.2f}")
```

## 幻觉缓解架构图

```
幻觉缓解多层架构:
用户查询
    │
    ▼
┌─────────────────┐
│  意图理解 + 查询改写  │
└────────┬────────┘
         │
    ▼
┌─────────────────┐
│  RAG 检索增强      │ ← 知识库
└────────┬────────┘
         │
    ▼
┌─────────────────┐
│  LLM 生成 + 引用标注  │
└────────┬────────┘
         │
    ▼
┌─────────────────┐
│  事实性验证 (Judge)  │
└────────┬────────┘
         │
    ▼
┌─────────────────┐
│  护栏过滤 + 输出    │
└─────────────────┘
```

## 2026 幻觉研究进展

| 方向 | 说明 | 状态 |
|------|------|------|
| **归因训练** | 训练模型标注信息来源 | 研究 |
| **不确定性量化** | 模型输出置信度 | GA |
| **多模型交叉验证** | 多个模型答案对比 | GA |
| **知识图谱增强** | 结构化知识约束 | GA |
| **实时搜索增强** | 联网搜索验证 | GA |

## 延伸阅读

- [[概念/RAG/rag-systems|RAG 系统]] — 检索增强生成
- [[概念/LLM/llmops|LLMOps]] — LLM 运维
- [[概念/Safety/adversarial-attack|对抗攻击]] — 对抗攻击可诱发幻觉
- [[17_伦理安全/Guardrails/Guardrails_2026|护栏技术 2026]] — 输出安全护栏

> ℹ️ 幻觉是 LLM 的固有限制，无法完全消除，但可通过 RAG + 验证 + 护栏大幅降低。

## 幻觉评估指标

| 指标 | 说明 | 计算方式 |
|------|------|----------|
| **Faithfulness** | 答案是否忠于检索内容 | RAGAS |
| **Answer Relevancy** | 答案与问题的相关性 | RAGAS |
| **FActScore** | 原子事实正确率 | 分解+验证 |
| **Hallucination Rate** | 幻觉内容占比 | LLM-as-Judge |
| **Citation Accuracy** | 引用源正确性 | 自动校验 |

## 行业场景幻觉风险

| 场景 | 风险等级 | 缓解策略 |
|------|----------|----------|
| **医疗诊断** | 🔴 极高 | RAG + 专家审核 |
| **法律咨询** | 🔴 极高 | 引用源强制 + 人工校验 |
| **金融分析** | 🟡 高 | 工具调用 + 数据验证 |
| **客服问答** | 🟡 中 | RAG + 置信度阈值 |
| **创意写作** | 🟢 低 | 可接受创造性内容 |

## 幻觉监控与告警

```python
# 生产环境幻觉监控
from langsmith import Client

client = Client()

# 定期抽样评估
def monitor_hallucination(run_id):
    run = client.read_run(run_id)
    # 用 LLM-as-Judge 评估事实性
    score = evaluate_factuality(run.outputs["answer"])
    if score < 0.7:
        alert(f"幻觉风险: {run.id}, score={score}")
    return score
```

## 延伸阅读

- [[概念/RAG/rag-systems|RAG 系统]] — 检索增强生成
- [[概念/LLM/llmops|LLMOps]] — LLM 运维
- [[概念/Safety/adversarial-attack|对抗攻击]] — 对抗攻击可诱发幻觉
- [[17_伦理安全/Guardrails/Guardrails_2026|护栏技术 2026]] — 输出安全护栏

> ℹ️ 幻觉是 LLM 的固有限制，无法完全消除，但可通过 RAG + 验证 + 护栏大幅降低。