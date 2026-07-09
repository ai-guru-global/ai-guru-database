---
title: "语音与音频 AI (Speech & Audio AI)"
category: -concepts
tags: ["nlp", "speech", "audio", "ASR", "TTS", "whisper", "cosyvoice", "audio-llm"]
relationships:
  - target: "_concepts/llm-architectures"
    type: builds_on
  - target: "_concepts/multimodal-models"
    type: related_to
  - target: "_concepts/transformer-architecture"
    type: builds_on
sources:
  - 大模型/Speech_Audio_AI
summary: "语音AI覆盖自动语音识别(ASR/Whisper)、语音合成(TTS/CosyVoice)、音频理解(AudioLM)、音乐生成(MusicGen/Suno)、实时语音对话(GPT-4o/Moshi)。"
provenance:
  extracted: 0.40
  inferred: 0.50
  ambiguous: 0.10
base_confidence: 0.87
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-06-04
aliases:
  - "Speech Audio Ai"
  - "speech audio ai"

---
# 语音与音频 AI (Speech & Audio AI)

> AI 感知层的核心模态——让机器「听懂」和「说出」人类语言及所有声音。

---

## 1. 定义

**语音与音频 AI** 涵盖所有与声音信号相关的 AI 技术，包括语音识别（ASR）、语音合成（TTS）、音频理解、音乐生成、实时语音对话等。2024-2026 年，随着 Whisper 的大规模弱监督训练和 GPT-4o 的原生音频能力，语音 AI 进入了大模型时代。

---

## 2. 技术全景

```
语音与音频 AI 技术栈
│
├── 语音识别 (ASR) — 声音 → 文字
│   ├── 自回归: Whisper, SeamlessM4T
│   ├── 非自回归: Paraformer, Zipformer
│   └── 流式: Streaming-ASR, WeNet
│
├── 语音合成 (TTS) — 文字 → 声音
│   ├── 端到端: VITS, VITS2
│   ├── 零样本克隆: CosyVoice, Fish Speech
│   └── 可控: Bark, XTTS
│
├── 音频理解 — 声音 → 语义
│   ├── 音频LLM: Qwen-Audio, SALMONN
│   ├── 音频Token化: AudioLM, SoundStream
│   └── 多模态: Gemini (原生音频)
│
├── 实时对话 — 声音 ↔ 声音
│   ├── 原生音频: GPT-4o, Gemini Live
│   └── 开源双工: Moshi, GLM-4-Voice
│
└── 音乐与音效生成
    ├── 音乐: Suno v4, Udio, MusicGen
    └── 音效: AudioGen, Make-An-Audio
```

---

## 3. 语音识别 (ASR)

### 3.1 主流方案对比

| 模型 | 参数量 | 训练数据 | 语言 | 特点 |
|------|--------|----------|------|------|
| **Whisper** (OpenAI) | 39M-1.5B | 68 万小时弱监督 | 99 种 | 鲁棒性极强，开箱即用 |
| **Paraformer** (阿里) | ~1B | 大规模中文 | 中/英 | 非自回归，流式推理 |
| **SeamlessM4T** (Meta) | 2.3B | 百万小时 | 100+ | 端到端多语言翻译 |
| **USM** (Google) | 2B | 1200 万小时 | 300+ | 最大规模多语言 |
| **WeNet** (出门问问) | - | 开源 | 多语言 | 流式+非流式统一框架 |

### 3.2 关键技术

| 技术 | 说明 |
|------|------|
| **弱监督学习** | Whisper 用互联网弱标注数据（68万小时），超越强监督 SOTA |
| **Conformer** | CNN + Transformer 混合，局部+全局特征融合 |
| **流式推理** | 分块处理音频，Chunk Size 控制延迟/精度权衡 |
| **端到端** | 直接从音频到文本，无需传统 ASR pipeline（声学→语言→解码） |

---

## 4. 语音合成 (TTS)

### 4.1 技术演进

| 时代 | 代表 | 质量 | 速度 |
|------|------|------|------|
| **拼接合成** | Festival, MARY | 机械感 | 快 |
| **参数合成** | Tacotron 2, WaveNet | 自然 | 慢（自回归） |
| **端到端** | VITS (VAE+Flow+GAN) | 接近真人 | 实时 |
| **零样本克隆** | CosyVoice, Fish Speech, XTTS | 高 | 实时 |
| **语音大模型** | GPT-4o, Moshi | 真人级 | 实时+双工 |

### 4.2 CosyVoice（阿里通义）

| 特性 | 说明 |
|------|------|
| **零样本语音克隆** | 3-10 秒参考音频即可克隆 |
| **跨语言合成** | 中/英/日/韩等多语言 |
| **细粒度控制** | 支持情感、语速、音调控制 |
| **流式输出** | 首包延迟 < 150ms |
| **开源** | CosyVoice 2 开源，支持二次开发 |

---

## 5. 音频大模型 (Audio LLM)

| 模型 | 架构 | 能力 |
|------|------|------|
| **AudioLM** (Google) | 语义token + 声学token | 音频续写、钢琴演奏生成 |
| **Qwen-Audio** (阿里) | 音频编码器 + LLM | 音频问答、音频理解 |
| **SALMONN** | Whisper + BEATs + LLM | 双编码器音频理解 |
| **Gemini** | 原生多模态 | 原生音频输入输出 |
| **GPT-4o** | 原生音频 | 语音对话，情感表达 |

---

## 6. 音乐生成

| 系统 | 架构 | 特点 |
|------|------|------|
| **MusicGen** (Meta) | 单阶段 Transformer | 文本→音乐，开源 |
| **Suno v4** | 未公开 | 商业级，含人声歌词 |
| **Udio** | 未公开 | 高保真，多风格 |
| **Stable Audio** (Stability) | Latent Diffusion | 开源音频扩散模型 |

---

## 7. 实时语音对话

| 系统 | 延迟 | 双工 | 开源 |
|------|------|------|------|
| **GPT-4o** | < 320ms | 是 | 否 |
| **Gemini Live** | 实时 | 是 | 否 |
| **Moshi** (Kyutai) | ~200ms | 是 | 是 |
| **GLM-4-Voice** (智谱) | 实时 | 是 | 部分 |

---

## 8. 音频表征学习

| 方法 | 原理 | 应用 |
|------|------|------|
| **CLAP** | 文本-音频对比学习 | 音频检索、零样本分类 |
| **Audio Spectrogram Transformer** | ViT on 声谱图 | 音频分类、事件检测 |
| **SoundStream/EnCodec** | 神经音频编解码 | 音频压缩、tokenization |
| **Whisper Encoder** | 大规模弱监督特征 | 下游音频任务的通用特征提取器 |

---

## 9. 局限与开放问题

1. **低资源语言**：99% 的语言缺乏 ASR/TTS 训练数据
2. **噪声鲁棒性**：极端噪声环境下 ASR 性能急剧下降
3. **长音频理解**：小时级音频（会议、播客）的全局理解仍困难
4. **语音幻觉**：音频 LLM 可能生成不存在的音频内容
5. **Deepfake 风险**：零样本语音克隆带来的安全和伦理挑战

---

## Related

- [[大模型/Speech_Audio_AI/README]] — 语音与音频 AI 深度解析
- [[_concepts/llm-architectures]] — LLM 架构（语音 LLM 基础）
- [[_concepts/multimodal-models]] — 多模态模型（音频多模态）
- [[_concepts/transformer-architecture]] — Transformer（语音模型基础架构）
