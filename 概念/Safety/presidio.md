---
title: "Presidio (Microsoft PII 检测与脱敏引擎)"
category: -concepts
tags: ["pii", "privacy", "anonymization", "microsoft", "nlp", "safety", "compliance"]
relationships:
  - target: "概念/guardrails-ai"
    type: related_to
  - target: "概念/opik"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "Microsoft 开源的 PII 检测与脱敏引擎，基于 NLP + 正则 + 上下文分析识别敏感信息，支持自定义识别器和匿名化策略。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
name_zh: "Microsoft PII 检测与脱敏引擎"
---

# Presidio (Microsoft Presidio)

> 中文简称：Microsoft PII 检测与脱敏引擎

[Microsoft Presidio](https://github.com/microsoft/presidio) 是一个开源的 PII（Personally Identifiable Information，个人身份信息）检测与脱敏引擎。它结合 **NLP 模型**、**正则表达式**和**上下文分析**三种方法，在文本中自动识别敏感信息（如姓名、邮箱、电话、身份证号、银行卡号等），并提供多种匿名化策略。Presidio 是企业 AI 应用中**隐私合规**（GDPR/CCPA/个人信息保护法）的关键基础设施。

## 核心架构

### Presidio 流水线

```
Presidio 处理流程:

文本输入 ──→ [Analyzer Engine] ──→ [Anonymizer Engine] ──→ 脱敏输出
              │                       │
              ├─ NER 模型识别          ├─ 替换 (Replace)
              ├─ 正则匹配              ├─ 遮蔽 (Mask)
              ├─ 上下文验证            ├─ 哈希 (Hash)
              └─ 置信度评分            ├─ 加密 (Encrypt)
                                      ├─ 假名 (Redact)
                                      └─ 自定义策略

Recognizer: 单个 PII 类型的识别器
RecognizerResult: 识别结果 (type, start, end, score)
```

## 核心特性

### 1. 内置识别器

| 识别器 | PII 类型 | 方法 |
|--------|---------|------|
| **EmailRecognizer** | 邮箱地址 | 正则 |
| **PhoneRecognizer** | 电话号码 | 正则+NLP |
| **CreditCardRecognizer** | 信用卡号 | 正则+Luhn |
| **IpAddressRecognizer** | IP 地址 | 正则 |
| **UsSsnRecognizer** | 美国 SSN | 正则 |
| **SpacyRecognizer** | 人名/地名/组织 | NER 模型 |
| **AzureAILanguageRecognizer** | 通用 PII | Azure AI |
| **StanzaRecognizer** | 多语言 PII | Stanza NER |

### 2. 分析引擎

```python
from presidio_analyzer import AnalyzerEngine

analyzer = AnalyzerEngine()

# 分析文本中的 PII
results = analyzer.analyze(
    text="请联系张三，邮箱 zhang@example.com，电话 138-0000-1234",
    language="zh"
)

for result in results:
    print(f"类型: {result.entity_type}, "
          f"位置: [{result.start}:{result.end}], "
          f"置信度: {result.score}")

# 输出:
# 类型: PERSON, 位置: [3:5], 置信度: 0.85
# 类型: EMAIL_ADDRESS, 位置: [9:25], 置信度: 0.99
# 类型: PHONE_NUMBER, 位置: [29:41], 置信度: 0.75
```

### 3. 匿名化引擎

```python
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import RecognizerResult

anonymizer = AnonymizerEngine()

# 替换策略
result = anonymizer.anonymize(
    text="请联系张三，邮箱 zhang@example.com",
    analyzer_results=analyzer_results,
    operators={
        "DEFAULT": {"type": "replace", "new_value": "<ANONYMIZED>"},
        "EMAIL_ADDRESS": {"type": "mask", "masking_char": "*", "chars_to_mask": 10},
        "PHONE_NUMBER": {"type": "redact"},
        "PERSON": {"type": "hash", "hash_type": "sha256"}
    }
)

print(result.text)
# "请联系 a3f2b1c，邮箱 *********@*******.com"
```

### 4. 支持的匿名化操作

| 操作 | 说明 | 示例 |
|------|------|------|
| **Replace** | 替换为固定文本 | `<EMAIL>` |
| **Mask** | 部分遮蔽 | `z***@example.com` |
| **Hash** | 哈希化 | `a1b2c3d4...` |
| **Redact** | 完全删除 | (空) |
| **Encrypt** | 加密 | `AES256(...)` |
| **Custom** | 自定义函数 | 假名生成 |

### 5. 自定义识别器

```python
from presidio_analyzer import PatternRecognizer, Pattern

# 自定义中国身份证号识别器
id_pattern = Pattern(
    name="cn_id_card",
    regex=r"\d{17}[\dXx]",
    score=0.7
)

cn_id_recognizer = PatternRecognizer(
    supported_entity="CN_ID_CARD",
    patterns=[id_pattern],
    context=["身份证", "ID"]  # 上下文词增强
)

# 注册到分析引擎
analyzer.registry.add_recognizer(cn_id_recognizer)
```

### 6. Presidio Image Redactor

```python
from presidio_image_redactor import ImageRedactorEngine

redactor = ImageRedactorEngine()

# 自动检测并遮蔽图片中的 PII
redactor.redact(
    input_path="document.png",
    output_path="redacted.png",
    fill="black"  # 用黑色遮盖
)
```

## 在 AI 应用中的集成模式

### LLM 输入/输出 PII 过滤

```python
# 在 LLM 调用前后添加 PII 过滤
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine, DeanonymizeEngine

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()
deanonymizer = DeanonymizeEngine()

def safe_llm_call(user_input: str) -> str:
    # 1. 检测输入中的 PII
    pii_results = analyzer.analyze(text=user_input, language="en")
    
    # 2. 匿名化后发送给 LLM
    anonymized = anonymizer.anonymize(
        text=user_input,
        analyzer_results=pii_results
    )
    
    # 3. LLM 处理（看到的是匿名化文本）
    llm_response = call_llm(anonymized.text)
    
    # 4. 反匿名化（可选，恢复原始值）
    final = deanonymizer.deanonymize(
        text=llm_response,
        anonymizer_results=anonymized.items
    )
    
    return final.text
```

### RAG Pipeline PII 保护

```python
# 在索引和检索阶段保护 PII
def index_documents(docs):
    for doc in docs:
        pii = analyzer.analyze(text=doc.text, language="en")
        anonymized = anonymizer.anonymize(text=doc.text, analyzer_results=pii)
        # 存储匿名化版本到向量数据库
        vector_db.add(anonymized.text, metadata=doc.metadata)
```

## 与 Guardrails AI 对比

| 维度 | Presidio | Guardrails AI |
|------|----------|--------------|
| **侧重点** | PII 检测与脱敏 | 全面安全校验 |
| **PII 检测** | 深度（NLP+正则+上下文） | 基础 |
| **毒性检测** | ❌ | ✅ |
| **格式验证** | ❌ | ✅ |
| **图片脱敏** | ✅ | ❌ |
| **自定义识别器** | ✅ (高度灵活) | 有限 |
| **语言支持** | 多语言 | 多语言 |
| **微软背书** | ✅ | ❌ |

## 典型应用场景

- **企业 RAG**: 防止 LLM 输出用户 PII
- **客服系统**: 自动遮蔽对话中的敏感信息
- **数据脱敏**: 在数据进入训练 Pipeline 前脱敏
- **文档处理**: 从扫描件中自动检测并遮蔽 PII
- **合规审计**: 记录和报告 PII 处理日志

## 安装

```bash
# 核心组件
pip install presidio-analyzer
pip install presidio-anonymizer

# NLP 模型 (spaCy)
python -m spacy download en_core_web_lg

# 图片脱敏
pip install presidio-image-redactor

# Azure AI 集成
pip install azure-ai-textanalytics
```

## K8s 生产部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: presidio-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: presidio
        image: mcr.microsoft.com/presidio-analyzer:latest
        ports:
        - containerPort: 5001
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: presidio-svc
spec:
  selector:
    app: presidio
  ports:
  - port: 5001
    targetPort: 5001
```

## 参考资源

- [Presidio GitHub](https://github.com/microsoft/presidio)
- [Presidio 文档](https://microsoft.github.io/presidio/)
- [Presidio Playground](https://microsoft.github.io/presidio/playground/)
- [GDPR 合规指南](https://gdpr.eu/)

## 相关概念

- [[概念/guardrails-ai]] — Guardrails AI 安全防护框架
- [[概念/opik]] — Opik LLM 可观测性平台
- [[概念/langsmith]] — LangSmith LLM 可观测性
- [[概念/ne-mo]] — NVIDIA NeMo 训练与推理框架

---

## 2026 Presidio 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Presidio 2.x** | Microsoft PII 检测脱敏框架 | GA |
| **多语言支持** | 支持 50+ 语言 PII 检测 | GA |
| **自定义识别器** | 自定义 PII 类型识别 | GA |
| **LLM 集成** | 与 LLM 应用集成脱敏 | GA |
| **图像 PII** | 图像中的 PII 检测 | GA |

## 生产最佳实践

1. **输入脱敏**：LLM 输入前脱敏 PII，防止数据泄漏
2. **输出检查**：LLM 输出后检查是否泄漏 PII
3. **自定义规则**：根据业务添加自定义 PII 类型
4. **性能优化**：大批量处理时用异步/批处理
5. **合规审计**：记录脱敏日志，支持合规审计
