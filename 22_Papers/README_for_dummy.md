# 22 Papers — 小白版 📚

> **一句话秒懂**: 这一章带你读 AI 领域最重要的"武林秘籍"——那些改变世界的经典论文。每篇论文都有"核心贡献"和"为什么必读"的解读，让你从论文源头理解现代 AI 是怎么来的。

## 为什么要读论文？

想象一下：
- 📜 你想知道 ChatGPT 的老祖宗是谁？→ Attention Is All You Need
- 🏆 你想知道 AlphaGo 为什么能赢围棋冠军？→ Playing Atari with Deep RL
- 🎨 你想知道 AI 画画背后的秘密？→ Denoising Diffusion Probabilistic Models
- 🔧 你想知道大模型是怎么训练的？→ GPT-3、LLaMA、InstructGPT

这些都是论文！读论文就是直接向 AI 先驱们学习。

## 学习路线图

```
第一站: 深度学习基础 📖
├─ AlexNet(深度学习大爆炸的起点)
├─ ResNet(让AI能训练超深网络)
└─ BatchNorm/Adam/Dropout(训练秘籍)

第二站: NLP 与 Transformer 🔤
├─ Attention(Transformer的诞生)
├─ BERT/GPT-3(预训练大模型)
└─ InstructGPT/LLaMA(让AI听话)

第三站: 生成式模型 🎨
├─ GAN(对抗生成网络)
├─ VAE(变分自编码器)
└─ Diffusion(扩散模型,AI画画的核心)

第四站: 强化学习与Agent 🎮
├─ DQN(第一个会玩游戏的AI)
├─ PPO(训练ChatGPT的算法)
└─ AlphaGo(战胜人类围棋冠军)
```

## 内容目录

| 主题 | 难度 | 你会学到什么 | 文档链接 |
|------|------|------------|---------|
| 深度学习基础 | ⭐⭐ | 深度学习为什么在2012年后爆发 | [查看 README](./README.md#01-深度学习基础与优化) |
| 视觉与表征学习 | ⭐⭐⭐ | CNN、ResNet、ViT 的核心贡献 | [查看 README](./README.md#02-视觉与表征学习) |
| NLP 与 Transformer | ⭐⭐⭐⭐ | 从 Attention 到 GPT、BERT 的演进 | [查看 README](./README.md#03-nlp-与-transformer) |
| 生成式模型 | ⭐⭐⭐⭐ | GAN、VAE、Diffusion 的原理 | [查看 README](./README.md#04-生成式模型) |
| 强化学习 | ⭐⭐⭐ | DQN、PPO、AlphaGo 的秘密 | [查看 README](./README.md#05-强化学习与智能体) |
| 规模化与工程化 | ⭐⭐⭐⭐ | Scaling Laws、ZeRO、LoRA、FlashAttention | [查看 README](./README.md#06-规模化与工程化) |
| 对齐与安全 | ⭐⭐⭐⭐ | RLHF、Constitutional AI、DPO | [查看 README](./README.md#07-对齐与安全) |

## 深度解读系列（精华！）

每篇论文都有专业团队写的深度解读：

| 论文深度解读 | 内容亮点 |
|-------------|---------|
| [Attention Is All You Need](./Attention_Is_All_You_Need_Deep_Dive.md) | Transformer 的完整技术剖析 |
| [ResNet](./ResNet_Deep_Dive.md) | 残差学习的数学直觉与工程实现 |
| [GPT-3](./GPT3_Deep_Dive.md) | 规模化、上下文学习与涌现能力 |
| [BERT](./BERT_Deep_Dive.md) | 双向编码、MLM/NSP 与预训练-微调范式 |
| [LLaMA](./LLaMA_Deep_Dive.md) | 开源 LLM 革命、RoPE/SwiGLU/RMSNorm |
| [Diffusion Models](./Diffusion_Models_Deep_Dive.md) | 从 DDPM 到 Stable Diffusion 再到 DiT |
| [RLHF 与 DPO](./RLHF_DPO_Deep_Dive.md) | InstructGPT 三阶段训练、DPO 数学推导 |
| [Mixture of Experts](./Mixture_of_Experts_Deep_Dive.md) | Switch Transformer、Mixtral、DeepSeek MoE |

## 开始之前你需要知道

**必备基础** (建议先看这些):
- [神经网络核心 - 小白版](../../03_Deep_Learning/Neural_Network_Core/Neural_Network_Core_for_dummy.md) - 理解 AI 大脑的工作原理
- [深度学习优化 - 小白版](../../03_Deep_Learning/Optimization/Optimization_for_dummy.md) - 理解训练过程

**不需要的基础**:
- ❌ 不需要会写论文
- ❌ 不需要懂特别多数学公式（我们用生活例子解释核心思想）
- ❌ 不需要英文好（论文有中文解读）

## 推荐阅读顺序

```
零基础小白路线:
第1步: 从"为什么必读"开始，建立大局观
      ↓
第2步: 读你感兴趣领域的深度解读
      ↓
第3步: 回到原始论文对照看
```

## 常见问题

### Q: 论文原文太难看不懂怎么办？

**A**: 先看"深度解读"系列！我们的解读把论文拆成生活例子，让你理解核心思想后再去看原文会容易很多。

### Q: 需要读多少论文？

**A**: 不用全部读完！选择你感兴趣的领域精读 2-3 篇，比泛泛读 20 篇更有效。

### Q: 论文更新太快吗？

**A**: 这些都是经典论文，它们的思想经过时间检验。2020 年的论文到现在依然是必读基础。

## 论文速查卡

| 论文 | 年份 | 核心贡献 | 一句话总结 |
|-----|------|---------|-----------|
| AlexNet | 2012 | ReLU + GPU 训练 | 深度学习大爆炸 |
| ResNet | 2015 | 残差连接 | 让训练千层网络成为可能 |
| Attention | 2017 | 自注意力机制 | Transformer 的诞生 |
| BERT | 2018 | 双向 Transformer | 预训练-微调时代开启 |
| GPT-3 | 2020 | 175B + 上下文学习 | 大模型时代的标志 |
| DDPM | 2020 | 逐步去噪扩散 | AI 画画的理论基础 |
| InstructGPT | 2022 | RLHF 三阶段训练 | ChatGPT 的技术核心 |
| LLaMA | 2023 | 开源大模型 | 开源大模型浪潮 |
| DPO | 2023 | 直接偏好优化 | 简化对齐的新方法 |

## 下一步

学完这章后，你可以：
- 去 [04_NLP_LLMs](../04_NLP_LLMs/README.md) 深入学习 LLM 技术
- 去 [05_Computer_Vision](../05_Computer_Vision/README.md) 深入学习计算机视觉
- 去 [06_Reinforcement_Learning](../06_Reinforcement_Learning/README.md) 深入学习强化学习

---

*本文是 [README.md](./README.md) 的简化版，适合零基础读者。准备好探索 AI 武林秘籍了吗？让我们开始吧！* 🚀