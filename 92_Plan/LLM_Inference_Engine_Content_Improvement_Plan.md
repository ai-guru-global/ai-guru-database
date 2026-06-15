---
title: "LLM 推理引擎专题矩阵内容提升计划"
category: "92-plan"
tags: ["plan", "llm-inference", "content-improvement", "deployment", "roadmap"]
summary: "> 针对 09_Deployment_Inference 目录下推理引擎专题矩阵的下一步内容提升计划，涵盖矩阵一致性、既有专题补齐、缺失引擎新增、实战工具化与跨目录联动。"
created: "2026-06-15"
updated: "2026-06-15"
---

# LLM 推理引擎专题矩阵内容提升计划

> **背景**: 09_Deployment_Inference 目录已完成 vLLM、SGLang、TensorRT-LLM、llama.cpp、TGI、Groq 六大核心推理引擎的深度专题升级。下一步需从「单点专题深度」转向「矩阵一致性、横向对比、概念联动、缺失引擎补齐」。

---

## 一、当前完成度评估

| 专题 | 状态 | 篇幅 | 主要优势 | 主要不足 |
|------|------|------|----------|----------|
| **vLLM** | ✅ 已全面升级 | 578 行 | V1 Engine、生产调优、K8s、对比全面 | 与概念页 `paged-attention.md` 等联动不足 |
| **SGLang** | ✅ 已全面升级 | 654 行 | RadixAttention、SRT、Function Calling、K8s | 性能数据需补充更多实际 batch 场景 |
| **TensorRT-LLM** | ✅ 已全面升级 | 635 行 | Triton 集成、FP8、MoE/EP、K8s | 命令行示例较多，缺少可视化决策流 |
| **llama.cpp** | ✅ 已全面升级 | 675 行 | 多后端、llamafile、K8s、性能优化 checklist | 与 Ollama 的边界可进一步厘清 |
| **TGI** | ✅ 已全面升级 | 605 行 | Rust+Python 架构、HF 生态、监控 | 与 HF Inference Endpoints 的联动可加强 |
| **Groq** | ✅ 新建 | 493 行 | LPU 架构、成本对比、生产集成 | 缺少与私有部署方案的成本模型 |
| **Ollama** | ⚠️ 中等深度 | 423 行 | 本地易用性 | 缺少 2026 新特性、多模态、Agent 工具调用 |
| **LMDeploy** | ⚠️ 中等深度 | 356 行 | 中文优化、AWQ | 与 vLLM/SGLang 的差距在 2026 年已缩小，需更新 |
| **BentoML** | ⚠️ 偏浅 | 337 行 | 模型服务框架 | 缺少与 vLLM/TGI 的集成部署 |
| **LiteRT** | ⚠️ 明显偏浅 | 238 行 | 移动端/边缘 | 内容仅为基础介绍，缺少实战 |
| **GPUStack** | ✅ 较完整 | 650 行 | 集群管理、MaaS | 与上述推理引擎的集成可补充 |

**总体评价**：推理引擎核心矩阵（vLLM/SGLang/TensorRT-LLM/llama.cpp/TGI/Groq）已补齐到同一深度。下一步重点应从「单点专题深度」转向「矩阵一致性、横向对比、概念联动、缺失引擎补齐」。

---

## 二、提升计划

### Phase 1：矩阵一致性（高优先级 / 中工作量）

#### 1.1 统一对比维度
- **目标**：在所有推理引擎专题的「对比与选择」中，统一使用同一套维度。
- **统一维度**：
  - 吞吐量 (Throughput)
  - 延迟 (TTFT / TPOT)
  - 易用性
  - 量化支持
  - 多 GPU 扩展
  - 多 LoRA
  - 社区生态
  - 监控/可观测性
  - 适用场景
- **统一口径**：性能数据统一标注 `batch=1`、`高并发 decode`、`TP=N` 等条件。
- **交付物**：更新 6 个已升级专题的对比表。

#### 1.2 建立全局选型决策页
- **目标**：新建 `09_Deployment_Inference/LLM_Inference_Engine_Selection_Guide.md`
- **内容**：
  - 一图流：所有引擎横向对比（吞吐量、延迟、易用性、成本、生态）
  - 决策树：按「延迟敏感 / 吞吐敏感 / 本地 / 云端 / 中文 / 多模态 / 预算」给出推荐
  - 场景映射表：RAG、Agent、聊天、代码补全、批量处理、边缘设备等
  - 成本模型：自建 vs 云 API 的粗略成本对比
