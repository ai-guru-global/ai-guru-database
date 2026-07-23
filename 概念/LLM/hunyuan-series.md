---
title: "腾讯混元 Hunyuan 模型系列 (Tencent Hunyuan Model Family)"
category: concepts
tags:
  - llm
  - hunyuan
  - tencent
  - moe
  - chinese-llm
  - long-context
  - reasoning
  - hybrid-mamba
aliases:
  - Hunyuan Series
  - 腾讯混元
  - Hunyuan-Large
  - Hunyuan TurboS
  - Hunyuan T1
relationships:
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/moe"
    type: uses
  - target: "概念/kv-cache"
    type: uses
  - target: "概念/long-context-llm"
    type: related_to
  - target: "概念/reasoning-models"
    type: related_to
  - target: "概念/mamba"
    type: extends
summary: "腾讯混元(Tencent Hunyuan)是大厂级全栈自研的国产大模型系列,覆盖文本/多模态/视频/3D 全模态。旗舰 Hunyuan-Large 389B 总参/52B 激活,原生 256K 上下文,首个开源引入 GQA+CLA 双重 KV 压缩;混元 TurboS 业内首个 Hybrid-Transformer-Mamba MoE 大模型;推理模型 T1 基于 TurboS 强思考基座。2024.11 开源,论文 ICLR'25 风格规范。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
---

# 腾讯混元 Hunyuan 模型系列

> **一句话理解**: 腾讯全栈自研的"万级亿 +"参数 MoE 大模型,以 GQA+CLA KV 压缩和 256K 长上下文闻名,2024.11 起以 MIT-like 协议开源 Hunyuan-Large,引领混合 SSM-Transformer 路线。

---

## 一、公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | 腾讯(Tencent) |
| **团队** | 混元大模型团队 + 腾讯 AI Lab |
| **应用入口** | 腾讯元宝(Yuanbao)、QQ、微信搜一搜、腾讯文档 |
| **商业平台** | 腾讯云 TI 平台、混元 API、火山引擎友商 |
| **开源度** | Hunyuan-Large / Hunyuan3D / HunyuanVideo / HunyuanWorld 全栈开源 |

---

## 二、模型家族全景

```
腾讯混元 Hunyuan 模型家族
│
├── 文本旗舰
│   ├── Hunyuan-Large (A52B,开源, 256K 上下文)
│   ├── Hunyuan TurboS (Hybrid-Transformer-Mamba MoE,业内首个)
│   ├── Hunyuan Turbo (标准 MoE)
│   ├── Hunyuan Pro (闭源旗舰)
│   ├── Hunyuan Standard (中量)
│   ├── Hunyuan Lite (轻量)
│   └── Hunyuan Code (代码专用)
│
├── 推理系列
│   ├── Hunyuan T1 (深度推理,基于 TurboS 思考基座)
│   └── Hunyuan T1 Latest (动态最新版)
│
├── 长文本
│   ├── Hunyuan Large Longcontext (128K+ Instruct)
│   └── Hunyuan Standard 256K
│
├── 多模态
│   ├── Hunyuan Vision (Turbo / Lite / Standard)
│   └── Hunyuan-Vision 256K
│
├── 角色 / 翻译 / 函数调用
│   ├── Hunyuan Role (角色扮演)
│   ├── Hy-MT2-Pro (翻译,15 种语言)
│   └── Hunyuan FunctionCall (工具调用,32K)
│
├── 视频生成
│   ├── Hunyuan Video (13B,开源,文生视频 SOTA)
│   ├── Hunyuan Video-1.5
│   └── Hunyuan LiveAvatar
│
├── 3D 生成
│   ├── Hunyuan3D 1.0 (文/图生 3D)
│   ├── Hunyuan3D 2.0 (DiT + Paint)
│   ├── Hunyuan3D 2.1 (PBR 材质,开源)
│   └── Hunyuan3D 2.5 (高保真细节)
│
└── 世界模型
    └── HunyuanWorld-1.0 (开源,沉浸式 3D 世界生成)
```

---

## 三、旗舰技术解析

### 3.1 Hunyuan-Large(2024-11-05 开源)

**核心创新:GQA + CLA 双重 KV Cache 压缩**

