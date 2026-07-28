---
title: Prompt Engineering
type: index
created: 2026-07-02
updated: 2026-07-21
sources: []
name_zh: "提示工程"
name_en: "Prompt Engineering"
---

# Prompt Engineering

> 中文简称：提示工程 ｜ English Name: Prompt Engineering

提示工程 — 系统化设计、优化和评估 LLM 输入提示的技术与实践。

## 子域简介

本子域聚焦提示工程技术：

- **基础原则**: 清晰指令、角色设定、少样本示例
- **高级技术**: CoT、ToT、ReAct、自一致性
- **上下文工程**: 上下文窗口管理与优化
- **结构化输出**: JSON/Schema 约束生成
- **自动优化**: DSPy、自动提示搜索

## Files

- [[05_大模型/08_Prompt_Engineering/Context_Engineering_Guide|Context Engineering Guide]]
- [[05_大模型/08_Prompt_Engineering/Context_Engineering_Patterns|Context Engineering Patterns]]
- [[05_大模型/08_Prompt_Engineering/DSPy_Deep_Dive|Dspy Deep Dive]]
- [[05_大模型/08_Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals|Genai L04 Prompt Engineering Fundamentals]]
- [[05_大模型/08_Prompt_Engineering/GenAI_L05_Advanced_Prompts|Genai L05 Advanced Prompts]]
- [[05_大模型/08_Prompt_Engineering/Guidance_Deep_Dive|Guidance Deep Dive]]
- [[05_大模型/08_Prompt_Engineering/Hello_Agents_L04_ReAct|Hello Agents L04 React]]
- [[05_大模型/08_Prompt_Engineering/Hello_Agents_L09_Context_Engineering|Hello Agents L09 Context Engineering]]
- [[05_大模型/08_Prompt_Engineering/Instructor_Deep_Dive|Instructor Deep Dive]]
- [[05_大模型/08_Prompt_Engineering/Outlines_Deep_Dive|Outlines Deep Dive]]
- [[05_大模型/08_Prompt_Engineering/Prompt-Engineering-in-nutshell|Prompt Engineering In Nutshell]]
- [[05_大模型/08_Prompt_Engineering/Prompt_Engineering|Prompt Engineering]]
- [[05_大模型/08_Prompt_Engineering/Prompt_Engineering_Advanced_Apps|Prompt Engineering Advanced Apps]]
- [[05_大模型/08_Prompt_Engineering/Prompt_Engineering_Complete_Guide|Prompt Engineering Complete Guide]]
- [[05_大模型/08_Prompt_Engineering/Prompt_Engineering_for_dummy|Prompt Engineering For Dummy]]
- [[05_大模型/08_Prompt_Engineering/Prompt_Engineering_Principles_Ng|Prompt Engineering Principles Ng]]
- [[05_大模型/08_Prompt_Engineering/Prompt_Engineering_Templates_Patterns|Prompt Engineering Templates Patterns]]
- [[05_大模型/08_Prompt_Engineering/README|README]]

## 核心概念速查

| 概念 | 说明 | 代表技术 |
|------|------|------|
| Zero-shot | 无示例直接提问 | 基础提示 |
| Few-shot | 少样本示例引导 | In-Context Learning |
| CoT | 链式思维推理 | Step-by-step |
| ToT | 树状搜索推理 | 多路径探索 |
| ReAct | 推理+行动 | Agent 框架 |
| 上下文工程 | 窗口内容优化 | RAG+压缩 |

## 提示技术对比

| 技术 | 复杂度 | 适用场景 | 效果提升 |
|------|------|------|------|
| Zero-shot | 低 | 简单任务 | 基线 |
| Few-shot | 低 | 格式敏感 | +10-20% |
| CoT | 中 | 推理任务 | +20-40% |
| Self-Consistency | 中 | 数学/逻辑 | +5-15% |
| ToT | 高 | 复杂规划 | +15-30% |
| ReAct | 高 | 工具调用 | 任务完成↑ |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|------|------|
| 入门 | Prompt_Engineering_for_dummy | 基本概念 |
| 基础 | GenAI_L04_Fundamentals | 核心原则 |
| 进阶 | GenAI_L05_Advanced_Prompts | 高级技术 |
| 实践 | Prompt_Engineering_Templates_Patterns | 模板应用 |
| 自动化 | DSPy_Deep_Dive | 自动优化 |
| 上下文 | Context_Engineering_Guide | 窗口管理 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 提示工程是否会被淘汰？ | 不会，演变为上下文工程 |
| CoT 何时使用？ | 多步推理任务 |
| 如何减少幻觉？ | 提供上下文+要求引用 |
| 温度如何设置？ | 创意高、精确低 |
| 结构化输出用什么？ | Instructor/Outlines |

