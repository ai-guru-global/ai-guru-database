---
title: RL 驱动 LLM 推理 (R1/GRPO/OpenAI o系列)
category: 04-reinforcement-learning
tags: ["rl-reasoning", "grpo", "deepseek-r1", "openai-o1", "reinforcement-learning", "chain-of-thought"]
summary: "RL 驱动 LLM 推理能力完整技术体系：从 OpenAI o1 到 DeepSeek R1/GRPO，覆盖推理 RL 训练流水线、奖励设计、过程奖励模型、2026 最新进展与实战。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# RL 驱动 LLM 推理

## 1. 推理 RL 的兴起

### 1.1 为什么需要 RL 来增强推理？

```
传统 SFT 的局限:
- SFT 只能模仿: 学到"怎么写"，学不到"怎么想"
- 推理链不可教: 真正的推理是探索性的，没有标准答案
- 泛化差: 见过的题型会做，新题型不会

RL 的优势:
- 探索: 模型自己尝试不同推理路径
- 试错: 做对了奖励，做错了惩罚
- 涌现: 自发产生 CoT、回溯、验证等策略
- 泛化: 学到"推理能力"而非"推理模板"

2024-2026 里程碑:
  2024.09: OpenAI o1 (推理 RL 首次大规模验证)
  2025.01: DeepSeek R1 (开源推理 RL 模型)
  2025.03: GRPO 论文发表 (无需 Critic 的 RL)
  2025-2026: 推理 RL 成为标配 (所有前沿模型都用)
```

### 1.2 推理 RL vs 传统 RLHF

| 维度 | 传统 RLHF | 推理 RL |
|------|-----------|---------|
| 目标 | 对齐人类偏好 | 提升推理正确率 |
| 奖励 | 人类偏好 (主观) | 答案正确性 (客观) |
| 数据 | 对话/指令 | 数学/代码/逻辑题 |
| 验证 | 奖励模型打分 | 规则验证/执行验证 |
| 训练信号 | 稀疏 (整体好坏) | 密集 (每步对错) |
| 典型方法 | PPO/DPO | GRPO/PPO+PRM |

## 2. GRPO (Group Relative Policy Optimization)

### 2.1 核心算法

```python
import torch
import torch.nn.functional as F

def grpo_loss(model, ref_model, prompts, answers, 
              reward_fn, group_size=8, beta=0.04):
    """
    GRPO: DeepSeek R1 的核心训练算法
    
    关键创新: 不需要 Critic/Value 网络!
    用组内相对排名替代价值估计
    
    流程:
    1. 对每个 prompt 生成 G 个回答 (group)
    2. 对每个回答计算奖励
    3. 组内归一化 (减均值除标准差)
    4. 用归一化奖励做策略梯度
    """
    total_loss = 0
    
    for prompt, answer in zip(prompts, answers):
        # Step 1: 生成一组回答
        responses = model.generate(
            prompt, 
            num_return_sequences=group_size,
            temperature=1.0,
            max_new_tokens=4096
        )
        
        # Step 2: 计算奖励 (规则验证)
        rewards = []
        for resp in responses:
            r = reward_fn(resp, answer)  # 0 或 1 (对/错)
            rewards.append(r)
        rewards = torch.tensor(rewards, dtype=torch.float32)
        
        # Step 3: 组内归一化 (核心!)
        # 替代 Critic: 用组内统计量做基线
        mean_r = rewards.mean()
        std_r = rewards.std() + 1e-8
        advantages = (rewards - mean_r) / std_r
        
        # Step 4: 策略梯度 + KL 惩罚
        for i, resp in enumerate(responses):
            # 当前策略的 log 概率
            log_prob = model.log_prob(prompt, resp)
            # 参考策略的 log 概率
            ref_log_prob = ref_model.log_prob(prompt, resp)
            
            # KL 散度惩罚 (防止偏离太远)
            kl = log_prob - ref_log_prob
            
            # GRPO 目标
            # 优势 × log概率比 - β × KL
            ratio = torch.exp(log_prob - log_prob.detach())
            loss_i = -(advantages[i] * ratio - beta * kl)
            total_loss += loss_i
    
    return total_loss / (len(prompts) * group_size)
```

