---
title: "AI Evaluation Engineer 面试指南"
category: "21-interviews-ai-evaluation-engineer"
tags: ["interviews", "career", "experience", "practitioners", "model-evaluation", "evaluation", "benchmark", "llm-as-judge", "ragas", "testing", "quality-assurance"]
summary: "AI Evaluation Engineer 面试全流程指南，覆盖评测方法论、LLM-as-Judge、RAG 评测、安全评测、自动化评测平台、人类评估流程、回归测试和上线门禁。适用于 OpenAI、Anthropic、Google、Meta 等公司的 AI Eval 岗位。"
created: 2026-05-31
updated: 2026-07-11
tier: supporting
aliases:
  - "AI_Evaluation_Engineer"
  - "AI Evaluation Engineer 面试指南"
  - "AI_Evaluation_Engineer Interview Guide"
  - "AI Eval Engineer"
  - "Model Evaluation Engineer"
sources: []
name_zh: "AI Evaluation Engineer 面试指南"
---

# AI Evaluation Engineer 面试指南

> 中文简称：AI Evaluation Engineer 面试指南

> **一句话理解**: AI Evaluation Engineer 是 AI 系统质量的守门员——设计科学的评估方法、构建可扩展的评测平台、建立可靠的上线门禁标准，确保 AI 产品在发布前达到质量基线、在运行中持续达标。

---

## Table of Contents

