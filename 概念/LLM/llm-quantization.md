---
title: LLM Quantization
category: concepts
tags: ["llm", "quantization", "model-compression", "inference", "edge-deployment"]
summary: 将大语言模型权重和/或激活值从高精度浮点数映射到低精度整数或更窄浮点格式的技术，以降低显存占用、提升推理吞吐并支持边缘部署。
created: 2026-07-02
updated: 2026-07-21
sources:
  - "https://arxiv.org/abs/2210.17323"  # GPTQ
  - "https://arxiv.org/abs/2306.00978"  # AWQ
---

# LLM Quantization

## 定义

LLM 量化（Quantization）是将大语言模型中的张量（主要是权重，有时也包括激活值、KV Cache 和梯度）从高精度数据类型（如 FP32、FP16/BF16）转换为低精度表示（如 INT8、INT4、FP8、FP4）的模型压缩与加速技术。其目标是在尽量保持模型能力的前提下，显著降低显存占用、提升推理吞吐、减少能耗，使大模型能够在消费级 GPU、边缘设备和移动端部署。

## 核心原理

量化本质上是一个**数值离散化**过程：将连续或高精度的数值映射到有限精度的离散值集合，并配套缩放（scale）、零点（zero-point）和量化分组（group/block）策略来缩小表示误差。

### 量化方式分类

| 方式 | 原理 | 代表 | 适用 |
|------|------|------|------|
| **仅权重量化** | 推理时反量化权重到 FP16 计算 | GPTQ, AWQ | 显存受限 |
| **权重-激活同时量化** | 两者都量化为 INT8 | SmoothQuant, LLM.int8() | 加速矩阵乘 |
| **低比特浮点** | FP8/FP4 硬件原生支持 | H100/B200 | 几乎无损 |
| **KV Cache 量化** | 压缩推理中的键值缓存 | KV4, FP8 KV | 长上下文 |

### PTQ vs QAT

| 维度 | PTQ（训练后量化） | QAT（量化感知训练） |
|------|------|------|
| 成本 | 低（无需重训） | 高（需重新训练） |
| 精度 | 略有损失 | 几乎无损 |
| 时间 | 分钟-小时 | 天-周 |
| 适用 | 大多数场景 | 极低比特/敏感任务 |

### 数学基础

```
线性量化：
  x_q = round(x / s) + z
  x_dequant = (x_q - z) * s

其中：
  s = (max - min) / (2^bits - 1)  ← 缩放因子
  z = round(-min / s)            ← 零点

分组量化（Group Quantization）：
  每 128 个权重共享一组 (s, z)，减少离群值影响
```

## 主流量化方法对比

| 方法 | 比特 | 类型 | 特点 | 工具 |
|------|------|------|------|------|
| **GPTQ** | 4/3/2 | PTQ | 逐层量化，Hessian 信息 | AutoGPTQ |
| **AWQ** | 4 | PTQ | 保护显著权重，更快 | AutoAWQ |
| **GGUF** | 2-8 | PTQ | llama.cpp 格式，CPU 友好 | llama.cpp |
| **SmoothQuant** | 8 | PTQ | 平滑激活离群值 | TensorRT-LLM |
| **FP8** | 8 | 硬件 | H100+ 原生支持 | vLLM, TRT-LLM |
| **BitsAndBytes** | 8/4 | PTQ | NF4 数据类型 | HuggingFace |

## 典型精度与效果

| 精度 | 每参数位数 | 显存缩减 | 速度提升 | 质量保持 |
|------|-----------|---------|---------|--------|
| FP16/BF16 | 16 bit | 基准 | 基准 | ~100% |
| FP8 | 8 bit | 2× | 1.5–2× | ~99%+ |
| INT8 | 8 bit | 2× | ~2× | 95–99% |
| INT4/GPTQ/AWQ | 4 bit | 4× | ~3× | 90–95%+ |
| INT2-3 | 2-3 bit | 5-8× | ~4× | 70–85% |

## 实战示例

### HuggingFace + BitsAndBytes

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

# 4-bit 量化配置
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True  # 双重量化
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-70B",
    quantization_config=bnb_config,
    device_map="auto"
)
# 70B 模型从 140GB → ~35GB，单卡 A100 可跑
```

### vLLM + AWQ

```bash
# 使用 AWQ 量化模型启动服务
vllm serve TheBloke/Llama-3-70B-AWQ \
  --quantization awq \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.9
```

## 典型用例

1. **单卡大模型推理**：70B 模型 4-bit 量化后在单张 48GB GPU 上运行
2. **长上下文服务**：KV Cache 量化降低长序列显存峰值
3. **边缘与端侧部署**：手机、IoT、机器人运行 1B–7B 量化模型
4. **降低云推理成本**：相同集群下更高吞吐、更低单位 token 成本

## 与相关概念的区别与联系

| 概念 | 与量化的关系 |
|------|----------------|
| **模型压缩** | 量化是其子集，剪枝、蒸馏也是 |
| **剪枝** | 移除参数/结构；量化保留结构但降精度 |
| **知识蒸馏** | 小模型学大模型；量化不改结构 |
| **KV Cache 压缩** | 专门压缩推理缓存，常与权重量化配合 |
| **推测解码** | 可与量化结合进一步加速 |

## 最佳实践

1. **优先 FP8**：如果硬件支持（H100+），FP8 几乎无损
2. **4-bit 是甜点**：INT4/AWQ 在大多数任务上质量损失 <5%
3. **避免 <3 bit**：除非极端资源受限，否则质量下降明显
4. **评估先行**：量化前后跑 benchmark 对比
5. **分组量化**：使用 group_size=128 减少离群值影响

## Related

- [[概念/LLM/edge-llm|边缘 LLM]] — 量化是端侧部署的核心使能技术
- [[概念/LLM/kv-cache|KV Cache]] — KV Cache 量化降低长上下文显存
- [[概念/Training/model-compression|模型压缩]] — 量化的上位概念
- [[大模型/LLM_Inference/LLM_Inference_Deep_Dive|LLM 推理深度解析]] — 量化在推理引擎中的部署
- [[大模型/Edge_LLM/Edge_LLM_Deep_Dive|端侧 LLM 深度解析]] — 端侧量化实践
