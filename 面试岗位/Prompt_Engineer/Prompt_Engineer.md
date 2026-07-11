---
title: "Prompt Engineer 面试指南"
category: "21-interviews-prompt-engineer"
tags: ["interviews", "career", "experience", "practitioners", "prompt-engineering", "llm", "chain-of-thought", "rag", "few-shot", "structured-output"]
summary: "Prompt Engineer 面试全流程指南，覆盖 Prompt 设计方法论、CoT/Few-shot/Self-Consistency、结构化输出、RAG Prompt、安全防护、评估优化和 Prompt 管理平台。适用于 OpenAI、Anthropic、Google 及各类 AI 原生公司的 Prompt Engineering 岗位。"
created: 2026-05-31
updated: 2026-07-11
tier: supporting
aliases:
  - "Prompt_Engineer"
  - "Prompt Engineer 面试指南"
  - "Prompt_Engineer Interview Guide"
  - "AI Prompt Engineer"
sources: []
---

# Prompt Engineer 面试指南

> **一句话理解**: Prompt Engineer 是 LLM 能力的驾驭者——通过精确的语言设计、系统化的测试和持续的优化，将 LLM 的通用能力转化为可靠解决特定业务问题的生产力工具，在模型能力边界内榨取最大价值。

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

Prompt Engineer（提示词工程师）是随着生成式 AI 的爆发而诞生的新兴专业岗位。虽然"Prompt Engineering"听起来像是"写几句话让 AI 做事"，但专业的 Prompt Engineering 是一项高度系统化的工程实践：

- **精确性**: Prompt 中一个词的变化可能导致输出质量的巨大差异
- **可复现性**: 好的 Prompt 需要在各种输入下都能稳定产出高质量结果
- **可评估**: 需要量化 Prompt 的效果，而非凭感觉判断"好不好"
- **可维护**: Prompt 作为产品资产需要版本管理、测试和文档化
- **安全意识**: 需要考虑 Prompt Injection、有害输出等安全风险

Prompt Engineer 的核心使命是**通过系统化的 Prompt 设计和优化，最大化 LLM 在特定业务场景中的表现**，同时保证输出的可靠性、一致性和安全性。

典型工作场景：
- 为客服 AI 设计多轮对话的 System Prompt 和回复策略
- 为文档分析系统设计信息提取的 Prompt 模板
- 为创意写作工具设计风格控制的 Prompt
- 为代码生成工具设计代码补全的 Prompt
- 为 RAG 系统设计查询改写和答案生成的 Prompt
- 为 Agent 设计推理和工具调用的 Prompt

### 1.2 核心职责

| 职责领域 | 具体内容 | 交付物 |
|---------|---------|--------|
| **Prompt 设计** | 为特定业务场景设计高质量的 Prompt 模板 | Prompt 库、模板文档 |
| **测试与评估** | 构建测试数据集，量化 Prompt 效果 | 评估报告、测试集 |
| **迭代优化** | 基于评估结果持续优化 Prompt | 优化记录、版本历史 |
| **A/B 测试** | 设计和执行 Prompt 的 A/B 测试 | 实验报告 |
| **Prompt 管理** | 建立 Prompt 版本管理系统 | Prompt 管理平台 |
| **安全设计** | 设计安全防护相关的 Prompt 策略 | 安全策略、护栏 Prompt |
| **跨团队协作** | 与产品、工程、数据团队协作 | 协作文档 |
| **知识传播** | 在团队内推广 Prompt Engineering 最佳实践 | 培训材料、指南 |

### 1.3 核心技能栈

| 维度 | 关键技能 | 说明 |
|------|---------|------|
| **LLM 深度理解** | 模型能力边界、行为模式、幻觉机理 | 理解"模型在想什么" |
| **Prompt 技术** | CoT, Few-shot, Self-Consistency, ToT, ReAct | 系统化的 Prompt 策略 |
| **结构化输出** | JSON/XML 模式、Function Calling、Schema | 让 LLM 输出可靠的结构化数据 |
| **RAG 设计** | 查询改写、上下文管理、检索-生成 Prompt | RAG 场景的 Prompt 优化 |
| **评估方法** | 自动评估、人工评估、LLM-as-Judge | 量化 Prompt 效果 |
| **编程能力** | Python, API 调用, 批量测试 | 自动化 Prompt 测试 |
| **安全意识** | Prompt Injection 防御、有害内容控制 | 安全 Prompt 设计 |
| **产品思维** | 用户体验、业务需求映射 | 从业务需求到 Prompt |

