---
title: "昇腾 NPU LLM 推理部署指南"
category: 10-deployment-inference
subcategory: hardware
tags: ["ascend", "npu", "huawei", "llm", "inference", "cann", "mindie", "alibaba-cloud"]
summary: "面向 K8s 环境的华为昇腾 NPU 大模型推理部署指南：覆盖 CANN、MindIE、MindSpore Lite、vLLM-Ascend 等推理栈，以及常见故障排查。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# 昇腾 NPU LLM 推理部署指南

> **一句话理解**: 昇腾 NPU 是华为推出的 AI 处理器，配合 CANN 和 MindIE 推理引擎，可在国产化环境中部署 LLM 推理服务。

## 目录

- [1. 昇腾 NPU 产品线](#1-昇腾-npu-产品线)
- [2. 软件栈](#2-软件栈)
- [3. 推理部署方式](#3-推理部署方式)
- [4. K8s 部署](#4-k8s-部署)
- [5. 性能优化](#5-性能优化)
- [6. 常见故障排查](#6-常见故障排查)
- [7. 阿里云专有云关联](#7-阿里云专有云关联)
- [Related](#related)

---

## 1. 昇腾 NPU 产品线

| 芯片 | 定位 | 算力 | 显存 | 典型场景 |
|------|------|------|------|---------|
| Ascend 910B/C | 训练+推理 | 320-400+ TFLOPS FP16 | 64-96GB HBM | 大模型训练/推理 |
| Ascend 310P | 推理 | 16 TOPS INT8 | 8GB | 边缘推理 |
| Ascend 310B | 推理 | 32 TOPS INT8 | 16GB | 边缘/轻量推理 |

---

## 2. 软件栈

```text
应用层：MindSpore / PyTorch / TensorFlow
推理引擎：MindIE / MindSpore Lite / vLLM-Ascend
加速库：ATB (Transformer Boost)
算子层：Ascend C / TBE / AKG
运行时：CANN Runtime / GE 图引擎
驱动层：NPU Driver
```

### 2.1 CANN

**CANN (Compute Architecture for Neural Networks)** 是昇腾异构计算架构，包含：
- 驱动和运行时
- 算子开发工具（Ascend C、TBE）
- 图引擎 GE
- HCCL 集合通信

### 2.2 MindIE

**MindIE (Mind Inference Engine)** 是昇腾自研推理引擎，支持：
- 静态图优化
- INT8/FP16 量化
- Continuous Batching
- Prefix Caching
- 多卡并行

### 2.3 vLLM-Ascend

社区版 vLLM 昇腾适配，提供 OpenAI 兼容 API。

---

## 3. 推理部署方式

### 3.1 使用 MindIE

```bash
# 启动 MindIE Server
python -m mindie.server \
  --model_path /models/Qwen2-7B \
  --device npu \
  --tp_size 2
```

### 3.2 使用 vLLM-Ascend

```bash
# 安装 vLLM-Ascend
pip install vllm-ascend

# 启动服务
python -m vllm.entrypoints.openai.api_server \
  --model /models/Qwen2-7B \
  --device npu \
  --tensor-parallel-size 2
```

### 3.3 模型转换

昇腾通常需要将 PyTorch 模型转换为 OM 格式或直接使用 ATB：

```bash
# 导出 ONNX
python export_onnx.py --model /models/Qwen2-7B

# 转换为 OM
atc --model=model.onnx --framework=5 --output=model --soc_version=Ascend910B
```

---

## 4. K8s 部署

### 4.1 Device Plugin

```bash
# 部署昇腾 Device Plugin
kubectl apply -f https://gitee.com/ascend/ascend-device-plugin/raw/master/ascend-device-plugin-daemonset.yaml
```

### 4.2 Pod 示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: llm-inference-ascend
spec:
  containers:
    - name: mindie
      image: ascend-mindie:v1.0
      resources:
        limits:
          huawei.com/Ascend910: "2"
      volumeMounts:
        - name: model
          mountPath: /models
  volumes:
    - name: model
      persistentVolumeClaim:
        claimName: model-pvc
```

### 4.3 调度

昇腾资源名称为 `huawei.com/Ascend910` 或 `huawei.com/Ascend310`。

---

## 5. 性能优化

| 优化方向 | 方法 |
|----------|------|
| 量化 | INT8/FP16 量化，使用 AMCT 工具 |
| 批处理 | 开启 Continuous Batching |
| 前缀缓存 | 开启 Prefix Caching |
| 多卡并行 | Tensor Parallelism / Pipeline Parallelism |
| 算子融合 | 使用 ATB 加速库 |

---

## 6. 常见故障排查

| 故障 | 排查 | 处理 |
|------|------|------|
| NPU 不可见 | `npu-smi info` | 检查驱动、Device Plugin |
| 模型转换失败 | 看 ATC 日志 | 检查算子支持、soc_version |
| 推理 OOM | `npu-smi info -t memory` | 降低 batch size、启用量化 |
| 精度异常 | 对比 FP16 结果 | 调整量化校准集 |
| 通信失败 | 检查 HCCL | 确认 RDMA/ROCE 网络 |

---

## 7. 阿里云专有云关联

在阿里云专有云环境中，昇腾 NPU 可作为国产化算力底座部署 ACK 集群：
- 镜像仓库使用 ACR/Harbor
- 模型存储使用盘古 NAS/OSS
- 可对接 PAI-EAS 私有化版或自研 MindIE 服务
- 监控可接入 ASCM 告警中心

---

## Related

- [[_concepts/ascend-npu|Ascend NPU]]
- [[_concepts/cann|CANN]]
- [[_concepts/mindie|MindIE]]
- [[_concepts/hami|HAMi]]
- [[部署推理/Hardware/Chinese_AI_Chip_Inference_Matrix|国产芯片推理矩阵]]
- [[数学基础/AI_Hardware/Chinese_AI_Chips_Deep_Dive|国产 AI 芯片深度解析]]