### 2.2 GRPO vs PPO

```python
# PPO 需要 4 个模型:
# 1. Actor (策略模型)
# 2. Critic (价值模型) ← 额外开销!
# 3. Reference (参考模型)
# 4. Reward (奖励模型)
# 显存: 4 × 模型大小

# GRPO 只需要 2 个模型:
# 1. Actor (策略模型)
# 2. Reference (参考模型)
# 显存: 2 × 模型大小 (节省 50%!)

# 为什么 GRPO 不需要 Critic?
# PPO: 用 Critic 估计 V(s) → 计算 A(s,a) = R - V(s)
# GRPO: 用组内均值替代 V(s) → A = (R - mean(R_group)) / std(R_group)
# 直觉: 同一题的多个回答互相对比，好的为正，差的为负
```

## 3. 奖励设计

### 3.1 结果奖励 (Outcome Reward)

```python
class OutcomeReward:
    """
    只看最终答案对不对
    适用: 数学/代码/逻辑 (有标准答案)
    """
    def __init__(self, reward_correct=1.0, reward_wrong=0.0,
                 format_bonus=0.1):
        self.r_correct = reward_correct
        self.r_wrong = reward_wrong
        self.format_bonus = format_bonus
    
    def score(self, response, ground_truth):
        # 提取最终答案
        predicted = self.extract_answer(response)
        
        # 正确性奖励
        if self.verify(predicted, ground_truth):
            reward = self.r_correct
        else:
            reward = self.r_wrong
        
        # 格式奖励 (鼓励结构化输出)
        if self.has_proper_format(response):
            reward += self.format_bonus
        
        return reward
    
    def extract_answer(self, response):
        """从推理链中提取最终答案"""
        # 匹配 \\boxed{...} 或 "答案是..." 等模式
        import re
        patterns = [
            r'\\boxed\{(.+?)\}',
            r'答案[是为]?\s*[：:]?\s*(.+?)[\n。]',
            r'The answer is\s*(.+?)[\.\n]',
        ]
        for pattern in patterns:
            match = re.search(pattern, response)
            if match:
                return match.group(1).strip()
        return response.strip().split('\n')[-1]
    
    def verify(self, predicted, ground_truth):
        """验证答案 (支持数值/符号等价)"""
        try:
            # 数值比较
            return abs(float(predicted) - float(ground_truth)) < 1e-6
        except (ValueError, TypeError):
            # 字符串比较
            return predicted.lower().strip() == ground_truth.lower().strip()
```

### 3.2 过程奖励模型 (PRM)

```python
class ProcessRewardModel:
    """
    PRM: 对推理的每一步打分，而非只看最终答案
    
    优势:
    - 更密集的训练信号 (每步都有反馈)
    - 能区分"过程对但答案错" vs "过程错但蒙对了"
    - 支持搜索 (MCTS + PRM)
    
    训练数据: 人工标注每步的正确性
    """
    def __init__(self, model_path):
        self.model = load_model(model_path)  # 通常是小模型
    
    def score_step(self, problem, reasoning_steps, step_idx):
        """对第 step_idx 步打分"""
        context = problem + "\n".join(reasoning_steps[:step_idx+1])
        # 输出: 这一步正确的概率 [0, 1]
        score = self.model.predict(context)
        return score
    
    def score_trajectory(self, problem, reasoning_steps):
        """对整条推理链打分"""
        scores = []
        for i in range(len(reasoning_steps)):
            s = self.score_step(problem, reasoning_steps, i)
            scores.append(s)
        # 聚合: 最弱环节 / 平均 / 最后一步
        return min(scores)  # 木桶效应: 取最弱步骤

# PRM 在推理搜索中的应用:
# 1. 生成多条推理路径
# 2. PRM 对每步打分
# 3. 选择得分最高的路径 (Best-of-N / MCTS)
# 4. 或: 在低分步骤回溯重试
```

### 3.3 代码执行验证

```python
class CodeExecutionReward:
    """代码题: 直接执行验证"""
    
    def score(self, generated_code, test_cases, timeout=5):
        """
        运行测试用例，返回通过率作为奖励
        """
        passed = 0
        total = len(test_cases)
        
        for test in test_cases:
            try:
                result = execute_code(
                    generated_code + "\n" + test["input"],
                    timeout=timeout
                )
                if result.strip() == test["expected"].strip():
                    passed += 1
            except (TimeoutError, RuntimeError):
                pass
        
        return passed / total  # 通过率 [0, 1]
```

