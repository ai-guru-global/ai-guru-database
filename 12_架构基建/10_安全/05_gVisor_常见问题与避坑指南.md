---
title: "gVisor 常见问题与避坑指南"
category: 12-architecture-infrastructure
subcategory: security
tags: ["security", "gvisor", "sandbox", "container", "runtime", "runsc", "gpu", "inference"]
summary: "gVisor（runsc）高频问题全景：性能开销、syscall 兼容性、网络、GPU/nvproxy 驱动矩阵、overlay2 与 directfs 语义、内存口径、排障方法、K8s 集成与灰度升级，附 runsc 参数速查表。"
created: 2026-10-20
updated: 2026-10-22
tier: supporting
aliases: [gVisor Pitfalls, gVisor 常见问题, runsc 避坑, gVisor 避坑, runsc 参数速查]
sources: []
name_zh: "gVisor 避坑指南"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# gVisor 常见问题与避坑指南

> 中文简称：gVisor 避坑指南

> **一句话理解**: gVisor 用"用户态内核翻译系统调用"换取容器级安全隔离——代价几乎全部落在 IO/网络性能、内核特性兼容和排障复杂度上；计算密集型负载（如 GPU 推理）基本无感。

---

## 目录

- [1. gVisor 30 秒回顾](#1-gvisor-30-秒回顾)
- [2. 问题全景速查表](#2-问题全景速查表)
- [3. 性能开销](#3-性能开销)
- [4. 兼容性问题](#4-兼容性问题)
- [5. 网络问题](#5-网络问题)
- [6. GPU 与 AI 推理场景](#6-gpu-与-ai-推理场景)
- [7. 文件系统与 IO](#7-文件系统与-io)
- [8. 内存问题](#8-内存问题)
- [9. 可观测性与排障](#9-可观测性与排障)
- [10. K8s 集成运维](#10-k8s-集成运维)
- [11. 安全边界与常见误区](#11-安全边界与常见误区)
- [12. 横向对比与选型决策](#12-横向对比与选型决策)
- [13. 面试问答口径](#13-面试问答口径)
- [14. runsc 关键参数速查](#14-runsc-关键参数速查)
- [Related](#related)

---

## 1. gVisor 30 秒回顾

gVisor 是 Google 开源的**应用内核**（application kernel）：一个用 Go 编写的用户态进程 Sentry，实现了 Linux syscall ABI 的兼容层（约 200+ 个系统调用）。它的 OCI 运行时实现叫 `runsc`，对外接口和 runc 完全一致，因此可以无缝接入 Docker/containerd/Kubernetes。

三大组件分工：

| 组件 | 角色 | 关键点 |
|------|------|--------|
| **Sentry** | 用户态内核，翻译并实现全部 syscall | 应用看到的"内核"其实是它；文件、网络、内存管理都在这里 |
| **Gofer** | 独立的文件访问代理进程 | 以最小权限运行，代表 Sentry 访问真实文件系统；与 Sentry 之间走自研的 LISAFS 协议（早期是 9P，已淘汰）；directfs 模式下 Gofer 还会把打开文件的 FD"捐赠"给 Sentry 直接使用，进一步绕开协议转发 |
| **shim** | `containerd-shim-runsc-v1` | 对接 containerd 的 shim v2 API，是 K8s 侧的接入点 |

Sentry 与宿主内核之间有三种**平台**（platform）实现，直接影响性能表现：

| 平台 | 机制 | 适用场景 |
|------|------|----------|
| **systrap**（当前默认） | 用户态陷阱指令触发陷入，无需 ptrace | 通用默认选择，延迟低于 ptrace |
| **ptrace**（旧默认） | 被宿主内核 ptrace 跟踪，每次 syscall 两次停顿 | 兼容性兜底，性能最差 |
| **kvm** | 每个 sandbox 一个轻量虚拟机，Sentry 跑在 guest 态 | 需要更强隔离时；需要嵌套虚拟化支持 |

```mermaid
flowchart LR
    subgraph Pod["gVisor 沙箱（一个 Sentry + 一个 Gofer）"]
        APP["应用进程"] -->|"syscall 拦截"| SENTRY["Sentry<br/>用户态内核"]
        SENTRY -->|"文件请求（LISAFS）"| GOFER["Gofer<br/>文件代理"]
    end
    subgraph Host["宿主机"]
        SENTRY -->|"systrap / kvm 平台接口"| KERNEL["宿主 Linux 内核"]
        GOFER -->|"受限文件系统访问"| KERNEL
        DRV["NVIDIA 驱动<br/>/dev/nvidia*"] -.|"nvproxy 拦截转发"| SENTRY
    end
```

图解：应用的所有系统调用先落入 Sentry（第一层翻译），Sentry 自己完成绝大部分语义，仅在最边界上以受限方式触碰宿主内核；文件路径额外经过 Gofer 一次转发（启用 directfs 后部分路径可绕过）。GPU 场景下，NVIDIA 驱动的 ioctl 由 nvproxy 按白名单转发。

在 K8s 中，gVisor 不改变架构位置，只是把 `[[概念/K8s/oci-runtime|OCI 运行时]]` 从 runc 换成 runsc，并通过 RuntimeClass 按需选择（见[第 10 节](#10-k8s-集成运维)）。

---

## 2. 问题全景速查表

| 类别 | 典型症状 | 根因 | 快速规避 |
|------|----------|------|----------|
| 性能 | syscall 密集负载慢 2~10 倍 | 每次系统调用经过 Sentry 翻译 | 改批处理 IO；选 systrap/kvm 平台 |
| 兼容 | 程序报 `ENOSYS` 或行为异常 | syscall 覆盖不全、内核特性缺失 | 先查官方 Compatibility 列表再上量 |
| 网络 | 吞吐低、高 PPS 场景瓶颈 | 用户态网络栈 netstack | 避免网关/代理类角色；调大 GSO |
| GPU | CUDA 初始化失败、驱动不匹配 | nvproxy 按驱动版本白名单支持 | 锁定 gVisor 支持矩阵内的驱动版本（查询见 6.1） |
| GPU·下载 | 大模型权重下载/解压中途段错误 | 宿主进程 VMA 数耗尽（`vm.max_map_count` 过小） | 调大宿主 `max_map_count`，或 runsc 配 `--host-settings=enforce` |
| 文件 | 小文件随机 IO 慢、mmap 行为差异 | 应用→Sentry→Gofer→内核路径长 | 启用 directfs；大文件顺序读影响小 |
| 文件·可见性 | 宿主侧旁路读不到容器运行期写入 | overlay2 上层由 Sentry 管理，介质可为 tmpfs/私有目录 | exec 进容器读；介质语义见第 7 节 |
| 内存 | 容器内存占用虚高、OOM 判定怪 | Sentry 自带缓存与宿主缓存并存 | 用 gVisor 自有指标监控，勿套用 runc 口径 |
| 观测 | strace/perf/tcpdump 失灵 | 双层内核，传统工具看不到下层 | 用 `runsc debug` / `--strace` / metric-server |
| K8s | 运行时起不来、升级后 Pod 全挂 | shim/runsc/containerd 三方版本错位 | 固定版本矩阵，灰度升级 |

---

## 3. 性能开销

### 3.1 开销来自哪里

- **syscall 拦截与翻译**：每个系统调用都要从应用陷入 Sentry、翻译语义、再以受限方式触碰宿主内核，单次成本是原生路径的数倍到数十倍。
- **上下文切换放大**：ptrace 平台下每次 syscall 有两次宿主级停顿；systrap 已大幅缓解但未消除。
- **进程创建**：fork/exec 在 Sentry 内是纯软件实现，密集 spawn 场景（shell 脚本、Python multiprocessing、编译）明显变慢。

### 3.2 什么负载伤、什么不伤

| 负载类型 | 影响程度 | 原因 |
|----------|----------|------|
| GPU/CPU 计算密集（训练前向、推理 compute） | 几乎无感 | 计算不经过 Sentry，只在边界处付费 |
| 小文件随机 IO、频繁 stat/open | 重伤 | 拦截 + Gofer 转发路径长 |
| 短连接网络、高 QPS RPC 客户端 | 中到重伤 | netstack 用户态收发包 |
| 长 WebSocket/长连接推理服务 | 轻 | 连接建立后收发次数相对少 |
| shell 脚本、进程密集编排 | 重伤 | 进程创建走 Sentry 软件实现 |

**面试口径**：gVisor 的开销模型是"按 syscall 计费、按计算免费"，所以判断一个负载适不适合放 gVisor，先数它的 syscall 频次而不是 CPU 占用。

### 3.3 缓解手段

- 平台选 systrap（默认）或隔离要求更高时用 kvm 平台。
- 文件 IO 启用 directfs（较新版本默认），减少 Gofer 中转。
- 应用层改造：合并小 IO 为批量操作、避免轮询式 stat、复用长连接。
- 静态大目录（模型权重、数据集）用独占 bind mount（`--file-access-mounts=exclusive`）并打开 dentry 缓存，减少挂载重校验（参数见[第 14 节](#14-runsc-关键参数速查)）。
- 对延迟极其敏感的边界服务（网关、代理）不要放沙箱。

---

## 4. 兼容性问题

### 4.1 syscall 覆盖面

Sentry 实现了绝大多数常用 syscall，但不保证 100%。未实现的调用返回 `ENOSYS`，应用要么崩溃要么静默降级——后者更危险，因为问题可能到生产才暴露。

### 4.2 常见跑不起来或行为异常清单

| 软件/特性 | 现象 | 原因 |
|-----------|------|------|
| systemd 完整功能 | 部分单元异常 | cgroup/进程语义由 Sentry 模拟，非完整实现 |
| eBPF 工具（bpftrace、bcc） | 无法运行 | 需要宿主内核 eBPF 子系统，沙箱内不可达 |
| perf / ftrace | 不可用或结果失真 | 看不到 Sentry 层以下的真实执行 |
| 加载内核模块 | 失败 | `init_module` 类操作被拒绝 |
| 依赖特殊 netlink 操作的组件（部分 CNI agent、监控 daemon） | 异常退出 | netlink 覆盖不全 |
| `--privileged` 容器 | 特权能力失效 | 沙箱模型下"特权"只对 Sentry 有意义 |
| 需要 O_DIRECT 严格语义的数据库 | IO 报错或性能异常 | 直 IO 语义与原生内核有差异 |
| block device / hostPath 挂裸设备 | 挂载受限 | 设备访问按白名单受限 |
| 宿主侧 CRIU 等容器 checkpoint 工具 | 不可用 | 进程树在 Sentry 内，宿主 CRIU 冻结不了语义层；用 runsc 自带 checkpoint/restore（见第 10 节） |

### 4.3 排查方法

1. 上量前先在官方 **Compatibility** 页面对照应用的技术栈。
2. 用 `runsc --strace` 观察失败的 syscall 及返回值（用法见[第 9 节](#9-可观测性与排障)）。
3. 打开 debug 日志定位 `ENOSYS`/`EPERM` 的来源。
4. 实在不可行时，评估 Kata Containers 等替代方案（见[第 12 节](#12-横向对比与选型决策)）。

---

## 5. 网络问题

### 5.1 netstack 用户态协议栈

TCP/IP 在 Sentry 内用 Go 实现，吞吐和延迟不如内核原生。软件 GSO/GRO 引入后吞吐已改善数倍，但高 PPS 场景（网关、反向代理、压测发包机）仍是硬瓶颈。还有一个容易忽略的观测坑：**loopback 也跑在 netstack 里**，沙箱内 127.0.0.1 流量在宿主 tcpdump 上抓不到——本地联调时"宿主抓包抓不到请求"先想到这一层。

### 5.2 网络模式与调参

| 模式/参数 | 说明 | 权衡 |
|-----------|------|------|
| `--network=sandbox`（默认） | netstack + 沙箱独立网络栈 | 隔离完整，性能有税 |
| `--network=host` | 直通宿主网络栈 | 性能近原生，但**放弃网络命名空间隔离**，仅限可信负载或临时排障 |
| `--network=none` | 完全断网 | 强隔离场景（纯计算任务） |
| `--qdisc=tbf` | 出口令牌桶限速 | 配套 rate/burst 参数；K8s 下经 `dev.gvisor.flag.*` 注解下发 |
| `--gso=false` | 关闭软件分节加速 | 宿主内核低于 4.14.77 时必须关，否则网络异常 |

### 5.3 对 CNI 与分布式通信的影响

- **CNI 兼容性**：主流 CNI（Calico、Cilium 的标准数据面）可用；依赖 eBPF datapath 加速的特性不可用。相关背景见 [[概念/K8s/cni|CNI]]。
- **NCCL/RDMA 不可用**：GPUDirect RDMA 在沙箱内基本无法工作，**多机分布式训练/张量并行推理不宜放 gVisor**；单机内 NVLink 通信不受影响（走驱动而非网络栈）。

---

## 6. GPU 与 AI 推理场景

这是 gVisor 在 AI Infra 里最实用的场景（单卡推理 + 不受信代码隔离），也是坑最集中的地方。

### 6.1 nvproxy：GPU 支持的机制与约束

gVisor 通过 **nvproxy** 让沙箱使用 GPU：它不把宿主驱动暴露给沙箱，而是把应用发起的 **ioctl 按白名单原样转发**（passthrough，仅少量指针/FD 需要翻译），内核态驱动逻辑仍在宿主执行。这个设计有两个直接推论：

- **性能**：GPU 计算与显存路径不经过 Sentry，nvproxy 本身开销可忽略，推理吞吐与 runc 基本持平。
- **安全边界**：ioctl 白名单 + seccomp 约束挡住了大量攻击面，但**驱动自身的漏洞会穿透**——白名单转发的合法 ioctl 里若携带驱动 bug，照样可达。GPU 沙箱节点的驱动补丁节奏必须与 gVisor 升级绑定管理。

**驱动版本三类状态**（用 `runsc nvproxy list-supported-drivers` 查询当前 gVisor 版本的支持列表）：

| 状态 | 启动行为 | 处置 |
|------|----------|------|
| Supported | 正常启动 | 直接用 |
| Unsupported | 拒绝启动并明确报错 | 升级 gVisor 等适配；确要硬上需显式 `--nvproxy-allow-unsupported-driver`（自担风险） |
| Unknown | 永远拒绝启动 | 新发布驱动在官方确认 ABI 前默认不可用；可 `--nvproxy-driver-version` 强制按指定版本 ABI 处理 |

nvproxy 采用**滚动支持窗口**（跟随 GKE 的驱动分支节奏）：太新的驱动尚未适配、太老的驱动会滑出窗口，所以"驱动版本窗口管理"是 GPU 沙箱节点的日常运维项，而不是一次性检查。

其余硬约束：

- **GPU 型号**：官方支持列表是 T4/A100/A10G/L4/H100（Turing/Ampere/Ada/Hopper 架构）；同代消费级卡大概率可用但不在保障范围。
- **能力白名单**：默认只放 compute + utility 两类驱动能力；需要 CUDA 图形/视频能力时要 `--nvproxy-allowed-driver-capabilities` 显式加白。
- **设备文件**：只暴露 `/dev/nvidiactl`、`/dev/nvidia-uvm`、`/dev/nvidia#`；MIG 所需的 `/dev/nvidia-caps` 不在白名单 → **MIG 分片场景不可用**。
- **平台交互**：cudaMallocManaged（统一内存）在 kvm 平台不稳定，GPU 沙箱统一用 systrap 平台。
- **三方版本对齐**：宿主驱动 × gVisor × CUDA runtime，任一升级都对照支持列表灰度验证；最新 CUDA 特性通常要等 nvproxy 适配后才可用。

### 6.2 /dev/shm、max_map_count 与大模型下载的坑

**坑一：DataLoader `Bus error`。** PyTorch DataLoader 多 worker 报 `Bus error`，根因是共享内存（`/dev/shm` 默认很小）耗尽。这在 runc 下是老问题，在 gVisor 下同样存在且配置方式有差异——挂载更大的 tmpfs 或减少 worker 数。排查入口是先确认报错来自 shm 而不是显存。

**坑二：大模型下载/解压段错误。** 下载大模型权重时要 mmap 大量文件分片，进程 VMA 数顶到宿主 `vm.max_map_count` 上限后直接 SIGSEGV。原生环境同样存在这个问题，但 gVisor 下 Sentry 对 VMA 更敏感，官方把调大该参数列为 GPU 使用前置条件：宿主 sysctl 调大 `vm.max_map_count`，或 runsc 配 `--host-settings=enforce` 让 runsc 自动修正宿主参数（默认仅检查不修改）。

### 6.3 推理服务部署检查清单（vLLM/Triton/TGI 通用）

- [ ] 宿主驱动版本在 gVisor GPU 支持矩阵内（`runsc nvproxy list-supported-drivers` 确认）。
- [ ] 不使用 MIG（`/dev/nvidia-caps` 不在设备白名单，MIG 实例无法暴露）。
- [ ] 宿主 `vm.max_map_count` 已调大（大模型下载防段错误），或 runsc 用 `--host-settings=enforce`。
- [ ] 驱动能力默认只放 compute + utility；需要 CUDA 图形/视频能力时显式加白。
- [ ] 接入方式优先 CDI（containerd ≥ 1.7）或 k8s-device-plugin，不要自己拼环境变量。
- [ ] 单卡或单机内多卡（NVLink/PCIe）部署；**不做跨机分布式**。
- [ ] `/dev/shm` 大小按 DataLoader/推理框架要求配置。
- [ ] 模型加载路径放本地 NVMe，避免沙箱内走网络文件系统（IO 路径叠加）。
- [ ] 监控接 gVisor 自有指标（见第 8、9 节），不要假设 node-exporter 口径可用。
- [ ] 吞吐/延迟基线与 runc 版本对比过，可接受再上线。

### 6.4 什么时候别用 gVisor 跑 GPU

| 场景 | 结论 | 原因 |
|------|------|------|
| 多机张量并行/流水线并行 | 不要用 | RDMA/GPUDirect 不可用 |
| 训练任务（NCCL 频繁集合通信） | 不要用 | 同上 + 进程创建开销 |
| 单卡推理 API 服务 + 不受信代码 | 适合 | 计算无感，隔离收益大 |
| Agent 工具执行沙箱（跑用户代码） | 适合 | 正是 gVisor 的主战场 |

GPU 虚拟化与共享的更大背景见 [[概念/K8s/gpu-virtualization|GPU 虚拟化]] 与 [[概念/K8s/gpu-sharing|GPU 共享]]。

### 6.5 nvproxy 排障入口

- 启动带 `--debug --log-path=...`，CUDA 初始化失败时在日志里搜 `nvproxy: handler is undefined`——出现即说明应用调用了白名单外的 ioctl，典型原因是驱动/CUDA 版本滑出适配窗口。
- 官方 `ioctl_sniffer` 工具可录制应用的完整 ioctl 序列，用于向上游提适配问题。
- 分层排除顺序：宿主 `nvidia-smi` 正常 → 容器内 `nvidia-smi` 失败（nvproxy/设备文件问题）→ CUDA 应用初始化失败（runtime/驱动 ABI 问题）。

---

## 7. 文件系统与 IO

- **IO 路径与 directfs**：应用 → Sentry → 宿主内核。directfs（较新版本默认开启）让 Sentry 直接持有 Gofer 以受限方式"捐赠"的文件 FD，常规路径性能已接近原生；关闭则回退到 LISAFS 协议代理，小文件随机 IO 显著变慢。
- **overlay2 语义与可见性**：容器可写层由 Sentry 管理写时复制，`--overlay2` 可按层选介质（tmpfs/私有目录/指定目录）。排障时别假设宿主能旁路看到运行期写入——进容器 exec 读最可靠；介质与语义的取舍见[第 14 节](#14-runsc-关键参数速查)。
- **bind mount 三种姿势**：默认 shared 模式与宿主实时一致、重校验开销大；静态不变的目录（模型权重、数据集）切 `--file-access-mounts=exclusive` 提速明显，代价是挂载期间宿主不得改动内容。
- **dentry 缓存**：`--dcache` 缓存目录项，减少海量小文件 stat 的反复校验；代价是目录被外部修改后沙箱内有短暂陈旧窗口。
- **EROFS**：镜像层为 EROFS 只读压缩格式时可整层直挂（rootfs 可 gofer-less），冷启动速度和内存占用都改善；额外目录可用 `runsc debug --mount=erofs:...` 动态挂载。
- **mmap 语义差异**：Sentry 自己管理映射与缺页，mmap 一致性、`MAP_SHARED` 行为与原生内核存在细节差异，依赖 mmap 做进程间数据共享的数据库类软件要实测。
- **模型文件加载**：大文件顺序读（safetensors 加载）受影响小，是沙箱推理可行的前提；真正要避开的是海量小文件（如解压后的 tokenizer 词表目录、HuggingFace cache 碎片）——exclusive + dcache + EROFS 三件套基本能追平原生。

---

## 8. 内存问题

- **双份缓存并存**：Sentry 内部有自己的页缓存（应用视角的 page cache），宿主内核又缓存 Sentry 进程的内存。同一份文件数据可能存在两处，容器内存占用比 runc 下虚高。
- **回收不同步**：Sentry 缓存的回收由自己策略决定，与宿主内核的回收互相不可见，可能出现"容器内看着没超限、宿主上内存吃满"的情况。
- **指标口径不同**：cgroup 层面看到的内存是 Sentry 进程的，不是应用视角的；监控要接 gVisor 自带的 metric-server 才能拿到 sandbox 内视角。
- **OOM 行为差异**：OOM 判定在 Sentry 内进行，kill 目标选择和宿主 OOM killer 不完全一致，排查内存杀问题时要看 sandbox 侧日志。
- **限制打在两层**：K8s 的 `resources.limits` 落在 sandbox 的宿主 cgroup 上，约束的是 Sentry + Gofer + 应用进程的总和；应用视角"还能用多少"与 cgroup 口径并不相等，容量阈值要以实测为准。

---

## 9. 可观测性与排障

### 9.1 三分定位法

出问题先切层，别在应用层死磕：

1. **应用层**：sandbox 内日志、退出码、应用自身指标。
2. **Sentry 层**：`runsc` 工具链看 syscall、栈、指标（下表）。
3. **宿主层**：Sentry/Gofer 进程本身的状态、宿主内核日志。

### 9.2 runsc 工具链速查

```bash
# 列出本节点所有 sandbox（含容器内进程视图）# 🟢 — 只读
runsc ps <sandbox-id>

# 跟踪 sandbox 内 syscall（相当于沙箱版 strace）# 🟢 — 只读
runsc --strace exec <sandbox-id> -- <cmd>

# 在运行中的 sandbox 里直接执行命令 # 🔶 — 等效 exec，纳入审计
runsc do <sandbox-id> -- <cmd>

# 抓取 Sentry 内核栈与运行时状态 # 🔶 — 调试态，高负载下有性能影响
runsc debug <sandbox-id>

# 查看指定容器的进程树 # 🟢 — 只读
runsc list

# 启动 metrics 服务，暴露 sandbox 内视角指标 # 🔶 — 常驻服务，注意端口占用
runsc metric-server --addr=:9091
```

排障第一步常是**开 debug 日志**：容器/运行时启动参数加 `--debug --log-path=/tmp/runsc.log`（性能影响大，只排障用）。nvproxy 类问题在日志里搜 `nvproxy: handler is undefined`（见 6.5）。

### 9.3 与传统工具的替代关系

| 传统工具 | gVisor 下的状态 | 替代方案 |
|----------|-----------------|----------|
| strace | 看不到 Sentry 语义层 | `runsc --strace` |
| perf / ftrace | 不可用 | `runsc debug` + Sentry 自身 pprof |
| tcpdump | 沙箱内抓不到真实包 | netstack 日志 + 宿主侧抓包 |
| node-exporter 指标 | 口径失真 | `runsc metric-server` |
| crictl logs/exec | 正常可用 | 无需替代 |

---

## 10. K8s 集成运维

### 10.1 接入链路

containerd 通过 shim v2 API 对接 `containerd-shims-runsc-v1`，集群侧用 RuntimeClass 标记需要沙箱的 Pod：

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc
---
# Pod 侧引用
spec:
  runtimeClassName: gvisor
```

### 10.2 运维要点

- **版本三方对齐**：containerd、shim、runsc 任一升级都可能破坏兼容，固定矩阵、灰度滚动。
- **灰度升级 playbook**：canary 节点池先升 runsc → 用 `runsc metric-server` 对比 IO/内存/延迟基线 → 全量滚动；出问题的回滚手段是把 Pod 的 RuntimeClass 切回 runc 重建。
- **checkpoint/restore**：runsc 自带实现（非 CRIU），支持压缩、零页排除、direct IO、后台恢复等优化，常见用途是冷启动优化；**GPU 状态不支持 checkpoint**——推理容器快照只对纯 CPU 阶段有意义。
- **逐 Pod 传参**：经 OCI 注解 `dev.gvisor.flag.<flag>=<value>` 下发 runsc 参数（如 TBF 限速），需在 containerd CRI 配置把 `dev.gvisor.*` 加入 pod_annotations 白名单。
- **与 Pod Security 的关系**：gVisor 与 [[概念/K8s/pod-security-standards|Pod Security Standards]] 互补而非替代——PSS 管准入策略，gVisor 管运行时隔离。
- **GKE Sandbox**：托管版 gVisor，免运维 shim 层，但同样受 GPU 驱动矩阵约束。
- **节点池隔离**：沙箱节点池与普通节点池分开，避免误调度高敏负载到沙箱节点。
- **daemonset 类组件不要上沙箱**：node-local 的监控/网络 agent 依赖内核特性，跑在普通运行时。

运行时与 CRI 层的完整背景见 [[概念/K8s/cri|CRI]] 与 [[概念/K8s/containerd|containerd]]。

---

## 11. 安全边界与常见误区

- **gVisor 不是虚拟机**：它没有独立客户内核的硬件虚拟化边界；kvm 平台强化了隔离但仍共享宿主内核入口面。要 VM 级强隔离选 Kata/Firecracker。
- **历史逃逸漏洞**：gVisor 官方安全公告记录过多起 sandbox 内提权/逃逸类漏洞（缓冲区溢出、syscall 处理缺陷）。它显著缩小攻击面，但不等于零逃逸，高危多租户场景要叠加纵深防御。
- **必须叠加使用**：gVisor + seccomp + 最小权限 ServiceAccount + 镜像签名，任一单点都不够。供应链侧的镜像与依赖防护见 [[12_架构基建/10_安全/02_容器_and_AI供应链安全_for_AI|容器与供应链安全 for AI]]。
- **威胁模型适配**：gVisor 防的是"容器内代码恶意利用内核漏洞逃逸、横向影响宿主"，不是防"应用逻辑漏洞"本身。
- **真实缓解案例**：宿主内核容器逃逸 CVE-2022-0185、runc 文件描述符泄漏逃逸 CVE-2024-21626 等，在 gVisor 架构下默认不可达——Sentry 根本不把对应的 syscall 路径暴露给应用。
- **GPU 场景的独有边界**：nvproxy 白名单转发的 ioctl 会让 NVIDIA 驱动自身的漏洞穿透沙箱（驱动缺陷类 CVE），GPU 节点必须把驱动升级纳入与 gVisor 升级同一套补丁节奏。
- **逃逸与 CVE 视角**：运行时层历史漏洞的模式对比可参考 [[概念/K8s/runc-cve-history|runc CVE 历史]]，以及 AI 负载相关的 [[12_架构基建/10_安全/03_AI_供应链_CVE_for_AI|AI 供应链 CVE 速查]]。

---

## 12. 横向对比与选型决策

### 12.1 隔离方案对比

| 方案 | 隔离机制 | 性能开销 | 启动速度 | GPU 支持 | 典型场景 |
|------|----------|----------|----------|----------|----------|
| **runc** | namespace + cgroup（共享内核） | 无 | 毫秒 | 原生 | 可信内部负载 |
| **gVisor** | 用户态内核翻译 syscall | IO 伤、计算无感 | 几十毫秒 | nvproxy，有版本矩阵 | 不受信代码、多租户 SaaS |
| **Kata Containers** | 每 Pod 一个轻量 VM | 低（硬件虚拟化） | 数百毫秒 | 直通，较成熟 | 强隔离 + 兼容性要求高 |
| **Firecracker** | microVM | 低 | ~125 ms | 有限 | serverless 底座（Lambda/Fargate） |

### 12.2 决策清单

**适合上 gVisor**：

- 跑不受信代码：Agent 工具沙箱、在线 Jupyter、用户提交代码执行、CI。
- 多租户 SaaS 的租户负载隔离。
- 单卡推理 API + 隔离需求（安全收益 > IO 开销）。
- serverless 容器平台（Google Cloud Run 即 gVisor 底座）。

**不适合**：

- 跨机分布式训练/推理（RDMA 缺失）。
- 网关、代理等 syscall 密集 + 高 PPS 边界服务。
- 依赖 eBPF/perf/内核模块的可观测与安全 agent。
- 对 fork/spawn 延迟敏感的进程密集型任务。

Agent 沙箱在整体架构中的位置见 [[15_智能体/20_Agentic_Infra/02_生产环境组件清单|Agentic Infra 生产环境组件清单]] 与 [[15_智能体/20_Agentic_Infra/01_Agentic_Infra_全景_2026|Agentic Infra 全景]]。

---

## 13. 面试问答口径

**Q1：gVisor 和 runc 的本质区别？**
runc 依赖宿主内核的 namespace/cgroup 做隔离，内核攻击面完整暴露给容器；gVisor 在中间插了一个用户态内核 Sentry，应用只面对约 200+ 个被实现的 syscall，攻击面大幅缩小，代价是 syscall 翻译开销。

**Q2：为什么 gVisor "伤 IO 不伤计算"？**
计算指令不经过任何拦截层，CPU/GPU 全速执行；只有进出沙箱边界的操作（syscall、缺页、IO）才付翻译税。所以选型时先评估负载的 syscall 频次。

**Q3：gVisor 和 Kata 怎么选？**
要兼容性和快启动、威胁模型是"代码不可信但非国家级对抗"选 gVisor；要硬件级隔离、能接受 VM 启动成本和更重的资源占用选 Kata；需要极致密度和秒级弹性（serverless）看 Firecracker。

**Q4：GPU 推理服务放进 gVisor 要注意什么？**
三点：驱动版本必须在 nvproxy 支持矩阵内且三方对齐；`/dev/shm` 按框架要求配置避免 DataLoader `Bus error`；只做单机部署，跨机 NCCL/RDMA 走不通。

**Q5：线上 gVisor 容器 IO 慢怎么排？**
三分定位法：先看应用日志确认 IO 模式（小文件随机读是高危信号），再用 `runsc --strace` 看 syscall 耗时分布，最后看 Sentry/Gofer 进程在宿主侧的状态；确认是否启用 directfs，必要时应用侧合并 IO。

**Q6：nvproxy 为什么能"无损"跑 GPU？安全边界在哪？**
它是 ioctl 白名单的 passthrough 转发：计算和显存路径不经过 Sentry，所以吞吐与 runc 基本持平；边界是白名单挡住非法调用，但驱动自身漏洞可穿透——GPU 节点的驱动补丁节奏必须和 gVisor 升级绑定。

**Q7：宿主侧为什么看不到容器运行期写入的文件？**
可写层由 Sentry 管理 overlay 写时复制，介质可能是 tmpfs 或 sandbox 私有目录，宿主旁路观察不到完整语义；要旁路读取就换介质，但那是拿性能换可见性，日常用 exec 进容器读。

**Q8：runsc 支持 checkpoint/restore 吗？**
自带实现（不是 CRIU），支持压缩、零页排除、后台恢复等优化，常用来做冷启动优化；但 GPU 状态不支持快照，推理容器只能快照纯 CPU 阶段。

**Q9：大模型权重目录在 gVisor 下怎么挂最快？**
静态不变目录用 `--file-access-mounts=exclusive` 独占挂载 + 打开 dentry 缓存，镜像层走 EROFS 直挂；避开默认 shared 模式的实时一致性重校验，基本能追平原生。

**Q10：一个负载要不要上 gVisor，五分钟怎么判断？**
数它的 syscall 形态：小文件随机 IO 多不多、短连接高 PPS 多不多、fork/spawn 密不密、要不要 RDMA/eBPF/MIG——占任何一条就绕行或接受性能税；纯计算的单机推理、跑不受信代码，放心上。

---

## 14. runsc 关键参数速查

### 14.1 高频参数速查表

排障与调参时按这张表对症下药；逐 Pod 下发用 OCI 注解 `dev.gvisor.flag.*`（见第 10 节）。

| 参数 | 取值 | 作用 | 代价/注意 |
|------|------|------|-----------|
| `--platform` | systrap（默认）/ kvm / ptrace | syscall 陷入机制 | kvm 需嵌套虚拟化；cudaMallocManaged 在 kvm 下不稳 |
| `--network` | sandbox（默认）/ host / none | 网络栈选择 | host 换性能丢隔离；none 全断网 |
| `--qdisc` | fifo（默认）/ tbf | 出口令牌桶限速 | 配套 rate/burst 子参数 |
| `--gso` | true（默认）/ false | 软件分节加速 | 宿主内核 < 4.14.77 必须关 |
| `--nvproxy` | 开关 | 启用 GPU ioctl 白名单转发 | 驱动须在支持矩阵；配套 `--nvproxy-allow-unsupported-driver`、`--nvproxy-driver-version`、`--nvproxy-allowed-driver-capabilities` |
| `--overlay2` | 按层选介质（tmpfs/私有目录/指定目录） | 镜像可写层写时复制介质 | 提速介质通常牺牲宿主可见性 |
| `--file-access` | exclusive / shared | 根文件系统访问模式 | 同 Pod 多容器共享镜像需 shared；exclusive 更快 |
| `--file-access-mounts` | shared（默认）/ exclusive | bind mount 访问模式 | 静态权重目录切 exclusive 显著提速，挂载期间宿主不得改动 |
| `--dcache` | 开关 + 策略 | dentry 缓存，减少 stat 重校验 | 外部改目录后有陈旧窗口 |
| `--directfs` | true（较新版本默认）/ false | Sentry 直连底层文件系统 | 关闭回退 LISAFS 代理，小文件 IO 变慢 |
| `--host-settings` | check（默认）/ enforce | 宿主参数（如 `max_map_count`）校验/自动修正 | enforce 需要足够权限 |
| `--debug` / `--strace` | 开关 | debug 日志 / syscall 跟踪 | 只排障时开，性能影响大 |

### 14.2 containerd 侧接入配置

```toml
# /etc/containerd/config.toml 片段 # 🔶 — 修改后 systemctl restart containerd
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runsc]
  runtime_type = "io.containerd.runsc.v1"
```

K8s 侧 Pod 引用 RuntimeClass 的方式见[第 10 节](#10-k8s-集成运维)；GPU 节点在此基础上叠加 nvproxy 参数与设备插件（见 6.1、6.3）。

---

## Related

- [[概念/K8s/oci-runtime|OCI Runtime]]
- [[概念/K8s/containerd|containerd]]
- [[概念/K8s/gpu-virtualization|GPU 虚拟化]]
- [[12_架构基建/10_安全/02_容器_and_AI供应链安全_for_AI|容器与供应链安全 for AI]]
- [[12_架构基建/10_安全/03_AI_供应链_CVE_for_AI|AI 供应链 CVE 速查]]
- [[15_智能体/20_Agentic_Infra/02_生产环境组件清单|Agentic Infra 生产环境组件清单]]

---

*Last updated: 2026-10-22*
