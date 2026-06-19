---
title: 目录结构与命名规范 (Directory Conventions)
category: meta
tags: [conventions, directory-structure, governance]
summary: 项目所有目录的定位、用途和治理规范，覆盖主章节、辅助目录、知识图谱层和元文件。
created: 2026-06-03
updated: 2026-06-03
---

# 目录结构与命名规范

> 本文档定义了项目中所有目录的定位和治理规则，帮助贡献者和 AI Agent 快速理解知识库的组织逻辑。

---

## 一、目录全景

```
ai-guru-database/
│
├── 📚 主知识章节 (00-23)     ← 核心内容，深度文档
├── 🗂️ 辅助知识章节 (90-94)   ← 学习/笔记/计划/工具/可视化
├── 🔗 知识图谱层             ← _concepts/ + _synthesis/ + _references/ + ...
├── 📋 _meta/                 ← 项目治理、审计、评估报告（集中管理）
├── 🗄️ 暂存与归档             ← _raw/ + _staging/ + _archives/
├── 🌐 工具与构建             ← Web/ (Astro) + _tools/
└── 📄 根目录文件             ← README、ROADMAP、LICENSE、index.md
```

---

## 二、主知识章节（00-23）

> **定位**: 核心知识内容，每个章节覆盖一个技术领域。
> **命名规范**: `{编号}_{Title_Case名称}/`，如 `05_NLP_LLMs/`

| 编号 | 目录 | 定位 | 文件数 |
|------|------|------|--------|
| 00 | AI_Introduction | AI 通识与历史 | 13 |
| 01 | Fundamentals | 数学与计算机基础 | 19 |
| 02 | Machine_Learning | 经典 ML 算法 | 23 |
| 03 | Deep_Learning | 神经网络核心 | 12 |
| 04 | NLP_LLMs | 大模型技术 | 56 |
| 05 | Computer_Vision | 计算机视觉 | 20 |
| 06 | Reinforcement_Learning | 强化学习与具身智能 | ~15 |
| 07 | Model_Training | 训练工程 | 23 |
| 08 | Model_Evaluation | 评估方法 | 16 |
| 09 | Deployment_Inference | 推理与部署 | 37 |
| 10 | MLOps_Pipeline | MLOps 流水线 + 工具 Deep Dive | ~40 |
| 11 | RAG_Systems | RAG 与向量数据库 | 31 |
| 12 | Architecture_Infrastructure | 架构 + AI Gateway | ~32 |
| 13 | Agent_Production | Agent 全链路（基础+生产） | ~65 |
| 15 | Testing | AI 测试 | 12 |
| 16 | AI_Ops | AI 运维（SRE/混沌/事件响应） | ~11 |
| 17 | AI_Coding | AI 编程工具 | 12 |
| 19 | Ethics_Safety | 伦理与安全 | 20 |
| 20 | AI_Applications_Industry | 行业应用 | - |
| 21 | Talks | 业界观点 | - |
| 22 | Papers | 必读论文 | - |
| 23 | Interviews | 面试与岗位 | - |

**每个章节的标准文件**:
- `README.md` — 章节导航
- `README_for_dummy.md` — 入门版（初学者友好）
- `{Topic}_for_dummy.md` — 单主题入门版
- `{Topic}_Deep_Dive.md` — 深度解析

---

## 三、辅助知识章节（90-94）

> **定位**: 学习与项目管理辅助内容，不属于核心技术知识。

| 编号 | 目录 | 定位 | 说明 |
|------|------|------|------|
| 90 | Learn | 学习路径与课程规划 | 16 周教学大纲、学习计划 |
| 91 | Notes | 笔记与思考记录 | 个人笔记、会议记录 |
| 92 | Plan | 项目规划 | 实施计划、迭代规划 |
| 93 | Tools | 工具与脚本 | 辅助工具文档 |
| 94 | Visualization | 可视化资产 | 图表、信息图 |

---

## 四、知识图谱层

> **定位**: 轻量级知识索引与跨域分析，与主章节通过 `sources` 字段关联。

### _concepts/（50 个文件）
- **类型**: 概念卡片（Concept Cards）
- **大小**: 每张 5-9 KB
- **用途**: 单个核心概念的速查摘要
- **与主章节关系**: `sources` 字段指向主目录中的深度文档
- **索引**: [_concepts/README.md](./_concepts/README.md)
- **阅读路径**: 概念卡片 → 主章节深度文档

### _synthesis/（17 个文件）
- **类型**: 跨域综合文档（Cross-Domain Synthesis）
- **大小**: 每篇 1.7-4.5 KB
- **用途**: 连接 2-4 个不同章节的概念，揭示跨域关联
- **与主章节关系**: `sources` 字段列出关联的多个章节文档
- **索引**: [_synthesis/README.md](./_synthesis/README.md)

