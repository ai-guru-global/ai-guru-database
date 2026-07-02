---
title: LLM Platform Engineer 题库
category: 21-interviews-llm-platform-engineer
tags: ["interviews", "career", "llm", "platform", "mlops", "inference", "ai-gateway"]
summary: "LLM Platform Engineer 面试题库，覆盖 LLM 服务架构、推理优化、AI 网关、安全合规和平台工程，含难度与频率标注。"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
sources: []
---

# LLM Platform Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## LLM 服务架构 (12 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 设计一个企业级 LLM 服务平台的整体架构 | ⭐⭐⭐ | 🔴 |
| 2 | 多模型路由策略设计：按任务/按成本/按延迟分发请求 | ⭐⭐⭐ | 🔴 |
| 3 | 如何设计 LLM 应用的 API 网关？限流/认证/审计 | ⭐⭐ | 🔴 |
| 4 | Fallback 和 Failover 策略：主模型不可用时如何自动切换？ | ⭐⭐ | 🔴 |
| 5 | 如何设计 Prompt 版本管理和 A/B 测试系统？ | ⭐⭐ | 🟡 |
| 6 | LLM 应用的上下文管理：Session 持久化和多轮对话状态 | ⭐⭐ | 🟡 |
| 7 | 如何构建 LLM 应用的统一日志和可观测性？(Trace/Span) | ⭐⭐ | 🟡 |
| 8 | Streaming vs Non-streaming 的架构差异？SSE vs WebSocket | ⭐⭐ | 🟡 |
| 9 | 如何设计 LLM 服务的计费系统？Token 计量 + 成本分摊 | ⭐⭐⭐ | 🟡 |
| 10 | Function Calling 的平台化：工具注册 → 调用 → 结果回传 | ⭐⭐ | 🟡 |
| 11 | 如何支持多租户 LLM 服务？数据隔离 + 配额管理 | ⭐⭐⭐ | 🟡 |
| 12 | 开源 LLM 框架对比：LangChain vs LlamaIndex vs 自研 | ⭐⭐ | 🔴 |

## 推理与性能优化 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | LLM 推理延迟优化的完整策略清单？ | ⭐⭐ | 🔴 |
| 2 | KV Cache 优化的各种方法：PagedAttention / Prefix Caching / 分层 | ⭐⭐⭐ | 🟡 |
| 3 | 如何做 Semantic Cache？Embedding 相似度阈值如何调？ | ⭐⭐ | 🔴 |
| 4 | Batch 调度策略：Continuous Batching / Chunked Prefill | ⭐⭐⭐ | 🟡 |
| 5 | 模型量化对推理质量的影响如何评估？Perplexity + 任务评测 | ⭐⭐ | 🟡 |
| 6 | 如何设计 LLM 的 Warm-up 策略？冷启动优化 | ⭐⭐ | 🟡 |
| 7 | Token 级 vs Request 级限流的优劣？ | ⭐⭐ | 🟡 |
| 8 | 如何实现 LLM 请求的智能路由？(简单问题→小模型，复杂问题→大模型) | ⭐⭐⭐ | 🔴 |
| 9 | 推理引擎的性能 Benchmark 如何设计？TTFT/TPS/并发 | ⭐⭐ | 🔴 |
| 10 | 如何优化长上下文 (128K+) 的推理性能？ | ⭐⭐⭐ | 🟡 |

## 安全与合规 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | LLM 应用的内容审核如何做？输入过滤 + 输出审核 | ⭐⭐ | 🔴 |
| 2 | Prompt 注入攻击的类型和防护策略？ | ⭐⭐ | 🔴 |
| 3 | PII (个人身份信息) 检测和脱敏方案？ | ⭐⭐ | 🟡 |
| 4 | 如何实现 LLM 应用的审计日志？合规要求 (GDPR/SOC2) | ⭐⭐ | 🟡 |
| 5 | 模型输出的 Guardrails 设计：格式校验 + 事实校验 + 安全校验 | ⭐⭐⭐ | 🟡 |
| 6 | 如何防止 LLM 生成有害/偏见内容？Red Teaming 方法 | ⭐⭐ | 🟡 |
| 7 | API Key 管理和轮转策略？ | ⭐ | 🟡 |
| 8 | 如何设计一个 LLM 安全网关？输入清洗 + 输出过滤 + 速率限制 | ⭐⭐⭐ | 🟡 |

