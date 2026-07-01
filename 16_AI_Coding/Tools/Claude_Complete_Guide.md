---
title: "Claude 完整指南：模型、提示工程、工具与协议"
tags: [claude, anthropic, ai-coding, prompt-engineering, mcp, tool-use]
source: yeasy/claude_guide
created: 2026-06-16
tier: peripheral
aliases:
  - "Claude Complete Guide"
  - Claude_Complete_Guide

---
# Claude 完整指南：模型、提示工程、工具与协议

> 本页面从《Claude 技术指南》13 章内容中提炼核心知识，覆盖模型家族、选型框架、提示工程、Tool Use、MCP 协议、Computer Use 和 Skills 系统。

---

## 一、模型家族与演进

### 1.1 三大系列定位

| 系列 | 定位 | 形象比喻 | 最佳场景 |
|------|------|---------|---------|
| **Opus** | 旗舰级，最强智能 | 大学教授 | 科研论文、法律审查、复杂架构设计 |
| **Sonnet** | 平衡级，企业首选 | 高级工程师 | 代码生成、RAG、Agent 工作流（**默认首选**） |
| **Haiku** | 轻量级，极致速度 | 敏捷实习生 | 聊天机器人、内容审核、意图路由 |

### 1.2 当前主力型号（2026 年 6 月）

| 模型 | 定价 ($/M tokens) | 上下文 | 最大输出 | 核心特性 |
|------|-------------------|--------|---------|---------|
| **Claude Fable 5** | $10/$50 | 1M | 128K | 最新 GA 旗舰，Adaptive Thinking 常开 |
| **Claude Opus 4.8** | $5/$25 | 1M | 128K | Opus 档旗舰，Fast mode 可选 |
| **Claude Sonnet 4.6** | $3/$15 | 1M | 128K | 性价比之王，支持 Adaptive + Extended |
| **Claude Haiku 4.5** | $1/$5 | 200K | 8K | 极致性价比，支持 Extended Thinking |

### 1.3 模型演进关键节点

- **Claude 2 (2023.07)**：100K 上下文引爆长文档分析
- **Claude 3.5 Sonnet (2024.06)**：中等成本超越上代旗舰，引入 Artifacts
- **Claude 3.7 Sonnet (2025.02)**：首个 Extended Thinking 模型，开创混合推理
- **Claude 4.x (2025.05-2026.04)**：推理能力大跃迁，ASL-3 防护标准
- **Claude 4.6 (2026.02)**：百万上下文时代
- **Claude Fable 5 (2026.06)**：新命名体系，脱离 Opus/Sonnet/Haiku

### 1.4 趋势观察

1. **能力差距缩小**：Haiku 4.5 接近旧版旗舰，Sonnet 4.6 匹配 Opus
2. **价格持续下降**：Opus 从 $15/$75 降至 $5/$25，降幅 66%+
3. **上下文急剧扩大**：200K → 1M，催生代码库级别的应用场景

---

## 二、模型选型决策框架

### 2.1 核心决策树

```
任务分析
├── 需要操作计算机？ → Sonnet 4.6 / Opus 4.8 (Computer Use)
├── 极高复杂度（创意/科研/架构）？ → Opus 4.8
├── 中高复杂度（代码/数据/RAG）？ → Sonnet 4.6 ← 默认首选
└── 简单任务（翻译/分类/提取）？ → Haiku 4.5
```

> **黄金法则**："Default to Sonnet, optimize with Haiku, escalate to Opus."

### 2.2 混合路由架构

成熟的 AI 应用构建 **Model Router**：

```
用户请求 → Haiku Router（意图分类）
├── 创意写作 → Opus 4.8
├── 代码/分析 → Sonnet 4.6
└── 简单提取 → Haiku 4.5
```

**路由策略**：
- **难度分级**：关键词匹配分流（"架构/分析" → Opus，"总结/提取" → Haiku）
- **降级策略**：Sonnet 超时 → 自动降级 Haiku
- **VIP 策略**：免费用户 Haiku，付费用户 Sonnet/Opus

### 2.3 迁移最佳实践

```python
# 推荐：提取常量，不硬编码模型名
MODEL_CHEAP = "claude-haiku-4-5-20251001"
MODEL_BALANCED = "claude-sonnet-4-6"
MODEL_SOTA = "claude-fable-5"
MODEL_OPUS = "claude-opus-4-8"
```

建立 **评估集 (Evals)**：切换模型前跑核心业务测试，防止输出格式变化导致崩溃。

---

## 三、提示工程核心技术

### 3.1 XML 标签结构化指令

Claude 在预训练中接触了大量 XML 数据，XML 标签对模型具有极强的**注意力锚点**作用。

**三大优势**：
1. **物理隔离**：区分"指令区"和"数据区"，防止 Prompt Injection
2. **语义增强**：标签名（如 `<role>`）本身就是语义提示
3. **解析便利**：代码可通过正则或 XML Parser 提取

