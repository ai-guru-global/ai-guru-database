---
title: Agent 论文精读 (Agent Papers)
category: 06-papers
tags: ["agent", "react", "toolformer", "voyager", "autogpt"]
summary: "Agent 核心论文精读：ReAct/Toolformer/Voyager/AutoGPT/Reflexion，每篇含核心思想、架构、实验与后续影响。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "Agent 论文精读"
---
# Agent 论文精读 (Agent Papers)

> 中文简称：Agent 论文精读

## 1. 论文列表

| 论文 | 年份 | 机构 | 核心贡献 |
|------|------|------|----------|
| ReAct | 2022 | Princeton/Google | 推理+行动交替 |
| Toolformer | 2023 | Meta | LLM 自学使用工具 |
| Reflexion | 2023 | Northeastern | 自我反思改进 |
| Voyager | 2023 | NVIDIA | 终身学习 Agent |
| AutoGPT | 2023 | 开源 | 自主任务分解 |
| SWE-Agent | 2024 | Princeton | 代码修复 Agent |
| OpenAI o3 | 2025 | OpenAI | 推理+工具深度整合 |

## 2. ReAct (2022)

```
核心思想: 将推理 (Reasoning) 和行动 (Acting) 交替进行

传统:
- 纯推理 (CoT): 想很多但不做 → 幻觉
- 纯行动: 直接做不想 → 盲目

ReAct:
  Thought: 我需要查找 X 的信息
  Action: search("X 的定义")
  Observation: X 是...
  Thought: 现在我知道了 X, 接下来需要...
  Action: lookup("Y")
  Observation: ...
  Thought: 综合以上信息, 答案是...
  Answer: 最终答案

实验:
- HotpotQA: ReAct 55.8% vs CoT 48.3%
- 减少幻觉: 有外部信息验证
- 可解释: 每步都有推理过程

影响:
- 成为 Agent 设计的基础范式
- LangChain/AutoGPT 都基于 ReAct
- 后续: ReWoo / LATS / 树搜索
```

## 3. Toolformer (2023)

```
核心思想: LLM 通过自监督学习何时/如何调用工具

训练流程:
1. 用少量示例让 LLM 生成 "可能使用工具" 的文本
2. 对每个工具调用, 验证是否真的有帮助
3. 只保留 "用了工具后困惑度降低" 的样本
4. 用过滤后的数据微调 LLM

工具: 计算器/问答系统/搜索引擎/翻译/日历

关键创新:
- 自监督: 不需要人工标注何时用工具
- 多工具: 一个模型学会多种工具
- 自主决策: 模型自己决定是否/何时/用哪个工具

影响:
- 开启了 "LLM 自主学习工具使用" 方向
- 后续: Gorilla / ToolLLM / API-Bank
```

## 4. Voyager (2023)

```
核心思想: Minecraft 中的终身学习 Agent

三大组件:
1. 自动课程: AI 自动提出越来越难的任务
2. 技能库: 将成功的行为存为可复用代码
3. 迭代改进: 环境反馈 → 修改代码 → 重试

关键创新:
- 终身学习: 不断积累新技能
- 代码即技能: 用 JavaScript 代码表示行为
- 零人工: 完全自主探索和学习

影响:
- 展示了 LLM Agent 的终身学习潜力
- 技能库思想 → 后续 Agent 记忆系统
```

## 5. 交叉引用

- [[20_论文精读/|论文精读]]
- [[20_论文精读/08_计算机视觉/index|多模态论文]]
- [[20_论文精读/11_领域综述/04_推理_论文|推理论文]]
- [[15_智能体/|智能体]]
- [[06_强化学习/04_强化学习应用/03_RL_for_LLM_推理|RL 推理]]
