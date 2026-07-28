---
title: "端侧 AI 芯片 (Apple ANE / 高通 Hexagon / 联发科 APU / Jetson)"
category: concepts
tags:
  - gpu
  - edge-ai
  - apple-ane
  - qualcomm-hexagon
  - jetson
  - mediatek
  - mobile-ai
  - npu
aliases:
  - Edge AI Chips
  - Apple Neural Engine
  - Qualcomm Hexagon NPU
  - MediaTek APU
  - NVIDIA Jetson
  - Mobile AI
  - On-Device AI
relationships:
  - target: "概念/edge-llm"
    type: extends
  - target: "概念/cn-ai-chips-2"
    type: related_to
  - target: "概念/quantization"
    type: related_to
  - target: "概念/phi-series"
    type: related_to
summary: "端侧 AI 芯片是 2024-2026 LLM 落地的关键——Apple Neural Engine(ANE,M3 38 TOPS)、Qualcomm Hexagon NPU(8 Gen 3 45 TOPS)、MediaTek APU(天玑 9300+)、NVIDIA Jetson Orin(275 TOPS)、Intel Core Ultra NPU(11 TOPS)、高通 Snapdragon X Elite(45 TOPS)。是 iPhone / Android / PC / 车机本地 LLM 的算力底座。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "端侧 AI 芯片"
---

# 端侧 AI 芯片

> 中文简称：端侧 AI 芯片

> **一句话理解**:端侧 AI 芯片让"LLM 跑在手机/PC/车上"——Apple ANE(M3 38 TOPS)、高通 Hexagon NPU(Snapdragon 8 Gen 3 45 TOPS)、联发科 APU(天玑 9300+)、NVIDIA Jetson Orin(275 TOPS)、Intel Core Ultra(11 TOPS)。iPhone 15 Pro 实测可跑 Phi-3.5 3.8B INT4,是 Apple Intelligence 的算力底座。

---

## 一、为什么需要端侧 AI?

云端 LLM 的痛点:
- **延迟**:网络 100ms+,端侧 < 50ms
- **隐私**:数据不出端(医疗/政务刚需)
- **成本**:云 API 按 token 计费,端侧零边际成本
- **离线**:无网络也能用(飞机/野外/灾区)

端侧 LLM 解法:
- 3-14B 模型 + INT4 量化
- 端侧芯片 30-300 TOPS 算力
- 隐私 + 低延迟 + 成本归零

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 神经网络引擎 | Neural Engine(NE) / NPU | 端侧 AI 加速器 |
| 神经处理单元 | Neural Processing Unit(NPU) | 同上 |
| 苹果神经引擎 | Apple Neural Engine(ANE) | Apple 端侧 NPU |
| 高通 Hexagon NPU | Qualcomm Hexagon NPU | 高通 |
| 联发科 APU | MediaTek APU(MTK) | 联发科 |
| 数字信号处理器 | Digital Signal Processor(DSP) | 传统信号处理 |
| 张量加速器 | Tensor Accelerator | 类似 NPU |
| TOPS | Tera Operations Per Second | 万亿次/秒 |
| INT4 量化 | INT4 Quantization | 4-bit 量化 |
| 模型压缩 | Model Compression | 量化/剪枝/蒸馏 |
| Core ML | Core ML | Apple 推理框架 |
| ONNX Runtime | ONNX Runtime | 跨平台推理 |
| Qualcomm AI Engine | Qualcomm AI Engine | 高通 SDK |
| Jetson Orin | Jetson Orin | NVIDIA 边缘 |
| Core Ultra NPU | Intel Core Ultra NPU | Intel 端侧 |
| 联发科 NeuroPilot | MediaTek NeuroPilot | 联发科 SDK |
| 设备端 LLM | On-Device LLM | 端侧 LLM |
| 边缘推理 | Edge Inference | 边缘设备推理 |
| 异构计算 | Heterogeneous Computing | CPU+GPU+NPU |
| 内存带宽 | Memory Bandwidth | LPDDR5X 60GB/s+ |

---

## 三、主流端侧 AI 芯片对比(2026-02 快照)

| 芯片 | 设备 | NPU TOPS | 内存 | LLM 性能 | 适合 |
|---|---|---|---|---|---|
| **Apple M4 Pro** | MacBook Pro | 38 TOPS | 48GB | Llama 3 8B Q4 50 t/s | Mac 桌面 |
| **Apple M4 Max** | Mac Studio | 38 TOPS | 128GB | Llama 3 70B Q4 8 t/s | Mac 桌面 |
| **Apple A18 Pro** | iPhone 16 Pro | 35 TOPS | 8GB | Phi-3 3.8B Q4 30 t/s | iPhone |
| **Qualcomm Snapdragon 8 Gen 4** | Android 旗舰 | 45 TOPS | 16GB | Llama 3 8B Q4 28 t/s | Android |
| **Qualcomm Snapdragon X Elite** | Copilot+ PC | 45 TOPS | 16-64GB | Llama 3 8B Q4 35 t/s | Windows 笔记本 |
| **MediaTek Dimensity 9400** | Android 旗舰 | 50 TOPS | 16GB | Phi-3 3.8B Q4 25 t/s | Android |
| **NVIDIA Jetson Orin Nano** | 边缘设备 | 40 TOPS | 8GB | Llama 3 8B Q4 12 t/s | 边缘 |
| **NVIDIA Jetson Orin NX** | 边缘设备 | 100 TOPS | 16GB | Llama 3 8B Q4 25 t/s | 边缘 |
| **NVIDIA Jetson AGX Orin** | 边缘设备 | 275 TOPS | 64GB | Llama 3 70B Q4 8 t/s | 边缘 |
| **Intel Core Ultra 7 258V** | Copilot+ PC | 11 TOPS | 32GB | Llama 3 8B Q4 18 t/s | Windows 笔记本 |
| **AMD Ryzen AI 9 HX 370** | Copilot+ PC | 50 TOPS | 32GB | Llama 3 8B Q4 22 t/s | Windows 笔记本 |
| **Apple Watch S10** | 手表 | 7 TOPS | 2GB | 1B 模型 | 穿戴 |
| **Samsung Exynos 2500** | Galaxy | 50 TOPS | 12GB | Phi-3 3.8B Q4 20 t/s | Android |

