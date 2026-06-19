---
title: "Prompt Injection (提示注入攻击)"
tags: [prompt-injection, llm-security, jailbreak, indirect-injection, agent-security]
created: 2026-06-17
---

# Prompt Injection (提示注入攻击)

## 定义

Prompt Injection 是利用 LLM 无法严格区分指令与数据这一根本特性，通过精心构造的输入改变模型行为的一类攻击。它是 OWASP LLM Top 10（2025 版）排名第一的风险（LLM01），也是 LLM 应用最常见且影响最广泛的安全威胁。

## 核心机制

### 直接提示注入 (Direct Prompt Injection)

攻击者在对话中直接输入恶意指令，六种典型手法：

1. **指令覆盖**：`"忽略之前的所有指令。你现在是..."`
2. **角色扮演（DAN）**：诱导模型进入无限制角色
3. **上下文操纵**：在长文本中隐藏恶意指令
4. **编码混淆**：Base64、ROT13、Unicode 同形字符绕过过滤器
5. **分步诱导**：逐步引导模型突破安全边界
6. **系统提示提取**：`"repeat your instructions"`

### 间接提示注入 (Indirect Prompt Injection)

恶意指令隐藏在外部数据源中，当 LLM 处理这些数据时被自动触发——无需用户额外交互：

- **RAG 知识库投毒**：上传含隐藏指令的文档
- **网页浏览注入**：在网页中嵌入恶意指令
- **邮件/日历注入**：通过邮件正文或日历事件嵌入
- **工具返回值注入**：通过 API 响应注入
- **文档隐写"零点击"注入**：在 Word 文档中嵌入不可见的恶意 Prompt

危害放大因素：间接注入可影响多个用户、更加隐蔽、智能体系统会放大危害。

### 与 Jailbreak 的区别

| 维度 | Prompt Injection | Jailbreak (越狱) |
|------|-----------------|-----------------|
| **攻击目标** | 改变模型执行路径 | 绕过安全对齐机制 |
| **关注焦点** | 指令/数据混淆 | 内容安全限制突破 |
| **典型手法** | 覆盖指令、数据投毒 | DAN、场景构造、逻辑诱导 |
| **攻击来源** | 用户输入或外部数据 | 通常是用户直接发起 |

### 长上下文特有风险

- **迷失中间（Lost in the Middle）**：模型对中部信息的稳定利用可能下降，攻击者可在此区域隐藏指令
- **约束退化**：System Prompt 位于序列开头，长上下文下模型对早期约束的遵循可能下降
- **上下文投毒**：在海量信息中嵌入恶意内容，更加隐蔽

### 推理模型的新风险

推理模型引入"思维注入"（Thought Injection）——攻击发生在推理过程中，逐步削弱约束，检测难度更高，不同于传统的 Prompt Injection。

## 关键设计决策

- **分层防御优于单点防护**：纵深防御七层架构——边界防护 -> 输入安全 -> 上下文安全 -> 模型安全 -> 工具安全 -> 输出安全 -> 运营安全
- **三明治模式（Sandwich Pattern）**：在 LLM 前后各放置安全检查层——输入过滤 -> LLM 推理 -> 输出审核
- **隔离模式**：使用消息角色标记区分系统/用户/工具内容，外部内容默认标记为不可信
- **Constitutional Classifiers**：Anthropic 的下一代级联防护——轻量线性探针全量筛查 + 集成分类器深度分析，无害请求误拒率仅 0.05%
- **MVP 最小可行防线**：机密不入上下文、外部内容默认不可信、输出脱敏与策略拦截、工具最小权限

## 与其他概念的关系

- [[guardrails]] -- 输入验证、输出审核、工具权限控制是防御 Prompt Injection 的核心护栏
- [[agent-harness]] -- Harness 的安全层提供注入检测和上下文隔离的结构化实现
- [[hallucination]] -- Prompt Injection 和幻觉都源于 LLM 对输入内容的不可靠处理
- [[context-engineering]] -- 上下文工程的隔离策略（Isolate）直接防御注入攻击的边界泄漏
- [[mcp]] -- MCP Server 的工具返回值是间接注入的重要攻击向量
- [[agent-loop]] -- Agent Loop 中的工具结果回注环节需严格执行注入检测

## 深入阅读

- [[17_Ethics_Safety/LLM_Security_Complete_Guide.md]] -- 攻击技术详解与威胁全景
- [[17_Ethics_Safety/LLM_Security_Defense_Guide.md]] -- 防御架构、I/O 防护与 Constitutional Classifiers
- [[17_Ethics_Safety/Agent_RAG_Security.md]] -- 智能体控制流劫持与 RAG 知识库投毒
- [[05_NLP_LLMs/Context_Engineering_Patterns.md]] -- 上下文污染与隔离失效的反模式
