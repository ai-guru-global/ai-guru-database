---
title: "Modal"
category: -concepts
tags: ["modal", "serverless", "gpu", "cloud", "inference", "python", "deployment"]
relationships:
  - target: "概念/model-serving"
    type: extends
  - target: "概念/serverless"
    type: implements
  - target: "概念/gpu-cloud"
    type: related_to
  - target: "概念/vllm"
    type: related_to
sources:
  - 部署推理/Inference_Engines/Modal_Deep_Dive.md
summary: "Modal 是无服务器 GPU 云平台，允许开发者用 Python 装饰器将函数部署为弹性 GPU/CPU 服务，按秒计费，适合快速原型、异步任务和弹性推理服务。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Modal

---
# Modal

> Python 开发者的「无服务器 GPU 云」——用装饰器把函数变成弹性 GPU 服务。

---

## 1. 一句话定义

**Modal** 是无服务器 GPU/CPU 云平台，允许开发者用 Python 装饰器将本地函数部署为云端弹性服务。它按秒计费、自动扩缩容，支持容器化环境、持久化存储和自定义 GPU，适合快速原型、异步任务和弹性推理服务。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **Python 装饰器部署** | `@stub.function(gpu="A100")` 一键部署 |
| **自动扩缩容** | 从零扩展到数千并发 |
| **按秒计费** | 只按实际运行时间付费 |
| **持久化存储** | Volumes 存储模型权重和数据 |
| **容器镜像** | 自动构建和缓存容器镜像 |
| **异步任务** | 支持队列和定时任务 |
| **Web 端点** | 自动生成 HTTP/gRPC 服务 |

---

## 3. 典型用法

```python
import modal

stub = modal.Stub("llm-inference")

@stub.function(gpu="A100", image=modal.Image.debian_slim().pip_install("vllm"))
def generate(prompt: str):
    from vllm import LLM
    llm = LLM("meta-llama/Llama-2-7b-hf")
    return llm.generate(prompt)

@stub.local_entrypoint()
def main():
    print(generate.remote("Hello"))
```

---

## 4. 典型场景

1. **快速 LLM 原型**：几行代码部署 vLLM 服务。
2. **异步批处理**：视频生成、数据预处理。
3. **弹性推理 API**：流量波动大的模型服务。
4. **AI Agent 后端**：低成本运行 Agent 工具。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **AWS Lambda** | Modal 类似，但支持 GPU 和长时间运行 |
| **Replicate** | 都是无服务器 AI 平台，Modal 更偏开发者 |
| **vLLM / TGI** | 可作为 Modal 容器内推理引擎 |
| **HuggingFace Inference API** | Modal 更灵活、可定制 |

---

## 6. 优势与局限

### 优势
- 开发体验极佳，Python 原生。
- 冷启动快，镜像缓存智能。
- 按需付费，适合初创和实验。

### 局限
- 供应商锁定风险。
- 长连接/低延迟场景不如自托管稳定。
- 企业级合规和网络隔离能力有限。

---

## Related

- [[部署推理/Inference_Engines/Modal_Deep_Dive]] — Modal 深度解析
- [[概念/model-serving]] — 模型服务
- [[概念/serverless]] — 无服务器
- [[概念/vllm]] — vLLM
- [[概念/replicate]] — Replicate

---

## 2026 Modal 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Modal Functions** | Python 装饰器声明式 GPU 函数部署 | GA |
| **Modal Volumes** | 持久化分布式存储，支持模型权重缓存 | GA |
| **Modal Sandbox** | 安全沙箱执行不可信代码 | GA |
| **A100/H100 弹性** | 按秒计费的多型号 GPU 弹性调度 | GA |
| **Modal CI/CD** | 与 GitHub Actions 集成的自动化部署 | GA |

## 生产最佳实践

1. **冷启动优化**：使用 `@app.cls` 缓存模型加载，避免每次调用重新加载权重
2. **并发控制**：通过 `concurrency_limit` 防止 GPU OOM，合理设置批处理大小
3. **成本监控**：利用 Modal Dashboard 跟踪 GPU-seconds 消耗，设置预算告警
4. **镜像精简**：使用 `modal.Image` 分层构建，只安装必要依赖减少启动时间
5. **容错设计**：配置 `retries` 和 `timeout`，处理 GPU 节点故障和长尾请求

## Modal 函数部署示例

```python
import modal

app = modal.App("llm-inference")
image = modal.Image.debian_slim().pip_install("vllm", "torch")

@app.cls(
    gpu="A100",
    image=image,
    timeout=300,
    concurrency_limit=4,
    retries=2,
)
class LLMInference:
    @modal.enter()
    def load_model(self):
        from vllm import LLM
        self.llm = LLM(model="meta-llama/Llama-3-8B-Instruct")

    @modal.method()
    def generate(self, prompt: str, max_tokens: int = 512) -> str:
        outputs = self.llm.generate(prompt, max_tokens=max_tokens)
        return outputs[0].outputs[0].text

@app.function(schedule=modal.Cron("0 */6 * * *"))
def warmup():
    """定时预热防止冷启动"""
    LLMInference().generate.remote("hello")
```

## Modal vs Replicate vs AWS SageMaker 对比

| 维度 | Modal | Replicate | SageMaker |
|------|-------|-----------|------------|
| 定位 | GPU 函数计算 | 模型市场 | 企业 ML 平台 |
| 计费 | 按秒（GPU-seconds） | 按秒（prediction） | 按小时（实例） |
| 冷启动 | 5-15s | 10-30s | 60s+ |
| 自定义代码 | 完全自由 | Cog 框架 | 容器化 |
| 学习曲线 | 低（Python 装饰器） | 低 | 高 |
| 适用规模 | 初创/中型 | 初创/个人 | 大型企业 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 冷启动慢 | 模型权重大，加载耗时 | 使用 Volume 缓存 + 定时预热 |
| GPU OOM | 批处理过大 | 降低 batch_size，设置 concurrency_limit |
| 费用超预期 | 未设置超时/并发限制 | 配置 timeout + 预算告警 |
| 依赖冲突 | 镜像构建问题 | 分层构建 Image，固定版本号 |

## 生产检查清单

1. ✅ 模型加载使用 @modal.enter() 缓存
2. ✅ 配置 timeout 和 retries 容错
3. ✅ 设置 concurrency_limit 防止 OOM
4. ✅ 定时预热关键模型端点
5. ✅ 监控 GPU-seconds 消耗 + 预算告警
6. ✅ 使用 Volume 缓存大模型权重

## 总结

Modal 是 2026 年最受欢迎的 GPU 函数计算平台，通过 Python 装饰器即可将任意 ML 代码部署为弹性 GPU 服务。其按秒计费、自动扩缩容和极低冷启动的特性，使其成为初创团队和中型企业的 AI 推理首选。

> 💡 Modal 的核心价值是“让 GPU 像调用函数一样简单”，但大规模生产仍需关注成本控制和容错设计。
