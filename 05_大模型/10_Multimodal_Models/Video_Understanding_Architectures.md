---
title: 视频理解架构深度解析
category: 05-nlp-llms-multimodal-models
tags: [multimodal, video-understanding, temporal-modeling, video-llm, sora, action-recognition, video-language]
summary: 从帧级图像理解到真正视频理解的架构演进，涵盖时序建模、视频-语言预训练、动作识别和生成式视频理解的最新技术。
date: 2026-06-01
created: 2026-06-12
tier: peripheral
aliases:
  - "Video Understanding Architectures"
  - Video_Understanding_Architectures
sources: []

name_zh: "视频理解架构深度解析"
---
# 视频理解架构深度解析

> 中文简称：视频理解架构深度解析

## 一句话理解

视频理解不是"把视频拆成一堆图片分别看"，而是**让模型理解时间——知道前一帧和后一帧的关系、动作的因果、事件的时序结构**。

---

## 一、为什么视频比图像难一个数量级

### 1.1 数据维度的爆炸

| 维度 | 单张图像 | 1 分钟视频 (30fps) |
|---|---|---|
| 像素数 | 256×256 = 65,536 | 65,536 × 1,800 = 118M |
| 信息量 | 静态场景 | 动态 + 时序 + 音频 + 运动 |
| 语义层次 | 物体 + 场景 | 物体 + 场景 + 动作 + 事件 + 情感 |

**关键挑战**: 1 分钟视频有 1800 帧，全部输入 Transformer 会产生 1800 × 576 = 1,036,800 个 visual token。远超当前 LLM 的上下文限制。

### 1.2 时序理解的层次

视频理解需要同时处理多个时间尺度：

```
毫秒级 (1-100ms):  运动感知、光流、帧间变化
秒级 (1-10s):      动作识别、物体交互、场景转换
分钟级 (1-10min):  事件理解、情节发展、目标追踪
小时级:             长视频叙事、主题演变、情感弧线
```

当前模型的盲区：
- **毫秒级**: 大多数模型只处理 1fps 或更低，丢失快速动作
- **小时级**: 几乎所有模型都无法处理超过 10 分钟的视频

---

## 二、视频理解的四代架构

### 第一代：两阶段流水线 (Frame-level + RNN)

**代表**: LSTM + CNN (2015-2018)

```
视频 → 抽帧 → CNN (每帧特征) → LSTM/GRU (时序聚合) → 输出
```

**问题**:
- CNN 每帧独立处理，无法利用帧间冗余
- LSTM 难以捕捉长程时序依赖（超过 10 秒就遗忘）
- 动作开始和结束的时间点难以精确定位

**典型工作**:
- **LRCN**: CNN 提取特征 → LSTM 生成描述
- **C3D**: 3D 卷积同时处理空间和时间，但只能捕捉 16 帧的短片段

### 第二代：3D CNN + 注意力 (2018-2021)

**代表**: I3D, SlowFast, X3D

**核心思想**: 用 3D 卷积核 (k×k×t) 同时处理空间 (k×k) 和时间 (t) 维度。

**SlowFast 的双路径设计**:
```
输入视频
  ├─ Slow Path: 低帧率 (4fps) + 高空间分辨率 → 捕捉空间语义
  └─ Fast Path: 高帧率 (30fps) + 低空间分辨率 → 捕捉时序动态
      
融合: Slow 和 Fast 的特征在每一层横向连接
```

**为什么这种设计有效？**
- 人的视觉系统也是双通道： magno 细胞（对运动敏感，时序快）和 parvo 细胞（对颜色/细节敏感，空间精细）
- 空间语义变化慢（一个场景持续几秒），运动变化快（挥手仅需 0.5 秒）

**局限**:
- 3D 卷积计算量巨大：参数量是 2D CNN 的 t 倍
- 感受野固定，难以适应不同速度的动作
- 无法与语言模型联合训练

### 第三代：视频-Transformer (2021-2023)

**代表**: TimeSformer, ViViT, Video Swin Transformer

**核心思想**: 将 Transformer 从图像扩展到视频，用注意力机制替代 3D 卷积。

**TimeSformer 的分解注意力**:
```python
# 标准 3D 注意力 (计算量巨大):
# 每个 token attend 到 T×H×W 个时空 token
# 复杂度: O((T·H·W)²)

# TimeSformer 的分解注意力:
# 1. 空间注意力: 同一帧内的 token 互相 attend
# 2. 时间注意力: 同一空间位置的 token 跨帧 attend

for token in video_tokens:
    spatial_context = attention(token, same_frame_tokens)
    temporal_context = attention(token, same_position_other_frames)
    output = fusion(spatial_context, temporal_context)
```

