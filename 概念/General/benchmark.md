---
title: "Benchmark（基准测试）"
category: -concepts
tags: [benchmark, evaluation, lm-evaluation-harness, opencompass, llm-eval]
aliases:
  - "Benchmark"
  - "基准测试"
  - "LLM Benchmark"
relationships:
  - target: "概念/lm-evaluation-harness"
    type: example
  - target: "概念/opencompass"
    type: example
  - target: "概念/llm-as-judge"
    type: complementary
sources:
  - 08_模型评估/
  - 概念/lm-evaluation-harness.md
  - 概念/opencompass.md
summary: "Benchmark（基准测试）是用标准化任务集评估 LLM 能力的方法；2026 年 LLM 评测已从单一基准（MMLU）演进到多维矩阵（推理/代码/Agent/安全/多模态），单一分数已无法反映真实能力。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-07-21
---

# Benchmark（基准测试）

## 核心要点

- **定义**：用标准化任务集合评估模型某方面能力的测试方法。
- **必备属性**：
  - **可复现**：固定测试集 + 固定评分脚本
  - **不污染**：测试集不应出现在训练集中
  - **难度梯度**：覆盖基础到高级
  - **统计显著性**：样本量 ≥ 500，置信区间 ≥ 95%
- **2026 现状**：单一基准已过时，需多维评测矩阵。

## 一句话解释

> Benchmark = "标准化的考卷"，让不同模型能在同一题目上 PK；好的 benchmark 应该防作弊、够难、有区分度。

## 主流 Benchmark 全景

### 综合能力
| 基准 | 内容 | 规模 | 当前 SOTA |
|------|------|------|----------|
| **MMLU** | 57 学科 | 14K 题 | Claude Opus 4.8: 92.1% |
| **MMLU-Pro** | 强化版 | 12K 题 | Claude Opus 4.8: 88.6% |
| **HellaSwag** | 常识 | 70K 题 | 96.5% |

### 推理与代码
| 基准 | 目标 | 当前 SOTA |
|------|------|----------|
| **GSM8K** | 小学数学 ≥ 95% | 98.0% |
| **MATH** | 高中 ≥ 85% | 89.2% |
| **HumanEval** | Python ≥ 95% | 96.8% |
| **SWE-bench** | GitHub 修复 ≥ 50% | 65.4% |

### 中文
| 基准 | 当前 SOTA |
|------|----------|
| **C-Eval** | Qwen3-235B: 90.2% |
| **CMMLU** | DeepSeek-V3: 88.5% |

### Agent / 工具
| 基准 | 当前 SOTA |
|------|----------|
| **WebArena** | Claude Opus 4.8: 64.8% |
| **τ-bench** | Claude Sonnet 4.6: 68.5% |

### 安全
| 基准 | 用途 |
|------|------|
| **AdvBench** | Prompt Injection 攻击 |
| **JailbreakBench** | 越狱测试 |
| **HarmBench** | 有害内容 |

## 主流评测框架

| 框架 | 提供方 | 强项 |
|------|--------|------|
| **lm-evaluation-harness** | EleutherAI | 行业标准，150+ 任务 |
| **OpenCompass** | 上海AI Lab | 中文 + 多模态 |
| **HELM** | Stanford | 多维评估矩阵 |
| **BIG-Bench** | Google | 200+ 任务 |
| **AlpacaEval** | Stanford | 单轮对话胜率 |
| **MT-Bench** | LMSYS | 多轮对话 |
| **Chatbot Arena** | LMSYS | 真实人类盲测、Elo |

## 评测陷阱

| 陷阱 | 现象 | 解决 |
|------|------|------|
| **数据污染** | 测试集出现在训练集 | 用未公开 / 新发布基准 |
| **过拟合基准** | 刷榜但实际能力差 | 多基准 + 实际场景测试 |
| **单一维度** | 偏科 | 多维矩阵 + 加权 |
| **评测成本失控** | GPT-4 评测烧钱 | 小模型 Judge + 抽样验证 |
| **评测集小** | 分数波动大 | ≥ 500 题 + 95% CI |

## 何时用什么

