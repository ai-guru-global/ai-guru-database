---
title: "Sandbox 快问快答 50 题"
category: 21_面试岗位
tags: ["面试", "Sandbox", "快问快答", "Docker", "gVisor", "Firecracker", "Kata-Containers", "Wasm", "Agent"]
summary: "Agent Sandbox 岗位面试前冲刺：50 题一问一答速览，覆盖威胁模型、Linux 隔离机制、Docker/gVisor/Kata/Firecracker/WASM 五方案、Agent 沙箱工程与 K8s 运维排障。"
created: 2026-10-22
updated: 2026-10-22
tier: supporting
aliases: [Sandbox 快问快答, 沙箱 50 题, Sandbox 50 QA]
sources: []
name_zh: "Sandbox 快问快答 50 题"
---

# Sandbox 快问快答 50 题 (Agent Sandbox Rapid-Fire Q&A)

> 中文简称：Sandbox 快问快答 50 题

> **一句话理解**: 面试前 30 分钟过一遍的沙箱速答手册——每题一句话口径，主打"问什么都能接得住"。

---

## 使用说明

- 每题先背**粗体口径句**，被追问再展开细节。
- 深度版见 [[21_面试岗位/28_Agent_Runtime工程师/04_Sandbox_隔离技术|04 Sandbox 隔离技术专题]]；gVisor 细节见 [[12_架构基建/10_安全/05_gVisor_常见问题与避坑指南|gVisor 避坑指南]]。
- 覆盖八大类：基础与威胁模型 → Linux 机制 → Docker → gVisor → VM 级 → WASM → Agent 工程 → K8s 运维。

---

## 一、基础与威胁模型（1-6）

**1. Agent 为什么必须沙箱？**
模型生成的代码/命令不可信，等于把执行权交给陌生人；沙箱用来限制爆炸半径（文件、网络、进程、资源）。

**2. Agent 沙箱的威胁模型？**
防"沙箱内代码利用内核/运行时漏洞逃逸、横向移动、破坏宿主"；不防应用逻辑 bug，也不防国家级对抗（那要物理隔离）。

**3. 沙箱设计的核心原则一句话？**
最小权限 + 默认拒绝（deny-by-default）+ 纵深防御，任何单层都假设会被打穿。

**4. Agent 沙箱的生命周期特点？**
会话级：随会话创建/销毁，per-session 独立不共享状态，要求毫秒~秒级冷启动，所以生产都配预热池。

**5. 隔离层次谱系由轻到重？**
语言级（WASM/V8 isolate）→ namespace 容器（Docker）→ 用户态内核（gVisor）→ VM 级（Kata/Firecracker）→ 物理机。

**6. 不做沙箱直接跑用户代码的后果？**
任意文件读写、窃取 API key、内网横向、挖矿、勒索——等于把宿主机权限交给不可信代码。

---

## 二、Linux 隔离机制（7-13）

**7. Namespace 隔离什么？**
视图隔离：pid/mount/net/uts/ipc/user/cgroup 各自独立，让进程只看到自己的进程树、文件系统、网络栈。

**8. Cgroups 管什么？**
资源配额：CPU、内存、pids、IO 上限，防资源耗尽型攻击（挖矿、fork 炸弹）。

**9. Seccomp 是什么？**
syscall 过滤器：用 BPF 规则白名单进程可调的系统调用，常配合 no-new-privileges。

**10. Capabilities 是什么？**
把 root 权限拆成约 40 个细粒度能力，容器默认丢弃大部分（如 CAP_SYS_ADMIN），最小化提权面。

**11. Docker 隔离的本质一句话？**
namespace 给视图、cgroups 给配额、seccomp/capabilities 给权限裁剪——但**共享宿主内核**。

**12. Docker 为什么不算强隔离？**
内核攻击面完整暴露，内核 0day 可直接逃逸；privileged + hostPath 几乎等于宿主 root。

**13. Rootless 容器是什么？**
用 user namespace 把容器内 root 映射为宿主普通用户，即使逃逸拿到也是低权限身份。

---

## 三、Docker 容器沙箱（14-18）

**14. 容器逃逸的常见路径？**
内核漏洞、privileged + hostPath 挂载、docker.sock 泄露挂进容器、危险 capabilities、镜像内 SUID 文件。

