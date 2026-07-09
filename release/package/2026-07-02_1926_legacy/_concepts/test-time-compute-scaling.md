---
title: Test-Time Compute Scaling
category: -concepts
tags:
  - nlp
  - llm
  - reasoning
  - test-time-compute
  - scaling
  - inference
  - production
summary: "测试时计算扩展（Test-Time Compute Scaling）是一种在推理阶段动态投入更多计算资源（更多 token、多路径采样、验证与反思）以提升输出质量的系统工程方法，让小模型在复杂任务上逼近甚至超越大模型的表现。"
created: 2026-07-02
updated: 2026-07-02
tier: concept
aliases:
  - "Test-Time Compute Scaling"
  - "测试时计算扩展"
  - "推理时计算扩展"
---

# Test-Time Compute Scaling / 测试时计算扩展

> **一句话定义**：测试时计算扩展是在**推理阶段**通过增加采样次数、延长思维链、引入验证器等手段动态分配计算预算，使模型在特定任务上获得更高质量的输出，而不必重新训练模型或扩大模型参数。

## 核心要点

1. **从"训练 scaling"转向"推理 scaling"**
传统大模型能力提升依赖更大参数、更多数据、更长训练。TTC Scaling 的核心洞察是：许多复杂任务（数学、代码、逻辑推理）在推理时投入更多计算，可以用 7B/32B 小模型逼近甚至超越 70B+ 大模型的准确率，成本结构从训练一次性投入转向推理按请求付费。

2. **三类扩展范式互补**
- **并行扩展**：Self-Consistency、Best-of-N、Tree-of-Thoughts，用多候选加投票或验证器选优；
- **串行扩展**：Chain-of-Thought、Self-Reflection、Iterative Refinement，用多轮思考逐步修正；
- **自适应扩展**：先估计问题难度，再动态分配采样数、推理 token 预算和验证轮数，避免简单问题过度计算。

3. **验证信号决定上限**
Best-of-N 和搜索策略的效果严重依赖验证器质量。结果奖励模型（ORM）适合可自动判定答案的任务；过程奖励模型（PRM）能在多步推理中定位错误路径，是 o1/o3、DeepSeek-R1 等推理模型取得突破的关键。

4. **成本-延迟-质量三角权衡**
TTC Scaling 引入新的生产决策：简单问题单次推理快速响应，复杂问题多采样加验证保证质量，中等难度任务使用小模型加自适应扩展控制成本。没有统一最优策略，必须按任务特征、SLA 和预算动态选择。

## 生产环境意义

在企业级 AI 落地中，TTC Scaling 直接改变三件事情：

- **成本结构再平衡**：把部分能力从"买更大的模型"转移到"让小模型多想一想"，在代码生成、数据审核、合规检查等高价值任务上显著降低单位请求成本。
- **质量可扩展**：对错误成本高的任务（医疗辅助诊断、金融风控、代码安全审计），通过多路径验证和过程监督提升可靠性。
- **服务能力弹性化**：根据用户问题难度和当前负载动态调整计算预算，实现"同一接口、不同深度"的分层服务。

## 相关技术与框架

- **推理模型**：[[_concepts/reasoning-models|推理模型]] 将 TTC Scaling 内化为模型能力，典型代表 OpenAI o3、DeepSeek-R1、Claude 4 Thinking。
- **Prompt 技巧**：[[_concepts/cot-react-reasoning-prompt|CoT / ReAct / ToT]] 在不动参数的情况下激活推理能力，常与 TTC Scaling 的并行/串行策略叠加使用。
- **推理引擎**：vLLM、SGLang、TGI 提供 in-batch 并行采样、前缀缓存、KV Cache 共享，是工程降本的核心。
- **训练框架**：TRL、OpenRLHF、verl 用于训练 ORM/PRM 和推理模型；GRPO 算法在 DeepSeek-R1 中广泛应用。
- **评估与路由**：RAGAS、OpenAI Evals、LiteLLM/Portkey 网关帮助评测扩展策略效果并实现混合路由。

## 典型误区

- **误区一："推理越长越好"**。实际上超过一定预算后收益递减，必须配合 Early Stopping 和难度估计避免浪费。
- **误区二："TTC Scaling 适合所有任务"**。开放域闲聊、简单分类、实时客服等低复杂度或延迟敏感任务并不受益，强行扩展只会增加成本和延迟。
- **误区三："有了推理模型就不需要验证器"**。即便 o1/R1 这类内置长 CoT 的模型，在可验证任务上叠加外部验证器仍能进一步提升准确率与可控性。
- **误区四："小模型加扩展一定能替代大模型"**。验证器质量、任务可验证性和问题难度分布共同决定收益，需以基线实验为依据。

## 推荐阅读

- [[大模型/Test_Time_Compute_Scaling_2026|Test-Time Compute Scaling 2026: 推理时计算扩展的生产实践]] — 最完整的技术与生产落地指南
- [[大模型/LLM_Production_Deployment_Runbook|LLM 生产部署 Runbook]] — 推理服务的部署、监控与容量规划
- [[_concepts/reasoning-models|推理模型]] — o1/o3/R1 等推理模型的核心原理
- [[_concepts/cot-react-reasoning-prompt|CoT / ReAct / ToT — 推理时 Prompt 技巧]] — 不动参数的推理增强方法
- [[强化学习/GRPO_Training_Deep_Dive|GRPO 训练深度指南]] — DeepSeek-R1 背后的强化学习训练方法
- [[模型训练/Training_Cost_Optimization_and_FinOps_2026|训练成本优化与 FinOps 2026]] — AI 成本治理框架
- [[模型评估/LLM_Evaluation_2026|LLM 评测 2026]] — 如何评测 TTC Scaling 的效果
- [[架构基建/AI_SRE_Runbook|AI SRE Runbook]] — AI 系统的可靠性运维
- [[Agent/Agent_Production_Deployment_Runbook|Agent 生产部署 Runbook]] — Agent 场景下的推理扩展与部署
