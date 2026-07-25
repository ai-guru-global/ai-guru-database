---
title: Decision Transformer 与轨迹建模
category: 04-reinforcement-learning
tags: ["decision-transformer", "trajectory-modeling", "offline-rl", "sequence-modeling", "return-conditioned"]
summary: "Decision Transformer 完整技术体系：将 RL 问题转化为序列建模，覆盖 RTG 条件生成、QDT、Elastic DT、在线 DT 以及 2026 在机器人/游戏/LLM Agent 中的应用。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# Decision Transformer 与轨迹建模

## 1. 核心思想：RL as Sequence Modeling

### 1.1 范式转换

```
传统 RL:
  状态 s → 策略 π(a|s) → 动作 a → 奖励 r → 下一状态 s'
  核心: 学习价值函数 / 策略梯度
  问题: 需要折扣回报、时序差分、探索策略...

Decision Transformer:
  轨迹 τ = (R̂₁, s₁, a₁, R̂₂, s₂, a₂, ..., R̂_T, s_T, a_T)
  核心: 把 RL 变成"给定目标回报，预测动作"的序列问题
  优势: 无需价值函数、无需折扣、无需 TD 学习

类比:
  传统 RL = 学下棋 (通过无数次对弈试错)
  DT = 看高手棋谱 (给定"我要赢"这个目标，模仿高手走法)
```

### 1.2 输入格式

```python
# Decision Transformer 的输入三元组:
# (Return-to-Go, State, Action) × T 步

# Return-to-Go (RTG): 从当前步到结束的累积回报
# R̂_t = r_t + r_{t+1} + ... + r_T

# 输入序列 (上下文窗口 K=20):
# [R̂_{t-K}, s_{t-K}, a_{t-K}, ..., R̂_t, s_t, a_t]
#  ↓         ↓        ↓              ↓      ↓      ↓
# GPT token: [RTG] [STATE] [ACTION] ... [RTG] [STATE] [ACTION→预测]

# 推理时:
# 1. 设定期望回报 R̂_1 = target_return (如: 最高分)
# 2. 输入当前状态 s_1
# 3. 模型输出动作 a_1
# 4. 执行动作，获得奖励 r_1
# 5. 更新 R̂_2 = R̂_1 - r_1
# 6. 重复
```

## 2. 模型架构

### 2.1 核心实现

