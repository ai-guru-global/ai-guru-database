---
title: "工单智能体远程诊断知识枢纽"
tags: [synthesis, work-order, diagnosis, remote-support, kubernetes, hub, agent-corpus, decision-tree]
type: synthesis
created: 2026-07-01
tier: core
aliases:
  - "工单诊断枢纽"
  - "Ticket Diagnosis Hub"
  - "远程诊断入口"

---
# 工单智能体远程诊断知识枢纽

> **核心定位**：本页是阿里云专有云 K8s 工单智能体的**远程诊断知识入口**。智能体收到工单后，应从本页出发，按现象分类进入对应的诊断决策树，通过引导用户验证（而非直接执行）给出排查建议。

---

## 诊断路由总表

| 工单大类 | 进入哪个决策树 | 典型现象 |
|---------|-------------|---------|
| **Pod 故障** | [[diagnosis-k8s-pod-failure]] | Pending / CrashLoopBackOff / ImagePullBackOff / OOMKilled |
| **网络问题** | [[diagnosis-k8s-network-failure]] | 连不上 / DNS 不解析 / 访问超时 / Ingress 502 |
| **存储故障** | [[diagnosis-k8s-storage-failure]] | PVC Pending / 卷挂载失败 / 只读文件系统 / RWO 冲突 |
| **GPU/AI 工作负载** | [[diagnosis-gpu-ai-workload-failure]] | CUDA OOM / 训练 Hang / 推理慢 / GPU 不可见 / 掉卡 |
| **节点问题** | [[diagnosis-k8s-pod-failure#§6 Evicted — 节点驱逐]] | NotReady / Evicted / 磁盘压力 |
| **控制平面** | [[Kubernetes_Core_Components_Deep_Dive]] | apiserver 慢 / etcd 问题 / 调度器异常 |

---

## 远程诊断标准流程

```
收到工单
│
├── 1. 分类：工单属于哪个大类？（参见上表）
│
├── 2. 进入对应诊断决策树
│   └── 按决策树的「诊断入口」确定具体子类
│
├── 3. 提出澄清问题
│   └── 每个决策树节点的「远程应问」段
│
├── 4. 给出根因假设排序
│   └── 按「根因排序表」给出最可能的 2-3 个原因
│
├── 5. 指导用户验证
│   └── 给出用户可自行执行的验证命令（标注安全等级）
│
├── 6. 给出处置建议
│   └── 标注风险等级，高危操作建议走变更流程
│
└── 7. 信息不足时
    └── 明确告知需要补充什么信息，不猜测
```

---

## 专有云上下文

所有诊断建议都应结合阿里云专有云环境：

- 产品形态：ACK 专有版 / 敏捷版（非 ACK 托管版）
- 运维体系：天基（部署托管）、ASCM（控制台）、洛神（网络）、盘古（存储）
- GPU 虚拟化：[[HAMi_Deep_Dive|HAMi]]（CNCF Sandbox）
- AI Stack：[[AI_Stack_Deep_Dive|阿里云 AI Stack 软硬一体机]]

详见 [[Alibaba_Cloud_Proprietary_K8s_Context]]。

---

## 关键 Runbook 索引

| Runbook | 覆盖场景 |
|---------|---------|
| [[Kubernetes_Troubleshooting_Playbook]] | K8s 通用排障（Pod/节点/网络/存储/调度/控制平面） |
| [[GPU_OOM_Troubleshooting_Guide]] | GPU OOM 四类区分与修复阶梯 |
| [[LLM_Inference_Slow_Unavailable_Runbook]] | LLM 推理延迟/不可用分层排障 |
| [[Distributed_Training_Hang_Runbook]] | 分布式训练 NCCL/RDMA Hang 排障 |
| [[LLM_Fine_Tuning_Job_Failure_Runbook_on_K8s]] | LLM 微调失败（NaN/OOM/数据格式） |
| [[Model_Hot_Reload_and_Rollback_Runbook]] | 模型热加载/回滚 |
| [[HAMi_Troubleshooting_Guide]] | HAMi GPU 虚拟化排障 |
| [[K8s_AI_Troubleshooting_Cheat_Sheet]] | AI 工作负载排障速查表 |

---

## 安全护栏分级

| 等级 | 定义 | 远程建议方式 |
|------|------|------------|
| 🟢 只读 | 查看类操作（describe/logs/top/exec 查询） | 直接建议用户执行 |
| 🟡 低危 | 重启 Pod / rollout restart / 调整非破坏性参数 | 确认影响范围后建议执行 |
| 🟠 中危 | 扩缩容 / 调整资源配额 / 修改 PVC | 建议在测试验证后执行 |
| 🔴 高危 | 删除资源 / 修改安全策略 / 节点操作 / 驱动更新 | 强烈建议走正式变更流程 |

---

## Related

- [[diagnosis-k8s-pod-failure]] — Pod 故障诊断决策树
- [[diagnosis-k8s-network-failure]] — 网络故障诊断决策树
- [[diagnosis-k8s-storage-failure]] — 存储故障诊断决策树
- [[diagnosis-gpu-ai-workload-failure]] — GPU/AI 工作负载诊断决策树
- [[Alibaba_Cloud_Proprietary_K8s_Context]] — 专有云 K8s 上下文
- [[Kubernetes_Troubleshooting_Playbook]] — K8s 排障手册
- [[K8s_AI_Troubleshooting_Cheat_Sheet]] — 排障速查表
- [[Cloud_Product_Ops_2026]] — 云产品运维 Agent 体系
