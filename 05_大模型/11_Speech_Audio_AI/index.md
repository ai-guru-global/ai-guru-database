---
title: Speech & Audio AI
type: index
created: 2026-07-02
updated: 2026-07-21
sources: []
tags: [auto-index]
name_zh: "语音音频 AI"
name_en: "Speech Audio AI"
---

# Speech & Audio AI

> 中文简称：语音音频 AI ｜ English Name: Speech Audio AI

语音与音频 AI（Speech & Audio AI）— ASR、TTS、语音克隆（voice cloning）与音频生成的核心技术。

## 子域简介

本子域聚焦语音和音频 AI 技术：

- **ASR**: 自动语音识别 (Whisper)
- **TTS**: 文本转语音 (VALL-E, Bark)
- **语音克隆**: 零样本语音合成
- **音频生成**: 音乐和音效生成

## 文件导航

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| [[05_大模型/11_Speech_Audio_AI/Speech_Audio_AI_Deep_Dive|Speech Audio AI Deep Dive]] | Speech AI deep dive: Whisper, VALL-E and voice cloning technology | speech AI engineers / audio researchers |
| [[05_大模型/11_Speech_Audio_AI/README|README]] | Module README guide and reading order | all readers |

## 核心概念速查

| 概念 | 说明 | 代表技术 |
|------|------|------|
| ASR | 语音转文字 | Whisper |
| TTS | 文字转语音 | VALL-E, Bark |
| 语音克隆 | 零样本语音合成 | VALL-E, XTTS |
| 音频生成 | 音乐/音效生成 | MusicGen, AudioLDM |
| 声纹识别 | 说话人识别 | ECAPA-TDNN |

## 技术架构演进

| 时期 | 技术 | 代表 | 特点 |
|------|------|------|------|
| 2010s | HMM-DNN | Kaldi | 统计方法 |
| 2018 | E2E ASR | DeepSpeech | 端到端 |
| 2022 | 大规模 ASR | Whisper | 多语言 |
| 2023 | 零样本 TTS | VALL-E | 语音克隆 |
| 2024 | 统一模型 | SpeechGPT | 多模态 |

## 常见问题

| 问题 | 解答 |
|------|------|
| Whisper 支持哪些语言？ | 99 种语言 |
| 语音克隆需要多少样本？ | 零样本只需 3秒 |
| TTS 质量如何评估？ | MOS 评分 |
| 实时性如何？ | 取决于模型和硬件 |

## Related

- [[05_大模型/index|大模型首页]]
- [[05_大模型/02_Sequence_Models/index|Sequence Models]]
- [[概念/General/speech-audio-ai|语音识别]]

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 2 |
| 最后更新 | 2026-07-21 |

> 💡 语音 AI 正在从专用模型向统一多模态模型演进，Whisper 和 VALL-E 是当前的里程碑。

## 附录：ASR 模型对比

| 模型 | 语言 | 准确率 | 速度 | 开源 |
|------|------|------|------|------|
| Whisper large | 99 | 高 | 中 | 是 |
| Whisper turbo | 99 | 中高 | 快 | 是 |
| DeepSpeech | 多 | 中 | 快 | 是 |
| Wav2Vec 2.0 | 多 | 高 | 中 | 是 |

## 附录：TTS 模型对比

| 模型 | 特点 | 质量 | 速度 | 开源 |
|------|------|------|------|------|
| VALL-E | 零样本克隆 | 高 | 中 | 否 |
| Bark | 多语言 | 中高 | 中 | 是 |
| XTTS | 克隆 | 高 | 快 | 是 |
| Piper | 轻量 | 中 | 快 | 是 |

## 附录：应用场景

| 场景 | 技术 | 说明 |
|------|------|------|
| 会议转录 | ASR | 实时/离线 |
| 有声书 | TTS | 自然语音 |
| 语音助手 | ASR+TTS | 对话交互 |
| 配音 | 语音克隆 | 多语言 |
| 音乐生成 | 音频生成 | 创意内容 |

## 附录：评估指标

| 指标 | 说明 | 测量方法 |
|------|------|------|
| WER | 词错误率 | ASR 准确率 |
| MOS | 平均意见分 | TTS 质量 |
| RTF | 实时因子 | 速度 |
| SIM | 说话人相似度 | 克隆质量 |

## 附录：工具链

| 工具 | 用途 | 说明 |
|------|------|------|
| Whisper | ASR | OpenAI 开源 |
| Coqui TTS | TTS | 开源 TTS |
| Bark | TTS | Suno 开源 |
| Audacity | 音频编辑 | 开源工具 |

## 附录：学习路径

| 阶段 | 内容 | 目标 |
|------|------|------|
| 入门 | 语音处理基础 | 理解音频信号 |
| 进阶 | Whisper 实践 | ASR 应用 |
| 拓展 | TTS 技术 | 语音合成 |
| 实践 | 语音克隆 | 零样本合成 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 自动语音识别 | ASR | 语音转文字 |
| 文本转语音 | TTS | 文字转语音 |
| 语音克隆 | Voice Cloning | 复制声音 |
| 声纹 | Voiceprint | 声音特征 |
| 梅尔频谱 | Mel Spectrogram | 音频特征表示 |

## 附录：音频预处理

| 步骤 | 说明 | 工具 |
|------|------|------|
| 重采样 | 统一采样率 (16kHz) | librosa |
| 降噪 | 去除背景噪声 | noisereduce |
| 分帧 | 切分音频帧 | torchaudio |
| 特征提取 | MFCC/梅尔频谱 | librosa |
| 增强 | 数据增强 | audiomentations |

## 附录：多语言支持

| 语言 | ASR 支持 | TTS 支持 | 说明 |
|------|------|------|------|
| 英语 | ✅ | ✅ | 最佳支持 |
| 中文 | ✅ | ✅ | 良好支持 |
| 日语 | ✅ | ✅ | 良好支持 |
| 韩语 | ✅ | ✅ | 良好支持 |
| 其他 | ✅ | 部分 | Whisper 99 种 |

## 附录：实时 vs 离线

| 模式 | 延迟 | 准确率 | 适用场景 |
|------|------|------|------|
| 实时 | <500ms | 中 | 直播、会议 |
| 离线 | 无要求 | 高 | 转录、字幕 |
| 流式 | <1s | 中高 | 语音助手 |

## 附录：安全与伦理

| 问题 | 风险 | 应对 |
|------|------|------|
| 深度伪造 | 声音克隆滥用 | 水印、检测 |
| 隐私 | 声纹泄露 | 加密、匿名化 |
| 偏见 | 口音识别差异 | 多样化训练 |
| 版权 | 声音版权 | 授权、合规 |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 统一多模态 | 语音+文本+视觉 | 更自然交互 |
| 零样本克隆 | 3秒克隆声音 | 个性化 TTS |
| 实时翻译 | 语音实时翻译 | 无障碍沟通 |
| 情感识别 | 语音情感分析 | 智能客服 |
| 端侧部署 | 手机本地运行 | 隐私保护 |

## 附录：相关论文

| 论文 | 年份 | 贡献 |
|------|------|------|
| Whisper | 2022 | 大规模多语言 ASR |
| VALL-E | 2023 | 零样本 TTS |
| Bark | 2023 | 开源多语言 TTS |
| MusicGen | 2023 | 音乐生成 |
| SpeechGPT | 2024 | 统一语音模型 |

> 💡 语音 AI 的核心价值：让人机交互更自然、更无障碍。

---
*Last updated: 2026-07-21*

