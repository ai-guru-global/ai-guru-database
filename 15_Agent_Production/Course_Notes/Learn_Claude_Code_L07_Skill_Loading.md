---
title: Learn Claude Code L07 - Skill Loading
category: 15-agent-production
tags: [claude-code, agent-skills, skill-loading, course-notes]
summary: Claude Code 课程第 07 课笔记：Skill 的两级加载机制、SYSTEM 目录与按需注入。
created: 2026-07-02
updated: 2026-07-02
---

# Learn Claude Code L07 - Skill Loading

> **一句话理解**: Skill 两级加载把"目录级元数据"与"完整内容"分离，既保证上下文紧凑，又能在需要时注入完整能力。

---

## 核心要点

| 级别 | 内容 | 加载时机 |
|------|------|----------|
| 目录级 | Skill 名称、描述、入口、参数 schema | 系统启动 |
| 完整内容 | Prompt 模板、工具定义、示例、校验规则 | `load_skill` 调用 |

## 最佳实践

- 把稳定的元数据放在 SYSTEM 目录，运行时只加载需要用到的 Skill
- 使用延迟加载（lazy loading）控制上下文长度
- 为每个 Skill 定义清晰的输入输出 schema

## Related

- [[15_Agent_Production/Agent_Skills/Skills-in-nutshell|Agent Skills 速览]]
- [[15_Agent_Production/Course_Notes/Learn_Claude_Code_L08_Context_Compact|L08 Context Compact]]
- [[15_Agent_Production/Course_Notes/Learn_Claude_Code_L06_Subagent|L06 Subagent]]

---
*Last updated: 2026-07-02*
