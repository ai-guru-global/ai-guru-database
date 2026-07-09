---
title: "Transformers Agents: HuggingFace Agent 框架"
category: "15-agent-production-agent-frameworks"
tags: ["ai-agents", "agent-framework", "production", "langgraph", "transformer"]
summary: "> **一句话理解**: Transformers Agents 是 HuggingFace 的 Agent 开发框架——基于 Transformers 模型，支持多工具调用、代码生成、视觉理解，原生集成 HuggingFace 生态。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Transformers Agents Deep Dive"
  - Transformers_Agents_Deep_Dive

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Transformers Agents: HuggingFace Agent 框架

> **一句话理解**: Transformers Agents 是 HuggingFace 的 Agent 开发框架——基于 Transformers 模型，支持多工具调用、代码生成、视觉理解，原生集成 HuggingFace 生态。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [工具系统](#5-工具系统)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Transformers Agents: HuggingFace Agent 框架
═══════════════════════════════════════════════════════════════════

定位: HuggingFace 官方的 Agent 开发框架，基于 Transformers 模型

核心理念:
───────────────────────────────────────────────────────────────────
• 生态集成: 原生集成 HuggingFace Hub
• 多模态: 支持视觉、语音、文本
• 工具丰富: 搜索、代码、文档
• 简单易用: 几行代码构建 Agent
• 开源免费: 完全免费
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **多模型支持** | GPT、LLaMA、Claude 等 |
| **工具调用** | 100+ 内置工具 |
| **代码生成** | 直接执行 Python |
| **视觉理解** | 图像分析和生成 |
| **语音处理** | 语音转文本/语音 |
| **流式输出** | 支持流式响应 |

---

## 2. 核心概念

### 2.1 Agent 类型

```
Transformers Agents 类型
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Agent 类型                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ReactAgent (React 代理)                                        │
│  ├── 思考-行动-观察循环                                         │
│  ├── 适合复杂推理                                               │
│  └── 使用工具解决问题                                           │
│                                                                  │
│  CodeAgent (代码代理)                                           │
│  ├── 生成并执行代码                                             │
│  ├── 适合数据分析                                               │
│  └── 内置 Python 解释器                                         │
│                                                                  │
│  ReactJsonAgent (结构化 JSON)                                  │
│  ├── 输出结构化 JSON                                           │
│  ├── 适合 API 调用                                             │
│  └── 可控性强                                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 工具系统

| 类别 | 工具 | 说明 |
|------|------|------|
| **搜索** | web_search, wikipedia | 搜索信息 |
| **文档** | read_file, document_qa | 文档处理 |
| **代码** | python_executor, code_interpreter | 代码执行 |
| **视觉** | image_generator, image_qa | 图像处理 |
| **数据** | pandas_agent, database_qa | 数据分析 |

---

## 3. 架构设计

### 3.1 ReAct 执行流程

```
ReAct Agent 执行流程
═══════════════════════════════════════════════════════════════════

用户: "搜索最新 AI 新闻并总结"

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: 思考                                                     │
│ ───────────────────────────────────────────────────────────────  │
│ Agent: 需要先搜索 AI 新闻，然后总结                              │
│ Action: web_search                                              │
│ Action Input: {"query": "latest AI news 2026"}                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: 观察                                                     │
│ ───────────────────────────────────────────────────────────────  │
│ Observation: [AI 新突破, GPT-5 发布, ...]                       │
│ Thought: 搜索到结果，需要总结                                     │
│ Action: summarize                                               │
│ Action Input: {"text": "AI 新闻列表"}                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: 完成                                                     │
│ ───────────────────────────────────────────────────────────────  │
│ Final Answer: 总结了最新的 AI 新闻...                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install transformers[agents]
```

### 4.2 基础使用

```python
from transformers import Agent, ReactJsonAgent
from transformers.tools import WebSearchTool, CalculatorTool

# 创建工具
search = WebSearchTool()
calculator = CalculatorTool()

# 创建 Agent
agent = ReactJsonAgent(
    tools=[search, calculator],
    model="meta-llama/Meta-Llama-3-70B-Instruct"
)

# 执行任务
result = agent.run("搜索量子计算最新进展，然后计算 2^10")
print(result)
```

### 4.3 Code Agent

```python
from transformers import CodeAgent

# 创建代码代理
code_agent = CodeAgent(
    tools=[],  # 可添加自定义工具
    model="meta-llama/Meta-Llama-3-70B-Instruct"
)

# 执行数据分析
result = code_agent.run("""
读取 data.csv，计算每列的平均值，
然后生成一个可视化图表保存为 chart.png
""")
```

### 4.4 多模态 Agent

```python
from transformers import Agent
from transformers.tools import ImageGenerationTool, ImageQATool

# 创建视觉工具
image_gen = ImageGenerationTool()
image_qa = ImageQATool()

# 创建多模态 Agent
agent = Agent(
    tools=[image_gen, image_qa],
    model="meta-llama/Meta-Llama-3-70B-Instruct"
)

# 执行任务
result = agent.run("生成一张 AI 未来城市的图片，然后描述它")
```

---

## 5. 工具系统

### 5.1 内置工具

```python
from transformers.tools import (
    # 搜索
    WebSearchTool,
    WikipediaSearchTool,
    # 文档
    ReadFileTool,
    DocumentQATool,
    # 代码
    PythonExecutorTool,
    CodeInterpreterTool,
    # 视觉
    ImageGenerationTool,
    ImageQATool,
    # 数据
    PandasTool,
    DatabaseQATool,
)
```

### 5.2 自定义工具

```python
from transformers import Tool
from pydantic import BaseModel

class WeatherTool(Tool):
    name = "weather"
    description = "获取指定城市的天气信息"

    inputs = {
        "city": {"type": "string", "description": "城市名称"}
    }
    output_type = "string"

    def forward(self, city: str) -> str:
        # 实现天气查询
        return f"{city} 天气晴朗，25°C"

# 使用自定义工具
agent = Agent(tools=[WeatherTool()])
```

---

## 6. 对比与选择

### 6.1 与其他 Agent 框架对比

| 维度 | HF Agents | LangChain | AutoGen |
|------|------------|-----------|---------|
| **生态** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **工具** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **多模态** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **生产就绪** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| HuggingFace 生态 | HF Agents |
| 复杂工作流 | LangChain Agent |
| 多 Agent 协作 | AutoGen |

---

## 参考资源

- [Transformers Agents 文档](https://huggingface.co/docs/transformers/main/en/transformers_agents)
- [HF Tools](https://huggingface.co/docs/transformers/main/en/task_summary)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[Agent/Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[Agent/Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[Agent/Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[Agent/Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[Agent/Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
