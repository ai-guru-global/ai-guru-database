---
title: "Moore Threads"
category: -concepts
tags: ["ai-chip", "mthreads", "chinese-chip", "inference", "gpu", "domestic-gpu", "musa"]
summary: "摩尔线程（Moore Threads）是中国 GPU 芯片公司，产品覆盖图形渲染和 AI 推理，代表产品为 MTT S4000/S3000。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "摩尔线程"
  - "Moore Threads GPU"
  - "MTT"
relationships:
  - target: "概念/chinese-ai-chips"
    type: part_of
  - target: "概念/musa"
    type: uses
sources: []
---

# Moore Threads（摩尔线程）

> **一句话理解**: 摩尔线程是国产 GPU 厂商，既做游戏/图形卡，也做 AI 推理卡，特点是图形和 AI 算力能兼顾。

## 定义

摩尔线程（Moore Threads）由前 NVIDIA 中国区总经理张建中创立，是国内少数同时覆盖图形渲染和 AI 计算的 GPU 设计公司，采用自研 MUSA 架构。

## 产品线（2026）

| 产品 | 定位 | AI 算力 | 显存 | 典型场景 |
|------|------|---------|------|----------|
| **MTT S4000** | 云端 AI + 图形 | 100 TFLOPS FP16 | 48GB GDDR6 | LLM 推理、数字人 |
| **MTT S3000** | 云端推理 | 80 TFLOPS FP16 | 32GB | CV/NLP 推理 |
| **MTT S80** | 桌面 GPU | 14 TFLOPS | 16GB | 游戏 + 轻量 AI |
| **MTT S2000** | 边缘推理 | 32 TFLOPS | 16GB | 边缘一体机 |

## 软件栈

| 组件 | 功能 | 对标 |
|------|------|------|
| **MUSA** | 统一计算架构 | CUDA |
| **MUSIFY** | CUDA 代码迁移工具 | hipify (AMD) |
| **MT Transformer** | LLM 推理加速 | TensorRT-LLM |
| **MCCL** | 集合通信 | NCCL |
| **DirectX/Vulkan** | 图形渲染 | 同 NVIDIA |

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **LLM 推理** | MT Transformer 支持 Llama/Qwen/ChatGLM |
| **CUDA 迁移** | MUSIFY 可自动转换部分 CUDA 代码 |
| **图形能力** | 国内唯一同时支持 DirectX 12 的 GPU |
| **主要场景** | 数字人、AIGC、云游戏、边缘推理 |
| **市场定位** | 图形+AI 融合场景差异化竞争 |

## 生产注意事项

1. **CUDA 迁移成本**：MUSIFY 自动转换率有限，复杂算子需手动适配
2. **图形+AI 融合**：数字人、AIGC 场景是独特优势
3. **驱动稳定性**：建议锁定驱动版本，避免升级引入不兼容
4. **性能对标**：AI 推理性能约为同规格 NVIDIA 的 50-70%

## Related

- [[概念/chinese-ai-chips|Chinese AI Chips]]
- [[概念/ascend-npu|Ascend NPU]]
- [[概念/hygon|Hygon]]
- [[概念/GPU/cambricon|Cambricon]] — 国产 AI 芯片对比
- [[部署推理/Hardware/Chinese_AI_Chip_Inference_Matrix|国产芯片推理矩阵]]

## 2026 摩尔线程生态

| 产品 | 说明 | 状态 |
|------|------|------|
| **MTT S4000** | AI 训练 GPU | GA |
| **MTT S80** | 桌面 GPU | GA |
| **MUSA** | 计算平台 | GA |

## 延伸阅读

- [[概念/GPU/gpu|GPU]] — GPU 基础
- [[概念/GPU/hygon|Hygon]] — 海光 GPU
- [[概念/GPU/cambricon|Cambricon]] — 寒武纪

> ℹ️ 摩尔线程是国产 GPU 厂商，提供 AI 训练和推理 GPU。

## 摩尔线程产品线

| 产品 | 架构 | 显存 | 适用 |
|------|------|------|------|
| **MTT S4000** | 春晓 | 48GB GDDR6 | AI 训练 |
| **MTT S80** | 春晓 | 16GB GDDR6 | 桌面 |
| **MTT S3000** | 春晓 | 32GB GDDR6 | 数据中心 |

