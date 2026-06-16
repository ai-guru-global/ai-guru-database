---
title: "KitOps (ModelKit): 大模型制品打包标准"
category: "12-architecture-infrastructure"
tags: ["cncf", "kitops", "modelkit", "oci", "mlops", "packaging", "llm"]
summary: "> **一句话理解**: KitOps 定义了 ModelKit——把大模型权重/代码/数据集/配置/文档打成一个 OCI 制品(可签名、可版本、可推任意镜像仓库),解决「模型在生产环境的散装搬运」和供应链安全问题。"
created: "2026-06-16"
updated: "2026-06-16"
---

# KitOps (ModelKit): 大模型制品打包标准

> **一句话理解**: KitOps 定义了 ModelKit——把大模型权重/代码/数据集/配置/文档打成一个 OCI 制品(可签名、可版本、可推任意镜像仓库),解决「模型在生产环境的散装搬运」和供应链安全问题。

> 📐 **概念方法论**: ModelKit 解决的是「AI 制品的物流标准化」——它把模型权重、推理代码、训练数据集、配置、文档全部封装成一个 OCI 制品,让 Data Scientist / MLOps / Security 用同一份不可变工件各取所需。它是模型注册表(Model Registry)与制品仓库(Artifact Registry)之间的桥梁,见 [[10_MLOps_Pipeline/Model_Registry_and_Cards_Deep_Dive]];其底层使用 OCI 分层存储与 P2P 分发,与 [[CNCF_Cloud_Native_AI/Dragonfly_Deep_Dive]] 共享同一套 registry 协议。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [安装部署](#4-安装部署)
5. [快速开始](#5-快速开始)
6. [生产配置](#6-生产配置)
7. [运维与可观测](#7-运维与可观测)
8. [对比与选择](#8-对比与选择)
9. [常见问题 FAQ](#9-常见问题-faq)

---

## 1. 概述

### 1.1 定位

```
KitOps: Open Standard for ML/LLM Artifact Packaging
═══════════════════════════════════════════════════════════════════
定位:  CNCF Sandbox —— 定义 ModelKit,一个 OCI 标准的 AI/ML 制品打包格式
核心理念:
• 一把抓:    模型权重 + 代码 + 数据集 + 配置 + 文档 + 元数据 进同一个制品
• OCI 兼容:  复用 Docker / Harbor / GHCR / ACR / ORAS 全套容器生态
• 可签名:    Sigstore / Cosign 签名,符合 SLSA / SSDF 供应链要求
• 不可变:    digest 锁定,生产环境杜绝「我本地能跑」
• 可拆包:    同一个包按角色解出不同子集(DataSci / MLOps / SecOps)
• 跨边界:    跨组织、跨云、跨气隙均可流转,只依赖 OCI 协议
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **OCI-standard bundle** | ModelKit 本质是一个 OCI Image Manifest,任意符合 OCI v1.1 规范的 registry 都能存 |
| **Layered & partial-unpack** | 模型/代码/数据/文档各自一层,`kit unpack --model` 只取推理需要的部分 |
| **Signed & immutable** | 内容寻址 digest + Sigstore 签名,部署前可验证 provenance |
| **Versioned** | 通过 registry tag 与 digest 同时支持可读版本与不可变引用 |
| **Toolchain-compatible** | 复用 `containers/image`、ORAS、Trivy、Cosign、Harbor 等成熟工具链 |
| **Kitfile 声明式** | YAML 清单描述包内全部组件,类比 Dockerfile 但面向 ML |
| **CLI 友好** | `kit pack / push / unpack / list / info` 与 `docker` 心智模型一致 |

### 1.3 CNCF 状态与版本历程

| 时间 | 事件 |
|------|------|
| 2024-Q2 | KitOps 作为开源项目发布,主打 ModelKit 规范 |
| 2024-Q4 | 进入 **CNCF Sandbox**,作为 AI/ML 制品打包规范孵化 |
| 2024 全年 | v0.x 系列:完善 `kit` CLI、Kitfile v1、签名集成 |
| 2025 | **v1.0** 发布:ModelKit 规范稳定,OCI v1.1 全面适配,企业级 GA |

仓库地址: <https://github.com/kitops-ml/kitops>

---

## 2. 核心概念

### 2.1 ModelKit

ModelKit 是 KitOps 定义的 **打包格式**,本质是一个符合 OCI Image Spec 的制品。它把一个 AI/ML 模型在生产环境所需的全部物料组织成一个分层结构:

- **model**: 权重文件(safetensors / gguf / pytorch bin)、tokenizer、模型卡
- **code**: 训练 / 预处理 / 后处理 / 评测脚本
- **datasets**: 训练 / 评测数据集(可只放引用与 hash)
- **docs**: README、使用说明、合规文档
- **manifests**: Kubernetes YAML、ServingRuntime、Helm Chart 等
- **metadata**: Kitfile 自身、作者、license、签名材料

### 2.2 Kitfile

Kitfile 是描述一个 ModelKit 内容的 **YAML 清单**,地位等同于 Docker 镜像的 Dockerfile,但描述的是「装什么」而非「怎么构建」。一个最小 Kitfile:

```yaml
manifestVersion: 1.0.0
package:
  author: ai-guru
  name: llama3-70b-qa
  version: 2.1.0
  description: Llama-3 70B + QA LoRA,生产推理包
  license: Apache-2.0
model:
  name: llama3-70b
  path: ./weights/
  framework: pytorch
  version: "8B-instruct-base"
code:
  - path: ./serve/
    description: vLLM 启动脚本与依赖
  - path: ./eval/
    description: 评测 harness
datasets:
  - name: qa-finetune
    path: ./data/qa_train.jsonl
docs:
  - path: ./README.md
  - path: ./RUNBOOK.md
```

### 2.3 pack / unpack 模型

ModelKit 的精髓在于 **同一个包按角色拆开**:

```
                      ┌──────────────── ModelKit (1 个 OCI 制品) ────────────────┐
                      │  layer: weights    layer: code   layer: data  layer: k8s  │
                      └────────────────────────────┬──────────────────────────────┘
                                   kit unpack     │     kit unpack
                              --filter model      │      (all)
                                                 │
        ┌────────────────────┬───────────────────┼───────────────────┬────────────────────┐
        ▼                    ▼                   ▼                   ▼                    ▼
   Data Scientist        MLOps Engineer        SecOps            Platform             Reproducibility
   只要 weights + code   只要 weights + k8s    只要 SBOM + 签名   只要 k8s manifests   全量 unpack
   做继续训练            部署推理服务          做合规审计         部署 GitOps          复现论文/评测
```

### 2.4 与 OCI 制品的关系

ModelKit 不是新协议,而是 OCI Image Manifest 的一种 **约定用法**:

- 顶层是一个 `application/vnd.oci.image.manifest.v1+json`
- 每个 layer 用 mediaType 区分(`application/vnd.kitops.model.mdl.v1.tar` 等)
- registry 完全不需要「认识」ModelKit,只要认 OCI 就行
- 因此可直接走 Harbor 的复制、Trivy 的扫描、Dragonfly 的 P2P 分发

---

## 3. 架构设计

### 3.1 ModelKit 的 OCI 分层布局

```
ModelKit OCI Layout (类比 Docker image 的 layer 结构)
═══════════════════════════════════════════════════════════════════════
                              OCI Image Manifest
                                      │
        ┌─────────────────┬──────────┴───────────┬─────────────────┐
        ▼                 ▼                      ▼                 ▼
 ┌─────────────┐   ┌──────────────┐      ┌──────────────┐   ┌────────────┐
 │ layer: model│   │ layer: code  │      │ layer: data  │   │ layer: k8s │
 │ safetensors │   │ *.py req.txt │      │ *.jsonl      │   │ *.yaml     │
 │ mediaType:  │   │ mediaType:   │      │ mediaType:   │   │ mediaType: │
 │ vnd.kitops. │   │ vnd.kitops.  │      │ vnd.kitops.  │   │ vnd.kitops.│
 │ model.mdl   │   │ code.cde     │      │ dataset.dat  │   │ manifest.  │
 └─────────────┘   └──────────────┘      └──────────────┘   └────────────┘
        │                 │                      │                 │
        └─────────────────┴──────────┬───────────┴─────────────────┘
                                      ▼
                            ┌──────────────────┐
                            │ config: Kitfile  │   <-- 作为 OCI config
                            │ (YAML 元数据)    │       digest 即为版本指纹
                            └──────────────────┘
```

### 3.2 `kit` CLI 打包流程

```
本地工作目录                kit pack                OCI registry
─────────────              ──────────              ──────────────
./mydir/                                            myrepo/mymodel:v1
├── Kitfile         ──►  1. 读 Kitfile              (Image Manifest)
├── weights/              2. 各目录 → tar layer       │
├── serve/                3. 计算 digest              ▼
├── data/                 4. 组装 OCI manifest   ┌──────────────┐
└── README.md             5. kit push ─────────► │ Harbor/GHCR │
                                                 │ (内容寻址)   │
                                                 └──────────────┘
```

### 3.3 与 Docker Image 的对比

| 维度 | Docker Image | ModelKit |
|------|--------------|----------|
| 设计目标 | 单一可执行应用环境 | 多角色、可拆分的 AI/ML 制品 |
| Layer 粒度 | 文件系统增量 | 语义化分层(model / code / data / docs) |
| 构建方式 | Dockerfile 命令式(每行一层) | Kitfile 声明式(目录即层) |
| 消费方式 | 整体启动容器 | 可只 unpack 一个子集 |
| 典型大小 | MB ~ GB | GB ~ TB(权重占大头) |
| 分发优化 | 镜像分层缓存 | 同 OCI 分层 + registry 复制 |
| 签名 | Cosign(可选) | Cosign(强烈推荐,合规刚需) |

### 3.4 上下游集成

```
开发侧                        KitOps 中间层                   消费侧
──────                       ──────────────                  ──────
HuggingFace 下载    ──┐                              ┌──►  KServe / KAITO 部署
Jupyter 训练脚本    ──┤   kit pack    ┌──────────┐   │     vLLM / BentoML 推理
评测 harness        ──┼──► Kitfile ──►│ ModelKit │──►├──►  Trivy 扫描
K8s manifests       ──┤    kit push   │  (OCI)   │   │     Cosign 验签
README / 模型卡     ──┘               └────┬─────┘   └──►  CI/CD (Argo / Flux)
                                          │
                                          ▼
                                  Harbor / GHCR / ACR
                                  (Sigstore 签名 + SBOM)
```

---

## 4. 安装部署

### 4.1 安装 `kit` CLI

**macOS(Homebrew,推荐):**

```bash
brew tap kitops-ml/kitops
brew install kitops-cli
kit version
```

**Linux / 通用二进制:**

```bash
curl -L -o kit.tar.gz \
  https://github.com/kitops-ml/kitops/releases/latest/download/kit-linux-amd64.tar.gz
tar -xzf kit.tar.gz -C /usr/local/bin kit
chmod +x /usr/local/bin/kit
kit version
```

**Shell 补全(可选):**

```bash
echo 'source <(kit completion zsh)' >> ~/.zshrc
```

### 4.2 准备 OCI Registry

ModelKit 可推到任何 OCI v1.1 兼容 registry。生产环境推荐 **Harbor**(自带复制、扫描、RBAC):

```bash
helm repo add harbor https://helm.goharbor.io
helm install harbor harbor/harbor \
  -n harbor --create-namespace \
  -f harbor-values.yaml
```

`harbor-values.yaml` 关键项:

```yaml
expose:
  type: ingress
  tls:
    enabled: true
    certSource: secret
persistence:
  persistentVolumeClaim:
    registry:
      size: 500Gi
      storageClass: fast-ssd
registry:  # 可选:开启 OCI 删除与复制
  relativeurls: true
trivy:
  enabled: true
```

也可直接使用 GHCR(GitHub Container Registry)、Docker Hub、ACR、ECR、自建 Distribution。

### 4.3 配置认证

```bash
# 复用 docker / podman 的认证文件 ~/.docker/config.json
docker login harbor.example.com

# 或直接为 kit 设置
export KIT_REGISTRY=harbor.example.com
kit login harbor.example.com -u $USER -p $TOKEN
```

### 4.4 配置签名(Cosign / Sigstore)

```bash
brew install cosign

# 生成密钥对(keyless 模式更推荐生产环境,集成 OIDC)
cosign generate-key-pair
# 得到 cosign.pub / cosign.key,密钥入库管理(Vault / KMS)

# 设置环境变量,kit push 后可自动调用
export COSIGN_EXPERIMENTAL=1
export COSIGN_PASSWORD=$COSIGN_PASS
```

---

## 5. 快速开始

场景:把 Llama-3-8B + 一个 QA LoRA adapter + vLLM serving 配置 + 评测脚本打成一个签名制品,推到 Harbor,再在推理机上 unpack 启动。

### 5.1 准备目录

```bash
mkdir -p llama-qa/{weights,serve,data,docs}
cd llama-qa

# 下载基座 + LoRA(示意)
huggingface-cli download meta-llama/Meta-Llama-3-8B-Instruct --local-dir weights/base
cp /path/to/qa-lora weights/lora

# serving 配置
cat > serve/start.sh <<'EOF'
exec vllm.entrypoints.openai.api_server \
  --model weights/base \
  --enable-lora \
  --lora-modules qa=weights/lora \
  --port 8000
EOF

# 评测
echo '{"prompt":"...","expected":"..."}' > data/qa_eval.jsonl
echo "# Runbook" > docs/RUNBOOK.md
```

### 5.2 编写 Kitfile

```yaml
manifestVersion: 1.0.0
package:
  author: ai-guru
  name: llama3-8b-qa
  version: 1.0.0
  description: Llama-3 8B Instruct + QA LoRA,生产推理 ModelKit
  license: llama3-community
model:
  name: llama3-8b-qa
  path: ./weights/
  framework: vllm
  version: "1.0.0"
code:
  - path: ./serve/
    description: vLLM 启动脚本
  - path: ./eval/
    description: 评测 harness(此处略)
datasets:
  - name: qa-eval
    path: ./data/qa_eval.jsonl
docs:
  - path: ./docs/RUNBOOK.md
```

### 5.3 pack + push

```bash
# 打包,生成 OCI 制品到本地 cache
kit pack . -t harbor.example.com/ai-guru/llama3-8b-qa:1.0.0

# 查看本地包
kit list
kit info harbor.example.com/ai-guru/llama3-8b-qa:1.0.0

# 推送
kit push harbor.example.com/ai-guru/llama3-8b-qa:1.0.0

# 签名(自动复用当前 cosign 凭证)
cosign sign --key cosign.key \
  harbor.example.com/ai-guru/llama3-8b-qa:1.0.0
```

### 5.4 在推理机 unpack 启动

```bash
# 拉取并解出推理所需子集(weights + serve 脚本)
kit unpack harbor.example.com/ai-guru/llama3-8b-qa:1.0.0 \
  --model --code -d ./serve-out

# 验证签名
cosign verify --key cosign.pub \
  harbor.example.com/ai-guru/llama3-8b-qa:1.0.0

# 启动 vLLM
cd serve-out && bash serve/start.sh
```

---

## 6. 生产配置

### 6.1 Kitfile 分层最佳实践

**目标:** 让权重 / 代码 / 数据各自独立成层,最大化 registry 的 layer 复用与缓存命中。

| 角色 | 是否频繁变化 | 分层策略 |
|------|--------------|----------|
| 基座权重 | 极少变 | 单独 `model.path`,跨多个 ModelKit 复用同一 digest |
| LoRA adapter | 中等 | 与基座分目录,便于只 unpack adapter |
| 推理代码 | 频繁 | `code.path` 独立,迭代不触发权重层重传 |
| 评测数据 | 中等 | `datasets.path` 独立,只读 |
| K8s manifests | 频繁 | 用 `manifests` 字段或单独 `code` 层 |
| 文档 | 频繁 | `docs.path`,变更不影响权重层 |

### 6.2 生产级 Kitfile 示例

```yaml
manifestVersion: 1.0.0
package:
  author: ai-guru
  name: llama3-70b-qa-prod
  version: 2.3.1
  description: 生产 QA 模型,包含基座、LoRA、serving、评测、部署清单
  license: llama3-community
model:
  name: llama3-70b-base
  path: ./weights/base/
  framework: vllm
  version: "0.6.0"
code:
  - path: ./serve/
    description: vLLM 启动脚本与 Python 依赖
  - path: ./lora/
    description: QA LoRA adapter
  - path: ./eval/
    description: lm-eval-harness 配置
datasets:
  - name: qa-eval-v3
    path: ./data/qa_eval_v3.jsonl
docs:
  - path: ./README.md
  - path: ./RUNBOOK.md
  - path: ./MODEL_CARD.md
  - path: ./COMPLIANCE.md
```

### 6.3 私有 Registry + RBAC(Harbor)

```yaml
# Harbor 项目级 RBAC 策略
- 项目: ai-guru
  角色:
    - group: ml-engineers   # push / pull
      role: Developer
    - group: deploy-bots    # 仅 pull(GitOps)
      role: Guest
    - group: security       # 扫描 / 验签,无 push
      role: LimitedGuest
  复制策略:
    - 目标: dr-harbor.example.com   # 异地灾备
      模式: push
      filter: tag=**
  保留策略:
    - 规则: 保留最近 10 个 tag
      scope: ai-guru/*
```

### 6.4 签名策略

```bash
# Keyless 模式,绑定 OIDC(Fulcio),适合 CI/CD
COSIGN_EXPERIMENTAL=1 cosign sign \
  --identity-token $OIDC_TOKEN \
  harbor.example.com/ai-guru/llama3-70b-qa-prod:2.3.1

# 附带 SBOM 与 provenance
cosign attach sbom --sbom sbom.spdx.json \
  harbor.example.com/ai-guru/llama3-70b-qa-prod:2.3.1
cosign sign --attachment sbom \
  harbor.example.com/ai-guru/llama3-70b-qa-prod:2.3.1
```

部署侧 **强制验签**(Kubernetes Admission / Kyverno):

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-modelkit-signature
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-cosign
      match:
        resources:
          kinds: [InferenceService]
      verifyImages:
        - imageReferences:
            - "harbor.example.com/ai-guru/*"
          attestors:
            - entries:
                - keys:
                    publicKeys: |
                      -----BEGIN PUBLIC KEY-----
                      ...
                      -----END PUBLIC KEY-----
```

### 6.5 漏洞扫描

Harbor 内置 Trivy 可自动扫描 ModelKit 的 code 层(依赖文件);权重层不参与 CVE 扫描,但可对接专门的反恶意模型扫描。

### 6.6 CI/CD 集成(GitHub Actions 示例)

```yaml
name: build-modelkit
on:
  push:
    tags: ['v*']
jobs:
  pack:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - name: Install kit
        run: |
          curl -L -o /tmp/kit.tar.gz \
            https://github.com/kitops-ml/kitops/releases/latest/download/kit-linux-amd64.tar.gz
          tar -xzf /tmp/kit.tar.gz -C /usr/local/bin kit
      - name: kit pack
        run: |
          tag="ghcr.io/${{ github.repository }}:${GITHUB_REF##*/}"
          kit pack . -t "$tag"
          echo "TAG=$tag" >> $GITHUB_ENV
      - name: kit push
        run: |
          echo "${{ secrets.GITHUB_TOKEN }}" | kit login ghcr.io -u ${{ github.actor }} --password-stdin
          kit push "$TAG"
      - name: cosign sign (keyless)
        run: |
          brew install cosign
          COSIGN_EXPERIMENTAL=1 cosign sign "$TAG"
      - name: deploy
        run: |
          # 触发 GitOps repo 更新 InferenceService 的镜像 digest
          kubectl set image isvc/llama-qa predictor=model="$TAG"
```

---

## 7. 运维与可观测

### 7.1 Registry 存储增长治理

ModelKit 单包动辄几十 GB,registry 存储增长极快:

| 治理手段 | 说明 |
|----------|------|
| **保留策略** | Harbor Tag Retention:每个 repo 仅留最近 N 个 tag |
| **垃圾回收** | 定期 `registry garbage-collect`(停写或只读窗口) |
| **Layer 去重** | OCI 内容寻址天然去重,相同权重层只存一份 |
| **分层存储** | 权重层放对象存储(S3),metadata 放本地 SSD |
| **跨地域复制** | Harbor replication 把热门包推到边缘 registry,见 [[CNCF_Cloud_Native_AI/Dragonfly_Deep_Dive]] 做 P2P 加速 |
| **生命周期** | 对象存储侧配置 lifecycle,旧层转冷归档 |

### 7.2 Provenance 与 SBOM

```
一次 ModelKit pull 应可回答的安全问题
─────────────────────────────────────
  ① 这是谁打包的?        ── Cosign 签名 + OIDC 身份
  ② 何时打包?            ── Rekor 透明日志
  ③ 包含哪些依赖?        ── SBOM (SPDX) 附在 SBOM 层
  ④ 权重来源是否合规?    ── Kitfile model.version + 模型卡
  ⑤ 是否被扫描过?        ── Harbor 扫描报告 + Cosign attestation
  ⑥ 与生产是否一致?      ── digest 锁定,不可变
```

### 7.3 常见故障排查

| 症状 | 可能原因 | 处理 |
|------|----------|------|
| `kit push` 超时 / OOM | 单层过大或网络抖动 | 拆分 Kitfile layer;调高 registry 的 `client_body_timeout`;开启断点续传 |
| push 成功但 pull 拉不下 | registry 不支持 OCI v1.1 或被中间代理缓存 | 升级到 Harbor ≥ 2.10 / Distribution ≥ 2.8;禁用 HTTP 缓存代理 |
| layer 重复上传占空间 | 同一权重在不同包里被重打包 | 确保权重文件字节一致(含 tokenizer),OCI 会自动复用 digest |
| Cosign 验签失败 | 签名 key 轮换 / 时钟漂移 / 透明日志延迟 | 校对 cosign.pub;检查节点 NTP;Rekor 同步可能延迟数分钟 |
| unpack 后缺文件 | Kitfile path 写错或被 `--filter` 过滤 | `kit info` 检查 manifest;按需加 `--model --code --datasets` |
| Registry 存储暴涨 | 旧 tag 未清理 / GC 未运行 | 配置 retention;离线 GC;启用对象存储 lifecycle |

### 7.4 版本与回滚

- **版本语义**: 遵循 SemVer,基座权重变更升 major,LoRA/微调升 minor,代码改动升 patch。
- **不可变引用**: 生产部署使用 `@sha256:...` digest,而非浮动 tag。
- **回滚**: GitOps 仓库改回旧 digest 即触发 ArgoCD/Flux 重新 unpack 旧版本,registry 因 retention 仍保留。

---

## 8. 对比与选择

### 8.1 横向对比

| 维度 | **KitOps / ModelKit** | HuggingFace Hub | Docker Image | BentoML Bundle | ONNX |
|------|----------------------|-----------------|--------------|----------------|------|
| 打包对象 | 全套(权重+代码+数据+文档+k8s) | 权重+模型卡 | 应用运行环境 | 服务+依赖 | 单一推理图 |
| 标准化 | OCI v1.1 开放规范 | 私有 Hub API | OCI | 自定义格式 | 自定义 |
| 可签名 | Cosign / Sigstore 原生 | 有限 | Cosign | 弱 | 无 |
| 部分解包 | 支持 | 不支持 | 不支持 | 不支持 | N/A |
| K8s 友好 | 强(OCI + manifests) | 弱 | 强 | 中 | 弱 |
| 适合 LLM | 强(GB~TB 分层) | 强(权重下载) | 弱(镜像过大) | 中 | 弱 |
| 跨组织流转 | 强(任何 OCI registry) | 依赖 HF 平台 | 强 | 弱 | 弱 |

### 8.2 何时选 KitOps

**选 KitOps 当:**

- 模型要 **跨组织 / 跨云 / 跨气隙** 流转,且必须可签名、可审计
- Dev / MLOps / Security 需要 **从同一份制品各取所需**,而非各自维护副本
- 已有 K8s + OCI registry + GitOps 体系,要让模型进入同一套 CI/CD
- 合规要求 SLSA L3、SBOM、provenance 可追溯
- LLM 场景:一个 70B 基座 + 多个 LoRA + 评测 + 部署清单要一体化版本管理

**选别的当:**

- 只想公开下载权重 → HuggingFace Hub
- 只打包推理服务进程 → Docker Image 或 BentoML
- 只做跨框架推理图转换 → ONNX
- 单团队、无合规压力、走 HF 协议即可 → 不必引入额外抽象

---

## 9. 常见问题 FAQ

**Q1: ModelKit 和 OCI Image 是什么关系?会冲突吗?**
A: ModelKit 本身就是一个符合 OCI Image Manifest 规范的制品,只是约定了一套 layer mediaType。现有 registry / 扫描 / 签名工具无需改造即可识别,不会冲突。

**Q2: 一个 70B 模型打包后推 registry 会不会很慢?**
A: 单次首次推送受限于带宽,但 OCI 分层使后续迭代的代码层、LoRA 层只需推增量;基座权重层跨多个 ModelKit 复用 digest,不再重传。配合 Dragonfly P2P 可进一步加速分发。

**Q3: 我们已经在用 HuggingFace Hub,为什么还要 KitOps?**
A: HF Hub 解决「权重下载」,KitOps 解决「生产制品的不可变 + 签名 + 部分解包 + K8s 部署」。二者可并存:HF 做源头,KitOps 做生产门禁。Kitfile 里的 `model.path` 可以指向从 HF 拉下的目录。

**Q4: ModelKit 能否被 KServe / KAITO 直接消费?**
A: KServe 的 Storage Container / KAITO 的推理部署均可通过 OCI 协议拉取 ModelKit,然后在 init container 中 `kit unpack --model` 取出权重。本质就是 OCI 制品 + 一个解包步骤。

**Q5: 签名失败但生产急需部署,能不能跳过?**
A: 强烈不建议。跳过验签等于放弃供应链保证;正确做法是用 Kyverno / OPA 在 admission 层强制验签,签名问题应回到 CI 修复(Fulcio 时钟、key 轮换、Rekor 延迟),而不是绕过门禁。

**Q6: ModelKit 规范稳定了吗?能上生产吗?**
A: 2025 年 v1.0 已 GA,Kitfile 与 OCI 布局稳定,多家企业在生产使用。CNCF Sandbox 状态影响的是治理成熟度,不影响规范可用性;建议订阅 kitops-ml/kitops 关注 patch 版本。

---

## Related

- [[CNCF_Cloud_Native_AI/README]]
- [[CNCF_Cloud_Native_AI/Dragonfly_Deep_Dive]] —— OCI 制品的 P2P 分发加速,ModelKit 的最佳分发搭档
- [[CNCF_Cloud_Native_AI/KServe_Deep_Dive]] —— 消费 ModelKit 部署推理服务的标准平台
- [[10_MLOps_Pipeline/Model_Registry_and_Cards_Deep_Dive]] —— ModelKit 是模型注册表的制品载体
- [[10_MLOps_Pipeline/DVC_Deep_Dive]] —— 数据/模型版本管理,可与 ModelKit 的 datasets 层互补