### 1.4 与相近岗位的区别

| 岗位 | 核心关注点 | 与 Prompt Engineer 的差异 |
|------|-----------|--------------------------|
| **ML Engineer** | 模型训练和部署 | 更偏底层模型，Prompt Engineer 不训练模型 |
| **AI Product Manager** | 产品策略和用户价值 | 更偏产品决策，Prompt Engineer 更偏技术实现 |
| **Agent Engineer** | Agent 系统设计和开发 | 范围更广，Prompt Engineer 是 Agent 的一部分 |
| **NLP Engineer** | NLP 模型和算法 | 更偏传统 NLP，Prompt Engineer 利用 LLM |
| **AI Evaluation Engineer** | 评估方法论和平台 | 更偏评估体系，Prompt Engineer 更偏优化 Prompt |

---

## 2. 技术能力要求

### 基础级 (初级 Prompt Engineer)

- **LLM 基础**: 理解 LLM 的工作原理（预训练、Token、上下文窗口、温度参数）
- **Prompt 基础**: 掌握基本的 Prompt 技巧（清晰指令、角色设定、输出格式约束）
- **Few-shot**: 理解 Few-shot Learning 的概念，能设计有效的示例
- **编程基础**: 能使用 Python 调用 LLM API 进行批量测试
- **评估意识**: 理解需要量化评估 Prompt 效果，而非凭感觉
- **安全意识**: 了解 Prompt Injection 等基本安全风险

### 进阶级 (中级 Prompt Engineer)

- **高级技术**: 熟练运用 CoT、Self-Consistency、Tree-of-Thoughts、ReAct 等技术
- **结构化输出**: 能设计可靠的结构化输出方案（JSON Schema、Function Calling）
- **RAG 优化**: 能优化 RAG 系统的查询改写和答案生成 Prompt
- **评估设计**: 能设计系统化的 Prompt 评估方案（测试集 + 自动评估）
- **多模型适配**: 能为不同模型（GPT-4o、Claude、Gemini、Llama）调整 Prompt 策略
- **Prompt 管理**: 能建立 Prompt 版本管理和 CI/CD 流程

### 专家级 (高级 Prompt Engineer)

- **Prompt 架构**: 能设计复杂的多步骤 Prompt 系统（Agent Prompt、Multi-Agent）
- **性能极致**: 能通过 Prompt 优化显著降低成本和延迟（Token 优化、模型路由）
- **前沿研究**: 跟踪 Prompt Engineering 前沿论文和技术
- **组织影响力**: 在组织内建立 Prompt Engineering 标准和最佳实践
- **跨领域应用**: 能将 Prompt 技术应用于多个垂直领域

---

## 3. 核心知识领域

### 3.1 Prompt 设计原则

**核心原则**:
- **明确性（Clarity）**: 指令清晰、无歧义，明确期望的输出
- **具体性（Specificity）**: 提供足够的上下文和约束，避免模糊
- **结构性（Structure）**: 使用结构化的格式（列表、标签、分隔符）
- **示例驱动（Example-driven）**: 通过 Few-shot 示例展示期望行为
- **分步引导（Step-by-step）**: 将复杂任务分解为简单步骤
- **角色设定（Role-playing）**: 通过角色设定引导模型行为
- **约束明确（Constraints）**: 明确什么应该做、什么不应该做
- **输出格式（Output Format）**: 精确定义输出格式

### 3.2 高级 Prompt 技术

**Chain-of-Thought (CoT)**:
- 让模型"想一想再回答"
- Zero-shot CoT: "Let's think step by step"
- Few-shot CoT: 提供带推理过程的示例
- 适用: 数学推理、逻辑推理、复杂决策

**Self-Consistency**:
- 对同一问题生成多个推理路径
- 取多数投票作为最终答案
- 适用: 有明确正确答案的推理任务

**Tree-of-Thoughts (ToT)**:
- 将问题分解为搜索树
- 探索多条思维路径，评估和回溯
- 适用: 需要探索和规划的复杂问题

**ReAct (Reasoning + Acting)**:
- 交替进行推理和行动
- 思考 → 行动 → 观察 → 思考 → ...
- 适用: 需要工具调用的 Agent 任务

