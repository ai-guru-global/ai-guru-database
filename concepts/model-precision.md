---
title: 模型精度 (Model Precision & Accuracy)
category: concepts
tags: [precision, accuracy, quantization, fp16, bf16, int4, int8, benchmark]
relationships:
  - target: "concepts/mixed-precision"
    type: detailed_by
  - target: "concepts/model-compression"
    type: applied_via
  - target: "concepts/model-evaluation"
    type: measured_by
  - target: "concepts/model-serving"
    type: impacts
  - target: "concepts/model-inference"
    type: affects
sources:
  - 09_Deployment_Inference/Quantization_Techniques_2026.md
  - 09_Deployment_Inference/Quantization_Precision_Deep_Dive.md
  - 09_Deployment_Inference/Deployment_Inference_2026.md
  - 08_Model_Evaluation/README.md
summary: "精度"在大模型语境中有两层含义：数值精度（每个参数用几位存储，FP32→INT4 逐级压缩）和模型准确性（benchmark 得分）。两者关系是——数值精度是手段，模型准确性是目的。量化的艺术就是在"省资源"和"不变傻"之间找平衡。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16 00:00:00+00:00
updated: 2026-06-16 00:00:00+00:00
---

# 模型精度 (Model Precision & Accuracy)

## 核心要点

- **"精度"有两层含义**：数值精度（数据类型的位数）和模型准确性（输出质量），日常讨论中经常混用，需要区分
- **数值精度**：每个参数用几个 bit 存储——FP32（4字节）→ FP16/BF16（2字节）→ INT8（1字节）→ INT4（0.5字节）
- **模型准确性**：模型在 benchmark 上的正确率——MMLU、HumanEval、GSM8K 等
- **核心权衡**：数值精度越低 → 模型越小越快 → 但可能"变傻"（准确性下降）
- **量化失效三模式**：长尾知识丢失、重复生成、格式退化——模型的"聪明"藏在权重的微小差异里
- **层敏感度不均**：Attention Q/K/V 投影层极敏感，FFN 中间层相对鲁棒——好算法（AWQ/GPTQ）会差别对待

## 详细内容

### 一、数值精度——数字存几位小数

**类比：记账精度**

| 数据类型 | 类比 | 每参数字节 | 70B 模型大小 |
|----------|------|-----------|-------------|
| **FP32** | 精确到分：¥123.456789 | 4 | ~280 GB |
| **FP16** | 精确到角：¥123.5 | 2 | ~140 GB |
| **BF16** | 同 FP16 空间，但能记更大的数（范围宽） | 2 | ~140 GB |
| **INT8** | 只记整数：¥123 | 1 | ~70 GB |
| **INT4** | 只记到十位：¥120 | 0.5 | ~35 GB |

精度层级链：

```
FP32 → TF32 → BF16 → FP16 → FP8 → INT8 → INT4/NF4
最高精度                                    最低精度
训练主权重                                  极限推理量化
```

### 浮点精度的大白话类比：记录身高

| 数据类型 | 记录方式 | 占用空间 | 精确程度 |
|----------|----------|----------|----------|
| **FP32** | 1.75321 米 | 4 字节 | 最精确 |
| **FP16** | 1.75 米 | 2 字节 | 很精确 |
| **BF16** | 1.75 米（但能记更高的人） | 2 字节 | 类似 FP16 |
| **FP8** | 1.8 米 | 1 字节 | 够用 |
| **FP4** | 约 1.8 米 / 约 1.7 米 | 0.5 字节 | 较粗糙但最快 |

**FP8 和 FP4 的特别之处**：

- FP8 / FP4 不是整数，仍然是浮点数（能表示 1.8、0.003 这类小数）
- 相比 INT8 / INT4，浮点格式对特别大或特别小的数更友好
- 真武 M890 等新一代 AI 芯片原生支持 FP32 → FP4 全精度，意味着：
  - 训练时可用 FP32/FP16 保精度
  - 推理时可切到 FP8/FP4 省显存、提速
  - 同一块芯片覆盖「高精度训练」到「超高速推理」全场景

**为什么在乎数值精度？**

- 显存：精度减半 → 模型体积减半 → 装进更便宜的显卡
- 速度：低精度运算更快（尤其 INT8/INT4 在专用硬件上）
- 成本：70B 模型 FP16 需 2×A100 80GB，INT4 量化后单卡可跑

### 二、模型准确性——回答得对不对

用 benchmark 衡量模型"聪明程度"：

| Benchmark | 测什么 | 典型得分（70B 级） |
|-----------|--------|------------------|
| MMLU | 综合知识 | ~85% |
| HumanEval | 代码生成 | ~70% |
| GSM8K | 数学推理 | ~90% |
| MT-Bench | 对话质量 | ~8.0/10 |

### 三、数值精度 vs 模型准确性——量化后的精度保持

```
FP16 基线    → MMLU 85.0%    ← 基准线
INT8 量化    → MMLU 84.5%    ← 几乎无损（-0.5pt）
INT4 GPTQ   → MMLU 82.5%    ← 轻微退化（-2.5pt）
INT4 AWQ    → MMLU 83.3%    ← 比 GPTQ 略好
INT2 量化    → MMLU ~70%     ← 明显变傻
```

**好的量化算法能在低数值精度下尽量保住模型准确性**：

| 量化方案 | 位宽 | 精度保持率 | 特点 |
|----------|------|-----------|------|
| GPTQ | INT4 | ~97% | 基于 Hessian 近似，速度快 |
| AWQ | INT4 | ~98% | 保护重要权重通道 |
| GGUF Q4_K_M | 4-bit | ~96% | llama.cpp 生态，分块量化 |
| FP8 | 8-bit | ~99.5% | H100+ 原生支持，训练推理均可用 |

