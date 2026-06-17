---
title: "HAMi × CDI × DRA: 异构 GPU 共享与设备注入的协作关系"
category: synthesis
tags: ["hami", "cdi", "dra", "gpu-virtualization", "kubernetes", "heterogeneous-computing", "synthesis"]
sources:
  - "12_Architecture_Infrastructure/HAMi_Deep_Dive"
  - "12_Architecture_Infrastructure/CDI_Deep_Dive"
  - "12_Architecture_Infrastructure/DRA_Deep_Dive"
  - "concepts/hami"
  - "concepts/cdi"
  - "concepts/dra"
created: 2026-06-16
updated: 2026-06-16
summary: "厘清 HAMi、CDI、DRA 三者在 Kubernetes 异构 GPU 共享中的分层关系：HAMi 负责资源切分与隔离，DRA 负责调度器参与的分配，CDI 负责把最终设备规范注入容器。"
provenance:
  extracted: 0.6
  inferred: 0.35
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-16
---

# HAMi × CDI × DRA: 异构 GPU 共享与设备注入的协作关系

## The Connection

在 Kubernetes 上运行 AI 工作负载时，有三类问题经常被混在一起讨论：

1. **怎么把一块 GPU 分给多个 Pod 用？** → 这是 **HAMi** 解决的问题。
2. **调度器怎么知道该把哪块卡给谁？** → 这是 **DRA** 解决的问题。
3. **容器运行时怎么把卡真正塞进容器？** → 这是 **CDI** 解决的问题。

三者不是替代关系，而是**从资源虚拟化到调度决策再到设备注入的完整链条**。

---

## Where They Co-occur

| 场景 | 三者如何协作 |
|------|-------------|
| **多租户推理平台** | HAMi 把 A100 切成 vGPU → DRA（或 Device Plugin）决定哪个租户拿哪块切片 → CDI 把切片注入 vLLM 容器 |
| **国产芯片混部** | HAMi 统一纳管昇腾/寒武纪/海光 → DRA 按芯片属性匹配任务 → CDI 按厂商规范注入驱动库和设备节点 |
| **动态 MIG 共享** | HAMi 管理 MIG mixed 模式下的实例 → DRA 拓扑感知选择 NVLink 亲和切片 → CDI 注入具体 MIG 设备 |
| **边缘单卡多服务** | HAMi 把边缘 GPU 切分给多个轻量模型 → Device Plugin 计数分配 → CDI 完成环境变量与库注入 |

---

## Cross-cutting Insight

### 分层模型

```
┌─────────────────────────────────────────────────────────────┐
│                    应用层 (vLLM / TGI / 训练框架)             │
├─────────────────────────────────────────────────────────────┤
│  资源虚拟化层 │  HAMi：GPU/NPU/MLU 切分、显存/算力隔离       │
├─────────────────────────────────────────────────────────────┤
│  分配决策层  │  DRA（新）：调度器内属性/拓扑感知分配          │
│             │  Device Plugin（旧）：整数计数分配             │
├─────────────────────────────────────────────────────────────┤
│  设备注入层  │  CDI：把设备规范翻译成容器 edits              │
├─────────────────────────────────────────────────────────────┤
│  运行时层   │  containerd / CRI-O / nvidia-container-runtime │
└─────────────────────────────────────────────────────────────┘
```

### 关键结论

- **HAMi 不替代 CDI**：HAMi 决定切多少、怎么隔离；CDI 决定切出来的 vGPU 怎么挂载到容器。
- **HAMi 不替代 DRA**：HAMi 可以在 Device Plugin 模式（外部 Scheduler Extender）或 DRA 模式（原生 scheduler 参与）下运行。
- **CDI 是公共地基**：无论上层用 Device Plugin、DRA 还是 HAMi，最终都要把设备描述翻译成 CDI spec。

### 选型组合

| 组合 | 适用场景 |
|------|---------|
| **HAMi + Device Plugin + CDI** | 稳定兼容旧集群，快速落地 vGPU 共享 |
| **HAMi + DRA + CDI** | K8s 1.34+ 新集群，需要拓扑感知与原生调度 |
| **NVIDIA GPU Operator + HAMi + CDI** | 需要 Operator 管理驱动/MIG，HAMi 负责共享调度 |

---

## Practical Implications

1. **不要只装 HAMi 就以为万事大吉**：还需要确保 containerd 开启 CDI、节点驱动正确、CDI spec 已生成。
2. **升级路径**：旧集群先用 HAMi Device Plugin 模式 + CDI；新集群逐步迁移到 HAMi DRA 模式。
3. **排错要分层**：Pod Pending 先看 HAMi scheduler，设备注入失败先看 CDI spec，调度决策异常先看 DRA 驱动日志。

---

## Related

- [[12_Architecture_Infrastructure/HAMi_Deep_Dive]] — HAMi 深度解析
- [[12_Architecture_Infrastructure/CDI_Deep_Dive]] — CDI 容器设备接口标准
- [[12_Architecture_Infrastructure/DRA_Deep_Dive]] — DRA 动态资源分配
- [[concepts/hami]] — HAMi 概念卡片
- [[concepts/cdi]] — CDI 概念卡片
- [[concepts/dra]] — DRA 概念卡片