**15. Agent 场景 Docker 沙箱必做加固清单？**
非 root 运行、只读 rootfs、drop 全部 capabilities 再按需加、seccomp profile、默认断网 + egress 白名单、CPU/内存/时长限额、tmpfs 临时工作区。

**16. /dev/shm 的经典坑？**
共享内存默认 64MB，PyTorch DataLoader 多 worker 报 `Bus error`——调大 shm 挂载或减 worker 数。

**17. 容器内 PID 1 为什么重要？**
PID 1 负责回收僵尸进程、转发信号；shell 当 PID 1 会吞掉 SIGTERM，导致容器停不下来。

**18. Docker 冷启动多快、瓶颈在哪？**
镜像预热后数百 ms 到秒级，瓶颈在 rootfs 解压和网络栈初始化。

---

## 四、gVisor（19-26）

**19. gVisor 一句话？**
Google 开源的用户态内核：Sentry 进程实现 Linux syscall 兼容层，OCI 运行时叫 runsc，GKE Sandbox / Cloud Run 的底座。

**20. Sentry 和 Gofer 各干什么？**
Sentry 是用户态内核，翻译并实现全部 syscall；Gofer 是独立文件代理进程，以最小权限代为访问真实文件系统。

**21. gVisor 三个平台？**
systrap（默认，用户态陷阱指令）、ptrace（旧默认，每次 syscall 两次停顿最慢）、kvm（每沙箱一个轻量 VM，隔离更强）。

**22. gVisor 性能口径一句话？**
**按 syscall 计费、按计算免费**——伤 IO/进程创建/网络，不伤 GPU/CPU 计算。

**23. gVisor 兼容性痛点？**
syscall 覆盖约 200+ 仍有缺口（部分 ioctl/netlink 返回 ENOSYS）；eBPF/perf/内核模块不可用；privileged 失效。

**24. gVisor 网络为什么慢、限制是什么？**
netstack 用户态协议栈，高 PPS 场景是瓶颈；RDMA/GPUDirect 不可用，所以**多机分布式训练/推理不能放 gVisor**。

**25. gVisor 排障三件套？**
`runsc --strace`（syscall 跟踪）、`runsc debug`（Sentry 内核栈）、`runsc metric-server`（沙箱内视角指标）。

**26. GPU 放 gVisor 注意什么？**
nvproxy 按驱动版本白名单适配，驱动 × gVisor × CUDA 三方对齐；`/dev/shm` 配够；只做单机多卡，不做跨机。

---

## 五、VM 级隔离（27-33）

**27. Kata Containers 一句话？**
每个 Pod 一个轻量 VM，硬件虚拟化隔离 + 几乎完整 Linux 兼容，OCI 运行时形态接 K8s。

**28. Firecracker 一句话？**
AWS 开源 microVM，约 125 ms 启动、约 5MB 内存开销，Lambda 和 Fargate 的底座。

**29. Kata vs Firecracker 怎么区分？**
Kata 面向 K8s Pod 级、OCI 生态无缝；Firecracker 面向 serverless 单租户 microVM，更轻更快但要自建编排层。

**30. microVM 比容器强在哪、弱在哪？**
强在独立客户内核 + 硬件虚拟化边界，内核 0day 也打不穿；弱在启动/资源开销稍高、设备模型精简（如某些 GPU 特性缺失）。

**31. E2B 是什么？**
开源 AI Agent 沙箱平台：Firecracker 底座 + 会话级沙箱 API（创建/执行/回收），用预热池掩盖冷启动，专为 LLM 代码执行设计。

**32. Daytona 是什么？**
开源 Agent 开发环境沙箱：容器/microVM 级隔离 + Agent API，主打秒级拉起开发环境。

**33. GPU 直通谁支持最好？**
Kata/Firecracker 设备直通较成熟；gVisor 靠 nvproxy 白名单且版本敏感；WASM 基本不支持。

---

## 六、WASM（34-39）

**34. WASM 隔离一句话？**
线性内存隔离 + 能力授予：**默认 0 个 syscall**，只有宿主显式注入的 host function 可用，逃逸只能打运行时本身。

