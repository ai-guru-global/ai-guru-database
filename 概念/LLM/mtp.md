---
title: "Multi-Token Prediction (MTP) 多 Token 预测"
category: -concepts
tags: ["mtp", "multi-token-prediction", "speculative-decoding", "inference-optimization", "vllm", "deepseek"]
relationships:
  - target: "概念/speculative-decoding"
    type: related_to
  - target: "概念/deepseek-models"
    type: related_to
  - target: "概念/flash-attention-kernels"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "MTP (Multi-Token Prediction) 是 DeepSeek-V3 引入的推理加速技术——模型在训练时预测多个未来 Token，推理时用 Draft-Verify 机制一次性生成多个 Token，加速 2-3 倍。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
name_zh: "Multi-Token Prediction 多 Token 预测"
---

# Multi-Token Prediction (MTP)

> 中文简称：Multi-Token Prediction 多 Token 预测

> **一句话理解**: MTP 是"一次预测多个未来 Token"——DeepSeek-V3 首创，训练时教会模型预测下 N 个 Token，推理时用投机解码加速 2-3 倍。

---

## 1. 核心思想

传统自回归生成：每次只预测 1 个 Token

```
标准自回归（1 Token/步）：
Step 1: [今天] → 预测 "天"
Step 2: [今天天] → 预测 "气"
Step 3: [今天天气] → 预测 "很"
Step 4: [今天天气很] → 预测 "好"
→ 4 步生成 "今天天气很好"
```

MTP：每次预测 N 个未来 Token

```
MTP 多 Token 预测（N=4）：
Step 1: [今天] → 同时预测 "天" "气" "很" "好"
→ 1 步生成 "今天天气很好"
→ 验证全部通过 → 加速 4×
```

---

## 2. MTP 在 DeepSeek-V3 中的实现

| 维度 | 说明 |
|------|------|
| **MTP 模块** | 模型中独立的 MTP 预测头 |
| **预测深度** | 默认预测未来 1-4 个 Token |
| **训练方式** | 主 Loss + MTP Loss 联合训练 |
| **推理方式** | Draft-Verify（投机解码） |
| **加速比** | 推理 2-3× 加速 |

### DeepSeek-V3 MTP 架构

```
DeepSeek-V3 MTP 架构
│
├── 主模型（61 层 MoE）
│   ├── 标准自回归输出
│   └── 隐藏状态 → MTP 模块输入
│
├── MTP 模块（共享参数）
│   ├── MTP Layer 1 → 预测 Token[t+1]
│   ├── MTP Layer 2 → 预测 Token[t+2]
│   ├── MTP Layer 3 → 预测 Token[t+3]
│   └── MTP Layer N → 预测 Token[t+N]
│
└── 训练 Loss
    ├── L_main（主模型 Loss）
    └── L_mtp = Σ L_mtp_i（MTP Loss）
```

---

## 3. MTP vs 传统投机解码

| 维度 | 传统投机解码 | MTP (DeepSeek) |
|------|-----------|----------------|
| **Draft 模型** | 独立小模型 | 模型自带 MTP 头 |
| **额外参数** | 需加载独立 Draft 模型 | 共享主模型参数 |
| **Draft 质量** | 中（小模型） | 高（主模型特征） |
| **接受率** | 60-80% | **80-95%** |
| **加速比** | 1.5-2× | **2-3×** |
| **实现复杂度** | 需两个模型 | 单模型内置 |

---

## 4. 在推理框架中的支持

| 框架 | MTP 支持 | 说明 |
|------|---------|------|
| **vLLM** | ✅ 实验性 | 通过 MTP spec decoding 支持 |
| **SGLang** | ✅ | 原生支持 |
| **TensorRT-LLM** | ⚠️ | 需手动配置 |
| **Ollama** | ❌ | 不支持 |

---

## 5. 加速效果

| 模型 | 方法 | 加速比 | 接受率 |
|------|------|--------|--------|
| DeepSeek-V3 | MTP (N=1) | 1.5× | ~95% |
| DeepSeek-V3 | MTP (N=2) | 2.0× | ~90% |
| DeepSeek-V3 | MTP (N=4) | 2.5-3× | ~80% |
| LLaMA-70B | EAGLE-2 | 2.5× | ~85% |
| 通用模型 | 标准投机解码 | 1.5-2× | 60-80% |

