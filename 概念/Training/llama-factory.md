---
title: "LLaMA-Factory"
category: -concepts
tags: ["llama-factory", "fine-tuning", "lora", "sft", "training-framework"]
relationships:
  - target: "概念/Training/fine-tuning-techniques"
    type: complements
  - target: "概念/Training/lora-peft"
    type: related_to
  - target: "概念/Training/sft"
    type: related_to
sources:
  - 05_大模型/06_微调技术/
  - 07_模型训练/
summary: "LLaMA-Factory 是最流行的开源 LLM 微调框架之一，统一支持百余种模型的 SFT/LoRA/QLoRA/DPO/PPO 训练，提供 WebUI 零代码微调，是中文社区微调的事实标准工具。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: supporting
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "LLaMA-Factory"
  - "LlamaFactory"
  - "llamafactory"
name_zh: "一站式微调框架"
---
# LLaMA-Factory

> 中文简称：一站式微调框架

> 微调界的"瑞士军刀"：一套配置跑遍主流模型和训练方法。

---

## 1. 定义

**LLaMA-Factory**（hiyouga 开源，ACL 2024）是统一的 LLM 微调框架，核心卖点：

1. **模型覆盖**：Llama/Qwen/DeepSeek/GLM/Gemma 等 100+ 模型开箱即用
2. **方法全**：SFT、LoRA/QLoRA、DPO/KTO/ORPO、PPO、预训练续训
3. **零代码**：`llamafactory-cli webui` 图形界面配置训练
4. **工程集成**：DeepSpeed/FSDP、FlashAttention、vLLM 推理导出

---

## 2. 支持的训练方法矩阵

| 阶段 | 方法 | 显存需求（7B 参考） |
|------|------|---------------------|
| 预训练 | 全参续训 | 8×A100 |
| SFT | 全参 / Freeze / LoRA / QLoRA | 全参 4×80G；QLoRA 单卡 24G |
| 偏好对齐 | DPO / KTO / ORPO / SimPO | LoRA 模式单卡可跑 |
| RLHF | PPO / 奖励模型训练 | 多卡 |

---

## 3. 典型工作流

```bash
# 1. 准备数据（alpaca/sharegpt 格式注册到 dataset_info.json）
# 2. 训练
llamafactory-cli train examples/train_lora/llama3_lora_sft.yaml
# 3. 合并 LoRA 权重
llamafactory-cli export merge_config.yaml
# 4. 部署
llamafactory-cli api / vllm serve
```

---

## 4. 同类工具对比

| 工具 | 定位 | 特点 |
|------|------|------|
| **LLaMA-Factory** | 全能微调平台 | WebUI、模型/方法覆盖最广 |
| **Axolotl** | 英文社区主流 | yaml 配置、社区配方多 |
| **unsloth** | 单卡效率之王 | 手写 kernel，速度 ×2、显存 −70% |
| **TRL** | HuggingFace 官方库 | 底层原语，二次开发友好 |
| **ms-swift** | 魔搭生态 | 国产模型第一时间适配 |

---

## Related

- [[概念/Training/fine-tuning-techniques]] — 微调技术总览
- [[概念/Training/lora-peft]] — LoRA/PEFT
- [[概念/Training/qlora]] — QLoRA
- [[概念/Training/sft]] — SFT
- [[概念/Training/dpo]] — DPO
- [[概念/Training/deepspeed]] — DeepSpeed

> ℹ️ 实践提示：LLaMA-Factory 适合快速验证与中小规模微调；超大规模生产训练仍需 Megatron/DeepSpeed 原生栈。

## 核心知识体系

| 知识层 | 核心内容 | 深度要求 | 学习优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/数学原理/基本定义 | 深入理解并能推导 | P0 |
| 核心方法 | 主流算法/技术路线/框架工具 | 熟练掌握并能应用 | P0 |
| 工程实践 | 系统设计/性能优化/生产部署 | 独立完成项目 | P1 |
| 前沿研究 | 最新论文/技术趋势/开放问题 | 了解并跟踪 | P2 |
| 行业应用 | 落地案例/最佳实践/经验教训 | 参考并借鉴 | P1 |

