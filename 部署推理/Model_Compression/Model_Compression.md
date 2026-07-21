---
title: 模型压缩统一视角 (Model Compression)
category: 07-deployment
tags: ["model-compression", "pruning", "distillation", "quantization", "compression"]
summary: "模型压缩统一技术体系：剪枝/蒸馏/量化/低秩分解的完整对比、组合策略、2026 LLM 压缩实践与部署优化。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 模型压缩统一视角

## 1. 压缩方法全景

```
四大压缩技术:
1. 量化 (Quantization): 降低数值精度 (FP32→INT8→INT4)
2. 剪枝 (Pruning): 移除冗余参数/结构
3. 蒸馏 (Distillation): 大模型教小模型
4. 低秩分解 (Low-Rank): 矩阵分解减少参数

组合使用效果最佳:
  大模型 → 蒸馏 → 小模型 → 剪枝 → 量化 → 部署
  70B → 7B → 5B → INT4 → 边缘
```

## 2. 方法对比

| 方法 | 压缩比 | 质量损失 | 速度提升 | 适用阶段 |
|------|--------|---------|---------|---------|
| INT8 量化 | 4x | <1% | 2x | 部署 |
| INT4 量化 | 8x | 1-3% | 3x | 部署 |
| 结构化剪枝 | 2-4x | 2-5% | 2x | 训练后 |
| 知识蒸馏 | 5-10x | 2-5% | 5x | 训练 |
| 低秩分解 | 2-3x | 1-3% | 1.5x | 部署 |
| 组合 (蒸馏+量化) | 10-20x | 3-8% | 5-10x | 全流程 |

## 3. 量化 (Quantization)

### 3.1 量化方法分类

```python
QUANTIZATION_METHODS = {
    "训练后量化 (PTQ)": {
        "GPTQ": "逐层量化, 二阶信息, GPU",
        "AWQ": "激活感知, 保护重要通道",
        "GGUF": "llama.cpp 格式, CPU/混合",
        "bitsandbytes": "NF4/INT8, 即时量化",
        "适用": "快速部署, 无需重训练",
    },
    "量化感知训练 (QAT)": {
        "原理": "训练中模拟量化误差",
        "优势": "质量损失更小",
        "劣势": "需要重训练",
        "适用": "极端量化 (INT2/INT3)",
    },
    "FP8 量化": {
        "硬件": "H100/B200 原生支持",
        "优势": "几乎无质量损失",
        "适用": "服务端推理",
    },
}
```

### 3.2 实战代码

```python
# AWQ 量化 (2026 推荐):
from awq import AutoAWQForCausalLM

model = AutoAWQForCausalLM.from_pretrained("meta-llama/Llama-3-8B")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-8B")

quant_config = {
    "zero_point": True,
    "q_group_size": 128,
    "w_bit": 4,          # 4-bit 权重
    "version": "GEMM",   # GPU 推理
}

# 校准 + 量化
model.quantize(tokenizer, quant_config=quant_config)
model.save_quantized("./llama3-8b-awq")

# GPTQ 量化:
from transformers import GPTQConfig

gptq_config = GPTQConfig(
    bits=4,
    dataset="c4",
    tokenizer=tokenizer,
    group_size=128,
)
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-8B",
    quantization_config=gptq_config,
    device_map="auto",
)
```

## 4. 剪枝 (Pruning)

### 4.1 结构化剪枝