| 维度 | 数值 / 说明 |
|---|---|
| **架构** | Transformer + 经典 MoE(共享专家 + 16 专业专家) |
| **总参 / 激活** | 389B 总参 / 52B 激活 |
| **上下文** | 预训练 256K,Instruct 128K |
| **训练 token** | 7T(其中 ~1.5T 高质量合成数据) |
| **Tokenizer** | 100K(tiktoken)+ 28K 中文扩展,共 128K 词表 |
| **中文压缩率** | 2.78 → 3.13 字符/token(LLaMA3 对比) |
| **GQA 组数** | 8 组 KV Heads(80 个 Q Heads) |
| **CLA 间隔** | 每 2 层共享 KV |
| **专家策略** | 1 共享 + 1 路由(Top-1 激活) |
| **开源协议** | 自定义(允许商用,需申请) |

**KV 缓存对比**:

| 注意力方案 | KV Cache 显存(BF16) |
|---|---|
| MHA | 4·n_h·d_h·l(基线) |
| GQA | 4·n_g·d_h·l |
| MQA | 4·d_h·l |
| CLA | 2·n_h·d_h·l |
| **GQA + CLA(Hunyuan)** | **2·n_g·d_h·l(节省 95%)** |

**关键成绩**(在 CMMLU / MMLU / C-Eval / MATH / HumanEval / MT-Bench / Arena-Hard 9 大维度全面领先 LLama3.1-405B,部分指标超 DeepSeek-V2.5):

| 基准 | Hunyuan-Large Inst. | LLama3.1-405B Inst. | DeepSeek V2.5 Chat |
|---|---|---|---|
| **MMLU** | **89.9** | 87.3 | 80.4 |
| **CMMLU** | **90.4** | — | — |
| **C-Eval** | **88.6** | — | — |
| **MATH** | **77.4** | 73.8 | 74.7 |
| **HumanEval** | **90.0** | 89.0 | 89.0 |
| **Arena-Hard** | **81.8** | 69.3 | 76.2 |
| **MT-Bench** | **9.4** | 9.1 | 9.0 |
| **IFEval strict** | 85.0 | 86.0 | — |

**长上下文成绩**:
- NIAH(0-128K)几乎 100% 召回
- RULER(64K-128K)89.53 vs LLama3.1-70B 86.48
- 自研 **PenguinScrolls(企鹅卷轴)** 长文基准:整体 85.23 vs LLama3.1-70B 69.37

**四大技术支柱**:

1. **高质量合成数据(7T token,1.5T 合成)**:四步流水线
   - 指令生成 → 指令演化 → 响应生成 → 响应过滤
   - 重点补充数学、代码、低资源、高教育价值领域

2. **增强模型结构**:
   - GQA + CLA 双重 KV 压缩
   - **Recycle Routing**:被丢弃 token 重新分配给未满载专家
   - **专家特定学习率缩放**:共享专家 LR / 专业专家 LR ≈ 0.31

3. **MoE 缩放定律(创新)**:推导公式
   ```
   N_opt = N_c · C_min^α   (N_c=5.9×10⁻³, α=0.5305)
   D_opt = D_c · C_min^β   (D_c=3.2, β=0.50)
   ```
   决定 52B 激活 + 7T tokens 为最优配比

4. **训练三阶段**:
   - Warmup + 渐进衰减(95% tokens)
   - 短退火(5% tokens,LR 降至 1/10,高质量数据)
   - 长上下文(32K → 256K RoPE base=10⁹)

### 3.2 Hunyuan TurboS(2025-03 业内首个 Hybrid-Transformer-Mamba MoE)

**核心创新:把 SSM(Mamba)引入超大 MoE**

| 维度 | 数值 / 说明 |
|---|---|
| **架构** | Hybrid:Transformer 注意力 + Mamba SSM 混合 |
| **核心优势** | 线性复杂度推理,长序列显存显著降低 |
| **思考基座** | 提供给 Hunyuan T1(深度推理模型) |

> **技术意义**:首次在万亿级 MoE 中验证 Mamba 路线,替代部分 Transformer 层,在长序列推理场景(>32K)显著降低显存。

### 3.3 Hunyuan T1(2025-03 推理模型)

| 维度 | 说明 |
|---|---|
| **基座** | Hunyuan TurboS(Hybrid Mamba-Transformer MoE) |
| **训练范式** | 扩展推理能力 + 人类偏好对齐 |
| **能力** | 数学、逻辑、科学、代码推理;长文本信息捕捉 |
| **腾讯首个** | 正式深度推理模型 |

### 3.4 Hunyuan Video(2024-12-03 开源)

