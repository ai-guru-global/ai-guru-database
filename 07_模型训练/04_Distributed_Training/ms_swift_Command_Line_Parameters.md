---
title: "ms-swift 命令行参数完全参考手册"
summary: "ms-swift v4.x 全量命令行参数速查：基本参数、模型/数据/模板/生成/量化参数、Seq2SeqTrainer参数、Tuner参数（LoRA/全参/GaLore/LISA等）、vLLM/SGLang/LMDeploy参数、训练/RLHF/推理/部署/评测/导出/采样参数、GRPO参数、特定模型参数、环境变量。"
category: 07-model-training
tags:
  - ms-swift
  - 命令行参数
  - LoRA
  - GRPO
  - vLLM
  - SGLang
  - DeepSpeed
  - 训练配置
created: 2026-06-03
updated: 2026-06-03
tier: supporting
aliases:
  - "Ms Swift Command Line Parameters"
  - "ms swift Command Line Parameters"
  - ms_swift_Command_Line_Parameters
sources: []

name_zh: "ms-swift 命令行参数完全参考手册"
---
# ms-swift 命令行参数完全参考手册

> 中文简称：ms-swift 命令行参数完全参考手册

> 本文档基于 ms-swift v4.x 官方文档，涵盖所有命令行参数。带🔥的为重要参数。
> 
> 参数体系：基本参数 + 原子参数 → 集成参数（最终使用）。特定模型参数通过 `--model_kwargs` 或环境变量设置。
>
> - List 参数用空格分隔：`--dataset <path1> <path2>`
> - Dict 参数用 JSON：`--model_kwargs '{"fps_max_frames": 12}'`
> - 支持 yaml/json 启动：`swift sft config.yaml`

---

## 1. 基本参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`tuner_backend` | `'peft'` | 可选 `'peft'`、`'unsloth'` |
| 🔥`tuner_type` | `'lora'` | 可选 `'lora'`/`'full'`/`'lora_llm'`/`'longlora'`/`'adalora'`/`'llamapro'`/`'adapter'`/`'vera'`/`'boft'`/`'fourierft'`/`'reft'`/`'bone'`。Megatron默认`'full'` |
| 🔥`adapters` | `[]` | adapter的id/path列表。用于推理/部署，偶尔用于断点续训（只读adapter权重，不加载优化器） |
| 🔥`external_plugins` | `[]` | 外部plugin.py文件列表，会被额外import |
| `seed` | 42 | 全局随机种子（与`data_seed`独立） |
| `model_kwargs` | None | 特定模型额外参数，如`'{"fps_max_frames": 12}'`，也可用环境变量 |
| `load_args` | 推理True/训练False | 是否读取`args.json` |
| `load_data_args` | False | 是否读取数据参数（推理时验证集推理用） |
| `use_hf` | False | False用ModelScope，True用HuggingFace |
| `hub_token` | None | ModelScope/HuggingFace hub token |
| `ddp_backend` | None(auto) | 可选"nccl"/"gloo"/"mpi"/"ccl"/"hccl"/"cncl"/"mccl" |

### 1.1 模型参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`model` | None | 模型id或本地路径 |
| 🔥`model_type` | None(auto) | 模型类型（相同架构+加载+template为一个type），根据后缀和config自动选择 |
| `model_revision` | None | 模型版本 |
| `task_type` | `'causal_lm'` | 可选`'causal_lm'`/`'seq_cls'`/`'embedding'`/`'reranker'`/`'generative_reranker'` |
| 🔥`torch_dtype` | None(from config) | 支持`float16`/`bfloat16`/`float32` |
| `attn_impl` | None(from config) | 可选`'sdpa'`/`'eager'`/`'flash_attn'`/`'flash_attention_2'`/`'flash_attention_3'`/`'flash_attention_4'` |
| 🔥`experts_impl` | None | 可选`'grouped_mm'`/`'batched_mm'`/`'eager'`，需transformers>=5.0 |
| `new_special_tokens` | `[]` | 新增特殊tokens，支持.txt文件路径 |
| `num_labels` | None | seq_cls任务的标签数量 |
| `problem_type` | None | 可选`'regression'`/`'single_label_classification'`/`'multi_label_classification'` |
| `rope_scaling` | None | rope类型，如`linear`/`dynamic`/`yarn`，结合`max_model_len`使用 |
| `max_model_len` | None | 用于计算rope的factor倍数，覆盖config中的max_position_embeddings |
| `device_map` | None(auto) | 如`'auto'`/`'cpu'`/json字符串/文件路径 |
| `local_repo_path` | None | 依赖github repo的模型的本地repo路径 |
| `init_strategy` | None | 加载时初始化未初始化参数：`'zero'`/`'uniform'`/`'normal'`/`'xavier_uniform'`等 |

