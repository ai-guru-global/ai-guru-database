---
title: "ms-swift 深度解析：魔搭大模型训练推理全链路框架"
summary: "系统梳理 ms-swift（ModelScope SWIFT）框架的核心能力，涵盖600+纯文本大模型与400+多模态模型的预训练、微调、GRPO强化学习、RLHF人类对齐、推理部署、评测、量化导出全流程，对标官方文档 v4.x 信息量。"
category: 07-model-training
tags:
  - ms-swift
  - ModelScope
  - LLM训练
  - 微调框架
  - GRPO
  - RLHF
  - Megatron
  - LoRA
  - 多模态训练
  - 推理部署
  - 模型评测
  - 量化
created: 2026-06-03
updated: 2026-06-03
---

# ms-swift 深度解析：魔搭大模型训练推理全链路框架

## 1. 框架概览

**ms-swift**（Scalable lightWeight Infrastructure for Fine-Tuning）是魔搭社区（ModelScope）提供的大模型与多模态大模型**微调部署一体化框架**。

### 1.1 核心数据

| 维度 | 数据 |
|------|------|
| **支持模型** | 600+ 纯文本大模型、400+ 多模态大模型 |
| **内置数据集** | 150+ 预训练、微调、人类对齐、多模态数据集 |
| **当前版本** | Swift 4.x（main 分支） |
| **GitHub** | https://github.com/modelscope/ms-swift |
| **文档** | https://swift.readthedocs.io/zh-cn/latest/ |
| **许可证** | Apache 2.0 |

### 1.2 支持的模型系列

**纯文本大模型**：Qwen3、Qwen3.5、InternLM3、GLM4.5、Mistral、DeepSeek-R1、Llama4 等

**多模态大模型**：Qwen3-VL、Qwen3-Omni、Llava、InternVL3.5、MiniCPM-V-4、Ovis2.5、GLM4.5-V、DeepSeek-VL2 等

**All-to-All 全模态模型**：支持文本、图像、视频、语音混合模态

### 1.3 为什么选择 ms-swift

| 能力维度 | 技术亮点 |
|---------|---------|
| **轻量训练** | LoRA、QLoRA、DoRA、LoRA+、LLaMAPro、LongLoRA、LoRA-GA、ReFT、RS-LoRA、Adapter、LISA |
| **量化训练** | BNB、AWQ、GPTQ、AQLM、HQQ、EETQ，7B 模型仅需 9GB 显存 |
| **显存优化** | GaLore、Q-Galore、UnSloth、Liger-Kernel、Flash-Attention 2/3、Ulysses/Ring-Attention 序列并行 |
| **分布式训练** | DDP、device_map、DeepSpeed ZeRO2/ZeRO3、FSDP/FSDP2、Megatron |
| **多模态** | 多模态 packing 提速 100%+，文本/图像/视频/语音混合训练，ViT/Aligner/LLM 单独控制 |
| **强化学习** | GRPO、DAPO、GSPO、SAPO、CISPO、CHORD、RLOO、Reinforce++等 GRPO 族算法 |
| **推理加速** | Transformers、vLLM、SGLang、LMDeploy |
| **模型量化** | AWQ、GPTQ、FP8、BNB 量化导出 |
| **Megatron 并行** | TP/PP/SP/CP/ETP/EP/VPP，显著提升 MoE 训练速度 |
| **硬件支持** | A10/A100/H100、RTX 系列、T4/V100、CPU、MPS、Ascend NPU |

### 1.4 全链路能力矩阵

```
┌─────────────────────────────────────────────────────────────────┐
│                      ms-swift 全链路                             │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│  预训练   │  微调SFT  │  RLHF/RL │  推理     │  评测     │  导出     │
│ swift pt │ swift sft│swift rlhf│swift infer│swift eval│swift export│
│          │          │ swift grpo│swift deploy│         │          │
│          │          │ swift gkd │          │          │          │
│          │          │ swift sample│         │          │          │
├──────────┴──────────┴──────────┴──────────┴──────────┴──────────┤
│                    Web-UI: swift app                              │
│              Megatron-SWIFT: megatron sft/pt/rlhf                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 安装与环境

### 2.1 Wheel 包安装

```bash
# 推荐
pip install 'ms-swift' -U

# 额外安装 Megatron 依赖
pip install 'ms-swift[megatron]' -U

# 额外安装评测依赖
pip install 'ms-swift[eval]' -U

