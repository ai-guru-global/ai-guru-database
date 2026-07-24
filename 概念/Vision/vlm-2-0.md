---
title: "VLM 2.0 / 视觉语言模型 2.0 (Qwen2.5-VL / InternVL 3 / LLaVA-OneVision / 2025 SOTA)"
category: concepts
tags:
  - vision
  - vlm
  - vision-language-model
  - qwen2.5-vl
  - internvl-3
  - llava-onevision
  - multimodal
aliases:
  - VLM 2.0
  - Vision-Language Model 2.0
  - Qwen2.5-VL
  - InternVL 3
  - LLaVA-OneVision
  - 2025 VLM SOTA
relationships:
  - target: "概念/vision-language-model"
    type: extends
  - target: "概念/multimodal-models"
    type: related_to
  - target: "概念/qwen-series"
    type: related_to
  - target: "概念/internlm-3-series"
    type: related_to
summary: "VLM 2.0 是 2024-2026 突破"图文理解天花板"的关键——Qwen2.5-VL(阿里,72B SOTA,视频 / OCR / Agent 原生)、InternVL 3(上海 AI Lab,8B/14B/38B/78B)、LLaVA-OneVision(字节 + UW)、Molmo(AI2)、Janus(DeepSeek 解耦 VLM)。是 OCR / 文档理解 / 视频理解 / GUI Agent 的核心。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# VLM 2.0 / 视觉语言模型 2.0

> **一句话理解**:VLM 2.0 是 2024-2026 突破"图文 SOTA"的关键——Qwen2.5-VL(72B SOTA)、InternVL 3(78B SOTA)、LLaVA-OneVision(字节 + UW,76B SOTA)、Molmo(AI2,72B 数据透明)、Janus(DeepSeek 解耦视觉编码)。中文 / OCR / 视频 / Agent 全部 SOTA。

---

## 一、为什么需要 VLM 2.0?

早期 VLM(LLaVA / MiniGPT-4)的问题:
- 视觉编码器弱(CLIP)
- 分辨率低(224×224)
- 中文弱
- 视频 / Agent 弱
- 数据不透明

VLM 2.0 解法:
- **原生多模态**:从预训练开始多模态
- **高分辨率**:动态分辨率(Dynamic Resolution)
- **多任务**:OCR + 文档 + 视频 + Agent
- **中文 SOTA**:Qwen / InternVL / StepFun

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 视觉语言模型 | Vision-Language Model(VLM) | 图文统一 |
| 多模态大模型 | Multimodal Large Language Model(MLLM) | 同上 |
| 动态分辨率 | Dynamic Resolution | 按需调整 |
| 视觉编码器 | Vision Encoder | ViT / SigLIP |
| 视觉 Token | Visual Token | 图像 → tokens |
| 投影层 | Projection Layer | vision → text 空间 |
| OCR | Optical Character Recognition | 文字识别 |
| 文档理解 | Document Understanding | 表格 / 图表 |
| 视频理解 | Video Understanding | 跨帧时序 |
| GUI Agent | GUI Agent | 屏幕操作 |
| 多模态 Agent | Multimodal Agent | 工具调用 |
| Native 多模态 | Native Multimodal | 从头训练 |
| 解耦 VLM | Decoupled VLM | Janus 风格 |
| 视觉 Token 压缩 | Visual Token Compression | 减少 token |
| 模态对齐 | Modality Alignment | 跨模态对齐 |
| 数据透明 | Open Data | Molmo / Cambrian |
| 多图像 | Multi-Image | 多图输入 |
| 视频流 | Video Stream | 实时视频 |
| 图表问答 | Chart QA | 图表理解 |
| 屏幕截图 | Screenshot | UI 截图 |

---

## 三、主流 VLM 对比(2026-02 快照)

