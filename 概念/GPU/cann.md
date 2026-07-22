---
title: "CANN"
category: -concepts
tags: ["ascend", "huawei", "ai-chip", "runtime", "cann", "npu", "domestic-gpu"]
summary: "CANN（Compute Architecture for Neural Networks）是华为昇腾 AI 处理器的异构计算架构，提供从算子开发到推理部署的完整软件栈。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Compute Architecture for Neural Networks"
  - "昇腾 CANN"
relationships:
  - target: "概念/ascend-npu"
    type: runs_on
  - target: "概念/mindie"
    type: includes
sources: []
---

# CANN

> **一句话理解**: CANN 是昇腾 NPU 的软件底座，相当于 NVIDIA 的 CUDA + cuDNN + TensorRT 合体。

## 定义

CANN（Compute Architecture for Neural Networks）是华为为昇腾 AI 处理器打造的异构计算架构，提供从算子开发、模型编译到推理部署的全栈软件能力，是昇腾生态的核心基础设施。

## 架构分层

```
应用层:  MindIE (LLM 推理) / MindSpore / PyTorch Adapter
加速层:  ATB (Transformer Boost) / 融合算子库
编译层:  毕昇编译器 / GE 图引擎 / 算子编译器
算子层:  Ascend C / TBE / AKG
通信层:  HCCL (对标 NCCL)
运行时:  Runtime API / Stream 管理 / 内存管理
驱动层:  NPU Driver + Firmware
硬件层:  昇腾 910B / 910C / 310P
```

## 核心组件对标

| CANN 组件 | 功能 | NVIDIA 对标 |
|-----------|------|-------------|
| **Ascend C** | 算子开发语言 | CUDA C |
| **ATB** | Transformer 加速 | Transformer Engine |
| **HCCL** | 集合通信 | NCCL |
| **GE 图引擎** | 计算图优化 | TensorRT |
| **毕昇编译器** | 算子编译 | NVCC |
| **MindIE** | LLM 推理服务 | TensorRT-LLM / vLLM |

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **当前版本** | CANN 8.x |
| **LLM 支持** | MindIE 支持 Llama/Qwen/GLM/DeepSeek |
| **训练框架** | MindSpore + PyTorch Adapter |
| **硬件** | 910B/910C 训练，310P 推理 |
| **主要用户** | 华为云、运营商、政务、金融 |

## 生产部署要点

1. **版本严格匹配**：CANN 版本必须与 NPU 驱动、固件、基础镜像一致
2. **K8s 部署**：使用华为官方 NPU Device Plugin + 预装 CANN 的基础镜像
3. **MindIE 推理**：支持 Continuous Batching、PagedAttention、量化
4. **多机训练**：HCCL 配置需指定网卡、Rank 表，调试复杂度高于 NCCL
5. **算子兼容性**：自定义算子需用 Ascend C 重写，迁移成本显著

## Related

- [[概念/ascend-npu|Ascend NPU]]
- [[概念/mindie|MindIE]]
- [[概念/GPU/cambricon|Cambricon]] — 国产 AI 芯片对比
- [[概念/GPU/cudnn|cuDNN]] — NVIDIA 对标组件
- [[部署推理/Hardware/Ascend_NPU_Inference_Guide|昇腾 NPU LLM 推理部署指南]]

## 2026 CANN 生态

| 组件 | 说明 | 状态 |
|------|------|------|
| **CANN 7.0+** | 最新版本 | GA |
| **Ascend C** | 算子开发语言 | GA |
| **MindSpore** | AI 框架 | GA |
| **ATC** | 模型转换工具 | GA |

## 延伸阅读

- [[概念/GPU/ascend-npu|Ascend NPU]] — 昇腾 NPU
- [[概念/GPU/cuda|CUDA]] — NVIDIA CUDA
- [[概念/GPU/cambricon|寒武纪]] — 国产 AI 芯片

