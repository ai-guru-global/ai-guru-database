---
title: "Air-gapped 离线内网环境：Hugging Face 生态全量本地化部署指南"
category: "12-architecture-infrastructure"
tags: ["air-gapped", "offline", "huggingface", "deployment", "infrastructure", "internal-agent"]
summary: "> **一句话理解**: 针对断网的内部 / 企业私有云环境，本文档提供了一整套方案，教你如何将 Hugging Face 的模型、数据集、TGI 推理引擎以及 Agent 框架完全离线打包、迁移和闭环运行。"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "Airgapped Offline Deployment 2026"
  - Airgapped_Offline_Deployment_2026
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Air-gapped 离线内网环境：Hugging Face 生态全量本地化部署指南

> **一句话理解**: 对于高保密级别的企业内网（金融、政务、军工），服务器是完全断网的（Air-gapped）。本知识库的 Agent 运行时也处于内部环境中。本文档提供了一整套“无网求生”指南，教你如何将 Hugging Face (HF) 庞大的开源生态搬进内网并全功能运行。

---

## 目录

1. [模型与数据的离线下载与迁移 (huggingface-cli)](#1-模型与数据的离线下载与迁移-huggingface-cli)
2. [代码侧：强制离线加载 (local_files_only)](#2-代码侧强制离线加载-local_files_only)
3. [TGI 推理引擎的纯离线启动](#3-tgi-推理引擎的纯离线启动)
4. [离线环境下的 Agent Tools 与 API 降级策略](#4-离线环境下的-agent-tools-与-api-降级策略)

---

## 1. 模型与数据的离线下载与迁移 (huggingface-cli)

千万不要用浏览器一个一个点击下载模型文件！对于动辄包含十几个 `.safetensors` 分片的大模型，必须使用官方的 CLI 工具。

### 1.1 在有网机器上下载
在一台有外网访问权限的跳板机上，安装 `huggingface_hub` 并执行下载：

```bash
pip install -U "huggingface_hub[cli]"

# 环境变量：确保下载的是最新安全的 safetensors 格式
export HF_HUB_ENABLE_HF_TRANSFER=1

# 下载模型到指定目录 (排除不需要的原始 pytorch bin 文件)
huggingface-cli download \
    Qwen/Qwen2.5-Coder-32B-Instruct \
    --local-dir ./offline_models/Qwen2.5-Coder-32B-Instruct \
    --local-dir-use-symlinks False \
    --exclude "*.bin" "*.pth" "*.h5"

# 下载数据集 (比如 RAG 测试用的语料)
huggingface-cli download \
    --repo-type dataset \
    mteb/mteb_retrieval_law \
    --local-dir ./offline_datasets/mteb_law \
    --local-dir-use-symlinks False
```
*注意：`--local-dir-use-symlinks False` 极其关键！如果不加这个参数，下载下来的只是一堆软链接，当你把文件夹拷贝到 U 盘时，真正的缓存文件会丢失！*

### 1.2 物理迁移
将 `./offline_models` 和 `./offline_datasets` 通过加密 U 盘、光盘或内网文件传输服务器（如 SCP/SFTP）完整拷贝到断网机房的硬盘中。

---

## 2. 代码侧：强制离线加载 (local_files_only)

在断网机器上，如果你直接运行 `from_pretrained("Qwen/Qwen2.5...")`，代码会因为无法连接 `huggingface.co` 验证最新版本而卡死（Timeout）。你必须显式切断它的外网探查请求。

### 2.1 Transformers 与 Tokenizer 的完全离线加载

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# 路径指向你刚刚拷贝过来的绝对路径
LOCAL_MODEL_PATH = "/data/offline_models/Qwen2.5-Coder-32B-Instruct"

# 1. 加载 Tokenizer
tokenizer = AutoTokenizer.from_pretrained(
    LOCAL_MODEL_PATH,
    local_files_only=True, # 🔥 魔法参数：完全禁止联网请求
    trust_remote_code=True # 如果模型包含自定义的 python 脚本，必须开启
)

# 2. 加载模型
model = AutoModelForCausalLM.from_pretrained(
    LOCAL_MODEL_PATH,
    device_map="auto",
    local_files_only=True,
    trust_remote_code=True
)
```

### 2.2 Datasets 库的离线加载

```python
from datasets import load_dataset, load_from_disk

# 方案 A: 针对刚刚用 CLI 下载的原始数据结构
dataset = load_dataset(
    "/data/offline_datasets/mteb_law",
    local_files_only=True
)

# 方案 B: 如果是在有网机器上已经 map 处理好，并通过 save_to_disk 保存的 Arrow 格式
arrow_dataset = load_from_disk("/data/offline_datasets/my_preprocessed_arrow")
```

---

## 3. TGI 推理引擎的纯离线启动

TGI Docker 镜像默认启动时会去 Hub 检查模型元数据。在离线环境下启动容器时，除了挂载本地目录，还必须**更改容器内的环境变量以禁用联网检查**。

### 3.1 准备镜像
在有网机器拉取镜像并打包导出：
```bash
docker pull ghcr.io/huggingface/text-generation-inference:latest
docker save ghcr.io/huggingface/text-generation-inference:latest > tgi_latest.tar
```
在断网机器导入：
```bash
docker load < tgi_latest.tar
```

### 3.2 离线启动命令

```bash
docker run --gpus all --shm-size 1g -p 8080:80 \
  -v /data/offline_models/Qwen2.5-Coder-32B-Instruct:/data/model \
  -e HF_HUB_OFFLINE=1 \             # 🔥 强制 Hub 客户端进入离线模式
  -e DISABLE_TELEMETRY=1 \          # 关闭遥测
  ghcr.io/huggingface/text-generation-inference:latest \
  --model-id /data/model            # 注意：这里的 model-id 必须指向容器内的绝对路径
```

---

## 4. 离线环境下的 Agent Tools 与 API 降级策略

对于内部运行的 Agent（如 `SmolAgents` 或 `LangChain`），所有依赖外网的 Tool 都将失效。必须进行降级处理。

1. **废弃的网络工具**：`GoogleSearchTool`, `DuckDuckGoSearchTool`, `Tool.from_hub()`。
2. **私有化替代方案**：
   * **搜索降级**：部署内部的 Elasticsearch 或通过 RAG 挂载企业内部知识库，编写 `InternalWikiSearchTool`。
   * **代码执行环境**：如果使用 `CodeAgent`，内网极其缺乏沙箱保护。必须在 Docker 环境中启动 Agent 进程，并且 `additional_authorized_imports` 只能放行内部白名单库。
   * **视觉 / 多模态 Tool 降级**：提前下载好 `Whisper` 或 `Yolo` 模型，在内网编写原生的 Python Tool 函数进行模型加载和本地推理，替换掉原先通过外网 API 调用的 `Tool.from_hub()`。

**内网 Agent 核心代码示例：**
```python
from smolagents import CodeAgent, HfApiModel, Tool

# 1. 将 LLM 指向内网刚刚部署的离线 TGI 服务
model = HfApiModel(
    model_id="tgi", # 占位符
    api_base="http://10.x.x.x:8080/v1",
    api_key="none"
)

# 2. 编写内网专属的 RAG 搜索 Tool，而不是用外网搜索引擎
class InternalKBSearchTool(Tool):
    name = "internal_kb_search"
    description = "搜索企业内部知识库、规章制度和 API 文档。"
    inputs = {"query": {"type": "string", "description": "搜索关键词"}}
    output_type = "string"

    def forward(self, query: str) -> str:
        # 这里连接内网的 Milvus / Chroma 向量数据库
        return local_milvus_search(query)

# 3. 初始化离线 Agent
agent = CodeAgent(tools=[InternalKBSearchTool()], model=model)
```

---
## 相关阅读
- [[部署推理/Inference_Engines/TGI_Deep_Dive]]
- [[Agent/Agent_Frameworks/SmolAgents_Practical_Guide]]
- [[RAG系统/Embeddings/HF_Datasets_Streaming]]