## 技术路线对比

| 维度 | 经典方法 | 深度学习方法 | 大模型方法 | 选型建议 |
|------|----------|--------------|------------|----------|
| 数据需求 | 少量标注 | 大量标注 | 海量预训练 | 按数据规模 |
| 计算成本 | 低 | 中-高 | 极高 | 按预算约束 |
| 泛化能力 | 有限 | 良好 | 优秀 | 按任务复杂度 |
| 可解释性 | 高 | 低 | 极低 | 按合规要求 |
| 部署难度 | 简单 | 中等 | 复杂 | 按运维能力 |
| 迭代速度 | 快 | 中 | 慢 | 按业务节奏 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门该领域? | 先建立直觉(可视化/类比)，再学数学原理，最后代码实现 |
| 需要哪些前置知识? | 线性代数+概率统计+微积分+Python编程基础 |
| 如何选择学习资源? | 经典教材打基础+顶会论文跟前沿+开源项目练实战 |
| 理论学习和实践如何平衡? | 7:3比例——70%时间理解原理，30%时间动手验证 |
| 如何评估自己的掌握程度? | 能向他人清晰解释+能独立实现+能解决变体问题 |

## 核心术语速查

| 术语 | 含义 | 关联概念 |
|------|------|----------|
| Loss Function | 衡量预测与真实值差距 | 交叉熵/MSE/对比损失 |
| Gradient Descent | 沿负梯度方向更新参数 | SGD/Adam/学习率 |
| Overfitting | 模型在训练集过好但泛化差 | 正则化/Dropout/早停 |
| Batch Size | 每次更新的样本数 | 收敛速度/显存/噪声 |
| Epoch | 完整遍历训练集一次 | 训练轮次/早停 |
| Fine-tuning | 在预训练模型上继续训练 | 迁移学习/LoRA/全量 |
| Inference | 模型前向传播产生输出 | 延迟/吞吐/量化 |
| Token | 文本处理的最小单元 | BPE/SentencePiece |

## 推荐资源

| 类型 | 资源 | 适用阶段 |
|------|------|----------|
| 教材 | 领域经典教材(花书/CS229等) | 入门-基础 |
| 课程 | Stanford/MIT在线课程 | 入门-进阶 |
| 论文 | 顶会最佳论文+综述 | 进阶-精通 |
| 代码 | PyTorch/HuggingFace官方示例 | 基础-实战 |
| 社区 | 技术博客+论文读书会 | 全阶段 |
| 竞赛 | Kaggle/天池/学术竞赛 | 基础-进阶 |

## 检查清单

- [ ] 核心概念能向他人清晰解释
- [ ] 数学原理能独立推导
- [ ] 核心算法能手写实现
- [ ] 主流框架和工具已掌握
- [ ] 完成至少一个端到端项目
- [ ] 能阅读和理解领域论文
- [ ] 了解最新技术趋势和开放问题
- [ ] 知识已文档化沉淀

## 实践操作指南

| 步骤 | 行动 | 工具/方法 | 预期产出 |
|------|------|-----------|----------|
| 1. 学习 | 系统学习核心知识 | 教材/课程/文档 | 知识体系建立 |
| 2. 练习 | 动手实践加深理解 | 实验/项目/练习 | 技能熟练 |
| 3. 应用 | 在实际项目中应用 | 工作项目/开源 | 经验积累 |
| 4. 优化 | 持续改进和优化 | 性能分析/重构 | 质量提升 |
| 5. 分享 | 输出和分享知识 | 博客/演讲/教学 | 影响力建设 |

## 常见误区与正确认知

| 误区 | 正确认知 | 建议 |
|------|----------|------|
| 只学理论不实践 | 实践是检验理解的唯一标准 | 每学一个概念就动手验证 |
| 追求完美再开始 | 完成比完美更重要 | 先做MVP再迭代 |
| 忽视基础知识 | 基础决定上限 | 定期回顾基础 |
| 盲目追新 | 新技术需要验证 | 评估后再采用 |
| 单打独斗 | 协作效率更高 | 积极参与社区 |
