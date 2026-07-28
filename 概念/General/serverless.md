---
title: "无服务器 AI 推理（Serverless AI Inference）"
tags: [serverless, serverless-gpu, modal, replicate, lambda, cloud-run, ai-inference]
aliases:
  - "Serverless AI"
  - "无服务器 AI"
  - "Serverless GPU"
category: -concepts
sources:
  - 10_部署推理/02_Inference_Engines/Modal_Deep_Dive.md
  - 10_部署推理/02_Inference_Engines/KServe_Deep_Dive.md
  - 概念/modal
  - 概念/replicate
relationships:
  - target: "概念/modal"
    type: belongs_to
  - target: "概念/replicate"
    type: belongs_to
  - target: "概念/cold-start"
    type: core_concept
  - target: "概念/auto-scaling"
    type: related_to
summary: "无服务器 AI 推理是通过 Modal/Replicate/AWS Lambda/Cloud Run 等平台，按请求粒度自动扩缩 GPU/CPU 资源、按使用秒数计费的部署范式，无需管理服务器，适合低频/突发流量和原型验证。"
lifecycle: reviewed
tier: supporting
provenance:
  extracted: 0.70
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.80
created: 2026-06-24
updated: 2026-07-21
name_zh: "无服务器 AI 推理"
---

# 无服务器 AI 推理（Serverless AI Inference）

> 中文简称：无服务器 AI 推理

## 一句话定义

**无服务器 AI 推理 = 函数即服务 + GPU 冷启动优化 + 按使用计费** —— 在 Modal / Replicate / AWS Lambda / Google Cloud Run 等平台上，将 LLM 推理封装为按事件触发的函数，平台自动处理 GPU 资源申请、容器冷启动、扩缩容，开发者只需编写推理逻辑，按实际 GPU 使用秒数（或请求数）付费。

## 主流 Serverless AI 平台

| 平台 | GPU 支持 | 计费单位 | 冷启动 | 强项 |
|------|---------|---------|--------|------|
| **Modal** | A10G/A100/H100/B200 | GPU-秒 | 5-15s | 工程师友好、Pythonic |
| **Replicate** | A40/A100/H100 | 硬件-秒 | 10-30s | 模型市场、版本管理 |
| **AWS Lambda** | 仅 CPU + Inferentia | GB-秒 + 请求 | < 1s | 企业集成、VPC |
| **Google Cloud Run** | L4 (GA) | vCPU-秒 + GB-秒 | 5-15s | GCP 生态 |
| **Azure Container Apps** | T4/A100（preview） | vCPU-秒 | 10-30s | Azure 集成 |
| **RunPod Serverless** | 全谱 GPU | GPU-秒 | 5-10s | 价格最低 |
| **Beam** | A10G/A100/H100 | GPU-秒 | 10-20s | 长时运行 + 流式 |
| **Banana** | A100 | GPU-秒 | 15-30s | LLM 微服务 |

## 工作原理

```
                 触发事件                      资源分配                执行
                 ┌────────┐                  ┌─────────┐           ┌────────┐
HTTP 请求 ────►  │ API    │ ────► cold ──►  │ GPU 容器 │ ────►   │ 推理   │
                 │ Gateway│        start     │ 拉起     │           │ 代码   │
                 └────────┘                  └─────────┘           └────────┘
                                                  │
                                                  │ 闲置 N 秒
                                                  ▼
                                            自动缩容到 0
                                          （下次冷启动）
```

## 核心优势

### 1. 零运维

- 无需管理 GPU 服务器、网络、驱动、CUDA 版本
- 平台处理容器镜像构建、镜像仓库、安全补丁
- 自动扩缩容应对流量峰值

### 2. 极致成本效率

| 场景 | 自托管 | Serverless |
|------|--------|-----------|
| 低频（< 100 请求/天） | ¥3000/月（1×H100 闲置） | ¥30/月（按用量） |
| 中频（10K 请求/天） | ¥3000/月 | ¥500/月 |
| 突发（10x 流量尖峰） | 需提前扩容 | 自动应对 |

**经验阈值**：每月 < 50 万 token、突发性流量、单次推理 < 30s 的场景，Serverless 几乎总是更便宜。

### 3. 快速原型验证

```python
# Modal 示例：5 行部署一个 Stable Diffusion 服务
import modal

app = modal.App("sd-server")

@app.function(gpu="A10G", image=modal.Image.debian_slim().pip_install("diffusers"))
def generate(prompt: str) -> bytes:
    from diffusers import StableDiffusionPipeline
    pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1")
    return pipe(prompt).images[0].tobytes()

@app.local_entrypoint()
def main():
    image = generate.remote("a cat in space")
    with open("/tmp/cat.png", "wb") as f:
        f.write(image)
```

