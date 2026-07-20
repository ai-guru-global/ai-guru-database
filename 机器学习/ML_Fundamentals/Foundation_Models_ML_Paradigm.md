---
title: "基础模型作为ML范式转变"
category: "ML_Fundamentals"
tags:
  - foundation-models
  - paradigm-shift
  - scaling-laws
  - in-context-learning
  - pretrain-finetune
  - emergent-abilities
  - test-time-compute
summary: "从task-specific模型到Foundation Model的范式转变，涵盖预训练+微调范式、In-Context Learning、Scaling Laws、涌现能力的数学分析，以及2026年推理时计算与测试时训练的前沿进展。"
created: 2026-07-19
updated: 2026-07-19
---

# 基础模型作为ML范式转变

## 概述

Foundation Model（基础模型）代表了[[机器学习]]领域自统计学习理论以来最深刻的范式转变。传统ML pipeline围绕"一个任务、一个模型、一套标注数据"构建，而Foundation Model通过大规模预训练获取通用表征，再通过少量适配完成下游任务。这不仅是工程实践的变化，更是学习理论、优化范式和偏差-方差权衡的根本性重构。

### 范式对比

| 维度 | 传统ML | Foundation Model |
|------|--------|-----------------|
| 数据需求 | 每任务数千~数万标注样本 | 预训练需TB级无标注数据，微调仅需数十~数百样本 |
| 模型生命周期 | 训练→部署→废弃 | 预训练→适配→持续更新 |
| 泛化来源 | 归纳偏置 + 正则化 | 规模 + 数据多样性 + 架构通用性 |
| 任务适配 | 特征工程 + 模型选择 | Prompt / Adapter / LoRA |
| 评估方式 | 固定测试集 | 零样本/少样本/指令跟随 |

### 为什么是"范式转变"

Thomas Kuhn意义上的范式转变需要满足：
1. **反常积累**：传统方法在NLP、CV等领域的边际收益递减
2. **新范式出现**：GPT-3证明单一模型可处理数百任务
3. **不可通约性**：评估标准、工程流程、人才需求全面改变

---

## 核心原理

### 预训练+微调范式的数学框架

设预训练数据分布为 $p_{\text{pre}}(x, y)$，下游任务分布为 $p_{\text{task}}(x, y)$。

**传统ML**直接优化：

$$\theta^* = \arg\min_\theta \mathbb{E}_{(x,y) \sim p_{\text{task}}}[\mathcal{L}(f_\theta(x), y)]$$

**预训练+微调**分两阶段：

阶段一（预训练）：
$$\theta_{\text{pre}} = \arg\min_\theta \mathbb{E}_{(x,y) \sim p_{\text{pre}}}[\mathcal{L}_{\text{pre}}(f_\theta(x), y)]$$

阶段二（微调）：
$$\theta^* = \arg\min_\theta \mathbb{E}_{(x,y) \sim p_{\text{task}}}[\mathcal{L}_{\text{task}}(f_\theta(x), y)] + \lambda \cdot \Omega(\theta, \theta_{\text{pre}})$$

其中 $\Omega(\theta, \theta_{\text{pre}})$ 为正则项，约束微调不偏离预训练表征太远。

### 表征学习的形式化

预训练本质是学习映射 $\phi: \mathcal{X} \rightarrow \mathcal{Z}$，使得在表征空间 $\mathcal{Z}$ 中，下游任务变得"线性可分"或"低样本可学"。

**信息论视角**：好的预训练表征应最大化：

$$I(\phi(X); Y_{\text{task}}) \geq I(X; Y_{\text{task}}) - \epsilon$$

即表征保留了对下游任务预测的充分统计量。

### 偏差-方差权衡的变化

传统偏差-方差分解：

$$\mathbb{E}[(f(x) - y)^2] = \text{Bias}^2[f] + \text{Var}[f] + \sigma^2$$

其中：
- $\text{Bias}^2[f] = (\mathbb{E}[\hat{f}(x)] - f(x))^2$
- $\text{Var}[f] = \mathbb{E}[(\hat{f}(x) - \mathbb{E}[\hat{f}(x)])^2]$

**Foundation Model的关键洞察**：

