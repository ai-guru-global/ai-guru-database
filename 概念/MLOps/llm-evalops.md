---
title: "LLM EvalOps / LLM 评测工程 (评测流水线 / 在线评测 / Eval Platform)"
category: concepts
tags:
  - mlops
  - llm-eval
  - evalops
  - online-evaluation
  - llm-as-judge
  - benchmark
  - eval-platform
aliases:
  - LLM EvalOps
  - LLM Evaluation
  - EvalOps
  - Online Evaluation
  - LLM-as-Judge
  - Eval Platform
relationships:
  - target: "概念/online-evaluation"
    type: extends
  - target: "概念/llm-as-judge"
    type: related_to
  - target: "概念/ci-integrated-evaluation"
    type: related_to
  - target: "概念/ab-testing-framework"
    type: related_to
summary: "LLM EvalOps 是 2024-2026 突破"LLM 质量难衡量"的关键——离线基准(HELM / MMLU / MT-Bench)+ 在线评测(影子部署 / 黄金集)+ LLM-as-Judge + A/B 测试 + 人工评估。DeepEval / RAGAS / Langfuse / Helicone / LangSmith 是工业级方案。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "LLM EvalOps / LLM 评测工程"
---

# LLM EvalOps / LLM 评测工程

> 中文简称：LLM EvalOps / LLM 评测工程

> **一句话理解**:LLM EvalOps 是 LLM 时代的"软件测试 + 性能监控"——离线基准(HELM / MMLU / MT-Bench / BigBench)+ 在线评测(影子部署 / 黄金集)+ LLM-as-Judge(自动评分)+ A/B 测试 + 人工评估。是 LLM 上线"必走流程"。

---

## 一、为什么 LLM EvalOps 重要?

传统软件测试对 LLM 失效:
- 输出不确定(同 prompt 不同结果)
- 难定义"正确"(任务多样性)
- 难量化(质量、风格、偏见)
- 难回归(版本升级可能"变好"或"变差")

EvalOps 解法:
- **离线基准**:标准化数据集,横向对比
- **在线评测**:真实用户数据,持续观察
- **LLM-as-Judge**:自动化评分
- **A/B 测试**:用户体验对比
- **人工评估**:最终质量把控

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 评测工程 | EvalOps | LLM 评测流水线 |
| 基准测试 | Benchmark | 标准化评测集 |
| HELM | HELM | Stanford 评测 |
| MMLU | MMLU | 多任务语言理解 |
| MT-Bench | MT-Bench | 多轮对话 |
| BigBench | BigBench | 大型综合基准 |
| LLM-as-Judge | LLM-as-Judge | LLM 评 LLM |
| 黄金集 | Golden Set | 高质量标准答案 |
| 影子部署 | Shadow Deployment | 平行运行不暴露 |
| A/B 测试 | A/B Testing | 流量分流对比 |
| 在线评估 | Online Evaluation | 真实流量评估 |
| 离线评估 | Offline Evaluation | 基准数据集 |
| 胜率 | Win Rate | A vs B 胜出比例 |
| Elo 评分 | Elo Rating | Chatbot Arena |
| 帕累托 | Pareto | 质量/成本/延迟权衡 |
| 回归测试 | Regression Test | 升级不能变差 |
| 红队 | Red Team | 主动找漏洞 |
| 偏见检测 | Bias Detection | 见 Safety 卡 |
| 安全性评估 | Safety Evaluation | 越狱/毒性 |
| 黄金回复 | Golden Response | 标准答案 |

---

## 三、主流评测平台对比(2026-02 快照)

| 平台 | 厂商 | 特色 | 许可证 | 适合 |
|---|---|---|---|---|
| **HELM** | Stanford | 7 大类、30+ 指标 | Apache 2.0 | 学术 |
| **OpenCompass** | 上海 AI Lab | 中文 SOTA,100+ 模型 | Apache 2.0 | 中文 |
| **lm-evaluation-harness** | EleutherAI | HuggingFace 标配 | MIT | 通用 |
| **DeepEval** | Confident AI | LLM 评测框架 | Apache 2.0 | 单元测试 |
| **RAGAS** | Exploding Gradients | RAG 评测 | Apache 2.0 | RAG |
| **TruLens** | TruEra | LLM 反馈评估 | Apache 2.0 | 应用层 |
| **Langfuse** | Langfuse | 可观测 + 评测 | MIT | 集成 |
| **LangSmith** | LangChain | 集成 LangChain | 商业 | LangChain |
| **Helicone** | Helicone | 监控 + 评测 | MIT | 监控 |
| **Patronus AI** | Patronus | Enterprise 评测 | 商业 | 企业 |
| **Braintrust** | Braintrust | 评测 + 优化 | 商业 | 企业 |
| **OpenAI Evals** | OpenAI | 官方评测 | MIT | OpenAI |
| **Chatbot Arena** | LMSYS | 众包盲测 | Apache 2.0 | 综合 |

