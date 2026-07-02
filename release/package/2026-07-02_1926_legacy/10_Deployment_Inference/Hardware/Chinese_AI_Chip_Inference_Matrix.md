---
title: "国产 AI 芯片推理矩阵"
category: 10-deployment-inference
subcategory: hardware
tags: ["ai-chip", "ascend", "cambricon", "hygon", "mthreads", "inference", "kubernetes", "k8s", "alibaba-cloud"]
summary: "横向对比昇腾、寒武纪、海光、摩尔线程等国产 AI 芯片在 LLM 推理场景下的硬件规格、软件栈、部署方式与选型建议。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# 国产 AI 芯片推理矩阵

> **一句话理解**: 不同国产芯片有各自的强项——昇腾生态最完整、寒武纪推理卡密度高、海光兼容 CUDA、摩尔线程图形+AI 兼顾；选型要看模型、框架和运维成本。

## 目录

- [1. 四厂商快速对比](#1-四厂商快速对比)
- [2. 昇腾 Ascend](#2-昇腾-ascend)
- [3. 寒武纪 Cambricon](#3-寒武纪-cambricon)
- [4. 海光 Hygon](#4-海光-hygon)
- [5. 摩尔线程 Moore Threads](#5-摩尔线程-moore-threads)
- [6. 选型决策树](#6-选型决策树)
- [7. K8s 部署要点](#7-k8s-部署要点)
- [Related](#related)

---

## 1. 四厂商快速对比

| 维度 | 昇腾 Ascend | 寒武纪 Cambricon | 海光 Hygon | 摩尔线程 Moore Threads |
|------|------------|-----------------|-----------|----------------------|
| **代表芯片** | 910B/C、310P/B | MLU370、MLU590 | DCU Z100/Z100L | MTT S4000/S3000 |
| **算力定位** | 训练+推理 | 推理为主 | 训练+推理 | 推理+图形 |
| **显存** | 64-96GB HBM | 48GB LPDDR | 32-64GB HBM | 48GB |
| **软件栈** | CANN + MindIE | Bang + MagicMind | ROCm-like DTU | MUSA + MT Transformer |
| **框架兼容** | MindSpore/PyTorch | PyTorch/TensorFlow | PyTorch/TensorFlow | PyTorch/TensorFlow |
| **CUDA 兼容** | 否 | 否 | 较好 | 部分兼容 |
| **K8s 资源名** | `huawei.com/Ascend910` | `cambricon.com/mlu` | `hygon.com/dcu` | `mthreads.com/gpu` |
| **适用场景** | 国产化训练/推理 | 高密度推理 | CUDA 迁移平滑 | 推理+图形渲染 |

---

## 2. 昇腾 Ascend

详见：[[10_Deployment_Inference/Hardware/Ascend_NPU_Inference_Guide|昇腾 NPU LLM 推理部署指南]]

**特点**：
- 全栈自研，生态最完整
- 910B/C 可训可推
- 310P/B 适合边缘推理

**推理命令示例**：

```bash
python -m vllm.entrypoints.openai.api_server \
  --model /models/Qwen2-7B \
  --device npu \
  --tensor-parallel-size 2
```

---

## 3. 寒武纪 Cambricon

**代表产品**：MLU370-X8、MLU590

**软件栈**：
- BANG C 算子开发
- MagicMind 推理框架
- CNCL 集合通信
- PyTorch 适配

**部署示例**：

```bash
# 使用 MagicMind 运行推理
magicmind_inference \
  --model qwen2_7b_model.mm \
  --device mlu \
  --batch_size 1
```

**适用场景**：
- 高密度推理集群
- 推荐、CV、NLP 多场景

---

## 4. 海光 Hygon

**代表产品**：DCU Z100、Z100L

**特点**：
- 兼容 ROCm 生态
- CUDA 迁移相对平滑
- 支持 PyTorch/TensorFlow

**部署示例**：

```bash
# PyTorch 使用 ROCm 后端
HIP_VISIBLE_DEVICES=0,1 python inference.py
```

**适用场景**：
- 已有 CUDA 代码需要快速迁移
- 训练+推理混合负载

---

## 5. 摩尔线程 Moore Threads

**代表产品**：MTT S4000、S3000

**特点**：
- 图形渲染 + AI 推理兼顾
- MUSA 编程模型
- 部分兼容 CUDA

**部署示例**：

```bash
# 使用 MT Transformer 推理框架
mt-transformer inference \
  --model /models/Qwen2-7B \
  --device mtt
```

**适用场景**：
- 数字人、AIGC 渲染+推理
- 边缘推理一体机

---

## 6. 选型决策树

```text
是否需要训练？
  ├── 是 → 昇腾 910 / 海光 DCU
  └── 否 → 是否需要 CUDA 兼容？
            ├── 是 → 海光 DCU
            └── 否 → 是否高密度推理？
                      ├── 是 → 寒武纪 MLU
                      └── 否 → 是否需要图形能力？
                                ├── 是 → 摩尔线程
                                └── 否 → 昇腾 310 / 寒武纪 MLU
```

---

## 7. K8s 部署要点

| 厂商 | Device Plugin | 资源名 | 注意 |
|------|--------------|--------|------|
| 昇腾 | ascend-device-plugin | `huawei.com/Ascend910` | 需 CANN 基础镜像 |
| 寒武纪 | cambricon-device-plugin | `cambricon.com/mlu` | 需 CNRT 运行时 |
| 海光 | hygon-device-plugin | `hygon.com/dcu` | 需 ROCm 驱动 |
| 摩尔线程 | mthreads-device-plugin | `mthreads.com/gpu` | 需 MUSA 运行时 |

---

## Related

- [[10_Deployment_Inference/Hardware/Ascend_NPU_Inference_Guide|昇腾 NPU LLM 推理部署指南]]
- [[_concepts/ascend-npu|Ascend NPU]]
- [[_concepts/hami|HAMi]]
- [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive|国产 AI 芯片深度解析]]
- [[12_Architecture_Infrastructure/AI_Stack/HAMi_Deep_Dive|HAMi 深度解析]]