---

## 四、Apple Neural Engine 详解

### 4.1 架构

- **M4 系列**:38 TOPS,3nm 工艺
- **A18 Pro**:35 TOPS,iPhone 16 Pro 标配
- **Core ML** + **MLX**(Apple 开源 ML 框架)
- 优化:**MLX-LM** 专为 Apple Silicon 优化

### 4.2 LLM 部署

```python
import mlx.core as mx
from mlx_lm import load, generate

model, tokenizer = load("mlx-community/Meta-Llama-3-8B-Instruct-4bit")
response = generate(model, tokenizer, prompt="Hello", max_tokens=100)
```

### 4.3 性能

- **Llama 3 8B Q4** on M4 Max:50 t/s
- **Phi-3 3.8B Q4** on iPhone 15 Pro:30 t/s
- **Apple Intelligence**:GPT-4 类任务 30B 模型(云端)+ 3.8B 模型(端侧)

---

## 五、Qualcomm Hexagon NPU 详解

### 5.1 架构

- **Snapdragon 8 Gen 3/4**:45 TOPS,Hexagon NPU
- **Snapdragon X Elite**:45 TOPS,PC 平台
- **Qualcomm AI Engine SDK**:多框架(Caffe / ONNX / TF / PyTorch)
- **Qualcomm AI Hub**:模型库 + 优化

### 5.2 LLM 部署

- **QNN SDK** + **Genie Framework**
- 主流:Phi-3 / Llama 3 / Gemma 2 都有预优化版本
- 性能:8 Gen 4 跑 Llama 3 8B Q4 28 t/s

---

## 六、NVIDIA Jetson 详解

### 6.1 产品线

| 产品 | TOPS | 显存 | 价格 | 适合 |
|---|---|---|---|---|
| **Jetson Orin Nano 8GB** | 40 | 8GB | $249 | 入门 |
| **Jetson Orin NX 16GB** | 100 | 16GB | $599 | 中端 |
| **Jetson AGX Orin 64GB** | 275 | 64GB | $1,999 | 高端 |
| **Jetson Thor** | 2,000(2026-Q2) | 128GB | — | 顶级 |

### 6.2 LLM 性能

- Llama 3 8B Q4 on AGX Orin:25 t/s
- Llama 3 70B Q4 on AGX Orin:8 t/s
- vLLM / TRT-LLM 优化

---

## 七、生产最佳实践

1. **iPhone / iPad 选 MLX-LM**:Apple Silicon 优化,质量与速度平衡。
2. **Android 选 QNN SDK**:高通平台性能最佳。
3. **PC 选 Snapdragon X Elite / Intel Core Ultra**:Copilot+ PC 标配。
4. **机器人 / 工业选 Jetson Orin**:275 TOPS,Linux + vLLM。
5. **3-8B 模型 + INT4 量化**:端侧标准范式。
6. **量化工具**:llama.cpp / MLX-LM / Qualcomm AI Hub / NVIDIA TRT-LLM。
7. **端云协同**:简单任务端侧 / 复杂任务云端,降低云成本。
8. **隐私优先**:医疗 / 政务用端侧 + 同态加密。
9. **A/B 测试**:端侧 vs 云端:延迟、隐私、电池、成本。
10. **OTA 模型更新**:端侧模型需支持远程更新。

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Apple Intelligence** | M4 / A18 Pro / iOS 18 标配 |
| **Copilot+ PC** | 6000 万+ 装机,2026-Q2 50M+ |
| **Jetson Thor** | 2,000 TOPS,机器人 SOTA |
| **Snapdragon X Elite 2** | 75 TOPS,2026-Q3 |
| **MediaTek Dimensity 9500** | 80 TOPS,2026-Q1 |
| **Exynos 2600** | 100 TOPS,2026-Q2 |
| **Intel Lunar Lake 2** | 48 TOPS,2026-Q4 |
| **市场规模** | 端侧 AI 芯片 $50B+ |
| **主要竞品** | Apple / Qualcomm / NVIDIA / MediaTek / Intel / AMD / 华为 |

---

## 九、See Also(官方源)

- Apple MLX [github.com/ml-explore/mlx](https://github.com/ml-explore/mlx)
- Apple MLX-LM [github.com/ml-explore/mlx-lm](https://github.com/ml-explore/mlx-lm)
- Qualcomm AI Hub [aihub.qualcomm.com](https://aihub.qualcomm.com/)
- NVIDIA Jetson [developer.nvidia.com/embedded/jetson](https://developer.nvidia.com/embedded/jetson)
- MediaTek NeuroPilot [corp.mediatek.com](https://corp.mediatek.com/)
- Intel OpenVINO [github.com/openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino)
- llama.cpp [github.com/ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp)

---

## 十、相关概念卡

- [[概念/edge-llm|Edge Llm]]
- [[概念/quantization|Quantization]]
- [[概念/phi-series|Phi Series]]
- [[概念/cn-ai-chips-2|Cn Ai Chips 2]]
- [[概念/Training/model-compression|Model Compression]]
- [[概念/llama-cpp|Llama Cpp]]
- [[概念/onnx|Onnx]]
- [[概念/openvino|Openvino]]