**复杂度对比**:
```
标准 3D Attention: O((T·H·W)²) = O((8·14·14)²) = O(196K)
分解 Attention:    O(T·(H·W)²) + O(H·W·T²) = O(22K) + O(1.5K) = O(23.5K)

效率提升: ~8 倍
```

**Video Swin Transformer 的层次化时序建模**:
```
Layer 1-2:  局部时序 (2-4 帧)  → 捕捉短动作如 "点头"
Layer 3-4:  中等时序 (8-16 帧) → 捕捉动作组合如 "拿起杯子喝水"
Layer 5-6:  全局时序 (32+ 帧)  → 捕捉事件如 "做饭的全过程"
```

**局限**:
- 仍然需要预定义的时间窗口大小
- 和语言模型的融合不够紧密

### 第四代：原生视频-语言模型 (2023-至今)

**代表**: Video-LLaMA, Video-ChatGPT, Gemini 1.5, Sora

**核心特征**: 不是先训练视觉模型再嫁接语言模型，而是**从预训练阶段就让模型同时理解视频和文本**。

---

## 三、原生视频-语言模型的架构设计

### 3.1 视频 Token 化的三种策略

#### 策略 A：均匀帧采样 + 图像编码 (Uniform Frame Sampling)

```python
# 每秒采样 1 帧
frames = video.sample(fps=1)  # 1 分钟视频 → 60 帧

# 每帧用 ViT 编码为 576 tokens
frame_tokens = [vit(frame) for frame in frames]
video_tokens = concat(frame_tokens)  # 60 × 576 = 34,560 tokens
```

**代表**: Video-LLaMA, LLaVA-NeXT

**优点**: 简单，可复用成熟的图像编码器
**缺点**:
- 时间分辨率低（1fps 无法捕捉快速动作）
- token 数量爆炸（1 分钟 = 34K token）
- 帧间冗余未利用

#### 策略 B：压缩式视频编码 (Compressed Video Encoding)

**核心思想**: 利用视频压缩的冗余性——只有变化的区域需要详细编码。

```python
# I-frame: 关键帧，完整编码 (类似 JPEG)
# P-frame: 预测帧，只编码与前一帧的差异
# B-frame: 双向预测帧，参考前后帧

video_tokens = []
for frame_type, data in compressed_video:
    if frame_type == 'I':
        tokens = vit_encode_full(data)
    elif frame_type == 'P':
        tokens = encode_residual(data)  # 差异 token，数量少
    video_tokens.extend(tokens)
```

**代表**: 部分工业系统（未公开发表）

**优点**: token 数量减少 50-80%
**缺点**: 依赖视频编码质量，复杂场景下 P-frame 信息损失大

#### 策略 C：时空联合 Patch (Spatio-Temporal Patch)

**核心思想**: 不是先空间 patchify 再时序采样，而是直接做 3D patchify。

```python
# 2D patch: 16×16 pixel → 1 token
# 3D patch: 2×16×16 pixel (2帧 × 16×16空间) → 1 token

# 1 分钟 30fps 视频:
# 时间维度: 1800 帧 / 2 = 900 patches
# 空间维度: 224×224 / (16×16) = 196 patches
# 总 token: 900 × 196 = 176,400 (仍然太多)

# 解决方案: 时间下采样
# 每 4 帧取一个 3D patch → 450 × 196 = 88,200
# 再加时间 stride → 225 × 196 = 44,100
```

**代表**: ViViT, Sora 的早期版本

**优点**: 时空信息联合编码，动作模式自然涌现
**缺点**: 计算量仍然巨大

### 3.2 时序位置编码

标准的位置编码只考虑空间 (x, y)。视频需要同时编码时间 (t)。

**方法 1：绝对时空位置编码**:
```python
# 每个 token 的位置 = (t, x, y)
pe = sinusoidal_3d(t, x, y)
```

**方法 2：相对时间编码**:
```python
# 关注帧间距离而非绝对时间
# token at (t1, x1, y1) attending to (t2, x2, y2)
rel_time = t2 - t1
rel_pos = (rel_time, x2-x1, y2-y1)

# 用可学习的 embedding 编码相对位置
bias = learned_temporal_bias(rel_time) + learned_spatial_bias(x2-x1, y2-y1)
```

**方法 3：时间 ALiBi (T-ALiBi)**:
```python
# 距离越远的帧，注意力 bias 越小
# 强制模型关注邻近帧
attn_score = Q @ K.T - m * |t1 - t2|
```