| 维度 | 数值 / 说明 |
|---|---|
| **参数量** | 13B(开源视频生成最大) |
| **架构** | Causal 3D VAE + DiT + Flow Matching + MLLM 文本编码 |
| **RoPE** | 3D RoPE(T / H / W 独立) |
| **数据筛选** | PySceneDetect + Dover + 光流 + OCR + YOLOX 5 阶段分层 |
| **性能** | 超越 Runway Gen-3、Luma 1.6,运动动态第一 |
| **加速** | 时间步转换 + 文本引导蒸馏(1.9× 加速) |
| **训练基础设施** | 5D 并行(TP/SP/CP/DP/ZeroCache)+ 腾讯星脉网络 + AngelPTM |
| **训练稳定性** | 99.5%(自动容错) |

### 3.5 Hunyuan3D 2.0 / 2.1 / 2.5

| 版本 | 发布时间 | 创新点 |
|---|---|---|
| **2.0** | 2025-01 | DiT + Paint 双阶段,PBR 材质 |
| **2.1** | 2025-06-14 | 全开源 + 训练代码,PBR 物理材质 |
| **2.5** | 2025-07 | 高保真细节,3.3B 形状 + 2B 纹理 |
| **World 1.0** | 2025-07-26 | 沉浸式 3D 世界生成(开源首个) |

### 3.6 HunyuanVision

| 模型 | 参数 | 上下文 | 特点 |
|---|---|---|---|
| **Hunyuan-Turbo-Vision** | MoE | 128K | 新一代视觉旗舰,MoE 架构 |
| **Hunyuan-Lite-Vision** | 中量 | — | 轻量多模态 |
| **Hunyuan-Standard-Vision** | 中量 | — | 多语种均衡 |

---

## 四、定价与生态

### 4.1 商业接入(腾讯云混元 API)

| 模型族 | 计费模式 | 备注 |
|---|---|---|
| Hunyuan-TurboS | 按 token | 高性能旗舰 |
| Hunyuan-Pro | 按 token | 闭源旗舰 |
| Hunyuan-Standard | 按 token | 中量经济型 |
| Hunyuan-Lite | 按 token | 轻量低成本 |
| Hy3 | 按 token | 2025 最新,295B 总参 / 21B 激活 MoE,192K 输入 / 128K 输出 |
| Hy-MT2-Pro | 按 token | 翻译模型,15 种语言 |

### 4.2 开源接入

```python
# OpenAI 兼容 API(已支持)
from openai import OpenAI

client = OpenAI(
    api_key="your-hunyuan-key",
    base_url="https://api.hunyuan.cloud.tencent.com/v1"
)

response = client.chat.completions.create(
    model="hunyuan-large",  # 或 hunyuan-turbos
    messages=[{"role": "user", "content": "用一句话介绍 GQA+CLA 双重 KV 压缩"}],
    temperature=0.7
)

# vLLM 本地部署
# 模型下载:huggingface.co/tencent/Tencent-Hunyuan-Large
# git clone https://github.com/Tencent/Tencent-Hunyuan-Large
```

**部署要求**(Hunyuan-Large):
- 全量微调:≥ 32 张 H20-96GB
- LoRA 微调:≥ 8 张 H20-96GB
- BF16 推理:≥ 16 张 H800 / H20
- 支持 BF16 / INT8 / FP8 量化

---

## 五、关键人物

| 人物 | 角色 |
|---|---|
| **腾讯混元团队** | 主体研发 |
| **孙星(JuYong Sun)** | Hunyuan-Large 论文核心作者 |
| **腾讯 AI Lab** | 算法研究支撑 |
| **腾讯星脉** | 训练网络基础设施 |
| **AngelPTM** | 训练框架,腾讯 Angel 机器学习团队 |

---

## 六、技术细节深挖

### 6.1 Recycle Routing(回收路由)

传统 Top-k 路由在专家满载时丢弃 token,Hunyuan-Large 将这些 token **回收** 到其他未满载专家,避免信息损失。

```
传统:  Token D → Expert 1(满载)→ 丢弃 ❌
Hunyuan:Token D → Expert 1(满载)→ 重新分配 Expert 4 ✅
```

### 6.2 专家特定学习率缩放

由于共享专家与专业专家的"等效批量大小"不同,需要不同学习率:

- 共享专家 batch ≈ B(全 token 看到)
- 专业专家 batch ≈ B/n(每个专家仅 n 分之一 token)
- 最优 LR 比例:`ε_opt(B) / ε_opt(B/n) ≈ 0.31`
- 共享专家用 `ε_opt(B)`,专业专家用 `ε_opt(B) × 0.31`

### 6.3 Hybrid Mamba-Transformer

