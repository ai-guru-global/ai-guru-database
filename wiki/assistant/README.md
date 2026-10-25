---
title: AI Guru 助手 (RAG MVP)
category: root
tags: ["rag", "assistant", "mvp", "retrieval", "citation"]
summary: "知识库 RAG 问答助手 MVP：纯标准库 TF-IDF 检索（中文二元组）+ 引用溯源 + 门禁数据质量加权，LLM 生成可插拔。发展计划 §3.2 的 Q4 主攻项目。"
created: 2026-09-05
updated: 2026-09-05
tier: supporting
sources: []
name_zh: "AI Guru 助手"
---
# AI Guru 助手 (RAG MVP)

> 中文简称：AI Guru 助手

> **一句话理解**: 对全库 1,928 万字开卷考试——先检索最相关的知识块，再带着出处回答，每个论断可溯源到具体文件与小节。

---

## 设计原则（MVP 边界）

1. **零第三方依赖**：TF-IDF（中文二元组 + 英文词）纯标准库实现，离线可跑；
2. **引用溯源**：每个检索块携带 `文件路径 · 中文短名 · 小节标题`，LLM 回答强制带 `[编号]` 引用；
3. **门禁数据质检层**：frontmatter 完整 ×1.2、tier=core ×1.15、stub ×0.5（与 link_gate 口径一致）；
4. **LLM 可插拔**：默认只做检索；配置环境变量后走 OpenAI 兼容接口生成答案，密钥仅从环境注入。

## 使用

```bash
# 1. 构建索引（产物 .code-up/rag-index/，已 gitignore，可随时重建）
python3 assistant/build_index.py

# 2. 检索模式（无需任何密钥）
python3 assistant/query.py "KServe 和 vLLM 什么关系"

# 3. 问答模式（需 OpenAI 兼容接口）
export ASSISTANT_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1
export ASSISTANT_API_KEY=你的密钥
export ASSISTANT_MODEL=qwen-plus
python3 assistant/query.py "Token 工厂和 IDC 的区别" --llm
```

## 与治理体系的关系

- 检索质量依赖语料质量：断链 / 孤立 / frontmatter 三项门禁基线（`治理/_meta/link-health-baseline.json`）是本助手的数据地基，见 [[治理/Quality_Metrics|质量度量]]；
- frontmatter 缺失的文件在检索中被降权——补齐 frontmatter 就是给助手喂数据，见 [[治理/KNOWN_ISSUES|已知问题]] ISS-101/103；
- 政策语境：工信部 414 号文点名的 FDE / AI 应用服务能力，本助手即「自家知识库上的 AI 应用服务」示范，见 [[17_伦理安全/03_AI治理/08_AI应用服务商培育专项行动_2026|AI 应用服务商培育专项行动解读]]。

## 演进路线（Q4）

1. MVP（本次）：词法检索 + 引用溯源 ✅
2. 语义升级：接入 Embedding 检索与词法检索混合排序（接口已预留，换 `retrieve` 即可）
3. 服务化：HTTP API + 前端应用入口（复用 [[前端应用/README|前端应用]]）
4. 评测：用门禁数据抽构建标准问答集，量化检索命中率

---

*Last updated: 2026-09-05*
