---
title: "Multi-Agent Reinforcement Learning"
tags: [reinforcement-learning, multi-agent, MARL, cooperative, competitive, production]
status: complete
last_updated: 2026-07-02
---

# Multi-Agent Reinforcement Learning (MARL)

## Overview

Multi-Agent Reinforcement Learning extends single-agent RL to environments where **multiple agents** interact simultaneously. This is essential for modeling real-world systems: autonomous vehicle coordination, trading markets, robotic swarms, and game AI.

## MARL Taxonomy

### By Interaction Type

| Type | Description | Examples |
|------|-------------|----------|
| **Cooperative** | Agents share a common goal | Robot teams, traffic control |
| **Competitive** | Zero-sum, opposing goals | Games, auctions |
| **Mixed** | Both cooperative and competitive | MOBA games, negotiations |
| **Independent** | Agents ignore each other | Simple multi-robot |

### By Information Setting

| Setting | Description | Challenge |
|---------|-------------|-----------|
| **Fully Observable** | All agents see global state | Coordination complexity |
| **Partially Observable** | Each agent sees local observation | Communication, inference |
| **Centralized Training, Decentralized Execution (CTDE)** | Shared info during training, local at test time | Most practical |

### By Architecture

```
MARL Architectures
├── Independent Learners (IL)
│   ├── Independent Q-Learning (IQL)
│   ├── Independent PPO
│   └── Simple but non-stationary
├── Centralized Training (CTDE)
│   ├── QMIX: Monotonic value factorization
│   ├── MAPPO: Multi-Agent PPO
│   ├── MADDPG: Multi-Agent DDPG
│   ├── CommNet: Learned communication
│   └── Most successful in practice
├── Communication-Based
│   ├── TarMAC: Targeted attention communication
│   ├── NeurComm: Neural communication
│   └── Agents learn to communicate
└── Population-Based
    ├── PSRO: Policy-Space Response Oracle
    ├── Self-play
    └── Open-ended learning
```

## Core Algorithms

### QMIX (Cooperative MARL)

```python
class QMixer(nn.Module):
    """Monotonic value function factorization."""
    def __init__(self, n_agents, state_dim, hidden_dim=32):
        super().__init__()
        self.n_agents = n_agents
        self.hyper_w1 = nn.Linear(state_dim, hidden_dim * n_agents)
        self.hyper_w2 = nn.Linear(state_dim, hidden_dim)
        self.hyper_b1 = nn.Linear(state_dim, hidden_dim)
        self.hyper_b2 = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1)
        )
    
    def forward(self, agent_qs, states):
        # agent_qs: (batch, n_agents)
        # states: (batch, state_dim)
        bs = agent_qs.size(0)
        
        w1 = torch.abs(self.hyper_w1(states)).view(bs, self.n_agents, -1)
        w2 = torch.abs(self.hyper_w2(states)).view(bs, -1, 1)
        b1 = self.hyper_b1(states).view(bs, 1, -1)
        b2 = self.hyper_b2(states).view(bs, 1, 1)
        
        hidden = F.elu(torch.bmm(agent_qs.unsqueeze(1), w1) + b1)
        q_tot = torch.bmm(hidden, w2) + b2
        return q_tot.squeeze(-1)
```

### MAPPO (Multi-Agent PPO)

```python
class MAPPO:
    """Centralized training with decentralized execution."""
    
    def __init__(self, n_agents, obs_dim, act_dim):
        self.agents = [PPOAgent(obs_dim, act_dim) for _ in range(n_agents)]
        self.critic = CentralizedCritic(n_agents * obs_dim)  # Sees all obs
    
    def update(self, batch):
        # Centralized critic uses global state
        all_obs = torch.cat([batch.obs[i] for i in range(self.n_agents)], dim=-1)
        values = self.critic(all_obs)
        advantages = compute_gae(batch.rewards, values)
        
        # Each agent updates its own policy (decentralized)
        for i, agent in enumerate(self.agents):
            agent.update(batch.obs[i], batch.actions[i], advantages)
        
        # Update centralized critic
        self.critic.update(all_obs, batch.returns)
```

### MADDPG (Multi-Agent DDPG)

```python
class MADDPGAgent:
    """Each agent has actor (local obs) and critic (all obs/acts)."""
    
    def __init__(self, agent_id, obs_dim, act_dim, all_obs_dim, all_act_dim):
        self.actor = Actor(obs_dim, act_dim)
        self.critic = Critic(all_obs_dim + all_act_dim)
        self.target_actor = copy.deepcopy(self.actor)
        self.target_critic = copy.deepcopy(self.critic)
    
    def update_critic(self, all_obs, all_actions, rewards, next_all_obs, dones):
        # Critic sees everything (centralized)
        next_actions = [agent.target_actor(next_obs) 
                       for agent, next_obs in zip(agents, next_all_obs)]
        next_all_actions = torch.cat(next_actions, dim=-1)
        target_q = rewards + self.gamma * self.target_critic(
            next_all_obs, next_all_actions) * (1 - dones)
        current_q = self.critic(all_obs, all_actions)
        critic_loss = F.mse_loss(current_q, target_q.detach())
        return critic_loss
    
    def update_actor(self, own_obs, all_obs, all_actions):
        # Actor only uses own observation (decentralized)
        own_action = self.actor(own_obs)
        # Combine with other agents' actions (detached)
        actor_loss = -self.critic(all_obs, combined_actions).mean()
        return actor_loss
```

