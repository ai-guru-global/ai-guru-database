# Lazy-pulling using CernVM-FS Snapshotter

CernVM-FS Snapshotter is a containerd snapshotter plugin. It is a specialized component responsible for assembling
all the layers of container images into a stacked file system that containerd can use. The snapshotter takes as input the list
of required layers and outputs a directory containing the final file system. It is also responsible to clean up the output
directory when containers using it are stopped.

See the official [documentation](https://cvmfs.readthedocs.io/en/latest/cpt-containers.html#how-to-use-the-cernvm-fs-snapshotter) to learn further information.

## Prerequisites

- Install containerd remote snapshotter plugin (`cvmfs-snapshotter`) from [here](https://github.com/cvmfs/cvmfs/tree/devel/snapshotter).

- Add the following to `/etc/containerd/config.toml`:
```toml
# Ask containerd to use this particular snapshotter
[plugins."io.containerd.grpc.v1.cri".containerd]
    snapshotter = "cvmfs-snapshotter"
    disable_snapshot_annotations = false

# Set the communication endpoint between containerd and the snapshotter
[proxy_plugins]
    [proxy_plugins.cvmfs]
        type = "snapshot"
        address = "/run/containerd-cvmfs-grpc/containerd-cvmfs-grpc.sock"
```
- The default CernVM-FS repository hosting the flat root filesystems of the container images is `unpacked.cern.ch`.
  The container images are unpacked into the CernVM-FS repository by the [DUCC](https://cvmfs.readthedocs.io/en/latest/cpt-ducc.html)
  (Daemon that Unpacks Container Images into CernVM-FS) tool.
  You can change the repository adding the following line to `/etc/containerd-cvmfs-grpc/config.toml`:
```toml
repository = "myrepo.mydomain"
```
- Launch `containerd` and `cvmfs-snapshotter`:
```console
$ systemctl start containerd cvmfs-snapshotter
```

## Enable CernVM-FS Snapshotter for `nerdctl run` and `nerdctl pull`

| :zap: Requirement | nerdctl >= 1.6.3 |
| ----------------- | ---------------- |

- Run `nerdctl` with `--snapshotter cvmfs-snapshotter` as in the example below:
```console
$ nerdctl run -it --rm --snapshotter cvmfs-snapshotter clelange/cms-higgs-4l-full:latest
```

- You can also only pull the image with CernVM-FS Snapshotter without running the container:
```console
$ nerdctl pull --snapshotter cvmfs-snapshotter clelange/cms-higgs-4l-full:latest
```

The speedup for pulling this 9 GB (4.3 GB compressed) image is shown below:
- #### with the snapshotter:
```console
$ nerdctl --snapshotter cvmfs-snapshotter pull clelange/cms-higgs-4l-full:latest
docker.io/clelange/cms-higgs-4l-full:latest:                                      resolved       |++++++++++++++++++++++++++++++++++++++|
manifest-sha256:b8acbe80629dd28d213c03cf1ffd3d46d39e573f54215a281fabce7494b3d546: done           |++++++++++++++++++++++++++++++++++++++|
config-sha256:89ef54b6c4fbbedeeeb29b1df2b9916b6d157c87cf1878ea882bff86a3093b5c:   done           |++++++++++++++++++++++++++++++++++++++|
elapsed: 4.7 s                                                                    total:  19.8 K (4.2 KiB/s)

$ nerdctl images
REPOSITORY                    TAG       IMAGE ID        CREATED           PLATFORM       SIZE     BLOB SIZE
clelange/cms-higgs-4l-full    latest    b8acbe80629d    20 seconds ago    linux/amd64    0.0 B    4.3 GiB
```
- #### without the snapshotter:
```console
$ nerdctl pull clelange/cms-higgs-4l-full:latest
docker.io/clelange/cms-higgs-4l-full:latest:                                      resolved       |++++++++++++++++++++++++++++++++++++++|
manifest-sha256:b8acbe80629dd28d213c03cf1ffd3d46d39e573f54215a281fabce7494b3d546: exists         |++++++++++++++++++++++++++++++++++++++|
config-sha256:89ef54b6c4fbbedeeeb29b1df2b9916b6d157c87cf1878ea882bff86a3093b5c:   exists         |++++++++++++++++++++++++++++++++++++++|
layer-sha256:e8114d4b0d10b33aaaa4fbc3c6da22bbbcf6f0ef0291170837e7c8092b73840a:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:a3eda0944a81e87c7a44b117b1c2e707bc8d18e9b7b478e21698c11ce3e8b819:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:8f3160776e8e8736ea9e3f6c870d14cd104143824bbcabe78697315daca0b9ad:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:22a5c05baa9db0aa7bba56ffdb2dd21246b9cf3ce938fc6d7bf20e92a067060e:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:bfcf9d498f92b72426c9d5b73663504d87249d6783c6b58d71fbafc275349ab9:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:0563e1549926b9c8beac62407bc6a420fa35bcf6f9844e5d8beeb9165325a872:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:6fff5fd7fb4eeb79a1399d9508614a84191d05e53f094832062d689245599640:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:25c39bfa66e1157415236703abc512d06cc1db31bd00fe8c3030c6d6d249dc4e:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:3cc0a0eb55eb3fb7ef0760c6bf1e567dfc56933ba5f11b5415f89228af751b72:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:a8850244786303e508b94bb31c8569310765e678c9c73bf1199310729209b803:    done           |++++++++++++++++++++++++++++++++++++++|
layer-sha256:32cdf5fc12485ac061347eb8b5c3b4a28505ce8564a7f3f83ac4241f03911176:    done           |++++++++++++++++++++++++++++++++++++++|
elapsed: 181.8s                                                                   total:  4.3 Gi (24.2 MiB/s)

$ nerdctl images
REPOSITORY                    TAG       IMAGE ID        CREATED          PLATFORM       SIZE       BLOB SIZE
clelange/cms-higgs-4l-full    latest    b8acbe80629d    4 minutes ago    linux/amd64    9.0 GiB    4.3 GiB
```

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
