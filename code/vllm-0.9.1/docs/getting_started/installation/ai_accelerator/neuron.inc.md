# --8<-- [start:installation]

[AWS Neuron](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/) is the software development kit (SDK) used to run deep learning and 
    generative AI workloads on AWS Inferentia and AWS Trainium powered Amazon EC2 instances and UltraServers (Inf1, Inf2, Trn1, Trn2, 
    and Trn2 UltraServer). Both Trainium and Inferentia are powered by fully-independent heterogeneous compute-units called NeuronCores. 
    This tab describes how to set up your environment to run vLLM on Neuron.

!!! warning
    There are no pre-built wheels or images for this device, so you must build vLLM from source.

# --8<-- [end:installation]
# --8<-- [start:requirements]

- OS: Linux
- Python: 3.9 or newer
- Pytorch 2.5/2.6
- Accelerator: NeuronCore-v2 (in trn1/inf2 chips) or NeuronCore-v3 (in trn2 chips)
- AWS Neuron SDK 2.23

## Configure a new environment

### Launch a Trn1/Trn2/Inf2 instance and verify Neuron dependencies

The easiest way to launch a Trainium or Inferentia instance with pre-installed Neuron dependencies is to follow this 
[quick start guide](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/setup/neuron-setup/multiframework/multi-framework-ubuntu22-neuron-dlami.html#setup-ubuntu22-multi-framework-dlami) using the Neuron Deep Learning AMI (Amazon machine image).

- After launching the instance, follow the instructions in [Connect to your instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html) to connect to the instance
- Once inside your instance, activate the pre-installed virtual environment for inference by running
```console
source /opt/aws_neuronx_venv_pytorch_2_6_nxd_inference/bin/activate
```

Refer to the [NxD Inference Setup Guide](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/nxdi-setup.html) 
for alternative setup instructions including using Docker and manually installing dependencies.

!!! note
    NxD Inference is the default recommended backend to run inference on Neuron. If you are looking to use the legacy [transformers-neuronx](https://github.com/aws-neuron/transformers-neuronx) 
    library, refer to [Transformers NeuronX Setup](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/transformers-neuronx/setup/index.html).  

# --8<-- [end:requirements]
# --8<-- [start:set-up-using-python]

# --8<-- [end:set-up-using-python]
# --8<-- [start:pre-built-wheels]

Currently, there are no pre-built Neuron wheels.

# --8<-- [end:pre-built-wheels]
# --8<-- [start:build-wheel-from-source]

#### Install vLLM from source

Install vllm as follows:

```console
git clone https://github.com/vllm-project/vllm.git
cd vllm
pip install -U -r requirements/neuron.txt
VLLM_TARGET_DEVICE="neuron" pip install -e .
```

AWS Neuron maintains a [Github fork of vLLM](https://github.com/aws-neuron/upstreaming-to-vllm/tree/neuron-2.23-vllm-v0.7.2) at 
    [https://github.com/aws-neuron/upstreaming-to-vllm/tree/neuron-2.23-vllm-v0.7.2](https://github.com/aws-neuron/upstreaming-to-vllm/tree/neuron-2.23-vllm-v0.7.2), which contains several features in addition to what's 
    available on vLLM V0. Please utilize the AWS Fork for the following features:

- Llama-3.2 multi-modal support
- Multi-node distributed inference 

Refer to [vLLM User Guide for NxD Inference](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/vllm-user-guide.html) 
    for more details and usage examples.

To install the AWS Neuron fork, run the following:

```console
git clone -b neuron-2.23-vllm-v0.7.2 https://github.com/aws-neuron/upstreaming-to-vllm.git
cd upstreaming-to-vllm
pip install -r requirements/neuron.txt
VLLM_TARGET_DEVICE="neuron" pip install -e .
```

Note that the AWS Neuron fork is only intended to support Neuron hardware; compatibility with other hardwares is not tested.

# --8<-- [end:build-wheel-from-source]
# --8<-- [start:set-up-using-docker]

# --8<-- [end:set-up-using-docker]
# --8<-- [start:pre-built-images]

Currently, there are no pre-built Neuron images.

# --8<-- [end:pre-built-images]
# --8<-- [start:build-image-from-source]

See [deployment-docker-build-image-from-source][deployment-docker-build-image-from-source] for instructions on building the Docker image.

Make sure to use <gh-file:docker/Dockerfile.neuron> in place of the default Dockerfile.

# --8<-- [end:build-image-from-source]
# --8<-- [start:extra-information]

[](){ #feature-support-through-nxd-inference-backend }
### Feature support through NxD Inference backend

The current vLLM and Neuron integration relies on either the `neuronx-distributed-inference` (preferred) or `transformers-neuronx` backend 
    to perform most of the heavy lifting which includes PyTorch model initialization, compilation, and runtime execution. Therefore, most 
    [features supported on Neuron](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/feature-guide.html) are also available via the vLLM integration. 

To configure NxD Inference features through the vLLM entrypoint, use the `override_neuron_config` setting. Provide the configs you want to override 
as a dictionary (or JSON object when starting vLLM from the CLI). For example, to disable auto bucketing, include
```console
override_neuron_config={
    "enable_bucketing":False,
}
```
or when launching vLLM from the CLI, pass
```console
--override-neuron-config "{\"enable_bucketing\":false}"
```

Alternatively, users can directly call the NxDI library to trace and compile your model, then load the pre-compiled artifacts 
(via `NEURON_COMPILED_ARTIFACTS` environment variable) in vLLM to run inference workloads. 

### Known limitations

- EAGLE speculative decoding: NxD Inference requires the EAGLE draft checkpoint to include the LM head weights from the target model. Refer to this
    [guide](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/feature-guide.html#eagle-checkpoint-compatibility)
    for how to convert pretrained EAGLE model checkpoints to be compatible for NxDI.
- Quantization: the native quantization flow in vLLM is not well supported on NxD Inference. It is recommended to follow this 
    [Neuron quantization guide](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/custom-quantization.html) 
    to quantize and compile your model using NxD Inference, and then load the compiled artifacts into vLLM.
- Multi-LoRA serving: NxD Inference only supports loading of LoRA adapters at server startup. Dynamic loading of LoRA adapters at 
    runtime is not currently supported. Refer to [multi-lora example](https://github.com/aws-neuron/upstreaming-to-vllm/blob/neuron-2.23-vllm-v0.7.2/examples/offline_inference/neuron_multi_lora.py)
- Multi-modal support: multi-modal support is only available through the AWS Neuron fork. This feature has not been upstreamed
    to vLLM main because NxD Inference currently relies on certain adaptations to the core vLLM logic to support this feature.
- Multi-node support: distributed inference across multiple Trainium/Inferentia instances is only supported on the AWS Neuron fork. Refer
    to this [multi-node example](https://github.com/aws-neuron/upstreaming-to-vllm/tree/neuron-2.23-vllm-v0.7.2/examples/neuron/multi_node)
    to run. Note that tensor parallelism (distributed inference across NeuronCores) is available in vLLM main.
- Known edge case bug in speculative decoding: An edge case failure may occur in speculative decoding when sequence length approaches 
    max model length (e.g. when requesting max tokens up to the max model length and ignoring eos). In this scenario, vLLM may attempt 
    to allocate an additional block to ensure there is enough memory for number of lookahead slots, but since we do not have good support 
    for paged attention, there isn't another Neuron block for vLLM to allocate. A workaround fix (to terminate 1 iteration early) is 
    implemented in the AWS Neuron fork but is not upstreamed to vLLM main as it modifies core vLLM logic.


### Environment variables
- `NEURON_COMPILED_ARTIFACTS`: set this environment variable to point to your pre-compiled model artifacts directory to avoid 
    compilation time upon server initialization. If this variable is not set, the Neuron module will perform compilation and save the
    artifacts under `neuron-compiled-artifacts/{unique_hash}/` sub-directory in the model path. If this environment variable is set,
    but the directory does not exist, or the contents are invalid, Neuron will also fallback to a new compilation and store the artifacts
    under this specified path.
- `NEURON_CONTEXT_LENGTH_BUCKETS`: Bucket sizes for context encoding. (Only applicable to `transformers-neuronx` backend).
- `NEURON_TOKEN_GEN_BUCKETS`: Bucket sizes for token generation. (Only applicable to `transformers-neuronx` backend).

# --8<-- [end:extra-information]

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
