---
title: Context Window
category: concepts
tags: [context-window, llm, attention, tokenization, long-context]
summary: 上下文窗口（Context Window）指语言模型在生成下一个 token 时能够同时参考的前文 token 数量上限，是决定模型记忆范围与推理能力的关键超参数。
created: 2026-07-02
updated: 2026-07-21
sources:
  - "https://arxiv.org/abs/2307.03172"  # LongBench
---

# Context Window（上下文窗口）

## 定义

上下文窗口（Context Window）是 Transformer 类语言模型在单次前向传播中能够"看到"的 token 序列长度上限。它通常以 token 数量计量，例如 4K、128K 甚至 1M+ tokens。窗口内的文本（包括用户输入、系统提示和历史对话）会被编码为嵌入向量，经过自注意力机制计算，从而影响下一个 token 的生成。

## 核心机制

### 架构决定窗口大小

上下文窗口由模型架构与位置编码共同决定：

| 组件 | 作用 | 影响 |
|------|------|------|
| **Self-Attention** | 计算复杂度 O(n²) | 窗口越大，计算越贵 |
| **位置编码** | 编码 token 位置信息 | RoPE/ALiBi 支持外推 |
| **KV Cache** | 缓存已计算的 K/V | 窗口越大，显存越高 |
| **训练序列长度** | 模型见过的最长序列 | 决定窗口的有效上限 |

### 2026 主流模型窗口对比

| 模型 | 上下文窗口 | 有效利用 |
|------|------------|----------|
| GPT-4o | 128K | ~100K |
| Claude 4 | 200K | ~180K |
| Gemini 2.5 Pro | 1M+ | ~800K |
| Qwen3 | 128K (YaRN 1M) | ~128K |
| DeepSeek-V3 | 128K | ~100K |
| Llama 4 | 10M (Scout) | ~1M |

> 注："有效利用"指模型能真正理解和利用的窗口范围，通常小于标称值（"Lost in the Middle" 现象）。

### 窗口扩展技术

| 技术 | 原理 | 代表 |
|------|------|------|
| **RoPE 外推** | 旋转位置编码的频率缩放 | NTK-aware, YaRN |
| **滑动窗口注意力** | 只关注局部窗口 | Mistral, Gemma |
| **稀疏注意力** | 降低注意力计算复杂度 | Longformer, BigBird |
| **Ring Attention** | 分布式计算超长序列 | 训练时扩展 |
| **KV Cache 压缩** | 减少缓存显存占用 | H2O, SnapKV |

## 典型用例

| 场景 | 窗口需求 | 说明 |
|------|----------|------|
| 长文档问答 | 32K-128K | 整篇论文/合同理解 |
| 代码库级理解 | 128K-1M | 多文件代码分析 |
| 多轮对话 | 32K-200K | 保持一致性 |
| RAG 拼接 | 8K-32K | 检索结果 + 问题 |
| 视频/音频理解 | 1M+ | 多模态长序列 |

## 窗口 vs 相关概念

| 概念 | 与上下文窗口的关系 |
|------|------------------|
| **In-context Learning** | 窗口是 ICL 的物理限制；ICL 是利用窗口内示例学习的能力 |
| **KV Cache** | 扩大窗口直接增加 KV Cache 显存占用 |
| **RAG** | 互补：窗口决定"能放多少"，RAG 决定"放什么" |
| **上下文工程** | 在有限窗口内最大化信息价值的工程实践 |
| **Tokenization** | token 切分方式决定窗口能容纳多少实际内容 |

## 实践建议

1. **不要填满窗口**：留出 20-30% 空间给模型输出
2. **重要信息前置/后置**：避免 "Lost in the Middle" 效应
3. **按需选择窗口**：简单任务用短窗口降成本，复杂任务用长窗口保质量
4. **监控 Token 用量**：跟踪实际消耗，优化成本
5. **结合 RAG**：窗口有限时，用检索补充外部知识

## "Lost in the Middle" 现象

研究表明，当上下文很长时，模型对窗口中间位置的信息利用率显著下降：

```
注意力分布（示意）：

窗口头部 ████████████  ← 高注意力（System Prompt 放这里）
窗口中间 ███░░░░░░░██  ← 低注意力（容易被忽略）
窗口尾部 ██████████    ← 高注意力（最新信息放这里）
```

**应对策略：**
- 关键指令放在 System Prompt（头部）
- 最新工具结果放在消息末尾
- 中间位置放参考性信息（非关键）
- 长文档分段处理，而非一次性塞入

## 成本与窗口的关系

