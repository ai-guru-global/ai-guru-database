---
title: "Cambricon"
category: -concepts
tags: ["ai-chip", "cambricon", "chinese-chip", "inference", "mlu", "domestic-gpu"]
summary: "寒武纪（Cambricon）是中国领先的 AI 芯片设计公司，产品覆盖云端训练/推理和终端推理，代表产品包括 MLU370、MLU590 等。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "寒武纪"
  - "Cambricon MLU"
  - "MLU"
relationships:
  - target: "概念/chinese-ai-chips"
    type: part_of
  - target: "概念/magicmind"
    type: uses
sources: []
---

# Cambricon（寒武纪）

> **一句话理解**: 寒武纪是国内最早做 AI 芯片的公司之一，MLU 系列主打云端高密度推理。

## 定义

寒武纪（Cambricon，上交所: 688256）是中国 AI 芯片设计先驱，产品覆盖云端训练/推理、边缘推理和终端 IP，采用自研指令集架构。

## 产品线（2026）

| 产品 | 定位 | 算力 | 显存 | 典型场景 |
|------|------|------|------|----------|
| **MLU590-M9** | 云端训练+推理 | 512 TOPS INT8 | 48GB HBM | 大模型训练 |
| **MLU370-X8** | 云端推理 | 256 TOPS INT8 | 24GB | NLP/CV 推理 |
| **MLU370-S4** | 密集推理 | 256 TOPS | 24GB | 推荐/搜索 |
| **MLU220** | 边缘推理 | 16 TOPS | 4GB | 边缘一体机 |

## 软件栈

```
应用层:  Cambricon PyTorch / MagicMind 推理
框架层:  CNToolkit (BANG C, CNCL, CNRT)
驱动层:  MLU Driver + Firmware
硬件层:  MLU590 / MLU370
```

| 组件 | 功能 | 对标 |
|------|------|------|
| **BANG C** | 算子开发语言 | CUDA C |
| **MagicMind** | 推理引擎 | TensorRT |
| **CNCL** | 集合通信库 | NCCL |
| **Cambricon PyTorch** | 框架适配 | PyTorch CUDA |

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **大模型支持** | MagicMind 支持 Llama/Qwen/ChatGLM 推理 |
| **训练能力** | MLU590 支持千亿参数训练，但生态成熟度待提升 |
| **市场份额** | 国内 AI 芯片第二梯队（华为昇腾领先） |
| **主要客户** | 运营商、政务云、智慧城市 |

## 生产注意事项

1. **软件成熟度**：部分算子需手动适配，建议先验证目标模型
2. **容器部署**：使用官方 CNToolkit 镜像，避免版本不匹配
3. **性能对标**：同算力下实际吐量通常为 NVIDIA 的 60-80%
4. **多卡通信**：CNCL 成熟度不及 NCCL，大规模训练需谨慎评估

## Related

- [[概念/chinese-ai-chips|Chinese AI Chips]]
- [[概念/ascend-npu|Ascend NPU]]
- [[概念/hygon|Hygon]]
- [[概念/GPU/cann|CANN]] — 华为昇腾对标软件栈
- [[10_部署推理/08_Hardware/Chinese_AI_Chip_Inference_Matrix|国产芯片推理矩阵]]

## 2026 寒武纪生态

| 产品 | 说明 | 状态 |
|------|------|------|
| **思元 590** | AI 训练芯片 | GA |
| **思元 370** | AI 推理芯片 | GA |
| **Cambricon Neuware** | 软件栈 | GA |

## 延伸阅读

- [[概念/GPU/gpu|GPU]] — GPU 基础
- [[概念/GPU/cann|CANN]] — 华为昇腾软件栈
- [[概念/GPU/mthreads|摩尔线程]] — 国产 GPU

> ℹ️ 寒武纪是国产 AI 芯片厂商，提供训练和推理芯片及软件栈。

## 寒武纪产品线

| 产品 | 架构 | 算力 | 适用 |
|------|------|------|------|
| **思元 590** | 7nm | 512 TOPS | AI 训练 |
| **思元 370** | 7nm | 256 TOPS | AI 推理 |
| **思元 290** | 16nm | 128 TOPS | 边缘计算 |

## Neuware 软件栈

```
Cambricon Neuware
    ├── CNToolkit (开发工具包)
    ├── CNRT (运行时)
    ├── CNNL (神经网络库)
    ├── CNCodec (编解码)
    └── MagicMind (推理引擎)
```

## 与 NVIDIA 对比

| 维度 | 寒武纪 | NVIDIA |
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
| **边缘计算** | ⭐⭐⭐⭐ | 低功耗 |
| **科学计算** | ⭐⭐⭐ | 软件栈支持 |

## 生产最佳实践

1. **场景定位**：思元 590 适合推理和中小规模训练，超大模型训练建议评估集群稳定性
2. **Neuware 迁移**：使用 cnrt adapter 从 CUDA 迁移，注意算子兼容性
3. **模型转换**：先转 ONNX 再用 MagicMind 转换，验证精度损失 < 0.1%
4. **容器化**：使用官方 Neuware 容器镜像，固定驱动版本
5. **性能调优**：利用 CNML 图优化和算子融合提升推理吞吐

## 检查清单

- [ ] Neuware 驱动已安装且版本匹配
- [ ] 目标模型算子已全部支持
- [ ] 精度验证已通过（误差 < 0.1%）
- [ ] 性能基线已建立
- [ ] 监控已接入集群管理平台

## 延伸阅读

- [[概念/GPU/ascend-npu|Ascend NPU]] — 华为昇腾对比
- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — 主要竞争对手
- [[概念/GPU/hygon|海光]] — 国产 GPU 对比
- [[概念/GPU/mthreads|摩尔线程]] — 国产 GPU 对比
- [[概念/Inference/model-serving|模型服务]] — 推理部署方案

> ℹ️ 寒武纪是国产 AI 芯片先行者，2026年思元 590 在推理场景成熟度较高，Neuware 软件栈持续完善，适合国产化推理部署和边缘 AI 场景。

## 2026 寒武纪生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| Neuware 软件栈 | ✅ 成熟 | CNRT/CNML/MagicMind |
| PyTorch 适配 | ✅ 成熟 | 官方插件 |
| 推理部署 | ✅ 成熟 | MagicMind 图优化 |
| 大模型训练 | 🟡 发展中 | 千卡级验证 |
| 边缘 AI | ✅ 成熟 | 低功耗方案 |
| ONNX 转换 | ✅ 成熟 | opset ≤ 17 |

## 检查清单

- [ ] Neuware 驱动已安装且版本匹配
- [ ] 目标模型算子已全部支持
- [ ] 精度验证已通过（误差 < 0.1%）
- [ ] 性能基线已建立
- [ ] 容器镜像已固定版本
- [ ] 监控已接入集群管理平台
- [ ] 技术支持通道已建立
