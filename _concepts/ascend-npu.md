---
title: "华为昇腾 NPU (Huawei Ascend NPU)"
category: -concepts
tags: ["ascend", "huawei", "npu", "ai-stack", "cann", "mindspore", "domestic-chip"]
relationships:
  - target: "_concepts/ai-hardware"
    type: related_to
  - target: "_concepts/heterogeneous-gpu"
    type: related_to
  - target: "_concepts/a-speed"
    type: related_to
  - target: "_concepts/apg-gpu"
    type: related_to
  - target: "_concepts/cuda-platform"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "华为昇腾（Ascend）是华为自研的 AI 处理器系列，包括 910B/910C 训练推理芯片。AI Stack 原生支持 Ascend GPU，是国产算力的重要替代方案。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
tier: core
---

# 华为昇腾 NPU (Huawei Ascend)

> **一句话理解**: 昇腾是华为的"国产 AI 芯片"——AI Stack 三大 GPU 选项之一，在 NVIDIA 出口管制背景下是政企客户的核心国产替代方案。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **厂商** | 华为 (Huawei) |
| **全称** | 华为昇腾 (Ascend) |
| **芯片类型** | NPU (Neural Processing Unit) |
| **核心型号** | 昇腾 910B / 910C |
| **编程框架** | CANN (Compute Architecture for Neural Networks) |
| **训练框架** | MindSpore |
| **AI Stack 支持** | 原生支持（三大 GPU 选项之一） |

---

## 2. 芯片系列

### 2.1 昇腾 910 系列（训练+推理）

| 型号 | 定位 | FP16 算力 | INT8 算力 | 显存 | 互联 |
|------|------|----------|----------|------|------|
| **910B** | 主力训练/推理 | ~320 TFLOPS | ~640 TOPS | 64 GB HBM2e | HCCS |
| **910C** | 新一代旗舰 | ~600 TFLOPS | ~1200 TOPS | 128 GB HBM | HCCS 2.0 |
| **910A** | 初代（已停产） | ~256 TFLOPS | ~512 TOPS | 32 GB | HCCS |

### 2.2 昇腾 310 系列（推理）

| 型号 | 定位 | INT8 算力 | 功耗 |
|------|------|----------|------|
| **310P** | 边缘推理 | 24 TOPS | 8W |
| **310** | 轻量推理 | 16 TOPS | 8W |

---

## 3. 软件生态

### 3.1 CANN 编程架构

```
昇腾软件栈
│
├── 应用层
│   ├── MindSpore（训练框架）
│   ├── PyTorch（通过 torch_npu 适配）
│   └── TensorFlow（通过适配插件）
│
├── 算子层
│   ├── ACL (Ascend Computing Language)
│   └── 算子库（对标 cuDNN）
│
├── 编译层
│   └── CANN 编译器
│       ├── 图编译优化
│       ├── 自动微分
│       └── 算子融合
│
└── 驱动层
    └── NPU 驱动 + 运行时
```

### 3.2 与 CUDA 的对比

| 维度 | CUDA (NVIDIA) | CANN (华为昇腾) |
|------|-------------|---------------|
| **编程模型** | CUDA C/C++ | Ascend C |
| **编译器** | NVCC | BiSheng Compiler |
| **深度学习库** | cuDNN | ACL 算子库 |
| **训练框架** | PyTorch/TF 原生 | MindSpore 原生 + PyTorch 适配 |
| **推理框架** | TensorRT/vLLM/SGLang | MindSpore Serving / vLLM 适配 |
| **生态成熟度** | 20+ 年积累 | 5+ 年快速成长 |
| **迁移成本** | 基准 | 中等（需适配算子） |
| **供应链** | 受出口管制 | 完全自主可控 |

---

## 4. 在 AI Stack 中的角色

AI Stack 支持 Ascend 作为三大 GPU 选项之一：

| GPU 厂商 | AI Stack 支持 | 推理框架 | 典型客户 |
|----------|-------------|----------|----------|
| **APG** (阿里云) | 首选 | A-Speed | 追求 CUDA 兼容 |
| **Ascend** (华为) | 原生支持 | A-Speed 适配 | 自主可控优先 |
| **NVIDIA** | 原生支持 | A-Speed / vLLM | 标准 GPU 环境 |

### 昇腾一体机竞品

| 维度 | 华为昇腾一体机 | 阿里云 AI Stack |
|------|-------------|----------------|
| **芯片** | 昇腾 910B/910C | APG |
| **推理框架** | MindSpore Serving | A-Speed |
| **CUDA 兼容** | 需迁移适配 | 高度兼容 |
| **生态** | 华为云生态 | 钉钉/百炼/灵码 |
| **部署难度** | 天级 | 小时级 |
| **认证** | 多项认证 | IDC 六项满分 |

---

## 5. PyTorch 适配 (torch_npu)

```python
# 安装 torch_npu
pip install torch-npu

# PyTorch 代码适配
import torch
import torch_npu

# 自动检测 NPU
if torch.npu.is_available():
    device = torch.device("npu")
else:
    device = torch.device("cuda")

# 模型迁移
model = model.to(device)
```

---

## 6. FlashMLA 国产适配

FlashMLA 已被华为昇腾平台移植：

| 芯片平台 | 适配方 | 项目 |
|----------|--------|------|
| **海光 DCU** | Hygon | OpenDAS/MLAttention |
| **华为昇腾** | Huawei | Ascend/FlashMLA |
| **摩尔线程** | Moore Threads | MT-flashMLA |
| **燧原** | Intellifusion | tyllm |

---

## Related

- [[_concepts/ai-hardware]] — AI 硬件全景
- [[_concepts/heterogeneous-gpu]] — 异构 GPU 纳管
- [[_concepts/a-speed]] — A-Speed 加速推理
- [[_concepts/apg-gpu]] — APG 自研加速卡
- [[_concepts/cuda-platform]] — CUDA 计算平台
- [[_concepts/flash-attention-kernels]] — FlashMLA 算子
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
