---
title: o1-class Reasoning Models 深度解析
category: 05-nlp-llms-reasoning-models
tags: [reasoning, o1, test-time-compute, inference-time-compute, chain-of-thought, reinforcement-learning, llm-reasoning]
summary: 深度解析 OpenAI o1/o3 类推理模型的技术原理，包括测试时计算扩展、隐式思维链、强化学习训练和推理时搜索策略。
date: 2026-06-01
created: 2026-06-12
tier: peripheral
aliases:
  - "O1 Class Reasoning Models"
  - "o1 Class Reasoning Models"
  - o1_Class_Reasoning_Models
sources: []

---
# o1-class Reasoning Models 深度解析

## 一句话理解

o1 不是"更聪明的 GPT-4"，而是**学会了在回答之前"多想想"——通过生成大量内部推理步骤、自我纠正和尝试不同策略，把测试时的计算量转化为推理质量的提升**。

---

## 一、从 System 1 到 System 2

### 1.1 认知科学的双重系统理论

**Kahneman 的《思考，快与慢》**:
- **System 1 (快思考)**: 直觉、自动、快速、情绪化
  - 例: 看到 2+2=?, 立即回答 4
  - 传统 LLM (GPT-4) 主要在此模式
  
- **System 2 (慢思考)**: 理性、逻辑、缓慢、 effortful
  - 例: 计算 17×24=?, 需要分步计算
  - o1-class 模型试图模拟此模式

### 1.2 LLM 的 System 1 局限

```
问题: "一个 bat 和 ball 总共 11 美元。bat 比 ball 贵 10 美元。ball 多少钱？"

GPT-4 (System 1):
  → "ball 是 1 美元" (直觉错误答案)
  
o1 (System 2):
  → "设 ball = x，则 bat = x + 10"
  → "x + (x + 10) = 11"
  → "2x = 1"
  → "x = 0.5"
  → "ball 是 0.5 美元"
```

**关键区别**: o1 在内部生成了显式的推理链，而 GPT-4 试图直接跳跃到答案。

---

## 二、测试时计算扩展 (Test-time Compute Scaling)

### 2.1 核心公式

传统 LLM:
```
性能 = f(模型参数, 训练计算)
```

o1-class:
```
性能 = f(模型参数, 训练计算, 测试时计算)
                ↑
         新增的维度！
```

**测试时计算**包括:
- 生成的推理 token 数量
- 推理过程中的自我验证次数
- 尝试的不同策略数量
- 回溯和修正的次数

### 2.2 计算分配的权衡

给定固定总计算预算，如何分配？

```
选项 A: 小模型 + 大量测试时推理
  - 7B 模型，生成 10K tokens 的推理过程
  
选项 B: 大模型 + 少量测试时推理
  - 70B 模型，直接生成答案

实证结果 (OpenAI + DeepSeek):
  - 对于复杂推理任务，选项 A 经常胜过选项 B
  - 对于简单任务，选项 B 更高效
```

**最优策略**: 自适应分配——根据问题难度动态调整测试时计算。

### 2.3 推理时的搜索策略

**1. 链式思考 (Chain-of-Thought, CoT)**:
```
问题 → 步骤 1 → 步骤 2 → ... → 步骤 N → 答案
```

**2. 树状搜索 (Tree of Thoughts, ToT)**:
```
         问题
       /   |   \
    策略A 策略B 策略C
    / |    |     | \
  结果... 结果... 结果...
  
→ 评估每个分支，选择最佳路径
```

**3. 自我改进 (Self-Improvement)**:
```
生成答案 → 自我批评 → 发现错误 → 修正 → 再评估 → ...
```

**4. 多数投票 (Self-Consistency)**:
```
用相同 prompt 生成 10 个不同答案
选择出现次数最多的答案
→ 简单但有效，尤其适用于有明确答案的问题
```

### 2.4 测试时计算的扩展律

