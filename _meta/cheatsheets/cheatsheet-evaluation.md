---
title: "LLM 评测速查表"
tags: [cheatsheet, evaluation, llm-eval, benchmark, llm-as-judge, ragas, metrics, regression-testing]
type: cheatsheet
created: 2026-06-24
updated: 2026-06-24
tier: core
summary: "LLM 评测全栈速查：从通用基准（MMLU/MT-Bench）到领域评测（事实性/安全性/Agent）、LLM-as-Judge 范式、生产级回归测试流水线。"
sources: []
---

# LLM 评测速查表

> **核心洞察**：2026 年 LLM 评测已从单一基准（MMLU）演进到**多维评测矩阵**：通用能力 + 领域能力 + 安全 + 偏见 + Agent + RAG + 生产稳定性。没有"一站式评测"，只有"评测矩阵"。
> 详见 [[模型评估]] · [[LLM_Evaluation_Pipeline]] · [[LLM_Safety_Testing_Deep_Dive]] · [[LLM_as_Judge_Guide]]

## 评测维度全景

| 维度 | 子维度 | 评测方法 | 主流工具 |
|------|--------|---------|---------|
| **通用能力** | 知识、推理、语言 | 基准测试 | MMLU、HellaSwag、ARC |
| **指令遵循** | 格式、约束、多轮 | 规则化验证 | IFEval、IFEval-hard |
| **对话质量** | 有用性、无害性、诚实 | LLM-as-Judge | MT-Bench、AlpacaEval |
| **代码生成** | 正确性、效率 | Pass@k | HumanEval、MBPP、LiveCodeBench |
| **数学推理** | 解题步骤、最终答案 | 答案匹配 | GSM8K、MATH、MathArena |
| **RAG 质量** | 召回率、忠实度 | RAG 评估套件 | RAGAS、TruLens |
| **Agent 能力** | 工具使用、规划 | 任务成功率 | SWE-bench、WebArena |
| **安全性** | 越狱抵抗、偏见 | 攻击库 | AdvBench、Garak、OWASP LLM Top 10 |
| **多模态** | 视觉问答、OCR | 多模态基准 | MMMU、MathVista |
| **长上下文** | 长文检索、推理 | Needle-in-Haystack | RULER、LongBench |
| **生产指标** | 延迟、成本、SLO | 监控埋点 | Langfuse、Phoenix |
| **人类偏好** | 胜率、主观评分 | A/B 测试 + 众包 | Chatbot Arena |

## 通用基准（Benchmark）

### 综合能力

| 基准 | 内容 | 规模 | 当前 SOTA（2026中） |
|------|------|------|------------------|
| **MMLU** | 57 学科知识 | 14K 题 | Claude Opus 4.8: 92.1% / GPT-5: 91.8% |
| **MMLU-Pro** | MMLU 强化版 | 12K 题 | Claude Opus 4.8: 88.6% |
| **HellaSwag** | 常识推理 | 70K 题 | Claude Opus 4.8: 96.5% |
| **ARC-Challenge** | 推理 | 1.1K 题 | Claude Opus 4.8: 97.2% |
| **WinoGrande** | 代词消解 | 44K 题 | Claude Opus 4.8: 94.0% |
| **BIG-Bench** | 多任务 | 200+ 任务 | 各模型分化大 |
| **AGIEval** | 高考/司法考试 | 8.1K 题 | Claude Opus 4.8: 85.3% |

### 推理与代码

| 基准 | 内容 | 目标 | 当前 SOTA |
|------|------|------|----------|
| **GSM8K** | 小学数学 | ≥ 95% | Claude Opus 4.8: 98.0% |
| **MATH** | 高中竞赛 | ≥ 85% | Claude Opus 4.8: 89.2% |
| **HumanEval** | Python 函数 | ≥ 95% | Claude Opus 4.8: 96.8% |
| **MBPP** | 基础编程 | ≥ 90% | Claude Opus 4.8: 93.5% |
| **LiveCodeBench** | 实时编程 | 持续更新 | Claude Opus 4.8: 75.8% |
| **SWE-bench** | GitHub Issue 修复 | ≥ 50% | Claude Sonnet 4.6: 65.4% |
| **Aider Polyglot** | 多语言编辑 | ≥ 70% | Claude Opus 4.8: 81.2% |

### 中文基准