> ℹ️ CANN 是华为昇腾 NPU 的软件栈，提供算子开发、模型转换等功能。

## CANN 架构

```
CANN 软件栈
    ├── Ascend C (算子开发语言)
    ├── ATC (模型转换工具)
    ├── AscendCL (计算库)
    ├── GE (图引擎)
    └── Runtime (运行时)
```

## 模型转换流程

```
PyTorch/TensorFlow 模型
        ↓
    ONNX 导出
        ↓
    ATC 转换
        ↓
    .om 模型 (昇腾格式)
        ↓
    昇腾 NPU 推理
```

## 与 CUDA 对比

| 维度 | CANN | CUDA |
|------|------|------|
| **生态成熟度** | 发展中 | 成熟 |
| **算子支持** | 增加中 | 丰富 |
| **框架支持** | MindSpore/PyTorch | 全部 |
| **文档** | 中文为主 | 英文丰富 |

## 生产最佳实践

1. **版本管理**：固定 CANN 版本
2. **算子验证**：验证自定义算子
3. **性能调优**：用 ATC 优化模型
4. **框架适配**：确认框架版本兼容
5. **监控告警**：监控 NPU 利用率

## 检查清单

- [ ] CANN 版本已固定
- [ ] 模型转换已验证
- [ ] 性能已测试
- [ ] 监控已配置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 算子不支持 | 自定义算子未适配 | 使用 TBE/Ascend C 开发自定义算子 |
| 精度损失 | FP16 溢出 | 开启混合精度 + loss scaling |
| 转换失败 | ONNX 版本不兼容 | 固定 ONNX opset ≤ 17 |
| 性能低于预期 | 未开启图优化 | 启用 GE 图编译优化 + 算子融合 |
| 内存不足 | 大模型显存超限 | 开启模型切分 + 梯度检查点 |

## 延伸阅读

- [[概念/GPU/ascend-npu|Ascend NPU]] — 华为昇腾 NPU 硬件架构
- [[概念/GPU/cuda|CUDA]] — NVIDIA 并行计算平台对比
- [[概念/GPU/nccl|NCCL]] — 集合通信库（HCCL 对标）
- [[概念/Training/distributed-training|分布式训练]] — 多卡/多节点训练策略
- [[概念/Inference/model-serving|模型服务]] — 推理部署方案

> ℹ️ CANN 是华为昇腾 AI 生态的核心软件栈，2026年已支持 Atlas 900T A3 集群万卡训练，MindSpore/PyTorch 双框架适配成熟，国产替代首选方案。

## 2026 CANN 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| MindSpore 适配 | ✅ 成熟 | 原生支持 |
| PyTorch 适配 | ✅ 成熟 | torch_npu 插件 |
| ONNX 转换 | ✅ 成熟 | opset ≤ 17 |
| 万卡训练 | ✅ 成熟 | Atlas 900T A3 |
| HCCL 通信 | ✅ 成熟 | 对标 NCCL |
| Ascend C 算子开发 | ✅ 成熟 | 自定义算子 |
| 图编译优化 | ✅ 成熟 | GE 图引擎 |
| vLLM 适配 | 🟡 发展中 | 推理加速 |

## 检查清单

- [ ] CANN 版本与 Ascend 驱动匹配
- [ ] MindSpore/PyTorch 适配已验证
- [ ] ONNX 转换已验证
- [ ] 模型转换已验证
- [ ] 性能已测试
- [ ] 监控已配置
- [ ] HCCL 通信已配置
- [ ] 容器镜像已固定版本
- [ ] 技术支持通道已建立

> ℹ️ CANN 是国产 AI 软件栈的标杆，2026年万卡训练已成熟，是国产化替代的首选方案。

## 关键配置示例

```bash
# 检查 CANN 版本
cat /usr/local/Ascend/ascend-toolkit/latest/version.cfg
# 检查 NPU 状态
npu-smi info
# 运行性能测试
python -m torch_npu.testing.benchmark
```
