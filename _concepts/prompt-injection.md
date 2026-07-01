---

title: "Prompt Injection (提示注入攻击)"
tags: [prompt-injection, llm-security, jailbreak, indirect-injection, agent-security]
created: 2026-06-17
tier: core
aliases:
  - "Prompt Injection"
  - "prompt injection"
category: -concepts
lifecycle: stable

relationships:
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
|