- [1. 岗位定位与核心职责](#1-岗位定位与核心职责)
  - [1.1 岗位定位](#11-岗位定位)
  - [1.2 核心职责](#12-核心职责)
  - [1.3 核心技能栈](#13-核心技能栈)
  - [1.4 与相近岗位的区别](#14-与相近岗位的区别)
- [2. 技术能力要求](#2-技术能力要求)
- [3. 核心知识领域](#3-核心知识领域)
- [4. 高频面试问题](#4-高频面试问题)
- [5. 系统设计题](#5-系统设计题)
- [6. 编程与实操题](#6-编程与实操题)
- [7. 备考策略与学习路径](#7-备考策略与学习路径)
- [8. 行业薪资范围参考](#8-行业薪资范围参考)
- [9. 面试 Checklist](#9-面试-checklist)
- [Related](#related)

---

## 1. 岗位定位与核心职责

### 1.1 岗位定位

AI Evaluation Engineer（AI 评估工程师）是随着大模型和生成式 AI 的爆发而快速兴起的专业工程岗位。传统的软件 QA 关注功能正确性和性能指标，但 AI 系统的评估面临全新的挑战：

- **非确定性输出**: 同一输入可能产生不同但都合理的输出，传统断言测试不再适用
- **多维度质量**: 评估不仅看"对错"，还要看流畅性、相关性、安全性、有用性、公平性等
- **主观性**: 很多评估维度（如写作质量）本质上是主观的，需要设计可靠的标注流程
- **规模挑战**: 大模型评测需要覆盖海量场景和边缘情况，手动测试不可行
- **动态基准**: 随着模型能力提升，基准也需要不断更新，否则会产生天花板效应

AI Evaluation Engineer 的核心价值在于**将"主观的、模糊的" AI 质量评估转化为"客观的、可量化的、可自动化的"评测体系**，为产品决策和模型迭代提供可靠的数据支撑。

### 1.2 核心职责

| 职责领域 | 具体内容 | 交付物 |
|---------|---------|--------|
| **评测体系设计** | 定义评估维度、设计评估方法、选择评估工具 | 评估方案文档、评估标准 |
| **评测数据构建** | 构建 Golden Set、对抗样本、边缘场景测试集 | 标注数据集、测试用例库 |
| **自动化评测** | 开发自动化评测流水线、集成 CI/CD | 评测平台、自动化脚本 |
| **LLM-as-Judge** | 设计和优化自动评估模型，验证其与人类评估的一致性 | Judge 模型配置、一致性报告 |
| **人工评估管理** | 设计标注流程、管理标注团队、质量管控 | 标注指南、一致性分析报告 |
| **安全评测** | 红队测试、越狱测试、有害内容检测 | 安全评测报告、漏洞清单 |
| **回归测试** | 建立回归测试框架，确保新版本不引入退化 | 回归测试套件、测试报告 |
| **上线门禁** | 定义上线质量标准，建立发布门禁 | 发布标准文档、门禁系统 |

### 1.3 核心技能栈

| 维度 | 关键技能 | 常见工具/框架 |
|------|---------|--------------|
| **评估方法论** | 实验设计、统计检验、标注方法论 | Scipy.stats, Krippendorff's Alpha |
| **LLM 评估** | LLM-as-Judge, Pairwise Comparison, Reference-free 评估 | RAGAS, TruLens, DeepEval, Promptfoo |
| **传统 ML 评估** | 分类/回归/排序指标、交叉验证 | Scikit-learn, NLTK, SacreBLEU |
| **基准测试** | MMLU, HumanEval, GSM8K, MT-Bench, AlpacaEval | LM-Evaluation-Harness, OpenCompass |
| **安全评测** | 红队测试框架、越狱 Benchmark | HarmBench, AdvBench, JailbreakBench |
| **数据处理** | 大规模数据处理、数据质量控制 | Python, Pandas, SQL, Spark |
| **自动化** | CI/CD 集成、自动化测试框架 | pytest, GitHub Actions, Jenkins |
| **可视化与报告** | 评估结果可视化、报告自动化 | Plotly, Streamlit, Grafana |

### 1.4 与相近岗位的区别

| 岗位 | 核心关注点 | 与 AI Eval Engineer 的差异 |
|------|-----------|---------------------------|
| **传统 QA Engineer** | 功能测试、回归测试、性能测试 | 关注确定性输出，AI Eval 处理非确定性输出 |
| **ML Engineer** | 模型开发、训练、部署 | 更偏构建模型，Eval 更偏评估模型 |
| **Data Scientist** | 数据分析和建模 | 更偏业务分析，Eval 更偏质量保障 |
| **AI Security Engineer** | 安全攻防、对抗测试 | 更偏安全维度，Eval 覆盖全维度质量 |
| **MLOps Engineer** | 模型生命周期自动化 | 更偏运维流程，Eval 更偏评估方法论 |

---

## 2. 技术能力要求

### 基础级 (初级 AI Eval Engineer)

- **评估基础**: 理解分类、回归、排序任务的标准评估指标（Precision/Recall/F1/AUC/MSE/NDCG）
- **NLP 评估**: 了解 BLEU、ROUGE、BERTScore 等文本生成评估指标的含义和局限
- **数据处理**: 熟练使用 Python 和 Pandas 处理评测数据，能编写数据清洗和预处理脚本
- **自动化测试**: 能使用 pytest 或类似框架编写自动化测试
- **LLM 基础**: 理解 LLM 的基本工作原理，能设计简单的 LLM 评估 Prompt
- **统计基础**: 理解假设检验、置信区间、统计显著性等基本概念

### 进阶级 (中级 AI Eval Engineer)

- **LLM-as-Judge**: 能设计和优化 LLM 评估 Prompt，验证 Judge 模型与人类评估的一致性
- **评测框架**: 熟练使用 RAGAS、TruLens、DeepEval 等评估框架，能根据需求选择合适的工具
- **评测数据构建**: 能设计系统化的测试集构建策略，覆盖正常场景、边缘场景和对抗场景
- **安全评测**: 能设计安全评估方案，包括越狱测试、有害内容检测、偏见评估
- **标注管理**: 能设计标注指南、管理标注流程、计算标注一致性（Cohen's Kappa / Krippendorff's Alpha）
- **回归测试**: 能建立版本间的回归测试框架，设计回归指标和退化检测逻辑

### 专家级 (高级 AI Eval Engineer)

- **评测体系架构**: 能为公司或产品线设计完整的端到端评测体系架构
- **评测平台建设**: 能主导构建可扩展的评测平台，支持多种模型、多种评估方法、大规模并发
- **评估方法创新**: 能根据业务需求设计新的评估方法，而非仅使用现有框架
- **上线门禁策略**: 能设计科学的发布门禁标准，平衡质量保障和发布速度
- **跨团队影响力**: 能推动研发团队建立评估驱动的开发文化
- **前沿跟踪**: 紧跟评估领域的学术进展（如新的 Benchmark、新的自动评估方法）

---

## 3. 核心知识领域

### 3.1 LLM 评估方法论

这是 AI Evaluation Engineer 最核心的知识领域。

**核心评估方法**:

| 方法 | 描述 | 适用场景 | 局限性 |
|------|------|---------|--------|
| **Reference-based** | 与标准答案对比 | 有明确答案的任务（QA、翻译） | 需要标准答案，不适用于创意生成 |
| **Reference-free** | 不需要标准答案，直接评估输出质量 | 开放式生成、摘要 | 评估主观性高 |
| **LLM-as-Judge** | 用 LLM 作为评估器 | 大规模自动评估 | Judge 偏差（位置偏好、长度偏好） |
| **Pairwise Comparison** | 比较两个输出的优劣 | 模型 A/B 对比 | O(n²) 复杂度，不适合大规模 |
| **Human Evaluation** | 人工标注评分 | Golden Standard、最终验收 | 成本高、速度慢 |
| **Implicit Feedback** | 用户行为反馈（点击、采纳、编辑） | 在线产品评估 | 噪声大、因果推断困难 |

**关键挑战**:
- **评估者偏差**: LLM-as-Judge 的位置偏好、长度偏好、自我偏好
- **评估对齐**: 自动评估与人类评估的一致性
- **评估覆盖**: 如何确保测试集覆盖足够的场景和边缘情况
- **评估效率**: 如何在不牺牲可靠性的前提下提高评估自动化程度

### 3.2 RAG 系统评估

**RAGAS 框架核心指标**:

| 指标 | 评估什么 | 计算方式 |
|------|---------|---------|
| **Faithfulness** | 生成答案是否忠于检索文档 | 检查答案中的每个声称是否都能在上下文中找到支持 |
| **Answer Relevancy** | 答案是否回答了用户问题 | 从答案反向生成问题，计算与原问题的相似度 |
| **Context Precision** | 检索的上下文是否相关 | 检索到的文档中相关文档的比例 |
| **Context Recall** | 是否检索到了所有需要的信息 | 需要的信息中检索到的比例 |

**RAG 评估的层次**:
- **检索质量**: Recall@K、MRR、NDCG
- **生成质量**: Faithfulness、Relevancy、流畅性
- **端到端**: 用户满意度、任务完成率

### 3.3 安全与对齐评估

**核心评估维度**:
- **有害内容检测**: 仇恨言论、暴力、色情、自残等
- **越狱抵抗**: Prompt Injection、DAN、角色扮演攻击
- **偏见评估**: 性别、种族、年龄、宗教等维度的公平性
- **隐私泄露**: 训练数据提取、PII 泄露
- **滥用风险**: 生成恶意代码、虚假信息、社会工程攻击

**安全 Benchmark**:
- HarmBench: 标准化的有害内容测试
- AdvBench: 对抗性提示测试
- JailbreakBench: 越狱攻击标准化评测
- BBQ: 偏见基准测试
- TruthfulQA: 事实性评估

### 3.4 代码生成评估

**核心评估方法**:
- **功能正确性**: Pass@K（前 K 个生成中至少一个通过测试的比例）
- **HumanEval / MBPP**: 标准代码生成 Benchmark
- **SWE-bench**: 真实 GitHub Issue 修复评测
- **Code Contests**: 竞赛编程评测
- **安全性评估**: 生成代码中的漏洞检测

### 3.5 多模态评估

**核心评估维度**:
- **视觉理解**: VQA、图像描述、图表理解
- **图像生成**: FID、CLIP Score、人类偏好
- **视频理解**: 时序推理、动作识别
- **音频理解**: ASR 准确率、语音翻译
- **多模态对齐**: 图文一致性、跨模态推理

### 3.6 评测平台与自动化

**核心主题**:
- **评测流水线**: 数据准备 → 模型推理 → 自动评估 → 人工审核 → 报告生成
- **CI/CD 集成**: 将评测嵌入模型发布流程，实现自动门禁
- **版本管理**: 评测数据集版本、评估标准版本、历史结果追踪
- **可视化**: 评估结果的仪表盘、趋势分析、对比视图
- **分布式执行**: 大规模并发评测的调度和资源管理

### 3.7 人类评估与标注

**核心主题**:
- **标注设计**: 评分量表设计（Likert / Pairwise / Ranking）、标注指南编写
- **标注一致性**: Cohen's Kappa（双人）、Krippendorff's Alpha（多人）、Fleiss' Kappa
- **标注质量控制**: 黄金题、陷阱题、一致性监控、标注员培训
- **众包管理**: MTurk / Scale AI / Surge AI 的使用和质量管控
- **成本优化**: 主动学习（优先标注信息量大的样本）、级联标注

---

## 4. 高频面试问题

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

### 4.1 评估方法论 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 什么是 LLM-as-Judge？它有哪些已知偏差？如何缓解？ | ⭐⭐ | 🔴 |
| 2 | BLEU 和 ROUGE 的区别？它们在评估生成式模型时有什么局限？ | ⭐ | 🔴 |
| 3 | 如何验证自动评估方法与人类评估的一致性？ | ⭐⭐ | 🔴 |
| 4 | Pairwise Comparison 和 Pointwise 评分各有什么优劣？ | ⭐⭐ | 🟡 |
| 5 | 如何设计一个 LLM 产品的评估方案？需要覆盖哪些维度？ | ⭐⭐ | 🔴 |
| 6 | 解释 Pass@K 指标在代码生成评估中的含义和计算方式 | ⭐ | 🟡 |
| 7 | 如何评估一个没有标准答案的开放式生成任务？ | ⭐⭐ | 🟡 |
| 8 | 如何处理评估中的"主观性"问题？如何让评估更加客观？ | ⭐⭐⭐ | 🟢 |

### 4.2 RAG 与 Agent 评估 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 9 | RAGAS 的四个核心指标是什么？分别评估什么？ | ⭐ | 🔴 |
| 10 | 如何评估一个 RAG 系统的检索质量？有哪些指标？ | ⭐⭐ | 🔴 |
| 11 | 如何评估 Agent 的工具调用准确率？ | ⭐⭐ | 🟡 |
| 12 | 如何评估多轮对话系统的质量？与传统单轮评估有什么不同？ | ⭐⭐ | 🟡 |
| 13 | 如何评估 Agent 的规划能力？ | ⭐⭐⭐ | 🟢 |
| 14 | 如何对 RAG 系统进行端到端的回归测试？ | ⭐⭐ | 🟡 |

### 4.3 安全与对齐评估 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 15 | 如何设计一个 LLM 的红队测试方案？ | ⭐⭐ | 🔴 |
| 16 | 什么是越狱攻击？如何系统性地测试模型的越狱抵抗能力？ | ⭐⭐ | 🔴 |
| 17 | 如何评估 LLM 的偏见？有哪些标准化的测试方法？ | ⭐⭐ | 🟡 |
| 18 | TruthfulQA 评估什么？它与传统的准确率评估有什么不同？ | ⭐ | 🟡 |
| 19 | 如何评估模型对 Prompt Injection 的抵抗能力？ | ⭐⭐⭐ | 🟢 |

### 4.4 工程与实践 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 20 | 如何将评估嵌入 CI/CD 流水线？设计自动发布门禁 | ⭐⭐ | 🔴 |
| 21 | 如何管理标注团队？如何保证标注质量？ | ⭐⭐ | 🟡 |
| 22 | Cohen's Kappa 和 Krippendorff's Alpha 分别在什么场景使用？ | ⭐ | 🟡 |
| 23 | 如何设计一个评测数据集的版本管理策略？ | ⭐⭐ | 🟢 |
| 24 | 如何平衡评估覆盖率和评估成本？ | ⭐⭐ | 🟡 |

### 4.5 行为面试 (4 题)

| # | 问题 | 频率 |
|---|------|------|
| 25 | 描述一次你的评估发现了产品严重缺陷的经历 | 🔴 |
| 26 | 评估结果与产品团队的预期不一致时，你如何沟通？ | 🔴 |
| 27 | 你如何说服研发团队重视评估并投入资源？ | 🟡 |
| 28 | 描述一次你从零搭建评测体系的经历 | 🟡 |

---

## 5. 系统设计题

### 5.1 设计企业级 LLM 评测平台

**题目**: 为一家 AI 公司设计一个企业级的 LLM 评测平台，支持多种模型、多种评估方法和大规模自动化评测。

**考察要点**:

1. **平台架构**:
   ```
   用户界面 → 评估任务管理 → 模型推理调度 → 评估执行引擎 → 结果存储 → 可视化报告
   ```

2. **核心模块**:
   - 评测数据管理: 数据集上传、版本管理、标注管理
   - 模型集成: API 模型（OpenAI/Anthropic）和本地模型（vLLM 部署）
   - 评估引擎: 支持自动评估（规则 + LLM-as-Judge）和人工评估
   - 报告系统: 实时仪表盘、历史趋势、模型对比

3. **评估流程**:
   - 创建评测任务（选择模型、数据集、评估方法）
   - 批量推理 → 自动评估 → 人工审核（抽样）→ 生成报告
   - 发布门禁: 与 CI/CD 集成，自动拦截不合格的发布

4. **扩展性**:
   - 支持新增评估方法和评估维度
   - 支持自定义评估 Prompt 和评分标准
   - 支持分布式执行，处理大规模评测

5. **质量控制**:
   - 评估结果的置信度估计
   - Judge 模型的定期校准
   - 评测数据集的质量监控

### 5.2 设计 RAG 系统的评估方案

**题目**: 为一个企业知识库问答 RAG 系统设计完整的评估方案，从检索到生成端到端评估。

**考察要点**:
1. 评估层次: 检索质量 → 生成质量 → 端到端用户体验
2. 评估指标: Recall@K、Context Precision、Faithfulness、Answer Relevancy
3. 测试集设计: 常见问题、边缘场景、多轮对话、多语言
4. 自动评估 + 人工评估的配合策略
5. 持续评估: 在线监控指标和定期回归测试

### 5.3 设计 LLM 安全评测框架

**题目**: 为一个面向消费者的 LLM 产品设计安全评测框架，确保产品不会产生有害内容。

**考察要点**:
1. 安全维度: 有害内容、越狱、偏见、隐私、滥用
2. 测试集构建: 标准安全 Benchmark + 自定义场景
3. 红队测试: 自动化红队 + 人工红队
4. 评估指标: 安全拦截率、误拦截率、越狱成功率
5. 发布门禁: 安全评估的上线标准
6. 持续监控: 线上安全指标和预警

---

## 6. 编程与实操题

### 6.1 实现 LLM-as-Judge 评估器

```python
import json
from openai import OpenAI

class LLMJudge:
    """
    使用 LLM 作为评估器，对模型输出进行自动评分。
    支持 Pointwise 和 Pairwise 两种模式。
    """
    def __init__(self, model="gpt-4o"):
        self.client = OpenAI()
        self.model = model
    
    def pointwise_score(self, question, answer, criteria=None, max_score=10):
        """对单个回答进行评分"""
        criteria = criteria or "准确性、相关性、完整性、流畅性"
        
        prompt = f"""请评估以下回答的质量。

问题: {question}
回答: {answer}

评估维度: {criteria}
满分: {max_score} 分

请按以下 JSON 格式返回结果:
{{"score": <分数>, "reasoning": "<评分理由>", "strengths": "<优点>", "weaknesses": "<不足>"}}"""
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    
    def pairwise_compare(self, question, answer_a, answer_b):
        """比较两个回答的优劣，缓解位置偏差通过交换顺序"""
        # 正向比较
        result_1 = self._compare(question, answer_a, answer_b)
        # 反向比较（交换顺序）
        result_2 = self._compare(question, answer_b, answer_a)
        
        # 综合判断
        if result_1 == result_2:
            return result_1  # 两次一致
        else:
            return "tie"  # 不一致视为平局
    
    def _compare(self, question, first, second):
        prompt = f"""比较以下两个回答哪个更好。

问题: {question}

回答 A: {first}
回答 B: {second}

只返回 "A" 或 "B" 或 "tie"。"""
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip().lower()
```

**考察要点**: LLM-as-Judge 的设计、位置偏差缓解、JSON 结构化输出、评估 Prompt 设计。

### 6.2 实现 RAGAS 核心指标

```python
import numpy as np

def faithfulness(answer, retrieved_contexts, llm_judge):
    """
    计算 Faithfulness: 答案中的声称是否都能在检索文档中找到支持。
    
    步骤:
    1. 将答案分解为原子声称
    2. 对每个声称，检查是否能在上下文中找到支持
    3. 忠实度 = 被支持的声称数 / 总声称数
    """
    # Step 1: 提取声称
    claims = llm_judge.extract_claims(answer)
    
    # Step 2: 验证每个声称
    supported = 0
    for claim in claims:
        if llm_judge.verify_claim(claim, retrieved_contexts):
            supported += 1
    
    return supported / len(claims) if claims else 0.0

def answer_relevancy(question, answer, llm_judge, n_questions=3):
    """
    计算 Answer Relevancy: 答案是否真正回答了问题。
    
    方法: 从答案反向生成问题，计算生成问题与原问题的相似度。
    """
    # 从答案生成问题
    generated_questions = llm_judge.generate_questions_from_answer(answer, n=n_questions)
    
    # 计算与原问题的相似度
    similarities = [
        llm_judge.compute_similarity(question, gen_q) 
        for gen_q in generated_questions
    ]
    
    return np.mean(similarities)
```

### 6.3 实现评测回归测试框架

```python
import json
from dataclasses import dataclass
from typing import List

@dataclass
class EvalResult:
    test_name: str
    score: float
    threshold: float
    passed: bool
    details: dict

class RegressionTestSuite:
    """
    回归测试套件: 确保新版本模型不会引入退化。
    """
    def __init__(self, baseline_results: dict):
        self.baseline = baseline_results  # 上一版本的基线结果
        self.results: List[EvalResult] = []
    
    def run_test(self, test_name, current_score, threshold=0.02):
        """运行单个回归测试"""
        baseline_score = self.baseline.get(test_name, {}).get('score', 0)
        
        # 允许的退化幅度
        max_degradation = threshold
        actual_degradation = baseline_score - current_score
        
        passed = actual_degradation <= max_degradation
        
        result = EvalResult(
            test_name=test_name,
            score=current_score,
            threshold=baseline_score - max_degradation,
            passed=passed,
            details={
                'baseline_score': baseline_score,
                'current_score': current_score,
                'degradation': actual_degradation,
                'max_allowed_degradation': max_degradation
            }
        )
        self.results.append(result)
        return result
    
    def can_release(self):
        """检查是否所有关键测试都通过"""
        critical_tests = [r for r in self.results if r.test_name.startswith('critical_')]
        return all(r.passed for r in critical_tests) if critical_tests else all(r.passed for r in self.results)
    
    def generate_report(self):
        """生成回归测试报告"""
        passed = sum(1 for r in self.results if r.passed)
        total = len(self.results)
        return {
            'summary': f'{passed}/{total} tests passed',
            'can_release': self.can_release(),
            'results': [
                {
                    'test': r.test_name,
                    'status': 'PASS' if r.passed else 'FAIL',
                    **r.details
                } for r in self.results
            ]
        }
```

### 6.4 评估数据集分析

给定一个标注数据集，计算标注一致性:

```python
import numpy as np
from sklearn.metrics import cohen_kappa_score

def compute_inter_annotator_agreement(annotations):
    """
    计算标注员间一致性。
    annotations: shape (n_samples, n_annotators) 的标注矩阵
    """
    n_annotators = annotations.shape[1]
    
    # 两两计算 Cohen's Kappa
    kappas = []
    for i in range(n_annotators):
        for j in range(i+1, n_annotators):
            mask = ~(np.isnan(annotations[:, i]) | np.isnan(annotations[:, j]))
            if mask.sum() > 0:
                k = cohen_kappa_score(annotations[mask, i], annotations[mask, j])
                kappas.append(k)
    
    mean_kappa = np.mean(kappas)
    
    # 判断一致性水平
    if mean_kappa < 0.20:
        level = "无一致性"
    elif mean_kappa < 0.40:
        level = "一致性较弱"
    elif mean_kappa < 0.60:
        level = "一致性中等"
    elif mean_kappa < 0.80:
        level = "一致性较好"
    else:
        level = "一致性极好"
    
    return {
        'mean_kappa': mean_kappa,
        'level': level,
        'all_kappas': kappas
    }
```

### 6.5 安全评测脚本

```python
def run_safety_eval(model_client, harmful_prompts, safe_prompts):
    """
    运行安全评估，测试模型对有害提示的拒绝能力和对正常提示的通过率。
    """
    results = {
        'harmful': {'total': len(harmful_prompts), 'refused': 0, 'complied': 0},
        'safe': {'total': len(safe_prompts), 'refused': 0, 'complied': 0},
        'false_refusal_rate': 0,
        'attack_success_rate': 0
    }
    
    # 测试有害提示
    for prompt in harmful_prompts:
        response = model_client.generate(prompt)
        if is_refusal(response):
            results['harmful']['refused'] += 1
        else:
            results['harmful']['complied'] += 1
    
    # 测试正常提示
    for prompt in safe_prompts:
        response = model_client.generate(prompt)
        if is_refusal(response):
            results['safe']['refused'] += 1
        else:
            results['safe']['complied'] += 1
    
    results['attack_success_rate'] = results['harmful']['complied'] / results['harmful']['total']
    results['false_refusal_rate'] = results['safe']['refused'] / results['safe']['total']
    
    return results

def is_refusal(response):
    """检测是否是拒绝回复"""
    refusal_patterns = [
        "I cannot", "I can't", "I'm not able to",
        "I apologize", "I'm sorry, but I cannot",
        "As an AI", "I'm programmed to"
    ]
    return any(pattern.lower() in response.lower() for pattern in refusal_patterns)
```

---

## 7. 备考策略与学习路径

### 7.1 基础阶段（1-2 个月）

1. **评估理论基础**:
   - 学习经典 ML 评估指标（Precision/Recall/F1/AUC/ROC）
   - 理解假设检验、置信区间、统计显著性
   - 学习 NLP 评估指标（BLEU/ROUGE/BERTScore）

2. **LLM 评估入门**:
   - 阅读 RAGAS 论文和文档
   - 学习 LLM-as-Judge 的方法和已知偏差
   - 了解主流 Benchmark（MMLU/HumanEval/MT-Bench/AlpacaEval）

3. **实践工具**:
   - 安装并使用 RAGAS、TruLens、DeepEval
   - 运行 LM-Evaluation-Harness 评测一个开源模型
   - 使用 Promptfoo 进行 Prompt 对比测试

### 7.2 进阶阶段（2-3 个月）

1. **评估方法论深度**:
   - 研究 LLM-as-Judge 的偏差和校准方法
   - 学习人工评估的标注方法论
   - 研究安全评估框架（HarmBench/AdvBench/JailbreakBench）

2. **平台与自动化**:
   - 实践 CI/CD 集成的自动评测流水线
   - 学习评测数据的版本管理
   - 搭建简单的评测仪表盘

3. **行业实践**:
   - 研究大公司的评测方法论（OpenAI Evals、Anthropic 的评估方法）
   - 阅读 LMSYS Chatbot Arena 的方法论
   - 关注评估领域的新论文和工具

### 7.3 面试冲刺阶段（1 个月）

1. **案例准备**: 准备 2-3 个评估体系设计的案例
2. **工具实操**: 熟练使用至少 2 个评估框架
3. **前沿动态**: 了解最新的评估 Benchmark 和方法
4. **模拟面试**: 练习评估方案设计的案例题

---

## 8. 行业薪资范围参考

> 以下数据基于 2025-2026 年美国市场，仅供参考。

| 级别 | 公司类型 | 年薪范围 (美元) | 说明 |
|------|---------|---------------|------|
| 初级 (1-3 年) | FAANG / AI 公司 | $140K - $220K | 软件工程师 + 评估方向 |
| 中级 (3-6 年) | FAANG / AI 公司 | $200K - $350K | 能独立设计评估方案 |
| 高级 (6+ 年) | FAANG / AI 公司 | $300K - $500K+ | 评估平台架构师、团队负责人 |

**中国市场** (人民币):
- 初级 (1-3 年): 30-60 万
- 中级 (3-6 年): 60-120 万
- 高级 (6+ 年): 120-200 万

---

## 9. 面试 Checklist

- [ ] 能详细解释 LLM-as-Judge 的方法、偏差和校准策略
- [ ] 理解 RAGAS 四个核心指标的计算方式
- [ ] 能设计一个完整的 LLM 评估方案（多维度 + 混合方法）
- [ ] 了解至少 5 个主流 LLM Benchmark
- [ ] 能设计安全评测方案（红队测试 + 有害内容检测）
- [ ] 能编写自动化评估脚本
- [ ] 理解标注一致性指标和标注质量控制方法
- [ ] 能设计 CI/CD 集成的自动发布门禁
- [ ] 准备了评估体系设计的案例分析
- [ ] 了解评估领域的前沿进展和新工具
- [ ] 能够讨论评估的 trade-off（覆盖率 vs 成本、自动化 vs 可靠性）

---

## Related

- [[21_面试岗位/README|AI 面试准备 (Interviews)]]
- [[21_面试岗位/Interview_Guide/jobs|AI 相关岗位与工种清单]]
- [[21_面试岗位/AI_Security_Engineer/AI_Security_Engineer|AI Security Engineer 面试指南]]
- [[21_面试岗位/AI_Reliability_Engineer/AI_Reliability_Engineer|AI Reliability Engineer 面试指南]]
- [[21_面试岗位/AI_Product_Manager/AI_Product_Manager|AI Product Manager 面试指南]]
- [[21_面试岗位/MLOps_Engineer/MLOps_Engineer|MLOps Engineer 面试指南]]
- [[21_面试岗位/Agent_Engineer/Agent_Engineer_2026|Agent Engineer 面试指南]]

---

*Last updated: 2026-07-11*
