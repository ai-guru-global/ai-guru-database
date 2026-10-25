---
title: "Chinese AI Chips"
category: -concepts
tags: ["ai-chip", "chinese-chip", "ascend", "cambricon", "hygon", "mthreads", "alibaba-cloud"]
summary: "国产 AI 芯片是中国自主研发的 AI 加速器，主要厂商包括华为昇腾、寒武纪、海光、摩尔线程等，用于替代或补充 NVIDIA GPU。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "国产 AI 芯片"
  - "Chinese AI Chip"
relationships:
  - target: "概念/ascend-npu"
    type: includes
  - target: "概念/cambricon"
    type: includes
  - target: "概念/hygon"
    type: includes
  - target: "概念/mthreads"
    type: includes
sources: []
name_zh: "国产 AI 芯片"
---

# Chinese AI Chips

> 中文简称：国产 AI 芯片

> **一句话理解**: 国产 AI 芯片是中国自己做的 AI 算力芯片，主要在国产化、自主可控场景替代 NVIDIA。

## 核心要点

- **主要厂商**: 华为昇腾、寒武纪、海光、摩尔线程、天数智芯、壁仞、燧原等。
- **驱动因素**: 国际出口管制、自主可控需求、信创政策。
- **核心挑战**: 软件生态、CUDA 迁移、互联带宽、大规模训练验证。
- **主流场景**: 推理优先，训练逐步突破。

## 梯队

| 梯队 | 厂商 |
|------|------|
| T1 | 华为昇腾、寒武纪、海光 |
| T2 | 壁仞、燧原、摩尔线程、天数智芯、沐曦、平头哥 |
| T3 | 百度昆仑芯、算能、地平线、景嘉微 |

## 阿里云专有云关联

在阿里云专有云环境中，国产 AI 芯片可作为异构算力节点接入 ACK，用于信创场景或混合算力调度。

## Related

- [[概念/ascend-npu|Ascend NPU]]
- [[概念/cambricon|Cambricon]]
- [[概念/hygon|Hygon]]
- [[概念/mthreads|Moore Threads]]
- [[10_部署推理/05_硬件与算力/03_Chinese_AI_Chip_推理_矩阵|国产芯片推理矩阵]]
- [[01_数学基础/10_AI硬件/03_Chinese_AI_Chips_深入分析|国产 AI 芯片深度解析]]

---

## 2026 国产 AI 芯片生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **华为昇腾** | 昇腾 910B/910C | GA |
| **寒武纪** | 思元系列 AI 芯片 | GA |
| **海光 DCU** | 深算系列 DCU | GA |
| **摩尔线程** | MTT S 系列 GPU | GA |
| **软件生态** | CANN/ROCm 等软件栈 | 发展中 |

## 生产最佳实践

1. **昇腾优先**：国产芯片优先选择华为昇腾
2. **软件适配**：关注软件生态成熟度
3. **混合部署**：国产 + NVIDIA 混合部署
4. **性能评估**：实际业务场景性能评估
5. **长期规划**：关注国产芯片长期发展

## 主流芯片对比

| 芯片 | 厂商 | 算力(FP16) | 显存 | 软件栈 | 适用场景 |
|------|------|------|------|------|------|
| 昇腾 910C | 华为 | 640 TFLOPS | 64GB HBM | CANN/MindSpore | 训练+推理 |
| 昇腾 310P | 华为 | 80 TFLOPS | 24GB | CANN | 推理 |
| 思元 590 | 寒武纪 | 512 TFLOPS | 48GB HBM | Neuware | 训练+推理 |
| 深算一号 | 海光 | 296 TFLOPS | 32GB HBM | ROCm-like | 训练+推理 |
| MTT S4000 | 摩尔线程 | 200 TFLOPS | 48GB | MUSA | 推理+图形 |
| 壁仕 BR100 | 壁仕 | 512 TFLOPS | 64GB HBM | BIRENSUPA | 训练 |

## 软件生态对比

| 软件栈 | 厂商 | 对标 | 成熟度 | 说明 |
|------|------|------|------|------|
| CANN | 华为 | CUDA | ★★★★ | 最完善的国产 AI 软件栈 |
| MindSpore | 华为 | PyTorch | ★★★ | 深度学习框架 |
| Neuware | 寒武纪 | CUDA | ★★★ | 寒武纪开发工具链 |
| MUSA | 摩尔线程 | CUDA | ★★ | CUDA 兼容层 |
| BIRENSUPA | 壁仕 | CUDA | ★★ | 壁仕计算平台 |

