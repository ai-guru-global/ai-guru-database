---
title: AI 研究者路径
category: 90-learn-pathways
tags: ["learning", "education", "courses", "study-path"]
summary: "> **面向：想做 AI 研究、读论文、理解前沿理论 | 前置要求：数学基础（线代+概率）+ 编程 | 预计时间：80+ 小时**"
created: 2026-05-31
updated: 2026-05-31
---

# AI 研究者路径

> **面向：想做 AI 研究、读论文、理解前沿理论 | 前置要求：数学基础（线代+概率）+ 编程 | 预计时间：80+ 小时**

从理论基础到前沿论文，构建完整的 AI 研究能力。学完后你能：读懂顶级 AI 论文、复现实验、理解创新点、提出自己的研究想法。

---

## 路径概况

| 属性 | 值 |
|------|---|
| 目标人群 | CS/统计/数学背景的学生，或想深入理解 AI 原理的工程师 |
| 前置要求 | 线性代数、概率统计、Python 编程 |
| 预计时间 | 80+ 小时（每天 3-4 小时，约 2-3 个月） |
| 核心产出 | 论文阅读能力、研究问题发现能力、实验设计与复现能力 |
| 适合你如果…… | 想申 AI PhD / 做 AI 研究工程师 / 在工作中做前沿技术调研 |

---

## 完整路线图

```
Phase 1: 数学与理论基础（深入）
Phase 2: 经典 ML / DL 理论
Phase 3: Transformer 深度
Phase 4: LLM 前沿（预训练 / 对齐 / 架构）
Phase 5: 论文阅读与研究实践
Phase 6: 前沿专题（多模态 / Agent / 世界模型）
```

---

## 学习阶段

### Phase 1: 数学与理论基础（第 1-2 周，深入）

**🎯 目标**：建立扎实的数学基础，能读懂论文中的公式推导。

**📚 核心概念**：[Stage 1: 基础概念 — 数学相关部分](../_concepts/stage1-foundation.md)

**🔗 深入阅读**：
- [线性代数（小白版）](../../01_Fundamentals/Linear_Algebra/Linear_Algebra_for_dummy.md) + 完整版
- [概率统计（小白版）](../../01_Fundamentals/Probability_Statistics/Probability_Statistics_for_dummy.md) + 完整版
- [优化（小白版）](../../03_Deep_Learning/Optimization/Optimization_for_dummy.md)

**💡 研究者重点**：
- 矩阵分解（SVD）与表示学习的关系
- KL 散度、JS 散度 → 变分推断、VAE
- 拉格朗日乘数法与约束优化 → 对偶问题、SVM
- 信息论基础：熵、互信息、Rate-Distortion Theory
- 优化理论：收敛速度分析、Adam 的理论基础

**✅ 学会标志**：
- 能推导反向传播的梯度公式
- 能理解 KL 散度在 VAE 和 RLHF 中的作用
- 能读懂论文中的矩阵运算推导

---

### Phase 2: 经典 ML / DL 理论（第 2-4 周）

**🎯 目标**：深入理解经典 ML/DL 的理论基础，不只是会用，要理解为什么。

**📚 核心概念**：[Stage 1 + Stage 2 基础](../_concepts/stage1-foundation.md) + [Stage 2 核心技术](../_concepts/stage2-core-tech.md)

**🔗 深入阅读**（完整版，非 _for_dummy）：
- [监督学习（完整版）](../../02_Machine_Learning/Supervised_Learning/Supervised_Learning.md)
- [无监督学习（完整版）](../../02_Machine_Learning/Unsupervised_Learning/Unsupervised_Learning.md)
- [神经网络核心（完整版）](../../03_Deep_Learning/Neural_Network_Core/Neural_Network_Core.md)
- [优化（完整版）](../../03_Deep_Learning/Optimization/Optimization.md)

**💡 理论重点**：
- VC 维数与泛化理论
- 贝叶斯视角下的机器学习
- 信息瓶颈理论 (Information Bottleneck)
- 神经网络损失景观 (Loss Landscape) 与泛化
- Lottery Ticket Hypothesis

