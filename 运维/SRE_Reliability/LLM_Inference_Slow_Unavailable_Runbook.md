---
title: "LLM 推理延迟/不可用 Runbook"
category: 13-ai-ops
subcategory: sre-reliability
tags: ["llm", "inference", "vllm", "serving", "kubernetes", "k8s", "troubleshooting", "slo", "alibaba-cloud"]
summary: "面向 K8s 上 LLM 推理服务的延迟/不可用排障手册：从 TTFT/TPOT、GPU 利用率、队列深度到 KServe/Ingress/SLB 分层定位。"
created: 2026-06-26
updated: 2026-06-26
tier: core
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# LLM 推理延迟/不可用 Runbook

> **一句话理解**: LLM 推理变慢或不可用，通常是「GPU 算不过来了」或「请求到不了 GPU」；本手册按「指标 → K8s 层 → 网络层 → 修复」分层排查。

## 目录

- [1. 关键指标](#1-关键指标)
- [2. 总线：先看指标还是先看 K8s](#2-总线先看指标还是先看-k8s)
- [3. GPU 层排查](#3-gpu-层排查)
- [4. 推理引擎层排查](#4-推理引擎层排查)
- [5. K8s 工作负载层排查](#5-k8s-工作负载层排查)
- [6. 网络 / 入口层排查](#6-网络--入口层排查)
- [7. 典型场景速查](#7-典型场景速查)
- [8. 阿里云专有云关联](#8-阿里云专有云关联)
- [Related](#related)

---

## 1. 关键指标

| 指标 | 含义 | 正常范围参考 |
|------|------|-------------|
| **TTFT** (Time To First Token) | 首 token 返回时间 | 通常 < 1s |
| **TPOT** (Time Per Output Token) | 每个输出 token 的时间 | 与模型/硬件相关 |
| **QPS / Throughput** | 每秒请求/ token 数 | 视资源而定 |
| **Queue Depth** | 等待处理的请求数 | 持续增长说明过载 |
| **KV Cache Usage** | KV Cache 显存占用 | 接近上限会触发重算或失败 |
| **GPU Utilization** | GPU 计算利用率 | 持续 100% 可能过载 |
| **GPU Memory Usage** | 显存占用 | 接近上限会 OOM |

---

## 2. 总线：先看指标还是先看 K8s

```text
用户报慢 / 不可用
  ├── K8s Pod 是否 Running / Ready？
  │     └── 否 → K8s 层排查
  │     └── 是 → 看指标
  │           ├── GPU 利用率 / 队列深度异常？
  │           │     └── 是 → GPU / 引擎层优化
  │           └── 指标正常但用户侧慢？
  │                 └── 网络 / 入口层排查
```

---

## 3. GPU 层排查

### 3.1 查看 GPU 状态

```bash
# 登录节点
nvidia-smi
nvidia-smi dmon -s u
```

### 3.2 常见 GPU 层问题

| 现象 | 根因 | 处理 |
|------|------|------|
| GPU 利用率 100% | 请求过载 | 扩容、限流、批处理优化 |
| GPU 显存接近上限 | KV Cache 过大 / 并发太高 | 降低 max_tokens、增加 GPU、使用 prefix caching |
| GPU 利用率低但延迟高 | PCIe/网络瓶颈、CPU 预处理慢 | 优化 tokenizer、数据加载 |
| 多 GPU 间负载不均 | tensor parallelism 配置不当 | 检查 vLLM/SGLang 的 tp 参数 |

---

## 4. 推理引擎层排查

### 4.1 vLLM 排查

```bash
# 看 vLLM metrics
curl http://<pod-ip>:8000/metrics

# 关键指标
vllm:gpu_cache_usage_perc
vllm:num_requests_waiting
vllm:time_to_first_token_seconds
vllm:time_per_output_token_seconds

# 一键获取核心指标
python <<'EOF'
import requests
m = requests.get("http://<pod-ip>:8000/metrics").text
for line in m.splitlines():
    if any(k in line for k in ["gpu_cache_usage", "num_requests_waiting", "time_to_first_token", "time_per_output_token"]):
        print(line)
EOF
```

### 4.2 常见引擎问题

| 问题 | 处理 |
|------|------|
| KV Cache 满 | 增大 GPU 显存、降低 max_model_len、开启 chunked prefill |
| 请求排队长 | 增加 replica、HPA、降低单请求长度 |
| 预热不足 | 启动后发送 warm-up 请求 |
| 量化精度退化 | 检查量化配置、fallback 到 fp16/bf16 |

---

## 5. K8s 工作负载层排查

### 5.1 Pod 状态

```bash
kubectl get pods -n <ns> -l app=<inference-app>
kubectl describe pod <pod> -n <ns>
```

### 5.2 HPA / 扩容

```bash
kubectl get hpa -n <ns>
kubectl describe hpa <hpa-name> -n <ns>
```

### 5.3 KServe 推理服务

```bash
kubectl get inferenceservice <name> -n <ns>
kubectl describe inferenceservice <name> -n <ns>
```

KServe 常见状态：
- `Ready`: 正常
- `IngressNotConfigured`: Ingress 未配置
- `PredictorUnhealthy`: predictor Pod 异常

---

## 6. 网络 / 入口层排查

### 6.1 Service 与 Endpoint

```bash
kubectl get svc <svc-name> -n <ns>
kubectl get endpoints <svc-name> -n <ns>
```

### 6.2 Ingress / Gateway

```bash
kubectl get ingress <name> -n <ns>
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=200
```

### 6.3 网络层常见问题

| 问题 | 处理 |
|------|------|
| Endpoint 为空 | 检查 Label Selector、Pod Ready 状态 |
| Ingress 502/503 | 后端 Pod 未 Ready、健康检查失败 |
| LoadBalancer 无 IP | 检查 Cloud Controller Manager、SLB 配额 |
| 跨可用区延迟高 | 调整 Service 拓扑、就近路由 |

---

## 7. 典型场景速查

### 场景 1：TTFT 突然升高

1. 检查是否有大量长 prompt 请求涌入
2. 检查 GPU 利用率是否 100%
3. 检查 prefix caching 是否生效
4. 检查是否发生节点调度变化（Pod 重建）

### 场景 2：TPOT 升高

1. 检查 batch size 是否因请求分布变差
2. 检查 GPU 温度/降频
3. 检查是否启用 chunked prefill

### 场景 3：服务完全不可用

1. 检查 Pod 是否 Running
2. 检查 KServe/Service/Ingress 状态
3. 检查是否 OOMKilled / CrashLoopBackOff
4. 检查底层节点是否 NotReady

---

## 8. 阿里云专有云关联

在阿里云专有云环境中，LLM 推理服务通常通过以下方式暴露：

| 入口 | 说明 |
|------|------|
| **KServe + Nginx Ingress** | 开源方案 |
| **PAI-EAS** | 阿里云托管推理服务 |
| **AI Stack 一体机** | 私有化推理平台 |
| **百炼 / AI Gateway** | 阿里云大模型服务平台 |

**排查入口**：
- ASCM 查看 SLB / Ingress 状态
- PAI-EAS 控制台查看服务日志与监控
- 天基 OpsBox 登录节点看 `nvidia-smi`

---

## Related

- [[概念/vllm|vLLM]]
- [[概念/sglang|SGLang]]
- [[概念/kserve|KServe]]
- [[概念/inference-autoscaling|推理自动扩缩容]]
- [[运维/LLM_Inference_Observability_Stack|LLM 推理可观测性栈]]
- [[运维/SRE_Reliability/LLM_Inference_SLO_Guide|LLM 推理 SLO 实践指南]]
- [[运维/SRE_Reliability/K8s_AI_Troubleshooting_Cheat_Sheet|K8s for AI 排查速查表]]
- [[部署推理/Inference_Tuning_Cheat_Sheet|LLM 推理调优速查表]]
- [[概念/kv-cache|KV Cache]]
- [[概念/paged-attention|PagedAttention]]
- [[概念/continuous-batching|Continuous Batching]]
- [[部署推理/README|推理部署总览]]
- [[运维/SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]
- [[架构基建/Alibaba_Cloud_Proprietary_K8s_Context|阿里云专有云 K8s 上下文]]
