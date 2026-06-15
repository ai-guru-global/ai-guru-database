---
title: "技能库 (Skills)"
category: skills
tags: ["skills", "agent-skills", "capability", "tool"]
summary: "AI Agent 技能体系索引——技能定义、注册规范、组合模式与生态概览。"
created: 2026-06-12
updated: 2026-06-12
status: planned
---

# 技能库 (Skills)

> **定位**: AI Agent 技能的标准化定义与索引，为 Agent 开发提供可复用的技能组件。

## 与核心章节的关系

本目录是 [[13_Agent_Production/Agent_Skills]] 的补充索引，聚焦于技能的**独立定义**而非实现细节。

```
13_Agent_Production/Agent_Skills/ → 技能实现指南（如何创建和使用）
skills/                          → 技能定义索引（技能是什么）← 本目录
.claude/skills/                  → 工具链技能（Qoder/Pi 等工具技能）
```

## 规划中的技能分类

| 分类 | 示例技能 | 说明 |
|------|----------|------|
| **信息获取** | Web Search, Document Reader, API Caller | 从外部获取信息 |
| **数据处理** | Data Parser, Chart Generator, SQL Executor | 处理和转换数据 |
| **代码操作** | Code Editor, Test Runner, Git Manager | 代码相关操作 |
| **文件操作** | File Writer, PDF Generator, Image Processor | 文件创建和处理 |
| **通信协作** | Email Sender, Slack Poster, Calendar Manager | 通信和协作 |
| **推理分析** | Calculator, Logic Solver, Planner | 推理和分析 |

## 技能定义模板

```yaml
name: skill-name
category: information-retrieval
description: 一句话描述技能用途
inputs:
  - name: query
    type: string
    required: true
outputs:
  - name: results
    type: list
tools_required:
  - web_search
  - http_client
```

## 相关目录

- [[13_Agent_Production/Agent_Skills/Agent_Skills_Practical_Guide]] — Agent Skills 实战
- [[13_Agent_Production/Agent_Skills/Tool_Calling_Best_Practices]] — Tool Calling 最佳实践
- [[13_Agent_Production/Agent_Frameworks/README]] — Agent 框架概览