**推荐标签词汇表**：

| 标签 | 用途 | 语义强度 |
|------|------|---------|
| `<instructions>` | 核心指令区域 | High |
| `<documents>` | 包裹文档内容 | High |
| `<examples>` | Few-Shot 示例区 | High |
| `<thinking>` | 强制思维链 | Very High |
| `<format>` | 输出格式定义 | Medium |
| `<query>` | 用户问题 | Medium |

**属性增强**：

```xml
<document id="doc_123" type="legal_contract" status="draft">
    合同内容...
</document>
```

> **Golden Rule**："When in doubt, wrap it in tags."

### 3.2 System Prompt 设计

System Prompt 是 Claude 的"出厂设置"，具有**更高指令优先级**和**全局持久性**。

**核心公式**：`System Prompt = 角色定义 + 任务流程 + 知识边界 + 输出规范`

**健壮结构（千层饼模型）**：

```
角色定义 → 知识边界 → 工作流程 → 语气风格 → 工具能力 → 负面约束
```

**生产级设计原则**（源自 Claude 设计系统的 System Prompt 分析）：
- **分层优先级**：安全约束 > 工作流 > 输出规范 > 领域指导
- **硬约束标记**：用"绝不/不可协商"标记不可违反的规则
- **从失败中提炼**：每条约束来自真实故障案例
- **留出灵活空间**：硬约束之外给模型创造自由度

**模板示例（数据分析师）**：

```xml
<system_prompt>
    <role>拥有 15 年经验的首席数据分析师，精通 Python 和 SQL</role>
    <task_description>帮助业务部门从 CSV 数据中挖掘商业洞察</task_description>
    <workflow>
        1. 理解数据 → 2. 数据清洗 → 3. 分析 → 4. 可视化 → 5. 解读
    </workflow>
    <constraints>
        - 严禁修改原始数据文件
        - 数据不足时必须直说
    </constraints>
</system_prompt>
```

### 3.3 思维链与输出控制

**Thinking inside tags**：在 Prompt 末尾引导 Claude 先思考再回答：

```xml
<output_requirement>
首先在 <thinking> 标签中进行推理，
然后在 <answer> 标签中输出最终回复。
</output_requirement>
```

**效果**：思维显性化（方便调试）、质量提升（经过草稿）、易于提取（正则只取 `<answer>`）。

---

## 四、Tool Use 工具使用

### 4.1 核心概念

工具使用标志着 AI 从"文本生成器"进化为"智能代理"。

**关键理解**：
- Claude **不直接执行**代码或访问互联网
- Claude 只输出"我想调用 `get_weather(city='Beijing')`"的指令
- **执行在客户端**，应用程序接收指令后实际调用 API
- **闭环交互**：执行结果回传 Claude，生成最终回复

### 4.2 工具分类

| 类型 | 定义者 | 执行者 | 特点 |
|------|--------|--------|------|
| **客户端工具** | 开发者 | 开发者应用 | 高度定制，隐私安全 |
| **Anthropic 托管工具** | Anthropic | Anthropic 云端 | 零代码集成（Web Search 等） |
| **Anthropic 定义的客户端工具** | Anthropic 定义 Schema | 开发者执行 | Computer Use、Text Editor |

### 4.3 ReAct 循环（核心工作流）

```
定义工具 → 用户提问 → 模型决策（生成 tool_use）
    → 客户端执行 → 结果回传（tool_result）→ 最终生成
```

### 4.4 工具设计最佳实践

- **最小权限原则**：工具只能访问任务必需的数据
- **人机回环 (HITL)**：高风险操作（删除、转账）前加人工确认
- **清晰描述**：编写详尽的 `description` 和 Docstrings
- **动态加载**：仅发送当前场景必要的工具，避免 Token 浪费
- **流式输出**：用 SSE 和加载动画降低用户等待焦虑

---

## 五、MCP 模型上下文协议