| 模型 | 厂商/团队 | 规模 | MMMU | OCRBench | 视频 | 中文 | 许可证 |
|---|---|---|---|---|---|---|---|
| **Qwen2.5-VL-72B** | 阿里 | 72B | 70.3 | 88.5 | 强 | 极强 | Apache 2.0 |
| **Qwen2.5-VL-7B** | 阿里 | 7B | 60.6 | 86.4 | 强 | 极强 | Apache 2.0 |
| **InternVL3-78B** | 上海 AI Lab | 78B | 72.2 | 90.1 | 强 | 极强 | MIT |
| **InternVL3-8B** | 上海 AI Lab | 8B | 60.8 | 87.5 | 强 | 极强 | MIT |
| **LLaVA-OneVision-72B** | 字节 + UW | 72B | 67.5 | 82.0 | 中 | 弱 | Apache 2.0 |
| **Molmo-72B** | AI2 | 72B | 65.5 | 78.0 | 中 | 弱 | Apache 2.0 |
| **Janus-Pro-7B** | DeepSeek | 7B | 67.0 | 75.0 | 中 | 强 | MIT |
| **Janus-Pro-13B** | DeepSeek | 13B | 70.0 | 78.0 | 中 | 强 | MIT |
| **GPT-5**(视觉) | OpenAI | 闭源 | 82.0 | 95.0 | 极强 | 强 | 商业 |
| **Claude Opus 4.5** | Anthropic | 闭源 | 78.5 | 92.0 | 强 | 强 | 商业 |
| **Gemini 2.5 Pro** | Google | 闭源 | 81.3 | 94.0 | 极强 | 强 | 商业 |
| **Doubao-1.5-vision** | 字节 | 闭源 | 73.2 | 89.0 | 强 | 极强 | 商业 |
| **Step-1V** | 阶跃星辰 | 闭源 | 65.0 | 85.0 | 中 | 极强 | 商业 |
| **Hunyuan-Vision** | 腾讯 | 闭源 | 66.5 | 84.0 | 强 | 极强 | 商业 |
| **InternLM-XComposer** | 上海 AI Lab | 8B-78B | 70.0 | 89.0 | 强 | 极强 | MIT |

> MMMU 是多模态理解综合基准,OCRBench 是 OCR 专项

---

## 四、Qwen2.5-VL 详解(阿里)

### 4.1 核心创新

- **原生多模态**:从 Qwen2.5 训练起就是多模态
- **动态分辨率**:支持任意分辨率,无固定 tile
- **视频原生**:Qwen2.5-VL 在预训练就有视频
- **Agent 原生**:屏幕截图 + 工具调用
- **OCR 增强**:中文 + 公式 + 化学式 + 表格

### 4.2 关键能力

- **绝对时间戳**:理解视频中"什么时候发生"
- **超长视频**:小时级视频分析
- **多图像**:> 10 张图同时输入
- **GUI Agent**:屏幕操作

### 4.3 模型矩阵

- 3B / 7B / 32B / 72B
- 视觉编码器:ViT 自研
- 上下文:128K

### 4.4 实战

```python
from transformers import Qwen2_5_VLForConditionalGeneration, AutoProcessor

model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
    "Qwen/Qwen2.5-VL-72B-Instruct", device_map="auto"
)
processor = AutoProcessor.from_pretrained("Qwen/Qwen2.5-VL-72B-Instruct")

messages = [{
    "role": "user",
    "content": [
        {"type": "image", "image": "image.png"},
        {"type": "text", "text": "描述这张图"},
    ],
}]

text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
inputs = processor(text=[text], images=[image], return_tensors="pt")
output = model.generate(**inputs, max_new_tokens=200)
```

### 4.5 论文与代码