**Gemini 的具体实现**:
- 使用 1D RoPE 的变体处理时间维度
- 视频帧率不固定，RoPE 的频率参数根据实际 fps 动态调整

### 3.3 长视频处理：超过上下文限制的解决方案

当前 LLM 的上下文窗口通常为 128K token。1 分钟视频（1fps）就需要 34K token，4 分钟就会溢出。

**解决方案 1：分层时序摘要 (Hierarchical Temporal Summarization)**

```
原始视频 (1000 帧)
  → 第一层: 每 10 帧提取 1 个关键帧 (100 帧)
    → 第二层: 每 10 个关键帧提取 1 个摘要 (10 帧)
      → 第三层: 全局摘要 (1 帧)

查询时:
  - 粗粒度问题 → 用全局摘要
  - 细粒度问题 → 回溯到对应层级的关键帧
```

**代表**: MovieChat

**解决方案 2：记忆增强 (Memory-Augmented Video Understanding)**

```python
class VideoMemory:
    def __init__(self):
        self.short_term = []  # 最近 N 帧
        self.long_term = []   # 压缩的历史记忆
        
    def process_frame(self, frame):
        self.short_term.append(frame)
        if len(self.short_term) > 100:
            # 压缩短期记忆到长期记忆
            summary = self.summarize(self.short_term)
            self.long_term.append(summary)
            self.short_term = []
            
    def answer_query(self, query):
        # 先在短期记忆中查找
        if relevant_in_short_term(query):
            return answer_from(self.short_term)
        # 再检索长期记忆
        relevant_memories = retrieve(self.long_term, query)
        return answer_from(relevant_memories)
```

**代表**: 部分长视频理解系统

**解决方案 3：事件驱动采样 (Event-Driven Sampling)**

不是均匀采样，而是在**内容变化剧烈处密集采样**。

```python
def event_driven_sample(video):
    frames = []
    prev_frame = None
    
    for frame in video:
        if prev_frame is None:
            frames.append(frame)
        else:
            diff = frame_difference(frame, prev_frame)
            if diff > threshold:  # 场景变化、动作开始
                frames.append(frame)
            elif is_action_peak(frame):  # 动作最剧烈的时刻
                frames.append(frame)
        prev_frame = frame
    
    return frames
```

**优点**: 1 小时视频可能只需要 100-200 个关键帧
**缺点**: 可能丢失缓慢但重要的变化（如植物生长、情感渐变）

---

## 四、视频-语言预训练

### 4.1 预训练任务设计

| 任务 | 输入 | 输出 | 学习目标 |
|---|---|---|---|
| 视频-文本对比 (Video-Text Contrastive) | 视频 + 文本描述 | 相似度 | 对齐视频和文本表示 |
| 视频-文本匹配 (Video-Text Matching) | 视频 + 文本 | 是否匹配 (0/1) | 细粒度对齐 |
| masked frame prediction | 视频（部分帧 masked）| 重建被遮帧 | 时序推理 |
| 动作排序 (Action Ordering) | 打乱的视频片段 | 正确顺序 | 因果理解 |
| 视频问答 (Video QA) | 视频 + 问题 | 答案 | 联合推理 |
| 视频描述生成 (Video Captioning) | 视频 | 文本描述 | 生成能力 |

### 4.2 数据配比

**WebVid-2M / InternVid 的经验**:
```
预训练数据配比:
- 视频-文本对 (WebVid): 70%
- 纯文本 (Pile/CC): 20%  ← 保持语言能力
- 纯视频 (Kinetics/SSV2): 10%  ← 学习纯视觉表示
```

**为什么需要纯文本和纯视频数据？**
- 如果只训视频-文本对，模型会过度依赖文本线索，视觉理解能力弱
- 纯视频数据让模型学会"不依赖文本也能理解动作"
- 纯文本数据防止语言能力退化

### 4.3 视频 Instruction Tuning

**视频特有的指令类型**:
```
普通 QA: "视频中发生了什么？"
时序 QA: "主角什么时候拿起了枪？"
因果 QA: "为什么主角会摔倒？"
计数 QA: "视频中有几个人？"
定位 QA: "狗出现的时间点是什么？"
预测: "接下来会发生什么？"
```

**视频指令数据构建**:
- **人工标注**: 质量高但昂贵（每 1 分钟视频约 $5-10 标注成本）
- **模型生成**: 用 GPT-4V 生成伪标签，再人工筛选
- **半自动**: 先用动作识别模型提取事件，再用 LLM 生成问题

---

## 五、生成式视频理解：Sora 的启示

### 5.1 生成即理解 (Generation as Understanding)