## CUDA 迁移策略

| 策略 | 说明 | 适用场景 |
|------|------|------|
| 算子替换 | 将 CUDA kernel 替换为国产 SDK 算子 | 自定义算子多 |
| 框架适配 | 使用 MindSpore/PaddlePaddle 重写 | 新项目 |
| 兼容层 | 使用 HIP/MUSA 等兼容层 | CUDA 代码量大 |
| 混合部署 | 国产芯片做推理，NVIDIA 做训练 | 过渡期 |

## 国产化部署架构

```yaml
# K8s 异构算力调度示例
apiVersion: v1
kind: Pod
metadata:
  labels:
    accelerator: ascend-910c
spec:
  containers:
  - name: inference
    image: ascend-mindie:latest
    resources:
      limits:
        huawei.com/Ascend910: 2
  nodeSelector:
    accelerator: ascend-910c
  tolerations:
  - key: "ascend"
    operator: "Exists"
    effect: "NoSchedule"
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 算子不支持 | 国产 SDK 算子覆盖不全 | 自定义算子开发或回退 CPU |
| 性能差距 | 软件优化不足 | 升级 SDK、图优化、算子融合 |
| 驱动不兼容 | 内核版本不匹配 | 固定驱动版本、容器化部署 |
| 多卡通信慢 | HCCS 带宽限制 | 优化并行策略、减少通信量 |
| 模型迁移难 | CUDA 依赖深 | 使用框架抽象层、逐步迁移 |

## 选型决策树

| 场景 | 推荐芯片 | 理由 |
|------|------|------|
| 信创合规 | 昇腾 910C | 生态最完善、政策支持 |
| 推理为主 | 昇腾 310P / 思元 370 | 性价比高、功耗低 |
| 大规模训练 | 昇腾 910C 集群 | 千卡验证、华为支持 |
| 图形+AI | 摩尔线程 S4000 | 图形渲染 + AI 推理 |
| 过渡期 | 海光 DCU | ROCm 兼容、迁移成本低 |

> 💡 国产 AI 芯片的核心竞争力不仅在于硬件算力，更在于软件生态的成熟度——CANN 是目前最接近 CUDA 体验的国产软件栈。

## 性能基准测试

| 模型 | 昇腾 910C | A100 | H100 | 说明 |
|------|------|------|------|------|
| Llama-70B 推理 | 45 tok/s | 62 tok/s | 95 tok/s | TP=4 |
| Qwen-72B 推理 | 42 tok/s | 58 tok/s | 90 tok/s | TP=4 |
| ResNet-50 训练 | 92% | 100% | 135% | 相对性能 |
| BERT-Large 推理 | 88% | 100% | 140% | 相对性能 |

## 生产检查清单

1. 确认芯片型号与业务场景匹配
2. 验证 CANN/SDK 版本与驱动兼容
3. 完成目标模型性能基准测试
4. 配置 K8s Device Plugin 和调度策略
5. 建立国产芯片 + NVIDIA 双路线回退机制
6. 监控芯片温度、功耗、利用率
7. 制定驱动升级和固件更新计划
8. 评估多卡互联带宽是否满足并行需求

## 政策与合规

| 政策 | 影响 | 应对 |
|------|------|------|
| 美国出口管制 | 禁运 A100/H100/H200 | 国产替代、存量维护 |
| 信创政策 | 党政/国企优先国产 | 昇腾/寒武纪优先 |
| 数据安全法 | 数据不出境 | 国产芯片本地部署 |
| 算力补贴 | 降低国产芯片采购成本 | 关注地方补贴政策 |

## 互联架构对比

| 互联技术 | 厂商 | 带宽 | 对标 |
|------|------|------|------|
| HCCS | 华为 | 56 GB/s | NVLink |
| MLU-Link | 寒武纪 | 48 GB/s | NVLink |
| PCIe 5.0 | 通用 | 32 GB/s | PCIe |
| RoCE v2 | 通用 | 200 Gbps | InfiniBand |

## 版本兼容性

| CANN 版本 | 昇腾芯片 | MindIE | 状态 |
|------|------|------|------|
| 8.0+ | 910C | 2.0+ | 稳定 |
| 7.0+ | 910B | 1.5+ | 稳定 |
| 6.0+ | 310P | 1.0+ | 维护 |

## 相关概念

- [[概念/ascend-npu|Ascend NPU]] — 华为昇腾处理器
- [[概念/mindie|MindIE]] — 昇腾推理引擎
- [[概念/gpu-sharing|GPU Sharing]] — GPU 共享调度