---

## 四、离线基准详解

### 4.1 HELM(Stanford)

- **7 大类**:准确性 / 校准 / 鲁棒性 / 公平性 / 偏见 / 毒性 / 效率
- **30+ 指标**:多维度评估
- **30+ 模型**:横向对比
- 网站 [crfm.stanford.edu/helm](https://crfm.stanford.edu/helm)

### 4.2 MMLU(57 科知识)

- 14K 多选题,57 个学科
- 从小学到专业研究生
- 衡量通用知识
- 仍是事实标准

### 4.3 MT-Bench / MT-Bench++

- 80 个高质量多轮对话
- 8 个类别(写作 / 推理 / 数学 / 编码 / 提取 / STEM / 人文 / 角色扮演)
- LLM-as-Judge 评估
- GPT-4 Turbo 作为 Judge

### 4.4 BigBench / BBH

- 200+ 任务,推理 / 数学 / 常识
- BBH(Hard 23 个任务)

### 4.5 中文评测

- **OpenCompass**:100+ 模型,50+ 任务
- **C-Eval**:中文 52 科
- **CMMLU**:中文多任务
- **GAOKAR-Bench**:高考题

---

## 五、在线评测方案

### 5.1 影子部署(Shadow Deployment)

- 新模型 / 新版本平行运行
- 不暴露给真实用户
- 收集响应,后续评估
- 推荐:Langfuse / Helicone

### 5.2 黄金集评估

- 准备高质量"标准问答对"
- 定期跑测试
- 监控胜率
- DeepEval / RAGAS 集成

### 5.3 A/B 测试

- 流量分桶:50% A 模型 + 50% B 模型
- 用户反馈(点赞/点踩)
- 转化率/任务成功率
- Helicone / Braintrust

### 5.4 LLM-as-Judge

```python
from langchain.evaluation import load_evaluator

evaluator = load_evaluator("labeled_criteria", criteria="correctness")

result = evaluator.evaluate_strings(
    prediction="巴黎",
    reference="巴黎",
    input="法国首都是哪?",
)
print(result["score"])  # 1.0
```

---

## 六、生产最佳实践

1. **离线 + 在线双管齐下**:离线看 baseline,在线看真实。
2. **黄金集 100-1000 条**:覆盖主要任务。
3. **MT-Bench 必跑**:多轮对话 SOTA。
4. **LLM-as-Judge + 人工抽样**:自动化 + 5% 人工。
5. **A/B 测试 7-14 天**:置信度 95% 需 7+ 天。
6. **监控关键指标**:任务成功率、用户满意度、延迟、成本。
7. **回归测试**:每次升级都跑基准。
8. **Elo 评分**:用 Chatbot Arena 范式。
9. **Pareto 分析**:质量/成本/延迟三维。
10. **红队评估**:主动找漏洞,弥补 LLM-as-Judge 盲点。

---

## 七、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **OpenCompass** | v3.0,中文 SOTA |
| **HELM** | v2.0,多模态扩展 |
| **lm-evaluation-harness** | v0.5+,HuggingFace 默认 |
| **DeepEval** | v1.0,生产级 |
| **RAGAS** | v0.3,多模态 RAG |
| **Langfuse** | v3.0,可观测+评测 |
| **Chatbot Arena** | 月活 100 万+,众包数据 |
| **企业应用** | 100% 头部 LLM 厂商采用 |
| **市场规模** | LLM 评测 ARR $200M+ |
| **主要竞品** | OpenCompass / DeepEval / RAGAS / Langfuse / Braintrust |

---

## 八、See Also(官方源)

- HELM [crfm.stanford.edu/helm](https://crfm.stanford.edu/helm)
- OpenCompass [opencompass.org.cn](https://opencompass.org.cn/)
- lm-evaluation-harness [github.com/EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)
- DeepEval [github.com/confident-ai/deepeval](https://github.com/confident-ai/deepeval)
- RAGAS [github.com/explodinggradients/ragas](https://github.com/explodinggradients/ragas)
- TruLens [github.com/truera/trulens](https://github.com/truera/trulens)
- Langfuse [github.com/langfuse/langfuse](https://github.com/langfuse/langfuse)
- LangSmith [smith.langchain.com](https://smith.langchain.com/)
- Chatbot Arena [lmarena.ai](https://lmarena.ai/)

---

## 九、相关概念卡

- [[概念/online-evaluation|Online Evaluation]]
- [[概念/llm-as-judge|Llm As Judge]]
- [[概念/ci-integrated-evaluation|Ci Integrated Evaluation]]
- [[概念/ab-testing-framework|Ab Testing Framework]]
- [[概念/llm-arena|Llm Arena]]
- [[概念/llm-safety|Llm Safety]]
- [[概念/ragas|Ragas]]
- [[概念/llm-production-pipeline|Llm Production Pipeline]]
