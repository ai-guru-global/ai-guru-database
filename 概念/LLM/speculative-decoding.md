---
title: Speculative Decoding (投机解码)
category: -concepts
tags: [inference, speculative-decoding, mtp, acceleration]
relationships:
  - target: "概念/model-deployment"
    type: optimizes
  - target: "概念/transformer-architecture"
    type: builds_on
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
  - 10_部署推理/06_Caching/Speculative_Decoding_Advanced_2026.md
summary: Speculative Decoding 用小模型(draft)快速生成候选 token，大模型(target)一次前向传播并行验证，接受率 >85%，实现 2-3× 延迟降低且不改变输出分布。DeepSeek MTP 变体无需外部 draft model，用内置辅助头实现投机解码。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03 00:00:00+00:00
updated: 2026-07-21
aliases:
  - "Speculative Decoding"
  - "speculative decoding"

name_zh: "投机解码"
---
# Speculative Decoding (投机解码)

> 中文简称：投机解码

## 核心要点

- **Draft-Verify 范式**：小模型快速生成 k 个候选 token，大模型一次前向传播并行验证全部候选
- **接受率 >85%**：多数候选 token 被接受，每步平均输出 1+k 个 token
- **输出分布不变**：通过 Rejection Sampling 保证输出与直接大模型采样统计等价
- **DeepSeek MTP 变体**：无需外部小模型，用训练时的辅助预测头作为 draft model

## 详细内容

### 标准 Speculative Decoding

```
Step 1: Draft Model 快速生成 k 个候选 token
  [The] → [cat] → [sat] → [on] → [the]    (k=4 candidates)

Step 2: Target Model 一次前向传播并行验证
  输入: [The, cat, sat, on, the]
  输出: 验证每个位置的概率分布

Step 3: Rejection Sampling 决定接受/拒绝
  如果 P_target(token) / P_draft(token) ≥ U(0,1) → 接受
  否则 → 拒绝该 token 及后续所有 token，从修正分布重新采样
```

### 变体方法

| 方法 | Draft Model | 特点 |
|------|------------|------|
| **Standard** | 独立小模型（如 Llama-68M） | 通用，需额外加载小模型 |
| **N-gram** | 基于 n-gram 匹配 | 无需额外模型，适合重复性文本 |
| **EAGLE/EAGLE3** | 特征级 draft head | 轻量级 head，精度高于 n-gram |
| **MTP (DeepSeek)** | 内置辅助预测头 | 训练时已学习，无需额外组件 |
| **Medusa** | 多 head 并行预测 | 多个预测头覆盖不同距离 |

### MTP (Multi-Token Prediction) 变体

DeepSeek-V3 的 MTP 在训练时增加辅助预测头，推理时天然作为 draft model：

```
训练阶段:  h_t → predict(t+1) + predict(t+2)   (双训练信号)
推理阶段:  MTP head → draft token    (快速，单层计算)
           Main model → verify token  (一次前向传播)
```

**vLLM 配置**：
```bash
--speculative_config '{
  "method": "mtp",
  "num_speculative_tokens": 1
}'
```

**限制**：DeepSeek 仅暴露单层 MTP 权重，MTP≥3 时质量不保证；算子限制 MTP ≤ 15。

## 性能指标

| 指标 | 典型值 |
|------|--------|
| 接受率 | >85%（贪心策略） |
| 延迟加速 | 2-3× |
| 吞吐提升 | 1.5-2× |
| 精度影响 | 无（统计等价） |
| 额外显存 | draft model 大小（通常 <1GB） |

## 2026 年推理引擎支持

| 引擎 | 支持方法 | 配置示例 |
|------|---------|----------|
| **vLLM** | MTP, EAGLE, N-gram, Draft Model | `--speculative_config` |
| **SGLang** | EAGLE, EAGLE-2 | `--speculative-algorithm EAGLE` |
| **TRT-LLM** | Draft Model, Medusa | `--speculative_decoding_mode` |
| **LMDEPLOY** | TurbMind (MTP) | 内置支持 |

## 方案选择指南

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| DeepSeek-V3/R1 | MTP | 内置，无额外开销 |
| 通用开源模型 | EAGLE-2 | 接受率高，加速大 |
| 重复性文本 | N-gram | 零成本，无需训练 |
| 极致延迟 | EAGLE-2 + 大 Draft Tree | 3-4× 加速 |
| 快速验证 | Medusa | 无需 draft model |

