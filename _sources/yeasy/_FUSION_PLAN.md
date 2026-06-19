# Yeasy AI 知识库融合计划

> 创建日期: 2026-06-16
> 状态: 执行中

## 源仓库概览

全部来自 [yeasy](https://github.com/yeasy) 的 GitBook 系列，共 9 本书，962 个 Markdown 文件，约 33MB。

| 仓库 | 中文名 | MD 文件数 | 大小 |
|------|--------|----------|------|
| `ai_beginner_guide` | AI 入门指南 | 115 | 11M |
| `prompt_engineering_guide` | 大模型提示词工程指南 | 115 | 1.8M |
| `context_engineering_guide` | 大模型上下文工程权威指南 | 118 | 2.3M |
| `claude_guide` | Claude 技术指南 | 102 | 5.1M |
| `agentic_ai_guide` | 智能体 AI 权威指南 | 92 | 1.9M |
| `harness_engineering_guide` | 智能体 Harness 工程指南 | 108 | 3.8M |
| `openclaw_guide` | OpenClaw 从入门到精通 | 112 | 2.7M |
| `ai_security_guide` | 大模型安全权威指南 | 92 | 1.7M |
| `llm_internals` | 大模型原理与架构 | 108 | 2.6M |

## 融合映射

| 源仓库 | 目标目录 | 融合策略 |
|--------|---------|---------|
| `ai_beginner_guide` | `00_AI_Introduction/` | AI 入门基础，补充现有概览 |
| `prompt_engineering_guide` | `04_NLP_LLMs/` | 提示词工程，归入 LLM 应用 |
| `context_engineering_guide` | `04_NLP_LLMs/` | 上下文工程，与提示词工程并列 |
| `llm_internals` | `04_NLP_LLMs/` | 模型原理架构，深化 LLM 底层 |
| `claude_guide` | `17_AI_Coding/` | Claude 工具使用与 AI 编码 |
| `agentic_ai_guide` | `13_Agent_Production/` | 智能体架构核心 |
| `harness_engineering_guide` | `13_Agent_Production/` | 智能体工程基础设施 |
| `openclaw_guide` | `13_Agent_Production/` | 开源智能体框架实践 |
| `ai_security_guide` | `19_Ethics_Safety/` | 安全攻防 |

## 执行步骤

### Phase 1: 结构扫描
- 读取每本书的 `SUMMARY.md`，了解章节组织
- 识别各书之间的交叉主题

### Phase 2: 内容蒸馏与融合
- 按映射关系逐本蒸馏核心知识
- 提取关键概念、最佳实践、代码示例
- 转为 wiki 标准格式（frontmatter + 正文 + wikilinks）
- 去重合并，避免内容冗余

### Phase 3: 交叉链接
- 在新增页面间建立 wikilink
- 与现有页面建立关联
- 更新 `index.md` 和 `hot.md`

### Phase 4: 冲突处理
- 与已有内容重叠部分做合并而非覆盖
- 保留现有内容的深度，补充新的视角和案例