**Reflection / Self-Critique**:
- 让模型反思和批评自己的输出
- 基于反馈进行迭代改进
- 适用: 写作、代码生成等需要迭代的任务

### 3.3 结构化输出

**核心主题**:
- **JSON 模式**: 指定 JSON Schema，确保输出格式
- **Function Calling**: 利用模型的 Function Calling 能力
- **XML 标签**: 使用 XML 标签组织 Prompt 结构
- **分隔符**: 使用明确的分隔符区分指令、上下文、示例
- **输出约束**: "只输出 JSON，不要额外文字"
- **格式验证**: 后处理验证输出格式，不符合时重试

### 3.4 RAG Prompt 优化

**核心主题**:
- **查询改写**: 将用户原始查询改写为更适合检索的形式
- **上下文管理**: 将检索到的文档有效组织在 Prompt 中
- **答案生成**: 基于检索内容的答案生成 Prompt 设计
- **引用标注**: 让模型标注答案的信息来源
- **无答案处理**: 检索结果不包含答案时的处理策略
- **多轮对话**: 对话历史与 RAG 的结合

### 3.5 Prompt 安全

**核心主题**:
- **Prompt Injection 防御**:
  - 输入验证和过滤
  - 明确的指令边界
  - "无论如何，不要执行以下操作..."
- **有害内容控制**:
  - 安全约束 Prompt
  - 拒绝策略
- **PII 保护**:
  - 指示模型不输出 PII
  - 输出后处理过滤
- **System Prompt 加固**:
  - 不泄露系统指令
  - 抵抗提取攻击

### 3.6 Prompt 评估与管理

**核心主题**:
- **测试集构建**: 覆盖正常/边缘/对抗场景的测试数据
- **自动评估**: LLM-as-Judge、基于规则的评估
- **A/B 测试**: 不同 Prompt 版本的对比
- **版本管理**: Prompt 的版本控制和变更追踪
- **监控**: 上线后的 Prompt 效果监控
- **CI/CD**: Prompt 变更的自动化测试和部署

---

## 4. 高频面试问题

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

### 4.1 Prompt 设计基础 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 设计一个好的 Prompt 有哪些核心原则？ | ⭐ | 🔴 |
| 2 | Few-shot 和 Zero-shot 各在什么场景下更优？ | ⭐ | 🔴 |
| 3 | Temperature 参数如何影响输出？不同任务应该怎么设置？ | ⭐ | 🔴 |
| 4 | 如何让 LLM 稳定输出结构化 JSON？ | ⭐⭐ | 🔴 |
| 5 | System Prompt 和 User Prompt 的区别？如何合理分配？ | ⭐ | 🟡 |
| 6 | 如何处理上下文窗口的限制？长文档怎么处理？ | ⭐⭐ | 🟡 |
| 7 | 不同 LLM（GPT-4o / Claude / Gemini）的 Prompt 风格有什么差异？ | ⭐⭐ | 🟡 |

### 4.2 高级 Prompt 技术 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 8 | 解释 Chain-of-Thought (CoT) 的原理和适用场景 | ⭐ | 🔴 |
| 9 | Self-Consistency 如何提升推理准确性？它的代价是什么？ | ⭐⭐ | 🟡 |
| 10 | ReAct 模式是什么？它如何与工具调用结合？ | ⭐⭐ | 🔴 |
| 11 | 如何设计一个 Reflection/Self-Critique 的 Prompt 流程？ | ⭐⭐ | 🟡 |
| 12 | Tree-of-Thoughts 和 CoT 的区别是什么？ | ⭐⭐⭐ | 🟢 |
| 13 | 如何用 Prompt 实现一个简单的多步推理系统？ | ⭐⭐ | 🟡 |
| 14 | 如何在 Prompt 中有效使用 Few-shot 示例？示例的顺序和数量有什么影响？ | ⭐⭐ | 🟡 |

### 4.3 RAG 与应用场景 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 15 | 如何设计 RAG 系统的答案生成 Prompt？ | ⭐⭐ | 🔴 |
| 16 | 如何设计查询改写 Prompt 来提升检索效果？ | ⭐⭐ | 🟡 |
| 17 | 当检索到的上下文不包含答案时，Prompt 应该如何处理？ | ⭐⭐ | 🟡 |
| 18 | 如何设计一个代码生成的 Prompt 系统？ | ⭐⭐ | 🟢 |
| 19 | 如何设计一个创意写作的 Prompt？如何控制风格？ | ⭐ | 🟢 |

