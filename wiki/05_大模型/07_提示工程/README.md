---
title: 提示词工程与结构化输出 (Prompt Engineering & Structured Output)
category: 05-nlp-llms-prompt-engineering
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: "> 提示词工程是优化 LLM 输入以获得更好输出的技术，结构化输出框架确保 LLM 返回格式正确的 JSON/类型数据。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

name_zh: "提示词工程与结构化输出"
---
# 提示词工程与结构化输出 (Prompt Engineering & Structured Output)

> 中文简称：提示词工程与结构化输出

> 提示词工程是优化 LLM 输入以获得更好输出的技术，结构化输出框架确保 LLM 返回格式正确的 JSON/类型数据。

---

## 文档导航

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [16_Prompt工程.md](./16_Prompt工程.md) | 提示词工程完整指南 | 开发者、Prompt 工程师 |
| [Prompt-Engineering-in-nutshell](./17_Prompt_工程_简明指南.md) | 提示词工程速查 | 快速入门 |
| [Prompt_Engineering_for_dummy](./16_Prompt工程.md) | 提示词工程入门 | 初学者 |

## Deep Dive 文档：结构化输出框架

| 框架 | 开发商 | 特点 | 适用场景 | 文档 |
|------|--------|------|----------|------|
| **Instructor** | Instructor | Python 原生、类型安全、Pydantic 集成 | 生产环境、结构化数据 | [Deep Dive](./10_Instructor_深入分析.md) |
| **Guidance** | Microsoft | 引导式生成、CFG 约束、模板控制 | 精确格式、复杂输出 | [Deep Dive](./06_Guidance_深入分析.md) |
| **Outlines** | Outlines | CFG 约束、高速、词表限制 | 高性能、格式严格 | [Deep Dive](./11_Outlines_深入分析.md) |
| **DSPy** | 斯坦福 | 可编程 Prompt 优化、自动调优 | 规模化、自动化 | [Deep Dive](./03_DSPy_深入分析.md) |

## 核心概念

### 提示策略光谱

```
提示策略复杂度递增:

  Zero-shot → Few-shot → Chain-of-Thought → Tree-of-Thought → Agent + Tool
    ↑            ↑              ↑                 ↑                 ↑
  无示例      给几个例子     引导逐步思考      多路径探索       自主规划执行
  最简单      效果显著       复杂推理必备      难题突破         最复杂
```

### 结构化输出对比

| 框架 | 输出模式 | 验证方式 | 速度 | 类型安全 |
|------|----------|----------|------|----------|
| **Instructor** | Pydantic 模型 | 自动校验 | 中等 | ✅ 完整 |
| **Guidance** | 模板引导 | 模板约束 | 较快 | ⚠️ 部分 |
| **Outlines** | CFG grammar | CFG 验证 | 最快 | ⚠️ 部分 |
| **DSPy** | 签名声明 | 自动优化 | 较慢 | ✅ 完整 |

## 选型指南

| 场景 | 推荐 | 原因 |
|------|------|------|
| **生产环境 Python** | Instructor | 类型安全、Pydantic 集成 |
| **精确格式控制** | Guidance | 模板语法、输出结构控制 |
| **高性能需求** | Outlines | CFG 约束、高速生成 |
| **Prompt 自动优化** | DSPy | 端到端优化、无需手工调优 |
| **快速原型** | Instructor | 上手简单、文档完善 |

## 关联目录

- [微调技术](../06_微调技术/) -- LoRA/QLoRA 微调框架
- [RAG 系统](../../14_RAG系统/) -- RAG 与提示词结合
- [Agent 框架](../../15_智能体/02_Agent框架/) -- Agent 中的提示词设计

---

*Last updated: 2026-04-26*

## Related
- [[05_大模型/07_提示工程/README|提示词工程与结构化输出 (Prompt Engineering & Structured Output)]]
- [[05_大模型/07_提示工程/06_Guidance_深入分析|Guidance: 结构化生成控制语言]]
- [[05_大模型/07_提示工程/03_DSPy_深入分析|DSPy: 可编程的 Prompt 优化框架]]
- [[05_大模型/07_提示工程/10_Instructor_深入分析|Instructor: 结构化输出框架]]