## 4. 训练流水线

### 4.1 完整 Pipeline

```python
class ReasoningRLPipeline:
    """
    推理 RL 完整训练流水线 (2026 最佳实践)
    
    阶段:
    1. 数据准备: 数学/代码/逻辑题 + 标准答案
    2. 冷启动 SFT: 少量高质量推理链 (可选)
    3. RL 训练: GRPO/PPO + 规则奖励
    4. 迭代: 多轮 RL，逐步增加难度
    """
    def __init__(self, base_model, config):
        self.model = base_model
        self.ref_model = deepcopy(base_model)  # 冻结参考
        self.ref_model.eval()
        self.config = config
    
    def prepare_data(self, datasets):
        """
        数据准备:
        - MATH (数学)
        - GSM8K (小学数学)
        - HumanEval/MBPP (代码)
        - ARC/LSAT (逻辑)
        - 自定义题库
        """
        problems = []
        for ds in datasets:
            for item in ds:
                problems.append({
                    "prompt": item["problem"],
                    "answer": item["solution"],
                    "difficulty": item.get("difficulty", "medium"),
                    "type": item.get("type", "math"),
                })
        return problems
    
    def train_grpo(self, problems, epochs=3):
        """GRPO 训练循环"""
        optimizer = torch.optim.AdamW(
            self.model.parameters(), 
            lr=self.config.lr  # 通常 1e-6 到 5e-6
        )
        
        for epoch in range(epochs):
            # 课程学习: 从易到难
            epoch_problems = self.curriculum_sample(
                problems, epoch, epochs
            )
            
            for batch in chunk(epoch_problems, self.config.batch_size):
                prompts = [p["prompt"] for p in batch]
                answers = [p["answer"] for p in batch]
                
                # GRPO 损失
                loss = grpo_loss(
                    self.model, self.ref_model,
                    prompts, answers,
                    reward_fn=self.reward_fn,
                    group_size=self.config.group_size,  # 8-16
                    beta=self.config.kl_beta  # 0.01-0.1
                )
                
                loss.backward()
                torch.nn.utils.clip_grad_norm_(
                    self.model.parameters(), 1.0
                )
                optimizer.step()
                optimizer.zero_grad()
    
    def curriculum_sample(self, problems, epoch, total_epochs):
        """课程学习: 逐步增加难度"""
        progress = epoch / total_epochs
        if progress < 0.33:
            # 前期: 简单题为主
            return [p for p in problems if p["difficulty"] == "easy"]
        elif progress < 0.66:
            # 中期: 混合
            return problems
        else:
            # 后期: 难题为主
            return [p for p in problems 
                    if p["difficulty"] in ("medium", "hard")]
```

### 4.2 关键训练配置

```python
# 2026 推理 RL 推荐配置:
reasoning_rl_config = {
    # 模型
    "base_model": "deepseek-math-7b",  # 或任何强基座
    "group_size": 16,          # GRPO 组大小 (越大越稳定)
    
    # 优化
    "lr": 1e-6,                # 很小的学习率!
    "kl_beta": 0.04,           # KL 惩罚系数
    "max_grad_norm": 1.0,      # 梯度裁剪
    "epochs": 3,               # 通常 2-5 轮
    
    # 生成
    "temperature": 1.0,        # 生成温度 (探索)
    "max_new_tokens": 4096,    # 推理链可能很长
    "top_p": 0.95,
    
    # 奖励
    "reward_type": "outcome",  # outcome / process / hybrid
    "format_reward": 0.1,      # 格式奖励
    "length_penalty": -0.001,  # 轻微长度惩罚 (防啰嗦)
    
    # 数据
    "curriculum": True,        # 课程学习
    "rejection_sampling": True, # 拒绝采样 (过滤全错/全对)
}
```

## 5. 2026 前沿进展

### 5.1 推理时计算 (Test-Time Compute)

