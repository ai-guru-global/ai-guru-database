---
title: 推理模型训练流水线 (Reasoning RL Training Pipeline)
category: 02-llm
tags: ["reasoning-model", "rl-training", "grpo", "prm", "test-time-compute", "o1"]
summary: "推理模型完整训练流水线：从数据准备到 RL 训练到推理时搜索，覆盖 OpenAI o系列/DeepSeek R1/QwQ 的训练方法论、奖励设计、课程学习与 2026 最佳实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 推理模型训练流水线

## 1. 推理模型训练全景

### 1.1 训练阶段概览

```
推理模型训练 = 预训练 + 后训练 (Post-Training)

后训练流水线:
┌─────────────────────────────────────────────────────────┐
│ Stage 1: 冷启动 SFT (Cold Start)                        │
│   - 少量高质量推理链 (1K-10K)                            │
│   - 教会模型"思考格式"                                   │
│   - 可选: 蒸馏自更强模型                                 │
├─────────────────────────────────────────────────────────┤
│ Stage 2: 推理 RL (Reasoning RL)                         │
│   - GRPO/PPO + 规则奖励                                 │
│   - 大规模数学/代码/逻辑题                               │
│   - 模型自主探索推理路径                                  │
│   - 涌现: 反思/回溯/验证/分解                            │
├─────────────────────────────────────────────────────────┤
│ Stage 3: 通用对齐 (General Alignment)                    │
│   - 标准 RLHF/DPO (对话/指令跟随)                       │
│   - 安全对齐                                            │
│   - 多轮对话能力                                         │
├─────────────────────────────────────────────────────────┤
│ Stage 4: 推理时扩展 (Test-Time Scaling)                  │
│   - Best-of-N / MCTS / 自我验证                          │
│   - 长思考 (Long Thinking)                               │
│   - 自适应计算分配                                       │
└─────────────────────────────────────────────────────────┘
```

### 1.2 各模型训练策略对比

| 模型 | 冷启动 | RL 算法 | 奖励 | 推理时 |
|------|--------|---------|------|--------|
| OpenAI o1 | 有 SFT | PPO (推测) | PRM+ORM | 长 CoT |
| DeepSeek R1 | 极少/无 | GRPO | 规则验证 | 长 CoT |
| QwQ (Qwen) | 有 SFT | GRPO | 规则+PRM | 长 CoT |
| Kimi k1.5 | 有 SFT | GRPO | 规则验证 | 自适应 |
| OpenAI o3 | 有 SFT | PPO (推测) | PRM+搜索 | MCTS |

## 2. Stage 1: 冷启动 SFT

### 2.1 数据构造

```python
class ColdStartDataBuilder:
    """
    冷启动数据: 教会模型"思考的格式"
    
    关键: 数据质量 >> 数据数量
    通常 1K-10K 条高质量推理链就够
    """
    def __init__(self, teacher_model=None):
        self.teacher = teacher_model  # 可选: 从强模型蒸馏
    
    def build_math_data(self, problems, solutions):
        """构造数学推理数据"""
        data = []
        for prob, sol in zip(problems, solutions):
            # 格式: 问题 → 思考过程 → 最终答案
            item = {
                "messages": [
                    {"role": "user", "content": prob},
                    {"role": "assistant", "content": self.format_reasoning(sol)}
                ]
            }
            data.append(item)
        return data
    
    def format_reasoning(self, solution):
        """格式化为思考链"""
        return f"""<think>
{solution['reasoning_steps']}
</think>

{solution['final_answer']}"""
    
    def distill_from_teacher(self, problems, n_samples=4):
        """从教师模型蒸馏推理链"""
        data = []
        for prob in problems:
            # 教师生成多个推理链
            responses = self.teacher.generate(
                prob, n=n_samples, temperature=0.7
            )
            # 过滤: 只保留答案正确的
            correct = [r for r in responses if self.verify(r, prob)]
            if correct:
                # 选最短的正确推理链 (简洁性)
                best = min(correct, key=len)
                data.append({
                    "messages": [
                        {"role": "user", "content": prob},
                        {"role": "assistant", "content": best}
                    ]
                })
        return data
```

### 2.2 冷启动训练配置

```python
cold_start_config = {
    # 数据
    "n_samples": 2000,          # 2K 条就够
    "domains": ["math", "code", "logic"],
    "max_reasoning_length": 8192,  # 允许长推理链
    
    # 训练
    "learning_rate": 1e-5,      # 标准 SFT 学习率
    "epochs": 3,
    "warmup_ratio": 0.1,
    "batch_size": 32,
    
    # 关键: 不要过拟合!
    "early_stopping": True,
    "eval_steps": 100,
}
```