**💡 动手实践**：
- 从零实现一个 PyTorch 训练框架（加深理解）
- 分析不同初始化方法对训练的影响
- 用 wandb / mlflow 分析训练曲线

**✅ 学会标志**：
- 能解释正则化的信息论/贝叶斯解释
- 能分析训练曲线的过拟合/欠拟合/泛化问题
- 理解 VC 维数和泛化上界的关系

---

### Phase 3: Transformer 深度（第 4-5 周）

**🎯 目标**：彻底理解 Transformer 的每一处细节，能自己实现一个简化版本。

**📚 核心概念**：[Stage 2: 核心技术 — Transformer / Attention 部分](../_concepts/stage2-core-tech.md)

**🔗 深入阅读**：
- [Transformer 革命（小白版）](../../05_NLP_LLMs/Transformer_Revolution/Transformer_Revolution_for_dummy.md)
- [LLM 架构（完整版）](../../05_NLP_LLMs/LLM_Architectures/LLM_Architectures_for_dummy.md)
- 原始论文：[Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762)

**💡 Transformer 理论重点**：
- Self-Attention 的数学推导（为什么用点积、为什么除 √d）
- 多头注意力的表示能力分析
- 位置编码：Sinusoidal vs Rotary (RoPE) vs ALiBi
- Layer Norm vs Batch Norm：在 Transformer 中的选择
- Flash Attention 的理论动机
- 混合专家 (MoE) 的扩展性分析

**💡 动手实践**：
- 从零实现一个 Transformer（参考 Andrej Karpathy 的 minGPT）
- 实现 Multi-Head Attention 的手写版本
- 对比不同位置编码的效果

**✅ 学会标志**：
- 能从零实现一个完整的 Transformer 训练流程
- 能解释 RoPE 和 ALiBi 的设计动机
- 能分析注意力可视化，理解模型在"关注"什么

---

### Phase 4: LLM 前沿理论（第 5-7 周）

**🎯 目标**：深入理解 LLM 的训练和对齐技术，掌握前沿研究方向。

**📚 核心概念**：[Stage 2 LLM 部分](../_concepts/stage2-core-tech.md) + [Stage 4 前沿部分](../_concepts/stage4-frontier.md)

**🔗 必读论文**：