```python
class StructuredPruner:
    """
    结构化剪枝: 移除整个注意力头/FFN 通道
    优势: 直接减少计算量 (非结构化只减少内存)
    """
    def __init__(self, model, prune_ratio=0.3):
        self.model = model
        self.prune_ratio = prune_ratio
    
    def prune_attention_heads(self):
        """移除不重要的注意力头"""
        importance = self.compute_head_importance()
        n_heads = self.model.config.num_attention_heads
        n_prune = int(n_heads * self.prune_ratio)
        
        # 移除最不重要的头
        heads_to_prune = importance.argsort()[:n_prune]
        
        for layer_idx in range(self.model.config.num_hidden_layers):
            self.model.prune_heads({layer_idx: heads_to_prune})
    
    def prune_ffn_channels(self):
        """移除 FFN 中不重要的中间通道"""
        for layer in self.model.layers:
            # 按 L1 范数排序
            importance = layer.ffn.weight.abs().sum(dim=1)
            n_keep = int(len(importance) * (1 - self.prune_ratio))
            keep_idx = importance.argsort(descending=True)[:n_keep]
            
            # 重建更小的 FFN
            layer.ffn = rebuild_ffn(layer.ffn, keep_idx)
    
    def compute_head_importance(self):
        """用梯度 × 激活衡量头重要性"""
        # 在校准数据上计算
        pass

# 2026 LLM 剪枝工具:
# - SparseGPT: 一次性剪枝到 50% 稀疏
# - Wanda: 权重 × 激活 剪枝
# - ShortGPT: 移除冗余层
```

## 5. 知识蒸馏

### 5.1 LLM 蒸馏

```python
class LLMDistillation:
    """
    LLM 知识蒸馏 (2026):
    教师: 70B/405B 大模型
    学生: 7B/3B 小模型
    
    蒸馏类型:
    1. 输出蒸馏: 匹配 logits 分布
    2. 特征蒸馏: 匹配中间表示
    3. 数据蒸馏: 用教师生成训练数据
    """
    def __init__(self, teacher, student, temperature=2.0, alpha=0.7):
        self.teacher = teacher  # 冻结
        self.student = student
        self.T = temperature
        self.alpha = alpha  # KD loss 权重
    
    def distillation_loss(self, input_ids, labels):
        """蒸馏损失"""
        # 教师 logits (软标签)
        with torch.no_grad():
            teacher_logits = self.teacher(input_ids).logits
        
        # 学生 logits
        student_logits = self.student(input_ids).logits
        
        # KD Loss: KL(teacher_soft || student_soft)
        kd_loss = F.kl_div(
            F.log_softmax(student_logits / self.T, dim=-1),
            F.softmax(teacher_logits / self.T, dim=-1),
            reduction="batchmean"
        ) * (self.T ** 2)
        
        # 标准 CE Loss (硬标签)
        ce_loss = F.cross_entropy(
            student_logits.view(-1, student_logits.size(-1)),
            labels.view(-1)
        )
        
        # 组合
        total = self.alpha * kd_loss + (1 - self.alpha) * ce_loss
        return total

# 2026 数据蒸馏 (更常用):
# 1. 用大模型生成高质量回答
# 2. 过滤 (只保留正确的)
# 3. 用这些数据 SFT 小模型
# 代表: Alpaca (GPT-4 → LLaMA 7B)
```

## 6. 组合策略

### 6.1 2026 推荐流水线

```python
COMPRESSION_PIPELINE_2026 = {
    "服务端 (质量优先)": {
        "步骤": ["FP8 量化"],
        "压缩比": "2x",
        "质量损失": "<0.5%",
        "工具": "TensorRT-LLM / vLLM FP8",
    },
    "服务端 (平衡)": {
        "步骤": ["AWQ INT4"],
        "压缩比": "4x",
        "质量损失": "1-2%",
        "工具": "AutoAWQ / vLLM",
    },
    "边缘/手机": {
        "步骤": ["蒸馏 7B→3B", "INT4 量化", "GGUF 转换"],
        "压缩比": "15-20x",
        "质量损失": "5-10%",
        "工具": "llama.cpp / MLC-LLM",
    },
    "极端压缩 (IoT)": {
        "步骤": ["蒸馏→1B", "结构化剪枝 50%", "INT4"],
        "压缩比": "30-50x",
        "质量损失": "10-20%",
        "工具": "TFLite / ONNX Runtime",
    },
}
```

## 7. 交叉引用

- [[部署推理/Quantization/|量化]]
- [[部署推理/Edge_Deployment/|边缘部署]]
- [[深度学习/Knowledge_Distillation/|知识蒸馏]]
- [[模型训练/Compression/|训练压缩]]
- [[部署推理/Inference_Engines/|推理引擎]]
- [[部署推理/Serving_Architecture/|服务架构]]