### 1.2 数据参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`dataset` | `[]` | 数据集id/路径列表。格式：`'数据集id:子数据集#采样数'`。支持jsonl/csv/json/文件夹 |
| 🔥`val_dataset` | `[]` | 验证集id/路径列表 |
| 🔥`cached_dataset` | `[]` | 缓存数据集路径（避免tokenize占GPU时间） |
| 🔥`split_dataset_ratio` | 0. | 从训练集拆分验证集的比例 |
| `data_seed` | 42 | 数据集随机种子 |
| 🔥`dataset_num_proc` | 1 | 数据预处理进程数（纯文本建议开大） |
| 🔥`load_from_cache_file` | False | 是否从缓存加载（建议运行时True，debug时False） |
| `dataset_shuffle` | True | 数据集是否随机 |
| `streaming` | False | 流式读取（需设`max_steps`） |
| `interleave_prob` | None | 多数据集交错概率（用于流式） |
| `columns` | None | 列映射，如`'{"text1": "query"}'` |
| `strict` | False | True则有问题直接报错 |
| 🔥`remove_unused_columns` | True | 是否删除不使用的列（GRPO默认False） |
| 🔥`model_name` | None | 自我认知任务：模型名称（中英文，空格分隔） |
| 🔥`model_author` | None | 自我认知任务：作者名称 |
| `custom_dataset_info` | `[]` | 自定义数据集注册json文件路径 |

### 1.3 模板参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`template` | None(auto) | 对话模板类型 |
| 🔥`system` | None | 自定义system（字符串或txt文件路径）。优先级：数据集 > `--system` > 注册默认 |
| 🔥`max_length` | None(max_model_len) | 单样本最大tokens长度。PPO/GRPO/GKD/推理中代表max_prompt_length |
| `truncation_strategy` | `'delete'` | 超长处理：`'delete'`/`'left'`/`'right'`/`'split'`（split仅预训练） |
| 🔥`max_pixels` | None | 多模态输入图片最大像素(H*W) |
| 🔥`agent_template` | None(auto) | Agent模板：`"react_en"`/`"hermes"`/`"glm4"`/`"qwen_en"`等 |
| `norm_bbox` | None(auto) | bbox缩放：`'norm1000'`/`'none'` |
| `use_chat_template` | True | chat/generation模板（`swift pt`默认False） |
| `padding_side` | `'right'` | batch_size>=2时的padding方向（推理时只左padding） |
| 🔥`padding_free` | False | 展平batch避免padding（需flash_attn+transformers>=4.44） |
| 🔥`loss_scale` | `'default'` | loss权重：`'default'`(SFT)/`'last_round'`(RLHF)/`'all'`(PT)/`'ignore_empty_think'`/`'react'`/`'hermes'`等。支持混合如`'default+ignore_empty_think'` |
| `sequence_parallel_size` | 1 | 序列并行大小（支持CPT/SFT/DPO/GRPO） |
| `template_backend` | `'swift'` | 可选`'swift'`/`'jinja'`（jinja只支持推理） |
| `enable_thinking` | None(auto) | 推理时是否开启thinking模式 |
| `preserve_thinking` | None(auto) | 是否保留历史思考内容 |

### 1.4 生成参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`max_new_tokens` | None(无限制) | 推理最大生成tokens数 |
| `temperature` | None(from config) | 温度。设0取消随机性 |
| `top_k` | None(from config) | top-k采样 |
| `top_p` | None(from config) | top-p采样 |
| `repetition_penalty` | None(from config) | 重复惩罚（1.0=不惩罚） |
| 🔥`stream` | None | 流式输出（交互式True，批量False） |
| `stop_words` | `[]` | 额外停止词 |
| `logprobs` | False | 是否输出logprobs |
| `structured_outputs_regex` | None | 结构化输出正则（仅vllm） |