# 全能力
pip install 'ms-swift[all]' -U

# 使用 uv
pip install uv
uv pip install 'ms-swift' --torch-backend=auto
```

### 2.2 源代码安装

```bash
# Swift 4.x（main 分支）
git clone https://github.com/modelscope/ms-swift.git
cd ms-swift
pip install -e .

# 全能力
pip install -e '.[all]'
```

### 2.3 Docker 镜像

```bash
# Swift 4.2.3 + CUDA 13.0 + PyTorch 2.11 + vLLM 0.21
modelscope-registry.cn-hangzhou.cr.aliyuncs.com/modelscope-repo/modelscope:ubuntu22.04-cuda13.0.3-py312-torch2.11.0-vllm0.21.0-modelscope1.36.3-swift4.2.3
```

### 2.4 推荐环境版本

| 组件 | 推荐版本 | 说明 |
|------|---------|------|
| Python | >=3.10（推荐3.12） | |
| CUDA | 12.8/13.0 | CPU/NPU/MPS无需 |
| PyTorch | >=2.0（推荐2.8/2.11） | |
| transformers | >=4.33（推荐4.57/5.8） | |
| modelscope | >=1.23 | |
| peft | >=0.11,<0.20 | LoRA |
| flash_attn | 2.8.3/4.0.0b15 | |
| trl | >=0.15,<1.0（推荐0.29） | RLHF |
| deepspeed | >=0.14（推荐0.18） | 训练 |
| vllm | >=0.5.1（推荐0.11/0.21） | 推理/部署 |
| sglang | >=0.4.6 | 推理/部署 |
| evalscope | >=1.0 | 评测 |

### 2.5 支持的硬件

| 硬件 | 备注 |
|------|------|
| A10/A100/H100 | 完全支持 |
| RTX20/30/40系列 | 完全支持 |
| T4/V100 | 部分模型出现NAN |
| Ascend NPU | 部分模型算子不支持 |
| MPS | 参考 issue 4572 |
| CPU | 完全支持 |

---

## 3. 快速开始：10 分钟单卡 3090 微调

```bash
# 13GB显存，对 Qwen3-4B-Instruct 进行自我认知微调
CUDA_VISIBLE_DEVICES=0 \
swift sft \
    --model Qwen/Qwen3-4B-Instruct-2507 \
    --tuner_type lora \
    --dataset 'AI-ModelScope/alpaca-gpt4-data-zh#500' \
              'AI-ModelScope/alpaca-gpt4-data-en#500' \
              'swift/self-cognition#500' \
    --torch_dtype bfloat16 \
    --num_train_epochs 1 \
    --per_device_train_batch_size 1 \
    --learning_rate 1e-4 \
    --lora_rank 8 \
    --lora_alpha 32 \
    --target_modules all-linear \
    --gradient_accumulation_steps 16 \
    --eval_steps 50 \
    --save_steps 50 \
    --save_total_limit 2 \
    --logging_steps 5 \
    --max_length 2048 \
    --output_dir output \
    --warmup_ratio 0.05 \
    --dataloader_num_workers 4 \
    --model_author swift \
    --model_name swift-robot
```

**推理验证**：
```bash
CUDA_VISIBLE_DEVICES=0 \
swift infer \
    --adapters output/vx-xxx/checkpoint-xxx \
    --stream true \
    --temperature 0 \
    --max_new_tokens 2048
```

**使用 vLLM 加速推理**（需先 merge-lora）：
```bash
CUDA_VISIBLE_DEVICES=0 \
swift infer \
    --adapters output/vx-xxx/checkpoint-xxx \
    --stream true \
    --merge_lora true \
    --infer_backend vllm \
    --vllm_max_model_len 8192 \
    --temperature 0 \
    --max_new_tokens 2048
```

**推送模型**：
```bash
CUDA_VISIBLE_DEVICES=0 \
swift export \
    --adapters output/vx-xxx/checkpoint-xxx \
    --push_to_hub true \
    --hub_model_id '<your-model-id>' \
    --hub_token '<your-sdk-token>' \
    --use_hf false
