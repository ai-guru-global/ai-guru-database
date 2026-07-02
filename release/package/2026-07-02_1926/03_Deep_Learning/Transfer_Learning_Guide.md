---
title: "Transfer Learning Complete Guide"
tags: [deep-learning, transfer-learning, fine-tuning, pre-training, production]
status: complete
last_updated: 2026-07-02
sources: []
---

# Transfer Learning Complete Guide

## Overview

Transfer learning is the practice of leveraging knowledge from a pre-trained model on a new, typically smaller dataset. It is the **dominant paradigm** in modern AI — nearly all production models start from pre-trained checkpoints rather than training from scratch.

## Why Transfer Learning Works

### Theoretical Foundations

1. **Feature Reuse Hypothesis**: Lower layers learn通用 features (edges, textures, syntax) that transfer across tasks
2. **Dataset Bias**: Source and target domains share underlying structure
3. **Meta-Learning View**: Pre-training implicitly learns a good initialization for fine-tuning

### Practical Benefits

| Benefit | From Scratch | Transfer Learning |
|---------|-------------|-------------------|
| Training data needed | 100K-10M+ samples | 100-10K samples |
| Training time | Days-weeks | Hours-days |
| Compute cost | $10K-$1M+ | $10-$10K |
| Performance ceiling | Limited by data | Leverages pre-trained knowledge |

## Transfer Learning Taxonomy

### By Approach

```
Transfer Learning
├── Feature Extraction (Freeze backbone, train head only)
│   └── Fastest, least data needed, limited adaptation
├── Fine-Tuning (Unfreeze some/all layers, train with low LR)
│   ├── Gradual Unfreezing
│   ├── Layer-wise LR Decay
│   └── Best balance of speed and performance
├── Full Fine-Tuning (Unfreeze all, train end-to-end)
│   └── Best for large target datasets
└── Parameter-Efficient Fine-Tuning (PEFT)
    ├── LoRA / QLoRA
    ├── Adapters
    ├── Prefix Tuning
    └── IA3
```

### By Domain

| Source → Target | Example | Strategy |
|----------------|---------|----------|
| Same domain, different task | ImageNet → Medical imaging | Feature extraction + fine-tune |
| Different domain, same task | English NLP → Chinese NLP | Domain adaptation |
| Different domain, different task | NLP → Vision (rare) | Multi-modal transfer |

## Computer Vision Transfer Learning

### Pre-Trained Model Zoo

| Model | Pre-training | Parameters | ImageNet Top-1 | Best For |
|-------|-------------|-----------|----------------|----------|
| ResNet-50 | ImageNet-1K | 25.6M | 80.4% | General baseline |
| EfficientNetV2-S | ImageNet-1K | 21.5M | 85.7% | Efficiency |
| ConvNeXt-V2-L | ImageNet-22K | 198M | 88.1% | CNN SOTA |
| ViT-L/16 | ImageNet-21K | 307M | 88.5% | Vision Transformer |
| DINOv2-g | LVD-142M | 1.1B | 86.5% (linear) | Self-supervised |
| SAM | SA-1B | 636M | N/A | Segmentation |
| CLIP ViT-L | 400M image-text | 428M | N/A | Zero-shot vision |

### Fine-Tuning Recipe (PyTorch)

```python
import torch
import torchvision.models as models
from torch.optim.lr_scheduler import CosineAnnealingLR

# 1. Load pre-trained model
model = models.vit_l_16(weights='IMAGENET1K_V2')

# 2. Replace classification head
num_classes = 10  # Your target classes
model.heads.head = torch.nn.Linear(model.hidden_dim, num_classes)

# 3. Freeze backbone initially
for param in model.parameters():
    param.requires_grad = False
for param in model.heads.head.parameters():
    param.requires_grad = True

# 4. Gradual unfreezing schedule
def unfreeze_layers(model, num_layers_to_unfreeze):
    params = list(model.parameters())
    for param in params[-num_layers_to_unfreeze:]:
        param.requires_grad = True

# 5. Layer-wise learning rate decay
param_groups = [
    {'params': model.encoder.layers[:8].parameters(), 'lr': 1e-6},
    {'params': model.encoder.layers[8:16].parameters(), 'lr': 1e-5},
    {'params': model.encoder.layers[16:].parameters(), 'lr': 1e-4},
    {'params': model.heads.parameters(), 'lr': 1e-3},
]
optimizer = torch.optim.AdamW(param_groups, weight_decay=0.01)
```

## NLP/LLM Transfer Learning

### Pre-Training → Fine-Tuning → Alignment

```
Stage 1: Pre-Training (Corpus: trillions of tokens)
    └── Learn language structure, world knowledge
        Cost: $1M-$100M+

Stage 2: Supervised Fine-Tuning (SFT) (10K-100K examples)
    └── Learn instruction following
        Cost: $100-$10K

Stage 3: Alignment (RLHF/DPO) (10K-100K preference pairs)
    └── Align with human preferences
        Cost: $1K-$50K

Stage 4: Task-Specific Fine-Tuning (100-10K examples)
    └── Domain adaptation
        Cost: $10-$1K
```

### PEFT Methods Comparison

