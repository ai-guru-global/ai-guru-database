---
title: "L15 浏览器使用 Agent (CUA)：Browser-Use + Playwright + CDP 混合架构"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - browser-use
  - computer-use-agent
  - playwright
  - cdp
  - web-automation
sources:
  - "原始/github-sources/ai-agents-for-beginners/15-browser-use/README.md"
summary: "Microsoft AI Agents 课程第15课：构建 Computer Use Agent——像人一样打开浏览器、看页面、采取行动。Browser-Use 视觉导航 + Playwright/CDP 确定性控制 + Azure OpenAI Vision + Pydantic 结构化抽取。覆盖 Agent vs Actor 模式选型与 7 条最佳实践。"
provenance:
  extracted: 0.86
  inferred: 0.12
  ambiguous: 0.02
base_confidence: 0.84
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Microsoft Ai Agents L15 Browser Use"
  - "Microsoft AI Agents L15 Browser Use"
  - Microsoft_AI_Agents_L15_Browser_Use

---
# L15 浏览器使用 Agent (CUA)

> 来源：[Microsoft AI Agents for Beginners / 15-browser-use](https://github.com/microsoft/ai-agents-for-beginners/tree/main/15-browser-use)

## 学习目标

完成本课后，你将能够：

- 配置 Browser-Use + Azure OpenAI + Playwright
- 构建浏览真实网站、处理动态 UI 的浏览器自动化工作流
- 从可见页面内容抽取类型化结果，转为下游业务逻辑
- 根据"任务可预测度"在 Agent / Actor / 混合模式间选型

---

## 一、Computer Use Agent 是什么

**CUA** 是能像人一样与网站交互的 Agent：打开浏览器、查看页面、根据所见采取下一步行动。

**vs API 自动化**：当目标网站**没有 API**或 API 不完整时，CUA 是唯一选项^[inferred]。

### 本课案例

构建一个浏览器自动化 Agent：
1. 打开 Airbnb
2. 搜索 Stockholm 房源
3. 抽取结构化数据（标题、每晚价格、评分、URL）
4. 识别最便宜的选项

---

## 二、技术栈

| 组件 | 角色 |
|------|------|
| **Browser-Use** | AI 驱动的导航——用视觉推理处理页面 |
| **Playwright** | 确定性浏览器控制 |
| **Chrome DevTools Protocol (CDP)** | 让 Browser-Use 与 Playwright **共享同一浏览器会话** |
| **Azure OpenAI Vision** | 视觉感知与推理 |
| **Pydantic** | 结构化抽取的类型校验 |

### 安装

```bash
pip install browser_use playwright python-dotenv
playwright install chromium
```

### 环境变量

```bash
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=...
AZURE_OPENAI_API_VERSION=...   # 可选
```

---

## 三、混合架构四步

```
1. Chrome 以 CDP 启动 → Playwright 与 Browser-Use 共享会话
2. Browser-Use Agent → 处理开放性导航
                      (打开 Airbnb / 关弹窗 / 搜索 Stockholm)
3. Pydantic schema 抽取 → 标题 / 价格 / 评分 / URL
4. Python 逻辑 → 比对并高亮最便宜结果
```

**核心设计**：保留 Browser-Use 灵活的视觉推理能力，同时在需要确定性控制时切到 Playwright 直控。

---

## 四、Agent vs Actor 选型

| 场景 | Agent ✅ | Actor ✅ |
|------|---------|---------|
| 动态布局 | AI 能适应页面变化 | 选择器脆弱易断 |
| 已知结构 | 比直接控制慢 | 快且精确 |
| 找元素 | 自然语言描述即可 | 需精确选择器 |
| 时序控制 | 不可预测 | 完全控制 waits/retries |
| 复杂工作流 | 处理意外 UI 状态 | 需显式分支 |

**核心原则**：**任务越可预测 → Actor 越优；任务越开放 → Agent 越优**^[inferred]。

---

## 五、Browser-Use 七大最佳实践

1. **从 Agent 开始**做探索与动态导航
2. **切回直接控制**当交互变得可预测
3. **用结构化输出模型**（Pydantic）让抽取数据类型安全
4. **策略性加 delay**——在触发可见 UI 变化的动作后
5. **迭代中截图**——失败时易调试
6. **预期网站会变**——为弹窗/布局偏移设计 fallback
7. **混合 Agent + Actor** —— 鱼与熊掌兼得

---

## 六、真实应用场景

- 旅游预订与价格监控
- 电商比价与可用性检查
- 动态网站结构化抽取
- 视觉感知的 UI 测试与验证
- 网站监控与告警
- 多步表单智能填写

---

## 与其他课的衔接

- 本课是 [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L14_Microsoft_Agent_Framework]] 中 Workflows 的具体应用——Agent / Actor 模式可用 workflow edges 编排
- 与 [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L11_Agentic_Protocols]] 中的 **NLWeb** 形成对比：NLWeb 让网站主动暴露 AI 接口，CUA 让 Agent 被动适配任何网站 ^[inferred]
- 视觉感知呼应 [[05_大模型/10_Multimodal_Models/GenAI_L09_Building_Image_Applications]] 的多模态基础

---

## 关联阅读

- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L14_Microsoft_Agent_Framework]] — 上一课：MAF
- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L18_Securing_AI_Agents]] — 下一课：安全（L18）
- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L11_Agentic_Protocols]] — L11：NLWeb 是互补方案
- [[05_大模型/10_Multimodal_Models/GenAI_L09_Building_Image_Applications]] — 多模态基础
- [[90_学习/courses/microsoft/microsoft_ai_agents_for_beginners]] — 课程总览

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
