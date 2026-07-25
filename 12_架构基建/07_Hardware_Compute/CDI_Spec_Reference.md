---
title: "CDI 规范 (Container Device Interface Spec) — 官方源引用"
category: -references
tags: ["references", "cdi", "container-device-interface", "cncf", "specification", "kubernetes", "container-runtime"]
sources:
  - "https://github.com/cncf-tags/container-device-interface"
  - "https://github.com/cncf-tags/container-device-interface/blob/main/SPEC.md"
  - "https://github.com/cncf-tags/container-device-interface/blob/main/TUTORIAL.md"
summary: "CDI (Container Device Interface) 是 CNCF Tags 治理的容器运行时设备接入规范，Apache-2.0 开源。仓库 cncf-tags/container-device-interface 提供 SPEC.md 规范、pkg/cdi Go 参考库与 cdi CLI。本页是该规范在本 wiki 的引用索引，关联本地 CDI 深度文档。"
created: 2026-06-15
updated: 2026-06-15
lifecycle: draft
tier: supporting
aliases:
  - "Cdi Spec"
  - "cdi spec"

---
# CDI 规范 (Container Device Interface Spec) — 官方源引用

> 本页是 CDI 规范**官方源头**的引用索引;深度技术解析见本地 [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive|CDI 深度解析]]。

## 官方源头

