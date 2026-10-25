---
title: "LLM Guard (LLM 安全防护中间件)"
category: -concepts
tags: ["safety", "llm", "prompt-injection", "pii", "toxicity", "middleware"]
relationships:
  - target: "概念/guardrails-ai"
    type: related_to
  - target: "概念/presidio"
    type: related_to
  - target: "概念/nemo-guardrails"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "开源的 LLM 安全防护中间件，提供输入/输出双向扫描，覆盖 Prompt 注入、PII 检测、毒性过滤、幻觉检测等 20+ 安全扫描器。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
name_zh: "LLM 安全防护中间件"
---

# LLM Guard

> 中文简称：LLM 安全防护中间件

[LLM Guard](https://github.com/protectai/llm-guard) 是 [Protect AI](https://protectai.com/) 开源的 LLM 安全防护中间件，在 LLM 的输入和输出两端提供**双向安全扫描**。它覆盖 Prompt 注入防御、PII 检测与脱敏、毒性内容过滤、幻觉检测、语言检测等 **20+ 种安全扫描器（Scanners）**，可作为 API 代理层或 SDK 集成到任何 LLM 应用中。

## 核心架构

```
LLM Guard 双向扫描架构:

用户请求
    │
    ▼
┌─────────────────────┐
│   Input Scanners    │
│  ┌───────────────┐  │
│  │ PromptInject   │  │
│  │ BanTopics      │  │
│  │ Toxicity       │  │
│  │ PII/Anonymize  │  │
│  │ Language       │  │
│  │ TokenLimit     │  │
│  │ Gibberish      │  │
│  └───────────────┘  │
└──────────┬──────────┘
           │ (通过 → 继续; 失败 → 拒绝)
           ▼
       ┌────────┐
       │  LLM   │
       └───┬────┘
           │
           ▼
┌─────────────────────┐
│   Output Scanners   │
│  ┌───────────────┐  │
│  │ BanTopics      │  │
│  │ NoSecrets      │  │
│  │ Regex          │  │
│  │ Sentiment      │  │
│  │ FactualConsist │  │
│  │ ReadingTime    │  │
│  │ Deanonymize    │  │
│  └───────────────┘  │
└──────────┬──────────┘
           │
           ▼
     用户响应 (安全、合规)
```

## 核心扫描器

### 输入扫描器

| 扫描器 | 功能 | 配置 |
|--------|------|------|
| **PromptInjection** | 检测 Prompt 注入攻击 | 模型/规则 |
| **BanTopics** | 禁止特定主题 | 主题列表 |
| **Toxicity** | 毒性内容检测 | 阈值 |
| **Anonymize** | PII 匿名化 | Presidio 集成 |
| **Language** | 语言检测 | 允许语言列表 |
| **TokenLimit** | Token 长度限制 | 最大 Token |
| **Gibberish** | 无意义输入检测 | 阈值 |
| **InvisibleText** | 隐藏文本检测 | — |
| **Code** | 代码注入检测 | 允许语言 |
| **Regex** | 正则模式匹配 | 正则规则 |
| **BanSubstrings** | 禁止特定子串 | 黑名单 |
| **FuzzyMatching** | 模糊匹配 | 相似度阈值 |

### 输出扫描器

| 扫描器 | 功能 | 配置 |
|--------|------|------|
| **BanTopics** | 输出主题限制 | 主题列表 |
| **NoSecrets** | 防止泄露密钥 | 检测规则 |
| **FactualConsistency** | 幻觉检测 | NLI 模型 |
| **Sentiment** | 情感分析 | 阈值 |
| **ReadingTime** | 阅读时间 | 最大时间 |
| **Regex** | 输出格式验证 | 正则 |
| **Deanonymize** | PII 反匿名化 | 映射表 |
| **URLReachability** | URL 可达性 | — |
| **Bias** | 偏见检测 | 模型 |

## 使用方式

### SDK 集成

```python
from llm_guard import scan_output, scan_prompt
from llm_guard.input_scanners import (
    PromptInjection, Toxicity, Anonymize, BanTopics
)
from llm_guard.output_scanners import (
    NoSecrets, BanTopics as OutputBanTopics, FactualConsistency
)

# 配置输入扫描器
input_scanners = [
    PromptInjection(threshold=0.9),
    Toxicity(threshold=0.7),
    Anonymize(pii_types=["EMAIL", "PHONE"]),
    BanTopics(topics=["politics", "religion"]),
]

# 配置输出扫描器
output_scanners = [
    NoSecrets(),
    OutputBanTopics(topics=["politics"]),
    FactualConsistency(minimum_score=0.7),
]

# 扫描用户输入
sanitized_prompt, results_valid, results_score = scan_prompt(
    input_scanners, user_input
)

if not all(results_valid.values()):
    # 输入被拦截
    return {"error": "Input blocked", "details": results_valid}

# LLM 生成
llm_response = call_llm(sanitized_prompt)

# 扫描 LLM 输出
sanitized_output, results_valid, results_score = scan_output(
    output_scanners, sanitized_prompt, llm_response
)

if not all(results_valid.values()):
    return {"error": "Output blocked"}

return {"response": sanitized_output}
```

### API 代理模式

```bash
# 作为独立 API 代理运行
docker run -p 8000:8000 protectai/llm-guard

# 所有请求通过 LLM Guard 代理
# 代理自动进行输入/输出扫描
```

### FastAPI 中间件

```python
from fastapi import FastAPI
from llm_guard.input_scanners import PromptInjection, Toxicity

app = FastAPI()

@app.post("/chat")
async def chat(request: ChatRequest):
    # 输入扫描
    scanners = [PromptInjection(), Toxicity()]
    sanitized, valid, scores = scan_prompt(scanners, request.message)
    
    if not all(valid.values()):
        raise HTTPException(status_code=400, detail="Blocked")
    
    # 正常处理
    response = await llm.generate(sanitized)
    return {"response": response}
```

## 与 Guardrails AI 对比

| 维度 | LLM Guard | Guardrails AI |
|------|-----------|--------------|
| **架构** | 中间件/代理 | SDK/Validator |
| **扫描器数量** | 20+ | 30+ (Hub) |
| **Prompt 注入** | ✅ (专用) | ✅ |
| **PII** | ✅ (Presidio) | ✅ |
| **幻觉检测** | ✅ (NLI) | ✅ |
| **API 代理** | ✅ (原生) | ❌ |
| **部署灵活性** | 高 | 中 |
| **商业支持** | Protect AI | Guardrails AI |

## 典型应用场景

- **企业 Chatbot**: 防止 Prompt 注入和有害输出
- **RAG 系统**: 检测输出幻觉和 PII 泄露
- **代码助手**: 防止输出中的密钥泄露
- **多租户平台**: 为每个租户配置不同的安全策略
- **合规审计**: 记录和报告所有安全事件

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-guard
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: llm-guard
        image: protectai/llm-guard:latest
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
        env:
        - name: LLM_GUARD_CACHE_TYPE
          value: "redis"
        - name: REDIS_URL
          value: "redis://redis-svc:6379"
```

## 安装

```bash
pip install llm-guard
```

## 参考资源

- [LLM Guard GitHub](https://github.com/protectai/llm-guard)
- [LLM Guard 文档](https://llm-guard.com/)
- [Protect AI](https://protectai.com/)

## 相关概念

- [[概念/guardrails-ai]] — Guardrails AI 安全防护框架
- [[概念/nemo-guardrails]] — NVIDIA NeMo Guardrails
- [[概念/presidio]] — Microsoft Presidio PII 检测
- [[概念/detect-secrets]] — detect-secrets 密钥泄露检测

---

## 2026 LLM Guard 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **LLM Guard** | 开源 LLM 输入/输出安全扫描 | GA |
| **NeMo Guardrails** | NVIDIA 对话护栏框架 | GA |
| **Prompt 注入检测** | 识别并拦截 Prompt 注入攻击 | GA |
| **PII 检测** | 自动识别并脱敏个人信息 | GA |
| **内容审核** | 有害内容/偏见/幻觉检测 | GA |

## 生产最佳实践

1. **双层防护**：输入和输出都要扫描，不能只防一侧
2. **延迟控制**：Guard 扫描增加延迟，用轻量模型或并行处理
3. **规则更新**：定期更新检测规则，应对新型攻击
4. **日志审计**：记录所有被拦截的请求，用于分析和改进
5. **误报处理**：监控误报率，过高需调整阈值