**OpenAI 的发现** (o1 技术报告):
```
准确率 ∝ log(测试时计算量)

具体数据 (AIME 数学竞赛):
  测试时计算 = 1x  → 准确率 12%
  测试时计算 = 10x → 准确率 39%
  测试时计算 = 100x → 准确率 83%
  
→ 100 倍的计算量带来 7 倍的准确率提升！
```

**关键洞察**: 测试时计算的回报递减比预训练慢得多。
- 预训练: 10× 计算量 → 通常 < 5% 提升
- 测试时推理: 10× 计算量 → 可达 20-50% 提升

---

## 三、o1 的技术架构推测

### 3.1 训练流程（基于公开信息和逆向工程）

```
阶段 1: 基础预训练
  - 大规模文本 + 代码预训练
  - 获得基础语言理解和生成能力

阶段 2: 推理数据构建 (最关键)
  - 收集/生成大量带推理过程的数据
  - 来源:
    a) 人类标注的详细解题步骤
    b) 用更强模型 (GPT-4) 生成推理链，人工筛选
    c) 从代码执行、形式化证明中提取推理过程
  
阶段 3: SFT on reasoning data
  - 让模型学会生成结构化推理
  - 输出格式:
      <thinking>
      步骤 1: ...
      步骤 2: ...
      验证: ...
      </thinking>
      <answer> ... </answer>

阶段 4: RLHF / RL 优化
  - 奖励模型评估推理质量（不仅是答案对错）
  - 强化学习优化推理策略
  - 关键: 奖励函数需要评估中间步骤，不只是最终答案

阶段 5: 测试时搜索（推理阶段）
  - 不直接输出第一个答案
  - 生成多个候选推理路径
  - 用验证器选择最佳路径
```

### 3.2 隐式思维链 (Hidden Chain-of-Thought)

**OpenAI 的关键决策**: o1 的内部推理过程对用户不可见。

```
用户看到:
  [思考中...] → [答案]
  
模型内部:
  [生成 10K tokens 的推理过程] → [提取最终答案]
  
为什么不公开推理过程？
  1. 竞争性: 防止竞争对手学习训练方法
  2. 可读性: 原始推理过程混乱、冗余、含大量试错
  3. 安全性: 推理过程可能包含有害内容的中间探索
```

**社区逆向工程** (通过 API 的 token 消耗和时间延迟推断):
- o1-preview 在简单问题上生成 ~1K-3K 内部 token
- o1-preview 在复杂问题上生成 ~10K-30K 内部 token
- o1-mini 的内部 token 数量约为 preview 的 1/3

### 3.3 验证器 (Verifier) 机制

**问题**: 生成的推理链可能包含错误，但模型自己无法发现。

**解决方案**: 训练专门的验证器模型。

```python
class ReasoningVerifier:
    def __init__(self):
        self.value_model = ValueModel()  # 评估当前状态的价值
        self.process_reward_model = PRM()  # 评估每个推理步骤
        
    def verify_step(self, reasoning_step, context):
        # 评估这个推理步骤是否正确/有用
        score = self.process_reward_model(reasoning_step, context)
        return score
    
    def search_best_path(self, initial_state, max_depth=10):
        # 使用 MCTS (蒙特卡洛树搜索) 或 Beam Search
        candidates = generate_candidates(initial_state)
        
        for step in range(max_depth):
            # 评估所有候选
            scores = [self.verify_step(c) for c in candidates]
            
            # 保留 top-k
            candidates = select_top_k(candidates, scores, k=5)
            
            # 扩展下一层
            candidates = [expand(c) for c in candidates]
        
        return best_candidate
```

**Process Reward Model (PRM) vs Outcome Reward Model (ORM)**:

| 类型 | 评估对象 | 优势 | 劣势 |
|---|---|---|---|
| ORM | 最终答案 | 简单，数据易获取 | 信用分配问题（不知道哪步错了） |
| PRM | 每个中间步骤 | 精准定位错误步骤 | 需要人工标注步骤级标签 |

