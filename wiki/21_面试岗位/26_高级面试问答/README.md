---
title: Advanced Interview QA
category: 21-interviews-advanced-qa
tags: ["interviews", "advanced", "qa", "senior", "staff"]
summary: "高级（Senior/Staff）面试问答系列：按技术主题沉淀深度问答，01 为「结论 → 展开 → 追问预判」深潜体，02-05 为 quick-qa 快问快答体（口述自测 + 高级课题 + 面试模拟对话），覆盖 LLM 推理、LLM 全生命周期、Agent 基础/全生命周期/八大工程。"
created: 2026-09-07
updated: 2026-09-08
tier: supporting
sources: []
name_zh: "高级面试问答"
name_en: "Advanced Interview QA"
---

# Advanced Interview QA

> 中文简称：高级面试问答 ｜ English Name: Advanced Interview QA

> **一句话理解**: 按"主题"而非"岗位"组织的高级面试问答库——每个主题一篇深度问答，模拟真实面试的追问链路。

---

## 系列定位

与按岗位组织的题库（`01_Agent工程师/`、`19_LLM平台工程师/` 等）互补，本目录按**技术主题**沉淀 Senior/Staff 级深度问答：

- **答题框架**: 01 为「结论 → 展开 → 追问预判」三段式；02-05 为 quick-qa 体例（快问快答口述自测 + 高级课题深挖 + 面试模拟对话）
- **难度口径**: ⭐⭐⭐ 高级必备，默认读者已具备中级工程经验
- **与知识库联动**: 每题给出指向 `10_部署推理/`、`12_架构基建/` 等深度文档的延伸阅读

## 系列规划

| 序号 | 主题 | 状态 |
|------|------|------|
| 01 | LLM 推理（两阶段/KV Cache/调度/量化/投机解码/PD 分离/容量/排障） | ✅ 已沉淀 |
| 02 | LLM 全生命周期（数据/预训练/后训练/评估/发布/迭代） | ✅ 已沉淀 |
| 03 | Agent 基础（定义/循环/工具/记忆/协议/失效模式） | ✅ 已沉淀 |
| 04 | Agent 全生命周期（立项/评估/上线/AgentOps/治理/降级） | ✅ 已沉淀 |
| 05 | Agent Engineering（Context/Tool/Memory/Multi-Agent/Eval/Safety/Cost/Observability 八大工程） | ✅ 已沉淀 |
| 06 | RAG 系统架构（检索/重排/评估/排障） | 规划中 |
| 07 | 模型评估与可观测性 | 规划中 |

> **quick-qa 体例**（02-05 系列）：参考 kudig-database 的 quick-qa 格式——快问快答（60 秒口述自测）+ 进阶复合题 + 高级课题（带"深挖"回语料）+ 速答速记表 + 面试模拟对话（三场景追问脚本）+ 自练检查清单。

## 文件导航

| 文件 | 说明 |
|------|------|
| [[21_面试岗位/26_高级面试问答/01_LLM推理_高级面试问答|LLM 推理高级面试问答]] | Senior/Staff 级 12 题：TTFT/TPOT 两阶段优化、KV Cache 与 PagedAttention、Continuous Batching 与 Chunked Prefill、Prefix Caching、量化谱系、投机解码、PD 分离、容量规划、TTFT 排障框架、Multi-LoRA。 |
| [[21_面试岗位/26_高级面试问答/02_LLM全生命周期_高级面试问答|LLM 全生命周期高级面试问答]] | 35 题 quick-qa：数据工程与配比、预训练（长上下文/MoE/Scaling Law）、后训练（SFT/RLHF/DPO/GRPO/蒸馏）、评估与发布（污染/judge 偏差/门禁）、数据飞轮与算力分配，附 8 大高级课题与三场景模拟对话。 |
| [[21_面试岗位/26_高级面试问答/03_Agent基础_高级面试问答|Agent 基础高级面试问答]] | 36 题 quick-qa：定义与边界、ReAct 与 Harness、工具调用与 MCP/A2A、记忆分层、规划模式、多智能体、失效模式、MDP 视角与上下文第一性，附 6 大高级课题与三场景模拟对话。 |
| [[21_面试岗位/26_高级面试问答/04_Agent全生命周期_高级面试问答|Agent 全生命周期高级面试问答]] | 33 题 quick-qa：立项三问、买建选型、三层评估、影子模式、HITL、AgentOps 与 trace、事故 SOP、降级与退役、ROI 论证，附治理/红队/平台化课题与三场景模拟对话。 |
| [[21_面试岗位/26_高级面试问答/05_Agent_Engineering_高级面试问答|Agent Engineering 高级面试问答]] | 36 题 quick-qa：八大专项工程（Context/Tool/Memory/Multi-Agent/Eval/Safety/Cost/Observability）各 3-5 题，含成本回归分析、上下文预算表、注入红队用例设计等复合题。 |

## Related

- [[21_面试岗位/README|面试岗位章节导航]]
- [[21_面试岗位/18_面试指南/06_系统设计_for_AI|系统设计 for AI]]
- [[10_部署推理/README|部署推理章节（深度原理文档）]]

---

*Last updated: 2026-09-08*
