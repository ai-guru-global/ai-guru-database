---
title: 资料与归档
category: meta
tags: ["资料与归档", "运营资料", "索引"]
summary: "运营杂项收编区：信源存档（来源）、历史报告（reports）、元文档（docs）、RAG 助手脚本（assistant）；2026-11-18 目录重组 P2 期由顶层收编至此，归档/ 与 原始/ 因 skill 硬编码耦合保留顶层。"
created: 2026-11-18
updated: 2026-11-18
tier: supporting
aliases: [资料与归档专区, Ops Materials]
sources: []
name_zh: "资料与归档"
---

# 资料与归档
> 中文简称：资料与归档

> **一句话理解**: 非知识正文的运营杂项收编区——信源、历史报告、元文档与工具脚本各归其位，与编号主干、概念图谱、专题研究三分而治。

---

## 定位与边界

- **收编范围**（2026-11-18 P2 期，见 [[治理/Directory_Restructure_Plan_2026|目录重组计划]]）：`来源/`、`reports/`、`docs/`、`assistant/`
- **保留顶层**：`归档/`（10+ 个 wiki-* skill 将其硬编码为排除路径）、`原始/`（10+ 个 skill 依赖其 ingest 收件箱工作流）——移动/删除需先改 skill 契约，单列后续期处理
- 区内页面出链：指向主干用 `../../章节/...`

## 目录清单

| 目录 | 内容 | 说明 |
|------|------|------|
| 来源 | 信源存档 | 微信公众号、阿里云文档等原始素材（[index](./来源/index.md)，wechat/aliyun/modelscope 子目录） |
| reports | 历史报告 | 运营与评估报告存档（8 篇 k8s CVE 报告等，无子索引） |
| docs | 元文档 | superpowers 规划稿与设计稿（plans/specs 子目录） |
| [assistant](./assistant/README.md) | RAG 助手 | TF-IDF 检索脚本（build_index.py / query.py）+ 说明；索引产物在 `.code-up/rag-index/` |

## 与其它文档的衔接

- 分区总览：[[专题研究/README|专题研究专区]]、[概念图谱](../概念/README.md)
- 治理规则：[AGENTS.md](../治理/AGENTS.md)、[导入指南](../治理/Import_Guide.md)

---

*Last updated: 2026-11-18*