## 核心挑战

### 1. 冷启动延迟（最痛点）

| 平台 | 平均冷启动 | 优化手段 |
|------|----------|---------|
| Modal | 5-15s | 预热容器、snapshot |
| Replicate | 10-30s | cog 工具预构建镜像 |
| AWS Lambda | <1s（CPU） | Provisioned Concurrency |
| Cloud Run | 5-15s | min-instances 配置 |

**对 LLM 推理的影响**：70B 模型加载本身就要 30-60s，Serverless 平台通过镜像预热 + 快照技术压缩到 10s 内，但仍显著高于长连接推理。

### 2. 模型大小限制

- Modal / Replicate：单容器最大 80GB（基本满足 70B INT4 量化的需求）
- AWS Lambda：10GB（仅 CPU / Inferentia，适合小模型蒸馏版）

### 3. 状态保持困难

- WebSocket 长连接支持有限（Modal 支持、Lambda 不支持）
- 流式输出需特殊处理（SSE 或 chunked transfer）
- 会话状态需外置（Redis、PostgreSQL）

### 4. 调试困难

- 本地与生产环境不一致
- 冷启动失败难以重现
- 日志分散

## 与传统部署的对比

| 维度 | Serverless | 传统 vLLM/TGI | Kubernetes |
|------|-----------|---------------|-------------|
| 部署速度 | 分钟级 | 小时级 | 天级 |
| 运维复杂度 | 极低 | 中 | 高 |
| 冷启动延迟 | 5-30s | 0 | 0 |
| 单请求成本（高频） | 较高 | 低 | 最低 |
| 单请求成本（低频） | 极低 | 高 | 高 |
| 模型大小 | 中等 (<80GB) | 任意 | 任意 |
| 流式输出 | ✅（多数支持）| ✅ | ✅ |
| 适合流量 | 突发、低-中 | 稳定高 | 任意 |

## 何时选择 Serverless AI

✅ **推荐场景**：
- **原型 / Demo 验证**（周末就能上线）
- **低频内部工具**（公司内 RAG 助手）
- **突发流量应用**（营销活动触发的 LLM 调用）
- **异步批处理**（夜间跑大量 embedding）
- **个人项目 / 学习**（无需担心欠费）

⚠️ **不推荐场景**：
- 极致延迟敏感（<100ms P99）
- 7×24 高 QPS 在线服务
- 超大模型（>80GB）
- 复杂 Agent 多轮对话状态

## 混合架构建议

生产系统通常 **混合使用**：

```
流量入口（API Gateway）
    │
    ├─► 高频在线请求 ──► 传统 vLLM 集群（保活、低延迟）
    │
    ├─► 中频请求     ──► Modal/Cloud Run（弹性）
    │
    └─► 低频/离线批处理 ──► Serverless GPU（极致成本）
```

## 发展趋势（2026）

- **冷启动优化**：容器快照、模型权重预热到 S3/OSS、本地 NVMe 缓存
- **专用 AI Serverless**：Modal v0.6+、Replicate v1.0、Banana v3 性能大幅提升
- **多模态原生**：图像/视频处理流水线 serverless 化
- **边缘 Serverless**：Cloudflare Workers AI、Vercel AI SDK 在边缘节点运行轻量模型
- **BYOC（Bring Your Own Cluster）**：保留 Serverless 编程模型，运行在客户 K8s

---

**参见**：[[Modal_Deep_Dive]] · [[KServe_Deep_Dive]] · [[概念/modal]] · [[概念/replicate]] · [[10_部署推理/README|部署推理]] · [[10_部署推理/02_Inference_Engines/README]]

---

## 2026 Serverless AI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **GPU Serverless** | Modal/RunPod/Replicate 按秒计费 GPU | GA |
| **KServe Serverless** | K8s 原生模型服务自动扩缩到零 | GA |
| **冷启动优化** | 模型缓存 + 预热减少冷启动延迟 | GA |
| **事件驱动** | 基于请求队列自动扩缩容 | GA |
| **成本优化** | 闲时缩容到零，按实际使用付费 | GA |

## 生产最佳实践

1. **冷启动评估**：测试冷启动延迟是否满足业务 SLO，不满足则保留最小实例
2. **批处理优化**：合并请求提升 GPU 利用率，降低单次调用成本
3. **超时配置**：设置合理超时，避免长尾请求占用资源
4. **监控告警**：跟踪冷启动率、并发数、错误率，设置告警
5. **混合部署**：稳定负载用常驻实例，突发负载用 Serverless 弹性