## Communication Mechanisms

### Learned Communication

```python
class CommNet(nn.Module):
    """Agents communicate through learned messages."""
    
    def __init__(self, obs_dim, hidden_dim, n_agents, n_comm_rounds=2):
        super().__init__()
        self.encoder = nn.Linear(obs_dim, hidden_dim)
        self.comm_layers = nn.ModuleList([
            nn.Linear(hidden_dim * 2, hidden_dim) for _ in range(n_comm_rounds)
        ])
        self.policy = nn.Linear(hidden_dim, n_actions)
    
    def forward(self, observations):
        # Encode observations
        h = self.encoder(observations)  # (n_agents, hidden_dim)
        
        for comm_layer in self.comm_layers:
            # Broadcast: each agent receives mean of all messages
            mean_msg = h.mean(dim=0, keepdim=True).expand_as(h)
            # Combine own state with received messages
            h = F.relu(comm_layer(torch.cat([h, mean_msg], dim=-1)))
        
        return self.policy(h)
```

### Communication Topology

| Topology | Description | Use Case |
|----------|-------------|----------|
| Fully connected | All-to-all | Small teams |
| Star | Central coordinator | Leader-follower |
| Ring | Neighbors only | Spatial agents |
| Learned | Attention-based routing | Dynamic teams |
| No communication | Implicit coordination | Robust deployment |

## Reward Design for MARL

### Common Reward Structures

| Structure | Formula | Pros | Cons |
|-----------|---------|------|------|
| Shared | r_i = R(global) | Simple, cooperative | Lazy agent problem |
| Individual | r_i = R(agent_i) | Clear credit | May not align with team |
| Difference | r_i = R(global) - R(others) | Credit assignment | Complex |
| Shaped | r_i = R(global) + λ·R(individual) | Balanced | Hyperparameter tuning |

### Credit Assignment Methods

1. **COMA**: Counterfactual credit assignment
2. **Shapley Q-values**: Game-theoretic attribution
3. **Difference Rewards**: Individual contribution
4. **Attention-based**: Learned credit assignment

## Training Challenges

### Non-Stationarity

Each agent's optimal policy depends on other agents' policies, which change during training.

**Solutions:**
- Experience replay with policy snapshots
- Population-based training
- Self-play with historical opponents
- Centralized value functions

### Scalability

| Agents | Challenge | Solution |
|--------|-----------|----------|
| 2-10 | Coordination | CTDE methods |
| 10-100 | Communication overhead | Parameter sharing, mean-field |
| 100-1000 | Computation | Mean-field approximation |
| 1000+ | Abstraction | Hierarchical MARL |

### Mean-Field MARL

```python
class MeanFieldQ(nn.Module):
    """Scale to many agents via mean-field approximation."""
    
    def forward(self, own_obs, mean_action):
        # Replace pairwise interactions with mean field
        own_feat = self.obs_encoder(own_obs)
        mean_feat = self.mean_encoder(mean_action)
        combined = own_feat + mean_feat  # Additive interaction
        return self.q_head(combined)
```

## MARL Environments

| Environment | Agents | Type | Observation | Action |
|-------------|--------|------|-------------|--------|
| StarCraft II (SMAC) | 2-27 | Cooperative | Partial | Discrete |
| Multi-Agent Particle Env | 2-10 | Mixed | Full | Continuous |
| Hanabi | 2-5 | Cooperative | Partial | Discrete |
| OpenSpiel | Variable | Mixed | Varies | Varies |
| PettingZoo | Variable | Mixed | Varies | Varies |
| Neural MMO | 100+ | Competitive | Partial | Discrete |
| Overcooked | 2-4 | Cooperative | Full | Discrete |

## Production Applications

### Autonomous Vehicle Coordination

```python
class IntersectionMARL:
    """Multi-agent RL for traffic intersection control."""
    
    def __init__(self, n_vehicles):
        self.agents = [VehicleAgent() for _ in range(n_vehicles)]
        self.shared_reward = traffic_flow_reward  # Cooperative
    
    def step(self, observations):
        # Each vehicle decides acceleration/steering
        actions = {}
        for i, agent in enumerate(self.agents):
            # Agent sees local traffic + communicated intent
            local_obs = observations[i]
            intent_msgs = self.receive_intents(i)
            actions[i] = agent.act(local_obs, intent_msgs)
        return actions
```

### Trading and Finance

- Market making with multiple competing agents
- Portfolio optimization with agent teams
- Risk management through diverse strategies

### Robotic Swarms

- Warehouse multi-robot coordination
- Drone fleet formation control
- Collaborative manipulation

## 2026 Trends

1. **Foundation MARL Models**: Pre-trained multi-agent policies
2. **LLM-Augmented MARL**: Language-conditioned coordination
3. **Scalable MARL**: 10K+ agent coordination
4. **Real-World Deployment**: Sim-to-real for multi-robot systems
5. **Emergent Communication**: Protocols in language models

## Related Topics

- [[RL_Foundations]]: Single-agent RL fundamentals
- [[RLHF_DPO_GRPO_Deep_Dive]]: RL for LLM alignment
- [[06_Reinforcement_Learning/Robotics_Embodied_AI/Embodied_AI_2026]]: Multi-robot systems
- [[15_Agent_Production/Agent_Frameworks/README]]: Multi-agent AI frameworks
