---
title: "使用小型语言模型构建应用"
category: "05-nlp-llms-edge-llm"
tags: ["microsoft-genai-course", "slm", "edge-deployment", "phi-3", "onnx-runtime", "ollama"]
summary: "全面介绍小型语言模型（SLM）的概念与优势，以微软Phi-3/3.5家族为主线，涵盖文本、视觉和MoE场景的推理与部署方法，包括云端API和本地部署完整指南。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://raw.githubusercontent.com/microsoft/generative-ai-for-beginners/main/translations/zh-CN/19-slm/README.md"
course: "Microsoft Generative AI for Beginners"
lesson_number: 19
tier: supporting
aliases:
  - "Genai L19 Building With Slms"
  - "GenAI L19 Building with SLMs"
  - GenAI_L19_Building_with_SLMs
sources: []

---
## 学习目标

在本课程中，我们将介绍小型语言模型（SLM）的知识，并结合微软的 Phi-3 模型，学习文本内容、视觉和 MoE 等不同场景的应用。

课程结束时，你应该能够回答以下问题：

- 什么是 SLM？
- SLM 与 LLM 有什么区别？
- 什么是微软 Phi-3/3.5 家族？
- 如何使用微软 Phi-3/3.5 家族进行推理？

## 本课前置知识

学习本课之前，建议你已经了解：

- 大型语言模型（LLM）的基本概念和工作原理
- Transformer 架构的基本知识
- Python 编程基础
- 云服务和 API 调用的基本概念
- 模型推理（Inference）的概念

## 什么是小型语言模型

小型语言模型（Small Language Model，SLM）是大型语言模型（LLM）的缩小版本，利用了 LLM 的许多架构原则和技术，同时大幅减少了计算资源的占用。

SLM 是一类旨在生成类人文本的语言模型。与如 GPT-4 这类规模庞大的模型不同，SLM 更加紧凑和高效，适合计算资源受限的应用场景。尽管体积较小，但 SLM 仍能完成多种任务。

通常，SLM 是通过压缩或蒸馏（Distillation）LLM 构建的，旨在保留原模型的大部分功能和语言能力。模型规模的缩减降低了整体复杂度，使得 SLM 在内存使用和计算需求方面更为高效。

经过这些优化，SLM 依然能够执行广泛的自然语言处理（NLP）任务：

- **文本生成**：创建连贯且符合上下文的句子或段落
- **文本补全**：基于给定提示预测并完成句子
- **翻译**：将文本从一种语言转换为另一种语言
- **摘要**：将长文本压缩成更简洁易懂的摘要

尽管在性能或理解深度上与大型模型相比可能存在一些折衷。

## 小型语言模型的工作原理

SLM 经过大量文本数据的训练。在训练过程中，它们学习语言的模式和结构，使其能够生成语法正确且符合上下文的文本。训练流程包括：

1. **数据收集**：从各种来源收集大量文本数据
2. **预处理**：清洗和组织数据，使其适合训练
3. **训练**：使用机器学习算法教授模型如何理解和生成文本
4. **微调**：调整模型以提升其在特定任务上的表现

SLM 的发展响应了在资源受限环境（如移动设备或边缘计算平台）中部署模型的需求，在这些环境中，完整规模的 LLM 因资源消耗过大而不切实际。通过注重效率，SLM 在性能与可访问性之间取得平衡，使其能在不同领域得到更广泛应用。

## 大型语言模型（LLM）与小型语言模型（SLM）的区别

LLM 和 SLM 均基于概率机器学习的基础原理，采用相似的架构设计、训练方法、数据生成流程和模型评估技术。但这两类模型存在若干关键区别：

### 规模

LLM 与 SLM 的主要区别在于模型规模：

| 模型 | 参数量 | 说明 |
|------|--------|------|
| ChatGPT (GPT-4) | 约 1.76 万亿 | 采用编码器-解码器框架的自注意力机制 |
| Mistral 7B | 约 70 亿 | 采用滑动窗口注意力，仅含解码器 |
| Phi-3-mini | 38 亿 | 针对高效推理优化 |

架构的差异对模型的复杂度和性能有深远影响。例如，ChatGPT 采用了基于编码器-解码器框架的自注意力机制，而 Mistral 7B 采用滑动窗口注意力，使得在仅含解码器的模型架构中训练更高效。

### 理解能力

