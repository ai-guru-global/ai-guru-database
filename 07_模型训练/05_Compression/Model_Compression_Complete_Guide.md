---
title: "Model Compression & Optimization"
tags: [model-training, compression, quantization, pruning, distillation, production]
status: complete
last_updated: 2026-07-25
sources: []
name_zh: "模型压缩完全指南"
---

# Model Compression & Optimization

> 中文简称：模型压缩完全指南

## Overview

Model compression reduces model size and computational cost while preserving quality. Essential for production deployment where latency, memory, and cost are critical constraints.

## Compression Taxonomy

```
Model Compression
├── Quantization (Reduce precision)
│   ├── Post-Training Quantization (PTQ)
│   ├── Quantization-Aware Training (QAT)
│   └── Mixed Precision
├── Pruning (Remove parameters)
│   ├── Unstructured Pruning
│   ├── Structured Pruning
│   └── Semi-Structured (2:4 Sparsity)
├── Knowledge Distillation (Transfer knowledge)
│   ├── Teacher-Student
│   ├── Self-Distillation
│   └── Feature Distillation
├── Low-Rank Factorization
│   ├── SVD Decomposition
│   └── LoRA (parameter-efficient)
└── Architecture Design
    ├── Efficient Architectures (MobileNet, EfficientNet)
    └── Neural Architecture Search (NAS)
```

## Quantization

### Precision Levels

| Precision | Bits | Memory Reduction | Speedup | Quality Impact |
|-----------|------|-----------------|---------|---------------|
| FP32 | 32 | 1x (baseline) | 1x | None |
| BF16/FP16 | 16 | 2x | 1.5-2x | Negligible |
| INT8 | 8 | 4x | 2-4x | Minimal |
| INT4 | 8 | 8x | 3-5x | Small |
| INT2/INT3 | 2-3 | 10-16x | Variable | Moderate |
| Binary | 1 | 32x | Significant | Large |

### Post-Training Quantization (PTQ)

```python
# GPTQ (GPU-friendly, 4-bit)
from transformers import AutoModelForCausalLM, GPTQConfig

quantization_config = GPTQConfig(
    bits=4,
    dataset="c4",
    group_size=128,
    desc_act=True,
    damp_percent=0.01,
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-70B",
    quantization_config=quantization_config,
    device_map="auto",
)
model.save_pretrained("Llama-3-70B-GPTQ-4bit")
```

```python
# AWQ (Activation-aware Weight Quantization)
from awq import AutoAWQForCausalLM

model = AutoAWQForCausalLM.from_pretrained("meta-llama/Llama-3-70B")
quant_config = {
    "zero_point": True,
    "q_group_size": 128,
    "w_bit": 4,
    "version": "GEMM"
}
model.quantize(tokenizer, quant_config=quant_config)
model.save_pretrained("Llama-3-70B-AWQ-4bit")
```

### Quantization-Aware Training (QAT)

```python
import torch
from torch.quantization import prepare_qat, convert

# Define quantization-aware model
class QuantizedModel(nn.Module):
    def __init__(self, float_model):
        super().__init__()
        self.quant = torch.quantization.QuantStub()
        self.model = float_model
        self.dequant = torch.quantization.DeQuantStub()
    
    def forward(self, x):
        x = self.quant(x)
        x = self.model(x)
        x = self.dequant(x)
        return x

# QAT training loop
quantized_model = QuantizedModel(float_model)
quantized_model.qconfig = torch.quantization.get_default_qat_qconfig('fbgemm')
prepared_model = prepare_qat(quantized_model)

# Train for a few epochs with quantization simulation
for epoch in range(num_qat_epochs):
    train(prepared_model, train_loader)

# Convert to actual quantized model
quantized_model = convert(prepared_model)
```

### Quantization Comparison

| Method | Precision | Quality | Speed | Ease |
|--------|-----------|---------|-------|------|
| GPTQ | 4-bit | Good | Fast (GPU) | Medium |
| AWQ | 4-bit | Better | Fast (GPU) | Medium |
| GGUF | 2-8 bit | Good | Fast (CPU) | Easy |
| bitsandbytes | 4/8-bit | Good | Medium | Easy |
| SmoothQuant | W8A8 | Very Good | Fast | Medium |
| FP8 | 8-bit | Excellent | Fast | Easy |

## Pruning

### Unstructured Pruning