- **交付物**：独立的 Selection Guide 专题页。

#### 1.3 补齐概念页反向链接
- **目标**：从 `concepts/paged-attention.md`、`concepts/radix-attention.md`、`concepts/continuous-batching.md` 等概念页反向链接到对应引擎专题。
- **动作**：
  - 在各专题中增加「相关概念」小节
  - 在概念页底部增加「相关引擎」Related 链接
- **交付物**：更新 3-5 个概念页 + 6 个引擎专题。

### Phase 2：既有专题补齐（高优先级 / 中工作量）

#### 2.1 升级 Ollama 专题
- **目标**：从 423 行扩展到 550+ 行，与 vLLM/SGLang 同深度。
- **新增内容**：
  - 2026 年新特性（多模态、工具调用、OpenAI 兼容 server、企业功能）
  - Ollama 与 llama.cpp 的关系说明
  - Docker / K8s 部署
  - 模型库管理、Modelfile 高级配置
  - 性能调优与监控
  - 与 LangChain/Llamaindex 集成
- **交付物**：更新 `Ollama_Deep_Dive.md`。

#### 2.2 升级 LMDeploy 专题
- **目标**：从 356 行扩展到 550+ 行。
- **新增内容**：
  - 2026 年性能数据更新
  - TurboMind vs PyTorch 双后端选型
  - 国产芯片支持（昇腾、寒武纪）
  - vLLM/SGLang/LMDeploy 最新对比
  - Docker / K8s 部署
  - 多模态推理（InternVL、Qwen-VL）
- **交付物**：更新 `LMDeploy_Deep_Dive.md`。

#### 2.3 升级 BentoML 专题
- **目标**：从 337 行扩展到 550+ 行。
- **新增内容**：
  - BentoML + vLLM 集成部署
  - BentoML + TGI 集成部署
  - 模型打包与 Bento 构建
  - A/B 测试与灰度发布
  - 自动扩缩容
  - 与 AI Gateway 集成
- **交付物**：更新 `BentoML_Deep_Dive.md`。

#### 2.4 升级 LiteRT 专题
- **目标**：从 238 行扩展到 550+ 行，成为完整深度专题。
- **新增内容**：
  - Android/iOS 实战部署
  - 模型转换（TensorFlow → TFLite → LiteRT）
  - 量化（INT8、FP16、动态范围）
  - NNAPI / GPU Delegate / Core ML Delegate
  - 性能基准与调试工具
  - 与 TensorFlow Lite 的关系和历史
- **交付物**：更新 `LiteRT_Deep_Dive.md`。

### Phase 3：缺失引擎补齐（中优先级 / 高工作量）

#### 3.1 新增云推理 API 专题
- **目标**：补齐主流云推理服务商的独立专题。
- **候选**：
  - `Together_AI_Deep_Dive.md`
  - `Fireworks_AI_Deep_Dive.md`
  - `Novita_AI_Deep_Dive.md`
- **统一内容框架**：
  - 定位与核心优势
  - 支持的模型
  - 延迟/吞吐/价格
  - OpenAI 兼容性
  - Function Calling / JSON 模式
  - 企业 SLA 与安全
  - 与 LiteLLM / AI Gateway 集成
- **交付物**：每个专题 ≥400 行。

#### 3.2 新增其他开源推理引擎专题
- **目标**：覆盖更多开源推理方案。
- **候选**：
  - `CTranslate2_Deep_Dive.md`（轻量 CPU/GPU 推理）
  - `DeepSpeed_MII_Deep_Dive.md`（Microsoft）
  - `MLC_LLM_Deep_Dive.md`（移动端/异构）
  - `NVIDIA_Triton_Deep_Dive.md`（独立专题，不仅依附 TensorRT-LLM）
- **交付物**：每个专题 ≥400 行，优先做 CTranslate2 和 MLC LLM。

### Phase 4：实战与工具化（中优先级 / 中工作量）

#### 4.1 新增基准测试与成本分析专题
- **目标**：建立统一的测试方法论。
- **内容**：
  - 指标定义：TTFT、TPOT、Throughput、Latency P99
  - 测试工具：llmperf、benchmark.js、自定义脚本
  - 各引擎的 `$ / 1M tokens` 成本模型
  - 自建 GPU vs 云 API 的成本对比