```python
import torch
import torch.nn as nn
import math

class DecisionTransformer(nn.Module):
    """
    Decision Transformer: GPT 架构 + RL 语义
    输入: (RTG, state, action) 三元组序列
    输出: 预测的动作
    """
    def __init__(self, state_dim, action_dim, hidden_dim=128,
                 n_layers=3, n_heads=4, max_length=1024,
                 max_ep_len=4096, action_tanh=True):
        super().__init__()
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.hidden_dim = hidden_dim
        self.max_length = max_length
        
        # Token 嵌入 (三种输入各自投影)
        self.embed_rtg = nn.Sequential(
            nn.Linear(1, hidden_dim), nn.Tanh()
        )
        self.embed_state = nn.Sequential(
            nn.Linear(state_dim, hidden_dim), nn.Tanh()
        )
        self.embed_action = nn.Sequential(
            nn.Linear(action_dim, hidden_dim), nn.Tanh()
        )
        
        # 位置编码 (每个时间步有 3 个 token)
        self.embed_timestep = nn.Embedding(max_ep_len, hidden_dim)
        self.embed_ln = nn.LayerNorm(hidden_dim)
        
        # GPT 骨干
        decoder_layer = nn.TransformerDecoderLayer(
            d_model=hidden_dim, nhead=n_heads,
            dim_feedforward=hidden_dim * 4, dropout=0.1,
            batch_first=True
        )
        self.transformer = nn.TransformerDecoder(
            decoder_layer, num_layers=n_layers
        )
        
        # 动作预测头
        self.predict_action = nn.Sequential(
            nn.Linear(hidden_dim, action_dim),
            nn.Tanh() if action_tanh else nn.Identity()
        )
    
    def forward(self, rtgs, states, actions, timesteps):
        """
        输入:
          rtgs: (B, T, 1)     - Return-to-Go
          states: (B, T, state_dim)
          actions: (B, T, action_dim)
          timesteps: (B, T)   - 时间步索引
        输出:
          action_preds: (B, T, action_dim)
        """
        B, T = states.shape[0], states.shape[1]
        
        # 嵌入
        time_emb = self.embed_timestep(timesteps)  # (B, T, H)
        rtg_emb = self.embed_rtg(rtgs) + time_emb
        state_emb = self.embed_state(states) + time_emb
        action_emb = self.embed_action(actions) + time_emb
        
        # 交错排列: [RTG_1, s_1, a_1, RTG_2, s_2, a_2, ...]
        # 形状: (B, 3T, H)
        h = torch.stack([rtg_emb, state_emb, action_emb], dim=2)
        h = h.reshape(B, 3 * T, self.hidden_dim)
        h = self.embed_ln(h)
        
        # Causal mask
        mask = torch.triu(
            torch.ones(3*T, 3*T, device=h.device), diagonal=1
        ).bool()
        
        # Transformer 前向
        h = self.transformer(h, h, tgt_mask=mask)
        
        # 取 state 位置的输出预测动作
        # state 在位置 1, 4, 7, ... (即 3k+1)
        state_positions = torch.arange(1, 3*T, 3, device=h.device)
        h_states = h[:, state_positions]  # (B, T, H)
        
        action_preds = self.predict_action(h_states)
        return action_preds
    
    def get_action(self, rtgs, states, actions, timesteps):
        """推理: 只取最后一个时间步的动作"""
        action_preds = self.forward(rtgs, states, actions, timesteps)
        return action_preds[:, -1]  # 最后一步的预测
```

### 2.2 推理循环

```python
class DTAgent:
    """Decision Transformer 推理 Agent"""
    
    def __init__(self, model, state_dim, action_dim, 
                 max_context=20, target_return=1000.0):
        self.model = model
        self.max_context = max_context
        self.target_return = target_return
        
        # 轨迹缓存
        self.states = []
        self.actions = []
        self.rtgs = []
        self.timestep = 0
    
    def reset(self, target_return=None):
        """新 episode"""
        self.states = []
        self.actions = []
        self.rtgs = []
        self.timestep = 0
        if target_return:
            self.target_return = target_return
    
    def act(self, state):
        """给定状态，返回动作"""
        self.states.append(state)
        self.rtgs.append(self.target_return)
        
        # 准备输入 (取最近 K 步)
        K = min(len(self.states), self.max_context)
        
        rtgs = torch.tensor(self.rtgs[-K:], dtype=torch.float32)
        states = torch.tensor(self.states[-K:], dtype=torch.float32)
        actions = torch.zeros(K, self.model.action_dim)
        if len(self.actions) > 0:
            actions[:len(self.actions[-K:])] = torch.tensor(
                self.actions[-K:], dtype=torch.float32
            )
        timesteps = torch.arange(
            self.timestep - K + 1, self.timestep + 1
        )
        
        # 添加 batch 维度
        rtgs = rtgs.unsqueeze(0).unsqueeze(-1)      # (1, K, 1)
        states = states.unsqueeze(0)                 # (1, K, state_dim)
        actions = actions.unsqueeze(0)               # (1, K, action_dim)
        timesteps = timesteps.unsqueeze(0)           # (1, K)
        
        with torch.no_grad():
            action = self.model.get_action(
                rtgs, states, actions, timesteps
            )
        
        action = action.squeeze(0).numpy()
        self.actions.append(action)
        self.timestep += 1
        return action
    
    def update_rtg(self, reward):
        """获得奖励后更新 RTG"""
        self.target_return -= reward
```

## 3. 重要变体

### 3.1 QDT (Q-Learning + Decision Transformer)

