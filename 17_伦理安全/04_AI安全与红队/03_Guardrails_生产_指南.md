---
title: "AI 护栏 (Guardrails) 生产实践指南"
category: "17-ethics-safety"
tags: ["guardrails", "safety", "production", "nemo-guardrails", "guardrails-ai"]
summary: "在生产环境中为 LLM 应用添加安全护栏:输入过滤、输出验证、主题限制、事实检查等技术方案与工具。"
sources:
  - "https://github.com/NVIDIA/NeMo-Guardrails"
  - "https://github.com/guardrails-ai/guardrails"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "Guardrails Production Guide"
  - Guardrails_Production_Guide

name_zh: "AI 护栏 生产实践指南"
---
# AI 护栏 (Guardrails) 生产实践指南

> 中文简称：AI 护栏 生产实践指南

> **一句话理解**: 在生产环境中为 LLM 应用添加安全护栏:输入过滤、输出验证、主题限制、事实检查等技术方案与工具。

## 为什么需要 Guardrails?

LLM 在生产环境中可能产生:
- 有害内容(暴力、歧视、色情)
- 幻觉(编造不存在的事实)
- 敏感信息泄露(训练数据中的 PII)
- 偏离主题(用户试图越狱)
- 格式错误(不符合预期的输出结构)

## Guardrails 分层架构

```
用户输入
  |
  v
[输入护栏] -> 拒绝有害/越狱输入
  |
  v
[LLM 生成]
  |
  v
[输出护栏] -> 验证格式、事实、安全
  |
  v
[响应后处理] -> 脱敏、格式化
  |
  v
最终输出
```

## 主流工具对比

| 工具 | 厂商 | 特点 | 适用场景 |
|------|------|------|---------|
| [NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) | NVIDIA | Colang 脚本定义规则 | 企业级对话系统 |
| [Guardrails AI](https://github.com/guardrails-ai/guardrails) | 社区 | 输出验证 + 重试 | 结构化输出 |
| [Llama Guard](https://huggingface.co/meta-llama/Llama-Guard-3-8B) | Meta | 分类模型判断安全性 | 输入/输出过滤 |
| [Rebuff](https://github.com/protectai/rebuff) | Protect AI | 提示注入检测 | 安全关键应用 |
| [LangKit](https://github.com/whylogs/langkit) | WhyLabs | 可观测性 + 安全 | 监控与审计 |

## 关键技术

### 1. 输入过滤
- **关键词过滤**: 黑名单/白名单
- **意图分类**: 检测越狱、注入攻击
- **PII 检测**: 识别并遮蔽个人信息

### 2. 主题限制
- **Colang 规则**: NeMo 的声明式对话规则
- **分类器**: 判断输入是否在允许的主题范围内
- **回退策略**: 超出范围时的标准化回复

### 3. 输出验证
- **事实检查**: 将输出与知识库交叉验证
- **格式验证**: 确保 JSON/Pydantic schema 合规
- **毒性检测**: 检查输出中的有害内容
- **幻觉检测**: 标记可能的编造信息

### 4. 重试与修复
- **自动重试**: 输出不合规时重新生成
- **提示修复**: 修改 prompt 后重新请求
- **降级回复**: 多次失败后的安全默认回复

## 实现示例 (NeMo Guardrails)

```yaml
# config.yml
models:
  - type: main
    engine: openai
    model: gpt-4o

# 定义安全规则
define user express greeting
  "hello"
  "hi"
  "hey"

define flow
  user express greeting
  bot express greeting

define user ask about competitors
  "What about [competitor]?"
  "Tell me about [competitor]"

define flow
  user ask about competitors
  bot refuse to discuss competitors
  "I can only help with our products and services."
```

## 最佳实践

1. **分层防护**: 输入过滤 + 输出验证 + 监控
2. **渐进严格**: 先宽松上线,根据实际攻击收紧
3. **记录一切**: 所有被拦截的请求都要记录分析
4. **定期更新**: 随着新型攻击出现更新规则
5. **人工兜底**: 高风险场景必须有人工审核
6. **测试红队**: 定期用红队测试验证护栏效果

> **关联**: -> [[17_伦理安全/README|伦理安全]] | [[13_运维/02_SRE与可靠性/13_Guardrails_深入分析|Guardrails 深度解读]] | [[09_测试/README|测试]]