OpenAI 的 Sora 表明：**能生成逼真视频的模型，必然理解了物理世界的规律**。

```
理解 → 生成
"球会弹跳" → 生成球弹跳的视频
"水往低处流" → 生成水流动的视频
"物体遮挡后仍然存在" → 生成遮挡-重现的视频
```

**为什么生成比判别更难？**
- 判别模型只需要说 "这是猫"（分类）
- 生成模型需要画出猫的每一根毛、每一个光影变化（像素级预测）

### 5.2 Sora 的架构推测

基于公开信息和技术社区的逆向工程：

```
输入: 文本描述 + 噪声视频 (纯噪声)

阶段 1: 视频压缩 (Video Compression)
  - 将高分辨率视频压缩到低维 latent 空间
  - 类似 VQ-VAE，但针对时空数据优化
  - 256×256×16frames → 32×32×2 latent

阶段 2: 时空 Diffusion Transformer
  - 在 latent 空间上做去噪
  - DiT (Diffusion Transformer) 架构
  - 同时处理空间和时间的相关性

阶段 3: 视频解码
  - 从 latent 解码回像素空间
  - 使用超分辨率提升细节
```

**关键技术点**:
- **时空 patchify**: 视频被切成 3D patch (t×h×w)，每个 patch 是一个 token
- **文本条件化**: 通过 cross-attention 将文本描述注入去噪过程
- **可变分辨率**: 同一个模型可以生成不同长宽比和分辨率的视频

### 5.3 从 Sora 学到的视频理解原理

1. **物理一致性**: 模型学会了重力、碰撞、流体动力学等物理规律
2. **物体持久性**: 物体被遮挡后重新出现时，属性（颜色、形状）保持一致
3. **因果关系**: 动作 A 导致结果 B（如 "推倒积木" → "积木倒塌"）
4. **空间关系**: 物体之间的相对位置、深度、遮挡关系

---

## 六、评估视频理解能力

### 6.1 传统视频理解基准

| 基准 | 任务 | 难度 | 代表性指标 |
|---|---|---|---|
| Kinetics-400/600/700 | 动作分类 | 中 | Top-1/Top-5 准确率 |
| Something-Something V2 | 细粒度动作 | 高 | 需要理解动作方向/对象 |
| Epic-Kitchens | 第一人称视频 | 高 | 动作 + 物体交互 |
| ActivityNet | 时序动作定位 | 高 | mAP @ tIoU |
| Charades | 多标签动作 | 高 | 一个视频多个动作 |

### 6.2 视频-语言基准

| 基准 | 任务 | 关键挑战 |
|---|---|---|
| MSR-VTT | 视频描述 | 开放域视频，描述多样性 |
| MSVD | 短视频描述 | 细粒度动作描述 |
| ActivityNet Captions | 密集描述 | 长视频，多个事件 |
| TVQA | 视频问答 | 需要对话上下文 |
| How2QA | 教学视频 QA | 需要步骤理解 |
| NExT-QA | 因果推理 QA | "为什么" 类型问题 |
| Ego4D | 第一人称理解 | 预测未来动作 |

### 6.3 长视频理解基准

| 基准 | 视频长度 | 核心挑战 |
|---|---|---|
| MovieNet | 1-3 小时 | 情节理解、角色关系 |
| LVU (Long-form Video Understanding) | 10-60 分钟 | 主题识别、情感分析 |
| VideoChatGPT-bench | 任意长度 | 开放式对话 |
| LongVideoBench | 10-60 分钟 | 时序推理、信息检索 |

---

## 七、实践建议

**如果你要构建一个视频理解系统**:

1. **先决定时间尺度**: 你的应用需要理解毫秒级动作（如体育分析）还是小时级叙事（如电影理解）？不同尺度需要完全不同的架构
2. **帧率不是越高越好**: 对于对话视频，1fps 足够；对于体育视频，需要 10fps+
3. **利用音频线索**: 视频中的音频（语音、音乐、环境音）包含大量语义信息。Gemini 1.5 的音频编码是视频理解的关键优势
4. **时序位置编码至关重要**: 没有好的时间位置编码，模型会把视频当成无序的图像集合
5. **从短视频开始**: 先验证 10 秒视频的理解能力，再扩展到 1 分钟、10 分钟

---

## Related

- [[05_大模型/10_Multimodal_Models/Native_Multimodal_Architectures]]
- [[05_大模型/10_Multimodal_Models/Modality_Fusion_Mechanisms]]
- [[05_大模型/10_Multimodal_Models/Multimodal_Architectures_2026]]
- [[概念/multimodal-models]]
- [[04_计算机视觉/07_Video_Generation/README]]