SLM 通常针对特定领域优化，专门化程度较高，但在跨领域的广泛上下文理解方面可能有限。相比之下，LLM 旨在模拟更广泛层面的类人智能。LLM 通过庞大且多样化的数据集训练，旨在不同领域表现良好，具有更高的多样性和适应性。因此，LLM 更适合多种下游任务，如自然语言处理和编程。

### 计算资源

LLM 的训练和部署资源消耗极大，通常需要大规模的 GPU 集群。例如，训练 ChatGPT 此类模型可能需要数千 GPU 长时间运行。相比之下，参数较少的 SLM 对计算资源的需求更为友好。像 Mistral 7B 此类模型可以在具备适度 GPU 能力的本地机器上训练和运行，虽然训练仍需多个 GPU 数小时。

### 偏差

偏差是 LLM 中已知的问题，主要源于训练数据的性质。这些模型通常依赖开放的互联网原始数据，可能对某些群体的代表性不足或错误标注，也可能反映出方言、地理变异和语法规则带来的语言偏见。此外，LLM 复杂的架构可能无意间放大偏差，若无细致的微调难以察觉。

相较之下，SLM 训练于更受限的领域特定数据，固有偏差风险较低，但并非完全免疫。

### 推理速度

SLM 较小的体积使其在推理速度上具有显著优势，能够在本地硬件上高效生成输出，无需大量并行计算资源。而 LLM 由于规模庞大和复杂度高，通常需依赖大量并行计算资源以保证可接受的推理时间。多用户并发时，LLM 的响应速度尤其受影响，特别是在大规模部署时。

### 总结对比

| 维度 | LLM | SLM |
|------|-----|-----|
| 参数量 | 数千亿至万亿 | 数亿至数十亿 |
| 理解范围 | 广泛、跨领域 | 专注、领域特定 |
| 计算需求 | 极高（数千 GPU） | 较低（单个 GPU 即可） |
| 偏差风险 | 较高 | 较低（但非免疫） |
| 推理速度 | 较慢 | 较快 |
| 部署场景 | 云端数据中心 | 边缘设备、移动端 |
| 适用性 | 通用任务 | 特定领域优化 |

> 注意：本课程将以微软 Phi-3 / 3.5 作为例子介绍 SLM。

## 小型语言模型的应用场景

SLM 有广泛的应用，包括：

- **聊天机器人**：提供客户支持，与用户进行对话交互
- **内容创作**：辅助写作者生成创意或草拟文章
- **教育**：帮助学生完成写作任务或学习新语言
- **无障碍辅助**：开发针对残障人士的工具，如文本转语音系统
- **边缘智能**：在 IoT 设备上实现本地智能处理
- **移动应用**：在手机端实现离线 AI 功能

## 介绍 Phi-3 / Phi-3.5 家族

Phi-3 / 3.5 家族主要面向文本、视觉和 Agent（MoE）应用场景，是微软推出的高性能小型语言模型系列。

### Phi-3 / 3.5 Instruct

主要用于文本生成、聊天补全和内容信息提取等。

**Phi-3-mini**

3.8B 参数的语言模型，可在微软 Azure AI Studio、Hugging Face 和 Ollama 平台上获得。Phi-3 模型在关键基准测试中显著优于同体量及更大型的语言模型。Phi-3-mini 表现优于同为其两倍规模的模型，而 Phi-3-small 和 Phi-3-medium 则优于更大模型，包括 GPT-3.5。

**Phi-3-small 与 Phi-3-medium**

仅用 7B 参数，Phi-3-small 在多项语言、推理、编码及数学基准上击败 GPT-3.5T。14B 参数的 Phi-3-medium 延续此趋势，领先 Gemini 1.0 Pro。

**Phi-3.5-mini**

可以看作是 Phi-3-mini 的升级版。虽参数未变（仍为 3.8B），但增强了多语言支持（支持 20+ 语言：阿拉伯语、中文、捷克语、丹麦语、荷兰语、英语、芬兰语、法语、德语、希伯来语、匈牙利语、意大利语、日语、韩语、挪威语、波兰语、葡萄牙语、俄语、西班牙语、瑞典语、泰语、土耳其语、乌克兰语）并加强了对长上下文的支持。

3.8B 参数的 Phi-3.5-mini 优于同尺寸模型，并可与规模为其两倍的模型匹敌。

### Phi-3 / 3.5 Vision