### 1.5 量化参数（加载时量化）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`quant_method` | None | 加载量化方法：`'bnb'`/`'hqq'`/`'eetq'`/`'quanto'`/`'fp8'` |
| 🔥`quant_bits` | None | 量化bits数 |
| `bnb_4bit_compute_dtype` | None(=torch_dtype) | BNB计算类型 |
| `bnb_4bit_quant_type` | `'nf4'` | BNB量化类型：`'fp4'`/`'nf4'` |
| `bnb_4bit_use_double_quant` | True | 是否双重量化 |

---

## 2. Seq2SeqTrainer 参数（继承自 HF transformers）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`output_dir` | `'output/<model_name>'` | 输出目录 |
| 🔥`gradient_checkpointing` | True | 降低显存但降低速度 |
| 🔥`vit_gradient_checkpointing` | None(auto) | 多模态 Vit 部分 gradient_checkpointing |
| 🔥`deepspeed` | None | 可设`'zero0'`~`'zero3'`/`'zero2_offload'`/`'zero3_offload'`或自定义配置路径 |
| 🔥`fsdp` | None | FSDP2 配置，可设`'fsdp2'`或自定义路径 |
| 🔥`per_device_train_batch_size` | 1 | 训练 batch size |
| 🔥`per_device_eval_batch_size` | 1 | 评估 batch size |
| 🔥`gradient_accumulation_steps` | None(auto>=16) | 梯度累加（GRPO 默认 1） |
| 🔥`learning_rate` | 全参 1e-5/LoRA1e-4 | 学习率 |
| 🔥`vit_lr` | None(=lr) | 多模态 ViT 学习率 |
| 🔥`aligner_lr` | None(=lr) | 多模态 Aligner 学习率 |
| `lr_scheduler_type` | `'cosine'` | 可选`'linear'`/`'constant'`/`'cosine_with_min_lr'` |
| 🔥`report_to` | `'tensorboard'` | 可指定`'wandb'`/`'swanlab'`/`'all'` |
| `logging_steps` | 5 | 日志打印间隔 |
| 🔥`num_train_epochs` | 3 | 训练 epoch 数 |
| 🔥`save_strategy` | `'steps'` | 可选`'no'`/`'steps'`/`'epoch'` |
| 🔥`save_steps` | 500 | 保存间隔 |
| 🔥`save_total_limit` | None(全保存) | 最多保存 checkpoint 数（设 2 则保存 best+last） |
| 🔥`eval_strategy` | None(跟随 save) | 评估策略 |
| 🔥`eval_steps` | None(跟随 save) | 评估间隔 |
| 🔥`warmup_ratio` | 0. | 预热比例 |
| 🔥`resume_from_checkpoint` | None | 断点续训 checkpoint 路径 |
| `resume_only_model` | False | 仅恢复模型权重（忽略优化器/种子） |
| 🔥`dataloader_num_workers` | None(win:0/其他:1) | 数据加载进程数 |
| `max_grad_norm` | 1. | 梯度裁剪 |
| 🔥`neftune_noise_alpha` | 0 | NEFTune 噪声（建议 5/10/15） |
| 🔥`use_liger_kernel` | False | Liger 内核加速+省显存 |
| `weight_decay` | 0.1 | 权重衰减 |
| `adam_beta1` | 0.9 | Adam 一阶矩衰减率 |
| `adam_beta2` | 0.95 | Adam 二阶矩衰减率 |
| `router_aux_loss_coef` | 0. | MoE aux_loss 权重 |
| `max_epochs` | None | 训练到 max_epochs 强制退出（流式时有用） |

---

## 3. Tuner 参数

### 3.1 多模态控制

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`freeze_llm` | False | 冻结LLM（全参）/取消LLM的LoRA |
| 🔥`freeze_vit` | True | 冻结ViT（含audio_tower）/取消ViT的LoRA |
| 🔥`freeze_aligner` | True | 冻结Aligner/取消Aligner的LoRA |
| 🔥`target_modules` | `['all-linear']` | LoRA模块。LLM自动找除lm_head外linear；多模态只在LLM上 |
| 🔥`target_regex` | None | 正则指定LoRA模块（优先于target_modules） |
| `modules_to_save` | `[]` | 额外参与训练存储的原模型模块 |

