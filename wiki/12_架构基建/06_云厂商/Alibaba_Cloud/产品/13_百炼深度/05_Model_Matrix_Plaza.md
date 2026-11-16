---
title: "百炼模型矩阵与模型广场"
category: 12_架构基建/Alibaba_Cloud
tags: ["bailian", "model-matrix", "model-plaza", "qwen"]
summary: "梳理百炼模型家族与代表模型、能力代码体系、模型广场三类数据文件与快照治理，并给出 bl model 查询命令。"
created: 2026-11-06
updated: 2026-11-06
tier: supporting
aliases: ["模型矩阵", "模型广场", "Model Matrix Plaza"]
sources: []
name_zh: "模型矩阵与模型广场"
---

# 百炼模型矩阵与模型广场

> 中文简称：模型矩阵与模型广场

> **一句话理解**: 百炼把上百个模型按「家族 + 能力代码」组织成机器可读的模型广场，一条 bl model 命令就能查清谁擅长什么、规格如何、怎么调。

*基于 bl v2.5.1（2026-11）实测提炼，命令细节以 `bl <cmd> --help` 为准。*

---

## 一、模型家族全景

百炼的模型目录不是一张平铺大表，而是「家族（family）→ 主干模型 → 历史快照」三层结构：先按能力域锁家族，再在族内挑档位。第三方模型家族也入驻同一目录，查询方式与自研模型完全一致。

| **能力域** | **代表模型** | **说明** |
|------------|--------------|----------|
| 文本生成 | qwen3-8b / qwen3-14b / qwen3.6-flash / qwen3.8-max | qwen3.8-max 是默认文本模型；8b / 14b 覆盖轻量场景，flash 主打性价比 |
| 视觉理解 | qwen3-vl-plus | 图像与文档理解主力 |
| 全模态 | qwen3.5-omni-plus | 文本、图像、音频、视频统一理解与对话 |
| 图像生成 | qwen-image-3.0、wan2.7-image-pro | qwen-image-3.0 是生成默认；wan2.7-image-pro 兼作微调基座 |
| 视频生成 | wan3.0-video、happyhorse-1.0-video-edit、wan i2v / kf2v | wan3.0-video 文生 / 图生视频；happyhorse-1.0-video-edit 风格转换；i2v 图生视频、kf2v 首尾帧 |
| 语音合成 | cosyvoice-v3-flash | 默认 TTS 模型 |
| 语音识别 | fun-asr / qwen-audio-3.0-asr-flash / qwen3-asr-flash / paraformer | 覆盖异步长录音与同步低延迟两档 |
| 第三方入驻 | deepseek、moonshot 等 | 第三方家族入驻百炼统一目录，同等可查可调 |

同族模型共享调用方式，差异集中在参数规模、上下文窗口与价格档位——换档位不用改代码。

---

## 二、能力代码体系

模型广场用一组能力代码（capability code）标注每个模型「能做什么」：

| **能力代码** | **含义** |
|--------------|----------|
| TG | 文本生成 |
| Reasoning | 推理 |
| VU | 视觉理解 |
| IG | 图像生成 |
| VG | 视频生成 |
| TTS / ASR | 语音合成 / 语音识别 |
| Realtime-* | 实时系（Realtime-ASR、Realtime-Text-to-Speech、Realtime-Omni 等） |
| Multimodal-Omni | 全模态 |
| ME | 多模态嵌入 |
| TR | 翻译 |
| 3D-generation | 三维生成 |
| World-Model | 世界模型 |

两条使用口径：

- 一个模型常带多个能力代码，目录按 primaryCapability 主能力归类——按代码检索会命中一族模型，不是恰好一个。
- 能力代码是选型第一道过滤：先按主能力锁家族，再到家族详情文件确认具体模型确实带该能力，具体流程见 [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|模型选型方法论]]。

---

## 三、模型广场数据结构

模型广场由三类文件构成，CLI、Playground 与推荐器读的是同一份目录：

| **文件** | **粒度** | **关键字段** |
|----------|----------|--------------|
| families.jsonl | 每行一个家族 | slug、primaryCapability、items 摘要、detailPath |
| models.jsonl | 每行一个主干模型 | model、family、contextWindow、maxInput、maxOutput、prices、qpmInfo、profile |
| groups/&lt;slug&gt;.json | 家族全量详情 | items（含 samples 与 predictConfig） |

families.jsonl 的 detailPath 指向对应的 groups/&lt;slug&gt;.json——家族摘要与全量详情两级读取，列表查询轻、详情按需加载。

groups/&lt;slug&gt;.json 里两个值得注意的设计：

- samples 用扁平键命名，如 samples.openai.completionsAPI.python，直接内嵌官方示例代码，能力、语言、API 一眼定位。
- predictConfig 定义推理入参（system、temperature、top_p、enable_search、enable_thinking 等），与 Playground 可调参数对齐——Playground 上能调的，这里都有定义。

---

## 四、快照版本治理

模型名带日期后缀（如 model-2025-04-28）的是历史快照，用于锁定行为不变的生产调用。治理规则：

- 历史快照不进推荐池，只有主干模型（无日期后缀）才参与推荐与选型召回。
- 选快照的代价是放弃后续修复与优化；确需行为可复现时由用户显式指定。
- 选型输出应始终给主干模型名，快照只作为部署阶段的可选项提及。

---

## 五、查询命令

```bash
# 浏览公开模型目录（免鉴权，未配置账号也能先摸清目录）
bl model list

# 查看某一家族详情：主干模型、上下文窗口、价格、QPM
bl model list --model qwen3

# 追加入参定义（system / temperature / top_p / enable_search / enable_thinking 等）
bl model list --model qwen3 --enrich

# 关键词搜索，结果按加权排序
bl model search "视觉理解 长上下文"

# 按输入 / 输出模态过滤
bl model search --input-modality image --output-modality text
```

行为要点：

- `list` 免鉴权读公开目录，适合在配置鉴权前先做选型调研。
- `search` 内置加权排序，匹配度高的主干模型排前；已离线模型默认隐藏，不污染结果。
- `--input-modality` / `--output-modality` 是模态过滤的正门：先定模态再谈模型，是多模态选型的固定起手式。

---

## 交叉引用

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/README|百炼深度系列导读]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|模型选型方法论]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/07_Image_Video_Generation|图像与视频生成]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/08_Speech_TTS_ASR|语音合成与识别]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/06_Qwen模型家族_2026|Qwen 模型家族 2026]]

---

*Last updated: 2026-11-06*