| 基准 | 内容 | 当前 SOTA |
|------|------|----------|
| **C-Eval** | 中文 52 学科 | Qwen3-235B: 90.2% |
| **CMMLU** | 中文综合 | DeepSeek-V3: 88.5% |
| **MMCU** | 中文多任务 | Qwen3: 86.4% |
| **SuperCLUE** | 中文综合 | Claude Sonnet 4.6 中文版: 89.7% |
| **GAOKAO-Bench** | 中国高考 | Qwen3-Max: 91.5% |

## LLM-as-Judge 范式

### 核心思路

用强 LLM（GPT-4 / Claude Opus）作为"裁判"，对其他模型的输出打分。

```python
# 标准 LLM-as-Judge Prompt
JUDGE_PROMPT = """你是一个严格的评分员。请基于以下维度对 [A] 和 [B] 两个回答评分（1-10）：

[问题]: {question}
[标准答案]: {reference}
[回答 A]: {response_a}
[回答 B]: {response_b}

评分维度:
1. 准确性（事实是否正确）
2. 完整性（是否覆盖关键点）
3. 清晰度（表达是否流畅）
4. 格式（是否符合要求）

输出 JSON: {"winner": "A|B|tie", "score_a": int, "score_b": int, "reason": "..."}
"""
```

### 主流 LLM-as-Judge 工具

| 工具 | 定位 | 强项 |
|------|------|------|
| **MT-Bench** | 多轮对话 | 80 题，GPT-4 评判 |
| **AlpacaEval** | 单轮胜率 | 自动评估 vs Reference |
| **Chatbot Arena** | 真实人类盲测 | LMSYS，Elo 排名 |
| **WildBench** | 真实场景 | 1K 任务，人类评分 |
| **Prometheus 2** | 开源 Judge | 70B 可达 GPT-4 水平 |
| **Prometheus-Eval** | 模块化 | 自定义评分维度 |
| **PandaLM** | 多维度 | 中英文 |
| **JudgeLRM** | 小模型 Judge | 7B 接近 GPT-4 |

### LLM-as-Judge 偏差与缓解

| 偏差 | 现象 | 缓解 |
|------|------|------|
| **位置偏差** | 偏好第一个回答 | 调换顺序两次取平均 |
| **长度偏差** | 偏好长回答 | 加入长度归一化 |
| **自我偏好** | 偏好自己输出 | 用不同模型做裁判 |
| **格式偏差** | 偏好 markdown | 标准化格式 |
| **模糊性** | 难以区分细微差别 | 提供详细评分标准 |

## RAG 评估

### 核心指标（RAGAS 框架）

| 指标 | 公式 | 含义 |
|------|------|------|
| **Context Precision** | relevant / retrieved | 检索结果中相关文档比例 |
| **Context Recall** | retrieved_relevant / total_relevant | 检索召回率 |
| **Faithfulness** | 答案忠实于上下文比例 | 防幻觉 |
| **Answer Relevancy** | 答案与问题相关性 | 答非所问检测 |
| **Answer Correctness** | vs 标准答案匹配度 | 终极质量 |
| **Answer Similarity** | 语义相似度 | 鲁棒比较 |

### RAG 评估流水线

```python
from ragas import evaluate
from ragas.metrics import (
    context_precision, context_recall,
    faithfulness, answer_relevancy,
    answer_correctness
)

result = evaluate(
    dataset,                    # 包含 question/answer/contexts/ground_truth
    metrics=[
        context_precision,
        context_recall,
        faithfulness,
        answer_relevancy,
        answer_correctness,
    ],
    llm=evaluator_llm,           # GPT-4 / Claude
    embeddings=evaluator_embeddings
)
print(result)
```

## 安全与红队评测

### 安全测试维度

| 维度 | 测试方法 | 工具 |
|------|---------|------|
| **Prompt Injection** | 已知攻击模板 | PromptBench、AdvBench |
| **Jailbreak** | 越狱模板库 | JailbreakBench、Garak |
| **有害内容** | 风险分类 | HarmBench、ToxicityPrompts |
| **PII 泄露** | 隐私攻击 | Microsoft Presidio |
| **偏见** | 公平性测试 | BBQ、BOLD |
| **幻觉** | 事实核验 | HaluEval、TruthfulQA |

### OWASP LLM Top 10 (2025)

1. Prompt Injection
2. Sensitive Information Disclosure
3. Supply Chain
4. Data and Model Poisoning
5. Improper Output Handling
6. Excessive Agency
7. System Prompt Leakage
8. Vector and Embedding Weaknesses
9. Misinformation
10. Unbounded Consumption

## Agent 评测

### Agent 基准

