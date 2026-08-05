# LLM 框架源码归档 (llm-frameworks)

> 本目录收录主流 LLM 框架的**发布版源码归档**（已剥离 `.git` 与二进制产物），供知识库中"源码级实现解析"章节引用对照。所有课题文件引用的 `文件路径 + 行号 + 类名` 均可在此目录直接验证。
>
> 归档日期：2026-07-25

## 归档清单

| 领域 | 目录 | 版本 | 获取方式 | 大小 |
|------|------|------|------|------|
| 分布式训练 | `Megatron-LM-core_v0.18.2/` | core_v0.18.2 | git tag 归档 | 57M |
| 分布式训练 | `DeepSpeed-v0.19.3/` | v0.19.3 | git tag 归档 | 249M |
| 分布式训练 | `ColossalAI-v0.5.1/` | v0.5.1 | git tag 归档 | 18M |
| 分布式训练 | `accelerate-v1.14.0/` | v1.14.0 | git tag 归档 | 4.7M |
| 分布式训练 | `NeMo-v2.7.3/` | v2.7.3 | git tag 归档 | 26M |
| 推理引擎 | `TensorRT-LLM-v1.3.0rc22/` | v1.3.0rc22 | git tag 归档 | 28M |
| 推理引擎 | `text-generation-inference-v3.3.7/` | v3.3.7 | git tag 归档 | 11M |
| 微调/PEFT | `peft-v0.19.1/` | v0.19.1 | git tag 归档 | 24M |
| 微调/PEFT | `LLaMA-Factory-v0.9.5/` | v0.9.5 | git tag 归档 | 14M |
| 对齐/RLHF | `trl-v1.9.0/` | 1.9.0 | PyPI sdist | 3.7M |
| 压缩/量化 | `llm-compressor-v0.12.0/` | 0.12.0 | PyPI sdist | 5.6M |
| 压缩/量化 | `bitsandbytes-v0.50.0/` | 0.50.0 | PyPI wheel 解包（已删 `.so`，保留全部 Python 源码） | 568K |

另见同级目录：`code/vllm-0.9.1/`、`code/sglang-0.5.9/`（早前归档的推理引擎源码）。

## 引用本归档的核心课题文件

- 分布式训练：`07_模型训练/04_分布式训练/` 相关文件
- 推理引擎：`10_部署推理/02_推理引擎/` 相关文件
- 微调/PEFT：[[05_大模型/07_微调技术/PEFT_2026]]、[[05_大模型/07_微调技术/LLaMA_Factory_Deep_Dive]]、[[05_大模型/07_微调技术/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail]]
- 对齐/RLHF：[[07_模型训练/06_对齐研究/TRL_RLHF_DPO_Guide]]、[[07_模型训练/06_对齐研究/GRPO_and_New_Alignment_Methods]]、[[07_模型训练/06_对齐研究/RLHF_at_Scale_2026]]
- 压缩/量化：[[10_部署推理/04_模型量化/Quantization_Techniques_2026]]、[[10_部署推理/04_模型量化/HF_Quantization_Ecosystem]]、[[10_部署推理/03_推理优化/Model_Compression]]、[[07_模型训练/05_模型压缩/Model_Compression_Complete_Guide]]
- 概念卡：`概念/Training/` 下 peft、lora-peft、qlora、sft、rlhf、ppo、dpo、grpo、awq、smoothquant、nf4、model-compression 等

## 归档约定

- 版本固定：目录名带版本 tag，保证课题文件中的行号引用可复现。
- 只保留源码：`.git`、编译产物（`.so` 等）一律剥离。
- 网络受限时的替代下载路线：`env -u http_proxy -u https_proxy -u all_proxy pip3 download <pkg>==<ver> --no-deps --no-binary :all: -d /tmp/dl -i https://pypi.tuna.tsinghua.edu.cn/simple`（sdist 即发布版源码；无 sdist 的包改用 `--only-binary :all:` 取 wheel 后解包）。