**OpenAI 的推测方案**: PRM + ORM 混合
- 用 ORM 自动标注大量数据
- 用 PRM 精细优化关键步骤

---

## 四、DeepSeek-R1：开源 o1 的挑战者

### 4.1 核心创新

**DeepSeek-R1 的训练路径** (与 o1 不同):

```
阶段 1: 冷启动 SFT
  - 收集数千条高质量推理数据（人工标注 + 规则生成）
  - 对基础模型做初步 SFT
  
阶段 2: 大规模 RL (关键创新)
  - 不依赖人工标注的推理数据！
  - 用 RL 让模型自己探索推理策略
  - 奖励函数: 答案正确性 + 格式规范性
  
  结果: 模型自发学会了:
    - 生成长思维链
    - 自我验证
    - 回溯和修正
    - 甚至出现了 "Aha Moment"（突然顿悟）

阶段 3: 拒绝采样 + 再 SFT
  - 用阶段 2 的模型生成大量推理数据
  - 筛选高质量样本
  - 再次 SFT，提升通用能力

阶段 4: 全场景 RL
  - 在推理、代码、数学等多场景做 RL
  - 对齐人类偏好
```

### 4.2 GRPO: 无需价值模型的 RL

**传统 RL (PPO) 的问题**:
- 需要一个单独的价值模型 (Value Model) 来评估状态
- 价值模型和策略模型一样大，训练成本高

**GRPO (Group Relative Policy Optimization)**:
```python
# 对同一个问题，采样一组回答 (group)
responses = [sample(policy, question) for _ in range(G)]

# 用奖励模型给每个回答打分
rewards = [reward_model(r) for r in responses]

# 计算相对优势（不需要价值模型！）
mean_reward = mean(rewards)
advantages = [r - mean_reward for r in rewards]

# 用优势更新策略
for response, advantage in zip(responses, advantages):
    loss = -log_prob(response) * advantage
```

**优势**:
- 不需要训练价值模型
- 训练更稳定
- 计算成本降低 50%+

### 4.3 R1 的 "Aha Moment"

**DeepSeek 观察到的现象**:

在 RL 训练中期，模型突然学会了**重新评估**自己的推理过程。

```
模型输出 (训练早期):
  "让我计算 x = 5 + 3 = 8..."
  
模型输出 (训练后期，Aha Moment):
  "等等，让我重新检查..."
  "之前的计算可能有误..."
  "实际上 x = 5 + 3 = 8 是正确的"
  "但我应该验证一下..."
```

**关键**: 这种自我反思不是被显式训练的，而是 RL 的 emergent behavior。

---

## 五、测试时计算的技术实现

### 5.1 推理时策略：从 Best-of-N 到 MCTS

**Best-of-N**: 生成 N 个答案，选最好的
```python
answers = [model.generate(question) for _ in range(N)]
best = max(answers, key=reward_model)
```
- 简单，但每个答案是独立生成的，没有利用中间结果

**Beam Search**: 保留 top-k 中间状态，逐步扩展
```python
beams = [initial_state]
for step in range(max_steps):
    candidates = [expand(b) for b in beams for _ in range(branch_factor)]
    beams = select_top_k(candidates, k=beam_width)
```
- 更高效，但搜索空间仍然有限

**MCTS (Monte Carlo Tree Search)**:
```python
class MCTSNode:
    def __init__(self, state):
        self.state = state
        self.visits = 0
        self.value = 0
        self.children = []

# Selection: UCB1 选择最有潜力的节点
# Expansion: 扩展新节点
# Simulation: 随机 rollout 到终止状态
# Backpropagation: 更新路径上的价值
```
- 最适合复杂推理任务
- AlphaGo / AlphaZero 的核心算法
- o1 可能使用了某种变体

### 5.2 计算预算的自适应分配

