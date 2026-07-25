---
title: 多臂老虎机算法 (Bandit Algorithms)
category: 04-reinforcement-learning
tags: ["bandit", "ucb", "thompson-sampling", "contextual-bandit", "exploration-exploitation"]
summary: "多臂老虎机完整技术体系：探索-利用权衡、ε-greedy/UCB/Thompson Sampling、上下文 Bandit、组合 Bandit，以及在推荐/广告/LLM/AB测试中的 2026 实战应用。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 多臂老虎机算法 (Bandit Algorithms)

## 1. 问题定义

### 1.1 什么是多臂老虎机？

```
场景: 面前有 N 台老虎机 (arm)，每台的中奖概率未知
目标: 在有限次拉杆中，最大化总收益
挑战: 探索 (尝试未知的) vs 利用 (选已知最好的)

形式化:
  - K 个臂 (arms): a₁, a₂, ..., a_K
  - 每次选一个臂 a_t，获得奖励 r_t ~ P(a_t)
  - 目标: 最小化累积遗憾 (regret)
  
  Regret(T) = T × μ* - Σ μ(a_t)
  其中 μ* = max_i μ(a_i) 是最优臂的期望奖励

类比:
  - 探索 = 去新餐厅尝试 (可能发现宝藏，也可能踩雷)
  - 利用 = 去已知好吃的餐厅 (稳定但可能错过更好的)
  - Bandit = 在有限预算内平衡两者
```

### 1.2 Bandit vs 完整 RL

| 维度 | Bandit | 完整 RL (MDP) |
|------|--------|--------------|
| 状态 | 无状态 / 单步 | 多步状态转移 |
| 动作影响 | 不影响下一步 | 影响下一状态 |
| 复杂度 | 低 | 高 |
| 应用 | 推荐/广告/AB | 游戏/机器人/对话 |
| 理论 | 成熟 | 发展中 |

## 2. 经典算法

### 2.1 ε-Greedy

```python
import numpy as np

class EpsilonGreedy:
    """
    最简单的探索策略:
    - 概率 ε: 随机探索
    - 概率 1-ε: 选当前最优
    
    优点: 实现简单
    缺点: ε 固定，不会随信息增加而减少探索
    """
    def __init__(self, n_arms, epsilon=0.1):
        self.n_arms = n_arms
        self.epsilon = epsilon
        self.counts = np.zeros(n_arms)    # 每个臂被选次数
        self.values = np.zeros(n_arms)    # 每个臂的估计价值
    
    def select_arm(self):
        if np.random.random() < self.epsilon:
            return np.random.randint(self.n_arms)  # 探索
        else:
            return np.argmax(self.values)  # 利用
    
    def update(self, arm, reward):
        self.counts[arm] += 1
        # 增量更新均值
        n = self.counts[arm]
        self.values[arm] += (reward - self.values[arm]) / n

# 改进: 衰减 ε (随时间减少探索)
class DecayingEpsilonGreedy(EpsilonGreedy):
    def __init__(self, n_arms, epsilon_start=1.0, epsilon_min=0.01, decay=0.999):
        super().__init__(n_arms, epsilon_start)
        self.epsilon_min = epsilon_min
        self.decay = decay
    
    def select_arm(self):
        self.epsilon = max(self.epsilon_min, self.epsilon * self.decay)
        return super().select_arm()
```

### 2.2 UCB (Upper Confidence Bound)

