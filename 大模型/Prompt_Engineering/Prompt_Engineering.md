---
title: '提示词工程 (Prompt Engineering)'
category: '05-nlp-llms-prompt-engineering'
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: '> **一句话理解**: 提示词工程就像和一个超级聪明但需要精确指令的助手沟通——你表达得越清楚、给的例子越好，它的回答就越准确。Prompt 是人类与大模型之间的"编程语言"。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Prompt Engineering"
  - Prompt_Engineering
sources: []

---
# 提示词工程 (Prompt Engineering)

> **一句话理解**: 提示词工程就像和一个超级聪明但需要精确指令的助手沟通——你表达得越清楚、给的例子越好，它的回答就越准确。Prompt 是人类与大模型之间的"编程语言"。

## 1. 概述 (Overview)

提示词工程 (Prompt Engineering) 是设计和优化输入提示词（Prompt）以引导大语言模型 (LLM) 产生期望输出的技术。它不需要修改模型参数，仅通过构造更好的输入来提升模型表现，是使用 LLM 最低成本、最高效的优化手段。

### 为什么提示词工程重要？

- **零成本优化**: 不需要训练或微调，只需调整输入文本
- **即时见效**: 修改 Prompt 后立即看到效果变化
- **通用技能**: 适用于所有 LLM（GPT-4、Claude、LLaMA、Gemini 等）
- **生产必备**: 在 RAG 系统、AI Agent、自动化工作流中，Prompt 质量直接决定系统性能

### Prompt Engineering 在 LLM 应用栈中的位置

```
用户需求
    ↓
[Prompt Engineering] ← 你在这里（最轻量级的优化层）
    ↓
[RAG / 外部知识注入]
    ↓
[微调 Fine-tuning] ← 需要训练资源
    ↓
[预训练 Pre-training] ← 需要巨量资源
```

优化顺序建议：先优化 Prompt → 不够再加 RAG → 还不行再微调。

---

## 2. 核心概念 (Core Concepts)

### 2.1 Prompt 的基本结构

一个完整的 Prompt 通常包含以下组件：

| 组件 | 说明 | 示例 |
|------|------|------|
| **系统提示 (System Prompt)** | 定义模型角色和行为准则 | "你是一位资深的Python工程师" |
| **任务指令 (Instruction)** | 明确告诉模型要做什么 | "请分析以下代码的性能瓶颈" |
| **上下文 (Context)** | 提供背景信息或参考资料 | 相关文档、数据库查询结果 |
| **示例 (Examples)** | 用输入-输出对展示期望格式 | "输入: ... 输出: ..." |
| **输入 (Input)** | 需要模型处理的实际内容 | 用户的代码片段 |
| **输出格式约束 (Format)** | 指定输出格式 | "请以JSON格式返回" |

### 2.2 提示策略分类

```
提示策略光谱 (按复杂度递增):

  Zero-shot → Few-shot → Chain-of-Thought → Tree-of-Thought → Agent + Tool
    ↑            ↑              ↑                 ↑                 ↑
  无示例      给几个例子     引导逐步思考      多路径探索       自主规划执行
  最简单      效果显著       复杂推理必备      难题突破         最复杂
```

---

## 3. 关键技术详解 (Key Techniques)

### 3.1 零样本提示 (Zero-shot Prompting)

直接给出指令，不提供任何示例。依赖模型的预训练知识。

```
Prompt: "将以下英文翻译为中文：The quick brown fox jumps over the lazy dog."
Output: "敏捷的棕色狐狸跳过了懒惰的狗。"
```

**优化技巧**:
- 使用明确的动词（"分析"、"总结"、"比较"而非"看看"、"帮忙"）
- 指定输出长度（"用 3 句话总结"）
- 定义角色（"作为一位数据科学家，请..."）

### 3.2 少样本提示 (Few-shot Prompting)

提供 2-5 个输入-输出示例，让模型"模仿"格式和逻辑。

```
Prompt:
  将产品评论分类为"正面"或"负面"。

  评论: "这个手机电池太耐用了，一天下来还有50%的电！"
  分类: 正面

  评论: "屏幕碎了两次，售后也很差。"
  分类: 负面

  评论: "拍照效果出乎意料的好，夜景模式很惊艳。"
  分类:
```

**最佳实践**:
- 示例要多样化，覆盖不同情况
- 示例顺序会影响结果（最近的示例影响力最大）
- 对于分类任务，各类别的示例数量要均衡

### 3.3 思维链提示 (Chain-of-Thought, CoT)

引导模型展示中间推理步骤，而非直接给出答案。对数学、逻辑、多步推理任务效果显著。

