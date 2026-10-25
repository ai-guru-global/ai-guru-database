---
title: AI Research Engineer 题库
category: 21-interviews-ai-research-engineer
tags: ["interviews", "career", "research-engineering", "distributed-training", "experiment-reproducibility", "cuda", "model-optimization"]
summary: "AI Research Engineer 面试题库，覆盖分布式训练、CUDA/算子优化、实验复现、训练框架、性能分析与前沿算法实现，含难度与频率标注。"
created: 2026-07-23
updated: 2026-07-23
tier: supporting
sources: []
name_zh: "AI Research Engineer 题库"
---

# AI Research Engineer 题库

> 中文简称：AI Research Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## 深度学习与算法基础 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 手推反向传播算法，解释计算图和自动微分的原理 | ⭐⭐ | 🔴 |
| 2 | Attention 的多种变体（MHA/MQA/GQA/MLA）区别及显存/速度权衡？ | ⭐⭐⭐ | 🔴 |
| 3 | RoPE 旋转位置编码的数学推导，为什么支持长度外推？ | ⭐⭐⭐ | 🟡 |
| 4 | SwiGLU / GeGLU 激活函数相比 ReLU/GELU 的改进？ | ⭐⭐ | 🟡 |
| 5 | LayerNorm vs RMSNorm 的区别？为什么现代 LLM 用 RMSNorm？ | ⭐⭐ | 🟡 |
| 6 | 解释 Mixture of Experts（MoE）的路由机制和负载均衡 loss | ⭐⭐⭐ | 🔴 |
| 7 | KV Cache 的显存占用如何计算？为什么长上下文是瓶颈？ | ⭐⭐⭐ | 🔴 |
| 8 | Flash Attention v1/v2 的核心优化点（tiling/recomputation）？ | ⭐⭐⭐ | 🟡 |

---

## 分布式训练 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 9 | 数据并行（DP/DDP/FSDP/ZeRO）各阶段的区别和显存优化？ | ⭐⭐⭐ | 🔴 |
| 10 | 张量并行（TP）的切分方式（列切/行切），通信发生在哪？ | ⭐⭐⭐ | 🔴 |
| 11 | 流水线并行（PP）的气泡（Bubble）如何计算？1F1B/Interleaved 如何优化？ | ⭐⭐⭐ | 🟡 |
| 12 | 3D 并行（DP+TP+PP）如何组合，各自放在哪一层？ | ⭐⭐⭐ | 🟡 |
| 13 | ZeRO Stage 1/2/3 分别切分什么？显存/通信的权衡？ | ⭐⭐⭐ | 🔴 |
| 14 | AllReduce / AllGather / ReduceScatter 通信原语的语义和耗时？ | ⭐⭐ | 🟡 |
| 15 | 梯度累积（Gradient Accumulation）为什么等效于大 batch？数学证明？ | ⭐⭐ | 🟡 |
| 16 | 混合精度训练（BF16/FP16）的损失缩放（Loss Scaling）为什么需要？ | ⭐⭐ | 🔴 |
| 17 | 大模型训练的 Checkpoint 保存与恢复，如何减少中断损失？ | ⭐⭐⭐ | 🟡 |
| 18 | 训练中断后如何避免 Loss Spike（如学习率重热）？ | ⭐⭐⭐ | 🟢 |

---

## CUDA 与算子优化 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 19 | GPU 编程模型：Grid/Block/Thread/Warp 的层次结构？ | ⭐⭐ | 🔴 |
| 20 | 解释 Coalesced Memory Access，为什么对性能关键？ | ⭐⭐ | 🟡 |
| 21 | Shared Memory 和 Global Memory 的延迟差异？Bank Conflict 是什么？ | ⭐⭐⭐ | 🟡 |
| 22 | 手写一个 CUDA Vector Add 或 Reduce kernel | ⭐⭐ | 🟡 |
| 23 | Triton 语言相比 CUDA C 的优势？如何用 Triton 写 Flash Attention？ | ⭐⭐⭐ | 🟡 |
| 24 | 算子融合（Operator Fusion）为什么减少显存带宽瓶颈？ | ⭐⭐ | 🔴 |
| 25 | 如何用 Nsight Compute / nvprof 分析 kernel 性能瓶颈？ | ⭐⭐ | 🟢 |
| 26 | torch.compile / Inductor 的图捕获和内核生成原理？ | ⭐⭐⭐ | 🟡 |