### 四、选型决策树

```
你的场景是什么？
│
├─ 训练 ─────────→ BF16 + AMP（默认首选，稳定）
│                   └─ H100+？→ FP8 训练（再快 1.5-2×）
│
├─ 推理（质量优先）→ BF16（损失极小，默认推荐）
│
├─ 推理（吞吐优先）→ INT8 量化（1.5-2× 加速，精度几乎不变）
│
└─ 推理（资源受限）→ INT4 量化（AWQ/GPTQ，2-3× 加速，可接受退化）
                      └─ 极致？→ GGUF Q4_K_M + llama.cpp
```

### 五、量化失效机制——为什么会"变傻"

不只是"精度低了"，具体有三种退化模式：

| 退化类型 | 表现 | 原因 |
|----------|------|------|
| **长尾知识丢失** | 冷门问题开始瞎编 | 低频知识存在微小权重差异里，量化后被抹平 |
| **重复生成** | 输出开始复读机 | logits 分布变平，高概率 token 区分度下降 |
| **格式退化** | JSON/代码格式出错 | 结构化生成对 logit 精度极度敏感 |

**直觉**：模型的"聪明"藏在权重的微小差异里。量化把 0.12345 和 0.12346 都压成 0.12，这些微妙差异就丢了。

### 六、层敏感度——不是所有层都一样重要

量化时不同层的精度容忍度差异巨大：

```
敏感度排行（从高到低）：

[极高] Attention 的 Q/K/V 投影层     ← slightest 扰动就影响注意力分布
[高]   第一层和最后一层               ← 入口/出口层，影响全局
[中]   FFN 中间层                    ← 相对鲁棒，可以压得更狠
[低]   Layer Norm / Embedding        ← 通常保持高精度，体积占比小
```

AWQ/GPTQ 的核心思路就是保护高敏感层——重要通道用高精度，不重要的压狠一点（混合位宽量化）。

### 七、激活值离群点（Outlier Activations）

LLM.int8() 论文发现的关键现象：激活值中 ~0.1% 的通道数值是其他通道的 100×。直接量化会把正常值全压到同一个桶里，精度崩盘。

| 解决方案 | 思路 |
|----------|------|
| **LLM.int8()** | 离群通道单独用 FP16 算，其余用 INT8 |
| **AWQ** | 保护激活值大的权重通道 |
| **SmoothQuant** | 把激活的离群值"转移"一部分到权重上 |

### 八、困惑度（Perplexity）—— 量化的"体温计"

Benchmark 跑一次太慢，**困惑度（PPL）** 是更快的量化质量代理指标：

```
FP16 基线:    PPL = 5.23
INT8 量化:    PPL = 5.25  ← 几乎不变，OK
INT4 GPTQ:   PPL = 5.40  ← 轻微上升，可接受
INT4 乱量化:  PPL = 8.50  ← 暴涨，模型废了
```

**实用建议**：量化后先跑 WikiText-2 的 PPL，比基线涨 >10% 就说明量化方案有问题。

### 九、精度对生成行为的实际影响

| 精度 | 创意写作 | 代码生成 | JSON 结构化 | 数学推理 |
|------|---------|---------|------------|---------|
| BF16 | 基准 | 基准 | 基准 | 基准 |
| INT8 | 无感知差异 | 无感知差异 | 无感知差异 | 无感知差异 |
| INT4 AWQ | 偶尔用词重复 | 基本无影响 | 偶尔格式错 | 复杂推理略退化 |
| INT4 GPTQ | 重复较多 | 简单代码OK | 格式错误增多 | 多步推理易错 |
| INT2 | 严重退化 | 不可用 | 不可用 | 不可用 |

### 十、KV Cache 精度——第二战场

KV Cache 也可以量化，且对长上下文场景影响巨大：

```
128K 上下文时: KV Cache 显存（135GB）≈ 模型参数（140GB FP16）

KV Cache 量化策略:
  FP16 → FP8:  精度损失极小，显存减半  ← 推荐默认
  FP16 → INT8: 需 per-head scaling，长上下文可能退化
  FP16 → INT4: 激进，PPL 可能涨 5-10%
```

### 十一、常见对话速查

| 别人说 | 实际意思 |
|--------|---------|
| "这个模型精度是 FP16" | 数值精度：参数用 16-bit 浮点存储 |
| "精度掉了" | 量化后模型准确性下降了 |
| "Q4 精度够用吗" | INT4 量化后回答质量还行不行 |
| "BF16 训练" | 用 BFloat16 格式做训练（范围大、不易溢出） |
| "这个模型精度很高" | 可能指数值精度（FP32），也可能指准确性好（需看语境） |

## 来源

- Frantar et al., "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers," ICLR 2023
- Lin et al., "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration," 2024
- [[09_Deployment_Inference/Quantization_Techniques_2026]] — 量化技术详解

## Related

- [[concepts/mixed-precision]] — 混合精度训练与推理（数据类型技术细节）
- [[concepts/model-compression]] — 模型压缩（量化/剪枝/蒸馏）
- [[concepts/model-evaluation]] — 模型评估（benchmark 衡量准确性）
- [[concepts/model-inference]] — 模型推理原理（精度选择影响推理性能）
- [[concepts/model-serving]] — 模型服务（推理引擎中的精度配置）
- [[concepts/kv-cache]] — KV Cache（KV Cache 量化是精度第二战场）
- [[09_Deployment_Inference/Quantization_Precision_Deep_Dive]] — 量化精度深度解析（失效机制、校准、层敏感度）
- [[09_Deployment_Inference/Quantization_Techniques_2026]] — 量化技术全景（GPTQ/AWQ/SmoothQuant 实现细节）
