---
title: "AI 工作负载 GPU 故障远程诊断决策树"
tags: [synthesis, kubernetes, troubleshooting, gpu, ai-workload, diagnosis, work-order, remote-support, decision-tree, oom, hami]
type: synthesis
created: 2026-07-01
tier: core
aliases:
  - "GPU Failure Diagnosis"
  - "GPU 故障诊断"
  - "AI 工作负载排障"
  - "CUDA OOM 诊断"
sources: []

name_zh: "AI 工作负载 GPU 故障远程诊断决策树"
---
# AI 工作负载 GPU 故障远程诊断决策树

> 中文简称：AI 工作负载 GPU 故障远程诊断决策树

> **核心洞察**：AI/LLM 工作负载在 K8s 上的 GPU 工单是专有云最高价值的排障场景。远程诊断的关键是**先分清四类 OOM**（host OOM / container OOM / CUDA OOM / HAMi vGPU 超卖），再按训练/推理不同路径深入。GPU 问题 70% 可通过 `nvidia-smi` + Pod Events 定位。

---

## 诊断入口：GPU 问题的现象是什么？

```
用户报告 "GPU/AI 工作负载异常"
│
├── 训练任务失败
│   ├── CUDA OOM → 参见 §1
│   ├── 训练 Hang（卡住不推进） → 参见 §2
│   ├── NaN Loss / 训练发散 → 参见 §3
│   └── Checkpoint 保存失败 → 参见 §4
│
├── 推理服务异常
│   ├── 推理延迟飙升 → 参见 §5
│   ├── 模型加载失败 → 参见 §6
│   └── 推理服务 OOM → 参见 §1
│
├── GPU 节点级问题
│   ├── GPU 不可见（nvidia-smi 找不到） → 参见 §7
│   ├── GPU 掉卡 / ECC 错误 → 参见 §8
│   └── HAMi vGPU 问题 → 参见 §9
│
└── 国产芯片（昇腾 NPU 等）
    └── → 参见 §10
```

---

## §1 CUDA OOM — GPU 显存不足

**远程应问**：
1. 错误信息是 `CUDA out of memory` 还是 `RuntimeError: CUDA error`？
2. Batch size 多大？模型多大（参数量）？
3. 是首次启动就 OOM，还是训练中途 OOM？
4. GPU 型号和显存？（A100 80G / H100 80G / 国产卡）

**四类 OOM 区分（关键！）**：

| OOM 类型 | 错误特征 | 根因 | 验证方法 | 处置建议 |
|---------|---------|------|---------|---------|
| **Host OOM** | Pod 状态 OOMKilled (Exit 137) | 系统/容器内存超限 | `kubectl top pod` | 调大 Pod memory limit |
| **Container OOM** | `containerd: OOM killer` | cgroup memory 限制 | 检查 resources.limits.memory | 同上 |
| **CUDA OOM** | `CUDA out of memory` | GPU 显存不足 | `nvidia-smi` 查看显存占用 | 减小 batch size / 启用梯度累积 |
| **HAMi vGPU 超卖** | CUDA OOM 但实际显存够 | HAMi 分配的 vGPU 显存不足 | 检查 HAMi 注解 `hami.io/vgpu-memory` | 调整 HAMi 显存配额 |

**远程指导步骤**：
1. 让用户执行 `nvidia-smi`（在 GPU Pod 内或节点上）
2. 确认显存占用 vs 显存总量
3. 如果显存确实不足：
   - 减小 batch size（最直接）
   - 启用 [[概念/gradient-checkpointing]]（用计算换显存）
   - 减小模型精度（FP16 → INT8）
   - 使用 LoRA/QLoRA 减少可训练参数
4. 如果是 HAMi 环境且显存看起来够但报 OOM → 参见 §9

参见 [[GPU_OOM_Troubleshooting_Guide]]、[[概念/gpu-oom]]、[[概念/gradient-checkpointing]]。

---

## §2 训练 Hang — 分布式训练卡住

**远程应问**：
1. 所有 rank 都卡住，还是只有部分 rank？
2. 最后一条日志是什么时间？
3. 训练框架是什么？（DeepSpeed / FSDP / Megatron / TorchRun）
4. 网络是 RDMA (InfiniBand/RoCE) 还是 TCP？

**分层诊断**：

| 层 | 验证方法 | 如果异常 |
|----|---------|---------|
| GPU 层 | `nvidia-smi` 查看 GPU 利用率 | 利用率 0% = 进程没在计算 |
| 进程层 | 在 Pod 内 `ps aux \| grep python` | 进程是否存活 |
| NCCL 层 | 设置 `NCCL_DEBUG=INFO` 查看日志 | 卡在 NCCL init / allreduce |
| 网络层 | 检查 RDMA/IB 状态 | 见下表 |
| 存储层 | 检查数据加载是否在等 IO | DataLoader 卡住 |