| 项 | 内容 |
|----|------|
| **规范仓库** | [github.com/cncf-tags/container-device-interface](https://github.com/cncf-tags/container-device-interface) |
| **规范文件** | [SPEC.md](https://github.com/cncf-tags/container-device-interface/blob/main/SPEC.md) |
| **教程** | [TUTORIAL.md](https://github.com/cncf-tags/container-device-interface/blob/main/TUTORIAL.md) |
| **Go 参考库** | `pkg/cdi`(仓库内);Go module path `tags.cncf.io/container-device-interface` |
| **JSON Schema** | 仓库内 `schema/`(可用于校验 spec 文件) |
| **开源协议** | **Apache-2.0**(完全开源) |
| **治理** | **CNCF Tags**(topic: `tag-runtime`);模型基于 [CNI](https://github.com/containernetworking/cni) |
| **最新版本** | v1.1.0(2025-12-10);规范 `cdiVersion` 当前到 0.6.0+ |
| **社区** | Issues / PR 在 GitHub;贡献见 治理/CONTRIBUTING.md |

## 设备命名约定(规范核心)

```
vendor.com/class=unique_name
└─┬─┘ └─┬─┘  └──┬──┘
  │     │       └─ 设备逻辑名(每 vendor+class 唯一)
  │     └─ 设备类(gpu / nic / fpga ...)
  └─ 厂商 ID
组合 vendor+class 称为 kind(如 nvidia.com/gpu)
```

## Spec 文件约定

- **格式**: JSON 或 YAML(`.json` / `.yaml`)
- **默认搜索目录**: `/etc/cdi`(静态)、`/var/run/cdi`(动态生成)
- **核心字段**: `cdiVersion`、`kind`、`devices[].name`、`containerEdits`(deviceNodes / env / mounts / hooks)
- **可继承**: kind 级 `containerEdits` 被该 kind 下所有 device 继承

## 运行时支持矩阵(实测)

| 运行时 | CDI 支持 | 配置 |
|--------|----------|------|
| **containerd** | 需手动开 | `config.toml` 设 `enable_cdi = true`、`cdi_spec_dirs = ["/etc/cdi","/var/run/cdi"]` |
| **CRI-O** | 默认开启 | 默认即读 `/etc/cdi`、`/var/run/cdi`;`crio config \| grep cdi_spec_dirs` 可查 |
| **Docker** | 25.0+ 支持;**28.2 起默认开** | 25.0–28.1 需 `daemon.json` 加 `{"features":{"cdi":true}}` |
| **Podman** | 4.1+ 支持(v0.3.0 spec) | 无需配置 |

## CLI 工具

| 工具 | 来源 | 用途 |
|------|------|------|
| **`cdi`** | 仓库自带(`make` 构建) | `cdi specs/devices/vendors/classes/validate/monitor/inject` |
| **`nvidia-ctk cdi generate`** | NVIDIA Container Toolkit | 生成 NVIDIA GPU/MIG 的 CDI spec |
| **GPU Operator** | NVIDIA(自动) | v23.9+ 自动维护 `/var/run/cdi/nvidia.yaml` |

## 与本地文档的关联

- 深度解析 → [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive|CDI 深度解析]](含 spec 结构、工作原理、训练/推理定位、常见问题)
- 入门 → [[12_架构基建/CDI_for_dummy|CDI 小白版]]
- 概念卡 → [[概念/cdi|CDI 概念卡片]]
- 配套生态 → [[概念/dra|DRA]]、[[概念/gpu-operator|GPU Operator]]、[[概念/oci-runtime|OCI Runtime Spec]]

## Related

- [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive]]
- [[概念/cdi]]
- [[概念/dra]]
- [[概念/gpu-operator]]
- [[概念/oci-runtime]]

## 架构核心组件对比

| 组件层 | 功能 | 关键技术 | 选型考量 |
|--------|------|----------|----------|
| 计算层 | 07_模型训练/推理 | GPU/TPU/NPU集群 | 算力需求+成本 |
| 存储层 | 数据/模型/检查点 | 分布式存储/对象存储 | 容量+IOPS+成本 |
| 网络层 | 节点间通信 | RDMA/RoCE/InfiniBand | 带宽+延迟 |
| 调度层 | 资源编排 | K8s/Slurm/Ray | 弹性+效率 |
| 服务层 | 模型服务化 | vLLM/TGI/Triton | 吞吐+延迟 |
| 网关层 | 流量管理 | API Gateway/负载均衡 | 可用性+安全 |
| 监控层 | 可观测性 | Prometheus/Grafana/OTel | 全面+实时 |

## 架构设计原则

| 原则 | 说明 | 实践方法 |
|------|------|----------|
| 高可用 | 消除单点故障 | 多副本+故障转移+多AZ |
| 可扩展 | 水平扩展无瓶颈 | 无状态设计+分片 |
| 高性能 | 最小化延迟 | 缓存+并行+异步 |
| 安全性 | 纵深防御 | 加密+认证+审计 |
| 可观测 | 全链路可见 | Trace+Metrics+Logging |
| 成本优化 | 资源利用率最大化 | 弹性伸缩+混合部署 |

## 性能基准参考

| 场景 | 关键指标 | 目标值 | 优化方向 |
|------|----------|--------|----------|
| 模型推理 | 首Token延迟 | <500ms | 模型优化+缓存 |
| 批量推理 | 吞吐量 | >1000 req/s | 批处理+并行 |
| 训练任务 | GPU利用率 | >85% | 数据管道+通信优化 |
| 存储读写 | IOPS | >100K | NVMe+分布式 |
| 网络通信 | 带宽利用率 | >90% | RDMA+拓扑优化 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 |
|------|----------|----------|
| GPU利用率低 | 数据加载瓶颈 | 预取+多worker+NVMe |
| 推理延迟高 | 模型过大/批处理不当 | 量化+动态batch |
| 存储IO瓶颈 | 检查点写入集中 | 异步写入+分布式存储 |
| 网络拥塞 | AllReduce通信密集 | 梯度压缩+拓扑优化 |
| 资源碎片 | 调度策略不当 | Gang调度+资源预留 |

## 技术选型决策树

| 决策点 | 选项A | 选项B | 选择依据 |
|--------|-------|-------|----------|
| 训练框架 | PyTorch DDP | DeepSpeed/Megatron | 模型规模>10B用后者 |
| 推理引擎 | vLLM | TensorRT-LLM | 灵活性vs极致性能 |
| 存储方案 | 本地NVMe | 分布式存储(Ceph) | 数据规模+共享需求 |
| 网络方案 | 以太网 | InfiniBand | 集群规模+预算 |
| 调度系统 | K8s | Slurm | 云原生vs HPC传统 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 基础架构概念+组件认知 | 1-2周 | 理解全景图 |
| 基础 | 单一组件深入(存储/网络) | 2-3周 | 掌握核心原理 |
| 进阶 | 系统集成+性能优化 | 3-4周 | 能设计完整方案 |
| 实战 | 生产环境部署运维 | 4-6周 | 独立运维能力 |
| 精通 | 架构演进+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| RDMA | 远程直接内存访问(绕过CPU) |
| NVLink | GPU间高速互联 |
| InfiniBand | 高性能网络互连技术 |
| Checkpoint | 训练中间状态保存点 |
| Gang Scheduling | 一组Pod同时调度 |
| Data Parallelism | 数据并行(每GPU处理不同数据) |
| Model Parallelism | 模型并行(模型分片到多GPU) |
| Pipeline Parallelism | 流水线并行(层间流水) |
| Tensor Parallelism | 张量并行(层内切分) |
| KV Cache | 推理时缓存注意力键值 |

## 检查清单

- [ ] 理解AI基础设施全景架构
- [ ] 掌握计算/存储/网络核心组件
- [ ] 了解主流框架和工具链
- [ ] 能进行基本的性能分析和优化
- [ ] 熟悉生产环境最佳实践
- [ ] 关注硬件和架构演进趋势

## 架构演进趋势(2026)

| 趋势 | 影响 | 应对策略 |
|------|------|----------|
| 异构计算普及 | GPU/NPU/TPU混合部署 | 统一抽象层+调度优化 |
| 存算一体 | 减少数据搬运开销 | 关注新型硬件架构 |
| 液冷散热 | 支持更高功率密度 | 数据中心改造规划 |
| 光互连 | 突破带宽瓶颈 | 网络架构升级 |
| 云边协同 | 推理下沉到边缘 | 模型压缩+边缘部署 |
| AI for Infra | 智能运维和调优 | 引入AIOps工具 |

## 容量规划参考

| 模型规模 | GPU需求 | 存储需求 | 网络需求 | 月成本估算 |
|----------|---------|----------|----------|------------|
| 7B推理 | 1x A100 | 50GB SSD | 10Gbps | 2-3万 |
| 70B推理 | 4x A100 | 200GB SSD | 25Gbps | 8-12万 |
| 7B训练 | 8x A100 | 5TB NVMe | 100Gbps | 15-20万 |
| 70B训练 | 64x A100 | 50TB并行存储 | 400Gbps IB | 100-150万 |
| 405B训练 | 512x H100 | 200TB并行存储 | 800Gbps IB | 800万+ |

## 可靠性设计

| 层级 | 故障类型 | 恢复策略 | RTO目标 |
|------|----------|----------|---------|
| 硬件层 | GPU/磁盘故障 | 自动检测+热备替换 | <5min |
| 节点层 | 整机宕机 | 任务迁移+检查点恢复 | <15min |
| 网络层 | 链路中断 | 多路径+自动切换 | <1min |
| 服务层 | 进程崩溃 | 自动重启+流量切换 | <30s |
| 区域层 | 机房故障 | 跨区域切换 | <5min |

## 安全合规要点

| 安全域 | 关键措施 | 合规要求 |
|--------|----------|----------|
| 数据安全 | 加密存储+传输+脱敏 | GDPR/个保法 |
| 访问控制 | RBAC+最小权限+审计 | SOC2/ISO27001 |
| 模型安全 | 模型加密+水印+防窃取 | 商业秘密保护 |
| 供应链安全 | 镜像扫描+依赖审计 | NIST SSDF |
| 网络安全 | 微隔离+WAF+DDoS防护 | 等保2.0 |

## 运维监控体系

| 监控维度 | 关键指标 | 告警阈值 | 工具 |
|----------|----------|----------|------|
| GPU | 利用率/温度/显存 | >90%温度/>95%显存 | DCGM/nvidia-smi |
| 存储 | IOPS/延迟/容量 | >10ms延迟/>80%容量 | Ceph dashboard |
| 网络 | 带宽/丢包/延迟 | >1%丢包/>5us延迟 | Prometheus |
| 服务 | QPS/延迟/错误率 | >1%错误率/P99>2s | Grafana |
| 任务 | 完成率/排队时间 | <90%完成率/>30min排队 | 自定义 |

## 快速自检清单

- [ ] 架构设计满足高可用要求
- [ ] 性能指标达到业务SLA
- [ ] 安全措施覆盖各层级
- [ ] 监控告警体系完善
- [ ] 容灾备份方案已验证
- [ ] 成本优化持续进行
- [ ] 文档和运维手册齐全