**不是所有问题都需要大量推理**:
```python
def adaptive_reasoning(question, budget=10000):
    # 先快速评估问题难度
    difficulty = quick_assess(question)
    
    if difficulty == "easy":
        # 简单问题：直接回答
        return model.generate(question, max_tokens=500)
    
    elif difficulty == "medium":
        # 中等问题：少量推理
        return reasoning_with_budget(question, budget=budget * 0.3)
    
    else:
        # 难题：全力推理
        return reasoning_with_budget(question, budget=budget)
```

**难度评估信号**:
- 问题长度和复杂度
- 关键词（"证明"、"推导"、"分析" vs "是什么"、"列举"）
- 模型在初步尝试中的置信度

---

## 六、评估 o1-class 模型

### 6.1 推理基准

| 基准 | 测试能力 | o1-preview | GPT-4 | DeepSeek-R1 |
|---|---|---|---|---|
| AIME (数学竞赛) | 高中数学推理 | 83% | 13% | 79% |
| GPQA Diamond | 研究生级科学问答 | 78% | 56% | 72% |
| Codeforces | 竞赛编程 | 89th %ile | 11th %ile | 75th %ile |
| MATH-500 | 数学问题集 | 94% | 52% | 93% |
| MMLU | 多学科知识 | 93% | 87% | 91% |

**关键观察**:
- o1/R1 在推理密集型任务上提升巨大（AIME: 6×）
- 在知识密集型任务上提升较小（MMLU: +5%）
- 说明测试时计算主要提升**推理能力**，而非**知识储备**

### 6.2 评测指标设计

**推理质量评估**:
```
1. 答案正确率 (Accuracy)
2. 推理步骤完整性 (Step completeness)
3. 推理逻辑正确性 (Logical validity)
4. 推理效率 (Token efficiency: 用多少 token 得到正确答案)
5. 自我纠正能力 (Self-correction rate)
```

**Token Efficiency 的重要性**:
```
模型 A: 用 100 tokens 推理 → 正确答案
模型 B: 用 10K tokens 推理 → 正确答案

虽然都对，但 A 更高效
→ 在实际部署中，A 的成本是 B 的 1/100
```

---

## 七、局限性与未来方向

### 7.1 当前局限

1. **成本高昂**: o1-preview 的 API 价格是 GPT-4 的 3-6 倍（因为生成了大量内部 token）
2. **延迟高**: 复杂问题需要 10-30 秒才能回答
3. **通用性不足**: 在创意写作、开放域对话等任务上，o1 并不比 GPT-4 强
4. **不可解释**: 内部推理过程不可见，无法审计
5. **过度思考**: 有时在简单问题上也会生成冗长的推理过程

### 7.2 未来方向

**1. 推理与知识分离**:
```
小模型负责推理 (System 2)
大模型/RAG 负责知识检索 (System 1 的知识库)
→ 组合获得最佳性价比
```

**2. 推理的蒸馏**:
```
用大推理模型 (o1) 生成高质量推理数据
用小模型 (7B) 学习这些推理模式
→ 让小模型也具备推理能力
```

**3. 推理的硬件优化**:
- 推理时的大部分 token 是"内部思考"，不需要高生成质量
- 可以用更低的精度（INT4/INT8）生成内部 token
- 只有最终答案需要 FP16

**4. 多模态推理**:
- 当前 o1 主要处理文本
- 扩展到图像推理（几何证明、图表分析）
- 扩展到视频推理（因果推理、时序预测）

---

## Related

- [[大模型/Reasoning_Models/DeepSeek_R1_Technical_Analysis]]
- [[大模型/Reasoning_Models/Process_Reward_Models]]
- [[大模型/Reasoning_Models/Reasoning_Models_for_dummy|Reasoning Models]]
- [[_concepts/ai-agents]]
- [[强化学习/Deep_RL/Deep_RL]]
- [[大模型/Prompt_Engineering/Prompt_Engineering|Prompt Engineering]]
- [[_synthesis/reasoning-models-agents|推理模型 × Agent]] — 推理增强的智能体

- [[_synthesis/alignment-rlhf|价值对齐 × RLHF：从人类反馈到可扩展监督]]
