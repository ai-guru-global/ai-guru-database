---
title: AI技术全景
category: -concepts
tags: [ai, 技术栈, 机器学习, 深度学习, 大语言模型, 计算机视觉, 基础设施]
aliases: [AI技术栈, AI Technology Landscape, 技术全景]
relationships:
  - target: "[[概念/ai-fundamentals]]"
    type: related_to
  - target: "概念/ai-history"
    type: related_to
  - target: "概念/ai-future-trends"
    type: related_to
  - target: "概念/ai-ethics"
    type: related_to
sources: [AI入门/AI_Technology_Landscape.md]
summary: AI技术生态是一个从基础设施到应用的完整技术栈，涵盖机器学习算法、深度学习架构、大语言模型、计算机视觉及前沿智能体技术。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: core
created: 2026-05-31T00:00:00Z
updated: 2026-07-21
---

# AI技术全景

AI技术生态像一座冰山——ChatGPT只是水面上的尖端，水面下是数十年积累的数学理论、算法创新、工程实践和基础设施。从应用层到数据层，AI技术栈可划分为五个层次。

## 核心要点

- AI技术栈从下到上分为：数据层、基础设施层、框架层、算法层、模型层、应用层
- 技术演进经历四代：符号AI → 统计机器学习 → 深度学习 → 基础模型时代
- 大语言模型（LLM）核心技术栈包含预训练、对齐（SFT/rlhf/DPO）和推理优化
- 2026年前沿趋势：Agentic AI、多模态统一、世界模型、效率优化
- 开源生态（Llama 4、Qwen 3、DeepSeek V3）与闭源模型竞争激烈 ^[inferred]
- MCP/A2A协议已成为AI Agent通信的行业事实标准

## 详细内容

### 技术栈全景

```
应用层: 智能助手、推荐系统、自动驾驶、医疗诊断、内容创作
模型层: 基础模型(LLM/视觉/多模态/语音) + 领域模型 + 任务模型 + 小型模型
算法层: 机器学习(SVM/XGBoost) + 深度学习(CNN/RNN/Transformer) + 强化学习 + 生成模型
框架层: PyTorch/TensorFlow/JAX + LangChain/Hugging Face/Dify/vLLM
基础设施层: GPU(H100/B200)/TPU/NPU + 云平台 + 向量数据库
数据层: 训练数据 + 标注平台 + 数据治理
```

### 技术代际演进

| 代际 | 时期 | 核心技术 | 局限 |
|------|------|----------|------|
| 第一代 | 1950s-1980s | 符号AI、专家系统 | 知识获取瓶颈 |
| 第二代 | 1990s-2010s | SVM、随机森林、特征工程 | 特征需人工设计 |
| 第三代 | 2010s-2020s | CNN、RNN、Transformer | 需大量标注数据 |
| 第四代 | 2020s-至今 | 预训练+提示/微调、基础模型 | 训练成本极高 |

关于各代际的详细历史，参见AI历史。

### 深度学习架构演进

```
MLP (1986) → CNN (1998 LeNet, 2012 AlexNet爆发) → RNN/LSTM (序列建模)
→ Transformer (2017, 统一NLP和CV) → ViT (2020, 挑战CNN)
→ 生成模型: VAE → GAN → Diffusion → Autoregressive(GPT系列)
```

Transformer的核心创新：自注意力机制（transformer-architecture）实现完全基于注意力的并行计算，长距离依赖建模能力强，成为现代NLP和CV的基础架构。

### 大语言模型技术拆解

**预训练**：数万亿token互联网文本，目标预测下一个token，数千GPU训练数月，成本数百万到数千万美元。

**架构组件**：Tokenizer（文本→token）→ Embedding（token→向量）→ N层Transformer Block（Multi-Head Self-Attention + FFN + LayerNorm）→ 输出层（预测下一个token概率）。参数量从7B到1T+。

**对齐技术**：
- **SFT（监督微调）**：高质量对话数据微调
- **RLHF（人类反馈强化学习）**：训练奖励模型 + PPO优化
- **DPO（直接偏好优化）**：绕过奖励模型直接优化

**推理优化**：量化（INT8/INT4）、KV Cache优化、投机解码、模型并行、连续批处理。

### 计算机视觉技术栈

| 任务 | 技术演进 | 代表 |
|------|----------|------|
| 图像分类 | CNN → ViT | ResNet, EfficientNet, ViT |
| 目标检测 | R-CNN → YOLO → DETR | YOLOv8, RT-DETR |
| 图像分割 | U-Net → Mask R-CNN → SAM | SAM 2 |
| 图像生成 | GAN → Diffusion | DALL-E 3, Midjourney, SDXL |
| 多模态理解 | CLIP图文对齐 | GPT-4V, Gemini Pro Vision |

### 语音与音频技术

- **ASR（语音识别）**：CTC → long-context-models → Whisper（OpenAI）
- **TTS（语音合成）**：拼接合成 → 参数合成 → 神经网络端到端（ElevenLabs）
- **音乐生成**：MusicLM, Suno, Udio
- **声音克隆**：少量样本克隆音色

### Agentic AI（2026年热点）

AI Agent核心技术栈：