#### 手动 CoT（提供推理示例）

```
Prompt:
  问题: 一家商店有15个苹果。上午卖了7个，下午又进货了12个。现在有多少个苹果？
  
  让我们一步步思考：
  1. 初始数量: 15个苹果
  2. 上午卖出后: 15 - 7 = 8个
  3. 下午进货后: 8 + 12 = 20个
  
  答案: 20个苹果
  
  问题: 小明有50元。他买了3本书，每本12元，又买了一支5元的笔。他还剩多少钱？
  
  让我们一步步思考：
```

#### 零样本 CoT（魔法咒语）

只需在问题后加一句 "Let's think step by step" 即可激活推理能力：

```
Prompt: "一个房间有3扇门。每扇门后有2个房间，每个房间有4把椅子。总共有多少把椅子？
        Let's think step by step."
```

Wei et al. (2022) 的研究表明，CoT 在 GPT-3 (175B) 等大模型上效果显著，但在小模型上提升有限。

### 3.4 自我一致性 (Self-Consistency)

对同一问题多次采样（temperature > 0），取多数答案。结合 CoT 使用效果最佳。

```
采样1: 让我们思考... 答案是 42
采样2: 让我们分析... 答案是 42
采样3: 逐步计算... 答案是 38
采样4: 推理过程... 答案是 42
采样5: 分析如下... 答案是 42

最终答案: 42 (4/5 投票)
```

### 3.5 思维树 (Tree-of-Thought, ToT)

对于需要探索和回溯的复杂问题（如 24 点游戏、创意写作），ToT 允许模型在多个推理路径中搜索：

```
                    问题
                   /    \
               思路A    思路B
              / \        / \
           A1   A2    B1   B2
           ✓    ✗     ✗    ✓
          
  评估器判断每条路径的可行性，剪枝无效路径
```

### 3.6 结构化输出 (Structured Output)

引导模型输出 JSON、XML、Markdown 表格等结构化格式：

```
Prompt:
  分析以下文本中的实体，以JSON格式输出：
  
  文本: "2024年，苹果公司在加州库比蒂诺发布了Vision Pro，售价3499美元。"
  
  输出格式:
  {
    "entities": [
      {"text": "实体文本", "type": "类型", "value": "标准化值"}
    ]
  }
```

**技巧**: 提供 JSON Schema 或示例输出，让模型严格遵循格式。现代 API（如 OpenAI）支持 `response_format` 参数强制 JSON 输出。

### 3.7 系统提示词设计 (System Prompt Design)

System Prompt 是设定模型"人格"和行为边界的关键：

```
你是一位资深的后端工程师，专精于分布式系统和数据库优化。

## 行为准则
- 回答必须基于事实，如不确定请明确说明
- 给出代码建议时必须考虑生产环境的安全性和性能
- 优先推荐成熟稳定的方案，标注实验性方案的风险

## 输出要求
- 代码使用 Python 3.10+
- 数据库建议优先考虑 PostgreSQL
- 必须包含错误处理和日志记录
```

**设计原则**:
1. **角色定义**: 明确专业领域和能力范围
2. **行为约束**: 定义做什么和不做什么
3. **格式要求**: 指定输出格式和风格
4. **安全边界**: 限制敏感操作和信息泄露

---

## 4. 代码实战 (Hands-on Code)

### 4.1 使用 OpenAI API 的 Few-shot + CoT

```python
from openai import OpenAI

client = OpenAI()

def analyze_sentiment_cot(reviews: list[str]) -> list[dict]:
    """使用 Few-shot + CoT 进行情感分析"""
    
    system_prompt = """你是一位情感分析专家。对每条评论，先分析关键词和语气，
    再给出分类（正面/负面/中性）和置信度（0-1）。"""
    
    few_shot_examples = """
评论: "这款耳机音质很棒，但佩戴时间长了耳朵会疼。"
分析: "音质很棒"是正面评价，"耳朵会疼"是负面评价。正面和负面并存。
结果: {"sentiment": "中性", "confidence": 0.6, "reason": "优缺点并存"}

评论: "完全是浪费钱，质量差到令人发指。"  
分析: "浪费钱"和"质量差"都是强烈的负面表达。
结果: {"sentiment": "负面", "confidence": 0.95, "reason": "强烈不满"}
"""
    
    results = []
    for review in reviews:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{few_shot_examples}\n评论: \"{review}\"\n分析:"}
            ],
            temperature=0.1  # 低温度保证一致性
        )
        results.append({"review": review, "analysis": response.choices[0].message.content})
    
    return results
```

### 4.2 LangChain PromptTemplate 管理