```python
# 2026 核心趋势: 推理时投入更多计算
# 训练时 RL → 推理时搜索

class TestTimeScaling:
    """
    推理时扩展策略:
    1. Best-of-N: 生成 N 个回答，选最好的
    2. MCTS: 树搜索 + PRM 引导
    3. 自我验证: 生成后自我检查
    4. 多路投票: 多数投票
    """
    def solve(self, problem, strategy="best_of_n", n=16):
        if strategy == "best_of_n":
            return self.best_of_n(problem, n)
        elif strategy == "mcts":
            return self.mcts_search(problem)
        elif strategy == "self_verify":
            return self.self_verification(problem)
    
    def best_of_n(self, problem, n):
        """生成 N 个，奖励模型选最好的"""
        responses = self.model.generate(
            problem, num_return_sequences=n, temperature=0.7
        )
        # 用 PRM 或多数投票选择
        scores = [self.prm.score_trajectory(problem, r) for r in responses]
        return responses[scores.index(max(scores))]
    
    def self_verification(self, problem):
        """生成 → 验证 → 修正"""
        # 第一次生成
        response = self.model.generate(problem)
        # 自我验证
        verify_prompt = f"""
请验证以下推理是否正确:
问题: {problem}
解答: {response}

如果有错误，请指出并给出正确答案。
"""
        verified = self.model.generate(verify_prompt)
        return verified
```

### 5.2 推理 RL 的涌现行为

```
DeepSeek R1 训练中观察到的涌现行为:

1. 反思 (Reflection):
   "等等，让我重新检查一下..."
   "上面的方法似乎有问题，让我换个思路..."

2. 回溯 (Backtracking):
   "这条路走不通，让我回到第二步..."

3. 分解 (Decomposition):
   "这个问题太复杂了，让我分成几个子问题..."

4. 验证 (Verification):
   "让我代入验证一下: 当 x=2 时..."

5. 多策略 (Multi-strategy):
   "方法一: ... 方法二: ... 两种方法结果一致"

这些行为从未被显式教授! 是 RL 探索中自发产生的。
```

## 6. 实战指南

### 6.1 快速开始 (使用 TRL/verl)

```python
# 使用 verl (2026 主流推理 RL 框架):
# pip install verl

# 配置文件 (yaml):
"""
algorithm:
  name: grpo
  group_size: 16
  kl_beta: 0.04
  
model:
  base: deepseek-math-7b
  max_length: 4096
  
reward:
  type: rule_based
  datasets: [math, gsm8k]
  
training:
  lr: 1e-6
  epochs: 3
  batch_size: 128
  gradient_accumulation: 4
  
data:
  train: /path/to/math_problems.jsonl
  format: {"problem": "...", "answer": "..."}
"""

# 或使用 TRL:
from trl import GRPOTrainer, GRPOConfig

config = GRPOConfig(
    output_dir="./reasoning_rl",
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=1e-6,
    num_generations=16,  # group_size
    max_new_tokens=4096,
    beta=0.04,
)

trainer = GRPOTrainer(
    model="deepseek-math-7b",
    args=config,
    train_dataset=math_dataset,
    reward_funcs=[math_reward_fn],
)
trainer.train()
```

### 6.2 常见问题与解决

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 奖励不涨 | 题目太难/太简单 | 调整课程难度 |
| 输出变短 | 长度惩罚过强 | 减小/去除长度惩罚 |
| 重复循环 | 探索不足 | 提高 temperature |
| KL 爆炸 | 学习率太大 | 降低 lr / 增大 β |
| 格式退化 | 缺少格式奖励 | 添加 format_bonus |
| 过拟合题库 | 数据多样性不足 | 增加题目来源 |

## 7. 交叉引用

- [[06_强化学习/03_RLHF_Alignment/GRPO_Training_Deep_Dive|GRPO 训练深度解析]]
- [[06_强化学习/03_RLHF_Alignment/DPO_Variants_2026|DPO 变体]]
- [[06_强化学习/03_RLHF_Alignment/Reward_Modeling_Deep_Dive|奖励模型]]
- [[05_大模型/09_Reasoning_Models/|推理模型]]
- [[03_深度学习/Continual_Learning/|持续学习]]
- [[06_强化学习/02_Deep_RL/Decision_Transformer|Decision Transformer]]