```

---

## 4. 预训练与微调

### 4.1 训练能力矩阵

| 方法 | 全参数 | LoRA | QLoRA | DeepSpeed | 多机 | 多模态 |
|------|--------|------|-------|-----------|------|--------|
| 预训练 (`swift pt`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 指令微调 (`swift sft`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GRPO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GKD | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PPO | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| DPO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| KTO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| RM | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CPO/SimPO/ORPO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Embedding | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reranker | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 序列分类 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 4.2 预训练

```bash
# swift pt 自动使用生成式（非对话式）template
# 等价于 swift sft --use_chat_template false --loss_scale all
swift pt --model <model_id> --dataset <dataset> ...
```

### 4.3 分布式训练技术

| 技术 | 说明 |
|------|------|
| **DDP** | 数据并行，标准多卡 |
| **device_map** | 简易模型并行，按层分配到多GPU，降低显存但速度降低 |
| **DDP+device_map** | 按组进行device_map划分 |
| **DeepSpeed ZeRO2** | 优化器状态+梯度分片 |
| **DeepSpeed ZeRO3** | ZeRO2+模型参数分片，更省显存但更慢 |
| **FSDP/FSDP2** | 双卡3090可运行70B模型训练（FSDP+QLoRA） |
| **多机多卡** | 支持swift/torchrun/dlc/deepspeed/accelerate启动 |

### 4.4 多模态训练

- 支持 Caption、VQA、OCR、Grounding 任务
- 支持图像、视频、音频三种模态
- ViT/Aligner 全参数训练 + LLM LoRA训练（不同学习率）
- 多模态packing提升训练速度100%+

### 4.5 其他训练技术

| 技术 | 说明 |
|------|------|
| **数据流式读取** | 大数据量时减少内存使用 |
| **Packing** | 将多个序列拼成一个，接近max_length，提高显卡利用率 |
| **长文本训练** | 序列并行技术支持 |
| **Lazy Tokenize** | 训练期间tokenize而非训练前，避免预处理等待 |

### 4.6 Python API

```python
from swift import sft_main, SftArguments

result = sft_main(SftArguments(
    model='Qwen/Qwen2.5-7B-Instruct',
    tuner_type='lora',
    dataset=['AI-ModelScope/alpaca-gpt4-data-zh#500',
             'AI-ModelScope/alpaca-gpt4-data-en#500',
             'swift/self-cognition#500'],
    torch_dtype='bfloat16',
    # ...
))
```

---

## 5. GRPO 强化学习

GRPO（Group Relative Policy Optimization）是 ms-swift 的核心亮点之一，内置了丰富的 GRPO 族算法。

### 5.1 GRPO 族算法全景

| 算法 | 论文 | 核心思想 |
|------|------|---------|
| **GRPO** | arxiv 2402.03300 | 组相对策略优化，无需 Critic 模型 |
| **DAPO** | 开源大规模 RL 系统 | 大规模分布式 RL 训练优化 |
| **GSPO** | Group Sequence Policy Optimization | 序列级策略优化 |
| **SAPO** | Soft Adaptive Policy Optimization | 软自适应策略优化 |
| **CISPO** | Clipped Importance Sampling PO | 重要性采样裁剪策略优化 |
| **CHORD** | On-Policy RL Meets Off-Policy Experts | SFT 与 RL 动态权重融合 |
| **RLOO** | REINFORCE Leave-One-Out | 留一法基线估计 |
| **Reinforce++** | Efficient RLHF Algorithm | 对 Prompt 和 Reward Model 鲁棒 |
| **TreePO** | Heuristic Tree-based Modeling | 策略优化与推理效率桥接 |
| **FIPO** | Future-KL Influenced PO | 未来 KL 影响的策略优化 |

### 5.2 GRPO 训练结构

```
Get Started
├── GRPO 基础训练

Developer Guide
├── Loss Types（损失类型选择）
├── 多轮训练（Multi-turn Training）
├── 多任务训练（Multi-task Training）
├── 奖励函数（Reward Function）
├── 奖励模型（Reward Model）
└── GYM环境训练（GYM Environment）