### 3.2 LoRA 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`lora_rank` | 8 | LoRA rank |
| 🔥`lora_alpha` | 32 | LoRA alpha |
| `lora_dropout` | 0.05 | LoRA dropout |
| `lora_bias` | `'none'` | 可选`'none'`/`'all'` |
| 🔥`use_dora` | False | 是否使用DoRA |
| `use_rslora` | False | 是否使用RS-LoRA |
| 🔥`lorap_lr_ratio` | None | LoRA+参数（建议10~16） |
| `init_weights` | `'true'` | 初始化方式：`'true'`/`'false'`/`'gaussian'`/`'pissa'`/`'olora'`/`'loftq'`/`'lora-ga'` |

**LoRA-GA**：`lora_ga_batch_size`(2), `lora_ga_iters`(2), `lora_ga_max_length`(1024), `lora_ga_direction`('ArB2r'), `lora_ga_scale`('stable'), `lora_ga_stable_gamma`(16)

### 3.3 全参数训练

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `freeze_parameters` | `[]` | 冻结参数前缀 |
| `freeze_parameters_ratio` | 0 | 从下往上冻结比例 |
| `trainable_parameters` | `[]` | 额外可训练参数前缀（优先级高于freeze） |

### 3.4 其他 Tuner

| Tuner | 关键参数 |
|-------|---------|
| **GaLore** | `use_galore`(False), `galore_rank`(128), `galore_scale`(1.0), `galore_quantization`(False, Q-GaLore) |
| **LISA** | `lisa_activated_layers`(0=不用，建议2或8), `lisa_step_interval`(20)。仅支持全参 |
| **Unsloth** | 无新增参数，设`--tuner_backend unsloth`即可 |
| **LLaMAPro** | `llamapro_num_new_blocks`(4), `llamapro_num_groups`(None) |
| **AdaLoRA** | `adalora_target_r`(8), `adalora_init_r`(12) |
| **ReFT** | `reft_layers`(None=所有层), `reft_rank`(4), `reft_intervention_type`('LoreftIntervention') |
| **BOFT** | `boft_block_size`(4), `boft_dropout`(0.0) |
| **Vera** | `vera_rank`(256), `vera_dropout`(0.0) |
| **FourierFt** | `fourier_n_frequency`(2000), `fourier_scaling`(300.0) |

---

## 4. 推理引擎参数

### 4.1 vLLM 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`vllm_gpu_memory_utilization` | 0.9 | GPU 内存比例 |
| 🔥`vllm_tensor_parallel_size` | 1 | TP 并行数 |
| `vllm_pipeline_parallel_size` | 1 | PP 并行数 |
| `vllm_data_parallel_size` | 1 | DP 并行数（deploy/rollout 中生效） |
| `vllm_enable_expert_parallel` | False | 专家并行 |
| `vllm_max_num_seqs` | 256 | 单次迭代最大序列数 |
| 🔥`vllm_max_model_len` | None(from config) | 模型最大长度 |
| `vllm_enforce_eager` | False | True 省显存但影响效率 |
| 🔥`vllm_limit_mm_per_prompt` | None | 多图限制，如`'{"image": 5, "video": 2}'` |
| 🔥`vllm_enable_prefix_caching` | None(跟随 vLLM) | 前缀缓存加速 |
| `vllm_speculative_config` | None | 推测解码配置(json) |
| `vllm_reasoning_parser` | None | 思考模型解析器（仅 deploy） |

### 4.2 SGLang 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`sglang_tp_size` | 1 | TP 数 |
| `sglang_pp_size` | 1 | PP 数 |
| `sglang_dp_size` | 1 | DP 数 |
| `sglang_ep_size` | 1 | EP 数 |
| `sglang_mem_fraction_static` | None | 静态分配 GPU 内存比例 |
| `sglang_context_length` | None(from config) | 最大上下文长度 |
| `sglang_speculative_algorithm` | None | 推测算法：None/EAGLE/EAGLE3/NEXTN/STANDALONE/NGRAM |
| `sglang_enable_dp_attention` | False | DP 注意力（DeepSeek-V2/3, Qwen2/3 MoE） |

### 4.3 LMDeploy 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`lmdeploy_tp` | 1 | tensor 并行度 |
| `lmdeploy_session_len` | None | 最大会话长度 |
| `lmdeploy_cache_max_entry_count` | 0.8 | KV 缓存 GPU 内存比例 |

---

## 5. 集成参数