我们可以把 Phi-3/3.5 的 Instruct 模型看作 Phi 的理解能力，而 Vision 模块赋予 Phi 观察世界的"眼睛"。

**Phi-3-Vision**

Phi-3-vision 仅 4.2B 参数，继续领先更大模型，如 Claude-3 Haiku 和 Gemini 1.0 Pro V，在常规视觉推理、OCR 及表格和图表理解任务中表现优越。

**Phi-3.5-Vision**

Phi-3.5-Vision 是对 Phi-3-Vision 的升级，增加了对多图像的支持。可以视作视觉能力的提升，不仅能"看"图片，还能"看"视频。

Phi-3.5-vision 在 OCR、表格和图表理解任务中优于 Claude-3.5 Sonnet 和 Gemini 1.5 Flash，在常规视觉知识推理任务中表现相当。支持多帧输入，即可对多张输入图片进行推理。

### Phi-3.5-MoE

**专家混合（Mixture of Experts，MoE）** 使模型预训练计算成本大幅降低，这意味着可在相同算力预算下显著扩大模型或数据集规模。特别是，MoE 模型在预训练阶段可比同规模密集模型更快地达到相似质量。

Phi-3.5-MoE 由 16 个 3.8B 参数的专家模块组成。仅 6.6B 活跃参数的 Phi-3.5-MoE 在推理、语言理解和数学能力上可媲美更大规模模型。

MoE 的核心思想：在每次推理时，模型只激活与当前输入最相关的少数专家模块，而非使用所有参数。这实现了模型容量与计算效率的平衡。

### Phi 家族模型选择指南

| 模型 | 参数量 | 适用场景 | 部署环境 |
|------|--------|----------|----------|
| Phi-3.5-mini Instruct | 3.8B | 文本生成、对话、信息提取 | 边缘设备、本地 |
| Phi-3.5-Vision | 4.2B | OCR、图表理解、多图像推理 | 需 GPU 支持 |
| Phi-3.5-MoE | 6.6B（活跃） | 复杂推理、多任务 | 服务器级设备 |

## 如何使用 Phi-3/3.5 家族模型

我们希望在不同场景中使用 Phi-3/3.5，接下来将基于不同应用场景介绍如何使用。总体上分为**云端推理**和**本地推理**两大类。

### 通过云 API 推理

#### GitHub Models

GitHub 模型是最直接的方式。你可以通过 GitHub 模型快速访问 Phi-3/3.5-Instruct 模型。结合 Azure AI 推理 SDK / OpenAI SDK，可通过代码调用 API 完成 Phi-3/3.5-Instruct 的调用，也可通过 Playground 测试不同效果。

GitHub Models 的优势：
- 无需配置计算资源
- 快速原型验证
- 免费额度适合开发测试
- 统一的 API 接口

#### Azure AI Studio

若想使用视觉和 MoE 模型，则可通过 Azure AI Studio 完成调用。Azure AI Studio 提供了完整的模型管理、部署和监控界面，支持 Phi-3/3.5 Instruct、Vision 及 MoE 模型的调用。

Azure AI Studio 的优势：
- 支持所有 Phi 模型变体
- 企业级安全与合规
- 集成式模型管理
- 详细的推理日志和监控

#### NVIDIA NIM

除 Azure 和 GitHub 提供的云端模型目录方案外，你还可使用 NVIDIA NIM 完成相关调用。NVIDIA NIM（NVIDIA Inference Microservices）是一套加速推理微服务，旨在帮助开发者高效部署 AI 模型，适用于云端、数据中心和工作站等多种环境。

NVIDIA NIM 的关键特性：

- **部署简便**：NIM 允许通过一条命令部署 AI 模型，使其易于集成到现有工作流中
- **性能优化**：利用 NVIDIA 预优化的推理引擎，如 TensorRT 和 TensorRT-LLM，确保低延迟和高吞吐量
- **可扩展性**：NIM 支持 Kubernetes 的自动伸缩，能够有效处理不同的工作负载
- **安全与控制**：组织可以通过在自有管理基础设施上自托管 NIM 微服务来保持对数据和应用的控制权
- **标准 API**：NIM 提供行业标准 API，方便构建和集成聊天机器人、AI 助手等 AI 应用

NIM 是 NVIDIA AI Enterprise 的一部分，旨在简化 AI 模型的部署和运营化，确保它们能高效运行在 NVIDIA GPU 上。

