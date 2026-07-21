---
title: "Error Budget"
category: -concepts
tags: ["sre", "reliability", "slo", "error-budget", "release-management"]
summary: "Error Budget（错误预算）是 SLO 允许的不可用量化上限，用于平衡发布速度与稳定性。"
created: 2026-06-26
updated: 2026-07-21
tier: core
lifecycle: reviewed
aliases:
  - "错误预算"
relationships:
  - target: "概念/slo"
    type: derived_from
  - target: "概念/sli"
    type: related_to
sources: []
---

# Error Budget（错误预算）

> **一句话理解**: 错误预算 = 「你允许服务一个月出多久的错」——预算花光了，就先别发版，先把稳定性修好。

## 定义

Error Budget = 1 - SLO，是服务在给定时间窗口内允许的最大不可用量。它是 SRE 与开发团队之间平衡发布速度与稳定性的核心机制。

## 计算示例

| SLO | 月度错误预算 | 含义 |
|-----|-------------|------|
| 99.9% | 43.2 分钟 | 每月允许 43min 不可用 |
| 99.95% | 21.6 分钟 | 更严格 |
| 99.99% | 4.32 分钟 | 金融级 |
| 99.999% | 26 秒 | 电信级 |

## 预算消耗监控

```
剩余预算 = 总预算 - 已消耗

消耗速度 = 已消耗 / 已过时间
预计耗尽 = 剩余预算 / 消耗速度
```

| 状态 | 消耗比例 | 行动 |
|------|----------|------|
| 🟢 健康 | < 50% | 正常发布 |
| 🟡 警告 | 50-80% | 加强审查 |
| 🔴 危险 | > 80% | 冻结发布 |
| ⚫ 耗尽 | 100% | 强制复盘 + 修复 |

## 生产最佳实践

1. **自动化门控**：预算 < 20% 时 CI/CD 自动拦截发布
2. **多窗口监控**：1h/6h/24h/30d 多时间窗口
3. **与发布联动**：每次发布消耗预算，大发布消耗更多
4. **无责备文化**：预算耗尽不是惩罚，是系统改进信号
5. **AI 服务特殊考虑**：LLM 推理延迟波动大，建议用 P95 而非 P99

## Related

- [[概念/slo|SLO]]
- [[概念/General/sli|SLI]]
- [[概念/General/sla|SLA]]
- [[运维/SRE_Reliability/LLM_Inference_SLO_Guide|LLM 推理 SLO 实践指南]]
