---
title: "百炼语音合成与识别"
category: 12_架构基建/Alibaba_Cloud
tags: ["bailian", "tts", "asr", "speech"]
summary: "覆盖 cosyvoice TTS 与声音克隆微调路径、ASR 异步与同步双模式、热词增强三种手段及实时 / 全模态语音命令。"
created: 2026-11-06
updated: 2026-11-06
tier: supporting
aliases: ["语音合成与识别", "Speech TTS ASR"]
sources: []
name_zh: "语音合成与识别"
---

# 百炼语音合成与识别

> 中文简称：语音合成与识别

> **一句话理解**: 语音在百炼分两条线——合成走 cosyvoice（要专属音色就微调克隆），识别分异步长录音与同步 Flash 两档，热词是专有名词准确率的关键杠杆。

*基于 bl v2.5.1（2026-11）实测提炼，命令细节以 `bl <cmd> --help` 为准。*

---

## 一、语音合成 TTS

合成链路最短，一条命令闭环：

```bash
# 默认模型 cosyvoice-v3-flash，--text 进、--out 出 mp3
bl speech synthesize --text "版本发布完成，可以开始灰度。" --out notice.mp3
```

- 默认模型 cosyvoice-v3-flash；合成与图片生成同为同步返回，mp3 直接落地本地文件，产出即可播放。
- 播报、配音、通知提示音这类短文本场景直接用；多段文案就分多次调用、按文件名归档。
- 合成产物可衔接视频链路：`bl video ref` 的参考生视频 + 配音就需要现成的语音产物，见 [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/07_Image_Video_Generation|图像与视频生成]]。

---

## 二、声音克隆：走微调

百炼没有独立的「声音克隆」命令，克隆路径 = 微调 cosyvoice-v3-flash 再部署——把目标音色训进模型，之后按常规模型调用：

| **环节** | **约束** |
|----------|----------|
| **微调算法** | cosyvoice-v3-flash 仅支持 sft-lora |
| **数据包结构** | zip = data.jsonl + train/*.wav（音频统一放 train 目录） |
| **部署** | 微调模型只支持 mu plan |
| **推理** | `--voice` 固定为 default，克隆音色由微调模型本身承载 |

推理侧不用选音色：部署的已经是「那个声音」的模型，`--voice default` 是唯一入口。微调全流程见 [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/09_Finetune_Pipeline|微调流水线]]。

---

## 三、ASR 双模式

| **维度** | **异步 filetrans 系** | **同步 Flash 系** |
|----------|------------------------|-------------------|
| **代表模型** | fun-asr 等 | fun-asr-flash-2026-06-15 / qwen-audio-3.0-asr-flash / qwen3-asr-flash |
| **时延特征** | 提交后拿异步任务 id，轮询取结果 | 低延迟，同步返回 |
| **适用场景** | 长录音、多文件批量、说话人分离 | 一次一个文件、约 5 分钟内音频 |

两档不是优劣关系，是时延与吞吐的取舍：

- 长录音、多文件批量、说话人分离这类批处理需求归异步 filetrans 系，适合攒起来统一跑。
- 对话式交互、短音频、时延敏感场景认准同步 Flash 系「一次一文件、约 5 分钟内」的边界。

---

## 四、热词增强

专有名词（产品名、人名、术语）是 ASR 主要丢分区，三种热词手段：

| **方式** | **适用模型** | **要点** |
|----------|--------------|----------|
| 即时 `--vocabulary` | Qwen-Audio-3.0-ASR-Flash 系（与 `--context` 皆可） | 请求级生效，随用随传 |
| 即时 `--context` | Qwen-Audio-3.0-ASR-Flash 系两者皆可；Fun-ASR-Flash 仅支持 `--context` | 必须列出目标词本身，只写主题描述无效 |
| 预建词表 `--vocabulary-id` | Fun-ASR / Paraformer，或需跨请求复用 | `bl speech vocabulary create` 预建，识别时挂载 |

三条纪律：

- 词表条目权重建议从 4 起步，不要全部设 5。
- `--context` 要写目标词本身（如「百炼、DashScope、qwen3.8-max」），写「关于阿里云 AI 的内容」这类主题描述无效。
- 预建词表的静默陷阱：词表的 `--model` 必须与 recognize 的 `--model` 完全一致，否则词表被静默忽略、不报错；每账号至多 10 个词表，满了先删旧再建新。

```bash
# 即时热词：--context 列出目标词本身（音频入参形态以 --help 为准）
bl speech recognize --model qwen3-asr-flash <meeting.mp3> --context "百炼、DashScope、qwen3.8-max"

# 预建词表：--model 必须与后续 recognize 完全一致（词表内容参数以 --help 为准）
bl speech vocabulary create --model fun-asr

# 识别时挂载预建词表
bl speech recognize --model fun-asr --vocabulary-id <vocab-id>
```

---

## 五、实时语音与全模态理解

实时语音对应三个能力代码：Realtime-ASR（实时识别）、Realtime-Text-to-Speech（实时合成）、Realtime-Omni（实时全模态），面向语音对话、直播字幕这类流式场景；能力代码体系见 [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/05_Model_Matrix_Plaza|模型矩阵与模型广场]]。

全模态音视频理解用 `bl omni`，默认 qwen3.5-omni-plus，`--message` 带提问，`--image` / `--audio` / `--video` 按需组合输入：

- `bl omni` 是提交式理解：整段音视频连同问题一次给足，同步拿结论。
- Realtime-* 能力面向流式增量输入，两者互补而非替代。

```bash
# 视频 + 提问：默认 qwen3.5-omni-plus
bl omni --message "这段演示里用户在哪一步卡住了？" --video demo.mp4

# 音频 + 图像组合输入
bl omni --message "这段录音里提到的是哪张图？" --audio note.wav --image chart.png

# 纯文本问答：--text-only 关闭多模态输入
bl omni --message "帮我总结今天的会议纪要要点" --text-only
```

---

## 交叉引用

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/05_Model_Matrix_Plaza|模型矩阵与模型广场]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/07_Image_Video_Generation|图像与视频生成]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/09_Finetune_Pipeline|微调流水线]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/架构方案/17_架构方案_多模态内容生成|架构方案：多模态内容生成]]

---

*Last updated: 2026-11-06*