Advanced Research
├── Entropy Mask（高熵Token驱动RL）
├── CISPO / DAPO / FIPO / GSPO / CHORD
├── DeepEyes（图像思考强化学习）
├── RLOO / Reinforce++ / SAPO / TreePO
└── Training-Inference-Mismatch
```

### 5.3 GRPO 训练示例

```bash
# 参考 examples/train/grpo/internal
swift rlhf --rlhf_type grpo --model <model_id> --dataset <dataset> ...
```

---

## 6. GKD 知识蒸馏

GKD（Generalized Knowledge Distillation）提供灵活的知识蒸馏能力。

### 6.1 核心特性

| 特性 | 说明 |
|------|------|
| **损失函数** | 多种蒸馏损失函数支持 |
| **散度度量** | KL散度、JS散度等多种度量方式 |
| **三种训练模式** | On-Policy、Off-Policy、混合模式 |
| **采样加速** | 使用vLLM等引擎加速采样 |
| **On-Policy Distillation** | 实时在线蒸馏 |
| **OPSD** | On-Policy Self-Distillation 自蒸馏 |

---

## 7. RLHF 人类对齐

### 7.1 算法对比

| 算法 | 数据格式 | 关键超参 | 特点 |
|------|---------|---------|------|
| **GRPO** | system+query | - | 无需 Critic，组相对优化 |
| **DPO** | (x, y_w, y_l) | beta=0.1, loss_type | 直接偏好优化，建议先 SFT |
| **RM** | (x, y_w, y_l) | center_rewards_coefficient | 奖励建模阶段 |
| **PPO** | system+query | kl_coef=0.05, cliprange=0.2 | 四模型协同训练 |
| **KTO** | (x, y, label) | beta=0.1, desirable_weight | 仅需好坏标签 |
| **CPO** | (x, y_w, y_l) | beta=0.1, cpo_alpha=1.0 | 无参考模型偏好优化 |
| **ORPO** | (x, y_w, y_l) | lambda（通过 beta 传入） | Odds Ratio 优化 |
| **SimPO** | (x, y_w, y_l) | beta=2.0, simpo_gamma=1.0 | 简单偏好优化 |

### 7.2 DPO 训练注意事项

- 建议先用偏好数据集中用户偏好答案进行 SFT，再 DPO
- 可通过 `rpo_alpha` 混合 SFT loss 提升稳定性
- 支持多 loss 混合（如 MPO 训练）通过 `loss_weights` 设置权重
- 支持 LD-DPO（`ld_alpha`）抑制长度偏好

### 7.3 PPO 四模型架构

```
┌─────────────┐    ┌─────────────┐
│   model      │    │  ref_model  │
│ (训练模型)   │◄──►│ (参考模型)   │
└──────┬──────┘    └─────────────┘
       │
┌──────┴──────┐    ┌─────────────┐
│ value_model  │    │ reward_model│
│ (价值模型)   │◄──►│ (奖励模型)   │
└─────────────┘    └─────────────┘
```

---

## 8. 推理与部署

### 8.1 推理引擎能力矩阵

| 推理引擎 | OpenAI API | 多模态 | 量化模型 | 多LoRA | QLoRA | Batch推理 | 并行技术 |
|---------|-----------|--------|---------|--------|-------|----------|---------|
| **Transformers** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | DDP/device_map |
| **vLLM** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | TP/PP/DP |
| **SGLang** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | TP/PP/DP/EP |
| **LMDeploy** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | TP/DP |

### 8.2 CLI 推理

```bash
# 全参数模型推理
CUDA_VISIBLE_DEVICES=0 swift infer \
    --model Qwen/Qwen2.5-7B-Instruct \
    --stream true \
    --infer_backend transformers \
    --max_new_tokens 2048

# LoRA模型推理
CUDA_VISIBLE_DEVICES=0 swift infer \
    --model Qwen/Qwen2.5-7B-Instruct \
    --adapters swift/test_lora \
    --stream true \
    --infer_backend transformers \
    --temperature 0

# 多模态推理
CUDA_VISIBLE_DEVICES=0 \
MAX_PIXELS=1003520 VIDEO_MAX_PIXELS=50176 FPS_MAX_FRAMES=12 \
swift infer \
    --model Qwen/Qwen2.5-VL-3B-Instruct \
    --stream true \
    --infer_backend transformers
```

**推理指令**：
- `multi-line`: 多行模式，`#`结束输入
- `single-line`: 单行模式，换行结束
- `reset-system`: 重置system并清空历史
- `clear`: 清除历史
- `quit`/`exit`: 退出

### 8.3 部署（OpenAI兼容API）

**服务端**：
```bash
CUDA_VISIBLE_DEVICES=0 swift deploy \
    --model Qwen/Qwen2.5-7B-Instruct \
    --infer_backend vllm \
    --max_new_tokens 2048 \
    --served_model_name Qwen2.5-7B-Instruct
```

