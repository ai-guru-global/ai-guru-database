---
title: 测试时计算扩展(Test-Time Compute Scaling)
category: concepts
tags:
  - llm
  - test-time-compute
  - reasoning
  - o1
  - r1
  - inference
aliases:
  - Test-Time Compute Scaling
  - 推理时计算扩展
  - Inference Compute
  - Inference-Time Scaling
relationships:
  - target: "概念/chinchilla-scaling-laws"
    type: related_to
  - target: "概念/emergent-abilities"
    type: related_to
  - target: "概念/reasoning-models"
    type: evolves_from
  - target: "概念/cot-react-reasoning-prompt"
    type: related_to
summary: 测试时计算扩展(Test-Time Compute Scaling, Snell et al. 2024 arXiv:2408.03314)指**不增加模型参数,在推理时多花算力**(Best-of-N / Beam Search / Lookahead)以提升表现,1B Llama 配足够推理算力可击败 70B。OpenAI o1 / o3 与 DeepSeek-R1 把它推到工业高峰,2024-2026 已成为 reasoning LLM 的**第四范式**(继 pre-training、fine-tuning、RLHF 之后)。HuggingFace 已开源 DVTS 复现,验证器存在是 scaling 成功的关键。
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources:
  - Snell et al. 2024 arXiv:2408.03314
  - OpenAI o1 Learning to Reason Blog
  - DeepSeek-R1 arXiv:2501.12948
  - OpenAI o3 System Card
  - HuggingFace open DVTS
  - Lightman Let's Verify Step by Step
  - Wei et al. 2022 CoT
---

# 测试时计算扩展(Test-Time Compute Scaling)

## 一句话总结

**Test-Time Compute Scaling**(测试时计算扩展)指**不增加模型参数,在推理时多花算力**以提升表现;Snell et al. 2024 证明小模型 + 足够推理算力可击败大 14× 的模型。OpenAI o1/o3 与 DeepSeek-R1 把它推到工业高峰,**1B/3B 模型长思考后超越 70B**,2024-2026 已成为 reasoning LLM 的**第四范式**(继 pre-training、fine-tuning、RLHF 之后)。核心机制:**搜索 + 验证器(PRM) + 长 CoT**。

---

## 1. 形式化定义

> **"在不改变模型权重的前提下,通过增加推理时的计算量(token 数 / 采样数 / 搜索树深度)来提高输出质量。"**

### 1.1 与 Scaling 的对比

| 维度 | Train-time Scaling | Test-time Scaling |
|---|---|---|
| **调整对象** | 模型参数 N、训练数据 D、算力 C | 推理时 token 数、采样数、搜索深度 |
| **代表论文** | Chinchilla 2022 | Snell et al. 2024 |
| **代表模型** | LLaMA-3 405B、Qwen-2.5 72B | OpenAI o1/o3、DeepSeek-R1、QwQ |
| **成本特征** | 一次性大开销,后续推理便宜 | 每个 query 持续算力,边际成本高 |
| **核心机制** | 数据 + 参数 | 搜索 + 验证 + 长 CoT |

### 1.2 数学直觉

设单次采样正确率 p = 0.7,独立 N 次投票:

$$
P_{\text{vote}}(N=5) \approx 83\%, \quad P_{\text{vote}}(N=10) \approx 90\%
$$

> 关键洞察:**LLM 单次解码是"近似推理",多采样更接近真实分布峰值**;长 CoT 把"短跳跃"变成"分步验证"。

---

## 2. 四大主流方法(2024 分类)

### 2.1 Best-of-N(采样 + 评分)

```text
1. 对同一 query 采样 N 个完整答案
2. 用 Outcome Reward Model(ORM)或 Process Reward Model(PRM)评分
3. 选最高分
```

- **变体**:Self-Consistency(多数投票,无需 RM)
- **优势**:实现简单,质量上限高
- **劣势**:N 翻倍,成本翻倍

### 2.2 Beam Search(逐步搜索 + PRM 评分)

```text
1. 每步生成 N 个候选 token
2. 用 PRM 评当前步骤的概率
3. 选 top-M 继续扩展
4. 重复直到 EOS 或最大深度
```

- **优势**:在中等-高难度问题上一致优于 Best-of-N
- **劣势**:单步被高分"压塌" → 缺多样性

### 2.3 Lookahead Search(预演)

```text
在 Beam Search 每步:
  不是直接用 PRM 评分
  而是模拟"前看 k 步"再评分
```

- **优势**:评分更准
- **劣势**:k 倍额外开销,实际常输给 Best-of-N

### 2.4 DVTS(Diversity Verifier Tree Search, HuggingFace 2024)