> MCP 协议的完整架构（Host/Client/Server）、三大构件（Tools/Resources/Prompts）与上下文工程三层架构详见 [[Context_Engineering_Guide#5.3-model-context-protocol-mcp]]。此处仅保留 Claude 生态相关信息。

### 5.1 Claude 生态中的 MCP

**解决的痛点**：M×N 集成问题。M 个 AI 应用连接 N 个外部服务，传统方式需要 M×N 个独立集成，MCP 只需 M+N 个实现。

**Claude 支持的客户端**：Claude Desktop、Claude Code、Cursor、Zed、VS Code

**服务端分类**：
- 本地资源：Filesystem, SQLite, Git
- 云服务：AWS, Google Drive, Azure
- SaaS：Slack, Linear, Notion, Sentry
- **Connectors**（零配置）：Notion、Figma、Canva、Linear、Stripe、HubSpot、Sentry

### 5.2 战略地位

MCP 于 2024 年 11 月开源，2025 年 12 月加入 **Agentic AI Foundation (AAIF)**（Linux Foundation 托管，Anthropic/Block/OpenAI 联合发起）。

> 在代理经济中，API 和 MCP 正在取代 GUI 成为新的"用户界面"。构建健壮的 MCP Server 正从"锦上添花"变为软件企业的生存前提。

---

## 六、Computer Use 计算机操控

### 6.1 核心能力

Computer Use 赋予 Claude "眼睛"和"双手"——通过视觉反馈回路操控 GUI。

| 能力 | 技术原理 |
|------|---------|
| **视觉感知** | Vision-Language Model 像素级分析 |
| **精准操控** | 映射到操作系统底层 HID 事件 |
| **状态反馈** | ReAct 循环 (Observation → Action) |
| **跨应用协作** | 操作系统级任务切换 |

### 6.2 核心价值

- **反脆弱**：通过"看"操作，按钮位移不会导致脚本崩溃
- **填补最后一公里**：操作无 API 的遗留系统和桌面软件
- **适用场景**：遗留系统操作、复杂 GUI 工作流、端到端软件测试

### 6.3 安全模型

- **受信任沙箱隔离**：Docker 容器或虚拟机
- **人机回环 (HITL)**：敏感操作需人工批准
- **截图隐私**：确保截图不含 PII

---

## 七、Skills 技能系统

### 7.1 核心理念

Skills 是**包含指令、脚本和资源的文件夹**，Claude 在需要时动态加载。代表从 Prompt Engineering 到 **Context Engineering** 的范式转变。

### 7.2 三层信息架构

| 层级 | 内容 | 加载时机 | 类比 |
|------|------|---------|------|
| **L1: Metadata** | name + description | Always Active | 函数签名 |
| **L2: Instructions** | SKILL.md 正文 | On Trigger | 函数体 |
| **L3: Resources** | Scripts, References | On Demand | 外部库 |

**设计原则**：L1 要"轻"，L2 要"准"，L3 要"全"。

### 7.3 Skills vs 其他概念

| 概念 | 本质 | 提供什么 |
|------|------|---------|
| **System Prompt** | 对话开场白 | 整体风格和角色 |
| **Projects** | 知识库容器 | 静态知识 (What to know) |
| **MCP** | 外部连接协议 | 外部数据 (Where to look) |
| **Skills** | 专业能力包 | 执行方法 (How to do) |

### 7.4 成本优化价值

> **关键发现**：小模型 + 高质量 Skill，往往可以逼近大模型裸跑的效果。
>
> SkillsBench 测试表明：人工策展的 Skills 显著提升任务成功率，但模型自写的 Skills 并不能带来稳定收益。Skill 质量高度依赖工程设计。

---

## 八、Extended Thinking 与 Adaptive Thinking

### 8.1 模型支持矩阵

| 模型 | Adaptive Thinking | Extended Thinking | effort 控制 |
|------|------------------|-------------------|------------|
| **Fable 5** | 常开，不可关闭 | 不支持 | `output_config.effort` |
| **Opus 4.8/4.7** | 支持（推荐） | 不支持 | `output_config.effort` |
| **Sonnet 4.6** | 支持（推荐） | 支持（已弃用） | `output_config.effort` |
| **Haiku 4.5** | 不支持 | 支持 | `budget_tokens` |

### 8.2 成本公式

```
总成本 = Input Tokens x 输入单价 + (Thinking Tokens + Output Tokens) x 输出单价
```

### 8.3 ROI 决策框架

> Thinking 的真正收益不在"单次更贵"，而在于：是否减少了重试、是否减少了人工复核、是否降低了后续工作流失败率。

**Agent 系统中的混合策略**：
- Planner / Reviewer → 开启 Thinking（深思熟虑）
- Executor / Retriever → 快速模式（快速执行）

---

## 九、成本优化策略

### 9.1 Prompt Caching

- 将 System Prompt 和 RAG 文档缓存，Input Token 成本最高降低 **90%**
- 默认 5 分钟缓存，1 小时缓存已 GA（`cache_control.ttl: "1h"`）

### 9.2 上下文窗口管理

- 自动压缩：token 触限时系统自动触发
- `/compact`：手动压缩当前会话上下文
- 渐进式上下文加载：让 Agent 主动按需获取，而非被动预加载

### 9.3 Model Routing

- 用 Haiku 做路由分类（成本极低）
- 按任务复杂度动态分配模型
- Batch API 获得 50% 折扣

---

## 相关页面

- [[Context_Engineering_Guide]] - 从提示词工程到上下文工程的完整指南
- [[LLM_Fundamentals]] - 大语言模型基础知识
- [[Claude_Code_Deep_Dive]] - Claude Code 深度解析
- [[Claude_Agent_Architecture]] - Claude Agent 架构设计
