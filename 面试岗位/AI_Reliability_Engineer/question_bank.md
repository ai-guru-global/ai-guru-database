---
title: AI Reliability Engineer 题库
category: 21-interviews-ai-reliability-engineer
tags: ["interviews", "career", "ai-reliability", "sre", "slo", "incident-response", "ml-monitoring", "observability"]
summary: "AI Reliability Engineer 面试题库，覆盖 SLO/SLI 设计、模型监控、故障恢复、混沌工程、容量规划与 AI 系统可观测性，含难度与频率标注。"
created: 2026-07-23
updated: 2026-07-23
tier: supporting
sources: []
---

# AI Reliability Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## SRE 与可靠性基础 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | SLI / SLO / SLA / Error Budget 的关系？如何用 Error Budget 平衡稳定性与迭代？ | ⭐⭐ | 🔴 |
| 2 | 可用性的"几个 9"如何计算？年/月容错时间分别是多少？ | ⭐ | 🔴 |
| 3 | 解释 MTTR / MTBF / MTTD，AI 系统中哪个最关键？ | ⭐⭐ | 🟡 |
| 4 | 纵向扩展 vs 横向扩展（Scale up/out）的适用场景和限制？ | ⭐ | 🟡 |
| 5 | 冗余设计：主动-主动 vs 主动-被动，AI 推理服务如何选？ | ⭐⭐ | 🟡 |
| 6 | 熔断、降级、限流、隔离（Bulkhead）四者的区别和配合？ | ⭐⭐ | 🔴 |
| 7 | 解释 CAP 定理在分布式 AI 系统中的体现，AP 还是 CP？ | ⭐⭐ | 🟢 |
| 8 | 幂等性设计为什么对故障恢复重要？如何实现？ | ⭐⭐ | 🟡 |
| 9 | 灰度发布（金丝雀）/蓝绿部署/滚动发布的区别？AI 模型如何选？ | ⭐⭐ | 🔴 |
| 10 | 责任共担（Blameless Postmortem）文化如何落地？ | ⭐ | 🟡 |

---

## 模型与 ML 系统可靠性 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 11 | 模型漂移（Data/Concept Drift）如何实时检测？PSI/KS/ADWIN 各自适用？ | ⭐⭐ | 🔴 |
| 12 | Training-Serving Skew 如何导致线上可靠性问题？如何预防？ | ⭐⭐ | 🔴 |
| 13 | LLM 推理服务的 P99 延迟如何保证？Streaming / Batching / KV Cache 的作用？ | ⭐⭐⭐ | 🔴 |
| 14 | 模型推理的 OOM / GPU 故障如何快速恢复？Checkpoint 机制？ | ⭐⭐⭐ | 🟡 |
| 15 | 多模型混部（multiple models on shared GPU）如何做资源隔离和抢占？ | ⭐⭐⭐ | 🟡 |
| 16 | GPU 利用率低（<40%）常见原因？如何优化？ | ⭐⭐ | 🔴 |
| 17 | 模型冷启动（加载大模型到显存）慢，如何优化（预加载/常驻）？ | ⭐⭐ | 🟡 |
| 18 | 模型灰度发布时如何做"影子流量（Shadow Traffic）"对比验证？ | ⭐⭐⭐ | 🟡 |
| 19 | AI 系统的"静默错误"（Silent Error，如精度退化但不报错）如何发现？ | ⭐⭐⭐ | 🔴 |
| 20 | 如何为 LLM 应用设计降级策略（模型不可用时兜底）？ | ⭐⭐ | 🟡 |

---

## 监控与可观测性 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 21 | Observability 三支柱（Metrics/Logs/Traces）在 AI 系统的应用？ | ⭐⭐ | 🔴 |
| 22 | AI 系统应该监控哪些"业务指标"（预测分布/置信度/反馈率）？ | ⭐⭐ | 🔴 |
| 23 | 如何设计告警避免"告警风暴"和"告警疲劳"？分级与降噪？ | ⭐⭐ | 🟡 |
| 24 | 黄金信号（Latency/Traffic/Errors/Saturation）在 GPU 集群如何映射？ | ⭐⭐ | 🟡 |
| 25 | LLM 输出质量（幻觉率/毒性）如何在线监控？抽样 vs 全量？ | ⭐⭐⭐ | 🔴 |
| 26 | 分布式追踪（Distributed Tracing）在 RAG/Agent 多跳调用中的价值？ | ⭐⭐ | 🟡 |
| 27 | 如何用 Sampling 降低监控成本（头部采样 vs 尾部采样）？ | ⭐⭐ | 🟢 |
| 28 | 日志聚合平台（ELK/Loki）在 AI 高并发场景的瓶颈与优化？ | ⭐⭐ | 🟢 |

