---
title: "Agent Skill 通用参考规范"
category: references
tags: ["agent", "skill", "spec", "reference", "best-practices"]
summary: "Agent Skill 文档的文件结构、元数据、引用约定与最佳实践参考。"
created: 2026-07-02
updated: 2026-07-02
sources: []
---

# Agent Skill 通用参考规范

本规范为 `Agent/Agent_Skills/` 下的 Skill 文档提供统一的文件结构、元数据、引用约定与最佳实践，确保 Skill 定义可被 Agent 框架、自动化工具与人工审阅一致地解析和使用。

## 文件结构

每个 Skill 文档建议使用以下分层结构：

1. **Frontmatter**：YAML 元数据，包含 title、category、tags、summary、created、updated、version、author 等字段。
2. **概述**：用 2-4 句话说明 Skill 解决什么问题、输入输出是什么、适用场景。
3. **接口定义**：列出参数、返回值、类型与约束，优先使用表格呈现。
4. **示例**：至少一个可运行的最小示例，包含输入、调用与输出。
5. **错误处理**：常见异常、错误码与降级策略。
6. **依赖与引用**：依赖的其他 Skill、工具、模型或外部 API。
7. **版本与变更**：版本号、变更日志、兼容性说明。

## 元数据约定

Frontmatter 字段应保持一致：

- `title`：Skill 中文或英文名称，避免缩写。
- `category`：固定为 `agent-skills` 或所属子分类，如 `agent-skills/reasoning`。
- `tags`：3-8 个关键词，覆盖功能、领域、技术栈。
- `summary`：一句话描述，不超过 120 字。
- `created` / `updated`：ISO 日期 `YYYY-MM-DD`。
- `version`：语义化版本，如 `1.2.0`。
- `authors`：维护者列表，可选。
- `status`：`draft`、`stable`、`deprecated` 之一。

## 字段类型与命名

参数命名采用 `snake_case`，避免与编程语言关键字冲突。常用类型：

- `string`：文本输入，建议附加 `max_length` 与格式约束。
- `number` / `integer`：数值，需标注单位、精度与取值范围。
- `boolean`：仅用于明确的开关语义。
- `enum`：有限选项，必须列出所有合法值及其含义。
- `datetime`：统一为 ISO 8601，如 `2026-07-02T14:58:54+08:00`。
- `filepath`：相对路径优先，避免硬编码绝对路径。
- `json`：复杂对象应给出 JSON Schema 或示例。

## 引用约定

- 引用知识库内部页面使用 Obsidian wikilink：`[[Agent/Agent_Skills/README|Agent Skills]]`。
- 引用外部资源使用 Markdown 标准链接，并注明访问日期：`[OpenAI API](https://platform.openai.com/docs) (访问于 2026-07-02)`。
- 引用其他 Skill 时使用相对路径或 wikilink，确保在移动文件后不中断。
- 避免使用裸 URL，统一用链接文本描述目标内容。

## 最佳实践

- **单一职责**：一个 Skill 只做一件事，复杂流程拆分为多个子 Skill。
- **可测试性**：每个 Skill 提供测试用例，覆盖正常路径、边界条件与异常路径。
- **幂等性**：相同输入应产生相同输出，避免副作用不可预期。
- **最小权限**：调用外部 API 时仅申请必要的权限与范围。
- **文档与代码同步**：接口变更时同步更新文档版本号与示例。
- **可观测性**：关键步骤记录日志，输出包含 trace_id 或类似追踪标识。
- **向后兼容**：破坏性变更必须通过 major 版本升级，并在文档中标注迁移路径。

## 示例 Frontmatter

```yaml
---
title: "文本摘要 Skill"
category: agent-skills
tags: ["nlp", "summarization", "llm"]
summary: "对长文本生成结构化摘要，支持指定输出长度与风格。"
created: 2026-07-02
updated: 2026-07-02
version: "2.0.0"
status: stable
---
```

## Related

- [[Agent/Agent_Skills/README|Agent Skills]]
- [[_references/index|References Index]]
- [[_references/common-field-types|Common Field Types]]
- [[_references/statistics|Statistics]]
- [[_references/migration-v1-to-v2|Migration v1 to v2]]
