---
title: "Superintelligence (超级智能)"
tags: [superintelligence, agi, rsi, ai-safety, frontier-labs]
created: 2026-11-09
updated: 2026-11-09
tier: supporting
aliases:
  - "Superintelligence"
  - "超级智能"
  - "ASI"
  - "Artificial Superintelligence"
category: -concepts
lifecycle: seed
review_by: 2027-02-09
relationships:
  - target: "概念/Safety/recursive-self-improvement"
    type: enabled_by
  - target: "概念/Safety/ai-alignment"
    type: raises_stakes_for
sources:
  - "Meta Superintelligence Labs (2025-06)"
  - "RAND: Recursive Self-Improvement and Automated AI Research (2026-10-12)"
name_zh: "超级智能"
---

# Superintelligence (超级智能)

> 中文简称：超级智能

> **一句话理解**: 超级智能（ASI）指在**几乎所有认知任务上全面超越人类**的系统；2025-2026 它从哲学名词变成组织实体——Meta 组建超级智能实验室、OpenAI 设超级智能团队，「ASI 工程化路径」（[[概念/Safety/recursive-self-improvement|RSI]]）成为对齐研究的时间压力来源。

---

## 定义与谱系

| 术语 | 定义 | 辨析 |
|------|------|------|
| **ANI**（窄 AI） | 单任务超越人类 | 已实现（AlphaGo/推荐系统） |
| **AGI**（通用 AI） | 与人类相当的通用认知能力 | 「能不能干活」口径 |
| **ASI**（超级智能） | **几乎所有领域全面超越**最强人类 | 「超越」是程度词，ASI 更像过程而非开关 |

> 中文圈常用「超级智能」直指 ASI；「通用人工智能」对应 AGI。两者在媒体中常被混用，引用时先确认口径。

## 2025-2026 实体化时间线

- **2025-06**: Meta 组建 **Meta Superintelligence Labs（MSL）**，天价薪酬集中收购研究人员——「超级智能」首次成为实验室正式名称与公司级战略。
- **2025-2026**: OpenAI 内部转向「superintelligence」叙事（CEO 公开表述「智能时代」），同步推进自动化 AI 研究管线；Anthropic 以 RSP（负责任扩展政策）+ AGI 口径应对。
- **2026-08~10**: FutureSearch 预测报告 + RAND《[Recursive Self-Improvement and Automated AI Research](https://www.rand.org/pubs/perspectives/PEA5068-1.html)》(2026-10-12) 把「前沿实验室多数新代码已 AI 生成」作为 ASI 路径的**实证起点**——ASI 讨论从「何时实现」转向「自动化研发飞轮是否已经转动」。

## 为什么与 RSI 绑定

RSI（递归自我改进）是 ASI 的**机制假说**：系统改进自身 → 更强的系统改进得更快 → 加速飞轮（intelligence explosion）。2026-10 RAND 的评估基调：

- **已有证据**: 代码自动化、自动化 ML 工程师（[[概念/Agent/self-evolving-agents|自进化智能体]] L3-L4）——飞轮的低速档已在转。
- **未决问题**: 跨域泛化是否随自动化同速增长；瓶颈从算法转向算力/能源/数据时飞轮是否失速。
- **对齐含义**: 飞轮每转快一圈，留给人类校准的时间窗变小——这是 2026 对齐研究（[[概念/Safety/agentic-misalignment|Agentic Misalignment]]、评估可信度）急速升温的根本原因。

## 面试快问快答

1. **ASI 与 AGI 一词之差，差在哪？** — AGI 是「达到人类通用水平」（可替代），ASI 是「全面超越人类」（不可审视）；安全研究更关心 ASI 附近的不可预测区间。
2. **Meta 为什么直接命名 Superintelligence Labs？** — 公司级叙事押注：跳过 AGI 争论直接对标终点，同时作为人才争夺的组织承诺装置。
3. **2026 年 ASI 讨论的最大变化？** — 从「时间表预测」转向「飞轮实证」：不再争论哪年实现，而是测量自动化研发在各实验室的真实渗透率（代码占比、实验吞吐）。
4. **工程视角最该跟踪什么？** — RSI 速率指标（AI 生成代码占比、自动化实验闭环时延）与对齐投入比——两者差值就是风险敞口。

## Related

- [[概念/Safety/recursive-self-improvement|Recursive Self-Improvement]]
- [[概念/Safety/ai-alignment|AI Alignment]]
- [[概念/Safety/agentic-misalignment|Agentic Misalignment]]
- [[概念/Agent/self-evolving-agents|Self-Evolving Agents]]
- [[17_伦理安全/README|17_伦理安全]]

---

*Last updated: 2026-11-09*