```python
import torch.nn.utils.prune as prune

# Magnitude-based pruning
def prune_model(model, sparsity=0.5):
    for name, module in model.named_modules():
        if isinstance(module, nn.Linear):
            prune.l1_unstructured(module, name='weight', amount=sparsity)
            prune.remove(module, 'weight')  # Make permanent
    return model

# Iterative pruning with fine-tuning
def iterative_pruning(model, train_loader, target_sparsity=0.9, steps=10):
    sparsity_per_step = 1 - (1 - target_sparsity) ** (1 / steps)
    
    for step in range(steps):
        model = prune_model(model, sparsity_per_step)
        fine_tune(model, train_loader, epochs=1)
        current_sparsity = compute_sparsity(model)
        print(f"Step {step+1}: Sparsity = {current_sparsity:.1%}")
    
    return model
```

### Structured Pruning

```python
# Remove entire attention heads or FFN neurons
def prune_attention_heads(model, heads_to_prune):
    """Prune specific attention heads per layer."""
    for layer_idx, head_indices in heads_to_prune.items():
        layer = model.model.layers[layer_idx].self_attn
        # Zero out and remove heads
        for head_idx in sorted(head_indices, reverse=True):
            prune_head(layer, head_idx)

# Width pruning (reduce hidden dimension)
def prune_ffn_width(model, keep_ratio=0.75):
    """Prune FFN intermediate dimension."""
    for layer in model.model.layers:
        ffn = layer.mlp
        # Keep top neurons by magnitude
        importance = ffn.gate_proj.weight.abs().sum(dim=0)
        keep_indices = importance.topk(int(len(importance) * keep_ratio)).indices
        ffn.gate_proj = prune_to_indices(ffn.gate_proj, keep_indices)
        ffn.up_proj = prune_to_indices(ffn.up_proj, keep_indices)
```

### NVIDIA 2:4 Structured Sparsity

```python
# A100/H100 hardware-accelerated sparse format
from torch.sparse import to_sparse_semi_structured

# Apply 2:4 sparsity (2 zeros per 4 elements)
def apply_24_sparsity(weight):
    """Every 4 elements must have exactly 2 zeros."""
    # Find top-2 magnitude in each group of 4
    reshaped = weight.reshape(-1, 4)
    mask = torch.zeros_like(reshaped, dtype=torch.bool)
    top2 = reshaped.abs().topk(2, dim=1).indices
    mask.scatter_(1, top2, True)
    sparse_weight = weight * mask.reshape(weight.shape)
    return to_sparse_semi_structured(sparse_weight)
```

## Knowledge Distillation

### Standard Teacher-Student Distillation

```python
class DistillationLoss(nn.Module):
    def __init__(self, temperature=4.0, alpha=0.7):
        super().__init__()
        self.temperature = temperature
        self.alpha = alpha
        self.ce_loss = nn.CrossEntropyLoss()
        self.kl_loss = nn.KLDivLoss(reduction='batchmean')
    
    def forward(self, student_logits, teacher_logits, labels):
        # Hard loss (ground truth)
        hard_loss = self.ce_loss(student_logits, labels)
        
        # Soft loss (teacher knowledge)
        soft_student = F.log_softmax(student_logits / self.temperature, dim=-1)
        soft_teacher = F.softmax(teacher_logits / self.temperature, dim=-1)
        soft_loss = self.kl_loss(soft_student, soft_teacher) * (self.temperature ** 2)
        
        return self.alpha * soft_loss + (1 - self.alpha) * hard_loss

# Distillation training loop
for batch in train_loader:
    with torch.no_grad():
        teacher_logits = teacher_model(batch.input_ids)
    student_logits = student_model(batch.input_ids)
    loss = distillation_loss(student_logits, teacher_logits, batch.labels)
    loss.backward()
    optimizer.step()
```

### LLM-Specific Distillation

```python
# On-policy distillation (student generates, teacher scores)
def on_policy_distillation(student, teacher, prompt):
    # Student generates response
    student_output = student.generate(prompt, do_sample=True, temperature=0.7)
    
    # Teacher scores each token
    with torch.no_grad():
        teacher_logits = teacher(student_output.input_ids)
    
    # KL divergence at each token position
    student_logits = student(student_output.input_ids)
    loss = kl_divergence(student_logits, teacher_logits)
    return loss
```