---

## Related

- [[概念/speculative-decoding]] — 投机解码（Draft-Verify）
- [[概念/deepseek-models]] — DeepSeek 模型系列
- [[概念/flash-attention-kernels]] — FlashAttention 算子
- [[概念/prefill-decode]] — Prefill/Decode 推理阶段
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 MTP 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **DeepSeek-V3 MTP** | 原生多 Token 预测，接受率 80-95%，加速 2-3x | GA |
| **vLLM MTP 支持** | 实验性支持 MTP 投机解码 | Beta |
| **SGLang 原生支持** | 完整支持 MTP Draft-Verify 机制 | GA |
| **EAGLE-2/3** | 外部 Draft 模型投机解码，加速 2.5x | GA |
| **Medusa** | 多头并行预测，无需 Draft 模型 | GA |

## 生产最佳实践

1. **DeepSeek 模型优先用 MTP**：DeepSeek-V3 原生支持，接受率高，加速效果显著
2. **预测深度调优**：N=2 是平衡点，接受率 ~90%，加速 2x；N=4 接受率下降但加速更 高
3. **框架选择**：SGLang 对 MTP 支持最完整，vLLM 实验性支持
4. **与 KV Cache 配合**：MTP 验证失败的 Token 需回滚 KV Cache，确保状态一致性
5. **监控接受率**：生产环境监控 MTP 接受率，低于 70% 时考虑调整预测深度
6. **与量化结合**：FP8/INT4 量化 + MTP 可叠加加速
7. **低延迟场景优先**：单请求场景收益最大

## 2026 MTP 生态

| 模型 | MTP 支持 | 预测深度 | 加速比 | 状态 |
|------|:--------:|:--------:|:------:|:----:|
| **DeepSeek-V3** | 原生 | N=1 | ~1.8x | GA |
| **DeepSeek-R1** | 原生 | N=1 | ~1.8x | GA |
| **Qwen3 (实验)** | 插件 | N=2 | ~2x | 实验 |
| **Llama 4** | 无 | - | - | - |

## MTP vs 其他推测解码

| 方法 | 原理 | 需要额外模型 | 加速比 | 适用 |
|------|------|:----------:|:------:|------|
| **MTP** | 模型原生多预测 | 否 | 1.5-2x | 特定模型 |
| **EAGLE** | 特征级草稿头 | 否 (Draft Head) | 3-4x | 通用 |
| **标准推测** | 独立草稿模型 | 是 | 2-3x | 通用 |
| **Medusa** | 多头并行预测 | 否 (多头) | 2-3x | 通用 |

## 工作原理

```
标准自回归:
  [A] → [B] → [C] → [D]  (4步)

MTP (N=2):
  步1: 预测 [A] + 额外预测 [B']
  步2: 验证 [B✓] + 预测 [C] + 额外预测 [D']
  步3: 验证 [D✓]
  结果: 4 Token 用 3步 → 加速 ~1.3x
```

## 延伸阅读

- [[概念/LLM/speculative-decoding|推测解码]]
- [[概念/LLM/eagle|EAGLE]]
- [[概念/LLM/medusa|Medusa]]
- [[概念/Inference/inference-performance|推理性能优化]]
- [[10_部署推理/06_Caching/Speculative_Decoding_Advanced_2026|投机解码高级技术]]

## 配置示例 (SGLang)

```python
# SGLang 中启用 MTP
import sglang as sgl

runtime = sgl.Runtime(
    model_path="deepseek-ai/DeepSeek-V3",
    speculative_algorithm="EAGLE",  # MTP 通过 EAGLE 接口
    speculative_num_steps=1,         # N=1
    speculative_eagle_topk=1,
)
```

## 适用场景

| 场景 | 推荐 | 说明 |
|------|:----:|------|
| DeepSeek 模型推理 | ✅ | 原生支持，效果最佳 |
| 低延迟单请求 | ✅ | 加速效果明显 |
| 高并发批处理 | ⚠️ | 收益可能下降 |
| 非 DeepSeek 模型 | ❌ | 无原生支持 |
