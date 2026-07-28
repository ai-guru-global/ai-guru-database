---
title: 课程学习 (Curriculum Learning)
category: 05-training
tags: ["curriculum-learning", "data-ordering", "difficulty-progression", "training-strategy"]
summary: "课程学习完整技术体系：数据排序策略、难度递进方法、自动课程学习、在 LLM 预训练/微调/RL 中的应用与 2026 最佳实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "课程学习"
---
# 课程学习 (Curriculum Learning)

> 中文简称：课程学习

## 1. 核心思想

```
人类学习: 小学 → 初中 → 高中 → 大学 (由易到难)
课程学习: 训练数据也按难度排序，先易后难

为什么有效?
- 简单样本建立基础模式 → 复杂样本在此基础上细化
- 避免早期被噪声/难样本误导
- 更平滑的损失曲面 → 更好的收敛
- 类似"预热" → 模型先建立信心再挑战

Bengio et al. 2009: 首次提出 Curriculum Learning
2024-2026: 在 LLM 预训练和推理 RL 中大规模应用
```

## 2. 难度度量

### 2.1 常见难度指标

```python
class DifficultyScorer:
    """数据难度评分方法"""
    
    def score_by_loss(self, model, sample):
        """方法1: 用模型当前 loss 作为难度"""
        # loss 高 → 难; loss 低 → 易
        loss = model.compute_loss(sample)
        return loss.item()
    
    def score_by_length(self, sample):
        """方法2: 序列长度 (LLM 预训练)"""
        # 短文本 → 易; 长文本 → 难
        return len(sample["tokens"])
    
    def score_by_perplexity(self, ref_model, sample):
        """方法3: 参考模型的困惑度"""
        # 困惑度高 → 不常见/难
        ppl = ref_model.perplexity(sample)
        return ppl
    
    def score_by_annotation(self, sample):
        """方法4: 人工标注难度 (数学题)"""
        # 小学 → 1, 初中 → 2, 高中 → 3, 竞赛 → 4
        return sample.get("difficulty_level", 2)
    
    def score_by_competence(self, model, sample):
        """方法5: 模型能力匹配度"""
        # 模型当前能"刚好做对"的题 = 最佳难度
        accuracy = model.evaluate(sample, n_trials=5)
        # 最佳: 30%-70% 正确率
        return abs(accuracy - 0.5)  # 越接近 0.5 越好
```

### 2.2 LLM 预训练中的难度

```python
# LLM 预训练课程 (2026 实践):

PRETRAIN_CURRICULUM = {
    "阶段1_简单": {
        "数据": "短文本/简单语法/高频词",
        "序列长度": "512-1024",
        "比例": "前 20% tokens",
    },
    "阶段2_中等": {
        "数据": "中等长度/多领域混合",
        "序列长度": "2048-4096",
        "比例": "中间 60% tokens",
    },
    "阶段3_困难": {
        "数据": "长文本/专业领域/代码/数学",
        "序列长度": "8192-32768",
        "比例": "后 20% tokens",
    },
    "阶段4_退火": {
        "数据": "高质量精选 (教科书/论文)",
        "学习率": "衰减到接近 0",
        "目的": "最终质量打磨",
    },
}
```

## 3. 课程策略

### 3.1 经典策略

```python
class CurriculumScheduler:
    """课程调度器"""
    
    def __init__(self, strategy="linear", total_steps=10000):
        self.strategy = strategy
        self.total_steps = total_steps
    
    def get_difficulty_threshold(self, step):
        """当前步允许的最大难度"""
        progress = step / self.total_steps
        
        if self.strategy == "linear":
            # 线性增长: 难度从 0 到 1
            return progress
        
        elif self.strategy == "exponential":
            # 指数增长: 前期慢，后期快
            return 1 - math.exp(-3 * progress)
        
        elif self.strategy == "step":
            # 阶梯式: 分阶段跳变
            if progress < 0.33:
                return 0.33
            elif progress < 0.66:
                return 0.66
            else:
                return 1.0
        
        elif self.strategy == "sigmoid":
            # S 曲线: 中间快，两头慢
            return 1 / (1 + math.exp(-10 * (progress - 0.5)))
    
    def filter_batch(self, dataset, step):
        """根据当前难度阈值过滤数据"""
        threshold = self.get_difficulty_threshold(step)
        eligible = [s for s in dataset if s.difficulty <= threshold]
        return random.sample(eligible, batch_size)
```

