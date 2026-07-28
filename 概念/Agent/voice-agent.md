---
title: "Voice Agent / 语音 Agent (Realtime API / Pipecat / Voiceflow / Hume)"
category: concepts
tags:
  - agent
  - voice-agent
  - realtime-api
  - pipecat
  - voiceflow
  - hume
  - speech
  - stt
  - tts
  - turn-taking
aliases:
  - Voice Agent
  - Realtime API
  - Pipecat
  - Voiceflow
  - Hume EVI
  - Conversational AI
relationships:
  - target: "概念/agent-loop"
    type: extends
  - target: "概念/speech-audio-ai"
    type: related_to
  - target: "概念/mcp"
    type: related_to
  - target: "概念/multi-modal-agent"
    type: related_to
summary: "Voice Agent 是 2024-2026 爆发的"语音 LLM"赛道——OpenAI Realtime API、Anthropic Claude with Voice、Google Gemini Live、Pipecat、Daily.co、Hume EVI 用流式 STT+LLM+TTS 实现"200ms 内可打断的多模对话",是客服 / 销售 / 教育 / 医疗的核心场景。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "Voice Agent / 语音 Agent"
---

# Voice Agent / 语音 Agent

> 中文简称：Voice Agent / 语音 Agent

> **一句话理解**:Voice Agent 让 LLM 真的"开口说话 + 听懂"——端到端流式语音对话(< 200ms 延迟 + 自然打断 + 情感识别),不再是"语音转文字 + 文字转语音"的拼接。2024-10 OpenAI Realtime API 开启新时代,2026 已成客服 / 销售标配。

---

## 一、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 语音 Agent | Voice Agent | 语音输入输出的对话 Agent |
| 实时 API | Realtime API | OpenAI/Anthropic/Google 推出的端到端流式 API |
| 语音转文字 | Speech-to-Text(STT) | 音频转文本 |
| 文字转语音 | Text-to-Speech(TTS) | 文本转音频 |
| 语音到语音 | Speech-to-Speech(S2S) | 端到端,不经文本 |
| 全双工 | Full-Duplex | 边说边听,不打断 |
| 半双工 | Half-Duplex | 说完再听 |
| 轮次检测 | Turn-Taking | 判断用户说完了 / 插话 |
| 打断 | Interruption/Barge-in | 用户打断 Agent 时立即停止 |
| 情感识别 | Emotion Detection | 从音频识别情绪 |
| 语速控制 | Pacing | 调整说话速度 |
| 流式响应 | Streaming | 分块返回,降低首字延迟 |
| 首字延迟 | Time to First Byte(TTFB) | 用户说完到 Agent 开始说话 |
| 端到端延迟 | End-to-End Latency | 完整对话周转时间 |
| 声音克隆 | Voice Cloning | 复制特定人声 |
| 多人对话 | Multi-Party Conversation | 多人会议场景 |
| 静音检测 | Voice Activity Detection(VAD) | 检测是否在说话 |
| 噪声抑制 | Noise Suppression | 去除背景噪音 |
| 远场 | Far-Field | 1-3 米外拾音 |
| 通话质量 | Call Quality | MOS 评分,5 分制 |
| 转录 | Transcription | 实时转写对话 |
| 智能体 | Agent | 自主决策的 LLM |

---

## 二、主流 Voice Agent 平台对比(2026-02 快照)