| 主题 | 关键论文 |
|------|---------|
| GPT 系列 | GPT-1/2/3/4、InstructGPT |
| Scaling Law | [Scaling Laws for Neural Language Models (Kaplan et al.)](https://arxiv.org/abs/2001.08361) |
| LLM 对齐 | [InstructGPT (RLHF)](https://arxiv.org/abs/2203.02155)、[Constitutional AI](https://arxiv.org/abs/2212.08073) |
| PEFT / LoRA | [LoRA](https://arxiv.org/abs/2106.09685)、[QLoRA](https://arxiv.org/abs/2305.14314) |
| GPT-4 分析 | [Sparks of AGI](https://arxiv.org/abs/2303.12712) |
| MoE | [Mixtral of Experts](https://arxiv.org/abs/2401.04088) |
| Scaling Law 新方向 | [ emergent abilities](https://arxiv.org/abs/2206.11176)、[scaling doesn't plateau](https://arxiv.org/abs/2304.15012) |

**🔗 深入阅读**：
- [微调技术（小白版）](../../05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy.md)
- [价值对齐（小白版）](../../17_Ethics_Safety/Value_Alignment/Value_Alignment_for_dummy.md)
- [AI 安全与红队（小白版）](../../17_Ethics_Safety/AI_Safety_RedTeaming/AI_Safety_RedTeaming_for_dummy.md)
- [Scaling Law 与后 Scaling 时代](../_concepts/stage4-frontier.md)（Stage 4 中的 Scaling Law 部分）

**✅ 学会标志**：
- 能解释 RLHF 的完整流程和每一步的作用
- 能对比 LoRA / QLoRA / 全参数微调的优劣
- 能解释为什么会出现涌现能力
- 能讨论 Scaling Law 的局限和后 Scaling 时代的方向

---

### Phase 5: 论文阅读与研究实践（第 6-8 周）

**🎯 目标**：建立系统性的论文阅读方法论，能独立做文献调研。

**📚 核心概念**：综合 Stage 2-4

**🔗 阅读论文库**：[10_Papers/](../../10_Papers/README.md) 中的核心论文

**💡 论文阅读方法**：
```
第一步（5分钟）：读标题、摘要、图表 → 判断是否相关
第二步（20分钟）：读引言 + 看图 → 理解研究动机和核心贡献
第三步（1小时）：读方法 + 公式 → 理解技术细节
第四步（30分钟）：读实验 → 验证假设是否被充分验证
第五步（30分钟）：读相关工作 → 定位论文在领域中的位置
```

**💡 顶级会议与期刊**：
- **NLP/AI**: ACL, EMNLP, NeurIPS, ICML, ICLR
- **CV**: CVPR, ICCV, ECCV
- **ML**: NeurIPS, ICML, ICLR
- **2026 值得关注**: 多模态、Agent 基准、AI Safety 测试

**💡 动手实践**：
- 每周精读 2 篇论文，写 paper summary
- 复现一篇论文的核心实验（用开源代码）
- 写一个领域调研报告（如"RAG 的最新进展"）

**✅ 学会标志**：
- 能在 30 分钟内判断一篇论文的核心价值
- 能独立复现一篇论文的实验
- 能写出结构清晰的论文笔记和总结

---

### Phase 6: 前沿专题（第 8-10 周）

**🎯 目标**：深入当前最前沿的研究方向，形成自己的研究视野。

**📚 核心概念**：[Stage 4: 前沿探索](../_concepts/stage4-frontier.md)

**🔗 2026 前沿专题**：

**专题 A: 世界模型与 JEPA**
- [世界模型（2026）](../../03_Deep_Learning/World_Models/World_Models_2026.md)
- 核心论文：V-JEPA、GAIA-1、World Models Survey

**专题 B: VLA 与具身智能**
- [机器人与具身智能（2026）](../../06_Reinforcement_Learning/Robotics_Embodied_AI/Robotics_Embodied_AI_2026.md)
- 核心论文：RT-2、OpenVLA、Figure AI 相关工作

**专题 C: AI Safety 与对齐**
- [AI 安全红队（小白版）](../../17_Ethics_Safety/AI_Safety_RedTeaming/AI_Safety_RedTeaming_for_dummy.md)
- 核心论文：Mechanistic Interpretability Survey、ARC Prize

**专题 D: Agent 评估**
- [Agent 评估框架](../../15_Agent_Production/Agent_Evaluation/README.md)
- 核心论文：RAPS 模型、AgentBench、GAIA Benchmark

**✅ 学会标志**：
- 能对某个前沿方向做系统性的文献综述
- 能发现该方向的 open problems
- 能提出有价值的 research questions

---

## 里程碑自测

完成本路径后，请回顾 [milestones.md](../milestones.md) 中的所有自测题。同时检查：
- [ ] 能阅读并理解 NeurIPS / ICLR / ACL 的论文
- [ ] 能复现至少 2 篇论文的实验
- [ ] 对某个前沿方向有深入理解，能提出 research ideas
- [ ] 建立了论文追踪和笔记体系

## 下一步推荐

| 你的打算 | 推荐去向 |
|---------|---------|
| 申请 PhD | 联系目标导师，准备研究提案 (Research Proposal) |
| 做 AI 研究工程师 | 投递 AI Lab (OpenAI/DeepMind/Anthropic/字节/清华叉院等) |
| 继续深入 | 关注 [AI 面试指南 — Research Scientist](../../11_Interviews/Research_Scientist/) |

---

*本路径建议配合 [AI 概念知识图谱](../../91_Notes/AI_Concept_Knowledge_Graph.md) 使用，帮助理解概念间的依赖关系。*

## Related

- [[90_Learn/guides/milestones]] — 里程碑自测 (共享: courses, education, learning, study-path)
- [[90_Learn/pathways/absolute-beginner]] — 零基础通识路径 (共享: courses, education, learning, study-path)
- [[90_Learn/pathways/java-developer]] — Java 开发者 AI 路径 (共享: courses, education, learning, study-path)
- [[90_Learn/pathways/llm-engineer]] — LLM 工程师路径 (共享: courses, education, learning, study-path)
