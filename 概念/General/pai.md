---
title: "PAI"
category: -concepts
tags: ["alibaba-cloud", "pai", "machine-learning", "llm", "training", "inference", "alibaba-cloud"]
summary: "PAI（Platform of Artificial Intelligence）是阿里云一站式人工智能平台，提供模型开发、训练、部署、推理全链路能力，包括 PAI-DSW、PAI-DLC、PAI-EAS 等核心产品。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "Platform of Artificial Intelligence"
  - "阿里云 PAI"
  - "阿里云人工智能平台"
relationships:
  - target: "概念/alibaba-cloud"
    type: part_of
  - target: "概念/ack"
    type: runs_on
  - target: "概念/mlops"
    type: related_to
sources: []
---

# PAI

> **一句话理解**: PAI 是阿里云上一站式 AI 平台，从写代码的 Notebook（DSW）、跑训练任务（DLC）到部署推理服务（EAS），全链路覆盖。

## 核心要点

- **PAI-DSW**: 交互式开发环境（Notebook），支持 GPU/CPU 实例。
- **PAI-DLC**: 深度学习训练集群，支持分布式训练、超参调优。
- **PAI-EAS**: 弹性推理服务，支持模型在线部署、自动扩缩容、A/B 测试。
- **PAI-Designer**: 可视化建模与拖拽式流水线。
- **PAI-FeatureStore**: 特征平台。
- **与 ACK 集成**: PAI-DLC/EAS 底层可运行在 ACK 容器集群上。

## 产品矩阵

| 产品 | 能力 | 典型场景 |
|------|------|---------|
| PAI-DSW | Notebook 开发 | 模型调试、数据分析 |
| PAI-DLC | 分布式训练 | LLM 预训练、微调 |
| PAI-EAS | 在线推理 | LLM 服务、A/B 测试 |
| PAI-Designer | 可视化建模 | 传统 ML 建模 |
| PAI-FeatureStore | 特征管理 | 推荐系统 |

## 阿里云专有云关联

在阿里云专有云环境中，PAI 提供私有化部署版本，底层依赖 ACK 专有/敏捷版、飞天 Apsara、洛神 Luoshen、盘古 Pangu。工单中「PAI 任务失败」通常需要同时查看 PAI 控制台日志和底层 ACK Pod 事件。

## Related

- [[概念/alibaba-cloud|Alibaba Cloud]]
- [[概念/ack|ACK]]
- [[概念/mlops|MLOps]]
- [[12_架构基建/06_Cloud_Providers/Alibaba_PAI_Deep_Dive|阿里云 PAI 深度解析]]
- [[12_架构基建/Alibaba_Cloud_Proprietary_K8s_Context|阿里云专有云 K8s 上下文]]

---

## 2026 PAI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **PAI-Designer** | 可视化建模 | GA |
| **PAI-DSW** | Notebook 开发 | GA |
| **PAI-DLC** | 分布式训练 | GA |
| **PAI-EAS** | 模型推理服务 | GA |
| **PAI-Blade** | 推理优化 | GA |

## 生产最佳实践

1. **可视化建模**：快速原型用 PAI-Designer
2. **Notebook 开发**：探索性分析用 PAI-DSW
3. **分布式训练**：大模型训练用 PAI-DLC
4. **推理服务**：模型部署用 PAI-EAS
5. **推理优化**：推理加速用 PAI-Blade

## PAI 架构分层

| 层级 | 组件 | 说明 |
|------|------|------|
| 开发层 | PAI-DSW | Notebook 开发环境 |
| 训练层 | PAI-DLC | 分布式训练集群 |
| 推理层 | PAI-EAS | 弹性推理服务 |
| 优化层 | PAI-Blade | 推理加速引擎 |
| 建模层 | PAI-Designer | 可视化建模 |
| 特征层 | PAI-FeatureStore | 特征平台 |
| 底座层 | ACK + GPU | 容器 + 算力 |

## 配置示例