1. **偏差项**：大模型（$10^{10}$+参数）的假设空间极大，偏差趋近于零
2. **方差项**：传统理论预测大模型方差爆炸，但实际观察到"double descent"现象
3. **插值区间**：当模型容量 $p \gg n$（参数远多于样本），方差反而下降

**Double Descent的数学解释**：

设模型有 $p$ 个参数，$n$ 个训练样本。最小范数插值解为：

$$\hat{\theta} = X^T(XX^T)^{-1}y \quad (p > n)$$

其测试误差为：

$$\mathbb{E}[\|\hat{\theta} - \theta^*\|^2] = \sigma^2 \cdot \frac{p}{p - n - 1} \quad \text{(当 } p > n+1\text{)}$$

当 $p \rightarrow \infty$ 时，方差 $\rightarrow \sigma^2$，而非爆炸。

### In-Context Learning (ICL)

ICL是Foundation Model最反直觉的能力：无需梯度更新，仅通过prompt中的示例即可"学习"新任务。

**形式化定义**：

给定上下文 $C = \{(x_1, y_1), ..., (x_k, y_k)\}$，ICL预测为：

$$\hat{y} = f_\theta(x_{\text{query}} | C) = \arg\max_y p_\theta(y | x_{\text{query}}, x_1, y_1, ..., x_k, y_k)$$

**ICL的隐式贝叶斯解释**（Xie et al., 2022）：

ICL等价于对隐变量 $\theta_{\text{task}}$ 的贝叶斯推断：

$$p(y|x_{\text{query}}, C) = \int p(y|x_{\text{query}}, \theta_{\text{task}}) \cdot p(\theta_{\text{task}}|C) \, d\theta_{\text{task}}$$

其中 $p(\theta_{\text{task}}|C) \propto p(C|\theta_{\text{task}}) \cdot p(\theta_{\text{task}})$ 是后验。

**ICL作为隐式梯度下降**（Dai et al., 2023）：

Transformer的注意力层可模拟一步梯度下降：

$$\theta_{\text{implicit}} = \theta_0 - \eta \sum_{i=1}^k \nabla_\theta \mathcal{L}(f_\theta(x_i), y_i)$$

这解释了为什么ICL性能随示例数增加而提升。

---

## Scaling Laws

### 经验定律

Kaplan et al. (2020) 和 Hoffmann et al. (2022, Chinchilla) 发现：

$$L(N, D, C) = \left(\frac{N_c}{N}\right)^{\alpha_N} + \left(\frac{D_c}{D}\right)^{\alpha_D} + L_\infty$$

其中：
- $N$：模型参数量
- $D$：训练数据token数
- $C \approx 6ND$：计算预算（FLOPs）
- $L_\infty$：不可约损失（数据熵）

**Chinchilla最优比例**：

$$N_{\text{opt}} \propto C^{0.5}, \quad D_{\text{opt}} \propto C^{0.5}$$

即最优策略是模型大小和数据量等比例扩展。

### 涌现能力 (Emergent Abilities)

**定义**：能力 $A$ 在模型规模 $N^*$ 处涌现，当且仅当：

$$\text{Acc}(N) \approx \text{random} \quad \forall N < N^*$$
$$\text{Acc}(N) \gg \text{random} \quad \forall N \geq N^*$$

**典型涌现阈值**：

| 能力 | 涌现规模 | 评估基准 |
|------|----------|----------|
| 多步算术 | ~13B | GSM8K |
| 代码生成 | ~30B | HumanEval |
| 指令跟随 | ~60B | MT-Bench |
| 复杂推理 | ~100B | MATH, ARC-Challenge |

**2024-2026修正观点**：

Schaeffer et al. (2023) 指出涌现可能是评估指标选择的artifact。使用连续指标（如token-level accuracy）替代离散指标（如exact match）后，性能提升变为平滑曲线。但2025-2026的研究表明，在组合推理和长链规划任务中，真正的相变仍然存在。

### Scaling Laws的2026扩展

**推理时计算 (Inference-time Compute)**：

$$\text{Performance} = f(N, D, C_{\text{train}}, C_{\text{test}})$$

传统Scaling Law只考虑训练计算 $C_{\text{train}}$，2026范式加入测试时计算 $C_{\text{test}}$：

