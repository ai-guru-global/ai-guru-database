---
title: "EAGLE-3 / 投机解码 SOTA (EAGLE / EAGLE-2 / EAGLE-3 / 3-3.5x 加速)"
category: concepts
tags:
  - inference
  - speculative-decoding
  - eagle
  - eagle-3
  - feature-level
  - 3x-speedup
aliases:
  - EAGLE
  - EAGLE-2
  - EAGLE-3
  - Extrapolation Algorithm for Greater Language-model Efficiency
  - Feature-Level Speculative Decoding
relationships:
  - target: "概念/speculative-decoding"
    type: extends
  - target: "概念/medusa"
    type: related_to
  - target: "概念/training-inference-co-design"
    type: related_to
  - target: "概念/vllm"
    type: related_to
summary: "EAGLE / EAGLE-2 / EAGLE-3 是 2024-2026 投机解码 SOTA——从 token 嵌入层特征(EAGLE-1)到动态树搜索(EAGLE-2)再到多层特征融合(EAGLE-3),在 Llama-3 70B 上 3-3.5x 加速、质量无损失。是推理优化的关键基础设施。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# EAGLE-3 / 投机解码 SOTA

> **一句话理解**:EAGLE-3(2025-04)把投机解码推到 3.5x 加速——用主模型中间层特征 + 轻量 transformer head,联合训练保证无质量损失。是 vLLM / SGLang / TensorRT-LLM 必集成的优化。

---

## 一、什么是投机解码?

投机解码(Speculative Decoding)用"小模型先猜,大模型验证":
- **小模型(草稿)**:快速生成 N 个候选 token
- **大模型(目标)**:并行验证,接受 / 拒绝
- 接受率越高,加速越明显

**加速比 = 平均接受长度 / (草稿时间 + 验证时间)**

---

## 二、EAGLE 三代演进

| 版本 | 年份 | 关键创新 | 加速比 |
|---|---|---|---|
| **EAGLE-1** | 2024-04 | 单层特征 + 自回归 head | 2.0x |
| **EAGLE-2** | 2024-06 | 动态树 + 信心深度测试 | 2.7x |
| **EAGLE-3** | 2025-04 | 多层特征融合 + 多 token 预测 | **3.5x** |

---

## 三、EAGLE-1 架构

```
主模型第 i 层 hidden state
   ↓
[轻量 transformer] (单层,小)
   ↓
下一 token 概率
   ↓
主模型下一步验证
```

---

## 四、EAGLE-2 架构

### 4.1 动态树搜索

- 不再是线性 1-by-1
- 用 confidence 决定扩展宽度
- 树状扩展,提高接受率

### 4.2 接受率提升

- 60-70%(EAGLE-1)→ 75-85%(EAGLE-2)

---

## 五、EAGLE-3 详解

### 5.1 核心创新

- **多层特征融合**:不只取第 i 层,融合 5-10 层中间特征
- **多 token 预测**:head 一次预测 3 个 token
- **训练-推理一致性**:联合训练,接受率优化

### 5.2 架构

```
主模型多层特征 [h_5, h_10, h_15, h_20, h_25]
   ↓
[融合 + 投影]
   ↓
[EAGLE-3 Head (轻量 transformer)]
   ↓
[t+1, t+2, t+3] 多 token 预测
   ↓
主模型一次性验证 3 个 token
```

### 5.3 性能数据

| 模型 | 加速比 | 接受率 | 质量损失 |
|---|---|---|---|
| **Llama-3 8B** | 3.3x | 78% | 0% |
| **Llama-3 70B** | 3.5x | 82% | 0% |
| **Qwen2.5 72B** | 3.4x | 80% | 0% |
| **Mistral-Large 3 675B** | 2.8x | 75% | 0% |

### 5.4 论文与代码