| 平台 | 厂商 | 端到端延迟 | 打断 | 情感 | 许可证 | 特色 |
|---|---|---|---|---|---|---|
| **OpenAI Realtime API** | OpenAI | 200-500ms | ✓ | ✓(GPT-4o 内置) | 商业 | 端到端 S2S,SOTA |
| **Anthropic Claude with Voice** | Anthropic | 300-600ms | ✓ | ✓ | 商业 | 2025-Q4 GA,质量最高 |
| **Google Gemini Live** | Google | 250-500ms | ✓ | ✓ | 商业 | 多语种 SOTA |
| **Pipecat** | Daily.co 开源 | 150-400ms | ✓ | 需配 | Apache 2.0 | 开源主流,管道编排 |
| **Voiceflow** | Voiceflow | 300-700ms | ✓ | ✓ | 商业 | 可视化编排,企业首选 |
| **Hume EVI** | Hume AI | 200-500ms | ✓ | ✓(SOTA) | 商业 | 情感识别最强 |
| **LiveKit Agents** | LiveKit | 150-350ms | ✓ | 需配 | Apache 2.0 | 实时音视频 SDK |
| **Vapi** | Vapi | 200-500ms | ✓ | 需配 | 商业 | 电话集成,10 分钟上线 |
| **Bland AI** | Bland | 300-600ms | ✓ | 需配 | 商业 | 销售外呼专项 |
| **Retell AI** | Retell | 200-500ms | ✓ | ✓ | 商业 | 客服场景 |
| **字节豆包语音** | 字节 | 200-400ms | ✓ | ✓ | 商业 | 中文 SOTA |
| **阿里通义语音** | 阿里 | 200-400ms | ✓ | ✓ | 商业 | 中文场景 |

---

## 三、Voice Agent 技术栈

### 3.1 传统管道架构

```
[用户音频] 
    → VAD(静音检测)
    → STT(语音转文字)
    → LLM(思考 + 工具调用)
    → TTS(文字转语音)
    → [Agent 音频]
```

**缺点**:
- 延迟高(每环节 100-300ms,总 1-2s)
- 错误累积(STT 错 → LLM 错)
- 失去情感/语调信息

### 3.2 端到端架构(S2S)

```
[用户音频]
    → 多模态 LLM(原生语音 + 文本 + 图像)
    → [Agent 音频]
```

**优势**:
- 延迟低(端到端 200-500ms)
- 保留情感/语调
- 打断更自然

**代表**:GPT-4o Realtime、Claude with Voice、Gemini Live

### 3.3 混合架构(主流)

```
[用户音频]
    → 流式 STT(增量转写)
    → LLM(并行思考)
    → 流式 TTS(边想边说)
    → 打断检测器
    → [Agent 音频]
```

**代表**:Pipecat / LiveKit

---

## 四、Pipecat(开源主流)实战

### 4.1 安装

```bash
pip install pipecat-ai[daily,openai,silero]
```

### 4.2 简单 Voice Bot

```python
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.task import PipelineTask
from pipecat.services.openai_realtime_beta import OpenAIRealtimeBetaLLMService
from pipecat.transports.services.daily import DailyTransport
from pipecat.audio.vad.silero import SileroVADAnalyzer

async def main():
    transport = DailyTransport(
        room_url=ROOM_URL,
        token=TOKEN,
        bot_name="Voice Bot",
        vad_analyzer=SileroVADAnalyzer(),
    )
    
    llm = OpenAIRealtimeBetaLLMService(
        api_key=os.getenv("OPENAI_API_KEY"),
        voice="alloy",
        model="gpt-4o-realtime-preview-2024-12-17",
    )
    
    pipeline = Pipeline([
        transport.input(),
        llm,
        transport.output(),
    ])
    
    task = PipelineTask(pipeline)
    await runner.run(task)

if __name__ == "__main__":
    asyncio.run(main())
```

### 4.3 关键能力

- **VAD**:Silero VAD 静音检测
- **打断**:自动检测用户开始说话 → 立即停 TTS
- **工具调用**:MCP Server 集成
- **多模态**:支持视频流(人脸 + 语音)
- **电话集成**:Twilio / Daily PSTN

---

## 五、关键应用场景

### 5.1 客服

- **7x24 自动化**:替代 60% 人工客服
- **多语言**:中英日韩无缝切换
- **情绪感知**:用户愤怒时转人工
- **代表**:Voiceflow / Vapi / Retell

### 5.2 销售外呼

- **Bland AI / Vapi**:自动外呼 + 预约
- **自然对话**:不被识破为 AI
- **数据合规**:通话录音 + 转录 + 情感分析

### 5.3 教育

- **口语陪练**:流利说 / Duolingo Max
- **发音纠正**:音素级反馈
- **场景对话**:餐厅 / 机场 / 面试

### 5.4 医疗

- **预问诊**:症状收集 + 分诊
- **用药提醒**:老人 + 慢病
- **心理陪伴**:情感识别 + 同理心

---

## 六、生产最佳实践