**NCCL/网络诊断**：

```
训练 Hang
│
├── NCCL 初始化卡住
│   ├── 检查 NCCL_DEBUG=INFO 日志
│   ├── 验证节点间网络: ping / ib_write_bw
│   ├── 检查 [[概念/nccl]] 环境变量
│   └── 常见: NCCL_SOCKET_IFNAME 未设置正确接口
│
├── AllReduce 卡住
│   ├── 某个 rank 掉线 → 检查该节点 GPU/网络
│   ├── 网络分区 → 检查交换机/RDMA 配置
│   └── 参见 [[概念/infiniBand]]、[[概念/rdma-roce]]
│
├── Data Loading 卡住
│   ├── 存储读写慢 → 检查存储 IO
│   ├── DataLoader workers=0 串行 → 增加 num_workers
│   └── 数据预处理瓶颈 → 增加 prefetch
│
└── Python GIL / 死锁
    └── → 分析 py-spy dump 输出
```

参见 [[07_模型训练/04_分布式训练/04_分布式训练_Hang_操作手册]]、[[概念/nccl]]、[[概念/infiniBand]]、[[概念/nvlink]]、[[概念/rdma-roce]]。

---

## §3 NaN Loss — 训练发散

**远程应问**：
1. Loss 从第几个 epoch/step 开始变成 NaN？
2. 学习率是多少？是否使用了 warmup？
3. 混合精度训练（FP16/BF16）是否启用？
4. 梯度裁剪（gradient clipping）是否配置？

**根因决策**：

| NaN 出现时机 | 可能根因 | 处置建议 |
|------------|---------|---------|
| 训练一开始就 NaN | 数据中有异常值（inf/NaN） | 检查数据预处理 |
| 前几个 step | 学习率过大 | 降低学习率或增加 warmup steps |
| 训练中途突然 NaN | 梯度爆炸 | 启用梯度裁剪 max_grad_norm=1.0 |
| 混合精度下 NaN | FP16 溢出 | 改用 BF16 或调整 loss scaling |
| 特定 batch 后 | 数据中有极端值 | 添加数据校验 |

参见 [[Model_Troubleshooting_Guide]]、[[概念/gradient-checkpointing]]。

---

## §4 Checkpoint 保存失败

**远程应问**：
1. 错误是 `No space left on device` 还是权限问题？
2. 存储类型？（本地盘 / NAS / OSS）
3. 多 GPU 保存时是否所有 rank 都在写？

**根因决策**：

| 错误 | 根因 | 处置建议 |
|------|------|---------|
| 磁盘空间不足 | Checkpoint 文件过大 | 清理旧 checkpoint 或用分布式存储 |
| 权限拒绝 | fsGroup / SecurityContext | 调整存储权限 |
| 保存超时 | 存储写入慢或网络问题 | 检查存储 IO 性能 |
| 多 rank 冲突 | 所有 rank 同时写 | 只让 rank 0 保存 |
| OOM 保存中 | 保存时显存峰值超限 | 启用 `save_only_model=True` 减少内存 |

参见 [[10_部署推理/01_部署基础/08_模型_Hot_Reload_and_回滚_操作手册]]、[[概念/model-rollback]]。

---

## §5 推理延迟飙升

**远程应问**：
1. TTFT（首 Token 延迟）和 TPOT（每 Token 延迟）分别多少？
2. 是突然变慢还是逐渐变慢？
3. 并发量是否有变化？
4. 推理引擎是什么？（vLLM / SGLang / TGI / TensorRT-LLM）

**分层诊断**：

```
推理延迟飙升
│
├── GPU 层
│   ├── GPU 利用率异常低 → 批处理/调度问题
│   ├── GPU 利用率异常高 → 确实过载
│   ├── 显存碎片化 → 重启推理服务
│   └── 热节流（温度过高）→ 检查散热
│
├── 引擎层
│   ├── KV Cache 不足 → 调大 gpu_memory_utilization
│   ├── 批处理策略 → 检查 max_batch_size / continuous batching
│   ├── 量化精度影响 → 评估量化质量损失
│   └── 参见 [[13_运维/02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册]]
│
├── 网络层
│   ├── Ingress/SLB 延迟 → 检查负载均衡
│   ├── 模型权重加载慢 → 预热或本地缓存
│   └── 专有云网络波动 → 参见 [[12_架构基建/06_云厂商/Alibaba_Cloud/专有云/03_阿里云_专有云_K8s_上下文]]
│
└── 缓存层
    ├── Prompt 缓存未命中 → 检查缓存策略
    └── 参见 [[13_运维/02_SRE与可靠性/18_LLM推理_SLO_指南]]
```