### 5.1 训练参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `add_version` | True | output_dir增加版本号目录 |
| `check_model` | True | 检查本地模型文件（断网设False） |
| 🔥`create_checkpoint_symlink` | False | 创建best/last软链接 |
| 🔥`packing` | False | 样本打包（支持CPT/SFT/DPO/KTO/GKD，需flash_attn） |
| `packing_length` | None(=max_length) | packing长度 |
| `lazy_tokenize` | None(LLM:False/MLLM:True) | 延迟tokenize |
| `use_logits_to_keep` | None(auto) | 减少无效logits计算 |
| `acc_strategy` | `'token'` | acc策略：`'seq'`/`'token'` |
| `loss_type` | None | 自定义loss类型 |
| `eval_metric` | None | 自定义eval metric |
| `callbacks` | `[]` | 自定义callback（含`deepspeed_elastic`弹性训练） |
| `early_stop_interval` | None | 早停间隔 |
| `eval_use_evalscope` | False | 训练中评测开关 |

### 5.2 RLHF 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`rlhf_type` | `'dpo'` | 算法类型：`'dpo'`/`'orpo'`/`'simpo'`/`'kto'`/`'cpo'`/`'rm'`/`'ppo'`/`'grpo'`/`'gkd'` |
| `ref_model` | None(=model) | 参考模型（全参DPO/KTO/PPO/GRPO需要） |
| `ref_adapters` | `[]` | SFT的LoRA权重（DPO时`--adapters sft --ref_adapters sft`） |
| 🔥`beta` | None(算法各异) | KL正则系数。SimPO:2., GRPO:0.04, GKD:0.5, 其他:0.1 |
| `rpo_alpha` | None | SFT loss混合权重（`loss = dpo_loss + alpha * sft_loss`，论文推荐1.） |
| `max_completion_length` | 512 | GRPO/PPO/GKD最大生成长度 |
| `loss_scale` | `'last_round'` | RLHF默认覆盖 |
| `temperature` | 0.9 | PPO/GRPO/GKD使用 |

### 5.3 GRPO 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `beta` | 0.04 | KL正则系数（设0不加载ref model） |
| `num_generations` | 8 | 每个prompt采样数（G值） |
| `steps_per_generation` | =grad_accum_steps | 每轮生成的优化步数 |
| `reward_funcs` | `[]` | 奖励函数：`'accuracy'`/`'format'`/`'cosine'`/`'repetition'`/`'soft_overlong'` |
| `reward_weights` | None(均等) | 各奖励函数权重 |
| `loss_type` | `'grpo'` | 可选`'grpo'`/`'bnpo'`/`'dr_grpo'`/`'dapo'`/`'cispo'`/`'sapo'`/`'real'`/`'fipo'` |
| `use_vllm` | False | 是否用vLLM生成 |
| `vllm_mode` | - | `'server'`或`'colocate'` |
| `num_iterations` | 1 | 每条数据更新次数(μ) |
| `epsilon` | 0.2 | clip系数 |
| `epsilon_high` | None | 上界clip（与epsilon构成[eps, eps_high]） |
| `dynamic_sample` | False | 筛除组内奖励标准差为0的数据 |
| `overlong_filter` | False | 跳过超长截断样本 |
| `advantage_estimator` | `'grpo'` | 可选`'grpo'`/`'rloo'`/`'reinforce_plus_plus'` |
| `kl_in_reward` | auto | KL处理方式（grpo:false, rloo/r++:true） |
| `scale_rewards` | auto | 奖励缩放（grpo:group, rloo:none, r++:batch）。可选`'gdpo'`多奖励 |
| `sync_ref_model` | False | 定期同步ref_model |
| `importance_sampling_level` | `'token'` | 可选`'token'`/`'sequence'`（GSPO用sequence） |
| `multi_turn_scheduler` | None | 多轮GRPO（plugin名称） |
| `max_turns` | None | 多轮最大轮数 |
| `gym_env` | None | GYM环境名称 |
| `top_entropy_quantile` | 1.0 | 仅高熵token参与loss |
| `rollout_importance_sampling_mode` | None | 训推不一致校正 |

### 5.4 GKD 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `lmbda` | 0.5 | 学生数据比例 |
| `sft_alpha` | 0 | SFT loss权重 |
| `seq_kd` | False | 序列级知识蒸馏 |
| `gkd_logits_topk` | None | Top-K logits计算KL（降低显存） |
| `offload_teacher_model` | False | 卸载教师模型省显存 |
| `teacher_model` | None | GKD教师模型 |
| `teacher_model_server` | None | 教师模型服务地址 |

