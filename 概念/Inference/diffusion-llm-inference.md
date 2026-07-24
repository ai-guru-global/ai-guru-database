---
title: "Diffusion LLM 推理 (Mercury / LLaDA / 扩散语言模型 1000+ token/s)"
category: concepts
tags:
  - inference
  - diffusion-llm
  - mercury
  - llada
  - discrete-diffusion
  - parallel-decoding
  - speedup
aliases:
  - Diffusion LLM
  - Mercury
  - LLaDA
  - Discrete Diffusion
  - Parallel Decoding
  - Diffusion Language Model
relationships:
  - target: "概念/diffusion-llm"
    type: extends
  - target: "概念/inference-performance"
    type: related_to
  - target: "概念/eagle-3"
    type: related_to
  - target: "概念/parallel-decoding"
    type: related_to
summary: "Diffusion LLM(扩散语言模型)是 2024-2026 突破"自回归必须串行"的关键范式——Mercury(Inception Labs,1000+ token/s)、LLaDA(arXiv:2502.09992)、MDLM、SEDD 用"并行去噪"代替"逐 token 生成",推理速度 5-10x,且支持双向上下文。是 LLM 推理的"终极形态"。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# Diffusion LLM 推理

> **一句话理解**:Diffusion LLM 用"并行去噪"代替"逐 token 生成"——Mercury Coder 1000+ token/s(自回归 10-20x)、LLaDA 8B 是开源 SOTA,MDLM / SEDD 学术领先。是 LLM 推理速度的"终极武器"。

---

## 一、为什么需要 Diffusion LLM?

自回归 LLM 的"串行瓶颈":
- 每 token 必须等前一个生成
- 长文本慢,实时性差
- 难以利用 GPU 并行

Diffusion 范式解法:
- **并行去噪**:每步"全部 token 同时生成"
- **双向上下文**:看到未来信息
- **灵活停止**:可中途停止

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 扩散语言模型 | Diffusion Language Model | 离散扩散 + 语言 |
| 离散扩散 | Discrete Diffusion | 离散 token 的扩散 |
| 连续扩散 | Continuous Diffusion | 图像 / 连续值 |
| 去噪 | Denoising | 反向扩散过程 |
| 前向过程 | Forward Process | 加噪(从清晰到随机) |
| 反向过程 | Reverse Process | 去噪(从随机到清晰) |
| 并行解码 | Parallel Decoding | 多个 token 同时生成 |
| 掩码扩散 | Masked Diffusion | 用 [MASK] token 扩散 |
| 吸收扩散 | Absorbing Diffusion | 一种离散扩散范式 |
| 自回归 | Autoregressive(AR) | 逐 token 生成 |
| 双向 | Bidirectional | 看到上下文两侧 |
| 离散时间 | Discrete Time | 步数有限 |
| 训练 | Training | 预测 masked token |
| 采样 | Sampling | 反向过程生成 |
| 并行采样 | Parallel Sampling | 所有 token 同时去噪 |
| 解码策略 | Decoding Strategy | 半自回归等 |
| 掩码率 | Masking Rate | 当前 step 多少 token 被 mask |
| 置信度采样 | Confidence-Based Sampling | 选最确定的先生成 |
| 重掩码 | Remasking | 低置信 token 重新 mask |
| 半自回归 | Semi-Autoregressive | 块内并行,块间串行 |

---

## 三、主流方案对比(2026-02 快照)

| 方案 | 团队 | 规模 | 速度 | 质量 | 许可证 |
|---|---|---|---|---|---|
| **Mercury Coder** | Inception Labs | 0.5B-3B | 1000+ t/s | 与 GPT-4o mini 持平 | 商业 |
| **Mercury** | Inception Labs | 0.5B-3B | 1000+ t/s | 与 GPT-4o mini 持平 | 商业 |
| **LLaDA 8B** | 中国人民大学 / RUC | 8B | 200-500 t/s | 与 Llama 3 8B 持平 | Apache 2.0 |
| **LLaDA 1.5** | RUC | 8B-100B | 200-1000 t/s | 与 Qwen 2.5 持平 | Apache 2.0 |
| **MDLM** | Stanford | 7B | 100-300 t/s | 学术 | MIT |
| **SEDD** | Stanford | 7B | 100-300 t/s | 学术 | MIT |
| **DiffuGPT** | 字节跳动 | 100M-1B | 实验 | 学术 | 研究 |
| **DiffuLLaMA** | 清华 | 7B | 200 t/s | 与 Llama 2 7B 持平 | 研究 |
| **BD3-LM** | 加州大学 | 7B | 100 t/s | 实验 | 研究 |
| **MaskGIT** | Google | 图像 | — | 图像领域 SOTA | Apache 2.0 |

---

## 四、Mercury 详解(Inception Labs)

### 4.1 核心数据

- **速度**:Mercury Coder 1000+ tokens/s(自回归 10-20x)
- **质量**:在 HumanEval / MBPP / LiveCodeBench 与 GPT-4o mini 持平
- **延迟**:首 token < 100ms(自回归 ~500ms)

### 4.2 商业化

