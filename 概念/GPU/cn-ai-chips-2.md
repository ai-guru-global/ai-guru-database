---
title: "国产 AI 芯片矩阵 2.0 (摩尔线程 / 壁仞 / 沐曦 / 燧原 / 国产 GPU 全栈)"
category: concepts
tags:
  - gpu
  - chinese-gpu
  - moore-threads
  - biren
  - metax
  - enflame
  - domestic-chips
aliases:
  - CN AI Chips 2.0
  - Moore Threads MTT
  - Biren BR
  - Metax
  - Enflame
  - Chinese GPU
  - 国产 AI 芯片
relationships:
  - target: "概念/ascend-npu"
    type: extends
  - target: "概念/cambricon"
    type: related_to
  - target: "概念/hygon"
    type: related_to
  - target: "概念/cann"
    type: related_to
summary: "国产 AI 芯片矩阵 2.0 是 2024-2026 信创/政企落地的核心——摩尔线程 MTT S5000、壁仞 BR104、沐曦 MetaX C500、燧原 邃思 3.0、华为昇腾 910C、海光 DCU、紫光 GPU,在推理/训练场景初步具备国产替代能力。与 NVIDIA A100/H100 仍有 30-50% 性能差距,但软件生态快速完善。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "国产 AI 芯片矩阵 2.0"
---

# 国产 AI 芯片矩阵 2.0

> 中文简称：国产 AI 芯片矩阵 2.0

> **一句话理解**:国产 AI 芯片 2.0 时代从"单点突破"到"全栈对标"——摩尔线程 / 壁仞 / 沐曦 / 燧原各有特色,昇腾 + CANN 是事实标准,海光、紫光、寒武纪各有定位。是信创、央国企、政企 AI 落地的"硬件底座"。

---

## 一、国产 AI 芯片全景

| 芯片厂商 | 旗舰产品 | 制程 | 显存 | 算力(FP16) | 互联 | 生态 |
|---|---|---|---|---|---|---|
| **华为昇腾** | 910C/910B | 7nm | 128GB HBM2e | 780 TFLOPS | HCCS 1.2TB/s | CANN + MindSpore |
| **海光 DCU** | K100/Z100 | 7nm | 64GB HBM2e | 120 TFLOPS | xGMI | ROCm(兼容) |
| **寒武纪** | 思元 590/690 | 7nm | 80GB HBM2e | 256 TFLOPS | MLU-Link | Neuware |
| **摩尔线程** | MTT S5000/S4000 | 7nm | 48GB GDDR6 | 250 TFLOPS | MT-Link 800GB/s | MUSA |
| **壁仞** | BR104/BR204 | 7nm | 32GB HBM2e | 300 TFLOPS | B-Link 1.2TB/s | 壁仞 SDK |
| **沐曦** | MetaX C500 | 7nm | 64GB HBM2e | 320 TFLOPS | MX-Link | MXMACA(类CUDA) |
| **燧原** | 邃思 3.0/2.5 | 12nm | 32GB HBM2e | 200 TFLOPS | TGC | TopsRider |
| **紫光** | 紫光 2 号 | 14nm | 32GB | 80 TFLOPS | PCIe | UNIPY |
| **天数** | 天垓 100 | 7nm | 80GB HBM2e | 295 TFLOPS | — | — |
| **登临** | Goldwasser | 14nm | 64GB | 100 TFLOPS | — | — |

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 国产 AI 芯片 | Domestic AI Chip | 信创核心硬件 |
| 替代 | Substitution | 国产替代 NVIDIA |
| 信创 | Xinchuang | 信息技术应用创新 |
| 自主可控 | Self-Controllable | 不依赖海外 |
| 性能对标 | Performance Parity | 与 NVIDIA 持平 |
| 软件生态 | Software Ecosystem | CUDA / CANN / ROCm |
| 算力 | Compute Power | FLOPS / TOPS |
| 显存带宽 | Memory Bandwidth | HBM / GDDR |
| 卡间互联 | Inter-Chip Interconnect | HCCS / NVLink |
| 驱动 | Driver | Linux / Kernel |
| 编译器 | Compiler | 算子编译 |
| 算子库 | Operator Library | CANN / MUSA |
| 框架适配 | Framework Adaptation | PyTorch / TF |
| 推理引擎 | Inference Engine | vLLM / TRT 适配 |
| 训练框架 | Training Framework | Megatron / DeepSpeed |
| 量化 | Quantization | INT8 / FP8 |
| 集群 | Cluster | 多卡集群 |
| 散热 | Cooling | 液冷 / 风冷 |
| 功耗 | Power Consumption | 700W+ |
| 政企 | Government & Enterprise | 央国企采购 |

---

## 三、各厂商技术详解

### 3.1 华为昇腾(Huawei Ascend)— 事实标准

#### 旗舰:昇腾 910C

- **制程**:7nm
- **显存**:128GB HBM2e
- **FP16 算力**:780 TFLOPS
- **互联**:HCCS 1.2TB/s(类 NVLink)
- **生态**:CANN 7.0 + MindSpore

#### 软件栈

- **CANN**(Compute Architecture for Neural Networks)
  - 算子库
  - 图编译
  - 算子融合
  - vLLM / SGLang / TRT-LLM 适配
- **MindSpore**:华为自研 AI 框架
- **DeepSpeed / Megatron**:已适配

#### 优势

- 政企信创首选(> 70% 央国企)
- 昇腾 + 鲲鹏 + 欧拉 + 华为云 全栈
- 性能/功耗比优秀