| Method | Trainable Params | Memory | Speed | Quality |
|--------|-----------------|--------|-------|---------|
| Full Fine-Tuning | 100% | Very High | Slow | Best |
| LoRA | 0.1-1% | Low | Fast | Near full |
| QLoRA | 0.1-1% | Very Low | Fast | Near full |
| Adapters | 1-5% | Low | Fast | Good |
| Prefix Tuning | 0.1% | Very Low | Very Fast | Good |
| IA3 | <0.1% | Very Low | Very Fast | Decent |

### LoRA Implementation

```python
from peft import LoraConfig, get_peft_model, TaskType

# Configure LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                    # LoRA rank
    lora_alpha=32,           # Scaling factor
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj",
                     "gate_proj", "up_proj", "down_proj"],
    bias="none",
)

# Apply to model
model = get_peft_model(base_model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: 41,943,040 || all params: 6,779,920,384 || trainable%: 0.619

# Train
trainer = Trainer(
    model=model,
    train_dataset=dataset,
    args=TrainingArguments(
        output_dir="./output",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        learning_rate=2e-4,
        warmup_ratio=0.1,
        lr_scheduler_type="cosine",
        bf16=True,
    ),
)
trainer.train()

# Save only LoRA weights (tiny!)
model.save_pretrained("./lora_weights")  # ~100MB vs ~13GB full model
```

## Transfer Learning Best Practices

### Decision Framework

```
Target Dataset Size:
├── < 1000 samples
│   ├── Use feature extraction (frozen backbone)
│   ├── Use pre-trained embeddings + simple classifier
│   └── Consider few-shot / zero-shot approaches
├── 1K - 10K samples
│   ├── Fine-tune last few layers
│   ├── Use LoRA/PEFT for LLMs
│   └── Strong data augmentation
├── 10K - 100K samples
│   ├── Gradual unfreezing
│   ├── Full fine-tuning with low LR
│   └── Consider domain adaptation
└── > 100K samples
    ├── Full fine-tuning
    ├── Consider continued pre-training
    └── May benefit from training from scratch
```

### Learning Rate Guidelines

| Stage | Typical LR | Notes |
|-------|-----------|-------|
| Pre-trained layers | 1e-5 to 1e-4 | Preserve learned features |
| New layers | 1e-3 to 1e-4 | Learn from scratch |
| LLM fine-tuning | 1e-5 to 2e-5 | Full fine-tuning |
| LoRA fine-tuning | 1e-4 to 3e-4 | Higher LR for adapters |
| Discriminative LR | Layer-dependent | Lower layers get lower LR |

### Common Pitfalls

| Pitfall | Symptom | Solution |
|---------|---------|----------|
| Catastrophic forgetting | Validation drops after fine-tuning | Lower LR, freeze more layers |
| Overfitting | Train loss << Val loss | More augmentation, regularization |
| Underfitting | Poor performance on both | Unfreeze more layers, increase capacity |
| Domain gap | Features don't transfer | Domain adaptation, continued pre-training |
| Wrong pre-training | Poor initialization | Choose closer source domain |

## Advanced Transfer Learning

### Domain Adaptation

```python
# Adversarial domain adaptation (DANN)
class DomainAdversarialNet(nn.Module):
    def __init__(self, feature_extractor, task_classifier, domain_classifier):
        super().__init__()
        self.feature_extractor = feature_extractor
        self.task_classifier = task_classifier
        self.domain_classifier = domain_classifier
        self.gradient_reversal = GradientReversalLayer()
    
    def forward(self, x, alpha=1.0):
        features = self.feature_extractor(x)
        task_output = self.task_classifier(features)
        domain_output = self.domain_classifier(
            self.gradient_reversal(features, alpha)
        )
        return task_output, domain_output
```

### Multi-Task Transfer

```python
# Shared backbone with task-specific heads
class MultiTaskModel(nn.Module):
    def __init__(self, backbone, num_tasks):
        super().__init__()
        self.backbone = backbone
        self.heads = nn.ModuleList([
            nn.Linear(backbone.output_dim, num_classes)
            for num_classes in task_class_sizes
        ])
    
    def forward(self, x, task_id):
        features = self.backbone(x)
        return self.heads[task_id](features)
```

### Cross-Modal Transfer

| Direction | Example | Method |
|-----------|---------|--------|
| Text → Vision | CLIP, ALIGN | Contrastive learning |
| Vision → Text | LLaVA, GPT-4V | Visual instruction tuning |
| Audio → Text | Whisper | Multi-task pre-training |
| Text → Code | CodeLlama | Continued pre-training |

## Production Considerations

### Model Selection Checklist

- [ ] Source domain similarity to target
- [ ] Pre-training data quality and recency
- [ ] Model size vs inference constraints
- [ ] License compatibility
- [ ] Community support and ecosystem
- [ ] Fine-tuning infrastructure requirements

### Monitoring Transfer Quality

```python
# Track feature similarity between source and target
def compute_feature_similarity(source_model, target_loader):
    source_features = extract_features(source_model, target_loader)
    # Use CKA (Centered Kernel Alignment) or MMD
    cka_score = compute_cka(source_features, target_features)
    return cka_score  # Higher = more transferable
```

## Related Topics

- [[Fine_tuning_Techniques]]: Detailed fine-tuning methods
- [[Self_Supervised_Learning_Deep_Dive]]: Pre-training without labels
- [[PEFT_2026]]: Parameter-efficient fine-tuning latest
- [[Model_Merging_2026]]: Combining fine-tuned models