```python
from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

# 定义示例
examples = [
    {"input": "什么是机器学习？", "output": "机器学习是一种让计算机从数据中自动学习模式和规律的技术，无需显式编程。"},
    {"input": "解释一下梯度下降", "output": "梯度下降是一种优化算法，通过沿着损失函数梯度的反方向迭代更新参数，逐步找到损失最小值。"},
]

# 创建示例模板
example_prompt = ChatPromptTemplate.from_messages([
    ("human", "{input}"),
    ("ai", "{output}")
])

# 创建 Few-shot 模板
few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_prompt=example_prompt,
    examples=examples,
)

# 组合完整 Prompt
final_prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位AI领域的技术讲师，擅长用简单易懂的语言解释复杂概念。回答控制在2-3句话内。"),
    few_shot_prompt,
    ("human", "{input}")
])

# 使用
# chain = final_prompt | llm
# result = chain.invoke({"input": "什么是Transformer？"})
```

---

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 Prompt Engineering 在不同场景的应用

| 应用场景 | 推荐策略 | 关键要点 |
|---------|---------|---------|
| **文本分类** | Few-shot | 每个类别 2-3 个示例，注意示例平衡 |
| **数学/逻辑推理** | CoT + Self-Consistency | 必须引导逐步推理，多次采样投票 |
| **代码生成** | System Prompt + 结构化输出 | 明确语言/框架/风格要求 |
| **信息提取** | Few-shot + JSON Schema | 提供目标格式的 JSON 示例 |
| **创意写作** | Role-playing + 约束条件 | 设定角色、风格、长度约束 |
| **RAG 问答** | Context Injection + 指令 | 明确指示"仅基于以下内容回答" |
| **AI Agent** | ReAct + Tool Description | 定义工具接口和使用时机 |

### 5.2 常见反模式 (Anti-patterns)

| 反模式 | 问题 | 改进 |
|--------|------|------|
| "帮我写个好文章" | 过于模糊，无法执行 | "写一篇 800 字的技术博客，主题是..." |
| 一次塞入过多任务 | 模型容易遗漏部分指令 | 拆分为多个独立的 Prompt |
| 负面指令 "不要做 X" | 模型对否定指令理解差 | 改为正面指令 "请做 Y" |
| 无格式约束 | 输出格式不稳定 | 明确指定 "以 JSON 格式输出" |

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 Prompt 优化与自动搜索

- **DSPy**: 将 Prompt 工程转化为可编程的优化问题，自动搜索最优 Prompt
- **OPRO (Optimization by Prompting)**: 用 LLM 优化自身的 Prompt
- **PromptBench**: Prompt 鲁棒性评估基准

### 6.2 安全提示词设计

在生产环境中，必须防范提示词注入 (Prompt Injection) 攻击：

```
防御策略:
1. 输入净化: 过滤特殊标记（如 "忽略以上指令"）
2. 输出验证: 检查输出是否符合预期格式
3. 分层隔离: System Prompt 与用户输入严格分离
4. 权限最小化: 限制模型可调用的工具和访问的数据
```

→ 详见 [AI 安全与红队](../../伦理安全/AI_Safety_RedTeaming/AI_Safety_RedTeaming.md)

### 6.3 多模态 Prompt

随着 GPT-4V、Gemini 等多模态模型的出现，Prompt 不再局限于文本：

- **图文混合 Prompt**: "请描述这张图片中的物体" + [图片]
- **视觉 CoT**: 在图片上标注推理步骤
- **音频 Prompt**: 语音指令 + 上下文

### 6.4 Prompt Caching 与成本优化

- **Prefix Caching**: 缓存共享的 System Prompt 前缀，减少 API 成本
- **Prompt 压缩**: 使用 LLMLingua 等工具压缩长 Prompt，减少 Token 消耗
- **批量处理**: 将多个请求合并为一个批次，利用 API 的 batch 定价

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- [序列模型](../Sequence_Models/Sequence_Models.md) — 理解语言模型的序列处理基础
- [Transformer 革命](../Transformer_Revolution/Transformer_Revolution.md) — LLM 的底层架构
- [大语言模型架构](../LLM_Architectures/LLM_Architectures.md) — 理解不同 LLM 的能力边界

### 进阶方向
- [微调技术](../Fine_tuning_Techniques/Fine_tuning_Techniques.md) — Prompt 优化不够时的下一步
- [RAG 系统](../../RAG系统/RAG_Systems.md) — Prompt 与检索增强的结合
- [AI 智能体](../../Agent/Agent_Foundations/AI_Agents.md) — Prompt 在 Agent 系统中的核心作用
- [AI 安全与红队](../../伦理安全/AI_Safety_RedTeaming/AI_Safety_RedTeaming.md) — Prompt 注入防御

