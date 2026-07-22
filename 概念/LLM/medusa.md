---
title: "Medusa 多头推测解码 (Medusa Multi-Head Speculative Decoding)"
category: -concepts
tags: ["medusa", "speculative-decoding", "multi-head", "self-speculative", "inference-optimization", "tree-attention"]
relationships:
  - target: "概念/Inference/speculative-decoding"
    type: related_to
  - target: "概念/LLM/eagle"
    type: related_to
  - target: "概念/LLM/mtp"
    type: related_to
  - target: "概念/Inference/inference-performance"
    type: improves
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - "https://arxiv.org/abs/2401.10774"  # Medusa paper
summary: "Medusa 是自推测解码方案——在目标模型上添加多个轻量预测头，同时预测未来多个 Token，无需独立 Draft 模型。通过 Tree Attention 并行验证，加速 2-3× 且无额外模型显存开销。2026 年已被 EAGLE-2 和 MTP 逐步替代，但仍是理解自推测解码的重要基础。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Medusa"
  - "Medusa 多头推测解码"
  - "Medusa Decoding"

---

# Medusa 多头推测解码

> **一句话理解**: Medusa 是“多头并行预测”——在目标模型上加几个轻量 Head，同时预测未来多个 Token，无需额外 Draft 模型。

## 核心思想

```
传统投机解码：
目标模型 ←→ 独立 Draft 模型（需额外加载）

Medusa 自推测解码：
目标模型
├── 原始输出头 → Token[t+1]（标准自回归）
├── Medusa Head 1 → 预测 Token[t+1]
├── Medusa Head 2 → 预测 Token[t+2]
├── Medusa Head 3 → 预测 Token[t+3]
└── 验证：目标模型一次前向传播验证所有预测
```

**关键创新**：不需要独立的 Draft 模型，而是在目标模型上附加轻量预测头，大幅降低部署复杂度。

## 架构细节

| 特性 | 说明 |
|------|------|
| **Head 数量** | 通常 3-5 个 |
| **Head 结构** | 2 层 MLP（极轻量，<1% 参数量） |
| **训练方式** | 冻结主模型，仅训练 Heads |
| **推理方式** | Tree Attention 并行验证 |
| **兼容性** | 任何自回归 LLM |
| **训练数据** | 与主模型相同的训练集子集 |

### Tree Attention 验证

```
Medusa 生成候选树:
         [t]
        / | \
     [t+1a][t+1b][t+1c]   ← Head 1 的 top-3
      / \     |
  [t+2a][t+2b][t+2c]     ← Head 2 的 top-2
    |
  [t+3a]              ← Head 3 的 top-1

验证: 目标模型一次前向传播验证整棵树
接受: 沿最长正确路径接受 [t+1a, t+2a, t+3a]
拒绝: 从第一个错误节点截断
```

## 与其他推测解码方案对比

| 方案 | Draft 来源 | 加速比 | 额外显存 | 接受率 | 2026 状态 |
|------|-----------|:------:|:-------:|:------:|:------:|
| **标准投机解码** | 独立小模型 | 1.5-2× | 大 | 60-80% | 少用 |
| **Medusa** | 多头并行 | 2-3× | 极小 | 70-85% | 被替代 |
| **EAGLE** | 特征外推 | 2-3× | 极小 | 80-90% | 活跃 |
| **EAGLE-2** | 动态 Draft Tree | 3-4× | 极小 | 85-95% | **主流** |
| **MTP (DeepSeek)** | 模型内置预测头 | 2-3× | 无 | 80-95% | **主流** |

## Medusa vs EAGLE

| 维度 | Medusa | EAGLE |
|------|--------|-------|
| **预测方式** | 各 Head 独立预测 | 特征级外推 |
| **上下文利用** | 仅最后 Token | 完整上下文特征 |
| **接受率** | 70-85% | 80-90% |
| **训练成本** | 低（训练 Heads） | 低（训练 Head） |
| **复杂度** | 低 | 中 |
| **多 Token 关联** | 无（各 Head 独立） | 有（自回归 Draft） |

## 性能数据

