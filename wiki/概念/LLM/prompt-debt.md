---
title: "Prompt Debt (提示债)"
tags: [prompt-debt, prompt-engineering, tech-debt, context-engineering, agent-harness]
created: 2026-11-09
updated: 2026-11-09
tier: supporting
aliases:
  - "Prompt Debt"
  - "提示债"
  - "提示词债务"
category: -concepts
lifecycle: seed
review_by: 2027-02-09
relationships:
  - target: "概念/LLM/context-engineering"
    type: remediated_by
  - target: "概念/Agent/agent-harness"
    type: accumulates_in
sources:
  - "New AI and IT Buzzwords of 2026 (2026)"
name_zh: "提示债"
---

# Prompt Debt (提示债)

> 中文简称：提示债

> **一句话理解**: 提示债 = 提示词/系统指令/上下文配置随迭代累积的隐性维护负担——没人敢动那段「祖传 system prompt」，改一处全线回归；它是技术债在 LLM 工程里的翻版，2026 年随 Agent 规模化部署被正式命名。

---

## 定义

**Prompt Debt（提示债）**: 系统中提示词、系统指令、few-shot 样本、工具描述、harness 配置等「软性代码」随时间累积的负资产。特征与经典技术债同构：短期有效、长期脆性、修复成本随规模超线性增长。

## 典型形态

| 形态 | 表现 |
|------|------|
| 祖传提示 | 数千行 system prompt 无人敢改，新功能靠「再加一段」堆叠 |
| 模型漂移失配 | 底座模型升级后，为旧模型调优的提示反而劣化（过拟合旧模型的怪癖） |
| 工具描述腐化 | 工具 docstring 与实际行为脱节，agent 调用错误率上升 |
| 规则互相打架 | 不同时期加的指令相互矛盾，模型随机选边（输出不稳定） |
| 评测盲区 | 没有回归测试集，改提示 = 赌博 |

## 与技术债的对照

| 维度 | 代码技术债 | 提示债 |
|------|------|------|
| 载体 | 代码（有类型/编译器兜底） | 自然语言（无静态检查） |
| 失效方式 | 显式报错 | 静默劣化（准确率掉 3% 无人察觉） |
| 测试 | 单测/CI | 评测集（LLM-as-judge、回归基准）——多数团队没有 |
| 版本化 | Git | 提示常散落在代码/配置/后台，无版本管理 |
| 重构手段 | 重构模式成熟 | 「上下文工程」替代裸提示（2026 共识解法） |

## 治理实践（2026 共识）

1. **提示当代码**: 版本化（Git 管理）、评审制、变更必须跑回归评测集。
2. **上下文工程化**: 用检索/工具按需注入取代长静态提示——信息在「需要时」出现而非「永远」在场（见 [[概念/LLM/context-engineering|上下文工程]]）。
3. **最小指令原则**: 每条指令要能回答「删掉它会坏什么」；答不出就删。
4. **harness 层收敛**: 提示规则从散落各处收敛到 Agent Harness（[[概念/Agent/agent-harness|Agent Harness]]）统一管理 + AGENTS.md 式项目级约定。
5. **评测集先行**: 建立黄金任务回归集，提示改动 CI 化（对应本库 wiki_health/check_links 的门禁思路）。

## 2026 trend ladder 中的位置

> agentic engineering → harness engineering → context engineering → **prompt debt（反面教材）**

提示债是前三个学科被广泛采纳的**动因**：正因为提示变脆，才需要 harness 化与上下文工程化。

## 面试快问快答

1. **提示债为什么比代码债更隐蔽？** — 无编译器兜底、失效是静默的概率性劣化；没有回归评测集的团队几乎无法感知。
2. **模型升级时旧提示为什么常变负资产？** — 提示往往过拟合旧模型的指令遵循怪癖（重复强调、特殊格式技巧），新模型反而被这些「咒语」干扰。
3. **治理第一原则？** — 提示当代码：版本化 + 回归评测集 + 最小指令；再往上用上下文工程把静态提示变成动态按需注入。

## Related

- [[概念/LLM/context-engineering|Context Engineering]]
- [[概念/Agent/agent-harness|Agent Harness]]
- [[概念/Agent/deep-agents|Deep Agents]]
- [[05_大模型/07_提示工程/README|提示工程]]

---

*Last updated: 2026-11-09*