```
推理规划: CoT/推理模型
工具使用: Function Calling/MCP协议、API调用、代码执行
记忆管理: 短期(上下文窗口) + 长期(向量数据库+RAG)
自主执行: 目标分解、自我纠错、多步骤任务
```

架构模式：ReAct（推理+行动）、Plan-and-Execute、ai-agents（CrewAI/AutoGen）、Reflexion（自我反思）。协议标准：MCP（Anthropic主导）、A2A、ACP已成行业事实标准。详见未来趋势。

### 世界模型与具身智能

世界模型学习物理世界的动态规律、预测行动后果，是2026年资本和研究热点。技术路线包括JEPA（Yann LeCun主推）、视频生成模型（Sora学习物理规律）、NeRF/3D高斯溅射。

具身智能2026年进入商业化元年：VLA模型（RT-2、π0、OpenVLA）实现视觉-语言-动作统一，人形机器人（Tesla Optimus、Figure 01）进入工厂。

### 效率与优化趋势

- **模型架构**：MoE（稀疏激活，GPT-4/Llama 4采用）、Mamba/SSM（线性复杂度）、线性注意力
- **训练效率**：混合精度、ZeRO/FSDP、流水+张量并行
- **推理效率**：投机解码（2-3倍加速）、PagedAttention（vLLM）、INT4/INT8量化
- **端侧部署**：模型压缩、NPU优化、边缘-云协同

### 模型部署技术栈

模型服务化框架（2026主流）：vLLM（高吞吐，PagedAttention）、SGLang（结构化生成）、TensorRT-LLM（NVIDIA优化）、llama.cpp/Ollama（端侧）、ai-hardware Endpoints（云端托管）。

部署架构：云端（model-deployment/K8s）、边缘（移动端/IoT）、混合部署。

### 开源模型生态（2026）

基础模型：Llama 4（Meta，8B/70B/405B）、Qwen 3（阿里，中英双语）、DeepSeek V3（高性价比）、Mistral（欧洲）、Gemma 3（Google）。

领域模型：CodeLlama 3/StarCoder 2（代码）、DeepSeek-Math/Qwen-Math（数学）、LLaVA 2/Qwen-VL 2（多模态）、Meditron 4/HuatuoGPT（医疗）。

### 技术选型指南

| 任务 | 推荐技术 | 代表工具 |
|------|----------|----------|
| 文本分类 | Transformer编码器 | BERT, RoBERTa |
| 文本生成 | Transformer解码器 | GPT-4, Llama, Qwen |
| 图像分类 | CNN/ViT | ResNet, ViT |
| 目标检测 | YOLO/DETR | YOLOv8, RT-DETR |
| 图像生成 | Diffusion | SDXL, DALL-E 3 |
| 语音识别 | CTC/Attention | Whisper |
| 推荐系统 | 深度学习+传统 | DeepFM |

## 开放问题

- Transformer之后是否会出现全新范式（如Neuro-symbolic）？ ^[inferred]
- 世界模型能否真正理解物理规律还是仅学习表面模式？ ^[ambiguous]
- 开源模型能否在能力上追平闭源模型？ ^[inferred]
- 端侧部署的模型能力上限在哪里？ ^[ambiguous]
- 合成数据训练的规模是否能持续支撑模型质量提升？ ^[inferred]

## 来源

- 参考/AI入门/AI_Technology_Landscape

## Related

- [[概念/ai-fundamentals]] — AI基础概念 (共享: ai, 机器学习, 深度学习)
- [[概念/ai-history]] — AI历史 (共享: ai, 深度学习)

---

## 2026 AI 技术全景生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **大模型层** | GPT/Claude/Gemini/Qwen 等基础模型 | GA |
| **中间件层** | LangChain/LlamaIndex/DSPy 应用框架 | GA |
| **基础设施层** | GPU 集群/向量数据库/MLOps 平台 | GA |
| **应用层** | Agent/RAG/多模态/代码生成 | GA |
| **边缘 AI** | 端侧小模型 + NPU 芯片 | GA |

## 生产最佳实践

1. **分层理解**：从基础设施到应用层逐层理解，找到自身定位
2. **技术选型**：根据场景选择合适层级的工具，不过度工程化
3. **跟踪趋势**：关注开源社区动态，及时评估新技术适用性
4. **生态思维**：优先选择生态丰富的技术栈，降低集成成本
5. **实践验证**：新技术先 PoC 验证，再决定是否生产采用

## 相关概念

- [[概念/ai-stack|AI Stack]] — AI 技术栈
- [[概念/alibaba-cloud|Alibaba Cloud]] — 阿里云
- [[概念/pai|PAI]] — 阿里云 AI 平台

> 💡 AI 技术版图的核心是“分层解耦”——算力、框架、模型、应用四层可独立演进和替换。

## 2026 技术版图关键变化

| 层级 | 2024 格局 | 2026 变化 |
|------|----------|----------|
| 算力 | NVIDIA 主导 | AMD/Intel/国产芯片崛起 |
| 框架 | PyTorch 一家独大 | JAX/MLIR 生态扩展 |
| 模型 | 闭源领先 | 开源追平（Llama/Qwen） |
| 应用 | Chatbot 为主 | Agent 工作流成为主流 |
| 推理 | 云端集中 | 边缘-云协同兴起 |