## Related

- [[05_大模型/13_LLM_Products/index|LLM Products]]
- [[05_大模型/09_Reasoning_Models/index|Reasoning Models]]
- [[05_大模型/index|大模型首页]]
- [[概念/prompt-engineering|提示工程概念]]

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 18 |
| 最后更新 | 2026-07-21 |

> 💡 提示工程是与 LLM 沟通的艺术，好的提示可以释放模型 10x 的潜能。

## 附录：提示设计模式

| 模式 | 说明 | 示例 |
|------|------|------|
| 角色设定 | 赋予专家身份 | "你是资深律师" |
| 分步指令 | 拆解复杂任务 | "第1步...第2步..." |
| 输出格式 | 约束返回结构 | "以JSON返回" |
| 反面示例 | 说明不要什么 | "不要编造" |
| 思维链 | 引导逐步推理 | "让我们一步步思考" |
| 自检验 | 要求验证答案 | "检查你的答案" |

## 附录：工具链

| 工具 | 用途 | 特点 |
|------|------|------|
| DSPy | 自动提示优化 | 编程式 |
| Guidance | 结构化生成 | 模板引擎 |
| Instructor | JSON 输出 | Pydantic |
| Outlines | 约束解码 | 正则/Schema |
| LangChain | 提示管理 | 链式调用 |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 上下文工程 | 从提示到全局上下文 | 范式升级 |
| 自动优化 | DSPy/APE | 减少手工 |
| 多模态提示 | 图像+文本提示 | 新场景 |
| Agent 提示 | 工具调用设计 | 复杂任务 |
| 评估驱动 | 自动化评估 | 质量保障 |

## 附录：提示评估指标

| 指标 | 说明 | 工具 |
|------|------|------|
| 任务完成率 | 正确完成任务比例 | 自定义评估 |
| 一致性 | 多次运行结果稳定 | 自一致性检查 |
| 效率 | Token 消耗与延迟 | 成本分析 |
| 安全性 | 抵抗注入攻击 | 红队测试 |
| 可迁移性 | 跨模型表现 | 多模型对比 |

## 附录：上下文窗口管理

| 策略 | 说明 | 适用 |
|------|------|------|
| 截断 | 保留最新内容 | 对话场景 |
| 摘要 | 压缩历史信息 | 长对话 |
| RAG | 检索相关片段 | 知识密集 |
| 分层 | 系统+用户+助手 | 结构化 |
| 动态加载 | 按需插入上下文 | Agent |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 提示 | Prompt | 输入给模型的文本 |
| 系统提示 | System Prompt | 设定角色和规则 |
| 思维链 | Chain-of-Thought | 逐步推理 |
| 幻觉 | Hallucination | 生成虚假信息 |
| 注入 | Injection | 恶意提示攻击 |
| 温度 | Temperature | 控制随机性 |

## 附录：行业应用场景

| 场景 | 提示策略 | 关键要点 |
|------|------|------|
| 代码生成 | 明确语言+约束+示例 | 指定框架和风格 |
| 文案写作 | 角色+风格+受众 | 多版本迭代 |
| 数据分析 | 结构化输入+分步 | 要求解释推理 |
| 客服机器人 | 系统提示+知识库 | 安全护栏 |
| 教育辅导 | 苏格拉底式引导 | 不直接给答案 |
| 法律合同 | 精确指令+模板 | 免责声明 |
| 医疗咨询 | 严格约束+引用 | 建议就医 |

## 附录：提示工程 vs 微调

| 维度 | 提示工程 | 微调 |
|------|------|------|
| 成本 | 低 | 高 |
| 迭代速度 | 快 | 慢 |
| 效果上限 | 中 | 高 |
| 数据需求 | 少 | 多 |
| 适用场景 | 通用任务 | 领域专精 |
| 维护难度 | 低 | 中 |

## 附录：提示安全最佳实践

| 实践 | 说明 |
|------|------|
| 输入过滤 | 检测注入攻击 |
| 输出验证 | 检查有害内容 |
| 权限分离 | 系统/用户提示分层 |
| 日志审计 | 记录异常提示 |
| 速率限制 | 防止滥用 |

## 快速导航

| 需求 | 推荐 |
|------|------|
| 入门 | Prompt_Engineering_for_dummy |

---
*Last updated: 2026-07-21*