## Compression Pipeline

### End-to-End Compression Workflow

```
1. Baseline Model
   └── Evaluate quality metrics
2. Quantization (PTQ)
   └── FP16 → INT4 (AWQ/GPTQ)
   └── Evaluate quality drop
3. Pruning (if still too large)
   └── 2:4 structured sparsity
   └── Fine-tune to recover quality
4. Distillation (if latency critical)
   └── Train smaller student
   └── Evaluate quality vs size tradeoff
5. Export
   └── ONNX/TensorRT/CoreML
   └── Benchmark latency & throughput
```

### Quality vs Size Tradeoff

| Technique | Size Reduction | Latency Improvement | Quality Impact |
|-----------|---------------|--------------------|----|
| FP16 only | 2x | 1.5x | None |
| INT8 quantization | 4x | 2-3x | < 1% |
| INT4 quantization | 8x | 3-5x | 1-3% |
| 50% pruning | 2x | 1.5x | 1-2% |
| 75% pruning | 4x | 2-3x | 3-5% |
| Distillation (2x smaller) | 2x | 2x | 2-5% |
| Combined (INT4 + pruning) | 16x | 5-8x | 3-8% |

## Production Deployment

### vLLM with Quantized Models

```python
from vllm import LLM, SamplingParams

# Load AWQ quantized model
llm = LLM(
    model="TheBloke/Llama-3-70B-AWQ",
    quantization="awq",
    dtype="half",
    gpu_memory_utilization=0.9,
    max_model_len=4096,
)

output = llm.generate(["Hello, world!"], SamplingParams(temperature=0.7))
```

### Benchmarking Compressed Models

```python
def benchmark_compression(original_model, compressed_model, test_data):
    """Compare original vs compressed model."""
    results = {}
    
    # Quality metrics
    results['original_accuracy'] = evaluate(original_model, test_data)
    results['compressed_accuracy'] = evaluate(compressed_model, test_data)
    results['quality_drop'] = results['original_accuracy'] - results['compressed_accuracy']
    
    # Size metrics
    results['original_size_mb'] = get_model_size(original_model)
    results['compressed_size_mb'] = get_model_size(compressed_model)
    results['compression_ratio'] = results['original_size_mb'] / results['compressed_size_mb']
    
    # Latency metrics
    results['original_latency_ms'] = benchmark_latency(original_model, test_data)
    results['compressed_latency_ms'] = benchmark_latency(compressed_model, test_data)
    results['speedup'] = results['original_latency_ms'] / results['compressed_latency_ms']
    
    return results
```

## Source-Level Implementation Insights (llm-compressor v0.12.0 / bitsandbytes v0.50.0)

> 基于本仓库归档源码 `code/llm-frameworks/llm-compressor-v0.12.0/` 与 `code/llm-frameworks/bitsandbytes-v0.50.0/`，行号可对照验证。

- **Compression Pipeline 的工程实现**：本文 Compression Pipeline 一节描述的"多技术串联"在 llm-compressor 中对应 Recipe 机制（`src/llmcompressor/recipe/recipe.py` L27 `Recipe(BaseModel)`）：剪枝 `SparseGPTModifier`（`modifiers/obcq/sgpt_base.py` L12）+ 量化 `GPTQModifier`（`modifiers/gptq/base.py` L46）可声明式堆叠，由 `oneshot()`（`entrypoints/oneshot.py` L261）一次性执行。
- **Quantization 章节的两条实现路线**：离线校准（GPTQ/AWQ/SmoothQuant，均继承 `modifiers/modifier.py` L13 `Modifier`）vs 动态加载（bitsandbytes `Linear4bit`/`LinearNF4`，`nn/modules.py` L504/L676）。
- **QLoRA 可训原理**：`autograd/_functions.py` L300 `MatMul4Bit` 前向反量化、反向梯度只流向 LoRA 旁支；8-bit 优化器（`optim/adamw.py` 等）进一步压缩训练时显存。

详见 [[10_部署推理/05_Quantization/Quantization_Techniques_2026]] 第 8 节。

## Related Topics

- [[Quantization_Techniques_2026]]: Detailed quantization methods
- [[Pruning_and_Knowledge_Distillation]]: Original pruning guide
- [[Inference_Optimization_for_dummy]]: Inference optimization
- [[Mixed_Precision_Training]]: Training with mixed precision