```text
1. 把初始 beam 拆为 N/M 个独立子树
2. 每个子树用 PRM 贪婪扩展
3. 多样性最大,适合大 N
```

- **优势**:N 较大时(64-256)显著优于 Beam Search
- **劣势**:小 N 时无优势

---

## 3. Snell et al. 2024 核心发现

### 3.1 Compute-Optimal Inference

> **针对不同难度问题,选择不同搜索策略**——硬问题用 Beam Search,简单问题用 Best-of-N。

**核心结论**:

| 发现 | 数字 |
|---|---|
| **小模型 + 推理算力可击败大模型** | PaLM 2-S 小模型在 MATH 上匹配 PaLM 2-L 大模型 |
| **4× 效率提升** | 相比 baseline 方法,compute-optimal 策略用同等算力提升 4× |
| **Scaling 边界** | 验证器(PRM)存在时 scaling 有效;无验证器则 sub-optimal(arXiv:2502.12118) |
| **配比策略** | 简单问题:Best-of-N;中等:Beam Search;困难:DVTS / MCTS |

### 3.2 验证器至关重要

| 方法 | 验证器存在? | Scaling 效果 |
|---|---|---|
| **Best-of-N + PRM** | ✅ | ✅ 持续提升 |
| **Beam Search + PRM** | ✅ | ✅ 显著提升 |
| **纯多数投票** | ❌ | ⚠️ 边际收益快速饱和 |
| **无验证器纯 SFT 蒸馏长 CoT** | ❌ | ❌ 持续被有验证器方法拉开(arXiv:2502.12118) |

---

## 4. 工业落地:OpenAI o1/o3 与 DeepSeek-R1

### 4.1 OpenAI o1(2024-09 发布)

| 指标 | GPT-4o | o1 | o3(2024-12) |
|---|---|---|---|
| **AIME 2024** | 13.4% | **83.3%** | **96.7%** |
| **Codeforces 排名** | 11% | **89%** | 99.8%(Elo 2700+) |
| **GPQA Diamond(博士科学题)** | 56% | **78%** | **88%** |
| **训练范式** | 预训练 + RLHF | 预训练 + **大规模 RL + 长 CoT** | 同左,**search + verifier 强化** |
| **推理时 token** | 数百 | **数千-数万** | 数万-数十万 |
| **可观察 CoT** | 否 | **是(经压缩)** | 是 |

> **OpenAI 原话**:"o1 的推理性能随计算资源增加和训练时间延长**持续提升**"——这是 Test-Time Scaling 的工业宣言。

### 4.2 DeepSeek-R1(2025-01)

- 完全开源,**R1 + R1-Zero + 6 个蒸馏模型**(1.5B-70B)
- **R1-Zero** 纯 RL(无 SFT)涌现长 CoT,自我反思
- **蒸馏 1.5B** 在 MATH-500 上 82.8%,**AIME 28.8%**,与 o1-mini 持平
- HuggingFace 验证:**1B/3B Llama 长思考后击败 8B/70B**

### 4.3 其他代表

| 模型 | 团队 | 关键贡献 |
|---|---|---|
| **QwQ-32B-Preview** | 阿里 | 开源 reasoning SOTA |
| **Claude 3.7 Sonnet Extended** | Anthropic | "可调"推理预算 |
| **Gemini 2.0 Thinking** | Google | 多模态 reasoning |
| **M1(Linear RNN)** | TogetherAI/Cornell | Mamba 架构 + 3× 推理速度 |
| **s1** | Stanford | 1000 个样本 SFT 出 reasoning |

---

## 5. 与相关范式的关系

```
Pre-training  →  Fine-tuning  →  RLHF  →  Test-Time Compute
   (Chinchilla)   (SFT/LoRA)    (Ouyang 22)  (Snell 24 / o1 / R1)
```

| 关系 | 说明 |
|---|---|
| **Test-time scaling ≠ 长 CoT** | 长 CoT 是触发机制,真正起作用的是"搜索 + 验证" |
| **Test-time scaling ≠ RL** | 训练时 RL(GRPO) 教模型"会思考",推理时搜索让"想得对" |
| **Test-time scaling 替代部分 scaling** | 1B + 强推理 ≈ 70B 弱推理(数学场景) |

---

## 6. 2026 生态速览

| 流派 | 代表 | 立场 |
|---|---|---|
| **纯 scaling 模型** | LLaMA-3 405B、Qwen-2.5 72B | 继续堆参数 + over-training |
| **Reasoning-first** | OpenAI o1/o3、DeepSeek-R1 | 把算力挪到推理时 |
| **小模型 reasoning** | QwQ-32B、s1、M1 | 1-30B + 强推理 |
| **架构创新** | Mamba、RWKV、Jamba | 推理速度 ×3 帮 test-time scaling |
| **Self-improvement** | Self-Refine、ReST-MCTS*、LLaMA-Berry | 自我迭代,无外部 PRM |