参见 [[13_运维/02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册]]、[[13_运维/02_SRE与可靠性/18_LLM推理_SLO_指南]]、[[概念/retrieval-latency]]。

---

## §6 模型加载失败

**远程应问**：
1. 错误是 `safetensors` / `pytorch_model.bin` 格式问题？
2. 权重文件路径是否可达？（PVC/NAS/OSS）
3. 模型配置（config.json）是否与权重匹配？
4. 如果用 LoRA：基础模型路径是否正确？

**根因决策**：

| 错误 | 根因 | 处置建议 |
|------|------|---------|
| `FileNotFoundError` | 权重路径不对 | 检查挂载路径和文件名 |
| `shape mismatch` | 模型架构不匹配 | 确认 config.json 与权重一致 |
| `out of memory` (加载时) | 模型太大 + 加载策略不当 | 使用量化加载（4bit/8bit） |
| `safetensors` 格式错误 | 文件损坏或不完整 | 重新下载/检查文件完整性 |
| `tokenizer` 错误 | tokenizer 与模型不匹配 | 确认使用配套 tokenizer |

参见 [[10_部署推理/01_部署基础/08_模型_Hot_Reload_and_回滚_操作手册]]、[[概念/model-rollback]]。

---

## §7 GPU 不可见

**远程应问**：
1. 在 Pod 内执行 `nvidia-smi` 是否有输出？
2. `kubectl describe pod <name>` 的资源请求中是否有 `nvidia.com/gpu`？
3. 节点上 `nvidia-smi` 是否正常？

**根因决策**：

| 现象 | 根因 | 处置建议 |
|------|------|---------|
| `nvidia-smi: command not found` | GPU 驱动未安装/未挂载 | 检查 NVIDIA Device Plugin |
| `nvidia-smi` 正常但 Pod 内不可见 | 资源请求未声明 GPU | 添加 `resources.limits.nvidia.com/gpu` |
| Device Plugin 未运行 | kube-system 中 nvidia-device-plugin Pod 异常 | 重启 Device Plugin |
| 节点上也不可见 | GPU 驱动故障或掉卡 | 参见 §8 |
| HAMi 环境下不可见 | HAMi 调度问题 | 参见 §9 |

参见 [[HAMi_Troubleshooting_Guide]]、[[概念/gpu]]、[[概念/nvidia-smi]]、[[概念/nvidia-gpu]]。

---

## §8 GPU 掉卡 / ECC 错误

**远程应问**：
1. `nvidia-smi -q` 中 ECC 错误计数是否增长？
2. `dmesg \| grep -i nvidia` 是否有 Xid 错误？
3. GPU 温度是否异常？

**Xid 错误速查**：

| Xid | 含义 | 严重程度 | 处置 |
|-----|------|---------|------|
| Xid 13 | 致命错误，GPU 掉卡 | 🔴 严重 | 重启节点或联系硬件团队 |
| Xid 31 | 内存页错误 | 🔴 严重 | 重启节点 |
| Xid 43 | 停止响应 | 🔴 严重 | 检查驱动版本，重启 |
| Xid 45 | 抢占完成 | 🟡 正常 | 无需处理 |
| Xid 63 | ECC 双比特错误 | 🔴 严重 | GPU 硬件故障，联系硬件团队 |
| Xid 79 | 内存不足 | 🟡 可恢复 | 降低工作负载 |

参见 [[GPU_OOM_Troubleshooting_Guide]]、[[概念/gpu]]。

---

## §9 HAMi vGPU 问题

**远程应问**：
1. HAMi 版本？`kubectl get pods -n kube-system | grep hami`
2. Pod 注解中的 vGPU 配置？`kubectl get pod <name> -o yaml | grep hami`
3. `hami.io/vgpu-memory` 和实际需求是否匹配？

**常见 HAMi 工单**：

| 现象 | 根因 | 处置建议 |
|------|------|---------|
| CUDA OOM 但 `nvidia-smi` 显存够 | vGPU 显存配额不足 | 调大 hami.io/vgpu-memory 注解 |
| Pod 卡在 Pending | GPU 资源不足或调度策略 | 检查 HAMi 调度器日志 |
| vGPU 设备不出现 | HAMi Device Plugin 异常 | 检查 hami-device-plugin Pod |
| 计算正确但慢 | vGPU 时间片不足 | 调大 hami.io/vgpu-core 注解 |
| 多 Pod GPU 隔离问题 | HAMi 隔离配置 | 参见 [[HAMi_Troubleshooting_Guide]] |

参见 [[HAMi_Troubleshooting_Guide]]、[[12_架构基建/03_AI技术栈/11_HAMi_深入分析]]、[[概念/gpu-sharing]]、[[概念/mig]]、[[概念/time-slicing]]。