## 3. Stage 2: 推理 RL 训练

### 3.1 数据准备

```python
class ReasoningRLData:
    """
    推理 RL 数据: 只需要 (问题, 答案) 对
    不需要推理链! 模型自己探索
    """
    def __init__(self):
        self.sources = {
            "math": {
                "datasets": ["MATH", "GSM8K", "AIME", "AMC", "Olympiad"],
                "n_problems": 50000,
                "verify": "symbolic",  # 符号验证
            },
            "code": {
                "datasets": ["HumanEval", "MBPP", "CodeContests", "LiveCodeBench"],
                "n_problems": 20000,
                "verify": "execution",  # 执行验证
            },
            "logic": {
                "datasets": ["ARC", "LSAT", "LogiQA"],
                "n_problems": 10000,
                "verify": "exact_match",
            },
            "science": {
                "datasets": ["GPQA", "SciQ", "MMLU-STEM"],
                "n_problems": 15000,
                "verify": "multiple_choice",
            },
        }
    
    def prepare(self):
        """准备训练数据"""
        all_problems = []
        for domain, config in self.sources.items():
            for ds_name in config["datasets"]:
                ds = load_dataset(ds_name)
                for item in ds:
                    all_problems.append({
                        "prompt": item["problem"],
                        "answer": item["answer"],
                        "domain": domain,
                        "difficulty": item.get("difficulty", "medium"),
                        "verify_type": config["verify"],
                    })
        return all_problems
```

### 3.2 GRPO 训练循环

```python
import torch
from transformers import AutoModelForCausalLM

class ReasoningRLTrainer:
    """推理 RL 训练器 (GRPO)"""
    
    def __init__(self, model_name, config):
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name, torch_dtype=torch.bfloat16
        )
        self.ref_model = AutoModelForCausalLM.from_pretrained(
            model_name, torch_dtype=torch.bfloat16
        )
        self.ref_model.eval()
        for p in self.ref_model.parameters():
            p.requires_grad = False
        
        self.config = config
        self.optimizer = torch.optim.AdamW(
            self.model.parameters(), lr=config.lr
        )
    
    def train_step(self, batch_problems):
        """一个训练步"""
        total_loss = 0
        
        for problem in batch_problems:
            prompt = problem["prompt"]
            answer = problem["answer"]
            
            # 1. 生成一组回答 (Group)
            responses = self.generate_group(prompt, 
                n=self.config.group_size,  # 16
                temperature=1.0,
                max_tokens=4096
            )
            
            # 2. 计算奖励
            rewards = torch.tensor([
                self.compute_reward(resp, answer, problem["verify_type"])
                for resp in responses
            ])
            
            # 3. 过滤: 全对或全错的跳过 (无学习信号)
            if rewards.std() < 1e-6:
                continue
            
            # 4. 组内归一化
            advantages = (rewards - rewards.mean()) / (rewards.std() + 1e-8)
            
            # 5. 策略梯度
            for i, resp in enumerate(responses):
                log_prob = self.get_log_prob(prompt, resp)
                ref_log_prob = self.get_ref_log_prob(prompt, resp)
                
                # PPO-clip 风格
                ratio = torch.exp(log_prob - log_prob.detach())
                clipped = torch.clamp(ratio, 0.8, 1.2)
                
                policy_loss = -torch.min(
                    advantages[i] * ratio,
                    advantages[i] * clipped
                )
                
                # KL 惩罚
                kl = log_prob - ref_log_prob
                
                total_loss += policy_loss + self.config.beta * kl
        
        # 反向传播
        total_loss /= len(batch_problems)
        total_loss.backward()
        torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)
        self.optimizer.step()
        self.optimizer.zero_grad()
        
        return total_loss.item()
    
    def compute_reward(self, response, answer, verify_type):
        """计算奖励"""
        # 提取答案
        predicted = self.extract_answer(response)
        
        # 正确性 (0 或 1)
        if verify_type == "symbolic":
            correct = symbolic_verify(predicted, answer)
        elif verify_type == "execution":
            correct = execute_verify(response, answer)
        elif verify_type == "exact_match":
            correct = predicted.strip() == answer.strip()
        else:
            correct = predicted.strip().upper() == answer.strip().upper()
        
        reward = 1.0 if correct else 0.0
        
        # 格式奖励 (鼓励结构化思考)
        if "<think>" in response and "</think>" in response:
            reward += 0.05
        
        # 轻微长度惩罚 (防止无限循环)
        if len(response) > 8000:
            reward -= 0.1
        
        return max(0, reward)
```

### 3.3 课程学习策略