| 窗口使用 | 输入成本 | 输出成本 | 延迟 |
|----------|----------|----------|------|
| 4K tokens | 低 | 低 | 快 |
| 32K tokens | 中 | 中 | 中 |
| 128K tokens | 高 | 高 | 慢 |
| 1M tokens | 很高 | 很高 | 很慢 |

> 实践原则：用最小够用的窗口完成任务。大多数任务 8K-32K 即可。

## 窗口管理代码示例

```python
def manage_context(messages, max_tokens=128000, reserve_output=4000):
    """智能管理上下文窗口"""
    available = max_tokens - reserve_output
    current = count_tokens(messages)
    
    if current <= available:
        return messages
    
    # 策略 1：压缩早期对话
    system = messages[0]  # 保留 system prompt
    recent = messages[-10:]  # 保留最近 5 轮
    middle = messages[1:-10]
    
    # 策略 2：摘要中间内容
    summary = llm.summarize(middle)
    compressed = [system, {"role": "system", 
                  "content": f"早期对话摘要: {summary}"}] + recent
    
    # 策略 3：截断工具结果
    for msg in compressed:
        if msg.get("role") == "tool" and len(msg["content"]) > 2000:
            msg["content"] = msg["content"][:2000] + "...[truncated]"
    
    return compressed
```

## Related

- [[概念/LLM/tokenization|Tokenization]] — token 切分决定窗口容量
- [[概念/LLM/attention-variants|Attention 机制]] — 窗口大小的计算约束
- [[概念/LLM/transformer-architecture|Transformer 架构]] — 窗口的架构基础
- [[概念/LLM/kv-cache|KV Cache]] — 窗口的显存影响
- [[概念/LLM/long-context-models|长上下文模型]] — 窗口扩展技术
- [[概念/LLM/context-engineering|上下文工程]] — 窗口内容优化
- [[14_RAG系统/01_RAG_Fundamentals/RAG_Fundamentals|RAG]] — 窗口的外部补充

## 2026 主流模型上下文窗口

| 模型 | 上下文窗口 | 说明 |
|------|:--------:|------|
| **GPT-5** | 256K | OpenAI 旗舰 |
| **Claude Opus 4.8** | 1M | Anthropic 旗舰 |
| **Gemini 3 Ultra** | 2M | Google 旗舰 |
| **Llama 4** | 10M | 开源最长 |
| **DeepSeek-V3** | 128K | MoE 架构 |
| **Qwen3** | 128K | 中文最强 |
| **Mistral Large** | 128K | 欧洲开源 |

## 窗口大小 vs 实际效果

| 窗口大小 | 典型用途 | 注意事项 |
|:--------:|---------|----------|
| 4K-8K | 简单对话 | 早期模型默认 |
| 32K-64K | 文档分析 | 当前主流 |
| 128K | 长文档/代码库 | 注意 Lost-in-middle |
| 256K-1M | 书籍/大型代码库 | 成本高 |
| >1M | 特殊场景 | 质量可能下降 |

## 窗口优化策略

| 策略 | 说明 | 效果 |
|------|------|------|
| **摘要压缩** | 历史对话压缩为摘要 | 节省 50-80% |
| **RAG 检索** | 只检索相关内容 | 节省 90%+ |
| **滑动窗口** | 保留最近 N 轮 | 固定窗口使用 |
| **重要性排序** | 优先保留重要内容 | 质量保留 |
| **分块处理** | 长文档分块处理再合并 | 突破窗口限制 |

## 生产最佳实践

1. **不要填满窗口**: 预留 20-30% 缓冲，避免截断
2. **重要信息放开头/结尾**: 避免 Lost-in-middle 效应
3. **监控 Token 使用**: 跟踪实际使用 vs 窗口上限
4. **成本意识**: 长上下文 = 高成本，按需使用
5. **RAG 补充**: 大规模知识用 RAG，不要全塞入窗口
6. **降级方案**: 窗口不足时自动切换为摘要模式
7. **测试验证**: 长上下文场景测试实际效果，不要假设完美

## 窗口扩展技术

| 技术 | 原理 | 效果 | 状态 |
|------|------|------|:----:|
| **RoPE + NTK** | 位置编码插值 | 4-8x 扩展 | GA |
| **YaRN** | 注意力温度调整 | 8-16x 扩展 | GA |
| **Ring Attention** | 分布式注意力 | 理论上无限 | 研究 |
| **稀疏注意力** | 局部+全局注意力 | 线性复杂度 | GA |
| **MLA** | 低秩 KV 压缩 | 显存降 10x | GA |
