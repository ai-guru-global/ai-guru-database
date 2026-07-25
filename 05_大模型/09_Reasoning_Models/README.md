---
title: 推理模型目录
category: 05-nlp-llms-reasoning-models
tags: ['reasoning', 'overview', 'index']
summary: 推理模型 相关内容的索引和概览。
created: 2026-06-12
updated: 2026-07-21
tier: peripheral
sources: []

---
# 推理模型

本目录包含 推理模型 相关的深度技术内容。

## 内容索引

## 页面列表

- [[05_大模型/09_Reasoning_Models/o1_Class_Reasoning_Models|o1-Class Reasoning Models]]
- [[05_大模型/09_Reasoning_Models/DeepSeek_R1_Technical_Analysis|DeepSeek R1 Technical Analysis]]
- [[05_大模型/09_Reasoning_Models/Process_Reward_Models|Process Reward Models]]
- [[05_大模型/09_Reasoning_Models/Neuro_Symbolic_and_Formal_Verification_2026|Neuro-symbolic and Formal Verification]]

## 相关页面

- [[05_大模型/09_Reasoning_Models/README|推理模型目录]]

## Related

- [[05_大模型/README|04 自然语言处理与大模型 (NLP & LLMs)]]

## 推理模型对比

| 模型 | 厂商 | 特点 | 适用 |
|------|------|------|------|
| o3 | OpenAI | 最强推理 | 复杂任务 |
| DeepSeek-R1 | 深度求索 | 开源 | 研究 |
| QwQ | 阿里 | 中文推理 | 中文 |
| Claude 3.5 | Anthropic | 思考模式 | 分析 |
| Gemini 2 | Google | 多模态推理 | 综合 |

## 训练方法对比

| 方法 | 说明 | 代表 |
|------|------|------|
| RLHF | 人类反馈强化 | GPT-4 |
| GRPO | 组相对策略 | DeepSeek-R1 |
| PRM | 过程奖励 | 数学推理 |
| 自我博弈 | 自我对弈 | 博弈论 |

## 学习路径

| 阶段 | 内容 | 目标 |
|------|------|------|
| 入门 | 推理模型概念 | 理解原理 |
| 进阶 | o1 类模型 | 技术解析 |
| 实践 | DeepSeek-R1 | 开源实现 |
| 拓展 | 神经符号 | 形式化验证 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 推理模型 vs 普通 LLM？ | 推理模型更慢但更准 |
| 何时使用？ | 复杂推理任务 |
| 成本如何？ | 更高（思考 token） |
| 开源选择？ | DeepSeek-R1/QwQ |

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 17 |
| 最后更新 | 2026-07-21 |

> 💡 推理模型代表了 LLM 的下一个前沿，让 AI 真正学会“思考”。

## 附录：评估基准

| 基准 | 说明 | 领先 |
|------|------|------|
| MATH | 数学推理 | o3 |
| GPQA | 研究生问答 | o3 |
| ARC-AGI | 抽象推理 | o3 |
| AIME | 数学竞赛 | R1 |
| LiveCodeBench | 代码 | o3 |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 推理规模化 | 测试时计算 | 效果提升 |
| 开源追赶 | R1/QwQ | 普及 |
| 多模态推理 | 视觉推理 | 新场景 |
| Agent 推理 | 工具调用 | 自动化 |

## 附录：思维链技术

| 技术 | 说明 | 效果 |
|------|------|------|
| CoT | 链式思维 | +20-40% |
| ToT | 树状搜索 | +15-30% |
| GoT | 图状推理 | 复杂任务 |
| Self-Consistency | 多路径投票 | +5-15% |
| ReAct | 推理+行动 | Agent |

## 附录：测试时计算

| 策略 | 说明 | 成本 |
|------|------|------|
| 多采样 | 多次生成 | 线性 |
| 束搜索 | 多路径 | 线性 |
| 验证器 | 结果验证 | 中 |
| 迭代深化 | 逐步深入 | 指数 |

## 附录：应用场景

| 场景 | 说明 | 模型 |
|------|------|------|
| 数学证明 | 形式化推理 | o3/R1 |
| 代码生成 | 复杂编程 | o3 |
| 科学发现 | 假设验证 | R1 |
| 法律分析 | 逻辑推理 | Claude |
| 金融建模 | 量化分析 | o3 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 推理 | Reasoning | 逻辑思考 |
| 思维链 | Chain-of-Thought | 逐步推理 |
| 测试时计算 | Test-Time Compute | 推理扩展 |
| 过程奖励 | Process Reward | 步骤评估 |
| 自我博弈 | Self-Play | 自我对弈 |

## 附录：成本对比

| 模型 | 输入 | 输出 | 思考 |
|------|------|------|------|
| o3 | $10/M | $40/M | 包含 |
| R1 | $0.55/M | $2.19/M | 包含 |
| GPT-4o | $2.5/M | $10/M | 无 |

## 附录：神经符号方法

| 方法 | 说明 | 代表 |
|------|------|------|
| 形式化验证 | 数学证明 | Lean/Coq |
| 符号推理 | 逻辑规则 | Prolog |
| 神经符号 | 混合方法 | Neuro-Symbolic |
| 程序合成 | 代码生成 | Sketch |

## 附录：推理模型架构

| 组件 | 说明 | 作用 |
|------|------|------|
| 思考 Token | 隐藏推理 | 内部思考 |
| 验证器 | 结果检查 | 质量保证 |
| 搜索 | 多路径 | 最优解 |
| 回溯 | 错误恢复 | 自我修正 |

## 附录：开源生态

| 项目 | 说明 | 特点 |
|------|------|------|
| DeepSeek-R1 | 推理模型 | MIT |
| QwQ | 阿里推理 | Apache |
| Open-R1 | 复现 | 社区 |
| PRM800K | 过程奖励数据 | 数学 |

## Related

- [[05_大模型/08_Prompt_Engineering/index|Prompt Engineering]]
- [[05_大模型/index|大模型首页]]
- [[概念/reasoning|推理概念]]

## 附录：推理能力评估

| 能力 | 基准 | 说明 |
|------|------|------|
| 数学 | MATH/GSM8K | 数值推理 |
| 逻辑 | LogiQA | 形式逻辑 |
| 代码 | HumanEval | 编程推理 |
| 科学 | GPQA | 专业知识 |
| 常识 | ARC | 抽象推理 |

> 💡 推理模型正在重新定义 AI 的能力边界，从“快速回答”到“深度思考”。

## 附录：推理模型选择

| 场景 | 推荐 |
|------|------|
| 数学 | o3/R1 |
| 代码 | o3 |
| 通用 | Claude |

## 附录：参考

| 资源 | 说明 |
|------|------|
| DeepSeek-R1 | 开源推理 |

---
*Last updated: 2026-07-21*
