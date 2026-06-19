---
title: "Replicate"
category: concept
tags: ["replicate", "model-hosting", "api", "gpu", "cloud", "inference", "open-source", "model-marketplace"]
relationships:
  - target: "_concepts/model-serving"
    type: extends
  - target: "_concepts/serverless"
    type: implements
  - [[_concepts/modal]]
    type: related_to
  - target: "_concepts/huggingface"
    type: related_to
sources:
  - 10_Deployment_Inference/Replicate_Deep_Dive.md
summary: "Replicate 是开源模型托管与 API 平台，允许开发者上传模型并通过 HTTP API 调用，提供自动扩缩容、按秒计费和多语言 SDK，是快速上线开源模型的热门选择。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# Replicate

> 开源模型的「一键 API 托管平台」——上传模型，自动生成可调用 API。

---

## 1. 一句话定义

**Replicate** 是开源模型托管与 API 平台，允许开发者和研究者上传模型（通常用 Cog 打包），并通过 HTTP API 调用。它提供自动扩缩容、按秒计费、多语言 SDK 和模型市场，是快速上线开源图像、音频、视频、LLM 模型的热门选择。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **模型市场** | 大量开源模型可直接调用 |
| **Cog 打包** | 用 `cog.yaml` + `predict.py` 定义模型容器 |
| **自动 API** | 上传后自动生成 REST API |
| **按秒计费** | 按 GPU 实际运行时间付费 |
| **自动扩缩容** | 支持冷启动到高并发 |
| **多语言 SDK** | Python、Node.js、Go、Ruby 等 |
| **Webhook** | 异步任务完成通知 |

---

## 3. 典型用法

```python
import replicate

output = replicate.run(
    "meta/meta-llama-3-8b-instruct",
    input={"prompt": "Hello, world!"}
)
print(output)
```

### Cog 打包示例

```python
# predict.py
from cog import BasePredictor, Input

class Predictor(BasePredictor):
    def setup(self):
        self.model = load_model()

    def predict(self, prompt: str = Input(description="Prompt")) -> str:
        return self.model.generate(prompt)
```

---

## 4. 典型场景

1. **快速上线开源模型**：如 Stable Diffusion、LLaMA、Whisper。
2. **模型 DEMO 展示**：不需要自建基础设施。
3. **异步批量推理**：图像/视频生成任务。
4. **AI 应用原型**：先验证 PMF 再考虑自托管。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Modal** | 都是无服务器 GPU 平台，Modal 更偏开发者自定义 |
| **HuggingFace Inference API** | HuggingFace 也提供模型 API，Replicate 更灵活 |
| **AWS SageMaker** | 更企业级，Replicate 更轻量 |
| **Cog** | Replicate 开源的模型容器化工具 |

---

## 6. 优势与局限

### 优势
- 模型市场丰富，上手极快。
- Cog 打包标准化。
- 社区活跃，适合开源项目。

### 局限
- 模型加载有冷启动延迟。
- 成本控制不如自托管精细。
- 企业级网络和合规能力有限。

---

## Related

- [[_concepts/replicate]] — Replicate 概念卡片
- [[_concepts/model-serving]] — 模型服务
- [[_concepts/modal]] — Modal
- [[_concepts/huggingface]] — HuggingFace
- [[_concepts/serverless]] — 无服务器
