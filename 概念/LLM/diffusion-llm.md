---
title: 扩散语言模型(Diffusion LLM / dLLM)
category: concepts
tags:
  - llm
  - diffusion-model
  - dllm
  - llada
  - mercury
  - non-autoregressive
aliases:
  - Diffusion Language Model
  - 扩散大语言模型
  - dLLM
  - Masked Diffusion LM
relationships:
  - target: "概念/llm-architectures"
    type: evolves_from
  - target: "概念/chinchilla-scaling-laws"
    type: related_to
  - target: "概念/reasoning-models"
    type: related_to
summary: 扩散语言模型(Diffusion LLM, dLLM)用**离散掩码扩散**替代自回归生成,代表工作包括 LLaDA(人大 + 蚂蚁,arXiv:2502.09992,8B 性能比肩 LLaMA-3)、Inception Labs Mercury(首个商用 dLLM,1000+ tokens/s)、LLaDA2.0(2025-12 蚂蚁 MoE 100B)、Dream 等。dLLM 通过**双向 + 并行 + 全局感知**天然克服自回归的"逆向诅咒"和"推理单向"问题,2025-2026 已成为挑战 Transformer AR 范式的核心方向。
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources:
  - LLaDA arXiv:2502.09992
  - LLaDA2.0 arXiv:2512.15745(2025-12 100B MoE)
  - LLaDA2.1 arXiv:2602.08676
  - Inception Labs Mercury 商用
  - Dream 7B/8B
  - GitHub inclusionAI/LLaDA2.X
---

# 扩散语言模型(Diffusion LLM / dLLM)

## 一句话总结

**Diffusion LLM** 用**离散掩码扩散**替代自回归生成,代表工作 **LLaDA**(人大+蚂蚁,8B 性能比肩 LLaMA-3)和**Inception Labs Mercury**(首个商用 dLLM,1000+ tokens/s),LLaDA2.0 已扩展到 100B MoE;dLLM 通过**双向并行 + 全局感知**天然克服自回归的"逆向诅咒"和"推理单向"问题,是 2025-2026 挑战 Transformer AR 范式的核心方向。

---

## 1. 核心动机:为什么需要 dLLM?

自回归(AR)LLM 范式(GPT/LLaMA 风格)虽统治了 2020-2024,但存在三个根本性缺陷:

| 缺陷 | 表现 | 后果 |
|---|---|---|
| **逆向诅咒(Reversal Curse)** | 训练"A is B"后无法回答"B is A" | 知识表示不完整,无法做反向推理 |
| **生成单向性** | 只能从左到右 | 倒背诗词/反向补全/双向规划不可能 |
| **串行低效** | 严格 token-by-token | 长输出延迟高,无法并行 |

> **dLLM 的反直觉洞察**:LLM 的能力(规模法则、上下文学习、指令遵循)**不依赖自回归机制本身**,而依赖于"合理的生成建模原则(最大似然)+ 强大的 Transformer 架构 + 足够的数据规模"。

---

## 2. LLaDA(2025-02,首个开源 dLLM)

### 2.1 核心机制

| 组件 | 实现 |
|---|---|
| **前向过程** | t ∈ [0,1],每个 token 以概率 t 被 [MASK] 替换;t=1 时全掩码,t=0 时原样 |
| **反向过程** | 训练一个无因果 Transformer mask predictor,给定部分掩码序列预测所有 [MASK] |
| **训练目标** | 仅对被掩码 token 计算交叉熵,L(θ) = -E[1/t · Σ 1[x^i_t=M] log p_θ(x^i_0\|x_t)] |
| **推理** | 从全 [MASK] 出发,K 步去掩码;每步可重掩置信度低的 token |

> **关键证明**(Ou et al. 2024):L(θ) 是真实负对数似然的**上界**,LLaDA 仍属于严格的生成式概率框架,只是用"动态掩码率 + 并行恢复"替代了"逐 token 自回归"。

### 2.2 性能

| 基准 | LLaDA 8B | LLaMA-2 7B | LLaMA-3 8B | GPT-4o |
|---|---|---|---|---|
| **MMLU** | ✅ 全面超越 LLaMA-2 7B | 较弱 | 持平 | SOTA |
| **GSM8K(数学)** | **8B 最强** | 弱 | 持平 | 强 |
| **CMMLU/C-Eval(中文)** | **领先** | 弱 | 强 | 强 |
| **逆向古诗补全** | **45.6%** | - | - | **34.3%** ⚠️ dLLM 胜 |
| **前向古诗补全** | 51.8% | - | - | 82.7% |
| **整体可扩展性** | 与 ARM 几乎重合的 Scaling 曲线 | - | - | - |