### 本地运行 Phi-3/3.5

针对 Phi-3 或任何类似语言模型的推理，是指基于接收到的输入生成响应或预测的过程。当你提供提示或问题给 Phi-3 时，它会利用训练好的神经网络，通过分析训练数据中的模式和关系，推断出最可能且相关的回答。

#### Hugging Face Transformers

Hugging Face Transformers 是一个强大的库，专门用于自然语言处理（NLP）及其他机器学习任务。以下是关键特点：

1. **预训练模型**：提供成千上万的预训练模型，可用于文本分类、命名实体识别、问答、摘要、翻译和文本生成等多种任务

2. **框架互操作性**：该库支持多个深度学习框架，包括 PyTorch、TensorFlow 和 JAX。你可以在一个框架中训练模型，然后在另一个框架中使用

3. **多模态能力**：除 NLP 外，Hugging Face Transformers 还支持计算机视觉（例如图像分类、目标检测）和音频处理（如语音识别、音频分类）任务

4. **易用性**：该库提供 API 和工具，方便下载和微调模型，适合初学者和专家使用

5. **社区与资源**：Hugging Face 拥有活跃的社区以及丰富的文档、教程和指南

这是最常用的本地推理方法，但也需要 GPU 加速。毕竟，诸如 Vision 和 MoE 这类场景需要大量计算，如果未进行量化，CPU 会非常缓慢。

#### Ollama

Ollama 是一个旨在让你更容易在本地机器上运行大型语言模型（LLM）的平台。它支持多种模型，如 Llama 3.1、Phi 3、Mistral 和 Gemma 2 等。该平台通过将模型权重、配置和数据打包成一个包简化了过程，使用户更易于自定义和创建自己的模型。

Ollama 支持 macOS、Linux 和 Windows。如果你想尝试或部署 LLM 但不依赖云服务，Ollama 是一个很好的工具。它是最直接的方法，只需执行以下命令即可：

```bash
ollama run phi3.5
```

Ollama 的优势：
- 一键运行，无需编写代码
- 自动管理模型下载和缓存
- 支持多平台
- 提供 REST API 供应用调用

#### ONNX Runtime for GenAI

ONNX Runtime 是一个跨平台的推理和训练机器学习加速器。ONNX Runtime for Generative AI（GENAI）是一个强大的工具，帮助你在各种平台上高效运行生成式 AI 模型。

**什么是 ONNX Runtime？**

ONNX Runtime 是一个开源项目，使机器学习模型能够高性能推理。它支持 Open Neural Network Exchange（ONNX）格式的模型，这是一种机器学习模型表示的标准。ONNX Runtime 推理可以带来更快的客户体验和更低的成本，支持来自深度学习框架如 PyTorch 和 TensorFlow/Keras，以及经典机器学习库如 scikit-learn、LightGBM、XGBoost 等的模型。ONNX Runtime 兼容不同硬件、驱动和操作系统，并通过利用硬件加速器及图优化和转换提供最佳性能。

**ONNX Runtime for GENAI 的主要特性：**

- **广泛的平台支持**：兼容 Windows、Linux、macOS、Android 和 iOS
- **模型支持**：支持许多流行的生成式 AI 模型，如 LLaMA、GPT-Neo、BLOOM 等
- **性能优化**：针对 NVIDIA GPU、AMD GPU 等硬件加速器进行了优化
- **易用性**：提供 API 方便集成，你可以用最少代码生成文本、图像等内容
- **灵活的生成控制**：用户可以调用高级的 `generate()` 方法，或者在循环中逐一生成 token，并可选择在循环内部更新生成参数
- **搜索策略**：支持贪婪搜索、束搜索（Beam Search）和 TopP、TopK 采样来生成 token 序列，并内置了如重复惩罚的 logits 处理

**入门指南：**

安装 ONNX Runtime：

```python
pip install onnxruntime
```

安装生成式 AI 扩展：

```python
pip install onnxruntime-genai
```

运行示例模型：

```python
import onnxruntime_genai as og

model = og.Model('path_to_your_model.onnx')
tokenizer = og.Tokenizer(model)

input_text = "Hello, how are you?"
input_tokens = tokenizer.encode(input_text)
output_tokens = model.generate(input_tokens)
output_text = tokenizer.decode(output_tokens)

print(output_text)
```

