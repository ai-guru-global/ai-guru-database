---
title: Using Docker
---
[](){ #deployment-docker }

[](){ #deployment-docker-pre-built-image }

## Use vLLM's Official Docker Image

vLLM offers an official Docker image for deployment.
The image can be used to run OpenAI compatible server and is available on Docker Hub as [vllm/vllm-openai](https://hub.docker.com/r/vllm/vllm-openai/tags).

```console
docker run --runtime nvidia --gpus all \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    --env "HUGGING_FACE_HUB_TOKEN=<secret>" \
    -p 8000:8000 \
    --ipc=host \
    vllm/vllm-openai:latest \
    --model mistralai/Mistral-7B-v0.1
```

This image can also be used with other container engines such as [Podman](https://podman.io/).

```console
podman run --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  --env "HUGGING_FACE_HUB_TOKEN=$HF_TOKEN" \
  -p 8000:8000 \
  --ipc=host \
  vllm/vllm-openai:latest \
  --model mistralai/Mistral-7B-v0.1
```

You can add any other [engine-args][engine-args] you need after the image tag (`vllm/vllm-openai:latest`).

!!! note
    You can either use the `ipc=host` flag or `--shm-size` flag to allow the
    container to access the host's shared memory. vLLM uses PyTorch, which uses shared
    memory to share data between processes under the hood, particularly for tensor parallel inference.

!!! note
    Optional dependencies are not included in order to avoid licensing issues (e.g. <gh-issue:8030>).

    If you need to use those dependencies (having accepted the license terms),
    create a custom Dockerfile on top of the base image with an extra layer that installs them:

    ```Dockerfile
    FROM vllm/vllm-openai:v0.9.0

    # e.g. install the `audio` optional dependencies
    # NOTE: Make sure the version of vLLM matches the base image!
    RUN uv pip install --system vllm[audio]==0.9.0
    ```

!!! tip
    Some new models may only be available on the main branch of [HF Transformers](https://github.com/huggingface/transformers).

    To use the development version of `transformers`, create a custom Dockerfile on top of the base image
    with an extra layer that installs their code from source:

    ```Dockerfile
    FROM vllm/vllm-openai:latest

    RUN uv pip install --system git+https://github.com/huggingface/transformers.git
    ```

[](){ #deployment-docker-build-image-from-source }

## Building vLLM's Docker Image from Source

You can build and run vLLM from source via the provided <gh-file:docker/Dockerfile>. To build vLLM:

```console
# optionally specifies: --build-arg max_jobs=8 --build-arg nvcc_threads=2
DOCKER_BUILDKIT=1 docker build . \
    --target vllm-openai \
    --tag vllm/vllm-openai \
    --file docker/Dockerfile
```

!!! note
    By default vLLM will build for all GPU types for widest distribution. If you are just building for the
    current GPU type the machine is running on, you can add the argument `--build-arg torch_cuda_arch_list=""`
    for vLLM to find the current GPU type and build for that.

    If you are using Podman instead of Docker, you might need to disable SELinux labeling by
    adding `--security-opt label=disable` when running `podman build` command to avoid certain [existing issues](https://github.com/containers/buildah/discussions/4184).

## Building for Arm64/aarch64

A docker container can be built for aarch64 systems such as the Nvidia Grace-Hopper. At time of this writing, this requires the use
of PyTorch Nightly and should be considered **experimental**. Using the flag `--platform "linux/arm64"` will attempt to build for arm64.

!!! note
    Multiple modules must be compiled, so this process can take a while. Recommend using `--build-arg max_jobs=` & `--build-arg nvcc_threads=`
    flags to speed up build process. However, ensure your `max_jobs` is substantially larger than `nvcc_threads` to get the most benefits.
    Keep an eye on memory usage with parallel jobs as it can be substantial (see example below).

```console
# Example of building on Nvidia GH200 server. (Memory usage: ~15GB, Build time: ~1475s / ~25 min, Image size: 6.93GB)
python3 use_existing_torch.py
DOCKER_BUILDKIT=1 docker build . \
  --file docker/Dockerfile \
  --target vllm-openai \
  --platform "linux/arm64" \
  -t vllm/vllm-gh200-openai:latest \
  --build-arg max_jobs=66 \
  --build-arg nvcc_threads=2 \
  --build-arg torch_cuda_arch_list="9.0 10.0+PTX" \
  --build-arg vllm_fa_cmake_gpu_arches="90-real"
```

!!! note
    If you are building the `linux/arm64` image on a non-ARM host (e.g., an x86_64 machine), you need to ensure your system is set up for cross-compilation using QEMU. This allows your host machine to emulate ARM64 execution.

    Run the following command on your host machine to register QEMU user static handlers:

    ```console
    docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
    ```

    After setting up QEMU, you can use the `--platform "linux/arm64"` flag in your `docker build` command.

## Use the custom-built vLLM Docker image

To run vLLM with the custom-built Docker image:

```console
docker run --runtime nvidia --gpus all \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    -p 8000:8000 \
    --env "HUGGING_FACE_HUB_TOKEN=<secret>" \
    vllm/vllm-openai <args...>
```

The argument `vllm/vllm-openai` specifies the image to run, and should be replaced with the name of the custom-built image (the `-t` tag from the build command).

!!! note
    **For version 0.4.1 and 0.4.2 only** - the vLLM docker images under these versions are supposed to be run under the root user since a library under the root user's home directory, i.e. `/root/.config/vllm/nccl/cu12/libnccl.so.2.18.1` is required to be loaded during runtime. If you are running the container under a different user, you may need to first change the permissions of the library (and all the parent directories) to allow the user to access it, then run vLLM with environment variable `VLLM_NCCL_SO_PATH=/root/.config/vllm/nccl/cu12/libnccl.so.2.18.1` .

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