- API 接入 [inception.ai](https://www.inception.ai/)
- 价格:$0.25 / MTok(自回归 $3-15 的 1/10)
- 应用:实时对话、低延迟 Agent、代码补全

### 4.3 技术原理

- **双向上下文**:每步看到完整序列
- **并行去噪**:从全 [MASK] 到完整序列
- **置信度采样**:先解码高置信 token
- **多步去噪**:典型 8-16 步

---

## 五、LLaDA 详解(2025-02 开源)

### 5.1 核心创新

- 首个**8B 开源 Diffusion LLM**
- 100% 扩散范式,无 AR
- 预训练:1T+ tokens
- 在 MMLU / GSM8K / HumanEval 与 Llama 3 8B 持平

### 5.2 论文

- "Large Language Diffusion Models" [arxiv.org/abs/2502.09992](https://arxiv.org/abs/2502.09992)
- 仓库 [github.com/ML-GSAI/LLaDA](https://github.com/ML-GSAI/LLaDA)

### 5.3 实战

```python
from llada import LLaDAModel

model = LLaDAModel.from_pretrained(" GSAI-ML/LLaDA-8B")
output = model.generate(
    prompt="Hello, world!",
    num_steps=16,  # 去噪步数
    temperature=0.0,
)
print(output)
```

### 5.4 性能

- 8B 模型,单卡 A100 推理
- 速度:200-500 token/s(自回归 50-100)
- 显存:与同尺寸 AR 相当

---

## 六、训练 vs 推理流程

### 6.1 训练(掩码预测)

```
"Hello world" 
   ↓ 随机 mask 20%
"[MASK] world" / "Hello [MASK]"
   ↓
BERT-like 预测 mask
   ↓
CE loss
```

### 6.2 推理(并行去噪)

```
全 [MASK]
   ↓ Step 1
部分 [MASK] + 部分 token(高置信度)
   ↓ Step 2
更少 [MASK] + 完整
   ...
   ↓ Step 8
完整序列
```

---

## 七、关键技术挑战

### 7.1 训练稳定性

- 掩码率调度
- 多任务学习(掩码预测 + 双向)
- 数据效率(扩散需要更多数据)

### 7.2 推理质量

- 采样策略:贪婪 / 置信度 / 温度
- 步数选择:少则快但粗糙,多则慢但准
- 重掩码策略

### 7.3 工程化

- KV 缓存挑战(双向注意力)
- 长上下文 O(n) 内存
- 推理框架支持(vLLM 实验中)

---

## 八、生产最佳实践

1. **代码生成首选 Mercury Coder**:1000 t/s,价格低。
2. **开源选 LLaDA 1.5(2025-Q4)**:Apache 2.0,自部署。
3. **长文本用 Diffusion**:并行解码,延迟与长度无关。
4. **去噪步数 8-16**:质量与速度平衡。
5. **置信度采样**:先确定高置信 token,逐步填全。
6. **混合架构**:Diffusion 主 + AR fallback,处理难题。
7. **A/B 测试**:vs 同尺寸 AR,Diffusion 通常优 2-3x。
8. **批处理**:Diffusion 更适合 batch(并行特性)。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Mercury Coder** | 1000 t/s SOTA,Inception Labs 商业化 |
| **LLaDA 1.5** | 2025-Q4,100B 参数,中文 SOTA |
| **MDLM / SEDD** | 学术,Stanford |
| **vLLM 集成** | 实验性,2026-Q2 预计 |
| **企业应用** | 实时对话 / 代码补全 / 翻译 |
| **市场规模** | Diffusion LLM 商业化 $50M+ |
| **挑战** | 长上下文 / KV 缓存 / 多语言 |
| **趋势** | "Diffusion + AR" 混合架构 |
| **主要竞品** | Mercury / LLaDA / MDLM / SEDD / DiffuLLaMA |

---

## 十、See Also(官方源)

### 商业

- Mercury / Inception Labs [inception.ai](https://www.inception.ai/)

### 论文

- LLaDA 论文 [arxiv.org/abs/2502.09992](https://arxiv.org/abs/2502.09992)
- MDLM "Simple and Effective Masked Diffusion Language Models" [arxiv.org/abs/2406.07524](https://arxiv.org/abs/2406.07524)
- SEDD "Score Entropy Discrete Diffusion" [arxiv.org/abs/2310.16834](https://arxiv.org/abs/2310.16834)
- DiffuLLaMA [arxiv.org/abs/2402.14848](https://arxiv.org/abs/2402.14848)

### 代码

- LLaDA 仓库 [github.com/ML-GSAI/LLaDA](https://github.com/ML-GSAI/LLaDA)
- MDLM [github.com/kuleshov-group/mdlm](https://github.com/kuleshov-group/mdlm)
- SEDD [github.com/louaaron/Score-Entropy-Discrete-Diffusion](https://github.com/louaaron/Score-Entropy-Discrete-Diffusion)

### 相关

- MaskGIT [arxiv.org/abs/2202.04200](https://arxiv.org/abs/2202.04200)
- DiffuGPT [github.com/SJTU-LHC/UniDiffuser](https://github.com/SJTU-LHC/UniDiffuser)

---

## 十一、相关概念卡

- [[概念/diffusion-llm|Diffusion Llm]]
- [[概念/inference-performance|Inference Performance]]
- [[概念/eagle-3|Eagle 3]]
- [[概念/parallel-decoding|Parallel Decoding]]
- [[概念/llm-architectures|Llm Architectures]]
- [[概念/autoregressive-generation|Autoregressive Generation]]
- [[概念/llm-inference|Llm Inference]]
- [[概念/medusa|Medusa]]