---

## 故障应急与恢复 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 29 | 设计一个 AI 事故响应流程（On-Call/分级/响应/复盘） | ⭐⭐⭐ | 🔴 |
| 30 | 模型上线后效果突然下降（如离线正常线上崩），如何快速定位？ | ⭐⭐⭐ | 🔴 |
| 31 | GPU 集群大面积故障（如驱动问题/NIC 故障）的应急预案？ | ⭐⭐⭐ | 🟡 |
| 32 | 如何实现模型的快速回滚（秒级切换到上一个稳定版）？ | ⭐⭐ | 🔴 |
| 33 | 依赖的第三方 LLM API 宕机，如何保证业务连续性（多供应商）？ | ⭐⭐ | 🟡 |
| 34 | 数据管道故障导致特征缺失，推理服务如何兜底（默认值/缓存）？ | ⭐⭐ | 🟡 |
| 35 | 灾备（DR）策略：RPO/RTO 如何定义？AI 系统的多活设计？ | ⭐⭐⭐ | 🟢 |
| 36 | 描述一次你处理的 P0 级 AI 线上事故（STAR） | ⭐⭐ | 🔴 |

---

## 容量规划与混沌工程 (7 题)

| # | 问题 | 难度 | 面试 |
|---|------|------|------|
| 37 | 如何为 GPU 推理集群做容量规划（QPS 预测/峰值倍数/冗余）？ | ⭐⭐⭐ | 🔴 |
| 38 | 混沌工程（Chaos Engineering）在 AI 系统如何实践？注入哪些故障？ | ⭐⭐⭐ | 🟡 |
| 39 | Auto-scaling（HPA/VPA/KEDA）在 GPU 节点的挑战和方案？ | ⭐⭐⭐ | 🟡 |
| 40 | 流量突增（如营销活动）如何做弹性扩容和限流保护？ | ⭐⭐ | 🟡 |
| 41 | Spot/抢占式 GPU 实例的使用如何平衡成本和稳定性？ | ⭐⭐ | 🟡 |
| 42 | 成本可观测性：如何追踪单次推理的成本并优化？ | ⭐⭐ | 🟢 |
| 43 | 多区域（Multi-region）部署的流量调度和一致性如何保证？ | ⭐⭐⭐ | 🟢 |

---

## 行为面试 (5 题)

| # | 问题 | 频率 |
|---|------|------|
| 44 | 描述一次你主导的 AI 系统稳定性提升项目（从 SLA X% 到 Y%） | 🔴 |
| 45 | 如何说服业务团队接受"为稳定性牺牲部分功能速度"？ | 🔴 |
| 46 | 描述一次无 blame 的事故复盘，产出了什么改进 | 🟡 |
| 47 | 你如何在团队推动 On-Call 文化和值班轮换制度？ | 🟡 |
| 48 | 当可靠性投资 ROI 难以量化时，你如何向管理层争取资源？ | 🟡 |

---

## 编程与系统设计题 (4 题)

| # | 方向 | 频率 | 示例 |
|---|------|------|------|
| 49 | 监控脚本 | 🔴 | 实现一个模型漂移检测 + 告警脚本 |
| 50 | 容量计算 | 🟡 | 给定 SLA 和流量，计算所需 GPU 数量 |
| 51 | 系统设计 | 🔴 | 设计一个高可用 LLM 推理平台（多区域/多供应商） |
| 52 | 故障注入 | 🟢 | 设计一个 GPU 故障注入实验 |

---

*Last updated: 2026-07-23*

## Related

- [[面试岗位/AI_Reliability_Engineer/interview_answers|AI Reliability Engineer 面试题实例答案]]
- [[面试岗位/AI_Reliability_Engineer/company_level_question_bank|AI Reliability Engineer 按公司/级别区分的题库]]
- [[面试岗位/AI_Reliability_Engineer/index|AI Reliability Engineer 首页]]
- [[运维/index|运维]]
- [[模型运维/index|模型运维]]
- [[部署推理/index|部署推理]]
- [[面试岗位/Interview_Guide/System_Design_for_AI|AI 系统设计面试]]
- [[面试岗位/jobs|AI 相关岗位与工种清单]]