---

## 8. 面试高频问题 (Interview FAQs)

**Q1: Zero-shot、Few-shot 和 CoT 分别适用于什么场景？**
> Zero-shot 适用于简单、定义明确的任务（翻译、摘要）。Few-shot 适用于需要示范格式和逻辑的任务（分类、信息提取）。CoT 适用于需要多步推理的任务（数学计算、逻辑推理），研究表明在 100B+ 参数的大模型上效果最为显著。

**Q2: 如何评估 Prompt 的质量？**
> 定量评估：准备测试集，计算准确率/F1/BLEU 等指标。定性评估：检查输出的一致性、相关性和格式规范性。鲁棒性评估：测试输入的微小变化是否导致输出剧烈波动。成本评估：Token 消耗量和 API 调用次数。

**Q3: 什么是 Prompt Injection？如何防御？**
> Prompt Injection 是攻击者通过精心构造的输入覆盖系统指令，让模型执行非预期操作。防御方法包括：(1) 输入清洗——过滤危险关键词；(2) 分层设计——System Prompt 与用户输入隔离；(3) 输出验证——检查响应是否符合预期范围；(4) 使用 Guardrails 框架（如 NeMo Guardrails）。

**Q4: 如何处理 Prompt 过长导致的 Token 限制问题？**
> 方案：(1) 摘要压缩——用 LLM 先压缩长文档再处理；(2) 分段处理——MapReduce 模式分段处理后合并；(3) RAG——只检索最相关的片段注入 Prompt；(4) 使用长上下文模型（如 Claude 200K、Gemini 1M）。

**Q5: Chain-of-Thought 为什么有效？在小模型上也有效吗？**
> CoT 有效的原因是它将复杂推理分解为多个简单步骤，每一步的推理难度降低。但研究表明 CoT 在小模型（<10B 参数）上效果有限甚至可能有害，因为小模型可能在中间步骤产生错误推理，导致"错误传播"。建议仅在 GPT-3.5 级别以上的模型使用 CoT。

---

## 9. 参考资源 (References)

### 经典论文
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (Wei et al., 2022)](https://arxiv.org/abs/2201.11903) — CoT 原始论文
- [Tree of Thoughts: Deliberate Problem Solving with LLMs (Yao et al., 2023)](https://arxiv.org/abs/2305.10601) — ToT 论文
- [Self-Consistency Improves Chain of Thought Reasoning (Wang et al., 2022)](https://arxiv.org/abs/2203.11171) — 自一致性采样
- [Large Language Models are Zero-Shot Reasoners (Kojima et al., 2022)](https://arxiv.org/abs/2205.11916) — "Let's think step by step" 的发现

### 实用指南
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering) — OpenAI 官方指南
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Claude Prompt 最佳实践
- [Prompt Engineering Guide (DAIR.AI)](https://www.promptingguide.ai/) — 社区维护的全面指南

### 工具与框架
- [LangChain](https://python.langchain.com/docs/_concepts/prompt_templates/) — Prompt 模板管理
- [DSPy](https://github.com/stanfordnlp/dspy) — 可编程的 Prompt 优化框架
- [Guardrails AI](https://www.guardrailsai.com/) — Prompt 输出验证框架
- [Instructor](./Instructor_Deep_Dive.md) — Python 原生结构化输出
- [Guidance](./Guidance_Deep_Dive.md) — 微软引导式生成控制
- [Outlines](./Outlines_Deep_Dive.md) — CFG 约束的结构化输出

### Vibe Coding 中的提示工程

提示工程在 **Vibe Coding**（自然语言驱动开发）中有了全新的应用场景——不只是和聊天机器人对话，而是直接驱动代码生成。关键差异：

| 维度 | 传统提示工程 | Vibe Coding 提示工程 |
|------|------------|---------------------|
| **目标** | 获取好的回答 | 生成可运行的代码 |
| **上下文** | 单次对话 | 项目级规则文件 (.cursorrules) |
| **验证** | 人工判断 | 自动化测试 + 类型检查 |
| **迭代** | 改写提示 | DGRV 循环 (描述→生成→审查→验证) |
| **结构** | System + User + Examples | STAR 结构 (情境+任务+架构+要求) |

详细内容请参阅 [Vibe Coding 方法论](../../AI编程/Methodology/Vibe_Coding_Methodology.md) 中的"提示工程体系"章节。

---
*Last updated: 2026-04-11*

## Related

- [[大模型/Prompt_Engineering/DSPy_Deep_Dive.md|DSPy_Deep_Dive]]