> **逆向任务 45.6% > 34.3%**:LLaDA 在 GPT-4o 失败的反向补全任务上**反超**,彻底打破"逆向诅咒"。

### 2.3 训练成本

- **8B 参数 / 2.3T tokens** = 0.13M H800 GPU-hours
- 与同规模 ARM 基线**几乎相同算力**
- 证明"无因果 mask 带来的负担"被"并行掩码预测"完全抵消

---

## 3. LLaDA2.0(2025-12,MoE 100B)

蚂蚁 InclusionAI 团队 2025-12 发布的 LLaDA2.0 系列,首次把 dLLM 推到 **100B** 规模:

| 模型 | 架构 | 关键能力 |
|---|---|---|
| **LLaDA2.0-mini** | MoE 16B | 轻量部署 |
| **LLaDA2.0-flash** | **MoE 100B** | **首个 100B 级 dLLM** |
| **LLaDA2.0-flash-CAP** | + 置信度并行 | **推理 535 tokens/s,加速 2.1×** |

> LLaDA2.1(2026-02,arXiv:2602.08676)进一步通过**token editing**把 dLLM 推理推到 2.1× 加速;基于 **dInfer + SGLang** 实现了 KV-Cache 复用和块级并行解码,从学术成果走向工业可用。

---

## 4. Inception Labs Mercury(首个商用 dLLM)

| 维度 | 数值 |
|---|---|
| **发布** | 2024-2025 商用 |
| **速度** | NVIDIA H100 上 **1000+ tokens/s** |
| **Copilot Arena** | 并列第 2,**比 GPT-4o Mini 快 4×** |
| **设备** | 笔记本/手机可运行 |
| **代表** | Mercury Coder Mini(代码生成) |

> **Mercury 的成功证明了 dLLM 的工程可行性**——速度、准确率、成本、硬件门槛四个维度同时打败传统 AR 模型。

---

## 5. Dream(BAAI,8B 通用 dLLM)

北京智源 BAAI 的 Dream 系列,采用**对比解码**和**自适应噪声调度**做 dLLM 微调,在多个推理任务上达到与同规模 ARM 持平甚至超越。

---

## 6. 与 AR 范式的对比

| 维度 | AR(自回归) | dLLM(扩散) |
|---|---|---|
| **生成方向** | 单向(左→右) | **双向(全局感知)** |
| **并行性** | 严格串行 | **多 token 并行预测** |
| **逆向任务** | 灾难性失败(逆向诅咒) | **天然免疫** |
| **推理速度** | 数百 tokens/s | **1000+ tokens/s** |
| **KV-Cache** | 必须(大显存) | 不需要(节省显存) |
| **生成长度** | 灵活(动态) | 需预设 + EOS 截断 |
| **生态成熟度** | 极高(vLLM/SGLang) | 起步(dInfer 新出) |
| **Scaling 表现** | 已验证 1.5T tokens | 已验证 100B 参数 |
| **代表模型** | GPT-4o、Claude 3.5、DeepSeek-V3 | **LLaDA / Mercury / Dream** |

---

## 7. 2026 生态速览

| 流派 | 代表 | 立场 |
|---|---|---|
| **开源扩散 LLM** | LLaDA、LLaDA2.0/2.1、Dream | 8B-100B 完整谱系已打通 |
| **商用 dLLM** | Inception Labs Mercury | 代码生成已经商用 |
| **混合 dLLM** | 半自回归 + 扩散(分块左→右 + 块内扩散) | 兼顾速度与质量 |
| **多模态 dLLM** | LLaDA-Vision(2025+) | 视觉+文本双向建模 |
| **质疑派** | 学术社区部分学者 | dLLM 在长文本/复杂 agent 任务上仍未证明全面超越 AR |

---

## 8. 生产最佳实践

### 8.1 何时选 dLLM 而非 AR?

