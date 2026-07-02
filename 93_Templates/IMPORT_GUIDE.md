---
title: 📥 导入指南
category: 93-tools
tags: ["tools", "software", "utilities", "productivity"]
summary: "本指南介绍如何将 AI Guru 知识库导入到各种 AI 工具和笔记软件中。"
created: 2026-05-31
updated: 2026-05-31
tier: core
aliases:
  - "Import Guide"
  - "IMPORT GUIDE"
  - IMPORT_GUIDE

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# 📥 导入指南

本指南介绍如何将 AI Guru 知识库导入到各种 AI 工具和笔记软件中。

---

## 🛠️ 支持的工具

| 工具 | 类型 | 导入方式 | 最佳用途 |
|------|------|----------|----------|
| [NotebookLM](#notebooklm-google) | AI 学习 | GitHub URL / ZIP | 研究、问答、生成播客 |
| [ima](#ima-腾讯) | 知识管理 | 本地文件夹 | 中文问答、知识检索 |
| [Claude Projects](#claude-projects) | AI 助手 | ZIP 上传 | 代码分析、深度研究 |
| [ChatGPT GPTs](#chatgpt-gpts) | AI 助手 | 文件上传 | 定制问答机器人 |
| [Obsidian](#obsidian) | 笔记软件 | Git 克隆 | 本地知识管理 |
| [Notion](#notion) | 笔记软件 | Markdown 导入 | 团队协作 |

---

## NotebookLM (Google)

NotebookLM 是 Google 推出的 AI 笔记本工具，可以分析文档并生成摘要、问答，甚至播客。

### 导入步骤

1. 访问 [notebooklm.google.com](https://notebooklm.google.com)
2. 点击 "New Notebook"
3. 在 Sources 区域点击 "+" → "GitHub"
4. 粘贴仓库地址：
   ```
   https://github.com/your-org/ai-guru-knowledge-base
   ```
5. 选择 `docs/` 目录
6. 等待 NotebookLM 分析完成

### 使用技巧

- **生成摘要**: "总结这份文档的核心观点"
- **创建 FAQ**: "基于这些内容生成常见问题"
- **制作播客**: 点击 "Audio Overview" 生成双人对话播客
- **深度问答**: 提出具体问题，NotebookLM 会基于文档回答

---

## ima (腾讯)

ima 是腾讯推出的 AI 智能工作台，支持知识库管理和对话式查询。

### 导入步骤

1. 下载知识库：
   ```bash
   git clone https://github.com/your-org/ai-guru-knowledge-base.git
   ```

2. 打开 ima 应用
3. 点击左侧「知识库」→「创建知识库」
4. 选择「导入本地文件」
5. 选择 `ai-guru-knowledge-base/docs/` 文件夹
6. 等待导入完成

### 使用技巧

- **中文优化**: 对中文内容理解和回答效果更好
- **多轮对话**: 可以连续追问，ima 会保持上下文
- **来源标注**: 回答会标注信息来源文档

---

## Claude Projects

Claude Projects 允许你创建专用知识库，让 Claude 在特定上下文中回答问题。

### 导入步骤（精简版）

由于 Claude 有上下文限制，建议导入核心章节：

```bash
# 克隆仓库
git clone https://github.com/your-org/ai-guru-knowledge-base.git

# 创建精简版本（仅核心内容）
cd ai-guru-knowledge-base
cp -r docs/00_AI_Introduction claude_upload/
cp -r docs/04_NLP_LLMs claude_upload/
cp -r docs/07_AI_Engineering claude_upload/

# 打包
zip -r ai-guru-claude.zip claude_upload/
```

1. 打开 Claude 网页版
2. 点击左侧「Projects」→「Create Project」
3. 选择「Project Knowledge」→「Add Content」
4. 上传 `ai-guru-claude.zip`
5. 在对话中引用知识库内容

### 使用技巧

- **文件引用**: 使用 `@filename.md` 引用特定文件
- **代码分析**: 适合分析代码示例和架构设计
- **长文档**: 支持超长上下文理解

---

## ChatGPT GPTs

创建自定义 GPT，让 ChatGPT 基于 AI Guru 知识库回答专业问题。

### 创建步骤

1. 访问 [chat.openai.com/gpts/editor](https://chat.openai.com/gpts/editor)
2. 点击「Configure」
3. 在「Knowledge」区域点击「Upload Files」
4. 上传精选文档（建议不超过 20 个核心文件）
5. 配置 Instructions：
   ```
   你是 AI Guru 知识库助手，专门回答人工智能相关问题。
   基于上传的知识库文档提供专业、准确的回答。
   回答时注明信息来源。
   ```

### 推荐上传文件

- `00_AI_Introduction/AI_Fundamentals.md`
- `00_AI_Introduction/AI_Glossary.md`
- `05_NLP_LLMs/LLM_Architectures/LLM_Architectures.md`
- `05_NLP_LLMs/Prompt_Engineering/Prompt-Engineering-in-nutshell.md`
- `14_RAG_Systems/RAG-in-nutshell.md`
- `06_Reinforcement_Learning/AI_Agents/Agent-in-nutshell.md`

---

## Obsidian

Obsidian 是强大的本地知识管理工具，支持双向链接和图谱视图。

### 导入步骤

```bash
# 克隆到 Obsidian Vault 目录
git clone https://github.com/your-org/ai-guru-knowledge-base.git ~/Documents/ObsidianVault/AI-Guru

# 或者创建软链接
ln -s /path/to/ai-guru-knowledge-base/docs ~/Documents/ObsidianVault/AI-Guru
```

1. 打开 Obsidian
2. 选择「Open folder as vault」
3. 选择 `AI-Guru` 文件夹
4. 安装推荐插件：
 - **Graph View**: 查看知识图谱
 - **Search**: 全文搜索
 - **Tags**: 标签管理

### 使用技巧

- **双向链接**: 使用 `[ [文档名] ]` 语法创建链接（示例，非真实链接）
- **图谱视图**: 查看知识点之间的关联
- **标签系统**: 使用 `#标签` 分类内容
- **本地优先**: 所有数据保存在本地

---

## Notion

Notion 支持批量导入 Markdown 文件。

### 导入步骤

1. 准备 Markdown 文件
2. 在 Notion 中点击「Settings & Members」→「Import」
3. 选择「Markdown & CSV」
4. 上传 `docs/` 文件夹中的 `.md` 文件

### 替代方案（分章节导入）

由于 Notion 导入有限制，建议按章节分批导入：

```bash
# 创建章节压缩包
cd docs/00_AI_Introduction
zip -r ../../00_AI_Introduction.zip .

# 然后在 Notion 中逐个导入
```

---

## 📋 快速参考

### 下载整个知识库

```bash
# 完整克隆
git clone https://github.com/your-org/ai-guru-knowledge-base.git

# 浅克隆（更快，不包含历史）
git clone --depth 1 https://github.com/your-org/ai-guru-knowledge-base.git

# 仅下载 docs 目录（稀疏检出）
git clone --depth 1 --filter=blob:none --sparse https://github.com/your-org/ai-guru-knowledge-base.git
cd ai-guru-knowledge-base
git sparse-checkout set docs
```

### 文件大小参考

| 内容 | 大小 | 文件数 |
|------|------|--------|
| 完整仓库 | ~50MB | 290+ |
| 仅 docs/ | ~30MB | 280+ |
| 仅 00_AI_Introduction | ~5MB | 11 |
| 仅核心章节* | ~15MB | 80+ |

*核心章节：00, 04, 06, 07

---

## 💡 选择建议

| 你的需求 | 推荐工具 |
|----------|----------|
| 想要 AI 问答和总结 | NotebookLM, ima, Claude |
| 想要本地管理知识 | Obsidian |
| 团队协作和共享 | Notion |
| 创建专业问答机器人 | ChatGPT GPTs |
| 中文内容优先 | ima |
| 研究和深度分析 | NotebookLM, Claude |

---

## ❓ 常见问题

**Q: 导入后如何更新内容？**

A: 对于 Git 克隆的仓库，运行 `git pull` 即可更新。对于上传的文件，需要重新导入。

**Q: 哪些工具支持实时同步？**

A: Obsidian（通过 Git）和 ima（监控文件夹）支持一定程度的同步。其他工具需要手动重新导入。

**Q: 导入文件数量有限制吗？**

A: 是的：
- NotebookLM: 50 个 sources
- Claude Projects: 文件总大小限制
- ChatGPT GPTs: 20 个 files
- ima: 无明确限制

**Q: 如何只导入特定章节？**

A: 先克隆仓库，然后只复制需要的章节文件夹进行导入。

---

如有其他工具的使用问题，欢迎提交 Issue 讨论！

## Related

- [[93_Templates/DOCUMENT_TEMPLATES]] — AI Guru 知识库 — 文档模板规范 (共享: productivity, software, tools, utilities)
- [[93_Templates/README]] — 工具与指南 (Tools) (共享: productivity, software, tools, utilities)