1. **延迟 < 500ms 是底线**:超 1s 用户体感明显卡顿,流失率高。
2. **VAD + 打断必须做**:用户说"停"时 Agent 立即停,不要等 token 完。
3. **情感识别 + 转人工**:用户愤怒 / 困惑时立即转人工,AI 不要硬撑。
4. **声音选择匹配品牌**:温柔客服用 "shimmer" / "nova",销售用 "alloy" / "echo"。
5. **RAG 检索必加**:Voice Agent 不带 RAG 就是"会说话的 LLM",接知识库才有用。
6. **MCP Server 集成**:Agent 语音接数据库 / 工单系统,完成真实任务。
7. **测试用真实电话线**:本地麦克风测试 ≠ 电话线测试,延迟、噪音、采样率都不同。
8. **转录 + 录音**:所有通话留痕,合规 + 复盘。
9. **分场景提示词**:销售 / 客服 / 教育场景分别微调 system prompt。
10. **多语言按地区**:中文用豆包 / 通义,英文用 OpenAI / Anthropic,日韩用专门模型。
11. **A/B 测试声音**:同一剧本用 3 种声音,选最优。
12. **成本监控**:Realtime API 贵,按分钟计费,监控通话长度。

---

## 七、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **端到端延迟** | 200-400ms(优秀),逼近人类电话(150-250ms) |
| **语音质量 MOS** | 4.5+(OpenAI TTS HD)/ 4.3(Anthropic)/ 4.0(Gemini) |
| **情感识别** | Hume SOTA,中文差,字节 / 阿里补足 |
| **打断能力** | 全双工已成标配 |
| **开源生态** | Pipecat / LiveKit / Agora / Daily |
| **商业 SaaS** | Vapi / Bland / Retell / Voiceflow / Cresta |
| **电信集成** | Twilio / Vonage / Plivo |
| **中国厂商** | 字节豆包语音 / 阿里通义语音 / 讯飞星火 / 腾讯云语音 |
| **AR/VR 集成** | Meta Ray-Ban / Apple Vision Pro / 字节 Pico |
| **监管** | 欧盟 AI Act 要求 AI 通话必须告知,加州 / 纽约立法 |
| **企业 ARR** | Vapi $50M+ / Bland $30M+ / Voiceflow $40M+ |

---

## 八、See Also(官方源)

### 商业平台

- OpenAI Realtime API [platform.openai.com/docs/guides/realtime](https://platform.openai.com/docs/guides/realtime)
- Anthropic Claude with Voice [docs.claude.com](https://docs.claude.com/)
- Google Gemini Live [ai.google.dev/gemini-api](https://ai.google.dev/gemini-api)

### 开源项目

- Pipecat [github.com/pipecat-ai/pipecat](https://github.com/pipecat-ai/pipecat)
- LiveKit Agents [github.com/livekit/agents](https://github.com/livekit/agents)
- Daily Python SDK [github.com/daily-co/daily-python](https://github.com/daily-co/daily-python)

### Voice AI 平台

- Voiceflow [voiceflow.com](https://www.voiceflow.com/)
- Vapi [vapi.ai](https://vapi.ai/)
- Bland AI [bland.ai](https://www.bland.ai/)
- Retell AI [retellai.com](https://www.retellai.com/)
- Hume EVI [hume.ai](https://hume.ai/)

### 中国厂商

- 字节豆包语音 [volcengine.com/product/voice-tech](https://www.volcengine.com/product/voice-tech)
- 阿里通义语音 [aliyun.com/product/ai/nls](https://www.aliyun.com/product/ai/nls)
- 讯飞开放平台 [xfyun.cn](https://www.xfyun.cn/)

### 评测

- MOSNet(语音质量)
- EmotionNet(情感识别)

---

## 九、相关概念卡

- [[概念/agent-loop|Agent Loop]]
- [[概念/mcp|Mcp]]
- [[概念/agent-framework|Agent Framework]]
- [[概念/tool-use|Tool Use]]
- [[概念/speech-audio-ai|Speech Audio Ai]]
- [[概念/Agent/ai-agents|Multi Modal Agent]]
- [[概念/Agent/voice-agent|Realtime Api]]
- [[概念/Agent/voice-agent|Pipecat]]