| 模型 | 场景 | 加速比 | 接受长度 |
|------|------|:------:|:------:|
| Vicuna-7B | 对话 | 2.2× | 2.5 tokens/step |
| Vicuna-13B | 对话 | 2.5× | 2.8 tokens/step |
| Llama-2-7B | 代码生成 | 2.8× | 3.1 tokens/step |
| Mistral-7B | 摘要 | 2.1× | 2.3 tokens/step |

> 注: 加速比受任务类型影响大——确定性高的任务（代码/格式化）加速更明显

## 训练流程

```python
# Medusa 训练伪代码
# 1. 冻结主模型
for param in model.parameters():
    param.requires_grad = False

# 2. 添加 Medusa Heads
medusa_heads = nn.ModuleList([
    nn.Sequential(nn.Linear(hidden, hidden), nn.SiLU(),
                  nn.Linear(hidden, vocab_size))
    for _ in range(num_heads)  # 3-5 个
])

# 3. 训练: 每个 Head 预测未来第 k 个 token
for head_k in medusa_heads:
    loss_k = cross_entropy(head_k(hidden_states), labels[:, k:])
```

## 2026 生态定位

| 方面 | 说明 |
|------|------|
| **当前状态** | 已被 EAGLE-2/MTP 逐步替代 |
| **历史价值** | 开创了“自推测解码”范式 |
| **适用场景** | 快速原型验证、资源受限环境 |
| **框架支持** | vLLM (实验)、SGLang (EAGLE 优先) |
| **建议** | 新项目优先选 EAGLE-2 或 MTP |

## 生产最佳实践

1. **新项目优先 EAGLE-2**：接受率更高，加速比更好
2. **Medusa 适合快速验证**：训练简单，几小时即可完成
3. **Head 数量 3-5 个**：太多增加验证开销，收益递减
4. **确定性任务加速更明显**：代码生成、格式化输出 > 开放对话
5. **与 KV Cache 优化正交**：可同时使用 GQA + Medusa

## Medusa vs 其他推测解码方案

| 方案 | Draft 模型 | 训练成本 | 加速比 | 质量保留 |
|------|-----------|---------|--------|----------|
| **Medusa** | 额外 Head | 低（几小时） | 1.5-2.5x | 无损 |
| **EAGLE** | 特征级 Draft | 中 | 2-3x | 无损 |
| **标准 Speculative** | 小模型 | 无（用现有小模型） | 2-3x | 无损 |
| **MTP** | 原生多 Token | 高（预训练时） | 1.5-2x | 无损 |
| **Lookahead** | N-gram 匹配 | 无 | 1.3-1.8x | 无损 |

## Medusa 工作原理

```
标准自回归:  t1 → t2 → t3 → t4 → t5  (串行 5 步)

Medusa (3 heads):
  Step 1: 主干生成 t1
           Head1 预测 t2, Head2 预测 t3, Head3 预测 t4
  Step 2: 验证 t2,t3,t4 → 接受 t2,t3，拒绝 t4
  Step 3: 主干从 t3 继续...

效果: 5 个 Token 只需 2-3 步完成
```

## Medusa 训练配置示例

```python
# Medusa 训练配置 (基于 HuggingFace)
medusa_config = {
    "num_heads": 4,           # 额外预测头数量
    "num_layers": 1,          # 每个头的层数
    "hidden_size": 4096,      # 与主干模型一致
    "dropout": 0.1,
    "learning_rate": 3e-4,
    "num_epochs": 3,          # 通常 3-5 epoch 即可
    "dataset": "sharegpt",    # 对话数据训练
}
# 训练时间: 7B 模型约 2-4 小时 (A100)
```

## 延伸阅读

- [[概念/LLM/eagle|EAGLE]] — 更强的推测解码方案
- [[概念/LLM/speculative-decoding|投机解码]] — 推测解码基础
- [[概念/LLM/mtp|Multi-Token Prediction]] — 原生多 Token 预测
- [[概念/LLM/sampling-decoding|采样与解码]] — 解码策略全景

## Related

- [[概念/Inference/speculative-decoding]] — 投机解码
- [[概念/LLM/eagle]] — EAGLE 推测解码
- [[概念/LLM/mtp]] — Multi-Token Prediction
- [[概念/Inference/inference-performance]] — 推理性能优化
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