**多LoRA部署**（vLLM加速）：
```bash
CUDA_VISIBLE_DEVICES=0 swift deploy \
    --adapters lora1=swift/test_lora lora2=swift/test_lora2 \
    --infer_backend vllm \
    --temperature 0
```

**客户端调用**：
```python
from openai import OpenAI

client = OpenAI(
    api_key='EMPTY',
    base_url='http://127.0.0.1:8000/v1',
)

# 查看可用模型
models = [model.id for model in client.models.list().data]
# ['Qwen2.5-7B-Instruct', 'lora1', 'lora2']

# 调用
resp = client.chat.completions.create(
    model='lora1',
    messages=[{'role': 'user', 'content': 'who are you?'}],
    max_tokens=512, temperature=0
)
```

### 8.4 Python 推理引擎

```python
from swift.infer_engine import TransformersEngine, RequestConfig, InferRequest

engine = TransformersEngine('Qwen/Qwen2.5-0.5B-Instruct', max_batch_size=2)
request_config = RequestConfig(max_tokens=512, temperature=0)

infer_requests = [
    InferRequest(messages=[{'role': 'user', 'content': 'who are you?'}]),
    InferRequest(messages=[{'role': 'user', 'content': '浙江的省会在哪？'}]),
]
resp_list = engine.infer(infer_requests, request_config)
```

支持的引擎：`TransformersEngine`、`VllmEngine`、`SglangEngine`、`LmdeployEngine`

---

## 9. 采样（Sample / Test-Time Compute）

采样是 ms-swift 的重要能力，实现 test-time compute 和强化微调（RFT）的基础。

### 9.1 基本采样

```bash
swift sample \
    --model LLM-Research/Meta-Llama-3.1-8B-Instruct \
    --sampler_engine transformers \
    --num_return_sequences 5 \
    --dataset AI-ModelScope/alpaca-gpt4-data-zh#5
```

### 9.2 PRM/ORM 过滤

```bash
# 使用过程奖励模型和结果奖励模型过滤
swift sample \
    --model LLM-Research/Meta-Llama-3.1-8B-Instruct \
    --sampler_engine lmdeploy \
    --num_return_sequences 5 \
    --n_best_to_keep 2 \
    --dataset tastelikefeet/competition_math#5 \
    --prm_model AI-ModelScope/GRM-llama3.2-3B-rewardmodel-ft \
    --orm_model math
```

### 9.3 大模型蒸馏采样

```bash
OPENAI_API_KEY="your_api_key" \
swift sample \
    --sampler_type distill \
    --sampler_engine client \
    --model deepseek-r1 \
    --stream true \
    --dataset tastelikefeet/competition_math#5 \
    --num_return_sequences 1 \
    --temperature 0.6 \
    --top_p 0.95 \
    --engine_kwargs '{"base_url":"https://dashscope.aliyuncs.com/compatible-mode/v1"}'
```

### 9.4 显存控制（两段采样）

1. **第一阶段**：仅采样（指定 `--model` + `--sampler_engine`）
2. **第二阶段**：仅 RM 过滤（`--sampler_engine no` + `--orm_model` + `--cache_files`）

---

## 10. 评测

### 10.1 评测后端

| 后端 | 主要方向 | 结果可视化 |
|------|---------|----------|
| **Native**（默认） | 纯文本 | ✅ |
| **OpenCompass** | 纯文本 | ❌ |
| **VLMEvalKit** | 多模态 | ❌ |

### 10.2 Native 支持的评测集

`arc`, `bbh`, `ceval`, `cmmlu`, `competition_math`, `general_qa`, `gpqa`, `gsm8k`, `hellaswag`, `humaneval`, `ifeval`, `iquiz`, `mmlu`, `mmlu_pro`, `race`, `trivia_qa`, `truthful_qa`

### 10.3 评测示例

```bash
CUDA_VISIBLE_DEVICES=0 \
swift eval \
    --model Qwen/Qwen2.5-0.5B-Instruct \
    --eval_backend Native \
    --infer_backend transformers \
    --eval_limit 10 \
    --eval_dataset gsm8k
```

### 10.4 训练中评测

```bash
CUDA_VISIBLE_DEVICES=0 \
swift sft \
    --model Qwen/Qwen2.5-0.5B-Instruct \
    --tuner_type lora \
    --eval_strategy steps \
    --eval_steps 5 \
    --eval_use_evalscope \
    --eval_dataset gsm8k \
    --eval_limit 10
```

### 10.5 自定义评测集