- **交付物**：`LLM_Inference_Benchmarking_Guide.md`。

#### 4.2 新增迁移指南专题
- **目标**：降低引擎切换成本。
- **内容**：
  - vLLM ↔ SGLang
  - vLLM ↔ TGI
  - vLLM ↔ TensorRT-LLM
  - 自建 → 云 API (Groq/Together)
  - API 兼容性与配置映射
- **交付物**：`LLM_Inference_Engine_Migration_Guide.md`。

#### 4.3 生产部署模板
- **目标**：提供可复制的部署配置。
- **内容**：
  - 为每个主要引擎提供 `docker-compose.yaml`
  - 为每个主要引擎提供 `k8s-deployment.yaml`
  - 可放在 `_staging/` 或专题附录中
- **交付物**：至少覆盖 vLLM、SGLang、TGI、TensorRT-LLM、Ollama、LMDeploy。

### Phase 5：跨目录联动（低优先级 / 中工作量）

#### 5.1 RAG / Agent / Gateway 联动
- **目标**：在相关目录中推荐合适的推理引擎。
- **动作**：
  - 在 `11_RAG_Systems/` 相关专题中链接推理引擎专题
  - 在 `13_Agent_Production/` 中补充 Agent 推理延迟优化
  - 在 `14_AI_Gateway/` 中补充网关 + 多推理引擎路由策略
- **交付物**：更新 3-5 个跨目录专题。

#### 5.2 学习路径更新
- **目标**：将新专题纳入学习路径。
- **动作**：
  - 更新 `90_Learn/Learning_Paths_2026.md`
  - 将「模型部署工程师」路径细分为：入门 → 本地部署 → 生产推理 → 成本优化
- **交付物**：更新学习路径页。

---

## 三、执行优先级

| 阶段 | 任务 | 优先级 | 预计工作量 | 建议顺序 |
|------|------|--------|------------|----------|
| Phase 1 | 建立全局选型决策页 | 🔴 高 | 中 | 1 |
| Phase 2 | 升级 Ollama | 🔴 高 | 中 | 2 |
| Phase 2 | 升级 LMDeploy | 🔴 高 | 中 | 3 |
| Phase 2 | 升级 BentoML | 🟡 中高 | 中 | 4 |
| Phase 2 | 升级 LiteRT | 🟡 中高 | 中 | 5 |
| Phase 3 | 新增云推理 API 专题 | 🟡 中 | 高 | 6 |
| Phase 1 | 统一对比维度与概念联动 | 🟡 中 | 中 | 7 |
| Phase 4 | 基准测试与迁移指南 | 🟢 中低 | 中 | 8 |
| Phase 4 | 生产部署模板 | 🟢 中低 | 中 | 9 |
| Phase 5 | 跨目录联动与学习路径 | 🟢 低 | 中 | 10 |

---

## 四、验收标准

1. 本计划文件已保存至 `92_Plan/LLM_Inference_Engine_Content_Improvement_Plan.md`
2. `09_Deployment_Inference/LLM_Inference_Engine_Selection_Guide.md` 已创建，≥500 行
3. Ollama、LMDeploy、BentoML、LiteRT 专题均 ≥550 行
4. 新增至少 2 个云推理 API 专题，每个 ≥400 行
5. `09_Deployment_Inference/README.md` 导航已更新
6. 所有新增/修改文件通过 `check_links.py` 检查，无新增断链
7. 对比维度在核心引擎专题中保持一致

---

## 五、相关资源

- [[09_Deployment_Inference/README|模型部署与推理目录]]
- [[09_Deployment_Inference/vLLM_Deep_Dive|vLLM 深度解析]]
- [[09_Deployment_Inference/SGLang_Deep_Dive|SGLang 深度解析]]
- [[09_Deployment_Inference/TensorRT_LLM_Deep_Dive|TensorRT-LLM 深度解析]]
- [[09_Deployment_Inference/llama_cpp_Deep_Dive|llama.cpp 深度解析]]
- [[09_Deployment_Inference/TGI_Deep_Dive|TGI 深度解析]]
- [[09_Deployment_Inference/Groq_Deep_Dive|Groq 深度解析]]

---

*Last updated: 2026-06-15*
*Version: 1.0.0*
