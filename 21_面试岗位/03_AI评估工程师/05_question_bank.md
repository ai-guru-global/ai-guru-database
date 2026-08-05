---
title: AI Evaluation Engineer 题库
category: 21-interviews-ai-evaluation-engineer
tags: ["interviews", "career", "evaluation", "benchmark", "llm-as-judge", "rag-eval", "red-teaming", "metrics"]
summary: "AI Evaluation Engineer 面试题库，覆盖离线/在线指标、Benchmark 选型、LLM-as-Judge、RAG 评测、红队测试与评测平台工程，含难度与频率标注。"
created: 2026-07-23
updated: 2026-07-23
tier: supporting
sources: []
name_zh: "AI Evaluation Engineer 题库"
---

# AI Evaluation Engineer 题库

> 中文简称：AI Evaluation Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## 评测基础理论 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 解释 Accuracy / Precision / Recall / F1 之间的关系，什么场景该用哪个？ | ⭐ | 🔴 |
| 2 | 为什么类别极不平衡时 AUC-ROC 会虚高？PR-AUC 在什么情况下更合适？ | ⭐⭐ | 🔴 |
| 3 | BLEU / ROUGE / METEOR 各自衡量什么？为什么不适合评估开放式生成？ | ⭐⭐ | 🔴 |
| 4 | 解释 BERTScore 的原理，相比 n-gram 指标优势在哪？ | ⭐⭐ | 🟡 |
| 5 | Perplexity 能否反映生成质量？它的局限性是什么？ | ⭐⭐ | 🟡 |
| 6 | 什么是统计显著性（p-value）在评测中的误用？A/B 测试样本量如何计算？ | ⭐⭐ | 🔴 |
| 7 | 离线指标和在线业务指标不一致（Offline-Online Gap）如何解释？ | ⭐⭐⭐ | 🔴 |
| 8 | 解释 Confusion Matrix、Macro-F1 vs Micro-F1 vs Weighted-F1 的区别 | ⭐ | 🟡 |

---

## LLM 评测方法论 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 9 | LLM-as-Judge 的原理是什么？常见的 Position Bias / Verbosity Bias 如何消除？ | ⭐⭐ | 🔴 |
| 10 | Pairwise Comparison 和 Pointwise Scoring 各自的优劣？什么时候用哪个？ | ⭐⭐ | 🟡 |
| 11 | 如何评测一个 LLM 的指令遵循能力（Instruction Following）？IFEval 的设计思路？ | ⭐⭐ | 🟡 |
| 12 | 解释 Arena Elo / Bradley-Terry 模型在 Chatbot Arena 中的应用 | ⭐⭐⭐ | 🟡 |
| 13 | MMLU / GPQA / MATH / HumanEval 各自评估什么能力？覆盖盲区是什么？ | ⭐⭐ | 🔴 |
| 14 | 如何设计一个评测数据集防止 Data Contamination（数据污染）？ | ⭐⭐⭐ | 🔴 |
| 15 | 什么是 Chain-of-Thought 评测？多步推理任务的 Pass@k 指标含义？ | ⭐⭐ | 🟡 |
| 16 | 多语言模型的评测应该注意哪些维度（语言覆盖/文化偏差/低资源语言）？ | ⭐⭐ | 🟢 |
| 17 | 如何评估 LLM 的安全性（Toxicity / Bias / Hallucination）？常用基准有哪些？ | ⭐⭐ | 🔴 |
| 18 | 解释 MCQA（多选题）评测的局限性，为什么需要开放式生成评测？ | ⭐⭐ | 🟡 |

---

## RAG 与 Agent 评测 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 19 | RAG 系统的核心评测维度有哪些（Retrieval / Generation / End-to-End）？ | ⭐⭐ | 🔴 |
| 20 | RAGAS 框架的四个指标（Faithfulness / Answer Relevancy / Context Precision / Context Recall）如何计算？ | ⭐⭐⭐ | 🔴 |
| 21 | 如何评测检索系统的 Recall@k / MRR / NDCG？三者侧重点有何不同？ | ⭐⭐ | 🟡 |
| 22 | Agent 评测的特殊难点是什么（多步/工具调用/环境交互）？AgentBench 的设计？ | ⭐⭐⭐ | 🟡 |
| 23 | 如何评估 Function Calling / Tool Use 的准确性？需要哪些指标？ | ⭐⭐ | 🟡 |
| 24 | 多轮对话评测的挑战是什么？如何构建可信的多轮对话测试集？ | ⭐⭐ | 🟢 |
| 25 | 如何设计一个 RAG 系统的回归测试集，防止版本升级导致退化？ | ⭐⭐⭐ | 🔴 |
| 26 | 评测数据中 Golden Answer 的标注成本高，如何用合成数据降低成本？ | ⭐⭐ | 🟡 |