**选择题（MCQ）**：CSV格式，评测指标为accuracy
```
id,question,A,B,C,D,answer
1,问题内容,选项A,选项B,选项C,选项D,C
```

**问答题（QA）**：JSONL格式，评测指标为ROUGE和BLEU
```json
{"query": "中国的首都是哪里？", "response": "中国的首都是北京"}
```

---

## 11. 导出与量化

### 11.1 量化技术对比

| 量化技术 | 多模态 | 推理加速 | 继续训练 | 校准数据集 |
|---------|--------|---------|---------|-----------|
| FP8 | ✅ | ✅ | ✅ | 不需要 |
| GPTQ | ✅ | ✅ | ✅ | 需要 |
| AWQ | ✅ | ✅ | ✅ | 需要 |
| BNB | ❌ | ✅ | ✅ | 不需要 |

### 11.2 量化导出

```bash
# AWQ量化
pip install autoawq -U
swift export --model <model_id> --quant_method awq --bits 4

# GPTQ量化
pip install auto_gptq optimum -U
swift export --model <model_id> --quant_method gptq --bits 4

# BNB量化
pip install bitsandbytes -U
swift export --model <model_id> --quant_method bnb --bits 4
```

### 11.3 Merge LoRA

```bash
swift export --adapters <checkpoint_dir> --merge_lora true
```

---

## 12. Agent 训练支持

### 12.1 核心能力

| 特性 | 说明 |
|------|------|
| **Agent Template** | 一套数据集用于不同模型训练 |
| **Tools格式** | 标准化工具定义格式 |
| **loss_scale** | 精细控制不同部分的loss权重 |
| **训练/推理/部署** | 全流程Agent支持 |

### 12.2 Agent 数据集格式

Agent训练使用标准的 messages 格式，包含 tool_calls 和 tool responses：

```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant with tool access."},
    {"role": "user", "content": "What is the weather today?"},
    {"role": "assistant", "content": null, "tool_calls": [...]},
    {"role": "tool", "content": "Sunny, 25°C"},
    {"role": "assistant", "content": "The weather is sunny, 25°C."}
  ]
}
```

### 12.3 Agent Template 架构

Agent Template 允许用户使用一套数据训练不同模型：
- Template负责将工具调用格式适配到不同模型的特殊token
- 支持 function calling、ReAct 等多种Agent模式
- loss_scale 可控制 system/user/assistant/tool 各部分的loss权重

---

## 13. 强化微调（RFT）

### 13.1 概念

强化微调结合采样和训练，通过 RM 筛选高质量样本进行迭代训练。

### 13.2 适用场景

- 数学推理能力提升
- 代码生成能力提升
- 需要 test-time compute 的场景

### 13.3 实现流程

```
原始数据 → 采样（sample） → RM过滤 → 训练（sft/rlhf） → 新模型 → 再采样 → ...
```

---

## 14. Megatron-SWIFT

### 14.1 概述

Megatron-SWIFT 引入 NVIDIA Megatron 的并行技术加速大模型训练。

**并行策略**：数据并行（DP）、张量并行（TP）、流水线并行（PP）、序列并行（SP）、上下文并行（CP）、专家并行（EP/ETP）、虚拟流水线并行（VPP）

### 14.2 训练能力矩阵

| 方法 | 全参数 | LoRA | MoE | 多模态 | FP8 |
|------|--------|------|-----|--------|-----|
| 预训练 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 指令微调 | ✅ | ✅ | ✅ | ✅ | ✅ |
| GRPO | ✅ | ✅ | ✅ | ✅ | ✅ |
| GKD | ✅ | ✅ | ✅ | ✅ | ✅ |
| DPO/KTO/RM | ✅ | ✅ | ✅ | ✅ | ✅ |
| Embedding/Reranker | ✅ | ✅ | ✅ | ✅ | ✅ |

### 14.3 环境准备

```bash
# Transformer Engine
pip install --no-build-isolation transformer-engine[pytorch] --no-cache-dir

# Apex
git clone https://github.com/NVIDIA/apex && cd apex
pip install -v --disable-pip-version-check --no-cache-dir --no-build-isolation \
    --config-settings "--build-option=--cpp_ext" \
    --config-settings "--build-option=--cuda_ext" ./

# Mcore-Bridge（推荐方式）
pip install mcore-bridge -U

# Flash Attention
MAX_JOBS=8 pip install "flash-attn==2.8.3" --no-build-isolation
```

