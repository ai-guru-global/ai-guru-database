---
title: "LLM 推理 SLO 实践指南"
category: 13-ai-ops
subcategory: sre-reliability
tags: ["llm", "inference", "slo", "sre", "reliability", "alibaba-cloud"]
summary: "为 LLM 推理服务定义和运营 SLO：覆盖可用性、TTFT、TPOT、错误率、成本等维度，并给出错误预算与发布门控实践。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# LLM 推理 SLO 实践指南

> **一句话理解**: LLM 推理 SLO 就是给用户一个可量化的承诺——比如「99.9% 可用、95% 请求 TTFT < 1s」，并用错误预算来决定能不能发版。

## 目录

- [1. 为什么 LLM 需要专门 SLO](#1-为什么-llm-需要专门-slo)
- [2. SLI 选择](#2-sli-选择)
- [3. SLO 目标示例](#3-slo-目标示例)
- [4. 错误预算](#4-错误预算)
- [5. 发布门控](#5-发布门控)
- [6. 报警与复盘](#6-报警与复盘)
- [Related](#related)

---

## 1. 为什么 LLM 需要专门 SLO

传统 Web 服务只看可用性和延迟，但 LLM 推理还有：
- **TTFT/TPOT**: 流式输出的用户体验指标
- **输出质量**: 模型版本变更可能导致输出质量变化
- **成本**: 每 token 成本、GPU 利用率
- **上下文长度**: 长 prompt 的延迟显著更高

---

## 2. SLI 选择

| SLI | 说明 | 测量方式 |
|-----|------|---------|
| 可用性 | 服务可访问比例 | 健康检查 / 网关状态码 |
| TTFT | 首 token 延迟 | 客户端/网关计时 |
| TPOT | 每输出 token 延迟 | 客户端/引擎指标 |
| 错误率 | 非 200 响应比例 | 网关日志 |
| 输出质量 | 与基线对比的 bad case 比例 | 评估集 + 人工抽检 |
| 成本效率 | 每 1K token 的 GPU 成本 | FinOps 数据 |

---

## 3. SLO 目标示例

| 维度 | SLO | 说明 |
|------|-----|------|
| 可用性 | 99.9% | 月度停机 < 43 分钟 |
| TTFT p99 | < 2s | 长 prompt 场景可放宽 |
| TPOT p99 | < 100ms | 与模型和硬件相关 |
| 错误率 | < 0.5% | 包含超时和异常 |
| 输出质量退化 | < 2% bad case 增加 | 对比基线模型 |

---

## 4. 错误预算

错误预算 = 1 - SLO，用于决定：

- **能否发版**: 如果错误预算充足，允许发布；如果已耗尽，暂停非紧急变更。
- **能否回滚**: 一旦新版本消耗错误预算过快，立即回滚。
- **优先级**: 错误预算不足时，优先做稳定性改进而非新功能。

示例：月度 TTFT p99 SLO 为 2s，错误预算为 0.1%。如果一周内已消耗 80%，暂停发布。

---

## 5. 发布门控

```text
发布前:
  ├── 金丝雀流量 5% → 观察 30 分钟
  ├── 检查 TTFT/TPOT/错误率是否回归
  ├── 检查 GPU 利用率 / 成本是否异常
  └── 通过则逐步放大到 50% / 100%
```

---

## 6. 报警与复盘

### 6.1 报警分级

| 级别 | 条件 | 响应时间 |
|------|------|---------|
| P0 | 可用性跌破 SLO、错误率激增 | 5 分钟 |
| P1 | TTFT/TPOT p99 超过阈值 | 15 分钟 |
| P2 | 错误预算消耗过快 | 1 小时 |

### 6.2 复盘模板

- 故障时间线
- 影响的 SLI 和 SLO
- 根因
- 修复动作
- 预防措施
- 错误预算消耗

---

## Related

- [[_concepts/slo|SLO]]
- [[_concepts/sli|SLI]]
- [[_concepts/error-budget|Error Budget]]
- [[AI运维/SRE_Reliability/SLO_Error_Budget_AI_Deep_Dive|SLO 与错误预算]]
- [[MLOps/Observability/LLM_Inference_Observability_Stack|LLM 推理可观测性栈]]

- [[AI运维/README|AI 运维与可观测性 (AI Ops)]]
