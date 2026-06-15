---
title: "书生·浦语 (InternLM): 上海AI Lab 的开源大模型生态"
category: "04-nlp-llms-chinese-llm-ecosystem"
tags: ["nlp", "llm", "internlm", "shanghai-ai-lab", "chinese-llm", "open-source", "lmdeploy", "internvl", "opencompass"]
summary: "> **一句话理解**: 上海AI Lab 的书生·浦语 (InternLM) 系列以开源为核心策略，配套 LMDeploy 推理引擎和 OpenCompass 评测体系，构建了完整的大模型开源工具链生态。"
created: "2026-06-12"
updated: "2026-06-12"
---

# 书生·浦语 (InternLM): 上海AI Lab 的开源大模型生态

> **一句话理解**: 上海AI Lab 的书生·浦语 (InternLM) 系列以开源为核心策略，配套 LMDeploy 推理引擎和 OpenCompass 评测体系，构建了完整的大模型开源工具链生态。

---

## 目录

1. [机构概述与定位](#1-机构概述与定位)
2. [模型演进时间线](#2-模型演进时间线)
3. [核心技术架构](#3-核心技术架构)
4. [InternLM3 技术创新](#4-internlm3-技术创新)
5. [InternVL 多模态系列](#5-internvl-多模态系列)
6. [LMDeploy 推理引擎](#6-lmdeploy-推理引擎)
7. [OpenCompass 评测体系](#7-opencompass-评测体系)
8. [模型矩阵与参数](#8-模型矩阵与参数)
9. [性能评测](#9-性能评测)
10. [开源生态](#10-开源生态)
11. [竞品对比分析](#11-竞品对比分析)
12. [总结与展望](#12-总结与展望)
13. [扩展阅读](#13-扩展阅读)

---

## 1. 机构概述与定位

### 1.1 上海 AI Lab 背景

```
上海人工智能实验室 (Shanghai AI Laboratory):
════════════════════════════════════════════════════════════════════

  成立: 2020 年
  性质: 国家级 AI 研究机构
  地点: 上海
  定位: AI 基础研究与开源生态建设

  核心成果:
  ───────────────────────────────────────────────────────────────────
  • 书生 (Intern) 系列: 通用大模型家族
  ├── InternLM:     大语言模型
  ├── InternVL:     多模态模型
  ├── InternVideo:  视频理解模型
  ├── InternImage:  图像理解模型
  └── InternGPT:    交互式多模态系统

  • 开源工具:
  ├── LMDeploy:     推理加速引擎
  ├── OpenCompass:  大模型评测体系
  ├── XTuner:       微调工具箱
  └── 书生·万卷:    高质量数据集
```

### 1.2 开源定位

```
InternLM 开源策略:
───────────────────────────────────────────────────────────────────

  核心理念: "开放、普惠、共建"

  ┌──────────────────────────────────────────────┐
  │                                               │
  │  模型开源:                                    │
  │  • 全系列模型权重开源                          │
  │  • Apache 2.0 / MIT 许可证                    │
  │  • 从 1.8B 到 20B+ 参数全面覆盖               │
  │                                               │
  │  工具开源:                                    │
  │  • LMDeploy: 高性能推理引擎                   │
  │  • OpenCompass: 评测框架                      │
  │  • XTuner: 微调工具                           │
  │                                               │
  │  数据开源:                                    │
  │  • 书生·万卷: 高质量训练数据集                │
  │  • OpenDataLab: 开放数据平台                  │
  └──────────────────────────────────────────────┘
```

---

## 2. 模型演进时间线

| 版本 | 时间 | 参数量 | 关键特性 | 开源 |
|------|------|--------|----------|------|
| InternLM | 2023.06 | 7B/20B | 首个版本 | 是 |
| InternLM-Chat | 2023.07 | 7B/20B | 对话微调 | 是 |
| InternLM2 | 2024.01 | 7B/20B | 2.0 全面升级 | 是 |
| InternLM2.5 | 2024.07 | 7B/20B | 工具使用+推理 | 是 |
| InternLM3 | 2025.01 | 8B/20B | 思维链+Agent | 是 |

---

## 3. 核心技术架构

### 3.1 InternLM3 架构

```
InternLM3 架构:
════════════════════════════════════════════════════════════════════

  ┌──────────────────────────────────────────────────┐
  │              InternLM3 架构                       │
  ├──────────────────────────────────────────────────┤
  │                                                   │
  │  基础架构:                                        │
  │  ├── Transformer Decoder                         │
  │  ├── GQA (Grouped Query Attention)               │
  │  ├── RoPE 位置编码                               │
  │  ├── SwiGLU FFN                                  │
  │  └── RMSNorm                                     │
  │                                                   │
  │  InternLM3 创新:                                 │
  │  ├── 思维链 (Chain-of-Thought) 增强              │
  │  ├── 工具使用能力 (Function Calling)              │
  │  ├── 超长上下文 (1M tokens 外推)                 │
  │  └── 数据-参数联合缩放                           │
  └──────────────────────────────────────────────────┘
```

### 3.2 关键参数

| 参数 | InternLM3-8B | InternLM3-20B |
|------|-------------|--------------|
| 参数量 | 8B | 20B |
| 层数 | 32 | 48 |
| 隐藏维度 | 4096 | 5120 |
| 注意力头数 | 32 | 40 |
| KV 头数 | 8 (GQA) | 8 (GQA) |
| 词表 | 128K | 128K |
| 上下文 | 128K | 128K |
| 训练数据 | ~5T tokens | ~5T tokens |

---

## 4. InternLM3 技术创新

### 4.1 思维链增强

```
InternLM3 思维链训练:
════════════════════════════════════════════════════════════════════

  传统 LLM:
  问题 → 直接输出答案 (容易出错)

  InternLM3:
  问题 → 内在思考过程 → 结构化输出
         └── 推理链、假设验证、自我纠正

  训练方法:
  ├── 过程监督奖励 (Process Reward)
  ├── 自我发现推理链 (Self-Discovered CoT)
  └── 多步推理验证
```

### 4.2 工具使用能力

```python
# InternLM3 工具调用示例
from internlm import InternLM

model = InternLM("internlm3-8b-chat")

response = model.chat(
    messages=[{"role": "user", "content": "北京今天天气如何？"}],
    tools=[
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "获取指定城市天气",
                "parameters": {
                    "city": {"type": "string", "description": "城市名称"}
                }
            }
        }
    ]
)
# 模型自动调用 get_weather(city="北京") 工具
```

---

## 5. InternVL 多模态系列

### 5.1 InternVL2 架构

```
InternVL2 架构:
════════════════════════════════════════════════════════════════════

  ┌──────────────┐  ┌──────────────┐
  │ 图像输入      │  │ 文本输入      │
  └──────┬───────┘  └──────┬───────┘
         ↓                  ↓
  ┌──────────────┐  ┌──────────────┐
  │ InternViT    │  │ LLM Tokenizer│
  │ (自研ViT)    │  │ (128K 词表)  │
  └──────┬───────┘  └──────┬───────┘
         ↓                  ↓
  ┌──────────────┐  ┌──────────────┐
  │ 动态分辨率   │  │ 文本嵌入      │
  │ 像素洗牌     │  │              │
  └──────┬───────┘  └──────┬───────┘
         ↓                  ↓
  ┌────────────────────────────────────┐
  │    InternLM / Qwen 语言模型        │
  └───────────────────┬────────────────┘
                      ↓
               多模态输出
```

### 5.2 InternVL2 性能

| 评测 | InternVL2-76B | GPT-4o | LLaVA-OneVision |
|------|--------------|--------|----------------|
| MMMU | 55.2% | 63.1% | 48.8% |
| MathVista | 58.6% | 58.1% | 52.3% |
| DocVQA | 91.5% | 92.8% | 88.5% |
| OCRBench | 84.5% | 85.6% | 80.2% |

---

## 6. LMDeploy 推理引擎

### 6.1 LMDeploy 特性

```
LMDeploy 核心能力:
════════════════════════════════════════════════════════════════════

  ┌──────────────────────────────────────────────────┐
  │              LMDeploy 推理引擎                    │
  ├──────────────────────────────────────────────────┤
  │                                                   │
  │  核心特性:                                        │
  │  ├── TurboMind: 高性能推理引擎                    │
  │  ├── 4-bit/8-bit 量化 (W4A16, W8A16)             │
  │  ├── KV Cache 量化                                │
  │  ├── Continuous Batching                          │
  │  └── PagedAttention                               │
  │                                                   │
  │  性能指标:                                        │
  │  ├── 推理速度: 2-4x vs HuggingFace               │
  │  ├── 显存优化: 减少 40-60%                        │
  │  └── 首字延迟: < 50ms                             │
  │                                                   │
  │  支持模型:                                        │
  │  ├── InternLM 全系列                              │
  │  ├── Qwen, Llama, Baichuan                       │
  │  ├── Mixtral, DeepSeek                           │
  │  └── 支持大多数主流开源 LLM                       │
  └──────────────────────────────────────────────────┘
```

### 6.2 LMDeploy 使用

```python
from lmdeploy import pipeline, PytorchEngineConfig

pipe = pipeline("internlm/internlm3-8b-chat",
    backend_config=PytorchEngineConfig(
        max_batch_size=32,
        session_len=8192
    )
)

response = pipe(["解释量子计算的基本原理"])
print(response[0].text)
```

---

## 7. OpenCompass 评测体系

### 7.1 OpenCompass 概览

```
OpenCompass: 大模型评测体系:
════════════════════════════════════════════════════════════════════

  覆盖能力:
  ├── 语言: 中文、英文、多语言
  ├── 知识: MMLU, C-Eval, CMMLU
  ├── 推理: GSM8K, MATH, BBH
  ├── 代码: HumanEval, MBPP
  ├── 长文本: LongBench
  ├── 多模态: MMMU, MathVista
  └── 对话: AlpacaEval, MT-Bench

  支持模型:
  ├── 100+ 主流大模型
  ├── 自动化评测流水线
  ├── 排行榜实时更新
  └── opencompass.org.cn
```

### 7.2 OpenCompass 排行榜

OpenCompass 是中国最权威的大模型评测排行榜，几乎所有国产大模型都通过它进行对标。

| 特性 | 描述 |
|------|------|
| 评测维度 | 50+ Benchmark |
| 覆盖模型 | 100+ 国内外模型 |
| 更新频率 | 每周更新 |
| 公信力 | 学术+产业广泛认可 |
| 开源 | 完全开源，可复现 |

---

## 8. 模型矩阵与参数

| 模型 | 参数量 | 模态 | 上下文 | 许可证 |
|------|--------|------|--------|--------|
| InternLM3-20B | 20B | 文本 | 128K | Apache 2.0 |
| InternLM3-8B | 8B | 文本 | 128K | Apache 2.0 |
| InternLM2.5-20B | 20B | 文本 | 128K | Apache 2.0 |
| InternLM2.5-7B | 7B | 文本 | 128K | Apache 2.0 |
| InternLM2-1.8B | 1.8B | 文本 | 32K | Apache 2.0 |
| InternVL2-76B | 76B | 文+图 | 8K | Apache 2.0 |
| InternVL2-8B | 8B | 文+图 | 8K | Apache 2.0 |
| InternVL2-2B | 2B | 文+图 | 8K | Apache 2.0 |

---

## 9. 性能评测

### 9.1 InternLM3 Benchmark

| 评测 | InternLM3-8B | Qwen2.5-7B | Llama-3.1-8B |
|------|-------------|-----------|-------------|
| MMLU | 72.5% | 74.2% | 68.4% |
| C-Eval | 81.3% | 83.5% | 52.1% |
| GSM8K | 78.2% | 82.1% | 72.5% |
| HumanEval | 62.5% | 68.4% | 62.8% |
| MATH | 35.8% | 38.2% | 28.1% |

### 9.2 128K 长上下文性能

| 上下文长度 | 检索准确率 | 质量保持 |
|-----------|-----------|---------|
| 8K | 99.5% | 基线 |
| 32K | 99.1% | -0.2% |
| 128K | 97.8% | -0.5% |
| 1M (外推) | 93.2% | -1.5% |

---

## 10. 开源生态

### 10.1 完整工具链

```
InternLM 开源工具链:
════════════════════════════════════════════════════════════════════

  模型层:
  ├── InternLM3:    大语言模型 (Apache 2.0)
  ├── InternVL2:    多模态模型 (Apache 2.0)
  ├── InternVideo:  视频理解 (Apache 2.0)
  └── InternImage:  图像理解 (Apache 2.0)

  工具层:
  ├── LMDeploy:     推理加速 (Apache 2.0)
  ├── XTuner:       微调工具 (Apache 2.0)
  ├── OpenCompass:  评测框架 (Apache 2.0)
  └── OpenDataLab:  数据平台

  数据层:
  ├── 书生·万卷:    高质量数据集
  └── OpenDataLab:  开放数据平台

  社区:
  ├── GitHub Stars: 20K+ (总计)
  ├── 开发者: 50K+
  └── 模型下载: 500K+
```

---

## 11. 竞品对比分析

### 11.1 与国产开源模型对比

| 维度 | InternLM3 | Qwen2.5 | Baichuan2 | Yi-1.5 |
|------|-----------|---------|-----------|--------|
| 文本能力 | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★★☆ |
| 开源质量 | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★★ |
| 工具链 | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ |
| 多模态 | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| 社区活跃度 | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★☆☆ |
| 评测体系 | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★☆☆☆ |

### 11.2 核心差异化

```
InternLM 的独特价值:
════════════════════════════════════════════════════════════════════

  1. 完整工具链:
     模型 + 推理(LMDeploy) + 微调(XTuner) + 评测(OpenCompass)
     其他厂商通常只开源模型，工具链不完整

  2. OpenCompass 评测体系:
     事实上成为中国大模型评测的行业标准

  3. 学术-产业桥梁:
     国家级实验室背景，学术严谨性 + 开源实用性
```

---

## 12. 总结与展望

```
InternLM = 开源生态 × 工具链完整 × 评测标准
════════════════════════════════════════════════════════════════════

  开源护城河:     全系列 Apache 2.0 开源
  工具护城河:     LMDeploy + XTuner + OpenCompass 三件套
  评测护城河:     OpenCompass 行业标准地位
  学术护城河:     上海AI Lab 国家级研究背景
```

### 未来方向

- InternLM4: 更大规模 + MoE 架构
- InternVL3: 更强多模态理解与生成
- Agent 框架: 基于 InternLM 的 Agent 开发平台
- 数据生态: 书生·万卷数据集扩展

---

## 13. 扩展阅读

- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/README]] — 中国大模型生态总览
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Qwen_Deep_Dive]] — 通义千问深度解析
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/DeepSeek_Deep_Dive]] — DeepSeek 深度解析
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/GLM_Zhipu_Deep_Dive]] — 智谱 GLM 深度解析
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/SenseTime_SenseNova_Deep_Dive]] — 商汤日日新
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Chinese_LLM_Comparison_Matrix]] — 国产模型对比矩阵
- [[04_NLP_LLMs/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] — LLM 微调技术
- [[04_NLP_LLMs/Multimodal_Models/Multimodal_Architectures_2026]] — 多模态架构
- [[90_Learn/Courses/Microsoft_GenAI_For_Beginners]] — 生成式 AI 入门课程

---



## 信息来源

### 官方来源
- 书生浦语 GitHub: https://github.com/InternLM
LMDeploy GitHub: https://github.com/InternLM/lmdeploy
OpenCompass: https://opencompass.org.cn

---
*Last updated: 2026-06-12*
