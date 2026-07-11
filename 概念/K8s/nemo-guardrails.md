---
title: "NeMo Guardrails (NVIDIA 对话行为控制框架)"
category: -concepts
tags: ["nvidia", "safety", "guardrails", "dialogue-control", "colang", "llm"]
relationships:
  - target: "概念/ne-mo"
    type: related_to
  - target: "概念/guardrails-ai"
    type: related_to
  - target: "概念/llm-guard"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "NVIDIA 开源的 LLM 对话行为控制框架，通过 Colang 领域特定语言定义对话流程和安全边界，确保 AI 应用按预设行为运行。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
---

# NeMo Guardrails

[NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) 是 NVIDIA 开源的 LLM 对话行为控制框架，通过自创的 **Colang** 领域特定语言（DSL）定义对话流程、主题边界和安全约束。与 Guardrails AI 侧重"输出质量校验"不同，NeMo Guardrails 更关注**对话行为的程序化控制**——定义 AI 可以谈什么、不可以谈什么、何时调用工具、如何响应特定场景。

## 核心理念

### 对话行为控制 vs 输出校验

```
Guardrails AI / LLM Guard:
  "检查 LLM 输出是否合规" → 事后校验

NeMo Guardrails:
  "定义 AI 的行为规则" → 过程控制
  - 什么主题可以讨论？
  - 什么问题必须拒绝？
  - 何时触发工具调用？
  - 如何管理多轮对话流？
  - 如何防止越狱攻击？
```

## Colang 语言

### Colang 2.0 语法

```colang
# 定义用户意图
define user express greeting
  "hello"
  "hi there"
  "good morning"

define user ask about politics
  "what do you think about the election?"
  "who should I vote for?"

# 定义 AI 行为
define flow
  user express greeting
  bot express greeting

define flow
  user ask about politics
  bot inform cannot discuss politics

# 定义响应
define bot express greeting
  "Hello! I'm your AI assistant. How can I help you today?"

define bot inform cannot discuss politics
  "I'm sorry, I'm not designed to discuss political topics. 
   I can help you with technical questions instead."
```

### 主题控制

```colang
# 定义允许的主题
define user ask about product
  "what features does your product have?"
  "how much does it cost?"

define user ask off-topic
  "tell me a joke"
  "what's the weather?"

# 主题约束流程
define flow
  user ask off-topic
  bot inform topic limitation
  bot offer to help with product

define bot inform topic limitation
  "I'm specialized in product-related questions."
```

### 工具调用控制

```colang
# 定义工具调用规则
define user ask about account
  "what's my account balance?"
  "show my recent transactions"

define flow
  user ask about account
  bot check authentication
  if authenticated
    bot call account_api
    bot present account info
  else
    bot request authentication

define bot check authentication
  """Check if user is authenticated"""
  # 调用外部认证系统
  
define bot call account_api
  """Fetch account information"""
  # 调用账户 API
```

## 核心架构

```
NeMo Guardrails 架构:

用户消息
    │
    ▼
┌──────────────────┐
│  Canonical Form  │ ← 将用户输入转为规范化形式
│  (NLU 层)        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Dialog Rails    │ ← Colang 定义的对话规则
│  (决策引擎)       │
│  - 匹配用户意图   │
│  - 检查主题边界   │
│  - 决定行为流程   │
└──────┬───────────┘
       │
       ├─→ 允许 → LLM 生成 → 输出
       │
       ├─→ 拒绝 → 预设拒绝响应
       │
       └─→ 工具 → 外部 API 调用 → 结果
```

## 核心特性

### 1. 安全模式

| 安全模式 | 说明 |
|----------|------|
| **主题锁定** | 限制 AI 只在特定领域回答 |
| **越狱防御** | 检测并拒绝越狱 Prompt |
| **事实基础** | 要求输出基于提供的上下文 |
| **输出审查** | 集成 self-check 模型 |
| **对话边界** | 定义不允许的对话路径 |

### 2. 集成生态

```python
from nemoguardrails import RailsConfig, LLMRails

# 加载 Colang 配置
config = RailsConfig.from_path("./config")

# 创建 Rails 实例
rails = LLMRails(config)

# 处理对话
response = rails.generate(
    messages=[{"role": "user", "content": "What's the weather?"}]
)
# 如果 "weather" 不在允许主题中 → 拒绝
```

### 3. 与 LangChain 集成

```python
from nemoguardrails.integrations.langchain import GuardrailsChain

# 作为 LangChain 的安全层
chain = GuardrailsChain(rails_config=config, llm=my_llm)

# 所有 LangChain 调用都经过 Guardrails 检查
result = chain.invoke("Tell me about products")
```

### 4. 与 vLLM/OpenAI 集成

```python
# 作为 API 代理
from nemoguardrails import LLMRails

rails = LLMRails(config)

# OpenAI 兼容 API
response = await rails.generate_async(
    messages=[{"role": "user", "content": user_input}]
)
```

## 与 Guardrails AI / LLM Guard 对比

| 维度 | NeMo Guardrails | Guardrails AI | LLM Guard |
|------|----------------|--------------|-----------|
| **核心方法** | Colang DSL | Python Validator | Scanner 中间件 |
| **侧重点** | 对话行为控制 | 输出质量校验 | 安全扫描 |
| **学习曲线** | 中（学 Colang） | 低 | 低 |
| **NVIDIA 背书** | ✅ | ❌ | ❌ |
| **工具调用控制** | 原生 | 有限 | 有限 |
| **多轮对话管理** | ✅ (核心能力) | ❌ | ❌ |
| **API 代理** | 可配置 | ❌ | ✅ |

## 典型应用场景

- **企业客服**: 锁定客服主题，防止 AI 回答超范围问题
- **金融顾问**: 合规约束，确保 AI 不提供投资建议
- **医疗助手**: 安全边界，防止误诊或不专业建议
- **内部工具**: 权限控制，不同用户可访问不同功能
- **教育**: 引导学习路径，防止偏离教学主题

## 配置文件结构

```
config/
├── config.yml          # 主配置
├── general.co          # 通用对话规则
├── safety.co           # 安全规则
├── domain.co           # 领域特定规则
├── prompts/
│   ├── general.yml     # Prompt 模板
│   └── safety.yml
└── kb/                 # 知识库
    └── product.md
```

## 安装

```bash
pip install nemoguardrails
```

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nemo-guardrails
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: guardrails
        image: nemo-guardrails:latest
        ports:
        - containerPort: 8000
        volumeMounts:
        - name: config
          mountPath: /app/config
      volumes:
      - name: config
        configMap:
          name: guardrails-config
```

## 参考资源

- [NeMo Guardrails GitHub](https://github.com/NVIDIA/NeMo-Guardrails)
- [Colang 文档](https://github.com/NVIDIA/NeMo-Guardrails/blob/main/docs/colang-2/overview.md)
- [NeMo Guardrails 文档](https://docs.nvidia.com/nemo/guardrails/)

## 相关概念

- [[概念/ne-mo]] — NVIDIA NeMo 训练与推理框架
- [[概念/guardrails-ai]] — Guardrails AI 安全防护框架
- [[概念/llm-guard]] — LLM Guard 安全防护中间件
- [[概念/presidio]] — Microsoft Presidio PII 检测