### 5.5 PPO 参数

`num_ppo_epochs`(4), `whiten_rewards`(False), `kl_coef`(0.05), `cliprange`(0.2), `vf_coef`(0.1), `cliprange_value`(0.2), `gamma`(1.0), `lam`(0.95), `num_mini_batches`(1), `local_rollout_forward_batch_size`(64), `num_sample_generations`(10)

### 5.6 推理参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`infer_backend` | `'transformers'` | 可选`'transformers'`/`'vllm'`/`'sglang'`/`'lmdeploy'` |
| 🔥`max_batch_size` | 1 | transformers批量推理（-1=无限制） |
| 🔥`result_path` | None | 推理结果存储路径(jsonl) |
| `metric` | None | 结果评估：`'acc'`/`'rouge'` |

### 5.7 部署参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `host` | `'0.0.0.0'` | 服务host |
| `port` | 8000 | 端口号 |
| `api_key` | None | 访问API key |
| 🔥`served_model_name` | model后缀 | 服务模型名称 |

### 5.8 评测参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`eval_backend` | `'Native'` | 可选`'Native'`/`'OpenCompass'`/`'VLMEvalKit'` |
| 🔥`eval_dataset` | - | 评测数据集（空格分隔多个） |
| `eval_limit` | None | 每评测集采样数 |
| `eval_url` | None | 评测url（如已部署的服务） |

### 5.9 导出参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 🔥`quant_method` | None | 量化导出：`'gptq'`/`'awq'`/`'bnb'`/`'fp8'` |
| `quant_n_samples` | 256 | GPTQ/AWQ校准集采样数 |
| `group_size` | 128 | 量化group大小 |
| 🔥`to_mcore` | False | HF→Megatron |
| `to_hf` | False | Megatron→HF |
| 🔥`push_to_hub` | False | 推送到hub |
| `to_ollama` | False | 生成Ollama Modelfile |
| `to_cached_dataset` | False | 数据集预tokenize导出 |

### 5.10 采样参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `prm_model` | None | 过程奖励模型（模型id或plugin key） |
| `orm_model` | None | 结果奖励模型（通常plugin中定义） |
| `sampler_type` | `'sample'` | 可选`'sample'`/`'distill'` |
| `sampler_engine` | `'transformers'` | 可选`'transformers'`/`'lmdeploy'`/`'vllm'`/`'client'`/`'no'` |
| `num_return_sequences` | 64 | 采样返回sequence数量 |
| `n_best_to_keep` | None | 保留最佳数量 |
| `prm_threshold` | 0 | PRM过滤阈值 |
| `easy_query_threshold` | None | 简单query过滤阈值 |
| `cache_files` | None | 两段采样避免OOM |

---

## 6. 特定模型参数

通过 `--model_kwargs` 或环境变量设置。

### 6.1 Qwen2-VL / Qwen2.5-VL 系列

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `MIN_PIXELS` | 4×28×28 | 图像最小分辨率 |
| 🔥`MAX_PIXELS` | 16384×28×28 | 图像最大分辨率 |
| `VIDEO_MIN_PIXELS` | 128×28×28 | 视频帧最小分辨率 |
| 🔥`VIDEO_MAX_PIXELS` | 768×28×28 | 视频帧最大分辨率 |
| 🔥`FPS_MAX_FRAMES` | 768 | 视频最大抽帧数 |
| `FPS` | 2.0 | 视频抽帧率 |
| 🔥`QWENVL_BBOX_FORMAT` | `'legacy'` | grounding 格式：`'legacy'`/`'new'` |

### 6.2 Qwen3-VL / Qwen3.5 系列

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `IMAGE_MAX_TOKEN_NUM` | 16384 | 单图最大图像 tokens（防 OOM） |
| `VIDEO_MAX_TOKEN_NUM` | 768 | 视频帧最大 tokens（防 OOM） |
| 🔥`FPS_MAX_FRAMES` | 768 | 视频最大抽帧数 |

### 6.3 Qwen2.5-Omni / Qwen3-Omni

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `USE_AUDIO_IN_VIDEO` | False | 是否使用 video 中的音频 |
| 🔥`ENABLE_AUDIO_OUTPUT` | None(from config) | Zero3 训练请设 False |

### 6.4 其他多模态模型