```
评估什么？
├── 通用能力 → MMLU / HellaSwag / ARC
├── 推理 → GSM8K / MATH
├── 代码 → HumanEval / SWE-bench / LiveCodeBench
├── 中文 → C-Eval / CMMLU / SuperCLUE
├── 长上下文 → RULER / LongBench / Needle-in-Haystack
├── Agent → WebArena / τ-bench / SWE-bench
├── 安全 → AdvBench / JailbreakBench / HarmBench
├── 多模态 → MMMU / MathVista
└── 真实人类偏好 → Chatbot Arena
```

## Related

- [[概念/lm-evaluation-harness]] — lm-evaluation-harness
- [[概念/opencompass]] — OpenCompass
- [[概念/llm-as-judge]] — LLM-as-Judge
- [[治理/cheatsheets/cheatsheet-evaluation]] — 评测速查表
- [[08_模型评估/README|模型评估]] — 评测章节

---

## 2026 Benchmark 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **MMLU-Pro** | 增强版多学科理解评测，难度更高 | GA |
| **LiveBench** | 动态更新评测集防止数据污染 | GA |
| **SWE-bench** | 真实 GitHub Issue 解决能力评测 | GA |
| **多模态 Benchmark** | 图文/视频/音频统一评测框架 | GA |
| **Arena-Hard-Auto** | 自动化高难度对话质量排名 | GA |

## 生产最佳实践

1. **不迷信单一分数**：综合多个 Benchmark 结果，避免过拟合特定评测集
2. **关注数据污染**：优先使用动态更新的评测集（LiveBench、Arena）
3. **业务相关性**：选择与业务场景匹配的评测，通用分数不代表实际效果
4. **可复现性**：记录评测参数（temperature、prompt 模板），确保结果可复现
5. **定期重评**：模型更新后必须重新跑全套 Benchmark，设置回归门禁

## 主流 Benchmark 对比

| Benchmark | 评估维度 | 难度 | 数据污染风险 | 适用场景 |
|-----------|----------|------|--------------|----------|
| MMLU-Pro | 多学科知识 | 高 | 中 | 通用能力 |
| GSM8K | 数学推理 | 中 | 高 | 数学场景 |
| HumanEval | 代码生成 | 中 | 高 | 编程能力 |
| SWE-bench | 真实 Issue | 高 | 低 | 工程能力 |
| LiveBench | 动态更新 | 中-高 | 极低 | 防污染评估 |
| MT-Bench | 多轮对话 | 中 | 中 | 对话质量 |
| Arena-Hard | 高难度对话 | 高 | 低 | 模型排名 |
| Chatbot Arena | 人类偏好 | 变化 | 无 | 综合体验 |

## 评估配置示例

```bash
# lm-evaluation-harness 多任务评估
lm_eval --model hf \
  --model_args pretrained=meta-llama/Llama-3-70B-Instruct \
  --tasks mmlu_pro,gsm8k,humaneval,mt_bench \
  --batch_size 8 \
  --num_fewshot 5 \
  --output_path ./eval_results/ \
  --log_samples

# OpenCompass 多模态评估
python run.py --models llama3_70b --datasets mmlu_pro gsm8k \
  --work-dir ./opencompass_results
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 分数虚高 | 数据污染 | 使用 LiveBench/Arena 动态集 |
| 结果不可复现 | 参数未固定 | 记录 temperature/seed/prompt |
| 与用户体验不符 | 评测集偏离生产 | 构建业务专属评测集 |
| 多模型对比不公平 | 评测条件不一致 | 统一 prompt 模板 + 参数 |

## 生产检查清单

1. ✅ 综合多个 Benchmark 而非单一分数
2. ✅ 优先使用动态更新评测集防污染
3. ✅ 记录全部评测参数确保可复现
4. ✅ 构建业务专属评测集
5. ✅ 模型更新后跑完整回归测试
6. ✅ 设置质量门禁（分数下降 > 2% 阻断发布）

## 总结

Benchmark 是模型能力量化的核心工具，但任何单一 Benchmark 都无法全面反映模型真实能力。2026 年的最佳实践是“多基准组合 + 动态防污染 + 业务专属评测 + 人类偏好”四层评估体系。

> 💡 Benchmark 的核心价值是“提供可比较的参考”，而非“绝对真理”——永远不要为了刷分而优化模型。