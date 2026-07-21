---
title: "EAGLE 推测解码 (EAGLE Speculative Decoding)"
category: -concepts
tags: ["eagle", "speculative-decoding", "draft-model", "inference-optimization", "feature-level", "eagle-2"]
relationships:
  - target: "概念/Inference/speculative-decoding"
    type: related_to
  - target: "概念/LLM/mtp"
    type: related_to
  - target: "概念/Inference/flashinfer"
    type: uses
  - target: "概念/LLM/medusa"
    type: related_to
  - target: "概念/Inference/inference-performance"
    type: improves
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - "https://arxiv.org/abs/2401.15077"  # EAGLE paper
  - "https://arxiv.org/abs/2406.16858"  # EAGLE-2 paper
summary: "EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency) 是特征级推测解码方案，用轻量 Draft Head 预测目标模型的特征而非 Token，接受率达 80-90%，加速 2-3×。EAGLE-2 通过动态 Draft Tree 进一步提升至 3-4× 加速，是 2026 年自推测解码的主流方案。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "EAGLE"
  - "EAGLE Speculative Decoding"
  - "EAGLE-2"
  - "EAGLE 推测解码"

---

# EAGLE 推测解码

> **一句话理解**: EAGLE 是“更聪明的投机解码”——不用独立小模型，而是用轻量 Head 预测目标模型内部特征，接受率更高、加速更大。

## 核心思想

```
传统投机解码：
├── Draft Model（独立小模型）
│   └── 预测 Token → 目标模型验证
└── 问题：Draft 质量有限，接受率 60-80%

EAGLE 推测解码：
├── Feature Head（轻量网络，~1% 参数）
│   ├── 输入：目标模型最后一层隐藏状态
│   └── 输出：预测下一层隐藏状态 → 解码 Token
└── 优势：特征级预测，接受率 80-90%
```

**关键创新**：在特征空间而非 Token 空间做预测，因为特征空间的连续性比离散 Token 更容易外推。

## EAGLE vs 传统投机解码

| 维度 | 传统投机解码 | EAGLE | EAGLE-2 |
|------|-----------|-------|--------|
| **Draft 来源** | 独立小模型 | 特征外推 Head | 动态 Draft Tree |
| **额外参数** | 需加载完整模型 | ~1% 目标模型参数 | ~1% |
| **接受率** | 60-80% | 80-90% | **85-95%** |
| **加速比** | 1.5-2× | 2-3× | **3-4×** |
| **显存开销** | 大（额外模型） | 极小 | 极小 |
| **训练成本** | 需独立训练 Draft | 轻量 Head 微调 | 轻量 Head 微调 |

## EAGLE-2 改进

| 改进 | 说明 |
|------|------|
| **动态 Draft Tree** | 根据置信度动态选择 Draft 数量和深度 |
| **Context-aware** | 利用完整上下文特征，而非仅最后 Token |
| **更高接受率** | 85-95%，接近无损 |
| **无需重训** | 可复用 EAGLE Head |
| **自适应树结构** | 高置信度时深 Draft，低置信度时浅 Draft |

## 推测解码方案全景对比

| 方案 | Draft 来源 | 加速比 | 接受率 | 显存 | 2026 状态 |
|------|-----------|:------:|:------:|:----:|:------:|
| **标准投机解码** | 独立小模型 | 1.5-2× | 60-80% | 大 | 少用 |
| **Medusa** | 多头并行预测 | 2-3× | 70-85% | 小 | 被替代 |
| **EAGLE** | 特征外推 | 2-3× | 80-90% | 极小 | 活跃 |
| **EAGLE-2** | 动态 Draft Tree | **3-4×** | **85-95%** | 极小 | **主流** |
| **MTP (DeepSeek)** | 模型内置预测头 | 2-3× | 80-95% | 无额外 | **主流** |

## 性能数据

| 模型 | 场景 | EAGLE 加速 | EAGLE-2 加速 | 接受长度 |
|------|------|:--------:|:---------:|:------:|
| Llama-2-7B | 对话 | 2.8× | 3.5× | 3.8 tok/step |
| Llama-2-13B | 代码 | 3.0× | 3.8× | 4.2 tok/step |
| Mixtral-8x7B | 摘要 | 2.5× | 3.2× | 3.5 tok/step |
| Qwen2.5-72B | 对话 | 2.6× | 3.4× | 3.7 tok/step |

## 在推理框架中的支持

| 框架 | EAGLE 支持 | 说明 |
|------|:---------:|------|
| **SGLang** | ✅ 原生 | `--speculative-algorithm EAGLE` |
| **vLLM** | ✅ 实验 | 需配置 Draft Head 路径 |
| **TensorRT-LLM** | ⚠️ | 需手动配置 |
| **Ollama** | ❌ | 不支持 |

### SGLang 部署示例

```bash
# 启动 EAGLE 推测解码
python -m sglang.launch_server \
    --model-path meta-llama/Llama-2-7b-chat-hf \
    --speculative-algorithm EAGLE \
    --speculative-draft-model-path eagle-head-llama2-7b \
    --speculative-num-steps 5 \
    --speculative-eagle-topk 8
```

## 2026 生态定位

| 方面 | 说明 |
|------|------|
| **当前状态** | EAGLE-2 是自推测解码的主流方案 |
| **与 MTP 对比** | MTP 需模型内置支持，EAGLE 可后加 |
| **适用模型** | 任何自回归 LLM（无需模型修改） |
| **最佳场景** | 延迟敏感、单用户交互 |
| **不适合** | 高并发 batch（加速比下降） |

## 生产最佳实践

1. **优先 EAGLE-2**：比 EAGLE v1 加速比提升 30%+
2. **延迟敏感场景使用**：单用户交互、实时对话收益最大
3. **高并发场景谨慎**：batch 较大时推测解码收益递减
4. **与 GQA 正交**：可同时使用 GQA 模型 + EAGLE 加速
5. **监控接受率**：接受率低于 70% 时检查 Draft Head 质量
6. **Draft Head 训练**：用目标模型相同领域数据微调，提升接受率

## Related

- [[概念/Inference/speculative-decoding]] — 投机解码
- [[概念/LLM/mtp]] — Multi-Token Prediction
- [[概念/LLM/medusa]] — Medusa 多头推测解码
- [[概念/Inference/flashinfer]] — FlashInfer 算子库
- [[概念/Inference/inference-performance]] — 推理性能优化
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