### 4.4 评估与优化 (4 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 20 | 你如何系统化地评估一个 Prompt 的效果？ | ⭐⭐ | 🔴 |
| 21 | 如何建立 Prompt 的版本管理和 CI/CD？ | ⭐⭐ | 🟡 |
| 22 | 如何在 Prompt 层面优化 Token 成本？ | ⭐⭐ | 🟡 |
| 23 | Prompt A/B 测试应该怎么设计？ | ⭐⭐ | 🟡 |

### 4.5 安全与行为面试 (4 题)

| # | 问题 | 频率 |
|---|------|------|
| 24 | 如何在 Prompt 层面防御 Prompt Injection？ | 🔴 |
| 25 | 描述一个你通过 Prompt 优化显著提升了产品效果的案例 | 🔴 |
| 26 | 你的 Prompt 效果好但工程团队认为太复杂，你如何沟通？ | 🟡 |
| 27 | 模型升级后你的 Prompt 效果下降了，你如何排查和修复？ | 🟡 |

---

## 5. 系统设计题

### 5.1 设计一个客服 AI 的 Prompt 系统

**题目**: 为一个电商客服 AI 设计完整的 Prompt 系统，处理退换货、物流查询、产品咨询等场景。

**考察要点**:

1. **System Prompt 设计**:
   - 角色定义: 专业的电商客服
   - 行为规范: 礼貌、准确、高效
   - 安全边界: 不做价格承诺、不泄露内部信息
   - 输出格式: 回复长度、语气、结构

2. **意图路由**:
   - 通过 Prompt 识别用户意图
   - 不同意图使用不同的处理 Prompt

3. **RAG 集成**:
   - 产品信息检索
   - 订单信息查询
   - 政策文档检索

4. **多轮对话管理**:
   - 对话历史压缩
   - 上下文窗口管理
   - 状态跟踪

5. **安全与兜底**:
   - Prompt Injection 防御
   - 转人工逻辑
   - 不确定时的回复策略

### 5.2 设计一个文档分析 Prompt 系统

**考察要点**:
1. 文档类型识别和分类
2. 信息提取 Prompt（实体、关系、摘要）
3. 多文档对比分析
4. 引用和溯源
5. 格式化输出

### 5.3 设计一个多步骤推理 Prompt 系统

**考察要点**:
1. 问题分解策略
2. CoT 链设计
3. 中间结果验证
4. 错误恢复
5. 最终答案合成

---

## 6. 编程与实操题

### 6.1 设计 Few-shot Prompt 模板

```python
class FewShotPrompt:
    """Few-shot Prompt 模板生成器。"""
    
    def __init__(self, task_description, output_format):
        self.task = task_description
        self.format = output_format
        self.examples = []
    
    def add_example(self, input_text, output_text):
        """添加 Few-shot 示例"""
        self.examples.append({"input": input_text, "output": output_text})
    
    def build(self, query):
        """构建完整 Prompt"""
        prompt = f"任务: {self.task}\n\n"
        
        if self.examples:
            prompt += "示例:\n\n"
            for i, ex in enumerate(self.examples, 1):
                prompt += f"输入: {ex['input']}\n"
                prompt += f"输出: {ex['output']}\n\n"
        
        prompt += f"输出格式: {self.format}\n\n"
        prompt += f"输入: {query}\n"
        prompt += "输出: "
        
        return prompt
```

### 6.2 实现结构化 JSON 输出

```python
import json
from pydantic import BaseModel
from openai import OpenAI

class EntityExtraction(BaseModel):
    name: str
    type: str
    attributes: dict

def extract_entities(text, client):
    """使用 Function Calling 提取实体，确保结构化输出。"""
    
    prompt = f"""从以下文本中提取实体信息。

文本: {text}

提取所有提到的实体（人名、组织、地点、产品等）。"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        functions=[{
            "name": "save_entities",
            "description": "保存提取的实体",
            "parameters": {
                "type": "object",
                "properties": {
                    "entities": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "type": {"type": "string"},
                                "attributes": {"type": "object"}
                            }
                        }
                    }
                }
            }
        }],
        function_call={"name": "save_entities"}
    )
    
    return json.loads(response.choices[0].message.function_call.arguments)
```

