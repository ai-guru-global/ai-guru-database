# Using GPUs inside containers

| :zap: Requirement | nerdctl >= 0.9 |
|-------------------|----------------|

> [!NOTE]
> The description in this section applies to nerdctl v2.3 or later.
> Users of prior releases of nerdctl should refer to <https://github.com/containerd/nerdctl/blob/v2.2.0/docs/gpu.md>

nerdctl provides docker-compatible NVIDIA and AMD GPU support.

## Prerequisites

- GPU Drivers
  - Same requirement as when you use GPUs on Docker. For details, please refer to these docs by [NVIDIA](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#pre-requisites) and [AMD](https://instinct.docs.amd.com/projects/container-toolkit/en/latest/container-runtime/quick-start-guide.html#step-2-install-the-amdgpu-driver).
- Container Toolkit
  - containerd relies on vendor Container Toolkits to make GPUs available to the containers. You can install those by following the official installation instructions from [NVIDIA](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) and [AMD](https://instinct.docs.amd.com/projects/container-toolkit/en/latest/container-runtime/quick-start-guide.html).
- CDI Specification
  - Container Device Interface (CDI) specification for the GPU devices is required for the GPU support to work. Follow the official documentation from [NVIDIA](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html) and [AMD](https://instinct.docs.amd.com/projects/container-toolkit/en/latest/container-runtime/cdi-guide.html) to ensure that the required CDI specifications are present on the system.

## Options for `nerdctl run --gpus`

`nerdctl run --gpus` is compatible to [`docker run --gpus`](https://docs.docker.com/engine/reference/commandline/run/#access-an-nvidia-gpu).

You can specify number of GPUs to use via `--gpus` option.
The following examples expose all available GPUs to the container.

```
nerdctl run -it --rm --gpus all nvidia/cuda:12.3.1-base-ubuntu20.04 nvidia-smi
```

or

```
nerdctl run -it --rm --gpus=all rocm/rocm-terminal rocm-smi
```

You can also pass detailed configuration to `--gpus` option as a list of key-value pairs. The following options are provided.

- `count`: number of GPUs to use. `all` exposes all available GPUs.
- `device`: IDs of GPUs to use. UUID or numbers of GPUs can be specified. This only works for NVIDIA GPUs.

The following example exposes a specific NVIDIA GPU to the container.

```
nerdctl run -it --rm --gpus 'device=GPU-3a23c669-1f69-c64e-cf85-44e9b07e7a2a' nvidia/cuda:12.3.1-base-ubuntu20.04 nvidia-smi
```

Note that although `capabilities` options may be provided, these are ignored when processing the GPU request since nerdctl v2.3.

## Fields for `nerdctl compose`

`nerdctl compose` also supports GPUs following [compose-spec](https://github.com/compose-spec/compose-spec/blob/master/deploy.md#devices).

You can use GPUs on compose when you specify the `driver` as `nvidia` or one or
more of the following `capabilities` in `services.demo.deploy.resources.reservations.devices`.

- `gpu`
- `nvidia`

Available fields are the same as `nerdctl run --gpus`.

The following exposes all available GPUs to the container.

```
version: "3.8"
services:
  demo:
    image: nvidia/cuda:12.3.1-base-ubuntu20.04
    command: nvidia-smi
    deploy:
      resources:
        reservations:
          devices:
          - driver: nvidia
            count: all
```

## Trouble Shooting

### `nerdctl run --gpus` fails due to an unresolvable CDI device

If the required CDI specifications for your GPU devices are not available on the
system, the `nerdctl run` command will fail with an error similar to: `CDI device injection failed: unresolvable CDI devices nvidia.com/gpu=all` (the
exact error message will depend on the vendor and the device(s) requested).

This should be the same error message that is reported when the `--device` flag
is used to request a CDI device:
```
nerdctl run --device=nvidia.com/gpu=all
```

Ensure that the NVIDIA (or AMD) Container Toolkit is installed and the requested CDI devices are present in the ouptut of `nvidia-ctk cdi list` (or `amd-ctk cdi list` for AMD GPUs):

```
$ nvidia-ctk cdi list
INFO[0000] Found 3 CDI devices
nvidia.com/gpu=0
nvidia.com/gpu=GPU-3eb87630-93d5-b2b6-b8ff-9b359caf4ee2
nvidia.com/gpu=all
```

For NVIDIA Container Toolkit, version >= v1.18.0 is recommended. See the NVIDIA Container Toolkit [CDI documentation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html) for more information.

For AMD Container Toolkit, version >= v1.2.0 is recommended. See the AMD Container Toolkit [CDI documentation](https://instinct.docs.amd.com/projects/container-toolkit/en/latest/container-runtime/cdi-guide.html) for more information.


### `nerdctl run --gpus` fails when using the Nvidia gpu-operator

If the Nvidia driver is installed by the [gpu-operator](https://github.com/NVIDIA/gpu-operator).The `nerdctl run` will fail with the error message `(FATA[0000] exec: "nvidia-container-cli": executable file not found in $PATH)`.

So, the `nvidia-container-cli` needs to be added to the PATH environment variable.

You can do this by adding the following line to your $HOME/.profile or /etc/profile (for a system-wide installation):
```
export PATH=$PATH:/usr/local/nvidia/toolkit
```

The shared libraries also need to be added to the system.
```
echo "/run/nvidia/driver/usr/lib/x86_64-linux-gnu" > /etc/ld.so.conf.d/nvidia.conf
ldconfig
```

And then, the `nerdctl run --gpus` can run successfully.

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

## 进阶内容补充

| 主题 | 深度解析 | 实践要点 | 参考资源 |
|------|----------|----------|----------|
| 原理深入 | 底层机制剖析 | 源码阅读+实验验证 | 官方文档+论文 |
| 工程实现 | 生产级代码实践 | 设计模式+测试覆盖 | 开源项目 |
| 性能调优 | 瓶颈定位+优化 | Profiling+基准测试 | 性能工具 |
| 安全加固 | 威胁建模+防护 | 安全审计+渗透测试 | 安全框架 |
| 架构演进 | 系统设计与重构 | 渐进式改造+验证 | 架构书籍 |

## 实践操作指南

| 步骤 | 操作 | 验证方法 | 常见问题 |
|------|------|----------|----------|
| 环境搭建 | 安装依赖+配置 | 运行hello world | 版本冲突 |
| 基础使用 | 核心API调用 | 单元测试通过 | 参数错误 |
| 功能开发 | 业务逻辑实现 | 集成测试通过 | 边界条件 |
| 性能优化 | 热点优化+缓存 | 压测达标 | 内存泄漏 |
| 部署上线 | 容器化+CI/CD | 灰度验证通过 | 配置差异 |

## 技术选型决策

| 考量因素 | 权重 | 评估方法 | 决策标准 |
|----------|------|----------|----------|
| 功能匹配 | 30% | 需求清单对比 | 覆盖核心需求 |
| 性能表现 | 25% | 基准测试 | 满足SLA |
| 社区生态 | 20% | Star/Issue/更新频率 | 活跃维护 |
| 学习成本 | 15% | 文档质量+上手时间 | 团队可接受 |
| 长期维护 | 10% | 路线图+兼容性 | 可持续发展 |

## 故障排查流程

| 阶段 | 动作 | 工具 | 产出 |
|------|------|------|------|
| 复现 | 稳定复现问题 | 日志+断点 | 复现步骤 |
| 定位 | 缩小问题范围 | 二分法+排除法 | 问题模块 |
| 分析 | 找到根本原因 | 源码+文档 | 根因报告 |
| 修复 | 实施修复方案 | 代码修改+测试 | 修复PR |
| 验证 | 确认问题消除 | 回归测试 | 验证报告 |
| 预防 | 防止再次发生 | 监控+文档 | 改进措施 |

## 知识关联图谱

| 关联领域 | 关系 | 学习顺序 |
|----------|------|----------|
| 前置基础 | 必须先掌握 | 先学 |
| 并行技能 | 相互增强 | 同步 |
| 进阶方向 | 深入发展 | 后学 |
| 应用场景 | 价值体现 | 实践 |
| 工具支撑 | 效率提升 | 随时 |

## 持续改进清单

- [ ] 定期回顾和更新知识
- [ ] 实践验证理论认知
- [ ] 关注社区最新动态
- [ ] 参与技术讨论和分享
- [ ] 将经验沉淀为文档
- [ ] 持续优化工作流程
