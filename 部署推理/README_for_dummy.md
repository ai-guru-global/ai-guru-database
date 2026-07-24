---
title: '09 部署与推理 — 小白版 🚀'
category: '10-deployment-inference'
tags: ["deployment", "inference", "serving", "vllm"]
summary: '> **一句话秒懂**: 部署就是让 AI "上岗"——训练好的模型怎么变成服务，让大家都能用，同时要快、稳、省钱！'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Readme For Dummy"
  - "README for dummy"
  - README_for_dummy
sources: []

---
# 09 部署与推理 — 小白版 🚀

> **一句话秒懂**: 部署就是让 AI "上岗"——训练好的模型怎么变成服务，让大家都能用，同时要快、稳、省钱！

## 为什么要学部署？

想象一下：
- 🏭 训练好的模型怎么让别人用？
- ⚡ 怎么让 AI 回答得更快？
- 💰 怎么省服务器成本？

**部署 = AI 从"实验室"走向"生产线"**

## 训练 vs 推理

```
【训练】= 学习阶段
- 一次性或周期性
- 需要大量计算
- GPU 是必须的
- 例如: 训练 ChatGPT

【推理】= 预测阶段
- 持续运行
- 更注重速度和成本
- 可以优化
- 例如: ChatGPT 回答你的问题
```

## 推理引擎

```
【主流推理框架】

┌─────────────────────────────────────────────────────────┐
│                                                         │
│  vLLM ─── 吞吐量高，PagedAttention 显存优化           │
│                                                         │
│  SGLang ─── 前缀缓存快，吞吐量极高                      │
│                                                         │
│  TensorRT-LLM ─── NVIDIA 官方，低延迟                  │
│                                                         │
│  llama.cpp ─── CPU 可跑，量化友好                       │
│                                                         │
│  Ollama ─── 本地部署最简单                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 优化技术

### 1. 量化

```
【问题】模型太大，显存不够

【解决】量化

FP16 (16位) → INT8 (8位) → INT4 (4位)

效果:
✓ 显存减少 2-4 倍
✓ 速度提升 2-3 倍
✓ 精度略有下降（但可接受）
```

### 2. 批量推理

```
【问题】一个一个请求处理太慢

【解决】动态批处理

请求:
用户A: "你好" ─┐
用户B: "天气" ─┼→ 合并 → 一起处理 → 分别返回
用户C: "新闻" ─┘

✓ 吞吐量提升 5-10 倍
✓ 成本降低
```

### 3. KV Cache

```
【问题】对话时重复计算之前的 token

【解决】KV Cache

之前:
每次生成都重新计算所有 token 的 Key-Value

现在:
第一次计算后缓存起来
后续只计算新 token

✓ 速度提升 2-10 倍
```

### 4. 投机解码

```
【问题】生成太慢（一步生成一个 token）

【解决】投机解码

用小模型快速生成多个 token
大模型一次验证
如果小模型猜对，大模型直接接受
✓ 平均 2-3 个 token 一次生成
```

## 部署架构

### 1. 基本架构

```
        用户请求
            ↓
      ┌───────────┐
      │ API Gateway│
      └─────┬─────┘
            ↓
      ┌───────────┐
      │  推理服务  │
      │  (vLLM等) │
      └─────┬─────┘
            ↓
      ┌───────────┐
      │   GPU     │
      └───────────┘
```

### 2. 多副本架构

```
              用户请求
                 ↓
           ┌─────────┐
           │ Load Balancer │
           └────┬────┘
                ↓
    ┌──────────┼──────────┐
    ↓          ↓          ↓
┌──────┐  ┌──────┐  ┌──────┐
│ GPU 1 │  │ GPU 2 │  │ GPU 3 │
│ Replica│  │ Replica│  │Replica│
└──────┘  └──────┘  └──────┘

✓ 扛住更多并发
✓ 一个挂了不影响服务
```

## 云服务 vs 本地部署

```
【云服务】 AWS SageMaker, 阿里云 PAI

优点:
✓ 不用管服务器
✓ 按需付费
✓ 弹性扩缩

缺点:
✗ 长期成本高
✗ 数据可能不能出境

【本地部署】自有 GPU 集群

优点:
✓ 数据安全
✓ 长期成本低
✓ 可定制

缺点:
✗ 需要运维团队
✗ 初始投入大
```

## 性能指标

```
【关键指标】

延迟:
- TTFT: 第一个 token 出来的时间
- TPS: 每秒生成 token 数
- E2E Latency: 端到端响应时间

吞吐:
- QPS: 每秒请求数
- Concurrent Users: 并发用户数

成本:
- $/1000 tokens
- $/hour
```

## 下一步

- 想学 MLOps？→ [MLOps/README_for_dummy.md](../模型运维/README_for_dummy.md)
- 想学推理框架？→ 查看子目录具体文档
- 想学架构？→ [架构基建/README_for_dummy.md](../架构基建/README_for_dummy.md)

---

*本文是 [README.md](README.md) 的简化版，适合零基础读者。*

## Related

- [[部署推理/Deployment_Fundamentals/Deployment_Inference.md|Deployment_Inference]]
- [[部署推理/Deployment_Fundamentals/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[部署推理/Deployment_Fundamentals/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[部署推理/Deployment_Fundamentals/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[部署推理/Inference_Engines/JVM_AI_Deployment.md|JVM_AI_Deployment]]