### 6.3 实现 CoT 推理 Pipeline

```python
class CoTPipeline:
    """Chain-of-Thought 推理 Pipeline。"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
    
    def solve(self, question, max_steps=5):
        """使用 CoT 解决复杂问题。"""
        
        # Step 1: 问题分解
        decomposition = self.llm.generate(f"""将以下问题分解为子问题:
问题: {question}
请列出解决步骤:""")
        
        # Step 2: 逐步推理
        reasoning = self.llm.generate(f"""问题: {question}

解题步骤:
{decomposition}

让我们逐步思考:
""")
        
        # Step 3: 给出最终答案
        answer = self.llm.generate(f"""问题: {question}

推理过程:
{reasoning}

基于以上推理，最终答案是:""")
        
        return {
            'question': question,
            'steps': decomposition,
            'reasoning': reasoning,
            'answer': answer
        }
    
    def solve_with_self_consistency(self, question, n=5):
        """Self-Consistency: 生成多个推理路径，取多数票。"""
        answers = []
        for _ in range(n):
            result = self.solve(question)
            answers.append(result['answer'])
        
        # 多数投票
        from collections import Counter
        vote = Counter(answers).most_common(1)[0]
        return {
            'answer': vote[0],
            'confidence': vote[1] / n,
            'all_answers': answers
        }
```

### 6.4 实现 Prompt A/B 测试

```python
import asyncio
from dataclasses import dataclass

@dataclass
class PromptTestResult:
    prompt_version: str
    test_case: str
    response: str
    score: float  # 0-1
    passed: bool

class PromptABTester:
    """Prompt A/B 测试框架。"""
    
    def __init__(self, llm_client, judge_client):
        self.llm = llm_client
        self.judge = judge_client
    
    async def run_test(self, prompt_a, prompt_b, test_cases, criteria):
        """对比两个 Prompt 版本。"""
        results_a = await self._run_version("A", prompt_a, test_cases, criteria)
        results_b = await self._run_version("B", prompt_b, test_cases, criteria)
        
        return {
            'version_a': self._summarize(results_a),
            'version_b': self._summarize(results_b),
            'winner': 'A' if self._avg(results_a) > self._avg(results_b) else 'B'
        }
    
    async def _run_version(self, version, prompt_template, test_cases, criteria):
        results = []
        for tc in test_cases:
            prompt = prompt_template.format(input=tc['input'])
            response = await self.llm.generate(prompt)
            score = await self._evaluate(response, tc, criteria)
            results.append(PromptTestResult(version, tc['input'], response, score, score > 0.7))
        return results
    
    async def _evaluate(self, response, test_case, criteria):
        judge_prompt = f"""评估以下回复的质量。

输入: {test_case['input']}
回复: {response}
参考答案: {test_case.get('expected', 'N/A')}
评估标准: {criteria}

评分 (0-1):"""
        result = await self.judge.generate(judge_prompt)
        try:
            return float(result.strip())
        except:
            return 0.5
```

### 6.5 Prompt 安全检测

```python
class PromptSecurityChecker:
    """检查 Prompt 和输出中的安全风险。"""
    
    INJECTION_PATTERNS = [
        "ignore previous instructions",
        "you are now",
        "system:",
        "<|im_start|>",
        "reveal your system prompt",
    ]
    
    PII_PATTERNS = [
        r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
        r'\b\d{16}\b',  # Credit card
        r'\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b',  # Email
    ]
    
    def check_input(self, user_input: str) -> dict:
        """检查用户输入是否包含注入攻击"""
        risks = []
        for pattern in self.INJECTION_PATTERNS:
            if pattern.lower() in user_input.lower():
                risks.append(f"检测到注入模式: {pattern}")
        return {'safe': len(risks) == 0, 'risks': risks}
    
    def check_output(self, output: str) -> dict:
        """检查模型输出是否包含敏感信息"""
        import re
        risks = []
        for pattern in self.PII_PATTERNS:
            matches = re.findall(pattern, output, re.IGNORECASE)
            if matches:
                risks.append(f"检测到 PII: {len(matches)} 处")
        return {'safe': len(risks) == 0, 'risks': risks}
```