```yaml
# PAI-DLC 训练任务配置
apiVersion: pai.alibaba.com/v1
kind: DLCJob
metadata:
  name: qwen-finetune
spec:
  framework: PyTorch
  workerCount: 4
  workerSpec:
    gpu: 8
    gpuType: A100
    memory: 512Gi
  command:
    - torchrun --nproc_per_node=8 train.py
      --model Qwen-72B
      --data /mnt/oss/train-data
      --output /mnt/oss/checkpoints
  dataSource:
    - type: OSS
      path: oss://bucket/train-data
      mountPath: /mnt/oss
```

## 与其他平台对比

| 维度 | PAI | SageMaker | Vertex AI | Azure ML |
|------|------|------|------|------|
| Notebook | DSW | Studio | Workbench | Notebook |
| 训练 | DLC | Training | Training | Compute |
| 推理 | EAS | Endpoint | Prediction | Endpoint |
| 优化 | Blade | Neo | 无 | 无 |
| 国产芯片 | 昇腾 | 无 | TPU | 无 |
| 专有云 | Apsara | Outposts | Anthos | Stack |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| DLC 任务失败 | GPU OOM | 减小 batch size/开启梯度累积 |
| EAS 延迟高 | 实例数不足 | 增加副本/开启自动扩缩 |
| DSW 无法启动 | 资源配额不足 | 申请配额/换可用区 |
| 模型加载失败 | 格式不兼容 | 检查模型格式和框架版本 |
| OSS 读取慢 | 跨地域访问 | 使用同地域 OSS |

## 相关概念

- [[概念/alibaba-cloud|Alibaba Cloud]] — 阿里云平台
- [[概念/ack|ACK]] — 容器服务底座
- [[概念/mlops|MLOps]] — ML 运维体系
- [[概念/model-deployment|Model Deployment]] — 模型部署

> 💡 PAI 的核心价值是将 AI 开发全链路（开发→训练→优化→部署）封装为统一平台，降低 AI 工程化门槛。

## 生产检查清单

1. 确认 GPU 类型和数量与任务匹配
2. 配置 OSS 数据源和模型输出路径
3. 设置任务超时和失败重试策略
4. 配置 EAS 自动扩缩容规则
5. 开启训练任务日志和指标监控
6. 配置模型版本管理和回滚机制
7. 设置资源配额和费用告警
8. 建立 A/B 测试和金丝雀发布流程

## 版本兼容性

| 组件 | 版本 | 状态 |
|------|------|------|
| PAI-DSW | 2.0+ | GA |
| PAI-DLC | 2.0+ | GA |
| PAI-EAS | 2.0+ | GA |
| PAI-Blade | 1.5+ | GA |
| PyTorch | 2.0+ | 支持 |
| CUDA | 12.x | 支持 |

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| PAI 官方文档 | 文档 | 产品使用指南 |
| PAI 最佳实践 | 博客 | 场景化教程 |
| 天池实验室 | 平台 | 免费 GPU 实验 |
| PAI SDK | 工具 | Python SDK |

## 总结

PAI 是阿里云一站式 AI 平台，覆盖从 Notebook 开发、分布式训练、推理优化到模型部署的全链路。其核心优势在于与阿里云生态深度集成（ACK、OSS、SLS）和国产化芯片支持（昇腾）。

> 💡 选择 PAI 的三大理由：全链路覆盖、阿里云生态集成、国产芯片支持。

## 常用命令

| 命令 | 说明 |
|------|------|
| `pai -name pytorch_job` | 提交训练任务 |
| `eascmd create service.json` | 创建推理服务 |
| `eascmd scale <service> --replicas 3` | 扩容推理服务 |
| `dsw list` | 查看 Notebook 实例 |
| `blade optimize --model <path>` | 推理优化 |

## 总结

PAI 是阿里云一站式 AI 平台，覆盖从 Notebook 开发、分布式训练、推理优化到模型部署的全链路。其核心优势在于与阿里云生态深度集成和国产化芯片支持。

> 💡 PAI 的核心价值是将 AI 开发全链路封装为统一平台，降低 AI 工程化门槛。

## 相关概念

- [[概念/alibaba-cloud|Alibaba Cloud]] — 阿里云平台
- [[概念/ack|ACK]] — 容器服务底座
- [[概念/mlops|MLOps]] — ML 运维体系
