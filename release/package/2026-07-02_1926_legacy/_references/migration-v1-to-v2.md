---
title: Agent Skills v1 到 v2 迁移指南
category: references
tags:
  - agent-skills
  - migration
  - v2
  - skill-spec
  - upgrade
summary: "Agent Skills 从 v1 迁移到 v2 的完整变更清单与操作步骤，覆盖文件结构、元数据、工具声明、权限模型和验证要点的升级。"
created: 2026-07-02
updated: 2026-07-02
---

# Agent Skills v1 到 v2 迁移指南

本指南帮助 Skill 作者将现有 v1 Skill 平滑升级到 v2 规范，避免在 Agent 运行时出现元数据解析失败或工具调用不匹配的问题。

## 关键变更概览

v2 在兼容性上做了一致性收紧，核心目标是让 Skill 在多 Agent 产品之间更容易互操作。主要变化集中在以下四方面：

- **元数据 schema**：`SKILL.md` frontmatter 从宽松键值对改为显式必填字段，新增 `spec_version`、`authors`、`license`。
- **工具声明**：`tools` 字段不再允许自由文本，必须遵循 `{name, description, parameters, returns}` 四段式结构。
- **权限模型**：新增 `permissions` 块，用于声明文件系统、网络、环境变量和子进程权限；v1 的 `dangerous` 布尔标志被移除。
- **示例与测试**：v2 要求每个 Skill 至少包含一个 `examples/` 示例和一个 `tests/` 验证用例。

## 迁移检查清单

### 1. 更新 `SKILL.md` frontmatter

| v1 写法 | v2 写法 | 说明 |
|--------|--------|------|
| `version: 1` | `spec_version: 2.0.0` | 明确使用语义化版本 |
| `title: xxx` | `title: xxx` | 保留，但建议不超过 60 字符 |
| （可选） | `authors: ["Name <email>"]` | 新增必填 |
| （可选） | `license: MIT` | 新增必填 |
| `tags: [a, b]` | `tags: ["a", "b"]` | 建议使用双引号字符串 |

### 2. 重构工具声明

v1 允许这样写：

```yaml
tools:
  - search_docs: 搜索文档，参数 query 为字符串
```

v2 要求显式参数定义：

```yaml
tools:
  - name: search_docs
    description: 根据 query 搜索本地文档索引
    parameters:
      - name: query
        type: string
        description: 搜索关键词
        required: true
    returns:
      type: array
      items:
        type: object
        properties:
          title: { type: string }
          url: { type: string }
```

### 3. 替换权限声明

将 v1 的单一标志：

```yaml
dangerous: true
```

替换为 v2 的细粒度声明：

```yaml
permissions:
  filesystem:
    read: ["./data", "./examples"]
    write: ["./output"]
  network: false
  env: ["OPENAI_API_KEY"]
  subprocess: false
```

### 4. 补充示例与测试

迁移完成后，确保目录结构满足 v2 最低要求：

```
my-skill/
├── SKILL.md
├── examples/
│   └── basic_usage.md
├── tests/
│   └── test_skill.py
└── README.md
```

## 推荐迁移步骤

1. **备份现有 Skill**：复制 `SKILL.md` 和工具脚本到临时目录。
2. **运行兼容性检查**：使用 `agent-skills lint --target v2` 查看所有不兼容项。
3. **按清单逐项修改**：先改 frontmatter，再改工具声明，最后补权限和示例。
4. **本地验证**：执行 `agent-skills test` 和 `agent-skills validate`。
5. **回归测试**：在 Claude Code、Cursor、Codex 等兼容 Agent 中各跑一遍示例。
6. **提交版本标签**：将 v1 Skill 标记为 `v1.x.x`，v2 Skill 标记为 `v2.0.0`。

## 常见坑点

- **类型推断失效**：v2 不再对未声明的参数做隐式推断，未声明的参数会被忽略。
- **返回值校验**：Agent 运行时可能根据 `returns` 校验输出格式，JSON 字段类型要一致。
- **路径权限**：如果 Skill 需要读取用户主目录，必须在 `permissions.filesystem.read` 中显式列出，不能再使用 `~` 或 `$HOME` 这类运行时展开写法。

## Related

- [[Agent/Agent_Skills/README|Agent Skills]]
- [[_references/index|References Index]]
- [[Agent/Agent_Skills/Skills-in-nutshell|Agent Skills 书写速览]]
- [[Agent/Agent_Skills/Skill_Versioning_Guide|Skill 版本管理与团队治理]]
- [[Agent/Agent_Skills/Agent_Skills_Deep_Dive|Agent Skills 深度解析]]