- 论文 [arxiv.org/abs/2502.13923](https://arxiv.org/abs/2502.13923)
- 博客 [qwenlm.github.io/blog/qwen2.5-vl](https://qwenlm.github.io/blog/qwen2.5-vl/)
- 模型 [huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct)

---

## 五、InternVL3 详解(上海 AI Lab)

### 5.1 核心创新

- **渐进式训练**:从 InternVL 1 → 2 → 3 迭代
- **多模态对齐**:更强的视觉 - 语言对齐
- **原生动态分辨率**:256 → 1024 动态
- **OCR / 文档 SOTA**:中文 + 公式

### 5.2 模型矩阵

- 1B / 2B / 8B / 14B / 38B / 78B
- InternVL3-78B 是开源 SOTA
- 多语言(中英日韩)

### 5.3 实战

```python
from transformers import AutoModel, AutoTokenizer

model = AutoModel.from_pretrained(
    "OpenGVLab/InternVL3-78B",
    trust_remote_code=True,
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("OpenGVLab/InternVL3-78B", trust_remote_code=True)
```

---

## 六、Janus-Pro 详解(DeepSeek)

### 6.1 核心创新

- **解耦视觉编码**:理解用 SigLIP,生成用特定编码
- **单模型双能力**:理解 + 生成同模型
- **训练效率高**:单一 backbone

### 6.2 优势

- 一致性强
- 生成质量好
- 训练简单

---

## 七、VLM 2.0 应用

### 7.1 文档理解

- 财报分析
- 合同提取
- 学术论文图表

### 7.2 视频理解

- 长视频 QA
- 视频摘要
- 监控分析

### 7.3 GUI Agent

- 见 Agent 子域的 computer-use / gui-agent
- Qwen2.5-VL、UI-TARS 都是 SOTA

### 7.4 多模态 RAG

- 图文混合检索
- 见 RAG 子域的 multimodal-rag

---

## 八、生产最佳实践

1. **中文场景首选 Qwen2.5-VL / InternVL3**:中文 OCR / 文档 SOTA。
2. **英文 / 通用首选 LLaVA-OneVision / Molmo**:数据透明。
3. **生成 + 理解用 Janus-Pro**:一站式。
4. **闭源 SOTA 选 GPT-5 / Claude Opus 4.5 / Gemini 2.5**:质量最高。
5. **OCR 任务选 InternVL3 / Qwen2.5-VL**:中文 OCR 领先。
6. **视频理解选 Qwen2.5-VL / VideoLLaMA 3**:长视频 SOTA。
7. **GUI Agent 选 Qwen2.5-VL / UI-TARS**:屏幕操作 SOTA。
8. **动态分辨率**:不要预先 resize,用模型原生支持。
9. **多图像 / 视频**:用消息格式多图输入。
10. **量化部署**:AWQ / GPTQ 量化,显存降 50%。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Qwen2.5-VL** | 72B / 7B / 3B,中文 SOTA |
| **InternVL3** | 78B / 8B,开源 SOTA |
| **LLaVA-OneVision** | 76B,UW 主导 |
| **Molmo** | 72B,数据透明 |
| **Janus-Pro** | 13B,解耦 VLM |
| **VideoLLaMA 3** | 视频 SOTA,字节 + 上海 AI Lab |
| **GPT-5 Vision** | 闭源最强,82% MMMU |
| **Claude Opus 4.5** | 闭源,GUI SOTA |
| **ARR 规模** | 多模态 ARR $5B+ |
| **主要竞品** | Qwen / InternVL / LLaVA / Molmo / Janus / GPT / Claude / Gemini |

---

## 十、See Also(官方源)

### Qwen2.5-VL

- 论文 [arxiv.org/abs/2502.13923](https://arxiv.org/abs/2502.13923)
- 博客 [qwenlm.github.io/blog/qwen2.5-vl](https://qwenlm.github.io/blog/qwen2.5-vl/)
- 模型 [huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct)

### InternVL3

- 论文 [arxiv.org/abs/2504.10479](https://arxiv.org/abs/2504.10479)
- 仓库 [github.com/OpenGVLab/InternVL](https://github.com/OpenGVLab/InternVL)

### LLaVA-OneVision

- 论文 [arxiv.org/abs/2408.03326](https://arxiv.org/abs/2408.03326)
- 仓库 [github.com/lmms-lab/LLaVA-OneVision](https://github.com/lmms-lab/LLaVA-OneVision)

### Molmo

- 论文 [arxiv.org/abs/2409.17146](https://arxiv.org/abs/2409.17146)
- 仓库 [github.com/allenai/Molmo](https://github.com/allenai/Molmo)
- 数据 [github.com/allenai/Molmo](https://github.com/allenai/Molmo)

### Janus

- 论文 [arxiv.org/abs/2410.13848](https://arxiv.org/abs/2410.13848)
- 仓库 [github.com/deepseek-ai/Janus](https://github.com/deepseek-ai/Janus)

### VideoLLaMA 3

- 论文 [arxiv.org/abs/2501.13104](https://arxiv.org/abs/2501.13104)
- 仓库 [github.com/DAMO-NLP-SG/VideoLLaMA3](https://github.com/DAMO-NLP-SG/VideoLLaMA3)

---

## 十一、相关概念卡

- [[概念/vision-language-model|Vision Language Model]]
- [[概念/multimodal-models|Multimodal Models]]
- [[概念/qwen-series|Qwen Series]]
- [[概念/internlm-3-series|Internlm 3 Series]]
- [[概念/multimodal-rag|Multimodal Rag]]
- [[概念/multimodal-llm|Multimodal Llm]]
- [[概念/sam-2|Sam 2]]
- [[概念/document-ai|Document Ai]]