**35. WASM vs Docker？**
Docker 全功能但共享内核、攻击面完整；WASM 受限但默认零权限、微秒级启动、MB 级分发，代价是必须重编译。

**36. WASM vs gVisor？**
gVisor 是"给你个假内核让你照常跑"（兼容优先）；WASM 是"没有内核，只开你点名的门"（安全优先）。逃逸都 = 打穿中间那层软件。

**37. WASM Agent 沙箱开源选型？**
Wasmtime（最主流，组件模型）、Extism（嵌入式插件框架）、WasmEdge（CNCF，边缘 + AI 扩展）、runwasi（K8s shim）、Spin/wasmCloud（应用框架）。

**38. WASM 什么时候不适合做 Agent 沙箱？**
要跑现成 Linux 工具链（shell、pip、编译器、动态链接库）时——兼容性扛不住，选容器/microVM。

**39. WASI 是什么？**
WebAssembly System Interface：给 WASM 提供文件/时钟/环境变量等标准能力的接口层；WASI 0.2 基于组件模型，是服务端 WASM 的生态基石。

---

## 七、Agent 沙箱工程（40-46）

**40. 生产级 Agent 沙箱要哪些平台能力？**
会话生命周期管理、文件工作区、网络白名单、资源配额、快照/恢复、预热池、审计日志、监控告警——沙箱本身只是起点，平台化才是岗位价值。

**41. 沙箱网络隔离怎么做？**
默认断网；按需开 egress 白名单代理（域名 + 协议粒度）；禁内网段访问防横向移动。

**42. 文件隔离怎么做？**
只读 rootfs + tmpfs/独立卷工作区；per-session 独立，会话结束即销毁；跨会话互相不可见。

**43. 冷启动怎么优化？**
三层：镜像层预热/本地缓存 → 沙箱池（预先起好待分配）→ snapshot/restore（CRIU / Firecracker 快照恢复到毫秒级）。

**44. 多租户配额怎么做？**
cgroups 限额 + 磁盘 quota + 单会话执行时长 + 并发数上限，超限排队或降级，账单按用量核算。

**45. 假设沙箱被逃逸，兜底设计？**
纵深防御收尾：IAM 最小权限、网络分段、**密钥不进沙箱**（代理代持）、全量审计日志、异常熔断——把逃逸后果压到单会话。

**46. Secrets 怎么交给沙箱内 Agent？**
不直接持有：sidecar/代理代持密钥，沙箱内请求经内部转发注入，日志全链路脱敏，会话结束即吊销。

---

## 八、K8s 集成与运维排障（47-50）

**47. K8s 里怎么用 gVisor/Kata？**
定义 RuntimeClass（handler: runsc/kata），Pod 指定 `runtimeClassName`；containerd 经 shim v2（containerd-shims-runsc-v1 等）对接。

**48. 沙箱节点池运维要点？**
containerd/shim/运行时三方版本对齐、灰度滚动升级、沙箱池与普通池分开调度、node-local 的 daemonset agent 不上沙箱。

**49. 沙箱 Pod 起不来怎么排？**
看 events → RuntimeClass handler 是否注册（`crictl info` / `k get runtimeclass`）→ shim 日志 → `runsc debug` 日志 → 内核版本/平台支持。

**50. 沙箱选型决策一句话？**
可信负载 Docker；不可信多租户 gVisor；VM 级强隔离 Kata/Firecracker；插件式自研工具 WASM——按**代码可信度 × 兼容性需求 × 启动延迟预算**三轴选。

---

## Related

- [[21_面试岗位/28_Agent_Runtime工程师/04_Sandbox_隔离技术|Sandbox 沙箱隔离技术专题（深度版）]]
- [[12_架构基建/10_安全/05_gVisor_常见问题与避坑指南|gVisor 常见问题与避坑指南]]
- [[21_面试岗位/28_Agent_Runtime工程师/03_Agent_Runtime_核心机制|Agent Runtime 核心机制]]
- [[21_面试岗位/28_Agent_Runtime工程师/09_企业级交付_安全|企业级交付与安全]]
- [[15_智能体/20_Agentic_Infra/02_生产环境组件清单|Agentic Infra 生产环境组件清单]]

---

*Last updated: 2026-10-22*