$$C_{\text{test}} = \text{tokens\_generated} \times \text{model\_flops\_per\_token}$$

**测试时训练 (Test-Time Training, TTT)**：

在推理时对模型进行临时适配：

$$\theta_{\text{adapted}} = \theta_{\text{pre}} - \eta \nabla_\theta \mathcal{L}_{\text{self-supervised}}(\theta; x_{\text{test}})$$

---

## 算法详解

### 预训练目标函数

**自回归语言建模 (CLM)**：

$$\mathcal{L}_{\text{CLM}} = -\sum_{t=1}^T \log p_\theta(x_t | x_1, ..., x_{t-1})$$

**掩码语言建模 (MLM)**：

$$\mathcal{L}_{\text{MLM}} = -\sum_{i \in \mathcal{M}} \log p_\theta(x_i | x_{\backslash \mathcal{M}})$$

其中 $\mathcal{M}$ 为被掩码的token集合。

**多模态对比学习**：

$$\mathcal{L}_{\text{contrastive}} = -\frac{1}{B}\sum_{i=1}^B \log \frac{\exp(\text{sim}(z_i^v, z_i^t)/\tau)}{\sum_{j=1}^B \exp(\text{sim}(z_i^v, z_j^t)/\tau)}$$

### 参数高效微调 (PEFT)

**LoRA (Low-Rank Adaptation)**：

冻结预训练权重 $W_0 \in \mathbb{R}^{d \times d}$，学习低秩增量：

$$W = W_0 + \Delta W = W_0 + BA$$

其中 $B \in \mathbb{R}^{d \times r}$, $A \in \mathbb{R}^{r \times d}$, $r \ll d$。

可训练参数从 $d^2$ 降至 $2dr$，压缩比为 $d/(2r)$。

**Adapter**：

在每层Transformer中插入瓶颈层：

$$h' = h + f(W_{\text{up}} \cdot \text{ReLU}(W_{\text{down}} \cdot h))$$

其中 $W_{\text{down}} \in \mathbb{R}^{r \times d}$, $W_{\text{up}} \in \mathbb{R}^{d \times r}$。

### 2026范式：推理时计算与测试时训练

**Chain-of-Thought作为推理时计算**：

$$p(y|x) = \sum_z p(y|x, z) \cdot p(z|x)$$

其中 $z$ 为中间推理步骤。增加推理token数等价于增加 $|z|$，提升近似精度。

**Best-of-N采样**：

$$\hat{y} = \arg\max_{y_i, i=1..N} R(y_i) \quad \text{where } y_i \sim p_\theta(\cdot|x)$$

$R$ 为奖励模型。性能随 $N$ 对数增长：

$$\text{Performance}(N) \approx \text{Performance}(1) + c \cdot \log N$$

**Test-Time Training (TTT) Layers**：

将序列分段，每段内执行自监督更新：

$$\theta_t = \theta_{t-1} - \eta \nabla_\theta \mathcal{L}_{\text{reconstruct}}(\theta_{t-1}; x_{1:t})$$

这使得模型在推理时持续适配输入分布。

---

## 实验与基准

### 基准评估体系

| 基准 | 评估维度 | 传统ML | Foundation Model |
|------|----------|--------|-----------------|
| MMLU | 知识广度 | N/A | 5-shot accuracy |
| HumanEval | 代码生成 | 专用模型~30% | 零样本~70%+ |
| GSM8K | 数学推理 | 专用pipeline | CoT prompting |
| MTEB | 表征质量 | 任务专用embedding | 通用embedding |
| MT-Bench | 指令跟随 | N/A | 多轮对话评分 |

### Scaling实验数据

```
Model Size    | MMLU (5-shot) | HumanEval (0-shot) | GSM8K (CoT)
-------------|---------------|--------------------|-----------
1.3B         | 25.1%         | 8.5%               | 4.2%
7B           | 35.2%         | 18.3%              | 12.1%
13B          | 42.8%         | 25.7%              | 21.4%
30B          | 51.3%         | 38.2%              | 35.8%
70B          | 61.7%         | 52.1%              | 51.2%
175B         | 67.3%         | 61.4%              | 62.8%
405B         | 73.8%         | 71.2%              | 74.5%
```

### 微调效率对比

