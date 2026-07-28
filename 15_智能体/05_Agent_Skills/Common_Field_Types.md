---
title: 常见 Skill 字段类型与命名约定
category: references
tags:
  - agent-skills
  - schema
  - fields
  - conventions
summary: 本文定义 Agent Skill 规范中常见的字段类型、命名规则与取值约定，供 Skill 作者在设计输入/输出、配置项和元数据时参考。
created: 2026-07-02
updated: 2026-07-02
sources: []
name_zh: "常见 Skill 字段类型与命名约定"
---

# 常见 Skill 字段类型与命名约定

> 中文简称：常见 Skill 字段类型与命名约定

Skill 的输入、输出与配置项需要一致的类型定义，才能在多个 Agent 之间稳定复用。本文归纳最常用的字段类型、命名风格、校验建议与反例，帮助 Skill 作者快速定义清晰可维护的接口。

## 1. 基础标量类型

| 类型 | 推荐写法 | 说明 | 示例 |
|------|----------|------|------|
| 字符串 | `string` | 长度限制需在 schema 中声明；优先枚举替代自由文本 | `"completed"` |
| 整数 | `integer` | 注明是否允许负数与零 | `42` |
| 浮点数 | `number` / `float` | 明确精度与舍入规则 | `3.14159` |
| 布尔值 | `boolean` | 避免使用 `0/1` 代替 `true/false` | `true` |
| 空值 | `null` | 用于显式缺失，不建议与 `""` 混用 | `null` |

## 2. 复合类型

- **数组（array）**：元素类型必须单一，命名建议使用复数形式，如 `tags`、`records`。
- **对象（object）**：键应稳定，避免动态键；若必须动态，请改用 `key_value_pairs` 数组结构。
- **JSON / any**：仅在无法预先定义 schema 时使用，且必须在文档中说明序列化格式与最大体积。

## 3. 枚举类型

枚举应使用全大写蛇形命名（`SCREAMING_SNAKE_CASE`），并在描述中解释每个取值的语义。

```yaml
status:
  type: string
  enum: [PENDING, RUNNING, COMPLETED, FAILED]
```

新增枚举值时，应在文档变更日志中标记为向后兼容扩展。

## 4. 日期与时间

| 类型 | 格式 | 说明 |
|------|------|------|
| 日期 | `YYYY-MM-DD` | ISO 8601 日期 |
| 时间 | `HH:MM:SS` 或 `HH:MM:SSZ` | 建议统一使用 UTC |
| 日期时间 | `YYYY-MM-DDTHH:MM:SSZ` | 必须带时区或声明为 UTC |
| 时间戳 | 整数秒或毫秒 | 在字段名中注明 `at_s` / `at_ms` |

字段名推荐：`created_at`、`updated_at`、`started_at`、`expired_at`。

## 5. 文件路径与资源引用

- 本地相对路径使用 POSIX 风格，如 `data/samples/input.json`。
- 避免硬编码绝对路径。
- 资源 ID 建议使用统一前缀，例如 `asset://`、`run://`、`skill://`。
- 文件字段名使用 `_path` 或 `_url` 后缀，如 `input_path`、`model_url`。

## 6. 命名约定

- **snake_case**：用于字段名、配置键、数据库列名，如 `max_tokens`、`retry_count`。
- **camelCase**：仅在需要兼容外部 JSON 协议时使用，需在文档中声明。
- **kebab-case**：用于命令行参数或文件名，如 `--dry-run`。
- **SCREAMING_SNAKE_CASE**：用于枚举值与环境变量名，如 `LOG_LEVEL`。

## 7. 常见字段命名清单

| 语义 | 推荐字段名 |
|------|------------|
| 唯一标识 | `id`、`task_id`、`run_id` |
| 名称/标题 | `name`、`title`、`display_name` |
| 描述 | `description`、`summary` |
| 状态 | `status`、`state` |
| 数量 | `count`、`total`、`limit`、`offset` |
| 分数 | `score`、`confidence`、`probability` |
| 时间 | `created_at`、`updated_at`、`finished_at` |
| 错误 | `error`、`error_code`、`error_message` |
| 配置 | `config`、`options`、`parameters` |

## 8. 校验建议

- 必填字段在 schema 中显式声明 `required`。
- 字符串字段声明 `minLength`、`maxLength` 或正则约束。
- 数值字段声明 `minimum`、`maximum` 与是否允许小数。
- 数组字段声明 `minItems`、`maxItems` 与元素唯一性。
- 对象字段提供 `additionalProperties: false` 或显式允许扩展属性。

## 9. 反例

| 不推荐 | 问题 | 推荐 |
|--------|------|------|
| `isDone` | 风格不一致 | `is_done` |
| `data` | 语义模糊 | `records` / `payload` |
| `value` | 缺少单位 | `temperature_celsius` |
| `timestamp` | 单位不明 | `created_at_ms` |
| `"yes"` / `"no"` | 非标准布尔 | `true` / `false` |

## 10. 版本与兼容性

Skill schema 升级时，遵循以下原则：

1. 不删除已发布字段，仅标记为 `deprecated`。
2. 不更改现有字段的类型或格式。
3. 新增字段时提供默认值，避免破坏旧调用方。
4. 在变更日志中记录字段级别的变更。

## Related

- [[15_智能体/05_Agent_Skills/README|Agent Skills]]
- [[90_学习/References/index|References Index]]
- [[15_智能体/05_Agent_Skills/Agent_Skill_Reference|Agent Skill Reference]]
- [[01_数学基础/03_Probability_Statistics/Skill_Statistics_Cheatsheet|Skill Statistics]]
- [[15_智能体/05_Agent_Skills/Skill_Mapping_Guide|Skill Mapping]]

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*

## 快速参考

| 维度 | 要点 | 备注 |
|------|------|------|
| 核心概念 | 理解基本原理和设计动机 | 理论基础 |
| 技术选型 | 根据场景选择合适方案 | 实践指导 |
| 最佳实践 | 遵循行业标准做法 | 质量保障 |
| 常见陷阱 | 避免已知问题和反模式 | 经验总结 |
| 发展趋势 | 关注技术演进方向 | 前瞻视野 |

## 延伸阅读

| 资源 | 类型 | 适用阶段 |
|------|------|----------|
| 官方文档 | 参考手册 | 全阶段 |
| 技术博客 | 深度分析 | 进阶 |
| 开源项目 | 代码实践 | 实战 |
| 学术论文 | 前沿研究 | 精通 |
| 社区讨论 | 经验交流 | 全阶段 |

## 检查清单

- [ ] 核心概念已理解并能向他人解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案的优劣势
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态和趋势