---

## 7. 生产最佳实践

### 7.1 何时启用 Test-Time Compute

| 场景 | 建议 | 算力预算 |
|---|---|---|
| **数学/代码/agent 规划** | ✅ 强推 | 4-16× baseline |
| **简单分类/抽取** | ❌ 不必 | 1× |
| **低延迟 API** | ❌ 受限 | 1-2× |
| **高价值离线任务** | ✅ 强推 | 8-64× |
| **多模态推理** | ✅ 中等 | 4-8× |

### 7.2 工程模板

```python
# 伪代码:Compute-Optimal Inference Router
def route_inference(query, budget):
    if difficulty(query) == "easy":
        return best_of_n(query, n=4, scorer=orm)  # 4× cost
    elif difficulty(query) == "medium":
        return beam_search(query, n=8, m=4, scorer=prm)  # 32× cost
    else:  # hard
        return dvts(query, n=64, m=8, scorer=prm)  # 512× cost
```

### 7.3 关键指标

| 指标 | 含义 | 目标 |
|---|---|---|
| **pass@k** | k 次采样至少 1 次答对的概率 | 数学 ≥80% |
| **Maj@k** | k 次投票多数答案的准确率 | 略低于 pass@k |
| **Coverage** | 答对的任务数 / 总任务数 | 反映泛化 |
| **Inference Latency** | 单 query 时延 | 业务约束 |
| **Token Cost** | 单 query 平均 token | 业务约束 |

### 7.4 失败模式

| 失败 | 根因 | 修正 |
|---|---|---|
| **Scaling 饱和** | 缺 PRM 验证器 | 训练 PRM 或用多数投票 |
| **边际收益递减** | 模型本身不会思考 | 先 GRPO RL,再 test-time |
| **过度思考** | 长 CoT 写到停不下来 | 训练"适可而止"奖励(L1) |
| **验证器被骗** | PRM 走捷径 | 提升 PRM 数据质量 / 多样性 |

---

## 8. See Also(官方源)

| 来源 | 链接 |
|---|---|
| **Snell et al. 2024, arXiv:2408.03314** | https://arxiv.org/abs/2408.03314 |
| **OpenAI Learning to Reason with LLMs(o1)** | https://openai.com/index/learning-to-reason-with-llms/ |
| **OpenAI o3 System Card** | https://openai.com/index/openai-o3-system-card/ |
| **DeepSeek-R1, arXiv:2501.12948** | https://arxiv.org/abs/2501.12948 |
| **HuggingFace Scaling Test-Time Compute Blog** | https://huggingface.co/spaces/HuggingFaceH4/blogpost-scaling-test-time-compute |
| **Lightman Let's Verify Step by Step(PRM)** | https://arxiv.org/abs/2305.20050 |
| **Wei et al. 2022, CoT(arXiv:2201.11903)** | https://arxiv.org/abs/2201.11903 |
| **M1 arXiv:2504.10449(Linear RNN + TTS)** | https://arxiv.org/abs/2504.10449 |
| **s1 Simple Test-Time Scaling** | https://arxiv.org/abs/2501.19393 |
| **Verifier is Sub-optimal(arXiv:2502.12118)** | https://arxiv.org/abs/2502.12118 |
| **关键术语英中对照** | Test-time compute / Inference compute / Verifier / PRM / ORM / Beam search / DVTS / Self-consistency / Pass@k |

---

## 9. 一句话结论(2026)

**Test-Time Compute Scaling 是 2024 年 LLM 范式的根本性转变——从"训练时砸算力"到"推理时砸算力";2026 工业界已分两派:OpenAI/Anthropic 押注长 CoT reasoning model,Meta/Alibaba 押注 over-trained 大模型,但所有 SOTA 数学/代码/agent 任务都跑在 test-time scaling 之上;小模型 + 强推理 ≈ 大模型 + 弱推理,1B 击败 70B 已成事实。**

## 相关链接

- [[05_大模型/09_Reasoning_Models/Test_Time_Compute_2026|测试时计算 2026]] — 深入解析
- [[05_大模型/09_Reasoning_Models/Test_Time_Compute_Scaling_2026|测试时计算扩展 2026]] — 扩展机制详解
- [[05_大模型/09_Reasoning_Models/o1_Class_Reasoning_Models|o1 类推理模型]] — 利用测试时计算的模型
- [[概念/LLM/reasoning-models|推理模型]] — 推理模型概念总览
- [[概念/LLM/rlvr|RLVR]] — 配合测试时计算的对齐方法