```python
# QDT: 用 Q 学习确定 target_return，解决"设多高"的问题
# 论文: "QDT: Q-Learning Decision Transformer" (2023)

class QDT:
    """
    问题: DT 需要人工设定 target_return
    解决: 用离线 Q 学习估计最优回报
    
    流程:
    1. 离线训练 Q 函数 (CQL/IQL)
    2. 用 Q(s_0) 作为 target_return
    3. DT 条件生成
    """
    def __init__(self, dt_model, q_function):
        self.dt = dt_model
        self.q = q_function
    
    def get_target_return(self, initial_state):
        """用 Q 函数估计最优回报"""
        with torch.no_grad():
            q_value = self.q(initial_state)
        return q_value.item()
    
    def act(self, state, is_first_step=False):
        if is_first_step:
            target = self.get_target_return(state)
            self.dt_agent.reset(target_return=target)
        return self.dt_agent.act(state)
```

### 3.2 Elastic Decision Transformer (EDT)

```python
# EDT: 支持可变长度历史，更灵活
# 论文: "Elastic Decision Transformer" (2023)

class ElasticDT(DecisionTransformer):
    """
    标准 DT: 固定上下文窗口 K
    EDT: 动态调整历史长度
    
    优势:
    - 短历史: 快速响应 (低延迟)
    - 长历史: 利用更多上下文 (高精度)
    - 自动学习最优历史长度
    """
    def __init__(self, *args, history_lengths=[1, 5, 10, 20], **kwargs):
        super().__init__(*args, **kwargs)
        self.history_lengths = history_lengths
        # 历史长度选择器
        self.length_selector = nn.Linear(
            self.hidden_dim, len(history_lengths)
        )
    
    def forward_with_elastic_history(self, full_trajectory):
        """自动选择最优历史长度"""
        # 对每种历史长度计算预测
        predictions = {}
        for K in self.history_lengths:
            truncated = full_trajectory[-K:]
            pred = self.forward(*truncated)
            predictions[K] = pred
        
        # 学习选择最优长度
        # (训练时用真实动作作为监督)
        return predictions
```

### 3.3 Online Decision Transformer

```python
# Online DT: 结合在线 RL 数据，持续改进
# 论文: "Online Decision Transformer" (2022)

class OnlineDT:
    """
    离线 DT 的问题: 只能模仿数据中的行为
    Online DT: 在线交互 + 探索 + 更新
    
    关键: 用高回报的在线数据增强训练集
    """
    def __init__(self, dt_model, replay_buffer, 
                 exploration_noise=0.1):
        self.model = dt_model
        self.buffer = replay_buffer
        self.noise = exploration_noise
    
    def act_with_exploration(self, state):
        """带探索的动作选择"""
        action = self.dt_agent.act(state)
        # 添加探索噪声
        noise = np.random.normal(0, self.noise, size=action.shape)
        return action + noise
    
    def update(self, batch_size=64):
        """混合离线+在线数据更新"""
        # 从 replay buffer 采样高回报轨迹
        online_batch = self.buffer.sample_high_return(batch_size // 2)
        offline_batch = self.offline_data.sample(batch_size // 2)
        
        # 合并训练
        combined = merge_batches(online_batch, offline_batch)
        loss = self.model.compute_loss(*combined)
        loss.backward()
        self.optimizer.step()
```

## 4. 2026 应用场景

### 4.1 机器人控制

```python
# DT 在机器人中的优势:
# 1. 离线数据 → 无需在线试错 (安全)
# 2. 多任务: 不同 target_return → 不同行为
# 3. 长时域: Transformer 处理长序列

# 2026 实践: RT-2 / Octo 等 VLA 模型融合 DT 思想
# 视觉-语言-动作模型 = DT 的多模态扩展

# 示例: 机械臂抓取
robot_dt_config = {
    "state_dim": 29,       # 关节角(7) + 末端位姿(7) + 物体位姿(7) + 图像特征(8)
    "action_dim": 7,       # 7-DoF 关节速度
    "target_return": 1.0,  # 成功抓取 = 1.0
    "max_ep_len": 200,     # 最多 200 步
    "context_window": 50,  # 看最近 50 步
}
```

