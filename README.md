---
title: AI Guru Database
category: meta
tags: ["readme", "entry", "navigation"]
summary: "仓库门面页：三主目录结构与入口导航，知识内容全部位于 wiki/。"
created: 2026-05-31
updated: 2026-10-25
tier: core
aliases: [AI Guru 知识库, ai-guru-database]
sources: []

name_zh: "仓库门面"
---
# AI Guru Database

> 中文简称：仓库门面

> **一句话理解**: 全栈 AI 知识库——从数学基础到 LLM/Agent 生产部署，内容在 `wiki/`，代码在 `code/`，技能在 `skills/`。

本文件只是 GitHub 首页门牌。**全部知识内容见 [`wiki/README.md`](wiki/README.md)**。

---

## 三个主目录

| 目录 | 职责 | 入口 |
|------|------|------|
| `wiki/` | 全部 Markdown 文档。**这是 Obsidian 库根**（`.obsidian/`、`index.md`、`.manifest.json` 都在这里） | [`wiki/README.md`](wiki/README.md) · [`wiki/index.md`](wiki/index.md) |
| `code/` | 全部代码：`code/工具/`（Python 维护脚本）、`code/前端应用/`（React SPA）、`code/原始/github-sources/`（外部克隆参考仓，只读） | [`code/工具/README.md`](code/工具/README.md) |
| `skills/` | Agent 技能（ingest / lint / digest 流水线等） | [`skills/`](skills/) |

`release/` 是历史发布快照，刻意留在 `wiki/` 之外——600+ 文件名与在用内容冲突。

---

## 快速开始

```bash
# 链健康门禁（断链 / 孤立页 / frontmatter / 中英间距）
python3 code/工具/link_gate.py

# 全库统计
python3 code/工具/count_words.py

# 前端（Node >=18, pnpm >=8）
cd code/前端应用 && pnpm install && pnpm dev
```

用 Obsidian 打开 `wiki/` 目录即可作为知识库浏览。

---

## 约定速查

- 内容规范见 [`AGENTS.md`](AGENTS.md)；安全生产规则见 [`wiki/治理/AGENTS.md`](wiki/治理/AGENTS.md)。
- 每页 frontmatter 必带 `name_zh`，正文以 `> 中文简称：…` 复述。
- 中文与英文/数字之间留空格；章节之间用 `---` 分隔。
- 链接用 Obsidian wikilink（`[[概念/rlhf]]`）；每页至少 2 条出链。

---

*Last updated: 2026-10-25*
