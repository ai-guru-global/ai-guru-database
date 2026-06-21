---
title: AI硬件
category: concepts
tags: ["hardware", "gpu", "AI-chips", "NVIDIA", "AMD", "Blackwell", "inference", "quantization"]
aliases: [AI Hardware, GPU, AI芯片, H100, H200, B200, 硬件选型]
relationships:
  - target: "[[_concepts/distributed-systems]]"
    type: related_to
  - target: "_concepts/data-structures-algorithms"
    type: related_to
  - target: "_concepts/linear-algebra"
    type: related_to
sources: [01_ai-fundamentals/AI_Hardware/AI_Hardware_2026.md]
summary: 2026年AI芯片全景：H200成为推理新标杆，Blackwell B200开始交付，AMD MI350紧追，内存带宽成新瓶颈，推理市场增速超训练。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# AI硬件

AI芯片是AI革命的引擎。2026年NVIDIA以约92%的数据中心AI芯片市场份额主导市场，H200成为推理新标杆，Blackwell B200开始批量交付。内存带宽已超越原始算力成为关键瓶颈，推理市场增速超过训练（2:1）。硬件选型直接决定分布式训练的并行策略和通信瓶颈。

## 核心要点

- **H200不是更快的H100，而是内存更大的H100**：141GB HBM3e，单卡可运行70B模型
- **Blackwell B200**：FP4算力4.5 PFLOPS，比H200快4.5x，192GB HBM3e
- **内存带宽**是2026年的核心瓶颈：H200的4.8TB/s比H100提升43%
- **推理引擎**竞争激烈：model-deployment以16215 tok/s领先，vLLM最流行
- **边缘AI**需求爆发：Jetson Thor瞄准人形机器人市场

## 详细内容

### 硬件决定AI上限

| 层级 | 2026年现状 |
|------|------------|
| 算力 | H200: 989 TFLOPS (FP8) |
| 内存容量 | H200: 141GB (可运行70B模型) |
| 内存带宽 | H200: 4.8 TB/s |
| 互连带宽 | NVLink: 900 GB/s |
| 能耗效率 | H200: 700W TDP, 性能/瓦特提升1.4x |

### NVIDIA H100 vs H200

| 规格 | H100 SXM | H200 SXM | 提升 |
|------|----------|----------|------|
| 架构 | Hopper | Hopper | - |
| 显存 | 80GB HBM3 | 141GB HBM3e | +76% |
| 显存带宽 | 3.35 TB/s | 4.8 TB/s | +43% |
| FP8算力 | 1,979 TFLOPS | 1,979 TFLOPS | - |
| NVLink带宽 | 900 GB/s | 900 GB/s | - |
| TDP | 700W | 700W | - |
| 价格 | ~$33,000 | ~$40,000 | +21% |

**关键洞察**：H100和H200算力相同，区别在内存。

- 70B模型推理：H100需2张卡(80GB不够140GB)，H200单卡即可(141GB)，H200实际成本更低
- 长上下文(>100K tokens)：KV Cache占用大量内存，H200可多容纳约2x上下文长度
- H100适合训练任务（需要原始算力），H200适合推理任务（需要大内存容纳模型）^[inferred]

### Blackwell B200（2026新旗舰）

架构突破：
- 第二代Transformer Engine，支持FP4/FP6
- NVLink 5（1.8 TB/s，比NVLink 4快2x）
- 192GB HBM3e（比H200多36%）
- 多GPU封装（B200 = 2个GPU芯片封装在一起）
- 专用解压缩引擎（加速RAG等检索任务）

性能指标：
- FP4: 4.5 PFLOPS（比H200快4.5x）
- FP8: 2.25 PFLOPS（比H200快2.3x）
- 推理吞吐：比H100高15x（特定工作负载）

**选型指南**：

| 场景 | 推荐 | 原因 |
|------|------|------|
| 当前生产推理 | H200 | 成熟、供应稳定、软件优化完善 |
| 下一代训练 | B200 | 算力密度更高、支持更大模型 |
| 预算有限 | H100 | 性价比最高、二手市场活跃 |

### 云厂商定价对比（2026年）

| 平台 | GPU类型 | 价格/小时 |
|------|---------|-----------|
| AWS p5e | H200 | $12-15 |
| AWS p5 | H100 | $10 |
| Azure NC H200 | H200 | $11 |
| GCP a3-ultragpu | H200 | $10+ |
| GCP spot | H100 | $3.72（需可中断） |
| Lambda | H100 | $1.99-2.49 |

### AMD MI300X/MI350

| 规格 | MI300X | MI350 | 对标NVIDIA |
|------|--------|-------|-----------|
| 显存 | 192GB HBM3 | 288GB HBM3e | > H200 |
| 显存带宽 | 5.3 TB/s | ~6 TB/s | > H200 |
| 算力(FP16) | 1.3 PFLOPS | 2.0+ PFLOPS | ~B200 |