---

## 7. 备考策略与学习路径

### 7.1 基础阶段（1-2 个月）

1. **LLM 基础**:
   - 理解 Transformer、Token、上下文窗口、温度
   - 学习 OpenAI / Anthropic / Google 的 API 使用
   - 完成官方的 Prompt Engineering 教程

2. **Prompt 技术**:
   - 学习 CoT、Few-shot、Self-Consistency
   - 阅读关键论文（CoT、ToT、ReAct、Self-Consistency）
   - 实践不同的 Prompt 策略，对比效果

3. **实践项目**:
   - 为一个实际场景设计 Prompt 系统
   - 构建测试集和评估方案
   - 实践结构化输出和 RAG Prompt

### 7.2 进阶阶段（2-3 个月）

1. **高级技术**:
   - 深入研究 ReAct、Reflection、Multi-Agent Prompt
   - 学习 Function Calling / Tool Use 的 Prompt 设计
   - 实践 Prompt 安全防护

2. **评估与管理**:
   - 建立 Prompt 评估框架
   - 实践 Prompt A/B 测试
   - 学习 Prompt 版本管理

3. **跨模型适配**:
   - 对比不同模型对同一 Prompt 的响应差异
   - 学习针对特定模型的 Prompt 优化技巧

### 7.3 面试冲刺阶段（1 个月）

1. **Prompt 作品集**: 准备 3-5 个不同场景的 Prompt 系统案例
2. **评估数据**: 为每个案例准备量化的效果数据
3. **现场 Prompt**: 练习在面试中现场设计和优化 Prompt
4. **前沿跟踪**: 了解最新的 Prompt Engineering 研究

---

## 8. 行业薪资范围参考

> 以下数据基于 2025-2026 年市场信息，仅供参考。

| 级别 | 公司类型 | 年薪范围 (美元) | 说明 |
|------|---------|---------------|------|
| 初级 (0-2 年) | AI 原生公司 | $100K - $160K | 新兴岗位，入门门槛相对灵活 |
| 中级 (2-4 年) | AI 原生公司 | $140K - $230K | 有实际产品经验 |
| 高级 (4+ 年) | 顶级 AI 公司 | $200K - $350K | 资深 Prompt Engineer / Lead |
| 所有级别 | FAANG | $150K - $300K | 通常与其他工程岗合并 |

**说明**: 纯 Prompt Engineer 岗位正在演变——许多公司将其合并到 AI Engineer 或 Product Engineer 中。但 Prompt Engineering 作为核心技能，在所有 AI 相关岗位中都有价值。

**中国市场** (人民币):
- 初级: 20-40 万
- 中级: 40-80 万
- 高级: 80-150 万

---

## 9. 面试 Checklist

- [ ] 能解释 CoT、Few-shot、Self-Consistency 的原理和适用场景
- [ ] 能设计可靠的结构化 JSON 输出方案
- [ ] 能为 RAG 系统设计查询改写和答案生成 Prompt
- [ ] 能设计 Prompt A/B 测试方案
- [ ] 理解不同模型（GPT-4o/Claude/Gemini）的 Prompt 差异
- [ ] 能设计安全的 System Prompt（防注入、防泄露）
- [ ] 能实现 Prompt 的批量测试和自动化评估
- [ ] 准备了 3+ 个不同场景的 Prompt 系统案例
- [ ] 能现场设计 Prompt 并解释设计决策
- [ ] 了解 Prompt 管理和 CI/CD
- [ ] 能讨论 Prompt 优化的 trade-off（质量 vs 成本 vs 延迟）
- [ ] 了解 Prompt Engineering 的前沿研究

---

## Related

- [[面试岗位/README|AI 面试准备 (Interviews)]]
- [[面试岗位/jobs|AI 相关岗位与工种清单]]
- [[面试岗位/Agent_Engineer/Agent_Engineer_2026|Agent Engineer 面试指南]]
- [[面试岗位/AI_Product_Manager/AI_Product_Manager|AI Product Manager 面试指南]]
- [[面试岗位/AI_Evaluation_Engineer/AI_Evaluation_Engineer|AI Evaluation Engineer 面试指南]]
- [[面试岗位/Applied_Scientist/Applied_Scientist|Applied Scientist 面试指南]]

---

*Last updated: 2026-07-11*
