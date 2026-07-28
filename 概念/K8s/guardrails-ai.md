---
title: "Guardrails AI (AI 安全防护框架)"
category: -concepts
tags: ["safety", "guardrails", "llm", "pii", "toxicity", "validation", "production"]
relationships:
  - target: "概念/ne-mo"
    type: related_to
  - target: "概念/presidio"
    type: related_to
  - target: "概念/helicone"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "开源的 LLM 安全防护框架，通过 Guard 和 Validator 机制对输入/输出进行多维度校验，防止有害内容、PII 泄露和格式错误。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
name_zh: "AI 安全防护框架"
---

# Guardrails AI

> 中文简称：AI 安全防护框架

[Guardrails AI](https://github.com/guardrails-ai/guardrails) 是一个开源的 LLM 安全防护框架，通过在 LLM 的输入和输出两端部署**校验器（Validators）**和**护栏（Guards）**，确保 AI 应用在生产环境中的安全性、合规性和输出质量。它解决的核心问题是：**LLM 的输出不可预测且不可控**，Guardrails AI 让输出变得可验证、可纠正。

## 核心架构

### Guard + Validator 模型

```
Guardrails AI 架构:

用户输入 ──→ [Input Guard] ──→ LLM ──→ [Output Guard] ──→ 用户
              │                          │
              ├─ PII 检测               ├─ 格式验证
              ├─ 毒性检测               ├─ 事实性检查
              ├─ 主题过滤               ├─ PII 脱敏
              ├─ 注入防御               ├─ 毒性过滤
              └─ 长度限制               ├─ 相关性评估
                                       └─ 幻觉检测

Guard: 包含多个 Validator 的校验管道
Validator: 单一校验逻辑（通过/失败 + 修复策略）
```

### 核心概念

| 概念 | 说明 |
|------|------|
| **Guard** | 校验管道，包含有序 Validator 列表 |
| **Validator** | 单个校验逻辑，返回 pass/fail |
| **OnFailAction** | 失败时的处理策略（reask/fix/filter/exception） |
| **RAIL Spec** | 声明式 Guard 配置（XML/Python） |
| **Hub** | Validator 社区市场 |

## 核心特性

### 1. 声明式 Guard 定义

```python
from guardrails import Guard, OnFailAction
from guardrails.hub import (
    ToxicLanguage,
    PII,
    CompetitorCheck,
    ValidLength
)

# 创建 Guard
guard = Guard().use_many(
    # 输入校验
    ToxicLanguage(on_fail=OnFailAction.EXCEPTION),
    PII(on_fail=OnFailAction.FIX),
    CompetitorCheck(
        competitors=["CompetitorA", "CompetitorB"],
        on_fail=OnFailAction.REASK
    ),
    # 输出校验
    ValidLength(min=50, max=1000, on_fail=OnFailAction.REASK),
)
```

### 2. 多维度 Validator

```python
from guardrails.hub import (
    # 安全类
    ToxicLanguage,           # 毒性检测
    PII,                     # PII 检测与脱敏
    RestrictToTopic,         # 主题限制
    DetectPII,               # PII 检测
    
    # 质量类
    ValidLength,             # 长度校验
    ReadingTime,             # 阅读时间
    CompetitorCheck,         # 竞品检查
    
    # 格式类
    ValidJSON,               # JSON 格式验证
    ValidURL,                # URL 格式验证
    ValidPythonCode,         # Python 代码验证
    
    # LLM 评估类
    LLMJudge,                # LLM 评判
    ProvenanceLLM,           # 来源验证
    HallucinationValidation  # 幻觉检测
)
```

### 3. 失败处理策略

```python
from guardrails import OnFailAction

# 策略选项
OnFailAction.REASK       # 重新请求 LLM（附带反馈）
OnFailAction.FIX         # 自动修复（如 PII 脱敏）
OnFailAction.FILTER      # 过滤掉失败的输出
OnFailAction.EXCEPTION   # 抛出异常
OnFailAction.NOOP        # 仅记录，不处理
```

### 4. PII 自动脱敏

```python
from guardrails.hub import PII

guard = Guard().use(
    PII(
        pii_types=["EMAIL", "PHONE", "SSN", "CREDIT_CARD"],
        on_fail=OnFailAction.FIX  # 自动替换为 [EMAIL_1], [PHONE_1] 等
    )
)

# 输入: "请联系 john@example.com 或拨打 555-1234"
# 输出: "请联系 [EMAIL_1] 或拨打 [PHONE_1]"
```

### 5. Guardrails Hub

```python
# 从 Hub 安装 Validator
# guardrails hub install hub://guardrails/toxic_language

# Hub 提供的 Validator 类别:
# - 安全: toxicity, PII, injection, jailbreak
# - 质量: relevance, factuality, coherence
# - 格式: json, xml, code, url
# - 合规: competitor, topic, sentiment
```

## 与 NeMo Guardrails 对比

| 维度 | Guardrails AI | NeMo Guardrails |
|------|--------------|----------------|
| **厂商** | Guardrails AI (开源) | NVIDIA |
| **架构** | Validator 管道 | Colang 对话流 |
| **侧重点** | 输出质量与合规 | 对话行为控制 |
| **配置方式** | Python/RAIL | Colang DSL |
| **Hub** | ✅ (Validator 市场) | ❌ |
| **LLM 集成** | 多后端 | NeMo 生态 |
| **学习曲线** | 低 | 中（需学 Colang） |

## 典型应用场景

- **企业 RAG**: 防止输出包含 PII、竞品信息或有害内容
- **客服系统**: 限制对话主题，防止偏离
- **代码生成**: 验证生成代码的安全性和格式
- **医疗/法律**: 确保输出引用可信来源
- **教育**: 防止 AI 输出不当内容

## 与 AI Stack 的集成

在 AI Stack 中，Guardrails AI 的集成点：

1. **LangChain/LlamaIndex** — 作为 Output Parser 层的安全校验
2. **vLLM/SGLang** — 在推理输出后添加 Guard 层
3. **Helicone/Opik** — 结合监控平台记录 Guard 触发事件
4. **Presidio** — PII 检测可与 Microsoft Presidio 互补
5. **Agent 框架** — 作为 Agent 输出到外部动作前的安全门禁

## 安装

```bash
pip install guardrails-ai

# 安装 Hub Validator
guardrails hub install hub://guardrails/toxic_language
guardrails hub install hub://guardrails/detect_pii
```

## 快速开始

```python
from guardrails import Guard, OnFailAction
from guardrails.hub import ToxicLanguage, PII, ValidJSON
import openai

# 定义 Guard
guard = Guard().use_many(
    ToxicLanguage(on_fail=OnFailAction.EXCEPTION),
    PII(on_fail=OnFailAction.FIX),
    ValidJSON(on_fail=OnFailAction.REASK),
)

# 通过 Guard 调用 LLM
result = guard(
    model="openai/gpt-4",
    messages=[{"role": "user", "content": "提取用户信息为JSON"}],
    response_format={"type": "json_object"}
)

# 检查校验结果
print(result.validated_output)  # 通过所有 Validator 的输出
print(result.validation_passed) # True/False
print(result.raw_llm_output)    # 原始 LLM 输出
```

## K8s 生产部署

```yaml
# Guardrails 作为 Sidecar 或独立服务
apiVersion: apps/v1
kind: Deployment
metadata:
  name: guardrails-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: guardrails
        image: guardrails-ai:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
```

## 参考资源

- [Guardrails AI GitHub](https://github.com/guardrails-ai/guardrails)
- [Guardrails AI 文档](https://www.guardrailsai.com/docs)
- [Guardrails Hub](https://hub.guardrailsai.com/)
- [NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails)

## 相关概念

- [[概念/ne-mo]] — NVIDIA NeMo 训练与推理框架
- [[概念/presidio]] — Microsoft Presidio PII 检测
- [[概念/helicone]] — Helicone LLM API 监控
- [[概念/opik]] — Opik LLM 可观测性平台
- [[概念/llm-guard]] — LLM Guard 安全防护
- [[概念/llm-production-deployment|LLM 生产部署]] — 护栏在生产部署中的集成