- [[05_大模型/06_微调技术/09_PEFT_2026]] — PEFT 2026 (参数高效微调) (共享: bert, gpt, llm, nlp, transformer)
- [[05_大模型/06_微调技术/README]] — 微调技术 (Fine-tuning Techniques) (共享: bert, gpt, llm, nlp, transformer)
- [[05_大模型/01_LLM基础/05_LLM_基础]] — 大语言模型基础速成指南 (共享: bert, gpt, llm, nlp, transformer)
- [[05_大模型/09_多模态模型/06_多模态_架构_2026]] — 多模态模型架构 2026：从 GPT-4V 到原生多模态 AGI (共享: bert, gpt, llm, nlp, transformer)


- [[05_大模型/README|04 自然语言处理与大模型 (NLP & LLMs)]]

## 提示技术对比

| 技术 | 复杂度 | 适用场景 | 效果提升 |
|------|------|------|------|
| Zero-shot | 低 | 简单任务 | 基线 |
| Few-shot | 低 | 格式敏感 | +10-20% |
| CoT | 中 | 推理任务 | +20-40% |
| Self-Consistency | 中 | 数学/逻辑 | +5-15% |
| ToT | 高 | 复杂规划 | +15-30% |
| ReAct | 高 | 工具调用 | 任务完成↑ |

## 学习路径

| 阶段 | 推荐文档 | 目标 |
|------|------|------|
| 入门 | Prompt_Engineering_for_dummy | 基本概念 |
| 基础 | Prompt-Engineering-in-nutshell | 核心原则 |
| 进阶 | Prompt_Engineering | 高级技术 |
| 自动化 | DSPy_Deep_Dive | 自动优化 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 提示工程会被淘汰？ | 不会，演变为上下文工程 |
| CoT 何时使用？ | 多步推理任务 |
| 如何减少幻觉？ | 提供上下文+要求引用 |
| 温度如何设置？ | 创意高、精确低 |

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 18 |
| 最后更新 | 2026-07-21 |

> 💡 提示工程是与 LLM 沟通的艺术，好的提示可以释放模型 10x 的潜能。

## 附录：提示设计模式

| 模式 | 说明 | 示例 |
|------|------|------|
| 角色设定 | 赋予专家身份 | "你是资深律师" |
| 分步指令 | 拆解复杂任务 | "第1步...第2步..." |
| 输出格式 | 约束返回结构 | "以JSON返回" |
| 思维链 | 引导逐步推理 | "让我们一步步思考" |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 上下文工程 | 从提示到全局上下文 | 范式升级 |
| 自动优化 | DSPy/APE | 减少手工 |
| 多模态提示 | 图像+文本提示 | 新场景 |
| Agent 提示 | 工具调用设计 | 复杂任务 |

## 附录：工具链

| 工具 | 用途 | 特点 |
|------|------|------|
| DSPy | 自动提示优化 | 编程式 |
| Guidance | 结构化生成 | 模板引擎 |
| Instructor | JSON 输出 | Pydantic |
| Outlines | 约束解码 | 正则/Schema |
| LangChain | 提示管理 | 链式调用 |

## 附录：评估指标

| 指标 | 说明 | 工具 |
|------|------|------|
| 任务完成率 | 正确完成任务比例 | 自定义评估 |
| 一致性 | 多次运行结果稳定 | 自一致性检查 |
| 效率 | Token 消耗与延迟 | 成本分析 |
| 安全性 | 抵抗注入攻击 | 红队测试 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 提示 | Prompt | 输入给模型的文本 |
| 系统提示 | System Prompt | 设定角色和规则 |
| 思维链 | Chain-of-Thought | 逐步推理 |
| 幻觉 | Hallucination | 生成虚假信息 |
| 注入 | Injection | 恶意提示攻击 |

## 附录：行业应用

| 场景 | 提示策略 | 关键要点 |
|------|------|------|
| 代码生成 | 明确语言+约束 | 指定框架 |
| 文案写作 | 角色+风格 | 多版本迭代 |
| 数据分析 | 结构化输入 | 要求解释 |
| 客服机器人 | 系统提示+知识库 | 安全护栏 |

## Related

- [[05_大模型/08_推理模型/index|Reasoning Models]]
- [[05_大模型/12_LLM产品/index|LLM Products]]
- [[05_大模型/index|大模型首页]]

## 附录：提示检查清单

| 步骤 | 说明 |
|------|------|
| 明确目标 | 清晰指令 |
| 提供上下文 | 背景信息 |
| 指定格式 | 输出结构 |

---
*Last updated: 2026-07-21*
