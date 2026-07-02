---
title: "Arthur AI (LLM 安全与性能监控平台)"
category: -concepts
tags: ["monitoring", "llm", "safety", "guardrails", "enterprise", "shield"]
relationships:
  - target: "_concepts/guardrails-ai"
    type: related_to
  - target: "_concepts/llm-guard"
    type: related_to
  - target: "_concepts/arthur-ai"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "面向企业的 LLM 安全与性能监控平台，提供 Arthur Shield 防火墙（Prompt 注入/毒性检测）和 Arthur Performance 性能追踪能力。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.78
lifecycle: stable
tier: supporting
---

# Arthur AI

[Arthur AI](https://www.arthur.ai/) 是面向企业的 **LLM 安全与性能监控平台**。其核心产品 **Arthur Shield** 是业界领先的 LLM 防火墙，能够在毫秒级延迟下检测并拦截 Prompt 注入、毒性内容和敏感信息泄露等安全威胁。Arthur 同时提供 **Performance** 模块用于追踪 LLM 应用的成本、延迟和质量指标。

## 核心产品

### Arthur Shield (安全防火墙)

```
Arthur Shield 架构:

用户输入 ──→ [Shield API] ──→ 安全检测
                │
                ├─ Prompt Injection 检测
                ├─ Toxicity 检测
                ├─ PII 检测
                ├─ Jailbreak 检测
                └─ Topic 过滤
                │
         ┌──────┴──────┐
      安全 (放行)     危险 (拦截+告警)
         │                │
         ▼                ▼
       LLM           预设拒绝响应
```

### Arthur Performance (性能追踪)

- **成本监控**: 追踪 Token 使用和 API 成本
- **延迟分析**: 端到端延迟分解
- **质量评估**: 自动评估输出质量
- **异常检测**: 性能退化自动告警

## 核心优势

1. **企业级**: SOC 2 认证，满足金融/医疗合规
2. **低延迟**: Shield 检测延迟 <100ms
3. **高精度**: Prompt 注入检测准确率 >99%
4. **多模型**: 支持 OpenAI、Anthropic、本地模型

## 与 Guardrails AI / LLM Guard 对比

| 维度 | Arthur AI | Guardrails AI | LLM Guard |
|------|-----------|--------------|-----------|
| **类型** | SaaS 平台 | 开源 SDK | 开源中间件 |
| **Shield** | 专用防火墙 | Validator | Scanner |
| **企业合规** | ✅ (SOC2) | ❌ | ❌ |
| **自托管** | ❌ | ✅ | ✅ |
| **检测延迟** | <100ms | 可变 | 可变 |

## 典型应用场景

- **金融/医疗**: 满足行业合规的 LLM 安全监控
- **企业客服**: 防止 Prompt 注入和有害输出
- **内部工具**: 确保 AI 工具的安全使用

## 参考资源

- [Arthur AI 官网](https://www.arthur.ai/)
- [Arthur Shield 文档](https://docs.arthur.ai/)

## 相关概念

- [[_concepts/guardrails-ai]] — Guardrails AI 安全防护框架
- [[_concepts/llm-guard]] — LLM Guard 安全防护中间件
- [[_concepts/nemo-guardrails]] — NVIDIA NeMo Guardrails
