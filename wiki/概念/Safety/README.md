---
title: 概念/Safety 域索引 (AI 安全与对齐)
type: index
created: 2026-08-17
updated: 2026-08-17
sources: []
tags: [concept-index, safety]
name_zh: "AI 安全与对齐"
name_en: "Safety"
---

# 概念/Safety 域索引 (AI 安全与对齐)

> 中文简称：AI 安全与对齐 ｜ English Name: Safety

本域收录 AI 安全、对齐、治理与可信 AI 概念卡片，覆盖从**对抗攻击与防御**到**长期存在性风险（如 RSI）**的完整安全谱系。

> 域治理原则：安全类工具卡（如 Guardrails AI、NeMo Guardrails）按工具归属放入 [[概念/K8s/index|K8s 域]] 或 General；本域聚焦**安全方法、风险类别与治理框架**。

## A. 对齐与价值观 (6)

[[概念/Safety/ai-alignment|ai-alignment]] · [[概念/Safety/ai-ethics|ai-ethics]] · [[概念/Safety/bias-detection|bias-detection]] · [[概念/Safety/red-teaming|red-teaming]] · [[概念/Safety/recursive-self-improvement|recursive-self-improvement]] · [[概念/Safety/hallucination|hallucination]]

## B. 攻击与防御 (12)

[[概念/Safety/adversarial-attack|adversarial-attack]] · [[概念/Safety/jailbreak|jailbreak]] · [[概念/Safety/prompt-injection|prompt-injection]] · [[概念/Safety/indirect-prompt-injection|indirect-prompt-injection]] · [[概念/Safety/guardrails|guardrails]] · [[概念/Safety/model-watermark|model-watermark]] · [[概念/Safety/model-watermark-2|model-watermark-2]] · [[概念/Safety/model-security|model-security]] · [[概念/Safety/container-security|container-security]] · [[概念/Safety/runtime-security|runtime-security]] · [[概念/Safety/supply-chain-security|supply-chain-security]] · [[概念/Safety/zero-trust|zero-trust]]

## C. 治理与合规 (4)

[[概念/Safety/ai-governance|ai-governance]] · [[概念/Safety/ai-risk-assessment|ai-risk-assessment]] · [[概念/Safety/ai-audit-traceability|ai-audit-traceability]] · [[概念/Safety/eu-ai-act|eu-ai-act]]

## D. 隐私与可信 AI (4)

[[概念/Safety/privacy-preserving-ai|privacy-preserving-ai]] · [[概念/Safety/presidio|presidio]] · [[概念/Safety/explainable-ai|explainable-ai]] · [[概念/Safety/model-robustness|model-robustness]]

---

## 阅读路径

| 场景 | 推荐入口 |
|------|----------|
| 想了解"AI 会不会失控" | [[概念/Safety/recursive-self-improvement|RSI]] → [[概念/Safety/ai-alignment|AI 对齐]] |
| 想加固生产系统 | [[概念/Safety/guardrails|护栏]] → [[概念/Safety/red-teaming|红队测试]] → [[概念/Safety/prompt-injection|Prompt 注入]] |
| 想满足合规要求 | [[概念/Safety/eu-ai-act|EU AI Act]] → [[概念/Safety/ai-governance|AI 治理]] → [[概念/Safety/ai-audit-traceability|审计]] |
| 想保护用户隐私 | [[概念/Safety/privacy-preserving-ai|隐私保护 AI]] → [[概念/Safety/presidio|Presidio]] |

## 关联入口

- 全域总入口 [[概念/index|概念图谱首页]]
- 安全工具卡（Guardrails AI / NeMo / detect-secrets 等）见 [[概念/K8s/index|K8s 域]]
- 深度章节：[[17_伦理安全/README|伦理安全章节]]

---

*Last updated: 2026-08-17*