**使用 ONNX Runtime GenAI 调用 Phi-3.5-Vision 的完整示例：**

```python
import onnxruntime_genai as og

model_path = './Your Phi-3.5-vision-instruct ONNX Path'
img_path = './Your Image Path'

model = og.Model(model_path)
processor = model.create_multimodal_processor()
tokenizer_stream = processor.create_stream()

text = "Your Prompt"
prompt = "<|user|>\n"
prompt += "<|image_1|>\n"
prompt += f"{text}<|end|>\n"
prompt += "<|assistant|">\n"

image = og.Images.open(img_path)
inputs = processor(prompt, images=image)

params = og.GeneratorParams(model)
params.set_inputs(inputs)
params.set_search_options(max_length=3072)

generator = og.Generator(model, params)

while not generator.is_done():
    generator.compute_logits()
    generator.generate_next_token()
    new_token = generator.get_next_tokens()[0]
    output = tokenizer_stream.decode(new_token)
    print(tokenizer_stream.decode(new_token), end='', flush=True)
```

#### 其他框架

除了 ONNX Runtime 和 Ollama 之外，我们还可以基于不同厂商提供的模型参考方法完成量化模型的推理：

| 框架 | 厂商 | 硬件加速 | 适用场景 |
|------|------|----------|----------|
| **MLX** | Apple | Apple Metal (GPU) | Mac 设备本地推理 |
| **QNN** | Qualcomm | NPU (神经网络处理器) | 移动设备推理 |
| **OpenVINO** | Intel | CPU/GPU/VPU | Intel 硬件优化推理 |

## Phi-3 Cookbook 更多资源

我们已经学习了 Phi-3/3.5 系列的基础知识，但要深入了解 SLM，我们还需更多知识。答案可以在 Phi-3 Cookbook 中找到，该资源库提供了更丰富的示例代码、教程和最佳实践。

Phi-3 Cookbook 包含：
- 不同语言和框架的推理示例
- 微调教程和配置指南
- 多种部署场景的最佳实践
- 性能基准测试和优化建议

## 作业 / 练习

请完成以下练习来巩固你的学习：

1. **基础练习**：使用 Ollama 在本地运行 Phi-3.5-mini，测试文本生成和对话功能
2. **进阶练习**：使用 Hugging Face Transformers 加载 Phi-3.5-Vision 模型，对一张图片进行 OCR 和内容描述
3. **高级练习**：使用 ONNX Runtime 部署 Phi-3.5 模型，对比不同搜索策略（贪婪搜索 vs 束搜索 vs TopK 采样）的效果和性能
4. **云端对比练习**：分别通过 GitHub Models 和 Azure AI Studio 调用 Phi-3.5-mini，比较响应速度和输出质量

## 知识检查

**问题**：小型语言模型（SLM）相比大型语言模型（LLM）的核心优势是什么？

1. SLM 在所有任务上的表现都优于 LLM
2. SLM 参数量更少，计算资源需求更低，更适合边缘部署和资源受限场景
3. SLM 不需要任何训练数据即可使用

**答案**：2

**解析**：

小型语言模型（SLM）是 LLM 的缩小版本，通过压缩或蒸馏技术构建，大幅减少了计算资源占用。SLM 在参数量、推理速度和部署灵活性方面具有显著优势，特别适合移动设备、IoT 等资源受限环境。但 SLM 在跨领域的广泛理解和复杂推理方面可能不如大型模型，因此需要根据具体应用场景选择合适的模型规模。

## 扩展阅读

- [[05_大模型/12_Edge_LLM/Edge_LLM_Deep_Dive|边缘LLM深度指南]]
- [[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques|微调技术综述]]
- [[05_大模型/14_Global_LLM_Ecosystem/Mistral_AI_Deep_Dive|Mistral AI 深度指南]]
- [[05_大模型/14_Global_LLM_Ecosystem/Meta_LLaMA_Deep_Dive|Meta LLaMA 深度指南]]
- [[90_学习/courses/microsoft/microsoft_genai_for_beginners|Microsoft GenAI 入门课程]]

## 课程导航

| 上一课 | 下一课 |
|--------|--------|
| [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs|L18 微调大型语言模型]] | [[05_大模型/14_Global_LLM_Ecosystem/GenAI_L20_Building_with_Mistral|L20 使用Mistral模型构建]] |