- EAGLE-3 论文 [arxiv.org/abs/2503.01840](https://arxiv.org/abs/2503.01840)
- 仓库 [github.com/SafeAILab/EAGLE](https://github.com/SafeAILab/EAGLE)
- 训练数据 [huggingface.co/datasets/SafeAILab/EAGLE3-LLaMA3-Instruct-Data](https://huggingface.co/datasets/SafeAILab/EAGLE3-LLaMA3-Instruct-Data)

---

## 六、与其他方案对比

| 方案 | 加速 | 接受率 | 训练 | 部署 |
|---|---|---|---|---|
| **自回归基线** | 1x | — | — | — |
| **Lookahead** | 1.5x | — | 无 | 易 |
| **Medusa-1** | 2.0x | 65% | 必训 | 易 |
| **Medusa-2** | 2.5x | 72% | 必训 | 中 |
| **Hydra** | 2.5x | 75% | 必训 | 中 |
| **EAGLE-2** | 2.7x | 78% | 必训 | 中 |
| **EAGLE-3** | **3.5x** | **82%** | 必训 | 中 |

---

## 七、实战

### 7.1 安装

```bash
pip install eagle-speculative
```

### 7.2 训练

```bash
python -m eagle.train \
    --base_model meta-llama/Meta-Llama-3-8B-Instruct \
    --data data/eagle3_train.json \
    --output_dir ./eagle3-llama3-8b
```

### 7.3 vLLM 集成

```python
from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    speculative_model="./eagle3-llama3-8b",
    speculative_method="eagle3",
    num_speculative_tokens=5,
)

output = llm.generate(["Hello, world!"], SamplingParams(max_tokens=100))
print(output[0].outputs[0].text)
```

---

## 八、生产最佳实践

1. **EAGLE-3 是 SOTA**:3-3.5x 加速,质量无损失。
2. **联合训练必做**:投机 head 与主模型一起训,接受率最优。
3. **接受率监控**:> 75% 良好,< 60% 检查训练。
4. **num_speculative_tokens = 5-8**:平衡加速与延迟。
5. **温度低时加速大**:temperature < 0.3 接受率 > 85%。
6. **大模型(70B+)收益更明显**:加速比随规模增加。
7. **vLLM 原生支持**:生产首选,集成成本低。
8. **多 batch 时注意**:投机解码与 batching 配合调优。
9. **A/B 测试**:不同任务接受率差异大(代码 > 80%,创意 < 70%)。
10. **持续微调**:业务数据可微调 EAGLE head,效果更佳。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **EAGLE-3** | v3.0 GA(2025-04),3.5x 加速 SOTA |
| **vLLM 集成** | v0.6+ 原生,生产稳定 |
| **SGLang 集成** | v0.3+ 支持 |
| **TensorRT-LLM** | 2025-10 集成 |
| **数据合成** | SafeAILab 开源 EAGLE3 训练数据 |
| **企业应用** | 推理成本敏感场景首选,30-70% 成本降 |
| **ARR 规模** | 整体 LLM 推理市场 $2B+ |
| **主要竞品** | EAGLE / Medusa / Hydra / Lookahead / REST |

---

## 十、See Also(官方源)

### 论文

- EAGLE-1 [arxiv.org/abs/2401.15077](https://arxiv.org/abs/2401.15077)
- EAGLE-2 [arxiv.org/abs/2406.16858](https://arxiv.org/abs/2406.16858)
- EAGLE-3 [arxiv.org/abs/2503.01840](https://arxiv.org/abs/2503.01840)

### 代码与数据

- EAGLE 仓库 [github.com/SafeAILab/EAGLE](https://github.com/SafeAILab/EAGLE)
- 训练数据 [huggingface.co/datasets/SafeAILab](https://huggingface.co/datasets/SafeAILab)

### 集成

- vLLM 投机解码 [docs.vllm.ai/en/latest/features/speculative-decoding.html](https://docs.vllm.ai/en/latest/features/speculative-decoding.html)
- SGLang EAGLE [github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)
- TensorRT-LLM [github.com/NVIDIA/TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)

### 其他投机解码

- Medusa [github.com/FasterDecoding/medusa](https://github.com/FasterDecoding/medusa)
- Hydra [arxiv.org/abs/2402.05129](https://arxiv.org/abs/2402.05129)
- Lookahead [arxiv.org/abs/2402.02057](https://arxiv.org/abs/2402.02057)

---

## 十一、相关概念卡

- [[概念/speculative-decoding|Speculative Decoding]]
- [[概念/eagle|Eagle]]
- [[概念/medusa|Medusa]]
- [[概念/training-inference-co-design|Training Inference Co Design]]
- [[概念/vllm|Vllm]]
- [[概念/inference-performance|Inference Performance]]
- [[概念/llm-infrastructure|Llm Infrastructure]]
- [[概念/sglang|Sglang]]