## 平台工程 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 如何构建 LLM 应用的 CI/CD？Prompt 测试 + 回归测试 | ⭐⭐ | 🔴 |
| 2 | LLM 应用的监控指标设计：延迟/错误率/成本/质量 | ⭐⭐ | 🔴 |
| 3 | 如何做 LLM 应用的灰度发布？Prompt 版本 + 模型版本 | ⭐⭐ | 🟡 |
| 4 | 如何设计 LLM 应用的成本预算和告警系统？ | ⭐⭐ | 🟡 |
| 5 | LLM 应用的错误处理：重试策略、超时设置、降级方案 | ⭐⭐ | 🔴 |
| 6 | 如何构建 LLM 评测平台？离线评测 + 在线评估 + 人工标注 | ⭐⭐⭐ | 🟡 |
| 7 | 多区域部署的 LLM 服务如何做就近路由？ | ⭐⭐⭐ | 🟢 |
| 8 | 如何设计 LLM 应用的数据飞轮？用户反馈 → 数据收集 → 模型改进 | ⭐⭐⭐ | 🟡 |

## 编程与实战 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 用 FastAPI + vLLM 搭建一个 OpenAI 兼容的 LLM API 服务 | ⭐⭐ | 🔴 |
| 2 | 实现一个 LLM 请求路由器：按意图分类分发到不同模型 | ⭐⭐ | 🟡 |
| 3 | 用 LangChain 实现一个带 Tool Calling 的 Agent 框架 | ⭐⭐ | 🟡 |
| 4 | 实现一个 Semantic Cache 中间件：Embedding + Redis | ⭐⭐ | 🟡 |
| 5 | 编写 Prometheus metrics exporter 监控 LLM 服务指标 | ⭐⭐ | 🟢 |

---

## Related

- [[21_Interviews/LLM_Platform_Engineer/company_level_question_bank|LLM Platform Engineer 按公司/级别区分的题库]]
- [[21_Interviews/LLM_Platform_Engineer/interview_answers|LLM Platform Engineer 面试题实例答案]]
- [[21_Interviews/LLM_Platform_Engineer/interview_preparing|LLM Platform Engineer 面试准备]]
- [[21_Interviews/README|AI 面试准备 (Interviews)]]
- [[21_Interviews/jobs|AI 相关岗位与工种清单]]
---
title: LLM Platform Engineer 题库
category: 21-interviews-llm-platform-engineer
tags: ["interviews", "career", "experience", "practitioners", "llm"]
summary: "KV Cache 的作用与影响是什么？"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
aliases:
  - "Question Bank"
  - "question bank"
  - question_bank

---
# LLM Platform Engineer 题库

## 基础
- KV Cache 的作用与影响是什么？
- 批处理与流式输出如何权衡？
- 常见推理加速方法有哪些？

## 项目
- 描述一个大模型服务平台的落地项目。
- 如何进行吞吐与成本优化？
- 如何进行模型版本与路由管理？

## 系统设计
- 设计一个多租户推理平台的架构。
- 灰度发布与容量规划如何做？
- 监控与计费体系如何设计？

## 案例
- 延迟突然升高如何排查？
- 热点模型导致拥塞如何处理？
- 模型升级后质量下降如何回滚？

---
*Last updated: 2026-06-04*

## Related

- [[21_Interviews/LLM_Platform_Engineer/company_level_question_bank|LLM Platform Engineer 按公司/级别区分的题库]]
- [[21_Interviews/LLM_Platform_Engineer/interview_answers|LLM Platform Engineer 面试题实例答案]]
- [[21_Interviews/LLM_Platform_Engineer/interview_preparing|LLM Platform Engineer 面试准备]]
- [[21_Interviews/README|AI 面试准备 (Interviews)]]
- [[21_Interviews/jobs|AI 相关岗位与工种清单]]