| 方法 | 可训练参数 | 显存需求 | 下游性能(相对全量微调) |
|------|-----------|----------|----------------------|
| Full Fine-tuning | 100% | 4x模型大小 | 100% |
| LoRA (r=16) | 0.1-1% | 1.2x模型大小 | 95-99% |
| Adapter | 1-5% | 1.3x模型大小 | 93-97% |
| Prompt Tuning | <0.01% | 1.0x模型大小 | 85-95% |
| BitFit | <0.1% | 1.1x模型大小 | 90-96% |

---

## 代码示例

### 使用Hugging Face进行零样本分类

```python
from transformers import pipeline

# 零样本分类 - 无需任何标注数据
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

text = "这款手机的电池续航非常出色，但屏幕亮度不够"
candidate_labels = ["正面评价", "负面评价", "中性评价"]

result = classifier(text, candidate_labels)
print(f"预测: {result['labels'][0]}, 置信度: {result['scores'][0]:.3f}")
```

### LoRA微调示例

```python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM, TrainingArguments, Trainer

# 加载预训练模型
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8B")

# 配置LoRA
lora_config = LoraConfig(
    r=16,                    # 低秩维度
    lora_alpha=32,           # 缩放因子
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# 应用LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# 输出: trainable params: 13M || all params: 8B || trainable%: 0.16%

# 训练配置
training_args = TrainingArguments(
    output_dir="./lora_output",
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    learning_rate=2e-4,
    fp16=True,
)
```

### In-Context Learning示例

```python
from openai import OpenAI

client = OpenAI()

def in_context_classification(text: str, examples: list, labels: list) -> str:
    """利用ICL进行少样本分类"""
    
    # 构建few-shot prompt
    prompt = "对以下文本进行情感分类。\n\n"
    for ex, label in zip(examples, labels):
        prompt += f"文本: {ex}\n情感: {label}\n\n"
    prompt += f"文本: {text}\n情感:"
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=10,
        temperature=0
    )
    return response.choices[0].message.content.strip()

# 仅需3个示例即可完成新任务适配
examples = ["这部电影太棒了", "服务态度很差", "产品质量一般"]
labels = ["正面", "负面", "中性"]
result = in_context_classification("物流很快，包装完好", examples, labels)
```

### Test-Time Training概念实现

```python
import torch
import torch.nn.functional as F

class TestTimeTraining:
    """测试时训练：在推理时通过自监督信号适配模型"""
    
    def __init__(self, model, lr=1e-4, steps=5):
        self.model = model
        self.lr = lr
        self.steps = steps
        self.original_state = {k: v.clone() for k, v in model.state_dict().items()}
    
    def adapt_and_predict(self, x_test):
        """对测试样本进行临时适配后预测"""
        optimizer = torch.optim.Adam(self.model.parameters(), lr=self.lr)
        
        # 自监督适配：masked reconstruction
        for _ in range(self.steps):
            mask = torch.bernoulli(torch.full_like(x_test, 0.15)).bool()
            x_masked = x_test.clone()
            x_masked[mask] = 0
            
            reconstruction = self.model(x_masked)
            loss = F.mse_loss(reconstruction[mask], x_test[mask])
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
        
        # 适配后预测
        with torch.no_grad():
            prediction = self.model(x_test)
        
        # 恢复原始参数
        self.model.load_state_dict(self.original_state)
        
        return prediction
```

---

## 对比表

### 传统ML vs Foundation Model：全维度对比

| 维度 | 传统ML (XGBoost/SVM/MLP) | Foundation Model |
|------|--------------------------|-----------------|
| 训练数据 | 每任务1K-100K标注样本 | 预训练1T+ tokens无标注 |
| 训练时间 | 分钟~小时 | 数周~数月（数千GPU） |
| 训练成本 | $10-$1000 | $1M-$100M+ |
| 适配新任务 | 重新收集数据+训练 | Prompt/LoRA（分钟级） |
| 模型大小 | KB~MB | GB~TB |
| 推理延迟 | μs~ms | 10ms~数秒 |
| 可解释性 | 较高（特征重要性） | 较低（需专门工具） |
| 部署复杂度 | 低 | 高（需GPU集群） |
| 数据隐私 | 可本地训练 | 通常需API调用 |
| 适用场景 | 结构化数据、小数据 | 非结构化数据、通用任务 |