#### 不足

- 生态较 NVIDIA 弱
- 部分算子性能差距
- 软件优化需自研

### 3.2 海光 DCU(Hygon)— 兼容路线

#### 旗舰:海光 K100

- **制程**:7nm
- **算力**:120 TFLOPS FP16
- **生态**:兼容 ROCm(CUDA 平替)

#### 优势

- 与 ROCm 兼容 → 生态最易迁移
- 接近 x86 生态
- 适合传统 HPC / AI 混合

### 3.3 寒武纪(Cambricon)— 训推一体

#### 旗舰:思元 690

- **算力**:256 TFLOPS FP16
- **互联**:MLU-Link
- **生态**:Neuware(自研)

### 3.4 摩尔线程(Moore Threads)— 全功能 GPU

#### 旗舰:MTT S5000

- **算力**:250 TFLOPS FP16
- **特性**:支持图形 + 视频 + AI
- **生态**:MUSA(类 CUDA)
- **优势**:多功能,一卡多用

### 3.5 壁仞(Biren)

#### 旗舰:BR104

- **算力**:300 TFLOPS FP16
- **互联**:B-Link 1.2TB/s
- **应用**:大模型训练主力

### 3.6 沐曦(MetaX)

#### 旗舰:C500

- **算力**:320 TFLOPS FP16
- **生态**:MXMACA(类 CUDA,API 兼容)
- **优势**:CUDA 兼容,迁移简单

---

## 四、性能对比 vs NVIDIA

| 任务 | H100 | 910C | 差距 |
|---|---|---|---|
| LLaMA 70B 推理 | 35ms/token | 65ms/token | ~50% |
| GPT-3 175B 训练 | 1× | 2-3× | 慢 2-3x |
| Stable Diffusion 推理 | 1× | 1.5-2× | 慢 1.5-2x |
| 显存容量 | 80GB | 128GB | **国产 +60%** |
| 互联带宽 | 900GB/s(NVLink 4) | 1.2TB/s(HCCS) | **国产 +33%** |
| 功耗 | 700W | 800W | 国产高 14% |

---

## 五、生态与框架支持

| 框架 | 昇腾 | 海光 | 寒武纪 | 摩尔线程 | 壁仞 | 沐曦 |
|---|---|---|---|---|---|---|
| **vLLM** | ✓ | ✓ | 实验 | 实验 | ✓ | ✓ |
| **SGLang** | ✓ | ✓ | — | — | — | ✓ |
| **TensorRT-LLM** | — | ROCm | — | — | — | — |
| **PyTorch** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Transformers** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **DeepSpeed** | ✓ | ✓ | 实验 | 实验 | ✓ | ✓ |
| **Megatron-LM** | ✓ | ✓ | — | — | — | — |
| **MindSpore** | ✓✓ | — | — | — | — | — |
| **LMDeploy** | ✓ | — | — | — | — | — |

---

## 六、生产最佳实践

1. **信创首选昇腾 910C + 华为云**:全栈国产,生态最完善。
2. **兼容迁移选海光 DCU**:ROCm 兼容,迁移成本最低。
3. **推理场景选 910C / 寒武纪 690**:性价比高。
4. **训练大模型选 910C / 沐曦 C500**:显存大 + 互联强。
5. **多功能(AI+图形)选摩尔线程**:一卡多用。
6. **集群规模 100+ 卡用 HCCS/MLU-Link**:单机 8 卡起步。
7. **算子缺失用厂商 SDK**:CANN / Neuware / MUSA。
8. **性能调优找厂商服务**:国产芯片需厂商深度支持。
9. **A/B 测试 NVIDIA vs 国产**:性能差 30-50% 需优化。
10. **避免混用**:同集群同型号,避免互联问题。

---

## 七、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **昇腾 910C** | 2025-Q4 GA,200K 集群在建 |
| **海光 K100** | 商用量产,ROCm 7 兼容 |
| **寒武纪 690** | 训练场景验证 |
| **摩尔线程 S5000** | 2025-12,48GB 显存 |
| **壁仞 BR104/204** | 训推一体 |
| **沐曦 C500** | 2025-Q3,CUDA 兼容 |
| **市场** | 国产 AI 芯片 ARR 50 亿+ |
| **央国企渗透** | 70%+ 政府 / 央企 |
| **主要竞品** | NVIDIA / 昇腾 / 海光 / 寒武纪 / 摩尔线程 / 壁仞 / 沐曦 |

---

## 八、See Also(官方源)

- 华为昇腾 [hiascend.com](https://www.hiascend.com/)
- 海光 [hygon.cn](https://www.hygon.cn/)
- 寒武纪 [cambricon.com](https://www.cambricon.com/)
- 摩尔线程 [mthreads.com](https://www.mthreads.com/)
- 壁仞 [birentech.com](https://www.birentech.com/)
- 沐曦 [metax-tech.com](https://www.metax-tech.com/)
- 燧原 [enflame-tech.com](https://www.enflame-tech.com/)

---

## 九、相关概念卡

- [[概念/ascend-npu|Ascend Npu]]
- [[概念/cambricon|Cambricon]]
- [[概念/hygon|Hygon]]
- [[概念/cann|Cann]]
- [[概念/apg-gpu|Apg Gpu]]
- [[概念/chinese-ai-chips|Chinese Ai Chips]]
- [[概念/nvidia-gpu|Nvidia Gpu]]
- [[概念/k8s-cn-distributions|K8s Cn Distributions]]