### 4.2 LLM Agent 决策

```python
# 2026 趋势: 用 DT 思想指导 LLM Agent
# 将 Agent 的任务执行视为轨迹:
# (目标回报, 观察, 动作) = (任务目标, 环境状态, Agent 行为)

class LLMDecisionAgent:
    """
    融合 DT 思想的 LLM Agent:
    - RTG → 任务完成度目标
    - State → 当前环境/对话状态
    - Action → 工具调用/回复
    """
    def __init__(self, llm, tools, target_score=1.0):
        self.llm = llm
        self.tools = tools
        self.target_score = target_score
        self.trajectory = []
    
    def step(self, observation):
        """DT 风格的 Agent 决策"""
        # 构造 prompt (包含轨迹历史 + 目标)
        prompt = f"""
目标完成度: {self.target_score:.2f}
历史轨迹:
{self.format_trajectory()}

当前观察: {observation}

请选择下一步动作 (工具调用或最终回答):
"""
        action = self.llm.generate(prompt)
        self.trajectory.append((self.target_score, observation, action))
        return action
```

## 5. 训练技巧

### 5.1 数据预处理

```python
def preprocess_trajectories(dataset, discount=1.0):
    """
    将离线 RL 数据集转换为 DT 格式
    关键: 计算 Return-to-Go
    """
    processed = []
    for trajectory in dataset:
        rewards = trajectory["rewards"]
        states = trajectory["observations"]
        actions = trajectory["actions"]
        
        # 计算 RTG (从后往前累加)
        rtgs = np.zeros_like(rewards)
        rtg = 0
        for t in reversed(range(len(rewards))):
            rtg = rewards[t] + discount * rtg
            rtgs[t] = rtg
        
        # 百分位归一化 (重要!)
        # 将 RTG 归一化到 [0, 1] 或 [0, 100]
        max_return = dataset.get_max_return()
        rtgs_normalized = rtgs / max_return * 100
        
        processed.append({
            "rtgs": rtgs_normalized,
            "states": states,
            "actions": actions,
            "timesteps": np.arange(len(states)),
        })
    return processed
```

### 5.2 关键超参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| context_length (K) | 20-100 | 上下文窗口，越长越好但越慢 |
| n_layers | 3-6 | 中等深度即可 |
| hidden_dim | 128-512 | 取决于状态/动作复杂度 |
| learning_rate | 1e-4 | AdamW |
| weight_decay | 1e-4 | 正则化 |
| warmup_steps | 10000 | 线性预热 |
| dropout | 0.1 | 防过拟合 |
| target_return | 数据集 99 分位 | 设太高会失败 |

## 6. DT vs 传统离线 RL

| 维度 | Decision Transformer | CQL/IQL |
|------|---------------------|---------|
| 核心思想 | 序列建模 | 价值/策略优化 |
| 需要折扣因子 | 否 | 是 |
| 需要 TD 学习 | 否 | 是 |
| 外推能力 | 弱 (只能模仿) | 强 (可超越数据) |
| 长时域 | 强 (Transformer) | 弱 (折扣衰减) |
| 多任务 | 天然 (不同 RTG) | 需多模型 |
| 训练稳定性 | 高 (监督学习) | 中 (RL 不稳定) |
| 推理速度 | 慢 (自回归) | 快 (单次前向) |

## 7. 交叉引用

- [[06_强化学习/02_Deep_RL/Deep_RL|深度强化学习总论]]
- [[06_强化学习/02_Deep_RL/Offline_RL_Deep_Dive|离线强化学习]]
- [[06_强化学习/02_Deep_RL/PPO_Deep_Dive|PPO 算法]]
- [[06_强化学习/04_RL_Applications/RL_for_LLM_Reasoning|RL 驱动 LLM 推理]]
- [[03_深度学习/Attention_Mechanisms|注意力机制]]
- [[15_智能体/|智能体系统]]
