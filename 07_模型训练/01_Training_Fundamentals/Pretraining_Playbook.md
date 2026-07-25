---
title: 预训练实战手册 (Pretraining Playbook)
category: 05-training
tags: ["pretraining", "llm-training", "from-scratch", "data-pipeline", "scaling-laws"]
summary: "从零训练 LLM 完整实战手册：数据准备、架构选择、超参数配置、训练阶段、Scaling Laws、常见问题排查与 2026 最佳实践。"
created: 2026-07-21
updated: 2026-07-25
tier: supporting
sources: []

---
# 预训练实战手册 (Pretraining Playbook)

## 1. 训练前准备

### 1.1 决策清单

```python
PRETRAINING_DECISIONS = {
    "1_目标定义": {
        "模型规模": "1B / 7B / 13B / 70B / 405B?",
        "目标语言": "中文/英文/多语言?",
        "目标领域": "通用/代码/数学/多模态?",
        "预算": "GPU 小时数 / 美元预算?",
    },
    "2_数据准备": {
        "数据量": "规模 × 200 = 所需 token 数 (Chinchilla)",
        "数据来源": "网页/书籍/代码/论文/百科?",
        "质量控制": "去重/过滤/评分?",
        "配比": "各来源比例?",
    },
    "3_架构选择": {
        "基础": "标准 Transformer / 混合 (Mamba+Attn)?",
        "注意力": "MHA / GQA / MLA?",
        "FFN": "Dense / MoE?",
        "词表": "BPE 大小 (32K-128K)?",
    },
    "4_基础设施": {
        "GPU": "A100 / H100 / B200?",
        "数量": "需要多少卡?",
        "网络": "InfiniBand / RoCE?",
        "存储": "并行文件系统?",
    },
}
```

### 1.2 Scaling Laws 估算

```python
def estimate_training(scale_config):
    """
    Chinchilla Scaling Law:
    最优 token 数 ≈ 20 × 参数量
    训练 loss ≈ (N_c / N)^0.076 + (D_c / D)^0.095 + E
    
    2026 更新: 实际训练 token 远超 Chinchilla 最优
    (因为推理成本 >> 训练成本，过训练更经济)
    """
    params = scale_config["params"]  # 如 7e9
    
    # Chinchilla 最优
    optimal_tokens = 20 * params  # 140B tokens for 7B
    
    # 2026 实践: 过训练 (更多 token, 更小模型)
    actual_tokens = scale_config.get("tokens", optimal_tokens * 5)
    # Llama 3 8B: 15T tokens (远超 Chinchilla 的 160B)
    
    # 计算预算 (FLOPs)
    flops = 6 * params * actual_tokens  # 近似
    # 6 = 前向(2) + 反向(4)
    
    # GPU 时间估算
    gpu_flops_per_sec = {
        "A100": 312e12,   # BF16
        "H100": 989e12,   # BF16
        "B200": 2250e12,  # BF16
    }
    gpu_type = scale_config.get("gpu", "H100")
    mfu = 0.4  # Model FLOPs Utilization (实际效率)
    
    gpu_hours = flops / (gpu_flops_per_sec[gpu_type] * mfu * 3600)
    n_gpus = scale_config.get("n_gpus", 64)
    wall_hours = gpu_hours / n_gpus
    
    return {
        "total_flops": f"{flops:.2e}",
        "gpu_hours": f"{gpu_hours:.0f}",
        "wall_time": f"{wall_hours:.0f} hours ({wall_hours/24:.1f} days)",
        "cost_estimate": f"${gpu_hours * 2:.0f}",  # ~$2/GPU-hour
    }

# 示例: 7B 模型, 1T tokens, 64×H100
# → ~3000 GPU-hours → ~47 小时 → ~$6000
```

## 2. 数据工程

### 2.1 数据处理流水线

```python
DATA_PIPELINE = {
    "1_收集": {
        "来源": ["CommonCrawl", "书籍", "arXiv", "GitHub", "Wikipedia", "StackExchange"],
        "格式": "HTML → 纯文本 (trafilatura/readability)",
    },
    "2_语言识别": {
        "工具": "fastText lid / lingua",
        "过滤": "保留目标语言 > 80%",
    },
    "3_质量过滤": {
        "规则": [
            "文本长度 > 100 字符",
            "非重复行 > 30%",
            "含字母比例 > 60%",
            "停用词比例 > 6%",
        ],
        "分类器": "训练质量分类器 (好/坏)",
    },
    "4_去重": {
        "精确去重": "URL/文档哈希",
        "模糊去重": "MinHash + LSH (5-gram)",
        "段落去重": "去除重复段落/模板",
    },
    "5_敏感过滤": {
        "PII": "去除个人信息 (邮箱/电话/地址)",
        "有害": "过滤有毒/违法内容",
        "版权": "尊重 robots.txt / 版权要求",
    },
    "6_分词": {
        "工具": "SentencePiece / tiktoken",
        "词表": "64K-128K BPE",
        "特殊token": "<bos> <eos> <pad> <unk>",
    },
    "7_打包": {
        "格式": "拼接为固定长度序列 (4096)",
        "分片": "按 GPU 数分片存储",
        "索引": "建立随机访问索引",
    },
}
```

### 2.2 数据配比

```python
# 2026 通用 LLM 数据配比参考:
DATA_MIX = {
    "网页文本": 0.55,      # 高质量网页
    "书籍": 0.10,          # 长文本/文学
    "代码": 0.15,          # GitHub (提升推理)
    "学术论文": 0.05,      # arXiv
    "百科/知识": 0.05,     # Wikipedia
    "数学": 0.05,          # 数学教材/题目
    "对话": 0.03,          # 高质量对话
    "多语言": 0.02,        # 其他语言
}
```