**优势**：更大显存(192GB vs 141GB)、更便宜(约$15,000)、更好显存带宽
**劣势**：软件生态不如CUDA成熟、部分模型优化不足、供应不稳定

适用场景：超大模型推理(>100B)、预算敏感的训练任务。

### Intel Gaudi3

128GB HBM2e，1.8 PFLOPS(BF16)，600W TDP，约$15,000。

优势：集成RoCE网络、比H100便宜50%+、适合大规模集群
劣势：软件生态最弱、需大量移植工作、社区支持少

### 定制ASIC

| 芯片 | 厂商 | 定位 | 特点 |
|------|------|------|------|
| TPU v5p | Google | 训练和推理 | 仅GCP可用 |
| Trainium2 | AWS | 训练 | 成本优化 |
| Inferentia2 | AWS | 推理 | 高性价比 |
| MTIA | Meta | 内部推理 | 定制化 |

### 量化技术对比

| 精度 | 质量保持 | 显存/参数 | 速度提升 |
|------|----------|-----------|----------|
| FP16 | 100%(baseline) | 2 bytes | 基准 |
| FP8 | 99%+ | 1 byte | 1.5-2x |
| INT8 | 95-98% | 1 byte | 2x |
| INT4 | 90-95% | 0.5 bytes | 3x |
| AWQ/GPTQ(4位) | 95%+ | 0.5 bytes | 3x |

FP8在H100/H200上原生支持，几乎无损。AWQ/GPTQ适合消费级GPU部署。量化算法的对称/非对称选择影响精度。

### 推理引擎性能对比（2026年，H100, llm-architectures 3.1 8B）

| 引擎 | 吞吐量 | 特点 |
|------|--------|------|
| SGLang | 16,215 tok/s | 最快，RadixAttention |
| LMDeploy | 16,132 tok/s | 国产，性能好 |
| vLLM | 12,553 tok/s | 最流行，PagedAttention |
| TensorRT-LLM | 10,000+ tok/s | NVIDIA官方 |
| TGI | ~9,500 tok/s | 维护模式 |

### 边缘AI芯片

**Jetson系列对比**：

| 型号 | 算力 | 功耗 | 价格 | 适用 |
|------|------|------|------|------|
| Jetson Nano | 0.5 TFLOPS | 5-10W | $149 | 教育、原型 |
| Jetson Orin Nano | 1.0 TFLOPS | 5-15W | $499 | 边缘推理 |
| Jetson Orin NX | 3.5 TFLOPS | 10-25W | $999 | 机器人 |
| Jetson AGX Orin | 8.3 TFLOPS | 15-60W | $2,499 | 工业AI |
| Jetson Thor | 100 TFLOPS | 50W+ | TBD | 人形机器人 |

边缘AI芯片细分市场：
- 智能手机：Apple neural-networks Engine, Qualcomm Hexagon NPU, MediaTek APU
- 自动驾驶：NVIDIA DRIVE Thor, Qualcomm Ride, Mobileye EyeQ, Tesla FSD
- IoT：Raspberry Pi AI HAT, Google Coral, NVIDIA Jetson系列

### 硬件选型决策树

1. **大模型训练(>100B)** → H100/H200多卡集群
2. **大模型推理**：
   - 70B+ → H200（单卡141GB）
   - 7B-13B → H100或消费级GPU
   - 边缘部署 → Jetson或专用ASIC
3. **微调**：
   - 70B+ → H200
   - 7B-30B → H100/A100
   - 小模型 → 消费级GPU

预算角度：无限制→B200，高预算→H200，中等→H100，低预算→云GPU spot实例。

### TCO分析（3年）

场景：8x H100集群，全天候运行

| 成本项 | 自建 | AWS |
|--------|------|-----|
| 硬件 | $264,000 | - |
| 电力+运维+机架/年 | $57,000 | 包含 |
| 3年总计 | ~$405,000 | ~$525,000 |

自建便宜22%，但需要工程能力；云适合波动负载和快速启动。

### 未来趋势

**2026年**：H200成为推理主流，B200批量交付，AMD MI350上市

**2027年**：Rubin架构预览，3nm制程GPU量产，CPO光电共封装技术，内存突破200GB ^[inferred]

**2028年**：万亿参数模型单卡推理，边缘AI算力提升10x，存算一体芯片商用 ^[ambiguous]

## 开放问题

- NVIDIA的垄断地位是否会被AMD+开放生态打破^[ambiguous]
- FP4精度在哪些任务上会引入不可接受的精度损失^[inferred]
- CPO（光电共封装）能否真正解决跨节点通信瓶颈^[inferred]
- 定制ASIC（TPU/Trainium）在大模型训练中的竞争力尚不确定^[ambiguous]

## 来源

- 01_Fundamentals/AI_Hardware/AI_Hardware_2026.md
- NVIDIA Data Center GPUs 官方文档
- MLPerf Inference 基准测试
- Artificial time-series-analysis 第三方性能对比
## Related

- [[00_AI_Introduction/AI_Technology_Landscape.md]] — AI 技术全景