---

## 评测工程实践 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 27 | 如何设计一个评测平台，支持多模型多数据集的自动化对比？ | ⭐⭐⭐ | 🔴 |
| 28 | 评测结果的可复现性如何保证（Prompt 版本/采样参数/模型版本）？ | ⭐⭐ | 🔴 |
| 29 | 大规模评测的并发和成本如何控制？批量推理 vs 流式推理？ | ⭐⭐ | 🟡 |
| 30 | 如何建立评测质量门禁（Quality Gate），什么阈值阻止发布？ | ⭐⭐⭐ | 🔴 |
| 31 | 解释 Leaderboard Overfitting 现象，如何防止模型被"刷榜"？ | ⭐⭐⭐ | 🟡 |
| 32 | 人工评测（Human Evaluation）的标注一致性（Inter-Annotator Agreement）如何衡量？Cohen's Kappa？ | ⭐⭐ | 🟡 |
| 33 | 如何设计一个 A/B 测试方案，评估 LLM 功能对业务指标的真实影响？ | ⭐⭐⭐ | 🔴 |
| 34 | 评测报告应该包含哪些要素才能让业务方信服？如何可视化？ | ⭐⭐ | 🟢 |

---

## 红队与对抗评测 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 35 | 红队测试（Red Teaming）的目标是什么？与功能测试的区别？ | ⭐⭐ | 🔴 |
| 36 | 常见的越狱（Jailbreak）攻击类型有哪些？如何系统化测试？ | ⭐⭐⭐ | 🔴 |
| 37 | 如何评测模型对 Prompt Injection 的鲁棒性？设计测试用例的思路？ | ⭐⭐⭐ | 🟡 |
| 38 | 对抗样本（Adversarial Examples）在文本/图像中的评测方法差异？ | ⭐⭐ | 🟢 |
| 39 | 如何构建一个自动化红队 Pipeline（GCG / PAIR / 自动化越狱生成）？ | ⭐⭐⭐ | 🟡 |
| 40 | 模型水印（Watermarking）和指纹（Fingerprinting）如何评测其有效性和隐蔽性？ | ⭐⭐ | 🟢 |

---

## 行为面试 (5 题)

| # | 问题 | 频率 |
|---|------|------|
| 41 | 描述一次你设计的评测方案发现了模型严重缺陷的经历 | 🔴 |
| 42 | 当业务方对评测结果有异议（认为模型比指标好），你如何沟通？ | 🔴 |
| 43 | 你如何在有限资源下设计"足够好"的评测方案（vs 完美方案）？ | 🟡 |
| 44 | 描述一次推动团队建立评测规范（评测文化）的经历 | 🟡 |
| 45 | 如何平衡评测的严谨性和快速迭代的需求？ | 🟡 |

---

## 编程题方向 (5 题)

| # | 方向 | 频率 | 示例 |
|---|------|------|------|
| 46 | 指标实现 | 🔴 | 手写 Precision/Recall/F1/BLEU |
| 47 | 评测脚本 | 🔴 | 实现一个支持多模型并发的评测 Runner |
| 48 | RAG 评测 | 🟡 | 用 RAGAS 思路实现 Faithfulness 计算 |
| 49 | LLM-as-Judge | 🟡 | 实现一个去除 Position Bias 的 Judge Prompt |
| 50 | 数据分析 | 🟢 | 用 Pandas 分析评测结果并生成报告 |

---

*Last updated: 2026-07-23*

## Related

- [[21_面试岗位/03_AI评估工程师/04_interview_answers|AI Evaluation Engineer 面试题实例答案]]
- [[21_面试岗位/AI_Evaluation_Engineer/company_level_question_bank|AI Evaluation Engineer 按公司/级别区分的题库]]
- [[21_面试岗位/AI_Evaluation_Engineer/index|AI Evaluation Engineer 首页]]
- [[08_模型评估/index|模型评估]]
- [[09_测试/03_Agent评估/02_Agent_评估_索引|Agent 评测]]
- [[12_架构基建/01_架构基础/05_llm_infrastructure_system_design|AI 系统设计面试]]
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
