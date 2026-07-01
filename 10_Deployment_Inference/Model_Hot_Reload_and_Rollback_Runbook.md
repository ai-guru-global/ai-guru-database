---
title: "LLM 模型热加载与回滚 Runbook"
category: 10-deployment-inference
tags: ["llm", "inference", "model-serving", "hot-reload", "rollback", "kubernetes", "k8s", "alibaba-cloud"]
summary: "面向 K8s 上 LLM 推理服务：覆盖模型热加载失败、版本回滚、LoRA 适配器切换、量化配置漂移等场景的排查与修复。"
created: 2026-06-26
updated: 2026-06-26
tier: core
---

# LLM 模型热加载与回滚 Runbook

> **一句话理解**: 模型上线不是「替换文件就完事」——权重、tokenizer、LoRA 适配器、量化配置任何一项不匹配都会导致服务异常；本手册教你如何安全热加载和回滚。

## 目录

- [1. 模型版本一致性检查清单](#1-模型版本一致性检查清单)
- [2. 热加载失败常见原因](#2-热加载失败常见原因)
- [3. 回滚流程](#3-回滚流程)
- [4. 按引擎分类的处理](#4-按引擎分类的处理)
- [5. 阿里云专有云关联](#5-阿里云专有云关联)
- [Related](#related)

---

## 1. 模型版本一致性检查清单

热加载或升级前，必须确认以下四项一致：

| 组件 | 检查项 | 常见问题 |
|------|--------|---------|
| **权重文件** | `pytorch_model.bin` / `model.safetensors` / GGUF 版本 | 文件未完全写入、sha256 不匹配 |
| **Tokenizer** | `tokenizer.json`、`tokenizer_config.json` | 词表变更导致 token id 不一致 |
| **配置文件** | `config.json`、`generation_config.json` | 模型结构或生成参数不匹配 |
| **LoRA 适配器** | `adapter_config.json`、`adapter_model.safetensors` | base model 与 LoRA 不匹配 |
| **量化配置** | `quantize_config.json`、AWQ/GPTQ 配置 | 量化位宽、group size 不一致 |

---

## 2. 热加载失败常见原因

### 2.1 文件未完全写入

**现象**：服务加载模型时崩溃，报 `SafetensorError` 或 `EOFError`。

**排查**：

```bash
# 检查文件大小是否与源站一致
ls -lh /models/<model-path>
sha256sum /models/<model-path>/model.safetensors

# 看 Pod 日志
kubectl logs <pod> -n <ns> --previous
```

**修复**：
- 重新拉取完整模型
- 使用原子写入（先写到临时目录，再 rename）
- 模型下载完成后加 readiness probe

### 2.2 Tokenizer 不匹配

**现象**：输出乱码、special token 行为异常、生成结果质量骤降。

**排查**：

```bash
# 比较新旧 tokenizer 的 vocab_size
python -c "from transformers import AutoTokenizer; t=AutoTokenizer.from_pretrained('/models/new'); print(len(t))"
```

**修复**：
- 确保 tokenizer 与权重同时更新
- 回滚时同时回滚 tokenizer

### 2.3 LoRA 适配器 base model 不匹配

**现象**：加载 LoRA 后输出无意义或报错 `size mismatch`。

**排查**：

```bash
python -c "from peft import PeftModel; ..."
# 检查 base_model_name_or_path
```

**修复**：
- 回滚到匹配的 base + LoRA 组合
- 建立模型-适配器版本矩阵

### 2.4 量化配置漂移

**现象**：加载量化模型时报 `cannot import AWQ` 或 `group size mismatch`。

**排查**：

```bash
# 查看 quant_config
cat /models/<model>/quantize_config.json
```

**修复**：
- 量化模型必须与对应引擎版本匹配
- 回滚到上一版本并重新量化

---

## 3. 回滚流程

### 3.1 触发条件

- 推理质量回归（PPL 升高、bad case 增多）
- 延迟 SLO 不达标
- 错误率升高
- 用户投诉

### 3.2 回滚步骤

```text
Step 1: 确认当前异常版本
Step 2: 从模型仓库（MLflow / Harbor / OSS）拉取上一版本
Step 3: 同步回滚权重 + tokenizer + config + LoRA + 量化配置
Step 4: 更新 K8s ConfigMap / Secret / PVC 引用
Step 5: 执行 kubectl rollout restart deployment/<name>
Step 6: 验证健康检查通过
Step 7: 监控 TTFT/TPOT/错误率 5-10 分钟
Step 8: 通知业务方，记录 incident
```

### 3.4 回滚验证命令

```bash
# 查看当前镜像/模型版本
kubectl get deploy <name> -n <ns> -o jsonpath='{.spec.template.spec.containers[0].image}'

# 查看模型文件 hash
find /models/<version> -type f -exec sha256sum {} \; | sort

# 验证 tokenizer 与模型匹配
python -c "
from transformers import AutoTokenizer, AutoConfig
m = AutoConfig.from_pretrained('/models/<version>')
t = AutoTokenizer.from_pretrained('/models/<version>')
assert t.vocab_size <= m.vocab_size, 'tokenizer vocab too large'
print('OK')
"

# 重启并观察滚动更新
kubectl rollout restart deployment/<name> -n <ns>
kubectl rollout status deployment/<name> -n <ns>
```

### 3.3 使用 KServe 的 Canary 回滚

```bash
# 如果 canary 版本异常，把流量切回稳定版
kubectl patch inferenceservice <name> -n <ns> --type=merge -p '
{
  "spec": {
    "predictor": {
      "canaryTrafficPercent": 0
    }
  }
}'
```

---

## 4. 按引擎分类的处理

| 引擎 | 热加载方式 | 回滚要点 |
|------|-----------|---------|
| **vLLM** | 不支持运行时热加载，需重启 Pod | 使用 K8s rolling restart，确保新 Pod ready 后再切流量 |
| **TGI** | 不支持运行时热加载 | 同上 |
| **Triton** | 支持 model repository polling | 回滚模型目录版本，Triton 自动 unload/load |
| **KServe** | 通过 InferenceService 版本管理 | 使用 canaryTrafficPercent 控制流量 |
| **llama.cpp** | 重新加载 GGUF | 重启进程并加载旧 GGUF |

---

## 5. 阿里云专有云关联

在阿里云专有云环境中：
- 模型通常存储在 **盘古 OSS / NAS** 或 **ACR 镜像** 中
- **PAI-EAS** 支持模型版本管理，回滚可通过 EAS 控制台或 API
- **AI Stack 一体机** 使用本地模型仓库，回滚需同步本地缓存

**建议**：
- 在 ASCM/PAI 中维护模型版本标签
- 使用 KServe/Argo Rollouts 实现金丝雀发布
- 关键模型更新前先做小规模 A/B 验证

---

## Related

- [[_concepts/model-rollback|Model Rollback]]
- [[_concepts/model-deployment|Model Deployment]]
- [[_concepts/vllm|vLLM]]
- [[_concepts/kserve|KServe]]
- [[_concepts/lora-peft|LoRA / PEFT]]
- [[_concepts/quantization|Quantization]]
- [[11_MLOps_Pipeline/Troubleshooting/Model_Version_Rollback_Playbook|模型版本回滚 Playbook]]
- [[12_Architecture_Infrastructure/Alibaba_Cloud_Proprietary_K8s_Context|阿里云专有云 K8s 上下文]]
- [[model-weights-plain]]