| 场景 | 选型 |
|---|---|
| **代码生成(短-中)** | ✅ Mercury Coder Mini(速度 + 准确) |
| **逆向推理、约束满足** | ✅ LLaDA(DPLL/搜索类问题) |
| **双向上下文(检索 + 推理)** | ✅ dLLM(无需前缀-后缀分离) |
| **长输出 / 创意写作** | ⚠️ AR 更稳,生成长度灵活 |
| **复杂 agent 规划** | ⚠️ AR 更成熟(vLLM/Tool use) |
| **超大规模 LLM(>100B)** | ⚠️ 2025-12 才有 100B dLLM,生态未成熟 |
| **通用 chat / API 场景** | ✅ AR(GPT-4o / Claude / DeepSeek)更安全 |

### 8.2 工程模板

```python
# LLaDA 推理伪代码(K 步去掩码)
def llada_generate(prompt, K=64, length=512):
    # 1. 初始化:全掩码响应
    x = [MASK] * length
    timesteps = linspace(1, 0, K+1)
    
    for t, s in zip(timesteps[:-1], timesteps[1:]):
        # 2. 并行预测所有掩码位置
        logits = model(prompt + x)
        
        # 3. 低置信度重掩码
        confidence = max_softmax(logits)
        mask_ratio = s / t
        # 重掩码 ~s/t 比例的 token
        x = remask_low_confidence(x, logits, mask_ratio)
    
    return x
```

### 8.3 关键决策

| 决策 | 推荐 |
|---|---|
| **训练 vs 推理** | dLLM 训练算力 = AR(可平替) |
| **是否需要 KV-Cache** | 否,显存友好 |
| **生成长度** | 预设 + EOS 截断,或 padding 后裁剪 |
| **重掩码策略** | 低置信度 > 随机 > 半自回归 |
| **推理步数 K** | 32-256,质量-速度权衡 |

### 8.4 局限

1. **生成长度预设**:不如 AR 灵活
2. **缺乏系统性推理生态**:vLLM 尚未原生支持
3. **RL/DPO 适配**:尚未在 dLLM 上成熟(DeepSeek-R1 风格不直接适用)
4. **大模型仍有差距**:100B 仅有 2025-12 才有,vs AR 已 405B+

---

## 9. See Also(官方源)

| 来源 | 链接 |
|---|---|
| **LLaDA 论文** | https://arxiv.org/abs/2502.09992 |
| **LLaDA GitHub** | https://github.com/ML-GSAI/LLaDA |
| **LLaDA 在线 Demo** | https://huggingface.co/spaces/multimodalart/LLaDA |
| **LLaDA2.0 论文(2025-12,100B)** | https://arxiv.org/abs/2512.15745 |
| **LLaDA2.1 论文(2026-02,Token Editing)** | https://arxiv.org/abs/2602.08676 |
| **LLaDA2.X 开源** | https://github.com/inclusionAI/LLaDA2.X |
| **Inception Labs Mercury** | https://chat.inceptionlabs.ai/ |
| **Dream 8B** | https://huggingface.co/spaces/multimodalart/Dream |
| **Ou et al. 2024 概率证明** | https://arxiv.org/pdf/2406.03736 |
| **关键术语英中对照** | Diffusion LLM / Masked Diffusion / Non-Autoregressive LM / Reversal Curse / Parallel Decoding / CAP(Confidence-Aware Parallel) |

---

## 10. 一句话结论(2026)

**dLLM 已从 2024 的学术玩具变成 2026 的工业可用范式——LLaDA 8B 比肩 LLaMA-3、Mercury 1000 tokens/s 商用、LLaDA2.0 推到 100B MoE;2026 主流观点:dLLM 不会取代 AR,但在**逆向推理 + 代码生成 + 低延迟部署**三大场景已稳定胜出;生态(vLLM、Tool use、RL 适配)仍在追赶,但**"自回归唯一论"已死**。**

## 相关链接

- [[概念/Vision/stable-diffusion|Stable Diffusion]] — 扩散模型在视觉领域的代表
- [[概念/General/diffusion-models|扩散模型]] — 扩散模型概念总览
- [[概念/LLM/autoregressive-generation|自回归生成]] — 扩散 LLM 对比的自回归生成
- [[大模型/LLM_Architectures/Transformer_Alternatives|Transformer 替代架构]] — 扩散 LLM 作为替代范式
- [[概念/Math/probability-statistics|概率统计]] — 扩散过程的数学基础