```python
class UCB1:
    """
    UCB1: 乐观面对不确定性
    选择"上置信界"最大的臂
    
    公式: UCB(a) = Q(a) + c × √(ln(t) / N(a))
    
    - Q(a): 臂 a 的估计均值 (利用项)
    - c × √(ln(t)/N(a)): 不确定性奖励 (探索项)
      - t: 总步数
      - N(a): 臂 a 被选次数
      - c: 探索系数 (通常 √2)
    
    直觉: 
    - 被选少的臂 → 不确定性大 → 上界高 → 优先探索
    - 被选多的臂 → 不确定性小 → 靠均值决定
    - 理论保证: O(√(KT ln T)) 遗憾界
    """
    def __init__(self, n_arms, c=1.414):
        self.n_arms = n_arms
        self.c = c
        self.counts = np.zeros(n_arms)
        self.values = np.zeros(n_arms)
        self.total_steps = 0
    
    def select_arm(self):
        # 确保每个臂至少被选一次
        for arm in range(self.n_arms):
            if self.counts[arm] == 0:
                return arm
        
        self.total_steps += 1
        # UCB 值 = 均值 + 不确定性
        ucb_values = (self.values + 
                     self.c * np.sqrt(
                         np.log(self.total_steps) / self.counts
                     ))
        return np.argmax(ucb_values)
    
    def update(self, arm, reward):
        self.counts[arm] += 1
        n = self.counts[arm]
        self.values[arm] += (reward - self.values[arm]) / n

# UCB 变体:
# - UCB1: 经典版 (上述)
# - UCB-Tuned: 考虑奖励方差
# - KL-UCB: 用 KL 散度，更紧的界
# - LinUCB: 线性上下文 Bandit
```

### 2.3 Thompson Sampling

```python
class ThompsonSampling:
    """
    Thompson Sampling: 贝叶斯方法
    为每个臂维护奖励的后验分布，从分布中采样决策
    
    流程:
    1. 对每个臂，从后验分布采样一个值
    2. 选采样值最大的臂
    3. 观察奖励，更新后验
    
    优势:
    - 天然的探索-利用平衡
    - 不确定性大 → 采样方差大 → 自然探索
    - 信息增加 → 后验收缩 → 自然利用
    - 实践中通常优于 UCB
    """
    def __init__(self, n_arms, prior_alpha=1.0, prior_beta=1.0):
        self.n_arms = n_arms
        # Beta 分布参数 (适合二值奖励)
        self.alphas = np.full(n_arms, prior_alpha)
        self.betas = np.full(n_arms, prior_beta)
    
    def select_arm(self):
        """从每个臂的 Beta 后验中采样"""
        samples = np.array([
            np.random.beta(self.alphas[i], self.betas[i])
            for i in range(self.n_arms)
        ])
        return np.argmax(samples)
    
    def update(self, arm, reward):
        """更新后验 (共轭更新)"""
        if reward == 1:  # 成功
            self.alphas[arm] += 1
        else:  # 失败
            self.betas[arm] += 1

# 连续奖励版本 (正态-逆伽马):
class GaussianThompsonSampling:
    """连续奖励的 Thompson Sampling"""
    def __init__(self, n_arms, mu0=0, sigma0=1, kappa0=1, alpha0=1, beta0=1):
        self.n_arms = n_arms
        # 正态-逆伽马先验参数
        self.mus = np.full(n_arms, mu0)
        self.kappas = np.full(n_arms, kappa0)
        self.alphas = np.full(n_arms, alpha0)
        self.betas = np.full(n_arms, beta0)
    
    def select_arm(self):
        samples = []
        for i in range(self.n_arms):
            # 从逆伽马采样方差
            sigma2 = 1.0 / np.random.gamma(self.alphas[i], 1.0/self.betas[i])
            # 从正态采样均值
            mu = np.random.normal(self.mus[i], np.sqrt(sigma2 / self.kappas[i]))
            samples.append(mu)
        return np.argmax(samples)
    
    def update(self, arm, reward):
        """正态-逆伽马共轭更新"""
        n = self.kappas[arm]
        mu_old = self.mus[arm]
        # 更新参数
        self.kappas[arm] += 1
        self.mus[arm] = (n * mu_old + reward) / (n + 1)
        self.alphas[arm] += 0.5
        self.betas[arm] += 0.5 * n / (n+1) * (reward - mu_old)**2
```

## 3. 上下文 Bandit (Contextual Bandit)

### 3.1 LinUCB

