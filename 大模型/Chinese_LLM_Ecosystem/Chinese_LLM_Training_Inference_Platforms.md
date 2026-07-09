---
title: "中国大模型训练与推理平台实战参考 (Training & Inference Platforms)"
category: "05-nlp-llms-chinese-llm-ecosystem"
tags: ["chinese-llm", "training", "inference", "distributed-training", "moe-training", "rlhf", "quantization", "vllm", "serving", "gpu-cluster", "ascend"]
summary: "面向模型训推平台工程师的实战参考：中国 15 家大模型厂商的训练基础设施、分布式训练策略、数据工程流水线、对齐训练方案、推理优化技术、服务化部署架构、硬件选型与成本分析。"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "Chinese Llm Training Inference Platforms"
  - "Chinese LLM Training Inference Platforms"
  - Chinese_LLM_Training_Inference_Platforms
sources: []

---
# 中国大模型训练与推理平台实战参考 (Training & Inference Platforms)

> **一句话理解**: 从 DeepSeek 的 2048 卡 H800 训练到讯飞星火的昇腾 NPU 全栈，从 MoE 专家并行到 RLHF 对齐流水线，从 FP8 量化到 Continuous Batching——中国大模型训推全链路技术参考。

---

## 目录

1. [训练基础设施](#1-训练基础设施)
2. [分布式训练策略](#2-分布式训练策略)
3. [MoE 模型训练专项](#3-moe-模型训练专项)
4. [数据工程流水线](#4-数据工程流水线)
5. [对齐训练方案 (SFT + RLHF + DPO)](#5-对齐训练方案)
6. [推理优化技术](#6-推理优化技术)
7. [推理服务框架对比](#7-推理服务框架对比)
8. [国产算力适配](#8-国产算力适配)
9. [各厂商训推架构速查](#9-各厂商训推架构速查)
10. [成本分析](#10-成本分析)
11. [实战部署决策树](#11-实战部署决策树)
12. [扩展阅读](#12-扩展阅读)

---

## 1. 训练基础设施

### 1.1 各厂商 GPU 集群配置

| 厂商 | GPU 型号 | 集群规模 | 互联网络 | 存储 | 训练框架 |
|------|---------|---------|---------|------|---------|
| **DeepSeek** | H800 (80GB) | 2,048 卡 | InfiniBand | 并行文件系统 | 自研 HAI-LLM |
| **Qwen** | H100/A100 | 大规模集群 | InfiniBand | 阿里云 OSS | Megatron-LLM |
| **GLM** | A100/H100 | 大规模集群 | InfiniBand | Ceph | 自研 + DeepSpeed |
| **Kimi** | H100 | 大规模集群 | InfiniBand | - | 自研框架 |
| **MiniMax** | A100/H100 | 大规模集群 | InfiniBand | - | 自研框架 |
| **百度文心** | 昆仑 + A100 | 万卡级 | 自研 | 百度云 | PaddlePaddle |
| **腾讯混元** | H100/A100 | 大规模集群 | InfiniBand | 腾讯云 COS | 自研 + Megatron |
| **讯飞星火** | **昇腾 910B** | 数千卡 | RoCE | - | **MindSpore** |
| **商汤日日新** | A100/H100 | 30,000+ | InfiniBand | SenseCore | 自研框架 |
| **字节豆包** | H100/A100 | 大规模集群 | InfiniBand | 火山引擎 | 自研框架 |
| **书生浦语** | A100 | 中等集群 | InfiniBand | - | InternEvo |

### 1.2 DeepSeek V3 训练基础设施深度解析

DeepSeek 是唯一公开详细训练成本和基础设施的厂商，作为标杆案例值得深入分析。

```
DeepSeek-V3 训练集群:
════════════════════════════════════════════════════════════════════

  硬件配置:
  ├── GPU:       2,048 × NVIDIA H800 (80GB HBM3)
  ├── 网络:      InfiniBand (400 Gbps)
  ├── CPU:       2 × Intel Xeon Platinum
  ├── 内存:      1.5 TB DDR5 per node
  └── 存储:      并行文件系统 (200GB/s 聚合带宽)

  关键优化:
  ├── DualPipe:  双向流水线并行 (计算-通信重叠)
  ├── FP8:       混合精度训练 (核心 matmul 用 FP8)
  ├── EPB:       Expert Parallelism + Load Balancing
  └── 训练吞吐:  ~14.8T tokens / ~2 个月

  训练配置:
  ├── 批量大小:   30M tokens (gradient accumulation)
  ├── 学习率:    峰值 3.7e-4 → 余弦衰减
  ├── 序列长度:  4K (预训练)
  ├── 3D 并行:   DP=256 × TP=8 × PP=16 (示例)
  └── 总成本:    $5.576M (仅 GPU 租赁)
```

#### DualPipe 流水线并行

```
DualPipe 核心思想:
════════════════════════════════════════════════════════════════════

  传统 1F1B (One Forward One Backward):
  ┌────┐ ┌────┐ ┌────┐ ┌────┐
  │ F1 │ │ F2 │ │ F3 │ │ F4 │  Forward passes
  └────┘ └────┘ └────┘ └────┘
                        ┌────┐ ┌────┐ ┌────┐ ┌────┐
                        │ B4 │ │ B3 │ │ B2 │ │ B1 │  Backward
                        └────┘ └────┘ └────┘ └────┘
  问题: 流水线气泡 (pipeline bubble) ~40%

  DualPipe (双向):
  ┌────┐ ┌────┐ ┌────┐ ┌────┐
  │ F1 │ │ F2 │ │ F3 │ │ F4 │  正向
  └────┘ └────┘ └────┘ └────┘
  ┌────┐ ┌────┐ ┌────┐ ┌────┐
  │ B4 │ │ B3 │ │ B2 │ │ B1 │  反向 (同时执行)
  └────┘ └────┘ └────┘ └────┘
  优势: 计算-通信完全重叠，气泡率降至 ~10%
```

### 1.3 训练框架选型

| 框架 | 适用场景 | MoE 支持 | 许可证 | 代表厂商 |
|------|---------|---------|--------|---------|
| Megatron-LM | Dense 大模型训练 | 部分支持 | BSD | NVIDIA, Qwen |
| DeepSpeed | 全流程训练 + ZeRO | 部分支持 | MIT | 微软, GLM |
| Megatron-Core | 模块化训练 | MoE 支持 | BSD | NVIDIA |
| FSDP (PyTorch) | 中等规模 | 有限 | BSD | Meta |
| PaddlePaddle | 昆仑 NPU 训练 | 支持 | Apache 2.0 | 百度文心 |
| MindSpore | 昇腾 NPU 训练 | 支持 | Apache 2.0 | 讯飞星火 |
| InternEvo | 开源训练 | 支持 | Apache 2.0 | 书生浦语 |
| HAI-LLM | DeepSeek 专用 | MoE 原生 | 未开源 | DeepSeek |

---

## 2. 分布式训练策略

### 2.1 四维并行策略

```
分布式训练四维并行:
════════════════════════════════════════════════════════════════════

  ┌─────────────────────────────────────────────────┐
  │              数据并行 (Data Parallelism)          │
  │  每张卡持有完整模型副本，不同数据切片              │
  │  ├── DP=256: 256 个数据副本                      │
  │  └── AllReduce 梯度同步                          │
  │                                                  │
  │  ┌───────────────────────────────────────────┐   │
  │  │       张量并行 (Tensor Parallelism)        │   │
  │  │  单层矩阵运算切分到多卡                     │   │
  │  │  ├── TP=8: 8 卡切分注意力/FFN              │   │
  │  │  └── AllReduce 通信密集                    │   │
  │  │                                           │   │
  │  │  ┌───────────────────────────────────┐    │   │
  │  │  │    流水线并行 (Pipeline Parallelism)│    │   │
  │  │  │  不同层分配到不同卡组                │    │   │
  │  │  │  ├── PP=16: 16 个流水线阶段         │    │   │
  │  │  │  └── P2P 通信                       │    │   │
  │  │  │                                    │    │   │
  │  │  │  ┌─────────────────────────────┐  │    │   │
  │  │  │  │  专家并行 (Expert Parallelism)│  │    │   │
  │  │  │  │  MoE 专家分布到不同卡          │  │    │   │
  │  │  │  │  ├── EP=64: 64 路专家         │  │    │   │
  │  │  │  │  └── All-to-All 通信          │  │    │   │
  │  │  │  └─────────────────────────────┘  │    │   │
  │  │  └───────────────────────────────────┘    │   │
  │  └───────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────┘
```

### 2.2 各厂商并行策略对比

| 厂商 | 模型 | DP | TP | PP | EP | 特殊优化 |
|------|------|----|----|----|----|---------|
| DeepSeek | V3 (671B MoE) | 256 | 8 | 16 | 64 | DualPipe + FP8 |
| Qwen | Qwen3 (235B MoE) | 大 | 8 | 中 | 中 | 分层通信优化 |
| GLM | GLM-4.5 (355B MoE) | 大 | 8 | 中 | 中 | 自研并行 |
| Kimi | K2 (1T MoE) | 大 | 8 | 中 | 大 | MuonClip 稳定训练 |
| MiniMax | Text-01 (456B MoE) | 大 | 8 | 中 | 中 | Lightning Attention 并行 |
| 百度文心 | ERNIE 4.5 (~1T) | 大 | 8 | 大 | - | PaddlePaddle 原生 |
| 腾讯混元 | Hunyuan-Large (389B) | 大 | 8 | 中 | 32 | 共享专家优化 |
| 讯飞星火 | Spark 4.5 | 大 | 8 | 中 | - | MindSpore 昇腾优化 |

### 2.3 ZeRO 优化器状态分阶

```
ZeRO (Zero Redundancy Optimizer) 分阶:
════════════════════════════════════════════════════════════════════

  标准 DP:
  每卡完整: 参数 + 梯度 + 优化器状态
  显存浪费: N 倍冗余 (N=GPU数)

  ZeRO-1: 分片优化器状态
  ├── 优化器状态均匀分配到 N 卡
  ├── 显存减少: ~4x
  └── 通信: 与标准 DP 相同

  ZeRO-2: + 分片梯度
  ├── 梯度也均匀分配
  ├── 显存减少: ~8x
  └── 通信: Reduce-Scatter

  ZeRO-3: + 分片参数
  ├── 模型参数也均匀分配
  ├── 显存减少: ~N 倍 (线性缩放)
  ├── 通信: All-Gather (前向) + Reduce-Scatter (反向)
  └── 可训练任意大小模型 (理论)

  中国厂商实际使用:
  ├── DeepSeek:  自研 DualPipe (不用 ZeRO)
  ├── Qwen:      Megatron 3D 并行 + ZeRO-1
  ├── GLM:       DeepSpeed ZeRO-3 + TP + PP
  ├── 百度:      PaddlePaddle 分片并行
  └── 讯飞:      MindSpore 自动并行
```

---

## 3. MoE 模型训练专项

### 3.1 MoE 训练的核心挑战

```
MoE 训练三大挑战:
════════════════════════════════════════════════════════════════════

  1. 负载不均衡 (Load Imbalance):
  ┌─────────────────────────────────────────────┐
  │ Router 倾向选择少数专家                       │
  │ → 热门专家过载，冷门专家闲置                  │
  │ → GPU 利用率低，训练效率差                    │
  │                                             │
  │ 解决方案:                                    │
  │ ├── 辅助损失 (Auxiliary Loss)               │
  │ ├── Expert Choice 路由                      │
  │ ├── 共享专家 (Shared Expert)                │
  │ └── 容量因子 (Capacity Factor)              │
  └─────────────────────────────────────────────┘

  2. 通信开销 (Communication Overhead):
  ┌─────────────────────────────────────────────┐
  │ 每层 MoE 需要 All-to-All 通信                │
  │ → token 发送到专家所在 GPU                   │
  │ → 专家处理后发送回原 GPU                     │
  │ → 通信量与专家数和 token 数成正比             │
  │                                             │
  │ 解决方案:                                    │
  │ ├── 通信-计算重叠 (DualPipe)                 │
  │ ├── 专家分组 (Expert Grouping)               │
  │ ├── 量化通信 (FP8 All-to-All)               │
  │ └── 拓扑感知调度                             │
  └─────────────────────────────────────────────┘

  3. 训练不稳定性 (Training Instability):
  ┌─────────────────────────────────────────────┐
  │ MoE 路由梯度传播困难                         │
  │ 专家特化不一致                               │
  │ MoE 层 loss 尖峰                             │
  │                                             │
  │ 解决方案:                                    │
  │ ├── 负载均衡损失 (z-loss)                    │
  │ ├── 专家初始化策略                           │
  │ ├── 梯度裁剪 (更激进的裁剪)                  │
  │ └── 学习率预热                               │
  └─────────────────────────────────────────────┘
```

### 3.2 各厂商 MoE 路由策略

| 厂商 | 路由类型 | 选择策略 | 负载均衡 | 共享专家 |
|------|---------|---------|---------|---------|
| DeepSeek V3 | Token Choice | Top-8 / 256 | 辅助损失 + 无辅助损失 | 1 个 |
| Qwen3 | Token Choice | Top-8 / 128 | 辅助损失 | 无 |
| GLM-4.5 | Token Choice | Top-K | 辅助损失 | 1 个 |
| Kimi K2 | Token Choice | Top-8 / 384 | 辅助损失 | 1 个 |
| 腾讯混元 | Token Choice | Top-2 + 1 | 负载均衡损失 | 1 个 |
| 阶跃 Step-2 | Token Choice | Top-2 | 负载均衡损失 | 无 |

### 3.3 MoE 训练配置参考 (DeepSeek V3)

```python
# DeepSeek-V3 MoE 训练关键超参数 (公开信息)
training_config = {
    "model": {
        "total_params": "671B",
        "active_params": "37B",
        "num_layers": 61,
        "hidden_size": 7168,
        "num_attention_heads": 128,
        "num_kv_heads": 128,  # MLA
        "num_experts": 256,
        "num_shared_experts": 1,
        "top_k_experts": 8,
        "seq_length": 4096,
    },
    "training": {
        "total_tokens": "14.8T",
        "batch_size_tokens": "30M",
        "peak_lr": 3.7e-4,
        "min_lr": 3.7e-5,
        "lr_scheduler": "cosine",
        "warmup_tokens": "2B",
        "weight_decay": 0.1,
        "grad_clip": 1.0,
        "precision": "bf16 + fp8",
    },
    "parallelism": {
        "dp": 256,
        "tp": 8,
        "pp": 16,
        "ep": 64,
    },
    "hardware": {
        "gpu": "H800 80GB",
        "num_gpus": 2048,
        "network": "InfiniBand 400Gbps",
    }
}
```

---

## 4. 数据工程流水线

### 4.1 预训练数据处理流程

```
预训练数据流水线:
════════════════════════════════════════════════════════════════════

  Step 1: 数据采集
  ┌──────────────────────────────────────────┐
  │ • 网页爬取 (CommonCrawl + 自爬)           │
  │ • 书籍/论文/代码 (GitHub/arXiv)          │
  │ • 百科/知识库                             │
  │ • 各厂商特色数据:                         │
  │   - 百度: 搜索日志 + 百科 + 知道          │
  │   - 字节: 抖音/头条内容                   │
  │   - 腾讯: 微信公众号/视频号               │
  └──────────────────────────────────────────┘
       ↓
  Step 2: 去重
  ┌──────────────────────────────────────────┐
  │ • URL 去重 (精确匹配)                     │
  │ • 文档级 MinHash 去重 (Jaccard < 0.8)    │
  │ • 段落级精确去重                           │
  │ • 结果: 数据量减少 30-50%                 │
  └──────────────────────────────────────────┘
       ↓
  Step 3: 质量过滤
  ┌──────────────────────────────────────────┐
  │ • 语言检测 (保留中/英文)                   │
  │ • 困惑度过滤 (GPT-2 评分)                │
  │ • 分类器打分 (高质量 vs 低质量)            │
  │ • 长度过滤 (> 50 tokens)                  │
  │ • 格式过滤 (去除乱码/模板)                │
  └──────────────────────────────────────────┘
       ↓
  Step 4: 安全过滤
  ┌──────────────────────────────────────────┐
  │ • 有害内容检测 (暴力/色情/歧视)            │
  │ • PII 脱敏 (姓名/电话/身份证)              │
  │ • 版权内容过滤                             │
  │ • 中国法规合规过滤                         │
  └──────────────────────────────────────────┘
       ↓
  Step 5: 数据混合
  ┌──────────────────────────────────────────┐
  │ 按比例混合不同来源:                        │
  │ • 网页: 60-70%                             │
  │ • 代码: 10-15%                             │
  │ • 书籍: 5-10%                              │
  │ • 学术: 3-5%                               │
  │ • 垂直领域: 5-10%                          │
  └──────────────────────────────────────────┘
       ↓
  Step 6: Tokenization
  ┌──────────────────────────────────────────┐
  │ • BPE / SentencePiece                     │
  │ • 词表: 64K - 152K                        │
  │ • 中文: UTF-8 字节级 / 字级混合           │
  └──────────────────────────────────────────┘
```

### 4.2 各厂商训练数据对比

| 厂商 | 训练数据量 | 中文占比 | 特色数据 | 词表大小 |
|------|-----------|---------|---------|---------|
| DeepSeek V3 | 14.8T tokens | ~30% | 数学/代码增强 | 129K |
| Qwen2.5 | ~18T tokens | ~35% | 全品类高质量 | 152K |
| GLM-4.5 | 22T tokens | ~40% | 学术/代码 | 150K |
| 百度 ERNIE | 万亿级 | ~60% | 搜索+百科 | 100K+ |
| Yi-34B | 3T tokens | ~30% | 英文为主 | 64K |
| Baichuan-2 | 3.5T tokens | ~40% | 搜索增强 | 125K |

### 4.3 SFT 数据构造

```
SFT 数据构造方法论:
════════════════════════════════════════════════════════════════════

  来源:
  ├── 人工编写 (质量最高，成本最高)
  │   ├── 专业标注团队编写指令-回答对
  │   ├── 千万级投资
  │   └── 常见规模: 10K-100K 条
  │
  ├── 模型自生成 (Self-Instruct)
  │   ├── 用强模型 (GPT-4) 生成指令-回答对
  │   ├── 质量过滤 + 人工校验
  │   └── 常见规模: 100K-1M 条
  │
  ├── 开源数据集
  │   ├── Alpaca / ShareGPT / UltraChat
  │   ├── 中国: COIG / BELLE / MOSS
  │   └── 常见规模: 1M+ 条
  │
  └── 垂直领域数据
      ├── 医疗: 病历-诊断对
      ├── 法律: 案例-分析对
      ├── 代码: 问题描述-代码对
      └── 按需定制

  各厂商 SFT 规模:
  ├── 第一梯队: 1M-10M 条 (含合成数据)
  ├── 第二梯队: 100K-1M 条
  └── 质量比数量更重要
```

---

## 5. 对齐训练方案

### 5.1 RLHF vs DPO vs PPO 对比

```
对齐训练方案对比:
════════════════════════════════════════════════════════════════════

  SFT (Supervised Fine-Tuning):
  ┌──────────────────────────────────────────┐
  │ 基座模型 → SFT → 指令遵循模型              │
  │ 数据: 指令-回答对                          │
  │ 方法: 标准交叉熵                           │
  │ 所有厂商都使用                             │
  └──────────────────────────────────────────┘

  RLHF (Reinforcement Learning from Human Feedback):
  ┌──────────────────────────────────────────┐
  │ SFT 模型 → Reward Model → PPO 训练        │
  │ 步骤:                                     │
  │ 1. 人类标注偏好数据 (A > B)                │
  │ 2. 训练 Reward Model                      │
  │ 3. PPO 优化策略模型                        │
  │ 使用: DeepSeek, Qwen, GLM, 百度           │
  └──────────────────────────────────────────┘

  DPO (Direct Preference Optimization):
  ┌──────────────────────────────────────────┐
  │ SFT 模型 → DPO → 直接对齐                 │
  │ 优势: 不需要 Reward Model                  │
  │ 方法: 直接从偏好对优化策略                  │
  │ 使用: Yi, MiniMax, 百川                    │
  └──────────────────────────────────────────┘

  GRPO (Group Relative Policy Optimization):
  ┌──────────────────────────────────────────┐
  │ DeepSeek-R1 首创                          │
  │ 优势: 不需要 Critic 模型                   │
  │ 方法: 同一问题多次采样，组内相对排序        │
  │ 使用: DeepSeek-R1                         │
  └──────────────────────────────────────────┘
```

### 5.2 各厂商对齐方案

| 厂商 | SFT | RLHF | DPO | 其他 | 特色 |
|------|-----|------|-----|------|------|
| DeepSeek | 是 | PPO | 是 | GRPO | R1 推理链对齐 |
| Qwen | 是 | PPO | 是 | - | Hybrid Thinking 对齐 |
| GLM | 是 | PPO | 是 | - | AutoGLM Agent 对齐 |
| 百度文心 | 是 | RLHF | - | - | 搜索增强对齐 |
| Kimi | 是 | - | 是 | Long2Short | 长回答→短回答蒸馏 |
| MiniMax | 是 | - | 是 | - | 多模态联合对齐 |
| 讯飞星火 | 是 | RLHF | - | - | 教育/语音领域对齐 |
| 字节豆包 | 是 | RLHF | 是 | - | 推荐系统经验融入 |

### 5.3 RLHF 训练配置参考

```python
# 典型 RLHF 训练配置
rlhf_config = {
    "reward_model": {
        "base_model": "SFT checkpoint",
        "data": "100K-1M 偏好对",
        "training": "2-4 epochs, lr=5e-6",
    },
    "ppo": {
        "actor_lr": 5e-7,
        "critic_lr": 5e-6,
        "ppo_epochs": 4,
        "clip_range": 0.2,
        "kl_coeff": 0.05,  # KL 散度惩罚
        "batch_size": 512,
        "mini_batch_size": 64,
        "generation_max_length": 1024,
    },
    "resource": {
        "gpu_hours": "~500-2000 A100-hours",
        "典型GPU": "8-32 × A100 80GB",
    }
}
```

---

## 6. 推理优化技术

### 6.1 推理优化全景

```
推理优化技术栈:
════════════════════════════════════════════════════════════════════

  模型层优化:
  ├── 量化: FP16 → INT8 → INT4 → FP8
  │   ├── GPTQ (离线量化, 4-bit)
  │   ├── AWQ (激活感知量化)
  │   ├── GGUF (llama.cpp 格式)
  │   └── FP8 (训练+推理原生)
  │
  ├── 蒸馏: 大模型 → 小模型
  │   ├── 白盒蒸馏 (logits 匹配)
  │   ├── 黑盒蒸馏 (数据增强)
  │   └── 过程蒸馏 (推理链转移)
  │
  └── 剪枝: 低重要性权重移除
      ├── 结构化剪枝 (整层/整头)
      └── 非结构化剪枝 (稀疏化)

  系统层优化:
  ├── KV Cache 优化:
  │   ├── PagedAttention (vLLM)
  │   ├── KV Cache 量化
  │   ├── 滑动窗口 + 重计算
  │   └── MQA/GQA (减少 KV 头数)
  │
  ├── 调度优化:
  │   ├── Continuous Batching
  │   ├── Iteration-level Scheduling
  │   └── 优先级调度
  │
  ├── 解码优化:
  │   ├── Speculative Decoding
  │   ├── Medusa (多头并行)
  │   └── 投机采样
  │
  └── 服务优化:
      ├── 动态批处理
      ├── 请求级量化
      └── 前缀缓存 (Prompt Caching)
```

### 6.2 量化方案对比

| 方案 | 精度 | 显存节省 | 质量损失 | 速度提升 | 适用场景 |
|------|------|---------|---------|---------|---------|
| FP16 | 基线 | - | - | - | 默认 |
| BF16 | 基线 | - | - | - | 训练+推理 |
| FP8 | 8-bit | ~50% | <0.5% | 2x | DeepSeek 原生 |
| INT8 (W8A16) | 8-bit权重 | ~50% | <1% | 1.5x | 通用推理 |
| GPTQ-4bit | 4-bit | ~75% | 1-2% | 1.3x | 离线量化 |
| AWQ-4bit | 4-bit | ~75% | 0.5-1% | 1.3x | 激活感知 |
| GGUF-Q4 | 4-bit | ~75% | 1-3% | 1.2x | CPU/端侧 |
| INT4 (双量化) | 4-bit | ~80% | 2-3% | 1.1x | 极致压缩 |

### 6.3 各厂商推理优化策略

| 厂商 | 量化方案 | KV Cache 优化 | 解码优化 | 特色 |
|------|---------|-------------|---------|------|
| DeepSeek | FP8 原生 | MLA 压缩 95% | DualInfer | FP8 训推一体 |
| Qwen | GPTQ/AWQ | GQA + PagedAttn | Speculative | 全系列量化 |
| GLM | INT8/INT4 | GQA + 量化 | - | CodeGeeX 加速 |
| 百度文心 | INT8 | - | 搜索增强缓存 | ERNIE Turbo |
| 腾讯混元 | INT8 | PagedAttn | - | MoE 稀疏推理 |
| MiniMax | INT8 | Lightning Attn | - | 线性注意力 |
| 讯飞星火 | INT8 | 昇腾 NPU 优化 | 语音流式 | 昇腾原生 |
| 书生浦语 | W4A16/W8A16 | KV 量化 | Continuous Batch | LMDeploy |

### 6.4 MoE 推理优化

```
MoE 推理特殊挑战与优化:
════════════════════════════════════════════════════════════════════

  挑战: 每个token只激活少量专家，但需要所有专家都在显存中
  → 总参数量 × 2 bytes (FP16) 可能超出单卡显存

  优化策略:

  1. 专家并行 (Expert Parallelism):
     ├── 每张卡只放部分专家
     ├── All-to-All 通信路由 token
     └── DeepSeek: EP=64 张卡

  2. 专家卸载 (Expert Offloading):
     ├── 热门专家放 GPU，冷门放 CPU/SSD
     ├── 按需加载
     └── 适合单卡/少卡部署

  3. 专家量化 (Expert Quantization):
     ├── 非活跃专家量化到 INT4
     ├── 活跃专家保持 FP16
     └── 动态精度切换

  4. 专家合并 (Expert Merging):
     ├── 相似专家合并
     ├── 减少总专家数
     └── 轻微质量损失
```

---

## 7. 推理服务框架对比

### 7.1 主流推理框架

| 框架 | 核心技术 | 吞吐量 | 延迟 | MoE 支持 | 许可证 |
|------|---------|--------|------|---------|--------|
| 推理框架 | 核心技术 | 吞吐量 | 延迟 | MoE 支持 | 许可证 |
|----------|---------|--------|------|---------|--------|
| vLLM | PagedAttention + Continuous Batching | 极高 | 低 | 支持 | Apache 2.0 |
| SGLang | RadixAttention + 编译优化 | 极高 | 极低 | 支持 | Apache 2.0 |
| TGI | Flash Attention + 量化 | 高 | 低 | 部分支持 | Apache 2.0 |
| TensorRT-LLM | NVIDIA 编译优化 | 最高 | 最低 | 支持 | NVIDIA |
| LMDeploy | TurboMind + 量化 | 高 | 低 | 支持 | Apache 2.0 |
| llama.cpp | GGUF + CPU 优化 | 中 | 中 | 部分支持 | MIT |

> 各框架详细对比参见 [[部署推理/Inference_Engines/vLLM_Deep_Dive|vLLM]]、[[部署推理/Inference_Engines/SGLang_Deep_Dive|SGLang]]、[[部署推理/Inference_Engines/TGI_Deep_Dive|TGI]]、[[部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive|TensorRT-LLM]]、[[部署推理/Inference_Engines/LMDeploy_Deep_Dive|LMDeploy]]、[[部署推理/Inference_Engines/llama_cpp_Deep_Dive|llama.cpp]]

### 7.2 各厂商推荐推理方案

| 厂商 | 官方推荐 | 第三方可选 | 端侧方案 |
|------|---------|-----------|---------|
| DeepSeek | 自研服务 | vLLM, SGLang | llama.cpp (GGUF) |
| Qwen | vLLM 官方支持 | TGI, SGLang | Qwen2.5-0.5B + Ollama |
| GLM | 自研 | vLLM, TGI | ChatGLM.cpp |
| 百度文心 | 千帆平台 | - | ERNIE Tiny |
| 腾讯混元 | 腾讯云 TI | vLLM (Hunyuan-Large) | Hunyuan Lite |
| 书生浦语 | LMDeploy | vLLM | InternLM2-1.8B + llama.cpp |
| 字节豆包 | 火山引擎方舟 | - | Doubao Lite |
| 讯飞星火 | 讯飞开放平台 | - | Spark Mini + 昇腾 |

### 7.3 vLLM 部署示例 (Qwen2.5-72B)

```python
# vLLM 部署 Qwen2.5-72B-Instruct
from vllm import LLM, SamplingParams

llm = LLM(
    model="Qwen/Qwen2.5-72B-Instruct",
    tensor_parallel_size=4,       # 4 卡张量并行
    max_model_len=32768,          # 32K 上下文
    gpu_memory_utilization=0.90,  # 90% 显存利用率
    quantization="awq",           # AWQ 4-bit 量化
    enforce_eager=True,           # 禁用 CUDA Graph (调试用)
)

params = SamplingParams(
    temperature=0.7,
    top_p=0.9,
    max_tokens=2048,
)

outputs = llm.generate(["解释 MoE 架构的优势"], params)
```

### 7.4 SGLang 部署示例 (DeepSeek-V3)

```python
# SGLang 部署 DeepSeek-V3 (MoE)
# 启动命令:
# python -m sglang.launch_server \
#   --model-path deepseek-ai/DeepSeek-V3 \
#   --tp 8 --dp 16 --ep 64 \
#   --mem-fraction-static 0.88 \
#   --quantization fp8

import sglang as sgl

@sgl.function
def multi_turn(s, question):
    s += sgl.user(question)
    s += sgl.assistant(sgl.gen("answer", max_tokens=1024))

state = multi_turn.run(question="MoE 模型如何做负载均衡？")
print(state["answer"])
```

---

## 8. 国产算力适配

> 各芯片完整技术规格、软件栈对比和选型指南参见 [[数学基础/AI_Hardware/Chinese_AI_Chips_Deep_Dive]]

### 8.1 华为昇腾 NPU 生态

```
华为昇腾 AI 全栈:
════════════════════════════════════════════════════════════════════

  应用层:   讯飞星火 / 华为盘古 / 各行业模型
     ↓
  框架层:   MindSpore / PyTorch (昇腾适配)
     ↓
  算子层:   CANN (Compute Architecture for Neural Networks)
     ↓
  芯片层:   昇腾 910B (FP16: 320 TFLOPS, INT8: 640 TOPS)
     ↓
  硬件层:   Atlas 800 训练服务器 / Atlas 300I 推理卡
```

### 8.2 NVIDIA vs 昇腾 vs 昆仑 对比

| 指标 | H100 (NVIDIA) | A100 (NVIDIA) | 昇腾 910B | 昆仑 3 |
|------|--------------|--------------|-----------|--------|
| FP16 算力 | 990 TFLOPS | 312 TFLOPS | ~320 TFLOPS | ~200 TFLOPS |
| INT8 算力 | 1979 TOPS | 624 TOPS | ~640 TOPS | ~400 TOPS |
| 显存 | 80 GB HBM3 | 80 GB HBM2e | 64 GB | 32 GB |
| 显存带宽 | 3.35 TB/s | 2.0 TB/s | ~1.6 TB/s | ~1.0 TB/s |
| 互联 | NVLink 900GB/s | NVLink 600GB/s | HCCS ~400GB/s | 自研互联 |
| 生态 | CUDA (最完善) | CUDA | CANN (发展中) | PaddlePaddle |
| 软件成熟度 | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★☆☆ |
| 供货 | 受限 (中国) | 受限 (中国) | 不受限 | 不受限 |
| 使用厂商 | 大部分 | 大部分 | 讯飞星火 | 百度文心 |

### 8.3 国产算力训练指南

```
昇腾 NPU 训练大模型指南:
════════════════════════════════════════════════════════════════════

  Step 1: 环境准备
  ├── 安装 CANN 8.0+
  ├── 安装 MindSpore 2.5+
  ├── 配置 HCCL (华为集合通信)
  └── 设置环境变量

  Step 2: 模型迁移
  ├── PyTorch → MindSpore 自动转换
  ├── 自定义算子适配
  ├── 精度对齐验证
  └── 性能基准测试

  Step 3: 分布式训练
  ├── 数据并行 (MindSpore auto_parallel)
  ├── 模型并行 (算子级并行)
  ├── 流水线并行
  └── MoE 专家并行 (支持)

  Step 4: 调优
  ├── 算子融合 (CANN 图优化)
  ├── 通信优化 (梯度压缩)
  ├── 内存优化 (重计算 + 梯度累加)
  └── 混合精度 (FP16 + FP32)

  已验证案例:
  ├── 讯飞星火: 千亿参数全栈昇腾训练
  ├── 华为盘古: 多模态大模型
  └── 部分开源模型: Llama/Qwen 昇腾适配
```

---

## 9. 各厂商训推架构速查

### 9.1 训练架构速查

| 厂商 | 训练框架 | 并行策略 | 精度 | 特色技术 |
|------|---------|---------|------|---------|
| DeepSeek | HAI-LLM (自研) | DP×TP×PP×EP + DualPipe | FP8 | 最低成本训练 |
| Qwen | Megatron + 自研 | DP×TP×PP | BF16 | 大规模数据工程 |
| GLM | DeepSpeed + 自研 | DP×TP×PP + ZeRO-3 | BF16 | AutoGLM Agent |
| 百度文心 | PaddlePaddle | DP×TP×PP | BF16 | 知识增强预训练 |
| 腾讯混元 | Megatron + 自研 | DP×TP×PP×EP | BF16 | 共享专家优化 |
| 讯飞星火 | MindSpore | 自动并行 | FP16 | 昇腾全栈 |
| 书生浦语 | InternEvo | DP×TP×PP | BF16 | 开源训练框架 |

### 9.2 推理架构速查

| 厂商 | 推理引擎 | 服务框架 | 量化 | MoE 推理 | 特色 |
|------|---------|---------|------|---------|------|
| DeepSeek | 自研 | 自研 | FP8 | EP+Expert Offload | MLA KV 压缩 |
| Qwen | vLLM | 自研 | AWQ/GPTQ | vLLM MoE | 全系列部署方案 |
| GLM | 自研 | 自研 | INT8 | - | CodeGeeX IDE 插件 |
| 百度文心 | 自研 | 千帆 | INT8 | - | 搜索增强推理 |
| 腾讯混元 | 自研 | TI 平台 | INT8 | MoE 稀疏 | HunyuanVideo DiT |
| MiniMax | 自研 | 自研 | INT8 | MoE | 线性注意力 O(n) |
| 讯飞星火 | 自研 | 开放平台 | INT8 | - | 昇腾推理 + 语音 |
| 书生浦语 | LMDeploy | LMDeploy | W4A16 | 支持 | 开源全链路 |
| 字节豆包 | 自研 | 方舟 | INT8 | - | 极致性价比 |

---

## 10. 成本分析

### 10.1 训练成本参考

| 模型规模 | GPU 时长 (估算) | 成本 (H100 按需) | 成本 (H100 预留) |
|---------|----------------|-----------------|-----------------|
| 7B Dense | ~500 A100-hours | ~$1,500 | ~$500 |
| 34B Dense | ~5,000 A100-hours | ~$15,000 | ~$5,000 |
| 70B Dense | ~20,000 A100-hours | ~$60,000 | ~$20,000 |
| 100B Dense | ~100,000 A100-hours | ~$300,000 | ~$100,000 |
| 300B MoE | ~500,000 A100-hours | ~$1.5M | ~$500K |
| 671B MoE (DeepSeek-V3) | 2,048 H800 × ~2月 | **$5.6M** | ~$2M |

### 10.2 推理成本对比 (API)

```
推理 100 万 token 的成本 (人民币):
════════════════════════════════════════════════════════════════════

  DeepSeek V3 API:        ¥2 (输入) + ¥8 (输出) = ~¥10
  豆包 Doubao-Lite:        ¥0.8 + ¥1 = ~¥1.8
  Qwen-Max:                ¥40 + ¥80 = ~¥120
  ERNIE 4.5 Ultra:         ¥120 + ¥120 = ~¥240
  讯飞 Spark Ultra:        ¥50 + ¥50 = ~¥100
  Kimi moonshot-v1:        ¥12 + ¥12 = ~¥24

  自部署 (Qwen2.5-72B AWQ, 4×A100):
  ├── 硬件折旧: ~¥50/天
  ├── 电费: ~¥30/天
  ├── 吞吐: ~10M tokens/天
  └── 成本: ~¥8/百万 tokens
```

---

## 11. 实战部署决策树

```
你的训推需求:
════════════════════════════════════════════════════════════════════

  === 训练 ===

  预训练 (>100B):
  ├── 有 NVIDIA H100 集群 → Megatron-LM + 3D 并行
  ├── 只有 A100 → DeepSpeed ZeRO-3 + TP + PP
  ├── 只有昇腾 → MindSpore + 自动并行 (参考讯飞)
  └── 只有昆仑 → PaddlePaddle (参考百度)

  微调 (<100B):
  ├── 全参微调 → DeepSpeed ZeRO-3
  ├── LoRA/QLoRA → 单卡即可 (PEFT)
  ├── 垂直领域 → SFT + 领域数据
  └── 对齐 → DPO (简单) 或 RLHF (高质量)

  MoE 训练:
  ├── Megatron-Core MoE → 官方支持
  ├── DeepSpeed MoE → ZeRO + EP
  └── 参考开源: DeepSeek-V3 MoE 训练细节

  === 推理 ===

  API 服务 (追求质量):
  ├── 最佳质量 → DeepSeek-V3 API
  ├── 中文场景 → Qwen-Max / ERNIE 4.5
  └── 极致性价比 → DeepSeek / 豆包 Lite

  自部署 (追求可控):
  ├── 单卡 (<7B) → llama.cpp / Ollama
  ├── 多卡 (7B-70B) → vLLM (tensor parallel)
  ├── 大模型 (>70B) → vLLM + pipeline parallel
  ├── MoE 模型 → vLLM/SGLang + expert parallel
  └── 端侧部署 → Qwen2.5-0.5B + llama.cpp

  量化选择:
  ├── 几乎无损 → AWQ-4bit / GPTQ-4bit
  ├── 可接受损失 → INT4 双量化
  ├── 极致压缩 → GGUF-Q2 (端侧)
  └── 训推一体 → FP8 (DeepSeek 原生)
```

---

## 12. 扩展阅读

### 训练相关

- [[大模型/LLM_Architectures/MoE_Routing_and_Load_Balancing]] — MoE 路由与负载均衡
- [[大模型/LLM_Architectures/MoE_Case_Studies_DeepSeek_Mixtral]] — MoE 案例研究
- [[大模型/Reasoning_Models/DeepSeek_R1_Technical_Analysis]] — DeepSeek R1 GRPO 训练
- [[大模型/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] — LLM 微调技术
- [[论文精读/Efficiency/LoRA_Deep_Dive]] — LoRA 低秩适配
- [[论文精读/Architecture/Mixture_of_Experts_Deep_Dive]] — MoE 论文解读

### 推理相关

- [[部署推理/Inference_Engines/vLLM_Deep_Dive]] — vLLM 深度解析
- [[部署推理/Inference_Engines/SGLang_Deep_Dive]] — SGLang 深度解析
- [[部署推理/Inference_Engines/TGI_Deep_Dive]] — HuggingFace TGI
- [[部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive]] — TensorRT-LLM
- [[部署推理/Inference_Engines/LMDeploy_Deep_Dive]] — LMDeploy (InternLM)
- [[部署推理/Quantization/Quantization_Techniques_2026]] — 量化技术
- [[部署推理/Caching/Prompt_Caching_and_KV_Cache_Optimization]] — KV Cache 优化
- [[部署推理/Caching/Speculative_Decoding_Advanced_2026]] — 投机解码
- [[部署推理/Inference_Engines/llama_cpp_Deep_Dive]] — llama.cpp (端侧)
- [[部署推理/Inference_Engines/Ollama_Deep_Dive]] — Ollama (一键部署)

### 厂商深度解析

- [[大模型/Chinese_LLM_Ecosystem/DeepSeek_Deep_Dive]] — DeepSeek (MLA + MoE + FP8)
- [[大模型/Chinese_LLM_Ecosystem/Qwen_Deep_Dive]] — Qwen (Hybrid Thinking)
- [[大模型/Chinese_LLM_Ecosystem/README]] — 中国大模型生态总览
- [[大模型/Chinese_LLM_Ecosystem/Chinese_LLM_Comparison_Matrix]] — 全厂商对比矩阵

---

*Last updated: 2026-06-12*