### 预训练范式对比

| 范式 | 代表模型 | 预训练目标 | 适配方式 | 适用领域 |
|------|----------|-----------|----------|----------|
| CLM | GPT系列, LLaMA | 下一token预测 | Prompt/LoRA | NLP, 代码, 推理 |
| MLM | BERT, RoBERTa | 掩码token预测 | 分类头微调 | 理解任务 |
| Encoder-Decoder | T5, BART | Span corruption | Seq2seq微调 | 生成+理解 |
| 对比学习 | CLIP, SimCLR | 正负样本对比 | 线性探测 | 多模态, 检索 |
| 扩散模型 | Stable Diffusion | 去噪 | Text guidance | 图像生成 |
| 自监督 | MAE, DINO | 重建/蒸馏 | 线性探测 | 视觉表征 |

### Scaling Law参数对比

| 研究 | 模型范围 | 数据范围 | 关键发现 |
|------|----------|----------|----------|
| Kaplan (2020) | 768-1.5B | 10-100B tokens | 模型>数据 |
| Chinchilla (2022) | 70M-10B | 5-500B tokens | 模型≈数据 |
| LLaMA (2023) | 7-65B | 1-1.4T tokens | 过训练小模型 |
| 2025-2026 | MoE 1T+ | 10T+ tokens | 稀疏激活+推理计算 |

---

## 对ML工程师的影响

### 技能栈转变

**传统ML工程师核心技能**：
- 特征工程（占项目60-80%时间）
- 模型选择与超参搜索
- 数据清洗与标注管理
- 模型压缩与部署

**Foundation Model时代核心技能**：
- Prompt Engineering与评估
- RAG (Retrieval-Augmented Generation) 系统设计
- 微调策略（LoRA/QLoRA/全量）
- 推理优化（量化/蒸馏/推测解码）
- 评估体系设计（LLM-as-Judge）
- Agent编排与工具调用

### 工程实践变化

```
传统ML Pipeline:
数据收集 → 特征工程 → 模型训练 → 超参搜索 → 部署 → 监控

Foundation Model Pipeline:
数据准备 → Prompt设计/RAG构建 → 评估 → (可选)微调 → 部署 → 监控+迭代
```

---

## 2026前沿

### 推理时计算 (Inference-time Compute)

2026年的核心范式转变：不再仅通过增大模型提升性能，而是通过增加推理时计算量。

**方法谱系**：

1. **Chain-of-Thought (CoT)**：线性增加推理token
2. **Tree-of-Thought (ToT)**：搜索推理树
3. **MCTS + LLM**：蒙特卡洛树搜索引导推理
4. **Self-Consistency**：多路径采样+投票
5. **Process Reward Model (PRM)**：步骤级奖励引导

**数学框架**：

$$\text{Performance} = g(C_{\text{train}}) + h(C_{\text{test}})$$

其中 $h(C_{\text{test}}) \sim \log(C_{\text{test}})$ 对于搜索类方法。

### 测试时训练 (Test-Time Training)

**TTT作为新架构组件**：

将RNN/Transformer的固定权重替换为动态适配：

$$h_t = f_{\theta_t}(x_t), \quad \theta_t = \theta_{t-1} - \eta \nabla_\theta \mathcal{L}_{\text{aux}}(\theta_{t-1}; x_{1:t})$$

**优势**：
- 处理分布漂移无需重新训练
- 长序列建模中保持信息
- 个性化适配（每用户独立适配）

### 小模型+大推理 vs 大模型+少推理

2026年的关键权衡：

| 策略 | 代表 | 总FLOPs | 延迟 | 适用场景 |
|------|------|---------|------|----------|
| 大模型直接回答 | GPT-4级 | 1x | 低 | 简单任务 |
| 小模型+CoT | 7B+长推理 | 2-5x | 中 | 中等推理 |
| 小模型+搜索 | 7B+MCTS | 10-100x | 高 | 复杂规划 |
| 蒸馏推理链 | 大→小 | 训练高，推理低 | 低 | 部署优化 |

### 多模态Foundation Model

2026年趋势：统一架构处理文本、图像、音频、视频、3D、代码：