### 3.2 自动课程学习 (ACL)

```python
class AutomaticCurriculum:
    """
    自动课程学习: 模型自己决定学什么
    
    核心: 选择"学习信号最大"的样本
    - 太简单: loss ≈ 0, 无梯度 → 浪费
    - 太难: loss 很大但梯度噪声大 → 不稳定
    - 刚好: loss 中等, 梯度有效 → 最佳学习
    """
    def __init__(self, model, buffer_size=10000):
        self.model = model
        self.buffer = []
    
    def select_training_batch(self, candidates, batch_size):
        """选择信息量最大的样本"""
        scored = []
        for sample in candidates:
            # 计算当前 loss
            loss = self.model.compute_loss(sample)
            # 计算梯度范数 (学习信号强度)
            grad_norm = self.model.compute_grad_norm(sample)
            
            # 综合评分: 优先选"可学习"的样本
            # loss 中等 + 梯度大 = 最佳
            learnability = grad_norm * (1 - math.exp(-loss))
            scored.append((learnability, sample))
        
        # 选 Top-K 最有学习价值的
        scored.sort(key=lambda x: x[0], reverse=True)
        return [s for _, s in scored[:batch_size]]
```

## 4. 应用场景

### 4.1 推理 RL 中的课程

```python
# DeepSeek R1 / GRPO 训练中的课程:

class ReasoningRLCurriculum:
    """推理 RL 课程学习"""
    
    def __init__(self, problems):
        self.problems = problems
        self.model_accuracy = {}  # 动态追踪
    
    def sample_for_training(self, model, batch_size, epoch):
        """
        核心原则: 选择模型"刚好做不对"的题
        - 全对 → 太简单，跳过
        - 全错 → 太难，暂时跳过
        - 有时对有时错 → 最佳学习区
        """
        suitable = []
        for prob in self.problems:
            acc = self.model_accuracy.get(prob["id"], 0.5)
            # 最佳区间: 20%-80% 正确率
            if 0.2 <= acc <= 0.8:
                suitable.append(prob)
        
        # 不够就放宽
        if len(suitable) < batch_size:
            suitable = self.problems
        
        batch = random.sample(suitable, batch_size)
        
        # 更新难度估计
        for prob in batch:
            responses = model.generate(prob["prompt"], n=8)
            correct = sum(1 for r in responses if verify(r, prob["answer"]))
            self.model_accuracy[prob["id"]] = correct / 8
        
        return batch
```

### 4.2 微调中的课程

```python
# SFT 微调课程:
FINETUNE_CURRICULUM = {
    "epoch_1": {
        "数据": "简单指令 (短回答/单轮)",
        "学习率": "warmup 阶段",
        "目的": "适应新格式",
    },
    "epoch_2": {
        "数据": "中等复杂度 (多轮/工具调用)",
        "学习率": "峰值",
        "目的": "学习核心能力",
    },
    "epoch_3": {
        "数据": "困难样本 (长推理/多步任务)",
        "学习率": "衰减",
        "目的": "挑战极限",
    },
}
```

## 5. 实践建议

| 场景 | 推荐策略 | 难度指标 |
|------|---------|---------|
| LLM 预训练 | 序列长度递进 + 退火 | 长度/困惑度 |
| SFT 微调 | 指令复杂度递进 | 回答长度/步骤数 |
| 推理 RL | 动态难度 (正确率) | 模型正确率 |
| 图像分类 | 图像复杂度/噪声 | 预训练模型 loss |
| 机器翻译 | 句子长度/稀有词 | BLEU 分数 |

## 6. 交叉引用

- [[07_模型训练/03_Optimization/|优化器]]
- [[07_模型训练/04_Distributed_Training/|分布式训练]]
- [[07_模型训练/01_Training_Fundamentals/Pretraining_Playbook|预训练手册]]
- [[06_强化学习/04_RL_Applications/RL_for_LLM_Reasoning|推理 RL]]
- [[05_大模型/09_Reasoning_Models/Reasoning_RL_Training_Pipeline|推理训练流水线]]