```python
class LinUCB:
    """
    上下文 Bandit: 决策依赖于上下文特征
    
    场景: 
    - 推荐系统: 上下文=用户特征, 臂=候选物品
    - 广告: 上下文=用户+场景, 臂=广告候选
    
    LinUCB: 假设奖励是上下文的线性函数
    r(a, x) = θ_a^T · x + noise
    
    论文: "A Contextual-Bandit Approach to Personalized News Article Recommendation" (2010)
    """
    def __init__(self, n_arms, context_dim, alpha=1.0):
        self.n_arms = n_arms
        self.d = context_dim
        self.alpha = alpha  # 探索系数
        
        # 每个臂的参数
        self.A = [np.eye(context_dim) for _ in range(n_arms)]
        self.b = [np.zeros(context_dim) for _ in range(n_arms)]
    
    def select_arm(self, context):
        """
        context: (d,) 上下文向量
        返回: 选择的臂
        """
        ucb_values = np.zeros(self.n_arms)
        
        for a in range(self.n_arms):
            A_inv = np.linalg.inv(self.A[a])
            theta = A_inv @ self.b[a]
            
            # UCB = 预测均值 + 不确定性
            mean = theta @ context
            uncertainty = self.alpha * np.sqrt(context @ A_inv @ context)
            ucb_values[a] = mean + uncertainty
        
        return np.argmax(ucb_values)
    
    def update(self, arm, context, reward):
        """更新选中臂的参数"""
        self.A[arm] += np.outer(context, context)
        self.b[arm] += reward * context

# 应用示例: 新闻推荐
# context = [用户年龄, 性别, 历史偏好, 时间段, 设备...]
# arms = [体育, 科技, 财经, 娱乐, 政治...]
# reward = 是否点击 (0/1)
```

### 3.2 神经网络上下文 Bandit

```python
import torch
import torch.nn as nn

class NeuralBandit:
    """
    用神经网络替代线性假设
    适合复杂的上下文-奖励关系
    """
    def __init__(self, context_dim, n_arms, hidden_dim=128):
        self.n_arms = n_arms
        # 共享特征提取 + 每臂预测头
        self.feature_net = nn.Sequential(
            nn.Linear(context_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
        )
        self.arm_heads = nn.ModuleList([
            nn.Linear(hidden_dim, 1) for _ in range(n_arms)
        ])
        # 不确定性估计 (MC Dropout)
        self.dropout = nn.Dropout(0.1)
    
    def select_arm(self, context, n_samples=20):
        """MC Dropout 估计不确定性"""
        self.feature_net.train()  # 启用 dropout
        
        arm_scores = torch.zeros(self.n_arms)
        for a in range(self.n_arms):
            samples = []
            for _ in range(n_samples):
                feat = self.feature_net(context)
                feat = self.dropout(feat)
                pred = self.arm_heads[a](feat)
                samples.append(pred.item())
            
            mean = np.mean(samples)
            std = np.std(samples)
            # UCB 风格: 均值 + 不确定性
            arm_scores[a] = mean + 1.96 * std
        
        return arm_scores.argmax().item()
```

## 4. 高级变体

### 4.1 组合 Bandit (Combinatorial Bandit)

```python
class CombinatorialBandit:
    """
    每次选一组臂 (而非单个)
    应用: 推荐 Top-K 列表、广告组合投放
    
    挑战: 组合空间爆炸 C(K, M)
    解决: 分解为单臂 UCB + 组合优化
    """
    def __init__(self, n_arms, n_select, c=1.0):
        self.n_arms = n_arms
        self.n_select = n_select  # 每次选几个
        self.c = c
        self.counts = np.zeros(n_arms)
        self.values = np.zeros(n_arms)
        self.total = 0
    
    def select_arms(self):
        """选择 Top-M 个臂"""
        self.total += 1
        # 计算 UCB
        ucb = np.zeros(self.n_arms)
        for i in range(self.n_arms):
            if self.counts[i] == 0:
                ucb[i] = float('inf')
            else:
                ucb[i] = (self.values[i] + 
                         self.c * np.sqrt(np.log(self.total) / self.counts[i]))
        
        # 选 UCB 最高的 M 个
        selected = np.argsort(ucb)[-self.n_select:]
        return selected
    
    def update(self, arms, rewards):
        """更新所有被选臂"""
        for arm, reward in zip(arms, rewards):
            self.counts[arm] += 1
            n = self.counts[arm]
            self.values[arm] += (reward - self.values[arm]) / n
```

### 4.2 对抗性 Bandit (EXP3)