$$p(x_1^{\text{text}}, x_2^{\text{image}}, x_3^{\text{audio}}, ...) = \prod_t p(x_t | x_{<t})$$

所有模态tokenize后统一自回归建模。

---

## 与传统ML的数学对比：深入分析

### 泛化界的变化

**传统PAC-Bayes界**：

$$\mathbb{E}_{h \sim Q}[\mathcal{L}_{\text{test}}(h)] \leq \mathbb{E}_{h \sim Q}[\mathcal{L}_{\text{train}}(h)] + \sqrt{\frac{KL(Q \| P) + \ln(2n/\delta)}{2n}}$$

**Foundation Model的隐式正则化**：

预训练相当于设定了极窄的先验 $P$（集中在"好表征"附近），使得：
- $KL(Q \| P)$ 很小（微调不偏离太远）
- 有效样本复杂度降低（$n$ 可以很小）

### 迁移学习的理论保证

设源任务与目标任务的分布距离为 $d_{\mathcal{H}}(p_s, p_t)$（$\mathcal{H}$-divergence），则：

$$\epsilon_t(h) \leq \epsilon_s(h) + \frac{1}{2}d_{\mathcal{H}}(p_s, p_t) + \lambda^*$$

Foundation Model通过覆盖极广的预训练分布，最小化任意下游任务的 $d_{\mathcal{H}}$。

### 信息瓶颈视角

预训练可视为学习压缩映射：

$$\min_{\phi} I(X; \phi(X)) - \beta \cdot I(\phi(X); Y)$$

大模型的 $\phi(X)$ 维度极高，允许同时保留多个任务的信息，实现"一次压缩，多次解码"。

---

## 实践建议

### 何时选择Foundation Model vs 传统ML

| 场景特征 | 推荐方案 | 理由 |
|----------|----------|------|
| 标注数据 < 100条 | Foundation Model (零/少样本) | 传统ML无法训练 |
| 结构化表格 + 10K+样本 | XGBoost/LightGBM | 效率与精度兼顾 |
| 非结构化数据（文本/图像） | Foundation Model | 表征能力碾压 |
| 延迟要求 < 1ms | 传统ML/蒸馏小模型 | FM推理太慢 |
| 多任务统一系统 | Foundation Model | 一模型多任务 |
| 强可解释性要求 | 传统ML + SHAP | FM可解释性弱 |
| 数据隐私极严格 | 本地小模型/联邦学习 | 无法调用云端API |

### 迁移路径建议

1. **评估阶段**：用零样本/少样本快速验证FM在目标任务上的baseline
2. **对比阶段**：与现有传统ML pipeline做A/B对比
3. **适配阶段**：根据数据量选择Prompt Tuning / LoRA / 全量微调
4. **部署阶段**：量化(INT8/INT4) + 推测解码 + 缓存策略
5. **监控阶段**：建立LLM评估体系（自动评估 + 人工抽检）

### 成本估算参考

- 零样本API调用：$0.01-0.10/千次请求
- LoRA微调(7B模型)：$50-200（云GPU数小时）
- 全量预训练(7B模型)：$100K-500K（数千GPU小时）
- 推理部署(7B模型)：$500-2000/月（单GPU实例）

---

## 相关概念

- [[Scaling_Laws]] - 规模定律的详细数学推导
- [[In-Context_Learning]] - ICL机制的深入分析
- [[Parameter_Efficient_Fine_Tuning]] - LoRA/Adapter/Prefix Tuning
- [[Emergent_Abilities]] - 涌现能力的争议与证据
- [[Test_Time_Training]] - 测试时训练架构
- [[Chain_of_Thought]] - 推理时计算的核心方法
- [[Bias_Variance_Tradeoff]] - 经典偏差-方差权衡
- [[Transfer_Learning]] - 迁移学习理论基础
- [[Double_Descent]] - 双重下降现象
- [[Multimodal_Foundation_Models]] - 多模态基础模型
- [[ML_Engineering_Practices]] - ML工程实践
- [[Tabular_Foundation_Models_2026]] - 表格基础模型
- [[Federated_Learning_ML_Perspective]] - 联邦学习
- [[ML_Algorithms_Cheatsheet]] - ML算法速查
- [[Supervised_Learning]] - 监督学习基础