- **InternVL**: `MAX_NUM`(12), `INPUT_SIZE`(448), `VIDEO_MAX_NUM`(1), `VIDEO_SEGMENTS`(8)
- **MiniCPM-V**: `MAX_SLICE_NUMS`(9), `MAX_NUM_FRAMES`(64)
- **Ovis2.5**: `MIX_PIXELS`(448×448), `MAX_PIXELS`(1344×1792), `NUM_FRAMES`(8)

---

## 7. 重要环境变量

| 环境变量 | 说明 |
|---------|------|
| `CUDA_VISIBLE_DEVICES` | 指定GPU卡 |
| `ASCEND_RT_VISIBLE_DEVICES` | 指定NPU卡 |
| `MODELSCOPE_CACHE` | 缓存路径（多机训练必须共享） |
| `PYTORCH_CUDA_ALLOC_CONF` | 建议设`'expandable_segments:True'`减少碎片 |
| `NPROC_PER_NODE` | 单机进程数（自动用torchrun） |
| `NNODES` | 多机节点数 |
| `MASTER_PORT` | torchrun master端口（默认29500） |
| `MASTER_ADDR` | torchrun master地址 |
| `NODE_RANK` | 当前节点rank |
| `LOG_LEVEL` | 日志级别（默认'INFO'） |
| `VLLM_USE_V1` | vLLM V0/V1切换 |
| `SWIFT_DEBUG` | 设'1'打印input_ids和generate_ids |
| `USE_HF` | '0'=ModelScope, '1'=HuggingFace |

---

## 8. 参数继承关系图

```
基本参数
├── 模型参数 (model, torch_dtype, attn_impl, ...)
├── 数据参数 (dataset, val_dataset, streaming, ...)
├── 模板参数 (template, system, max_length, loss_scale, ...)
├── 生成参数 (max_new_tokens, temperature, stream, ...)
├── 量化参数 (quant_method, quant_bits, ...)
└── RAY参数

原子参数
├── Seq2SeqTrainer (output_dir, lr, deepspeed, epochs, ...)
└── Tuner (target_modules, lora_rank, freeze_vit, ...)

集成参数 = 基本参数 + 原子参数 + 额外参数
├── 训练参数 = 基本 + Trainer + Tuner + packing/callbacks/...
│   └── RLHF参数 = 训练 + rlhf_type/beta/ref_model/...
│       ├── GRPO参数 = RLHF + num_generations/reward_funcs/vllm_mode/...
│       ├── GKD参数 = RLHF + lmbda/seq_kd/teacher_model/...
│       └── PPO参数 = RLHF + kl_coef/cliprange/...
├── 推理参数 = 基本 + 合并 + vLLM/SGLang/LMDeploy + infer_backend/...
│   └── 部署参数 = 推理 + host/port/served_model_name/...
│       └── Rollout参数 = 部署 + multi_turn_scheduler/gym_env/...
│       └── App参数 = 部署 + Web-UI + base_url/...
├── 评测参数 = 部署 + eval_backend/eval_dataset/...
├── 导出参数 = 基本 + 合并 + quant_method/to_mcore/push_to_hub/...
└── 采样参数 = prm_model/orm_model/sampler_engine/...
```

---

## 9. YAML/JSON 配置支持

```yaml
# train.yaml
model: "Qwen/Qwen2.5-7B-Instruct"
dataset: "swift/self-cognition#500"
tuner_type: lora
learning_rate: 1e-4
num_train_epochs: 1
```

```bash
# 直接启动
swift sft train.yaml

# 混合使用（yaml为基础配置，命令行覆盖）
CUDA_VISIBLE_DEVICES=0 swift infer examples/yaml/deepspeed/infer.yaml \
    --adapters output/vx-xxx/checkpoint-xxx
```

环境变量也可在yaml中设置：
```yaml
ENV:
  MAX_PIXELS: '1003520'
  VIDEO_MAX_PIXELS: '50176'
```

---

## 相关文档

- [[07_模型训练/04_Distributed_Training/ms_swift_Deep_Dive|ms-swift 深度解析：魔搭大模型训练推理全链路框架]]
- [[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Strategies|微调策略完全指南]]
- [[07_模型训练/04_Distributed_Training/Distributed_Training_2026|分布式训练技术]]
- [[07_模型训练/03_Optimization/Training_Optimization_2026|训练优化技术]]