---

## §10 国产芯片（昇腾 NPU 等）

**远程应问**：
1. 芯片型号？（昇腾 910/310 / 寒武纪 / 海光 DCU / 摩尔线程）
2. 推理框架？（MindIE / CANN / vLLM-Ascend）
3. `npu-smi info`（昇腾）输出是否正常？

**昇腾特有问题**：

| 现象 | 根因 | 处置建议 |
|------|------|---------|
| NPU 不可见 | Device Plugin 未安装 | 检查 ascend-device-plugin |
| CANN 版本不匹配 | 驱动与固件版本不一致 | 对齐 CANN/驱动/固件版本 |
| 推理精度下降 | 芯片精度差异 | 检查量化配置 |
| 内存映射失败 | NPU 内存管理差异 | 参见 [[10_部署推理/05_硬件与算力/02_Ascend_NPU_推理_指南]] |

参见 [[10_部署推理/05_硬件与算力/02_Ascend_NPU_推理_指南]]、[[概念/ascend-npu]]、[[概念/cann]]、[[概念/mindie]]、[[12_架构基建/07_硬件与算力/05_chinese_chips_inference]]。

---

## GPU 诊断命令速查

| 目的 | 命令 | 安全等级 |
|------|------|---------|
| GPU 状态 | `nvidia-smi` | 🟢 只读 |
| GPU 详细信息 | `nvidia-smi -q` | 🟢 只读 |
| 监控循环 | `watch -n 1 nvidia-smi` | 🟢 只读 |
| ECC 错误 | `nvidia-smi -q \| grep -A5 ECC` | 🟢 只读 |
| 进程占用 | `nvidia-smi --query-compute-apps=pid,name,used_memory --format=csv` | 🟢 只读 |
| 昇腾 NPU | `npu-smi info` | 🟢 只读 |
| HAMi 状态 | `kubectl get pods -n kube-system \| grep hami` | 🟢 只读 |
| 内核日志 | `dmesg \| grep -i xid` | 🟢 只读 |
| NCCL 调试 | `NCCL_DEBUG=INFO python train.py` | 🟢 只读 |

---

## 远程诊断安全护栏

| 操作 | 风险等级 | 远程建议方式 |
|------|---------|------------|
| `nvidia-smi` / 查看日志 | 🟢 只读 | 直接建议执行 |
| 调整 batch size 重启训练 | 🟡 低危 | 建议先小规模验证 |
| 重启推理 Pod | 🟡 低危 | 提醒会有短暂服务中断 |
| 清理 GPU 进程 | 🟠 中危 | `nvidia-smi` 找到 PID，确认后清理 |
| 重启 GPU 节点 | 🔴 高危 | 会影响该节点所有 Pod，走变更流程 |
| 更新 GPU 驱动 | 🔴 高危 | 不建议远程操作，需现场/平台团队 |

---

## Related

- [[GPU_OOM_Troubleshooting_Guide]] — GPU OOM 专项排障指南
- [[13_运维/02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册]] — LLM 推理延迟/不可用 Runbook
- [[07_模型训练/04_分布式训练/04_分布式训练_Hang_操作手册]] — 分布式训练 Hang 排障
- [[07_模型训练/07_训练监控/02_LLM_微调_岗位_Failure_操作手册_on_K8s]] — LLM 微调失败 Runbook
- [[10_部署推理/01_部署基础/08_模型_Hot_Reload_and_回滚_操作手册]] — 模型热加载/回滚 Runbook
- [[HAMi_Troubleshooting_Guide]] — HAMi 排障指南
- [[K8s_AI_Troubleshooting_Cheat_Sheet]] — AI 工作负载排障速查表
- [[13_运维/02_SRE与可靠性/18_LLM推理_SLO_指南]] — LLM 推理 SLO 指南
- [[10_部署推理/05_硬件与算力/02_Ascend_NPU_推理_指南]] — 昇腾 NPU 推理指南
- [[13_运维/04_问题排查/03_diagnosis_k8s_pod_failure]] — Pod 故障诊断决策树
- [[12_架构基建/06_云厂商/Alibaba_Cloud/专有云/03_阿里云_专有云_K8s_上下文]] — 专有云 K8s 上下文
- [[概念/gpu]] — GPU 概念
- [[概念/gpu-oom]] — GPU OOM 概念
- [[概念/nccl]] — NCCL 概念
- [[概念/hami]] — HAMi 概念
- [[概念/mig]] — MIG 概念
- [[概念/ascend-npu]] — 昇腾 NPU 概念
- [[12_架构基建/07_硬件与算力/05_chinese_chips_inference]] — 国产芯片推理合成页