## 2026 生态现状

| 类别 | 代表 | 说明 |
|------|------|------|
| **内置 MTP** | DeepSeek-V3/R1, Qwen3 | 模型原生支持多 token 预测 |
| **EAGLE-2** | 开源 | 接受率最高，3-4x 加速 |
| **Medusa** | 开源 | 多头并行预测，无需 draft model |
| **N-gram** | vLLM/SGLang | 零成本，适合重复性文本 |
| **引擎集成** | vLLM, SGLang, TRT-LLM | 主流引擎均支持 |

## 生产最佳实践

1. **优先用内置 MTP**: 如果模型原生支持（DeepSeek-V3），无需额外配置
2. **通用模型用 EAGLE-2**: 接受率高，加速效果显著
3. **监控接受率**: 接受率 <60% 时考虑更换 draft 策略
4. **批处理场景谨慎**: 高并发时推测解码收益可能下降
5. **与量化结合**: INT8/FP8 量化 + 推测解码可叠加加速
6. **测试验证**: 确认推测解码不影响输出质量（理论上无损）

## 延伸阅读

- [[概念/LLM/eagle|EAGLE 推测解码]]
- [[概念/LLM/medusa|Medusa]]
- [[概念/LLM/mtp|Multi-Token Prediction]]
- [[概念/Inference/kv-cache|KV Cache]]
- [[10_部署推理/06_Caching/Speculative_Decoding_Advanced_2026|投机解码高级技术]]
- [[05_大模型/02_Sequence_Models/Text_Generation_Decoding_Strategies|文本生成解码策略]]

## 2026 推测解码生态

| 方法 | 加速比 | 原理 | 状态 |
|------|:------:|------|:----:|
| **标准推测** | 2-3x | 小模型草稿 + 大模型验证 | GA |
| **EAGLE-2** | 3-4x | 特征级推测，无需独立草稿模型 | GA |
| **Medusa** | 2-3x | 多头并行预测 | GA |
| **MTP** | 2-3x | 模型原生多 Token 预测 | GA |
| **Lookahead** | 1.5-2x | Jacobi 迭代并行解码 | 实验 |
| **Self-Speculative** | 2-3x | 模型自草稿（跳层） | 研究 |

## 工作原理图

```
标准自回归：
  [A] → [B] → [C] → [D] → [E]  (5步)

推测解码：
  草稿模型: [A] → [B,C,D,E]  (1步生成4个候选)
  目标模型: 验证 [B✓, C✓, D✓, E✗]  (1步验证)
  结果: 3个 Token 仅用 2步 → 加速 ~1.5x
```

## 配置示例 (vLLM)

```python
from vllm import LLM, SamplingParams

# 启用推测解码
llm = LLM(
    model="meta-llama/Llama-4-70B",
    speculative_model="meta-llama/Llama-4-8B",  # 草稿模型
    num_speculative_tokens=5,                    # 每步推测 Token 数
    speculative_draft_tensor_parallel_size=1,
)

params = SamplingParams(temperature=0, max_tokens=1024)
outputs = llm.generate("解释量子计算", params)
```

## 适用场景决策

| 场景 | 推荐 | 说明 |
|------|:----:|------|
| 低延迟单请求 | ✅ | 加速效果最明显 |
| 高并发批处理 | ⚠️ | 收益可能下降 |
| 代码生成 | ✅ | 重复模式多，接受率高 |
| 创意写作 | ⚠️ | 接受率可能较低 |
| 端侧推理 | ✅ | 小模型草稿成本低 |

## 生产最佳实践补充

1. **草稿模型选择**: 同系列小模型（如 Llama-4-8B 为 70B 草稿）
2. **推测长度调优**: 通常 3-7 个 Token，过长接受率下降
3. **低延迟场景优先**: 单请求场景收益最大
4. **批处理场景谨慎**: 高并发时推测解码收益可能下降
5. **与量化结合**: INT8/FP8 量化 + 推测解码可叠加加速
6. **测试验证**: 确认推测解码不影响输出质量（理论上无损）

## 延伸阅读

- [[概念/LLM/eagle|EAGLE]] — 最强推测解码方案
- [[概念/LLM/medusa|Medusa]] — 多头并行解码
- [[概念/LLM/mtp|Multi-Token Prediction]] — 原生多 Token
- [[概念/LLM/kv-cache|KV Cache]] — 解码加速基础
