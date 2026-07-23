# --8<-- [start:installation]

Tensor Processing Units (TPUs) are Google's custom-developed application-specific
integrated circuits (ASICs) used to accelerate machine learning workloads. TPUs
are available in different versions each with different hardware specifications.
For more information about TPUs, see [TPU System Architecture](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm).
For more information on the TPU versions supported with vLLM, see:

- [TPU v6e](https://cloud.google.com/tpu/docs/v6e)
- [TPU v5e](https://cloud.google.com/tpu/docs/v5e)
- [TPU v5p](https://cloud.google.com/tpu/docs/v5p)
- [TPU v4](https://cloud.google.com/tpu/docs/v4)

These TPU versions allow you to configure the physical arrangements of the TPU
chips. This can improve throughput and networking performance. For more
information see:

- [TPU v6e topologies](https://cloud.google.com/tpu/docs/v6e#configurations)
- [TPU v5e topologies](https://cloud.google.com/tpu/docs/v5e#tpu-v5e-config)
- [TPU v5p topologies](https://cloud.google.com/tpu/docs/v5p#tpu-v5p-config)
- [TPU v4 topologies](https://cloud.google.com/tpu/docs/v4#tpu-v4-config)

In order for you to use Cloud TPUs you need to have TPU quota granted to your
Google Cloud Platform project. TPU quotas specify how many TPUs you can use in a
GPC project and are specified in terms of TPU version, the number of TPU you
want to use, and quota type. For more information, see [TPU quota](https://cloud.google.com/tpu/docs/quota#tpu_quota).

For TPU pricing information, see [Cloud TPU pricing](https://cloud.google.com/tpu/pricing).

You may need additional persistent storage for your TPU VMs. For more
information, see [Storage options for Cloud TPU data](https://cloud.devsite.corp.google.com/tpu/docs/storage-options).

!!! warning
    There are no pre-built wheels for this device, so you must either use the pre-built Docker image or build vLLM from source.

# --8<-- [end:installation]
# --8<-- [start:requirements]

- Google Cloud TPU VM
- TPU versions: v6e, v5e, v5p, v4
- Python: 3.10 or newer

### Provision Cloud TPUs

You can provision Cloud TPUs using the [Cloud TPU API](https://cloud.google.com/tpu/docs/reference/rest)
or the [queued resources](https://cloud.google.com/tpu/docs/queued-resources)
API (preferred). This section shows how to create TPUs using the queued resource API. For
more information about using the Cloud TPU API, see [Create a Cloud TPU using the Create Node API](https://cloud.google.com/tpu/docs/managing-tpus-tpu-vm#create-node-api).
Queued resources enable you to request Cloud TPU resources in a queued manner.
When you request queued resources, the request is added to a queue maintained by
the Cloud TPU service. When the requested resource becomes available, it's
assigned to your Google Cloud project for your immediate exclusive use.

!!! note
    In all of the following commands, replace the ALL CAPS parameter names with
    appropriate values. See the parameter descriptions table for more information.

### Provision Cloud TPUs with GKE

For more information about using TPUs with GKE, see:
- <https://cloud.google.com/kubernetes-engine/docs/how-to/tpus>
- <https://cloud.google.com/kubernetes-engine/docs/concepts/tpus>
- <https://cloud.google.com/kubernetes-engine/docs/concepts/plan-tpus>

## Configure a new environment

### Provision a Cloud TPU with the queued resource API

Create a TPU v5e with 4 TPU chips:

```console
gcloud alpha compute tpus queued-resources create QUEUED_RESOURCE_ID \
--node-id TPU_NAME \
--project PROJECT_ID \
--zone ZONE \
--accelerator-type ACCELERATOR_TYPE \
--runtime-version RUNTIME_VERSION \
--service-account SERVICE_ACCOUNT
```

| Parameter name     | Description                                                                                                                                                                                              |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| QUEUED_RESOURCE_ID | The user-assigned ID of the queued resource request.                                                                                                                                                     |
| TPU_NAME           | The user-assigned name of the TPU which is created when the queued                                                                                                                                       |
| PROJECT_ID         | Your Google Cloud project                                                                                                                                                                                |
| ZONE               | The GCP zone where you want to create your Cloud TPU. The value you use                                                                                                                                  |
| ACCELERATOR_TYPE   | The TPU version you want to use. Specify the TPU version, for example                                                                                                                                    |
| RUNTIME_VERSION    | The TPU VM runtime version to use. For example, use `v2-alpha-tpuv6e` for a VM loaded with one or more v6e TPU(s). For more information see [TPU VM images](https://cloud.google.com/tpu/docs/runtimes). |
  <figcaption>Parameter descriptions</figcaption>

Connect to your TPU using SSH:

```bash
gcloud compute tpus tpu-vm ssh TPU_NAME --zone ZONE
```

# --8<-- [end:requirements]
# --8<-- [start:set-up-using-python]

# --8<-- [end:set-up-using-python]
# --8<-- [start:pre-built-wheels]

Currently, there are no pre-built TPU wheels.

# --8<-- [end:pre-built-wheels]
# --8<-- [start:build-wheel-from-source]

Install Miniconda:

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
source ~/.bashrc
```

Create and activate a Conda environment for vLLM:

```bash
conda create -n vllm python=3.10 -y
conda activate vllm
```

Clone the vLLM repository and go to the vLLM directory:

```bash
git clone https://github.com/vllm-project/vllm.git && cd vllm
```

Uninstall the existing `torch` and `torch_xla` packages:

```bash
pip uninstall torch torch-xla -y
```

Install build dependencies:

```bash
pip install -r requirements/tpu.txt
sudo apt-get install libopenblas-base libopenmpi-dev libomp-dev
```

Run the setup script:

```bash
VLLM_TARGET_DEVICE="tpu" python -m pip install -e .
```

# --8<-- [end:build-wheel-from-source]
# --8<-- [start:set-up-using-docker]

# --8<-- [end:set-up-using-docker]
# --8<-- [start:pre-built-images]

See [deployment-docker-pre-built-image][deployment-docker-pre-built-image] for instructions on using the official Docker image, making sure to substitute the image name `vllm/vllm-openai` with `vllm/vllm-tpu`.

# --8<-- [end:pre-built-images]
# --8<-- [start:build-image-from-source]

You can use <gh-file:docker/Dockerfile.tpu> to build a Docker image with TPU support.

```console
docker build -f docker/Dockerfile.tpu -t vllm-tpu .
```

Run the Docker image with the following command:

```console
# Make sure to add `--privileged --net host --shm-size=16G`.
docker run --privileged --net host --shm-size=16G -it vllm-tpu
```

!!! note
    Since TPU relies on XLA which requires static shapes, vLLM bucketizes the
    possible input shapes and compiles an XLA graph for each shape. The
    compilation time may take 20~30 minutes in the first run. However, the
    compilation time reduces to ~5 minutes afterwards because the XLA graphs are
    cached in the disk (in `VLLM_XLA_CACHE_PATH` or `~/.cache/vllm/xla_cache` by default).

!!! tip
    If you encounter the following error:

    ```console
    from torch._C import *  # noqa: F403
    ImportError: libopenblas.so.0: cannot open shared object file: No such
    file or directory
    ```

    Install OpenBLAS with the following command:

    ```console
    sudo apt-get install libopenblas-base libopenmpi-dev libomp-dev
    ```

# --8<-- [end:build-image-from-source]
# --8<-- [start:extra-information]

There is no extra information for this device.
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
