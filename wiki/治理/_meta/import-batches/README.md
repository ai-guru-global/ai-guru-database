---
title: Import Batches — 导入批次授权
category: meta
tags: ["governance", "import", "link-gate", "audit"]
summary: "外部仓库导入时的健康门禁债务授权机制：每批一个 JSON 授权增量、到期自动失效，禁止抬高基线吸收债务。"
created: 2026-11-24
updated: 2026-11-24
tier: supporting
aliases:
  - Import Batches
  - 导入批次
sources: []
name_zh: "导入批次授权"
---
# Import Batches — 导入批次授权

> 中文简称：导入批次授权

> **一句话理解**: 外部仓库批量导入 wiki 时允许门禁数字临时上涨的"有息授权"——每批一个 JSON、写明到期日，额度只帮通过不抬基线，到期自动失效。

---

## 机制

[[治理/KNOWN_ISSUES|已知问题追踪]] 记录了门禁四项指标的棘轮基线（只降不升）。
批量导入（如 A3 the-ops-agent-book、A4 mechanic-romance）会一次性带入
frontmatter 缺失、孤立页等债务。本机制替代"一次性抬高基线"这种不可逆操作：

- 每个导入批次在本目录（`wiki/治理/_meta/import-batches/`）建一个 `<batch>.json`，
  由 [[治理/Content_Governance|内容治理]] 流程审核后随导入一起提交，形成审计轨迹。
- `link_gate.py` 全文模式运行时读取所有未过期批次，把 `allowed_delta` 并入通过线。
- **额度只影响通过与否则不抬高基线**：指标回落时棘轮基线照常收紧，债务实际偿还。
- `expires` 早于当天的批次自动失效（打印过期提示，文件保留作审计）。

---

## 批次文件格式

```json
{
  "batch": "a4-mechanic-romance-batch-1",
  "created": "2026-11-24",
  "expires": "2027-02-28",
  "allowed_delta": {
    "orphan_count": 60,
    "frontmatter_incomplete": 120
  },
  "note": "mechanic-romance 第 1 批 60 篇，来源 research-corpus"
}
```

- `allowed_delta` 只认门禁指标键：`broken_instances` / `orphan_count` /
  `frontmatter_incomplete` / `spacing_violations` /
  `staging_frontmatter_incomplete` / `staging_spacing_violations`。
- 多个未过期批次按指标求和；无效文件忽略并告警，不阻断门禁。

---

## 生命周期

1. **导入前**：估算债务增量 → 建批次 JSON，随导入 PR 一起提交。
2. **导入后**：门禁凭额度通过；基线不动。
3. **偿还**：补 frontmatter、修断链后指标回落 → 基线自动收紧，额度富余无用。
4. **到期**：批次自动失效；未偿清的债务会让门禁失败，必须回补或显式收紧基线（人工决策，见
   [[治理/Quality_Metrics|质量度量]] 的验收口径）。

---

## 禁止事项

- 禁止用一次性抬高 [[治理/_meta/link-health-baseline.json]] 的方式吸收导入债务。
- 禁止在批次 JSON 里塞负数额度变相收紧他人指标。
- 批次过期后禁止静默重建同名额次"续命"——续期须改 `expires` 并在 `note` 说明理由。

---

*Last updated: 2026-11-24*
