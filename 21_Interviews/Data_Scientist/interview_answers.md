---
title: Data Scientist 面试题实例答案
category: 21-interviews-data-scientist
tags: ["interviews", "career", "experience", "practitioners"]
summary: "**答**：相关性反映变量共同变化，不代表因果。要建立因果关系需控制混杂因素，使用随机实验或因果推断方法（如倾向得分匹配）。在业务场景中，我会优先通过 A/B 测试验证结论。"
created: 2026-05-31
updated: 2026-05-31
---

# Data Scientist 面试题实例答案

## Q1: 相关性与因果性如何区分？
**答**：相关性反映变量共同变化，不代表因果。要建立因果关系需控制混杂因素，使用随机实验或因果推断方法（如倾向得分匹配）。在业务场景中，我会优先通过 A/B 测试验证结论。

## Q2: 如何设计一个 A/B 测试？
**答**：先定义核心指标与最小可检测效应，估算样本量与实验周期。确保随机分流与排除干预污染，并设置护栏指标。实验结束后进行显著性检验与异质性分析。

## Q3: 指标突然下降如何处理？
**答**：先核实口径与数据源是否变动，再按漏斗拆解定位影响环节。结合时间序列和分群分析排查外部因素，必要时回滚变更并发起专项实验验证。

---
*Last updated: 2026-02-26*

## Related

- [[21_Interviews/AI_Data_Analyst/company_level_question_bank]] — AI Data Analyst 按公司/级别区分的题库 (共享: career, experience, interviews, practitioners)
- [[21_Interviews/AI_Data_Analyst/interview_answers]] — AI Data Analyst 面试题实例答案 (共享: career, experience, interviews, practitioners)
- [[21_Interviews/AI_Data_Analyst/interview_preparing]] — AI Data Analyst 面试准备 (共享: career, experience, interviews, practitioners)
- [[21_Interviews/AI_Data_Analyst/question_bank]] — AI Data Analyst 题库 (共享: career, experience, interviews, practitioners)
