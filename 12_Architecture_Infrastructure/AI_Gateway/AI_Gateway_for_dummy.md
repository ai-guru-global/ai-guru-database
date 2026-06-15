---
title: AI Gateway 入门指南 (for Dummies)
category: 14-ai-gateway
tags: ["ai-gateway", "api-management", "routing", "litellm"]
summary: "> 用最简单的语言解释什么是 AI Gateway，以及为什么你需要它。"
created: 2026-05-31
updated: 2026-05-31
---

# AI Gateway 入门指南 (for Dummies)

> 用最简单的语言解释什么是 AI Gateway，以及为什么你需要它。

---

## 什么是 AI Gateway？

### 生活中的比喻 🎯

想象一下，你是一个大公司的前台接待员：

```
没有 AI Gateway 的情况:
┌─────────┐  ┌─────────┐  ┌─────────┐
│ 员工 A  │  │ 员工 B  │  │ 员工 C  │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     ▼            ▼            ▼
  ┌─────┐      ┌─────┐      ┌─────┐
  │GPT-4│      │Claude│     │Gemini│
  └──┬──┘      └──┬──┘      └──┬──┘
     │            │            │
     ▼            ▼            ▼
  (每个人都要记住多个密码、管理混乱)
```

```
有 AI Gateway 的情况:
┌─────────┐  ┌─────────┐  ┌─────────┐
│ 员工 A  │  │ 员工 B  │  │ 员工 C  │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┼────────────┘
                  ▼
         ┌───────────────┐
         │   AI Gateway   │
         │  (统一入口)    │
         └───────┬───────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
 ┌─────┐      ┌─────┐      ┌─────┐
 │GPT-4│      │Claude│     │Gemini│
 └─────┘      └─────┘      └─────┘

 (只需要记一个密码，Gateway 帮你管理一切)
```

---

## AI Gateway 能做什么？

### 1️⃣ 统一入口 - 只需要一个 API

```python
# 没有 Gateway: 需要管理多个 API
openai_response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}]
)

anthropic_response = anthropic.messages.create(
    model="claude-3",
    messages=[{"role": "user", "content": "Hello"}]
)

# 有 Gateway: 只需要调用一个地方
response = ai_gateway.chat(
    message="Hello",
    provider="auto"  # Gateway 自动选择最佳模型
)
```

### 2️⃣ 智能路由 - 选对模型省大钱

```
问题: 什么样的问题该用什么样的模型？

简单问题: "今天天气怎么样？"     → 用便宜快速的模型 (省钱!)
复杂问题: "分析这篇论文的核心观点" → 用贵但聪明的模型 (效果好!)
```

**Gateway 如何选择模型？**

```
用户: "解释什么是机器学习"

Gateway 的思考过程:
1. 分析问题复杂度 → 简单解释类问题
2. 检查成本 → 选择便宜的模型
3. 回答问题

成本比较:
❌ 直接用 GPT-4: $0.03
✅ Gateway 选择 GPT-3.5: $0.001 (省 97%!)
```

### 3️⃣ 安全管控 - 防止乱用

```
Gateway 安全检查:
┌─────────────────────────────────────┐
│ 你的请求: "删除所有数据"              │
│                                     │
│ Gateway: ❌ 拦截！                   │
│                                     │
│ 原因: 这个操作太危险了！              │
│       需要二次确认                   │
└─────────────────────────────────────┘
```

### 4️⃣ 成本控制 - 不超预算

```
月度预算设置:
┌─────────────────────────────────────┐
│ 💰 本月 AI 预算: $1000              │
│                                     │
│ 已使用: $850 (85%)                  │
│ ████████████████████░░░░░           │
│                                     │
│ ⚠️  警告: 快超预算了！               │
│                                     │
│ 建议: 简单问题用小模型               │
└─────────────────────────────────────┘
```

---

## 十分钟快速体验

### 第一步：安装

```bash
pip install portkey-ai  # 或者你选择的 Gateway 产品
```

### 第二步：配置

```python
from portkey_ai import Portkey

# 创建 Gateway 客户端
gateway = Portkey(
    api_key="your-gateway-key"  # 只有一个密钥！
)

# 配置多个模型
gateway.configure_model("openai", api_key="sk-xxx...")
gateway.configure_model("anthropic", api_key="sk-ant-xxx...")
```

### 第三步：使用

```python
# 简单调用
response = gateway.chat.completions.create(
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.content)
```

### 第四步：查看使用统计

```python
# 查看本月花了多少钱
stats = gateway.get_usage()
print(f"本月请求: {stats.requests}")
print(f"本月花费: ${stats.cost}")
```

---

## 常见问题

### Q: AI Gateway 和直接调用 API 有什么区别？

| 对比项 | 直接调用 API | 使用 Gateway |
|--------|-------------|--------------|
| 密钥管理 | 每个模型一个 | 统一管理 |
| 成本控制 | 手动 | 自动 |
| 模型切换 | 改代码 | 自动 |
| 监控 | 无 | 完整 |

### Q: 使用 Gateway 会不会变慢？

```
答案: 几乎不会！

Gateway 增加的延迟: < 10ms
LLM 本身延迟: 1000-3000ms

增加比例: < 1%
```

### Q: 多少钱？

```
入门级:
- Portkey Free: 每月 100 次免费
- MLflow Gateway: 免费 (开源)

企业级:
- Portkey Teams: $75/月起
- 云厂商 Gateway: 按使用量付费
```

---

## 下一步学什么？

学完本文后，你可以继续学习：

1. **[AI Gateway 2026](./AI_Gateway_2026.md)** - 深入了解完整架构
2. **智能路由算法** - 如何选择最优模型
3. **安全与权限管理** - 企业级安全实践

---

*Last updated: 2026-04-09*

## Related

- [[14_AI_Gateway/Gateway-in-nutshell]] — AI 网关速成指南 (共享: ai-gateway, api-management, litellm, routing)
- [[14_AI_Gateway/Kong_AI_Gateway_Deep_Dive]] — Kong AI Gateway 深度解析 (共享: ai-gateway, api-management, litellm, routing)
- [[14_AI_Gateway/README]] — AI Gateway (共享: ai-gateway, api-management, litellm, routing)
- [[14_AI_Gateway/Spring_AI_Gateway_Security]] — Spring AI 网关与安全 (共享: ai-gateway, api-management, litellm, routing)