```python
class EXP3:
    """
    对抗性 Bandit: 奖励由对手决定 (非随机)
    应用: 博弈/竞价/对抗环境
    
    EXP3: Exponential-weight algorithm for Exploration and Exploitation
    """
    def __init__(self, n_arms, gamma=0.1):
        self.n_arms = n_arms
        self.gamma = gamma
        self.weights = np.ones(n_arms)
    
    def select_arm(self):
        """按权重概率选择"""
        probs = (1 - self.gamma) * self.weights / self.weights.sum()
        probs += self.gamma / self.n_arms
        return np.random.choice(self.n_arms, p=probs)
    
    def update(self, arm, reward):
        """指数权重更新"""
        probs = (1 - self.gamma) * self.weights / self.weights.sum()
        probs += self.gamma / self.n_arms
        
        # 重要性加权估计
        estimated_reward = reward / probs[arm]
        self.weights[arm] *= np.exp(self.gamma * estimated_reward / self.n_arms)
```

## 5. 2026 实战应用

### 5.1 LLM 路由与选择

```python
class LLMRouterBandit:
    """
    2026 应用: 用 Bandit 选择最优 LLM
    
    场景: 多个 LLM 可选 (GPT-4o/Claude/Gemini/开源)
    上下文: 任务类型、复杂度、预算
    奖励: 质量/成本/延迟的综合评分
    """
    def __init__(self, models, context_dim=16):
        self.models = models  # ["gpt-4o", "claude-4", "gemini-2", "llama-4"]
        self.bandit = LinUCB(len(models), context_dim, alpha=0.5)
    
    def route(self, task_context):
        """选择最优模型"""
        arm = self.bandit.select_arm(task_context)
        return self.models[arm]
    
    def feedback(self, model_idx, context, quality_score, cost, latency):
        """综合奖励"""
        # 多目标奖励
        reward = (0.5 * quality_score + 
                 0.3 * (1 - cost/max_cost) + 
                 0.2 * (1 - latency/max_latency))
        self.bandit.update(model_idx, context, reward)
```

### 5.2 推荐系统

```python
class RecommendationBandit:
    """
    推荐系统中的 Bandit 应用:
    - 冷启动: 新用户/新物品没有历史数据
    - 多样性: 避免信息茧房
    - 实时反馈: 在线学习
    """
    def __init__(self, n_items, user_feature_dim):
        self.bandit = LinUCB(n_items, user_feature_dim, alpha=0.3)
    
    def recommend(self, user_features, top_k=10):
        """为用户推荐 Top-K"""
        scores = []
        for item in range(self.bandit.n_arms):
            # 获取该物品的 UCB 分数
            A_inv = np.linalg.inv(self.bandit.A[item])
            theta = A_inv @ self.bandit.b[item]
            score = theta @ user_features
            scores.append(score)
        
        # 返回 Top-K
        top_items = np.argsort(scores)[-top_k:][::-1]
        return top_items
```

### 5.3 算法选型指南

| 场景 | 推荐算法 | 原因 |
|------|---------|------|
| 简单 AB 测试 | ε-greedy | 实现简单 |
| 广告/推荐 (有上下文) | LinUCB / Neural Bandit | 利用特征 |
| 冷启动问题 | Thompson Sampling | 贝叶斯先验 |
| 对抗环境 | EXP3 | 最坏情况保证 |
| 多目标优化 | Pareto UCB | 多目标权衡 |
| LLM 路由 | Contextual TS | 上下文+不确定性 |
| 超参搜索 | GP-UCB (贝叶斯优化) | 连续空间 |

## 6. 交叉引用

- [[06_强化学习/01_RL_Foundations/RL_Foundations|强化学习基础]]
- [[06_强化学习/01_RL_Foundations/RL_Foundations_for_dummy|RL 入门]]
- [[06_强化学习/02_Deep_RL/Exploration_Strategies_Deep_Dive|探索策略]]
- [[02_机器学习/13_Learning_Paradigms/Online_Learning|在线学习]]
- [[01_数学基础/03_Probability_Statistics/|概率统计]]
- [[15_智能体/|智能体决策]]