| 基准 | 任务 | 评测方式 | 当前 SOTA |
|------|------|---------|----------|
| **SWE-bench** | GitHub Issue 修复 | 测试通过率 | Claude Sonnet 4.6: 65.4% |
| **WebArena** | Web 任务 | 任务成功率 | Claude Opus 4.8: 64.8% |
| **ToolBench** | 工具调用 | 工具选择准确率 | GPT-5: 89.2% |
| **GAIA** | 真实任务 | 综合能力 | Claude Opus 4.8: 71.3% |
| **τ-bench** | 客服场景 | 多轮对话 | Claude Sonnet 4.6: 68.5% |
| **AgentBench** | 多环境 | 综合评分 | Claude Opus 4.8: 75.1% |
| **OSWorld** | 操作系统任务 | 任务完成率 | Claude Opus 4.8: 43.9% |

### Agent 评测指标

| 指标 | 含义 |
|------|------|
| **Task Success Rate** | 任务完成率 |
| **Step Efficiency** | 完成任务的步数 |
| **Tool Selection Accuracy** | 工具选择正确率 |
| **Argument Accuracy** | 参数正确率 |
| **Recovery Rate** | 失败后恢复率 |
| **Hallucinated Tool Calls** | 虚构工具率 |
| **Cost per Task** | 单任务成本 |

## 人类评估

### 评分维度（HHH）

- **Helpfulness**（有用性）: 解决问题了吗？
- **Honesty**（诚实性）: 是否承认不知道？
- **Harmlessness**（无害性）: 是否产生伤害？

### A/B Testing 框架

```
用户分流
├── A: 旧模型（baseline）
└── B: 新模型（candidate）
       ↓
     收集指标
     ├── 客观指标: 任务完成率、错误率
     ├── 主观指标: 用户点赞、停留时间
     └── 业务指标: 转化率、留存
       ↓
     显著性检验（t-test / bootstrap）
       ↓
     决策: 全量发布 / 回滚 / 继续优化
```

## 生产级回归测试

### 黄金集（Golden Set）

```yaml
# golden_set.yaml
test_cases:
  - id: "qa_basic_001"
    category: "通用问答"
    input: "什么是 Transformer？"
    expected_keywords: ["注意力机制", "self-attention", "并行"]
    expected_no_hallucination: true
    expected_format: "paragraph"

  - id: "rag_001"
    category: "RAG"
    input: "公司年假政策？"
    must_cite: true           # 必须引用
    expected_context_min_recall: 0.85

  - id: "agent_001"
    category: "Agent"
    input: "帮我把 data.csv 转为 JSON"
    must_succeed: true
    max_steps: 5
```

### CI/CD 集成

```yaml
# .github/workflows/llm-eval.yml
name: LLM Regression Test
on:
  pull_request:
    paths: ['prompts/**', 'models/**']

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Golden Set
        run: |
          python eval/run_golden_set.py \
            --candidate ${{ github.event.pull_request.head.ref }} \
            --baseline main \
            --threshold 0.02    # 不允许退化 > 2%
      - name: Run RAGAS
        run: python eval/run_ragas.py --threshold 0.85
```

## 评测陷阱

| 陷阱 | 现象 | 解决 |
|------|------|------|
| **数据污染** | 测试集出现在训练集 | 用未公开/新发布基准 |
| **过拟合基准** | 刷榜但实际能力差 | 综合多基准 + 实际场景测试 |
| **评测集小** | 分数波动大 | ≥ 500 题 / 95% CI |
| **单一维度** | 偏科 | 多维矩阵 + 加权总分 |
| **人工评估偏差** | 评估者主观性 | 多人评估 + 一致性检验 |
| **评测成本失控** | GPT-4 评测烧钱 | 用小模型 Judge + 抽样验证 |

## 何时用什么评测

```
新模型上线？
├── 是 → 完整评测（基准 + LLM-as-Judge + 安全 + Agent）
└── 否 → Prompt/参数改动？
    ├── 是 → 回归测试（Golden Set + RAGAS）
    └── 否 → 线上 A/B
       │
发现能力短板？
└── 对应基准深挖
   ├── 推理 → GSM8K/MATH
   ├── 代码 → HumanEval/SWE-bench
   ├── Agent → WebArena/τ-bench
   └── 安全 → Garak/HarmBench
```

---

**参见**：[[模型评估]] · [[LLM_Evaluation_Pipeline]] · [[LLM_as_Judge_Guide]] · [[LLM_Safety_Testing_Deep_Dive]] · [[Regression_Testing_LLM_Deep_Dive]] · [[Multimodal_Evaluation_Benchmarks]]