### 14.4 Mcore-Bridge 方式（推荐）

免去繁琐的权重转换，直接使用HF模型：

```bash
PYTORCH_CUDA_ALLOC_CONF='expandable_segments:True' \
NPROC_PER_NODE=2 \
CUDA_VISIBLE_DEVICES=0,1 \
megatron sft \
    --model Qwen/Qwen2.5-7B-Instruct \
    --tensor_model_parallel_size 2 \
    --sequence_parallel true \
    --micro_batch_size 16 \
    --global_batch_size 16 \
    --recompute_granularity full \
    --recompute_method uniform \
    --recompute_num_layers 1 \
    --finetune true \
    --cross_entropy_loss_fusion true \
    --lr 1e-5 \
    --num_train_epochs 1 \
    --output_dir megatron_output \
    --max_length 2048
```

### 14.5 传统方式（权重转换）

```bash
# HF → Megatron
CUDA_VISIBLE_DEVICES=0 \
swift export --model Qwen/Qwen2.5-7B-Instruct --to_mcore true \
    --torch_dtype bfloat16 --output_dir Qwen2.5-7B-Instruct-mcore

# 训练（使用 megatron sft）
# ...

# Megatron → HF
CUDA_VISIBLE_DEVICES=0 \
swift export --mcore_model megatron_output/... --to_hf true \
    --torch_dtype bfloat16 --output_dir ...-hf
```

### 14.6 Benchmark

**Dense模型** Qwen2.5-14B（单机8卡A800，全参数8K）：

| Megatron-LM | DeepSpeed-ZeRO2 | DeepSpeed-ZeRO3 |
|------------|-----------------|-----------------|
| 9.04s/it | 10.32s/it | 10.56s/it |
| 8×64GB | 8×80GB | 8×58GB |

**MoE模型** Qwen3-30B-A3B（双机16卡A800）：

| Megatron-LM | DeepSpeed-ZeRO3 |
|------------|-----------------|
| 9.6s/it | 91.2s/it |
| 16×60GiB | 16×80GiB |

### 14.7 训练技巧

- **增加吞吐量**：使用packing（不开流式）、增加DP、减少重计算、增加计算通信overlap
- **并行技术选择**：DP最快但显存多；TP/EP尽量不跨节点（NVLink域内）；跨节点用PP/DP
- **MoE并行折叠**：Attention用tp-cp-dp-pp组，MoE用etp-ep-dp-pp组
- **日志**：只在last rank打印（PP中只有last pp_rank有完整信息）

---

## 15. 自定义与扩展

### 15.1 架构模块

| 模块 | 说明 |
|------|------|
| **Agent Template** | Agent 训练模板适配 |
| **Callbacks** | 训练回调钩子 |
| **Loss** | 自定义损失函数 |
| **Loss Scale** | 精细控制各部分 loss 权重 |
| **Metrics** | 自定义评测指标 |
| **Optimizers** | 自定义优化器 |
| **Tuner Plugin** | 自定义微调插件 |
| **ORM/PRM** | 自定义结果/过程奖励模型 |

### 15.2 自定义数据集格式

**SFT 标准格式**（JSONL）：
```json
{"messages": [
  {"role": "system", "content": "You are a helpful assistant."},
  {"role": "user", "content": "你好"},
  {"role": "assistant", "content": "你好！有什么可以帮助你的吗？"}
]}
```

**预训练格式**：
```json
{"text": "这是一段预训练文本..."}
```

**RLHF 格式**：
- DPO 类：`(x, y_w, y_l)` - 输入、偏好回答、拒绝回答
- KTO：`(x, y, label)` - 输入、回答、好坏标签
- GRPO/PPO：仅需 `(system, query)` 输入

**dataset_info.json 注册**：
```json
{
  "my_dataset": {
    "dataset_path": "/path/to/dataset",
    "dataset_format": "messages",
    "columns": {"messages": "conversations"}
  }
}
```

### 15.3 自定义模型注册

```python
from swift import ModelMeta, register_model

register_model(ModelMeta(
    model_type='my-custom-model',
    model_id_or_path='/path/to/model',
    template_type='my-template',
    # ...
))
```

---

## 16. 最佳实践

### 16.1 Qwen3 最佳实践

