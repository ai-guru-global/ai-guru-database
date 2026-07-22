---
title: 贪心解码（Greedy Decoding）
category: concepts
tags:
  - llm
  - inference
  - decoding
  - greedy-decoding
  - deterministic
aliases:
  - Greedy Decoding
  - 贪心解码
  - Greedy Search
relationships:
  - target: "概念/decoding-strategies"
    type: belongs_to
  - target: "概念/autoregressive-generation"
    type: used_in
  - target: "概念/beam-search"
    type: contrasted_with
summary: 贪心解码每一步都选择条件概率最高的 token，是最简单、最确定性的解码策略。优点是稳定高效，缺点是容易陷入局部最优、产生重复单调的文本。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
sources: []
---

# 贪心解码（Greedy Decoding）

## 一句话总结

贪心解码每一步都选择概率最高的 token，是**最简单、最确定性**的文本生成策略。

---

## 数学定义

在第 `t` 步，给定已生成的序列 `t_1, ..., t_{t-1}`，贪心解码选择：

```
t_t = argmax_{v ∈ V} P(v | t_1, t_2, ..., t_{t-1})
```

其中 `V` 是整个词表。

---

## 伪代码

```python
def greedy_decode(model, prompt, max_length):
    input_ids = tokenize(prompt)
    for _ in range(max_length):
        logits = model(input_ids)
        next_token_id = argmax(logits[:, -1, :])
        input_ids.append(next_token_id)
        if next_token_id == eos_token_id:
            break
    return detokenize(input_ids)
```

---

## 优点

| 优点 | 说明 |
|---|---|
| **确定性** | 同样的输入一定产生同样的输出，可复现 |
| **计算简单** | 只需要一次 argmax，无需额外采样 |
| **速度快** | 没有随机性带来的额外开销 |
| **事实性较强** | 对于知识密集型任务，通常比高温度采样更准确 |

---

## 缺点

| 缺点 | 说明 |
|---|---|
| **容易重复** | 模型可能陷入高概率词的循环 |
| **缺乏多样性** | 同样的 prompt 永远得到同一个回答 |
| **局部最优** | 每一步最优不等于全局最优 |
| **创造性弱** | 不适合创意写作、头脑风暴等任务 |

### 典型失败案例

```
输入：今天天气很好，我想
输出：今天天气很好，我想出去走走，出去走走，出去走走，...
```

---

## 适用场景

| 场景 | 原因 |
|---|---|
| **代码生成** | 代码需要精确、确定性输出 |
| **数学推理** | 数学题通常有唯一正确答案 |
| **知识问答** | 降低幻觉，提高事实准确性 |
| **结构化输出** | JSON、SQL 等格式要求严格 |
| **评估基准测试** | 保证结果可复现，便于对比 |

---

## 与 Beam Search 的对比

| 特性 | 贪心解码 | Beam Search |
|---|---|---|
| 每步保留候选 | 1 个 | k 个 |
| 计算成本 | 低 | 中 ~ 高 |
| 全局最优性 | 差 | 较好 |
| 重复问题 | 严重 | 中等 |
| 适用任务 | 确定性任务 | 序列到序列任务（翻译、摘要）|

---

## 实践建议

1. **配合重复惩罚使用**：即使贪心解码，也建议设置 `repetition_penalty=1.0~1.1`。
2. **不要用于开放式创作**：故事、诗歌等需要多样性的任务效果差。
3. **评估时统一使用**：论文和基准测试通常报告 greedy 结果，便于公平比较。
4. **Temperature=0 的等价性**：很多框架用 `temperature=0` 实现贪心解码，但严格来说 `T→0` 是极限过程。

---

## 延伸阅读

- [[概念/decoding-strategies|解码策略总览]]
- [[概念/beam-search|束搜索]]
- [[概念/temperature-scaling|温度缩放]]
- [[概念/autoregressive-generation|自回归生成]]

---

## 2026 解码策略生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Speculative Decoding** | Draft-Verify 机制，加速 2-3x | GA |
| **MTP (Multi-Token Prediction)** | DeepSeek-V3 原生多 Token 预测 | GA |
| **EAGLE-2/3** | 外部 Draft 模型投机解码 | GA |
| **Medusa** | 多头并行预测，无需 Draft 模型 | GA |
| **温度调度** | 动态调整 temperature，平衡质量与多样性 | GA |

## 生产最佳实践

1. **任务匹配策略**：代码/数学用贪心，创意写作用采样，翻译用 Beam Search
2. **重复惩罚必配**：即使贪心解码也设置 repetition_penalty=1.05-1.1
3. **投机解码加速**：生产环境启用 Speculative Decoding，提升吐量 2-3x
4. **温度调度**：长文本生成使用温度调度，避免后期质量下降
5. **A/B 测试**：不同解码策略进行 A/B 测试，选择最优配置
6. **监控输出质量**：跟踪重复率、连贯性指标
7. **降级方案**：贪心解码失败时回退到采样

## 2026 解码策略对比

| 策略 | 确定性 | 多样性 | 质量 | 速度 | 适用 |
|------|:------:|:------:|:----:|:----:|------|
| **贪心** | 极高 | 无 | 中 | 极快 | 代码/数学 |
| **Beam Search** | 高 | 低 | 高 | 慢 | 翻译 |
| **Top-k** | 中 | 中 | 中-高 | 快 | 通用 |
| **Top-p** | 中 | 中-高 | 高 | 快 | 通用 |
| **Temperature** | 可调 | 可调 | 可调 | 快 | 通用 |

## 贪心解码 vs 采样

| 维度 | 贪心解码 | 采样解码 |
|------|---------|----------|
| **输出** | 确定性 | 随机性 |
| **重复风险** | 高 | 低 |
| **多样性** | 无 | 有 |
| **可复现** | 是 | 需固定 seed |
| **适用** | 事实/代码 | 创意/对话 |

## 代码示例

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen3-8B")
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen3-8B")

# 贪心解码
inputs = tokenizer("解释量子计算", return_tensors="pt")
outputs = model.generate(
    **inputs,
    max_new_tokens=512,
    do_sample=False,          # 贪心解码
    repetition_penalty=1.1,   # 重复惩罚
)
print(tokenizer.decode(outputs[0]))
```

## 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 输出重复 | 贪心陷入循环 | 加 repetition_penalty |
| 质量不稳定 | 任务不适合贪心 | 换用采样/Beam |
| 速度不够快 | 未用加速技术 | 启用推测解码 |
| 输出太短 | EOS 过早触发 | 调整 min_length |
