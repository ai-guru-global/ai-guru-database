---
title: 阿里云专有云 (Alibaba Cloud Proprietary)
category: 架构基建/Alibaba_Cloud
tags: [alibaba-cloud, proprietary-cloud, k8s, astack, ack]
summary: 阿里云专有云（Apsara Stack）环境下的 AI 基础设施实践，包括 ACK、ASCM、天基平台和 GPU 运维。
---

# 阿里云专有云 (Alibaba Cloud Proprietary)

本目录收录阿里云专有云环境下的 AI 基础设施文档，面向专有云工单智能体和运维场景。

## 内容导航

| 文档 | 说明 | 适用读者 |
|------|------|---------|
| [[Alibaba_Cloud_Proprietary_K8s_Context]] | 专有云 K8s 上下文：ACK 架构、ASCM 权限、天基部署、GPU 调度 | 专有云 SRE、工单工程师 |

## 专有云关键组件

```
阿里云专有云 (Apsara Stack)
├── 天基 (Tianji) — 部署编排平台
├── ASCM — 安全云管理 (权限/审计)
├── ACK (Container Service for K8s)
│   ├── 专有版 — Master 自管
│   ├── 托管版 — Master 托管
│   └── Serverless — 弹性容器实例
├── GPU 调度
│   ├── HAMi — GPU 共享/虚拟化
│   ├── cGPU — 容器级 GPU 隔离
│   └── GPUShare — 共享调度
└── 存储
    ├── NAS — 文件存储
    ├── OSS — 对象存储
    └── CPFS — 并行文件系统 (AI 训练)
```

## Related

- [[../AI_Stack/|阿里云 AI Stack 工具链]]
- [[../Hardware_Compute/HAMi_Deep_Dive|HAMi GPU 虚拟化]]
- [[../../运维/Troubleshooting/K8s_Troubleshooting_Playbook|K8s 排障手册]]
- [[../Architecture_Overview/System_Architecture|系统架构]]