```python
class CurriculumScheduler:
    """
    课程学习: 从易到难
    关键: 太难的题模型全错 → 无学习信号
    太简单的全对 → 也无信号
    最佳: 正确率在 30%-70% 的题
    """
    def __init__(self, problems):
        self.problems = problems
        self.difficulty_scores = {}  # 动态难度估计
    
    def sample_batch(self, batch_size, epoch, total_epochs):
        """根据训练进度调整难度"""
        progress = epoch / total_epochs
        
        # 目标正确率: 从 70% 逐渐降到 30%
        target_accuracy = 0.7 - 0.4 * progress
        
        # 筛选合适难度的题
        suitable = []
        for p in self.problems:
            acc = self.difficulty_scores.get(p["prompt"], 0.5)
            if abs(acc - target_accuracy) < 0.2:
                suitable.append(p)
        
        # 不够就放宽
        if len(suitable) < batch_size:
            suitable = self.problems
        
        return random.sample(suitable, min(batch_size, len(suitable)))
    
    def update_difficulty(self, prompt, accuracy):
        """更新题目的动态难度"""
        # EMA 更新
        old = self.difficulty_scores.get(prompt, 0.5)
        self.difficulty_scores[prompt] = 0.7 * old + 0.3 * accuracy
```

## 4. Stage 3: 通用对齐

```python
# 推理 RL 后，模型可能:
# - 过于"学术化" (只会做题)
# - 对话能力退化
# - 安全性下降

# 解决: 标准对齐训练
general_alignment_config = {
    "method": "DPO",  # 或 KTO
    "data": {
        "conversation": 50000,    # 多轮对话
        "instruction": 30000,     # 指令跟随
        "safety": 10000,          # 安全拒绝
        "creative": 10000,        # 创意写作
    },
    "beta": 0.1,
    "epochs": 1,
    "lr": 5e-7,
    
    # 关键: 保持推理能力!
    "mix_reasoning_data": True,   # 混入 20% 推理题
    "reasoning_ratio": 0.2,
}
```

## 5. Stage 4: 推理时扩展

### 5.1 自适应计算

```python
class AdaptiveTestTimeCompute:
    """
    2026 趋势: 根据问题难度自适应分配计算
    
    简单问题 → 短思考 (几百 token)
    复杂问题 → 长思考 (几千到几万 token)
    """
    def __init__(self, model, max_budget=32768):
        self.model = model
        self.max_budget = max_budget
    
    def solve(self, problem):
        # 1. 快速评估难度
        difficulty = self.estimate_difficulty(problem)
        
        # 2. 分配计算预算
        budget = self.allocate_budget(difficulty)
        
        # 3. 在预算内推理
        if difficulty < 0.3:
            # 简单: 直接回答
            return self.model.generate(problem, max_tokens=512)
        elif difficulty < 0.7:
            # 中等: 标准 CoT
            return self.model.generate(problem, max_tokens=4096)
        else:
            # 困难: 长思考 + 自我验证
            return self.long_thinking(problem, budget)
    
    def long_thinking(self, problem, budget):
        """长思考: 多轮推理 + 验证"""
        response = self.model.generate(
            problem, max_tokens=budget, temperature=0.6
        )
        
        # 自我验证
        if self.needs_verification(response):
            verify_prompt = f"验证: {problem}\n解答: {response}\n请检查错误"
            verified = self.model.generate(verify_prompt, max_tokens=2048)
            return verified
        
        return response
```

## 6. 监控与调试

### 6.1 训练监控指标

```python
TRAINING_METRICS = {
    # 核心指标
    "reward_mean": "平均奖励 (应稳步上升)",
    "reward_std": "奖励方差 (太小=无信号)",
    "accuracy": "正确率 (目标: 30%-70%)",
    "kl_divergence": "KL 散度 (不应太大)",
    
    # 行为指标
    "response_length": "回答长度 (监控是否退化)",
    "think_length": "思考链长度",
    "reflection_rate": "反思出现频率",
    "backtrack_rate": "回溯出现频率",
    
    # 健康指标
    "grad_norm": "梯度范数 (应稳定)",
    "loss_spike": "损失尖峰 (需要处理)",
    "mode_collapse": "模式坍缩检测",
}
```

## 7. 交叉引用

- [[06_强化学习/04_RL_Applications/RL_for_LLM_Reasoning|RL 驱动 LLM 推理]]
- [[06_强化学习/03_RLHF_Alignment/GRPO_Training_Deep_Dive|GRPO 训练]]
- [[06_强化学习/03_RLHF_Alignment/DPO_Variants_2026|DPO 变体]]
- [[05_大模型/09_Reasoning_Models/|推理模型]]
- [[05_大模型/Test_Time_Compute/|推理时计算]]
- [[05_大模型/07_Fine_tuning_Techniques/|微调技术]]