## MUSA 软件栈

```
MUSA 软件栈
    ├── MUSA Driver (驱动)
    ├── MUSA Runtime (运行时)
    ├── MUSA Compiler (编译器)
    ├── MUSA Math (数学库)
    └── MUSA DNN (深度学习库)
```

## 与 NVIDIA 对比

| 维度 | 摩尔线程 | NVIDIA |
|------|------|------|
| **生态成熟度** | 发展中 | 成熟 |
| **性能** | 中等 | 领先 |
| **价格** | 较低 | 较高 |
| **供应** | 国产 | 受限制 |

## 生产最佳实践

1. **驱动验证**：生产前验证驱动稳定性
2. **框架兼容**：确认 PyTorch/TensorFlow 兼容
3. **性能测试**：对比 NVIDIA 性能
4. **异构部署**：支持混合部署
5. **技术支持**：建立技术支持渠道

## 检查清单

- [ ] 驱动已安装验证
- [ ] 框架兼容性已确认
- [ ] 性能已测试
- [ ] 技术支持已建立

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 驱动安装失败 | 检查内核版本 |
| 框架不兼容 | 确认框架版本 |
| 性能低 | 对比 NVIDIA 性能 |
| 文档不足 | 联系技术支持 |

## 适用场景

| 场景 | 推荐度 | 说明 |
|------|------|------|
| **AI 训练** | ⭐⭐⭐ | 生态发展中 |
| **AI 推理** | ⭐⭐⭐⭐ | 性价比高 |
| **图形渲染** | ⭐⭐⭐ | 驱动成熟度 |
| **科学计算** | ⭐⭐⭐ | 软件栈支持 |

## 生产最佳实践

1. **场景定位**：MTT S4000 适合推理场景，训练场景建议评估软件栈成熟度
2. **MUSA 迁移**：从 CUDA 迁移时注意 API 差异，使用 musa-adapter 工具
3. **容器化部署**：使用官方 MUSA 容器镜像确保环境一致性
4. **性能基线**：部署前运行 mthreads-bench 建立性能基线
5. **混合部署**：可与 NVIDIA GPU 混合部署，通过调度器分配不同任务

## 检查清单

- [ ] MUSA 驱动已安装且版本匹配
- [ ] 目标模型已在 MUSA 上验证精度
- [ ] 性能已达到预期基线
- [ ] 容器镜像已固定版本
- [ ] 监控已接入集群管理平台

## 延伸阅读

- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — 主要竞争对手对比
- [[概念/GPU/cuda|CUDA]] — MUSA 对标的编程模型
- [[概念/GPU/cambricon|寒武纪]] — 国产 AI 芯片对比
- [[概念/GPU/hygon|海光]] — 国产 GPU 对比
- [[概念/Inference/model-serving|模型服务]] — 推理部署方案

> ℹ️ 摩尔线程是国产 GPU 新势力，2026年 MTT S4000 在推理场景性价比突出，MUSA 软件栈持续完善中，适合对国产化有要求的推理部署场景。

## 2026 摩尔线程产品现状

| 产品 | 定位 | 显存 | 软件栈 | 状态 |
|------|------|------|------|------|
| MTT S4000 | AI 推理 | 48GB | MUSA | ✅ 量产 |
| MTT S3000 | 图形+AI | 32GB | MUSA | ✅ 量产 |
| MTT S80 | 图形 | 16GB | MUSA | ✅ 量产 |
| MUSA SDK | 开发工具 | — | — | ✅ 成熟 |
| musa-adapter | CUDA 迁移 | — | — | 🟡 完善中 |
| 容器镜像 | 部署 | — | — | ✅ 可用 |

## 检查清单

- [ ] MUSA 驱动已安装且版本匹配
- [ ] 目标模型已在 MUSA 上验证精度
- [ ] 性能已达到预期基线
- [ ] 容器镜像已固定版本
- [ ] 监控已接入集群管理平台
- [ ] CUDA 迁移工具已评估
- [ ] 技术支持通道已建立

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| MUSA 算子缺失 | 使用 musa-adapter 或自定义开发 |
| 性能低于预期 | 检查内存访问模式 + 算子融合 |
| 驱动不兼容 | 使用官方推荐 OS 内核 |
| 多卡通信异常 | 检查 GPU 互联拓扑 |