---

## 训练框架与工程 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 27 | PyTorch DDP 和 FSDP 的区别？何时用哪个？ | ⭐⭐ | 🔴 |
| 28 | Megatron-LM 的 TP+PP 实现要点？ | ⭐⭐⭐ | 🟡 |
| 29 | DeepSpeed 的 ZeRO 和 MoE 训练支持？ | ⭐⭐⭐ | 🟡 |
| 30 | 如何保证实验可复现（随机种子/数据顺序/非确定性算子）？ | ⭐⭐ | 🔴 |
| 31 | 实验管理工具（W&B/MLflow/TensorBoard）如何选型？ | ⭐⭐ | 🟡 |
| 32 | 大规模数据加载的瓶颈（dataloader/预处理）如何优化？ | ⭐⭐ | 🟡 |
| 33 | 训练监控应该关注哪些指标（loss/grad norm/lr/吞吐）？ | ⭐⭐ | 🟡 |
| 34 | 如何 debug 训练不收敛（loss NaN/爆炸/停滞）？ | ⭐⭐⭐ | 🔴 |

---

## 前沿研究实现 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 35 | 如何工程化实现一篇论文（如 LoRA/QLoRA/DPO）的算法？ | ⭐⭐⭐ | 🔴 |
| 36 | RLHF / PPO 训练的工程难点（多模型/显存/稳定性）？ | ⭐⭐⭐ | 🔴 |
| 37 | DPO 相比 PPO 简化了什么？实现上的关键点？ | ⭐⭐⭐ | 🟡 |
| 38 | 扩散模型（Diffusion）训练的工程优化（Classifier-Free Guidance）？ | ⭐⭐⭐ | 🟢 |
| 39 | 长上下文训练（如 YaRN/NTK-aware）如何实现？ | ⭐⭐⭐ | 🟢 |
| 40 | 推理时扩展（Test-time Scaling / o1 类）的工程实现？ | ⭐⭐⭐ | 🟡 |

---

## 行为面试 (5 题)

| # | 问题 | 频率 |
|---|------|------|
| 41 | 描述一次你把论文算法从原型快速复现并优化的经历 | 🔴 |
| 42 | 训练大模型时遇到 loss 异常/NaN，你如何排查和解决？ | 🔴 |
| 43 | 你如何与 Research Scientist 协作（他出 idea 你出实现）？ | 🟡 |
| 44 | 描述一次你通过工程优化把训练速度提升 N 倍的经历 | 🟡 |
| 45 | 如何平衡"快速验证新 idea"和"代码工程质量"？ | 🟡 |

---

## 编程题方向 (5 题)

| # | 方向 | 频率 | 示例 |
|---|------|------|------|
| 46 | 算子实现 | 🔴 | 手写 Flash Attention / Softmax / LayerNorm |
| 47 | 分布式 | 🔴 | 实现一个简单的 AllReduce（Ring） |
| 48 | 框架使用 | 🟡 | 用 FSDP 配置大模型训练 |
| 49 | 性能分析 | 🟡 | 分析并优化一个慢的训练 step |
| 50 | 论文复现 | 🟢 | 复现 LoRA 或 DPO 的核心代码 |

---

*Last updated: 2026-07-23*

## Related

- [[21_面试岗位/AI_Research_Engineer/interview_answers|AI Research Engineer 面试题实例答案]]
- [[21_面试岗位/AI_Research_Engineer/company_level_question_bank|AI Research Engineer 按公司/级别区分的题库]]
- [[21_面试岗位/AI_Research_Engineer/index|AI Research Engineer 首页]]
- [[07_模型训练/index|模型训练]]
- [[03_深度学习/index|深度学习]]
- [[05_大模型/index|大模型]]
- [[21_面试岗位/AI_Research_Scientist/index|AI Research Scientist]]
- [[21_面试岗位/18_面试指南/05_jobs|AI 相关岗位与工种清单]]

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
