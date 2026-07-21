---
title: "LLM 安全"
category: -concepts
tags: ["llm-safety", "ai-safety", "guardrails", "red-teaming", "jailbreak", "alignment"]
relationships:
  - target: "概念/Safety/prompt-injection"
    type: defends_against
  - target: "概念/Agent/tool-calling-safety"
    type: secures
sources:
  - "https://arxiv.org/abs/2302.12173"  # Toolformer safety
summary: "LLM 安全是确保大模型不被滥用、不造成伤害、不泄露隐私的一整套技术与治理措施。包括训练阶段的对齐、推理阶段的护栏、上线后的红队测试与监控。"
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Llm Safety"
  - "llm safety"
---

# LLM 安全

## 核心要点

- **LLM 安全不仅是不让模型说脏话**，还包括防止有害内容、隐私泄露、偏见歧视、越狱攻击、Agent 危险行为
- **覆盖全生命周期**：预训练数据过滤 → 对齐训练 → 推理护栏 → 红队测试 → 上线监控
- **技术与治理并重**：既要有 Guardrails、RLHF 等技术手段，也要有政策、流程、人工审核

## 一句话理解

LLM 安全就像给大模型装了一套"刹车系统和安全带"：让它跑得快，也能在危险时及时停下。

## 主要风险分类

| 风险类型 | 说明 | 严重度 | 示例 |
|----------|------|--------|------|
| **有害内容生成** | 暴力、恶意代码、违法信息 | 高 | 生成恶意软件代码 |
| **隐私与数据泄露** | 训练数据中的个人信息被提取 | 高 | 输出用户地址/电话 |
| **偏见与歧视** | 性别、种族、地域等偏见 | 中 | 招聘建议带性别偏见 |
| **越狱与提示注入** | 绕过安全限制 | 高 | DAN、角色扮演攻击 |
| **错误信息传播** | 生成看似合理的虚假内容 | 中 | 编造论文引用 |
| **Agent/工具越权** | 智能体执行危险操作 | 极高 | 删除文件、发送未授权邮件 |

## 防护措施（全生命周期）

### 1. 数据层

- 预训练数据去毒（毒性内容过滤）
- 去除个人身份信息（PII 剥离）
- 数据源审计与版权合规

### 2. 训练层

| 技术 | 作用 |
|------|------|
| **RLHF** | 人类反馈强化学习，对齐人类偏好 |
| **DPO** | 直接偏好优化，更稳定的对齐 |
| **安全微调** | 专门的安全指令训练 |
| **Constitutional AI** | 基于原则的自我监督 |

### 3. 推理层（Guardrails）

```python
# 输入/输出护栏示例
from guardrails import Guard

guard = Guard()

# 输入检查
input_safe = guard.check_input(
    user_message,
    checks=[
        "no_prompt_injection",   # 提示注入检测
        "no_pii",               # 个人信息检测
        "topic_allowed"         # 主题白名单
    ]
)

# 输出检查
output_safe = guard.check_output(
    model_response,
    checks=[
        "no_harmful_content",    # 有害内容
        "no_hallucination",      # 幻觉检测
        "format_valid"           # 格式合规
    ]
)
```

### 4. 系统层

- **权限控制**：工具调用最小权限原则
- **审计日志**：记录所有交互用于合规追溯
- **速率限制**：防止滥用和 DDoS
- **沙箱执行**：代码执行在隔离环境

### 5. 评估层

| 评估方法 | 说明 |
|----------|------|
| **红队测试** | 专业团队尝试攻破安全限制 |
| **安全基准** | HarmBench、TrustLLM、BBQ |
| **自动化对抗** | 用 LLM 生成攻击提示 |
| **持续监控** | 生产环境异常检测 |

## Agent 安全（2026 重点）

随着 Agent 普及，安全挑战升级：

| 风险 | 说明 | 防护 |
|------|------|------|
| **工具滥用** | Agent 调用危险工具 | 工具白名单 + 确认机制 |
| **提示注入持久化** | 攻击写入记忆系统 | 记忆写入审计 |
| **权限升级** | Agent 获取超出授权的能力 | 最小权限 + 沙箱 |
| **多 Agent 攻击** | 恶意 Agent 污染协作 | Agent 身份验证 |
| **数据外泄** | 通过工具调用泄露数据 | 输出过滤 + DLP |

## 2026 安全趋势

- **AI 安全即国家安全**：各国出台 AI 安全法规（EU AI Act、中国《生成式 AI 管理办法》）
- **安全评估标准化**：NIST AI RMF、ISO 42001 成为行业基准
- **实时护栏**：从离线评估转向在线实时检测
- **可解释性**：理解模型为什么拒绝/允许某个请求
- **供应链安全**：模型文件、数据集、依赖库的安全审计

## 最佳实践

1. **纵深防御**：不依赖单一层，多层防护叠加
2. **默认拒绝**：未明确允许的操作默认拒绝
3. **人在回路**：高风险操作需人工确认
4. **持续红队**：定期红队测试，而非一次性
5. **透明报告**：发布安全报告，公开已知限制

## Related

- [[概念/Safety/prompt-injection|Prompt 注入]] — 主要攻击向量
- [[概念/Agent/tool-calling-safety|工具调用安全]] — Agent 安全核心
- [[伦理安全/AI_Safety_RedTeaming/AI_Safety_RedTeaming|红队测试]] — 安全评估方法
- [[伦理安全/Guardrails/Guardrails|Guardrails]] — 推理层护栏
- [[伦理安全/LLM_Security_Defense_Guide|LLM 安全防御指南]] — 详细防御策略
- [[概念/LLM/large-language-model|LLM]] — 安全的基础对象