### _references/
- **类型**: 参考资料
- **用途**: 外部论文、书籍、课程的引用索引，含 PDF、课程索引等

### _projects/
- **类型**: 独立项目档案
- **用途**: 含独立构建配置的项目（如 Cloud_Ops_Agent），不属于知识章节

---

## 五、项目治理（_meta/）

> **定位**: 项目治理文件集中存放在 `_meta/` 目录，以下划线前缀命名，不出现在知识库导航中。

| 文件 | 用途 |
|------|------|
| `_project-evaluation.md` | 项目整体评估报告 |
| `_quality-assessment.md` | 全库质量评估 |
| `_content-gap-analysis.md` | 内容缺口分析 |
| `_Content_Evaluation_2026.md` | 内容评估报告 |
| `_Content_Gap_Analysis_Encyclopedia_2026.md` | 百科全书缺口分析 |
| `_Project_Comprehensive_Evaluation_2026.md` | 项目综合评估 |
| `_Project_Structure_Evaluation_2026.md` | 项目结构评估 |
| `_evaluation-2026-06-15.md` | 定期评估（日期标记） |
| `_llm-ecosystem-analysis-2026-06-15.md` | 专题分析（日期标记） |
| `_insights.md` | 知识洞见汇总 |
| `_lint-report.md` | 文档规范审计报告 |
| `_tag-taxonomy-report.md` | 标签分类报告 |
| `_wiki-digest.md` | Wiki 摘要 |
| `_wiki-status.md` | Wiki 状态报告 |
| `_directory-conventions.md` | 本文档（目录规范） |

**命名规则**: `_` 前缀 + kebab-case，如 `_project-evaluation.md`
**定期报告**: 附加日期后缀 `_xxx-YYYY-MM-DD.md`

---

## 六、暂存与归档

| 目录 | 用途 | 状态 |
|------|------|------|
| `_raw/` | 原始素材（未处理） | 暂存区，处理后移入正式目录 |
| `_staging/` | 待审核内容 & 生成缓存 | 含 `hot.md` 等运行时生成文件 |
| `_archives/` | 已归档的旧版本 | 长期保留，不再更新（含 `log.md`） |

**生命周期**: `_raw/` → `_staging/` → 主章节/辅助目录 → `_archives/`

---

## 七、工具与构建

| 目录 | 用途 |
|------|------|
| `Web/` | 知识库前端应用（Astro + TypeScript） |
| `_tools/` | 项目维护脚本（字数统计、链接检查、间距修复等） |
| `_concepts/` | 概念卡片（同时属于知识图谱层） |

---

## 八、根目录文件

> **定位**: 项目入口文件，保留在根目录。

| 文件 | 用途 |
|------|------|
| `README.md` | 项目主页（中文） |
| `README_EN.md` | 项目主页（英文） |
| `README_for_dummy.md` | 入门版说明 |
| `ROADMAP.md` | 年度规划 |
| `CONTRIBUTING.md` | 贡献指南 |
| `KNOWN_ISSUES.md` | 已知问题追踪 |
| `LICENSE` | MIT 许可证 |
| `index.md` | Wiki 索引页（自动生成） |
| `.gitignore` | Git 忽略规则 |

---

## 九、新增内容指南

### 应该放在哪里？

| 内容类型 | 放置位置 | 示例 |
|----------|----------|------|
| 某领域的深度技术文档 | 对应的主章节目录 | `05_NLP_LLMs/LLM_Architectures/xxx.md` |
| 某概念的速查卡片 | `_concepts/` | `_concepts/xxx.md` |
| 跨 2+ 领域的综合分析 | `_synthesis/` | `_synthesis/xxx-yyy.md` |
| 某个工具/产品的深度解析 | 最相关的章节 | `10_Deployment_Inference/xxx_Deep_Dive.md` |
| 项目治理报告 | `_meta/` | `_meta/_xxx-report.md` |
| 原始素材（待处理） | `_raw/` | `_raw/xxx.md` |

### 命名规范

| 场景 | 格式 | 示例 |
|------|------|------|
| 深度文档 | `{Topic}_Deep_Dive.md` | `vLLM_Deep_Dive.md` |
| 入门文档 | `{Topic}_for_dummy.md` | `RAG_Systems_for_dummy.md` |
| 速成文档 | `{Topic}-in-nutshell.md` | `ML-in-nutshell.md` |
| 年度专题 | `{Topic}_{Year}.md` | `AI_Infrastructure_2026.md` |
| 概念卡片 | `kebab-case.md` | `ai-agents.md` |
| 综合分析 | `topicA-topicB.md` | `multimodal-rag.md` |

---

## Related

- [[README]] — 项目主页
- [[ROADMAP]] — 年度规划
- [[_project-evaluation]] — 项目整体评估
- [[_content-gap-analysis]] — 内容缺口分析