Hunyuan TurboS 在 Transformer 层中**部分替换**为 Mamba SSM 层:

- 注意力层:O(n²) 复杂度,擅长精确位置建模
- SSM 层:O(n) 复杂度,擅长长程依赖
- 混合:浅层用 Attention(局部精确),深层用 SSM(长程效率)

---

## 七、与竞品对比

| 维度 | Hunyuan-Large | DeepSeek-V3 | Qwen3-235B | LLama3.1-405B |
|---|---|---|---|---|
| **总参 / 激活** | 389B / 52B | 671B / 37B | 235B / 22B | 405B Dense |
| **架构** | MoE | MoE 256 专家 | MoE | Dense |
| **KV 压缩** | GQA+CLA | MLA | GQA | GQA |
| **上下文** | 256K | 128K | 128K | 128K |
| **中文** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **开源** | 部分(申请商用) | MIT | Apache 2.0 | Llama License |
| **中文权威** | 90.4(CMMLU) | 84.0 | — | — |
| **MMLU** | 89.9 | 88.5 | — | 87.3 |

---

## 八、争议与限制

- **开源限制**:Hunyuan-Large 开源但商用需申请,不似 DeepSeek/Qwen 完全开放
- **生态国际化**:海外开发者获取与文档支持有限
- **超长上下文**:256K 实际能力需特定业务场景验证
- **Mamba 混合**:尚属早期,生态支持(vLLM/SGLang)需补齐
- **定价**:对比 DeepSeek/Qwen 不具明显优势

---

## 九、相关概念

- [[概念/llm-architectures|LLM 架构]]
- [[概念/moe|MoE 混合专家]]
- [[概念/kv-cache|KV Cache]]
- [[概念/long-context-llm|长上下文 LLM]]
- [[概念/reasoning-models|推理模型]]
- [[概念/mamba|Mamba SSM]]
- [[概念/rope|RoPE]]
- [[概念/multimodal-llm|多模态 LLM]]

---

## 十、See Also(深度专题)

- [Hunyuan-Large 论文 arXiv:2411.02265](https://arxiv.org/abs/2411.02265) — 腾讯官方
- [Hunyuan-Large GitHub](https://github.com/Tencent/Tencent-Hunyuan-Large) — 腾讯官方
- [Hunyuan-Large HuggingFace](https://huggingface.co/tencent/Tencent-Hunyuan-Large) — 腾讯官方
- [Hunyuan 腾讯云产品页](https://cloud.tencent.com/product/hunyuan) — 腾讯官方
- [Hunyuan3D 2.1 GitHub](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1) — 腾讯官方
- [Hunyuan Video 知乎技术报告解读](https://zhuanlan.zhihu.com/p/10533963751) — 中文社区

---

## 2026 混元生态速览

| 特性 / 工具 | 说明 | 状态 |
|---|---|---|
| **Hunyuan-Large** | 389B MoE,256K 上下文,GQA+CLA | GA |
| **Hunyuan TurboS** | Hybrid Mamba-Transformer MoE | GA |
| **Hunyuan T1** | 首个深度推理模型,基于 TurboS | GA |
| **Hy3** | 295B MoE,21B 激活,Coding/长文/Agent | GA |
| **Hy-MT2-Pro** | 翻译模型,15 语种 | GA |
| **Hunyuan Vision** | 多模态系列,Turbo/Lite/Standard | GA |
| **HunyuanVideo** | 13B 视频生成,开源 SOTA | GA |
| **Hunyuan3D 2.5** | 3D 生成,PBR 材质 | GA |
| **HunyuanWorld 1.0** | 沉浸式 3D 世界生成 | Beta |
| **腾讯元宝** | C 端 AI 助手,日活千万级 | GA |

## 生产最佳实践

1. **中文场景首选**:Hunyuan-Large 中文压缩率高(3.13 char/token)
2. **超长上下文(>128K)**:选 Hunyuan-Large 256K 预训练版
3. **深度推理**:Hunyuan T1 + 设置 thinking_budget
4. **多模态**:Hunyuan-Turbo-Vision 主流选择
5. **私有化部署**:vLLM 后端 + BF16/INT8/FP8 量化
6. **企业集成**:腾讯云 TI 平台一键精调
7. **A/B 评估**:Hunyuan vs DeepSeek vs Qwen 中文场景对比
8. **代码生成**:Hy3 / Hunyuan-Code 优于通用模型
9. **翻译**:Hy-MT2-Pro 15 语种,质量 SOTA
10. **Mamba 路线**:长序列推理场景关注 TurboS 进展