| 阶段 | 推荐配置 |
|------|---------|
| 推理 | vLLM/SGlang加速 |
| SFT | LoRA rank=8, alpha=32 |
| RL | GRPO with math/code reward |
| Megatron | TP=2 for 7B+ models |

### 16.2 DeepSeek-V4 训练

- 精度对齐验证
- LoRA训练支持
- 大规模MoE模型训练优化

### 16.3 Embedding 训练

- 自定义loss函数
- 专用数据集格式
- 支持全参数和LoRA训练

### 16.4 Reranker 训练

- 多种损失函数类型
- 专用数据集格式
- 高级功能支持

### 16.5 硬件适配

| 硬件 | 支持状态 |
|------|---------|
| **NPU（Ascend）** | 完整训练/推理/评测/部署支持 |
| **Metax GPU** | 基础训练推理支持 |
| **AMD GPU** | ROCm 环境支持 |

### 16.6 NPU 使用

```bash
# 只需将 CUDA_VISIBLE_DEVICES 替换为 ASCEND_RT_VISIBLE_DEVICES
ASCEND_RT_VISIBLE_DEVICES=0 \
swift sft --model <model_id> --dataset <dataset> ...
```

---

## 17. 命令行速查

> 完整参数手册请参见 [**ms-swift 命令行参数完全参考手册**](./ms_swift_Command_Line_Parameters.md)（涵盖 200+ 参数的详细默认值、说明、继承关系图）

| 命令 | 用途 |
|------|------|
| `swift sft` | 指令监督微调 |
| `swift pt` | 预训练 |
| `swift rlhf` | 人类对齐（DPO/KTO/PPO 等） |
| `swift grpo` | GRPO 强化学习 |
| `swift gkd` | 知识蒸馏 |
| `swift sample` | 采样/蒸馏 |
| `swift infer` | 推理 |
| `swift deploy` | 部署（OpenAI API） |
| `swift app` | Web-UI 界面推理 |
| `swift eval` | 模型评测 |
| `swift export` | 导出/量化/Merge/Push |
| `megatron sft` | Megatron 微调 |
| `megatron pt` | Megatron 预训练 |
| `megatron rlhf` | Megatron RLHF |

---

## 18. 与同类框架对比

| 特性 | ms-swift | Axolotl | Unsloth | LLaMA-Factory |
|------|---------|---------|---------|---------------|
| **多模态** | ✅（400+模型） | 有限 | 有限 | ✅ |
| **Megatron并行** | ✅ | ❌ | ❌ | ❌ |
| **GRPO族算法** | ✅（10+算法） | 有限 | ❌ | ✅ |
| **推理加速** | vLLM/SGLang/LMDeploy | vLLM | 自有加速 | vLLM |
| **评测** | ✅（EvalScope） | ❌ | ❌ | ✅ |
| **量化导出** | AWQ/GPTQ/FP8/BNB | 有限 | 有限 | AWQ/GPTQ |
| **Agent训练** | ✅ | ❌ | ❌ | ✅ |
| **采样/RFT** | ✅ | ❌ | ❌ | ❌ |
| **ModelScope生态** | ✅（Day0支持） | ❌ | ❌ | ✅ |

---

## 19. 资源链接

- **GitHub**: https://github.com/modelscope/ms-swift
- **官方文档**: https://swift.readthedocs.io/zh-cn/latest/
- **ModelScope**: https://modelscope.cn
- **示例脚本**: https://github.com/modelscope/ms-swift/tree/main/examples
- **支持模型列表**: https://swift.readthedocs.io/zh-cn/latest/Instruction/Supported-models-and-datasets.html
- **EvalScope 评测框架**: https://github.com/modelscope/eval-scope
- **Mcore-Bridge**: https://github.com/modelscope/mcore-bridge

---

## 相关文档

- [[Fine_tuning_Strategies]] - 微调策略全景
- [[Distributed_Training_2026]] - 分布式训练技术
- [[Training_Optimization_2026]] - 训练优化技术
- [[Deployment_Inference_2026]] - 部署推理
- [[vLLM_Deep_Dive]] - vLLM推理引擎
- [[SGLang_Deep_Dive]] - SGLang推理引擎
- [[Fine_tuning_Techniques/Axolotl_Deep_Dive]] - Axolotl框架
- [[Fine_tuning_Techniques/Unsloth_Deep_Dive]] - Unsloth框架
- [[07_Model_Training/ms_swift_Command_Line_Parameters|ms-swift 命令行参数完全参考手册]]