## 3. 训练配置

### 3.1 超参数

```python
# 7B 模型预训练推荐配置 (2026):
PRETRAIN_CONFIG = {
    # 模型
    "hidden_size": 4096,
    "n_layers": 32,
    "n_heads": 32,
    "n_kv_heads": 8,       # GQA
    "intermediate_size": 14336,  # SwiGLU
    "vocab_size": 65536,
    "max_seq_length": 4096,
    
    # 优化
    "optimizer": "AdamW",
    "lr": 3e-4,             # 峰值学习率
    "min_lr": 3e-5,         # 最终学习率 (峰值的 10%)
    "weight_decay": 0.1,
    "beta1": 0.9,
    "beta2": 0.95,
    "grad_clip": 1.0,
    
    # 调度
    "warmup_steps": 2000,   # 线性预热
    "schedule": "cosine",   # 余弦衰减
    "total_steps": 250000,  # 1T tokens / (4M tokens/step)
    
    # 批大小
    "micro_batch": 4,       # 每 GPU
    "gradient_accumulation": 8,
    "global_batch": 256,    # 4 × 8 × 8 GPUs = 256
    "tokens_per_step": 256 * 4096,  # ~1M tokens/step
    
    # 精度
    "precision": "bf16",
    "grad_checkpointing": True,
    
    # 并行
    "tensor_parallel": 4,   # 节点内
    "pipeline_parallel": 2, # 跨节点
    "data_parallel": "auto", # 剩余
}
```

### 3.2 训练阶段

```python
TRAINING_PHASES = {
    "Phase 1: Warmup (0-2K steps)": {
        "lr": "0 → 3e-4 线性增长",
        "目的": "稳定训练初期",
    },
    "Phase 2: 主训练 (2K-230K steps)": {
        "lr": "3e-4 余弦衰减",
        "数据": "全量混合数据",
        "监控": "loss 应平稳下降",
    },
    "Phase 3: 退火 (230K-250K steps)": {
        "lr": "3e-5 → 0",
        "数据": "高质量子集 (教科书/论文)",
        "目的": "最终质量打磨",
        "效果": "通常提升 1-2% benchmark",
    },
}
```

## 4. 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| Loss 不降 | 学习率太小/数据问题 | 增大 lr / 检查数据 |
| Loss 突然飙升 | 坏数据/学习率太大 | 回滚检查点 / 降 lr |
| Loss NaN | 数值溢出/坏样本 | 检查数据 / 加 grad clip |
| 训练慢 | 通信瓶颈/IO 瓶颈 | 检查网络 / 优化数据加载 |
| 显存 OOM | batch 太大/序列太长 | 减小 batch / 开 grad ckpt |
| Loss 震荡 | batch 太小 / 数据不均 | 增大 batch / 打乱数据 |
| 过拟合 | 数据重复/训练太久 | 增加数据 / 早停 |

## 5. 2026 开源参考

```python
# 可参考的开源预训练项目:
OPEN_SOURCE_REFERENCES = {
    "Llama 3": "Meta, 8B/70B/405B, 15T tokens",
    "Qwen 2.5": "阿里, 0.5B-72B, 18T tokens",
    "DeepSeek V3": "DeepSeek, 671B MoE, 14.8T tokens",
    "OLMo 2": "AI2, 7B/13B, 完全开源(含数据)",
    "SmolLM2": "HuggingFace, 135M-1.7B, 小模型",
    "MAP-Neo": "中文开源, 7B, 完全开源",
}

# 训练框架:
FRAMEWORKS = {
    "Megatron-LM": "NVIDIA, 最成熟的大规模训练",
    "DeepSpeed": "Microsoft, ZeRO 优化",
    "Nanotron": "HuggingFace, 简洁易用",
    "litGPT": "轻量级, 适合小模型",
    "verl": "RL 训练 (GRPO/PPO)",
}
```

## 6. 交叉引用

- [[07_模型训练/04_Distributed_Training/|分布式训练]]
- [[07_模型训练/Mixed_Precision_Training/|混合精度训练]]
- [[07_模型训练/Training_Infrastructure/|训练基础设施]]
- [[07_模型训练/Curriculum_Learning/|课程学习]]
- [[07_模型训练/02_Data/|数据工程]]
- [[07_模型训练/03_Optimization/|优化器]]
- [[05_大模型/LLM_Training/|LLM 训练]]

## 7. 源码级实现要点（基于 code/llm-frameworks/ 归档）

预训练工程决策可直接对照源码验证，避免经验主义配置：

- **并行布局不靠试错**：NeMo v2.7.3 `collections/llm/recipes/` 收录 100+ 模型规格的官方调优配方（TP/PP/CP/batch/lr），新集群从同规模 recipe 拷贝起步。
- **数据管道基准实现**：Megatron bin-idx mmap 数据集 + NeMo `PreTrainingDataModule`（`gpt/data/pre_training.py`）按全局 batch 与并行拓扑切分样本，是生产级预训练数据加载的参考实现。
- **显存预算公式的源码对应**：ZeRO 各阶段节省比例对应 DeepSpeed `zero/stage_1_and_2.py`（状态/梯度分区）与 `stage3.py`（参数分区 + prefetch 预算 `stage3_prefetch_bucket_size`）；调参时先调 bucket/prefetch 再考虑 offload。
- **FP8 落地前提**：Megatron `core/fp8_utils.py` 依赖 Transformer Engine，仅 Hopper+ 架构生效；集群含 Ampere 时需回退 BF16 路径。
- 详见 [[07_模型训练/04_Distributed_Training/NeMo_Deep_Dive|NeMo 深度解析]]、[[07_模型训练/04_Distributed_Training/Megatron_LM_Deep_Dive|Megatron-LM 深度解析]] 的源码章节。
