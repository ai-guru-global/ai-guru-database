---
title: "智谱 GLM-4.5 模型系列 (Zhipu AI GLM-4.5 Family)"
category: concepts
tags:
  - llm
  - glm
  - zhipu
  - chatglm
  - chinese-llm
  - moe
  - reasoning
  - agent
  - open-source
aliases:
  - GLM-4.5
  - GLM-4.5-Air
  - GLM-4.5V
  - ChatGLM
  - 智谱 GLM
  - Z.ai
relationships:
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/moe"
    type: uses
  - target: "概念/reasoning-models"
    type: extends
  - target: "概念/agent-architectures"
    type: related_to
  - target: "概念/long-context-llm"
    type: related_to
summary: "智谱 GLM-4.5(2025-07-28)是清华系出身的中国大模型六虎之一 Zhipu AI 的旗舰开源基座,355B 总参 / 32B 激活 MoE,在 12 项基准综合排名全球第三、国产与开源第一。原生融合思考/非思考双模式,MIT 协议开源,专为智能体应用设计,SWE-Bench Verified 帕累托前沿。Z.ai 海外版与智谱清言(chatglm.cn)双线运营,2025 Q4 IPO 进程启动。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
---

# 智谱 GLM-4.5 模型系列

> **一句话理解**: 清华系出身的"大模型六虎"领头羊,GLM-4.5 旗舰 355B MoE 以 1/2 DeepSeek-R1 参数、1/3 Kimi-K2 参数,在推理+代码+Agent 三项同时达到开源 SOTA,12 项基准综合全球第三。

---

## 一、公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | 智谱 AI(Zhipu AI / Z.ai) |
| **起源** | 清华大学计算机系知识工程实验室(KEG) |
| **创始人** | 唐杰、刘知远、张鹏(CEO) |
| **成立** | 2019 年 |
| **融资** | >160 亿元 / ~$22 亿美元(2025) |
| **投资方** | 高瓴、启明、阿里、腾讯、小米 |
| **海外品牌** | Z.ai |
| **C 端** | 智谱清言(chatglm.cn,2,500 万+ 用户) |
| **B 端** | BigModel.cn API + 行业解决方案 |
| **状态** | 2025 Q4 IPO 启动(科创板 / 港股) |

---

## 二、模型家族全景

```
智谱 GLM 模型家族
│
├── 旗舰文本 (2025)
│   ├── GLM-4.5 (355B 总参 / 32B 激活)
│   └── GLM-4.5-Air (106B 总参 / 12B 激活)
│
├── 多模态
│   └── GLM-4.5V (基于 GLM-4.5-Air 12B,图像+视频理解)
│
├── 上一代 (2024-2025)
│   ├── GLM-4-Plus (闭源旗舰)
│   ├── GLM-4-32B-0414 (开源推理,200 tokens/秒)
│   ├── GLM-4-Long (1M 上下文)
│   ├── GLM-4-Voice (语音)
│   └── GLM-4-CogViewX (图像生成)
│
├── 历史里程碑
│   ├── ChatGLM-6B (2023-03,首代开源)
│   ├── ChatGLM2-6B (2023-06)
│   ├── ChatGLM3-6B (2023-10)
│   └── GLM-4 (2024-01-16,128K,逼近 GPT-4)
│
└── 工具 / 平台
    ├── BigModel.cn (API)
    ├── 智谱清言(C 端)
    ├── Z.ai(海外)
    ├── CogVideoX(视频)
    ├── CodeGeeX(代码)
    └── AutoGLM(Agent)
```

---

## 三、GLM-4.5 旗舰技术解析

### 3.1 核心规格

| 维度 | GLM-4.5 | GLM-4.5-Air |
|---|---|---|
| **总参数** | 355B | 106B |
| **激活参数** | 32B | 12B |
| **上下文** | 128K | 128K |
| **架构** | MoE(Loss-free Balance + Sigmoid) | MoE |
| **注意力** | GQA + Partial RoPE + QK-Norm | 同 |
| **注意力头数** | 96 头(隐藏维度 5120,约 2.5× 常规) | 比例缩放 |
| **MTP 头** | 是(配合 EAGLE 推测解码) | 是 |
| **开源协议** | **MIT(可商用)** | **MIT(可商用)** |
| **API 价格** | 0.8 元/百万 in / 2 元/百万 out | 略低 |
| **高速版吞吐** | 100 tokens/秒 | 100 tokens/秒 |

### 3.2 三大架构创新

#### (1) "更深而非更宽"的设计哲学

与 DeepSeek-V3 等"扩宽度"路线不同,GLM-4.5 选择**多层数 + 小隐藏维度**:
- 同等算力预算下,深度网络显著提升推理能力
- 实验验证:在 MMLU/BBH 等推理基准上,深层架构持续占优

#### (2) 注意力层多重优化

```
GQA (Grouped-Query Attention)     → 减少 KV Cache
Partial RoPE                       → 灵活处理变长序列
QK-Norm                           → 归一化注意力 logits,稳定训练
96 个注意力头(2.5× 常规)           → 推理基准持续提升
                                   (实验发现:不影响 train loss 但提升泛化)
```

#### (3) Multi-Token Prediction (MTP) + EAGLE

- MTP 头:训练时预测 next + next-next token
- 推理时配合 **EAGLE 推测解码** 算法,一次生成多 token
- 推理速度提升 **2-3×**

### 3.3 路由与训练创新

**无损失平衡路由(Loss-free Balance Routing)+ Sigmoid 门控**:
- 避免传统 MoE 负载不均衡
- 32B/355B 激活占比 ~9%(高效)
- 12B/106B 激活占比 ~11.3%

**三阶段课程式训练**:

```
预训练 (Pre-training)
  ↓ 15T token 通用语料
中期训练 (Mid-training)
  ↓ 8T token 代码/推理/Agent 数据
后训练 (Post-training)
  ↓ SFT + RL(GRPO 等)
  ↓ 双模式:思考 / 非思考
```

**双推理模式**:
- **Thinking 模式**:CoT 思维链,适合复杂任务(数学/代码/Agent)
- **Non-thinking 模式**:快速响应,适合简单查询

### 3.4 关键成绩(2025-07-28 发布)

**综合排名(12 项基准)**:

| 排名 | 模型 | 说明 |
|---|---|---|
| 1-2 | (闭源旗舰) | 略 |
| **3** | **GLM-4.5** | **全球第三、国产第一、开源第一** |

**参数效率**:

| 模型 | 参数量 | SWE-Bench Verified |
|---|---|---|
| DeepSeek-R1 | 671B | 基线 |
| Kimi-K2 | 1T+ | 略高 |
| **GLM-4.5** | **355B(1/2 R1, 1/3 K2)** | **更高** |

**真实代码 Agent 评测**(智谱自建 52 个真实编程任务):

| 维度 | GLM-4.5 | Claude-4-Sonnet | Kimi-K2 | Qwen3-Coder |
|---|---|---|---|---|
| 任务完成度 | 优 | 优 | 中 | 中 |
| 工具调用可靠性 | 优 | 优 | 中 | 中 |
| 整体匹配度 | 平替 Sonnet | — | — | — |

**Agent 能力展示**(2025-07-28 同日发布 DEMO):
- 模拟搜索引擎(搜索 + 分析 + 聚合)
- 弹幕视频平台、微博模拟器(界面控制 + 内容生成)
- 可玩 Flappy Bird 游戏(前端动画 + 逻辑控制)
- 图文自动排版 PPT(16:9 / 社媒长图)

### 3.5 与 Claude Code 无缝兼容

```python
# API 兼容 Claude Code 框架
from anthropic import Anthropic

client = Anthropic(
    base_url="https://open.bigmodel.cn/api/anthropic",  # 智谱 Anthropic 兼容端点
    api_key="your-zhipu-key"
)

# 直接使用 Claude Code SDK
message = client.messages.create(
    model="glm-4.5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "用 Python 实现快速排序"}]
)
```

---

## 四、API 与生态接入

### 4.1 商业 API(BigModel.cn)

```python
# OpenAI 兼容
from openai import OpenAI

client = OpenAI(
    api_key="your-zhipu-key",
    base_url="https://open.bigmodel.cn/api/paas/v4"
)

# 思考模式
response = client.chat.completions.create(
    model="glm-4.5",
    messages=[{"role": "user", "content": "证明黎曼猜想"}],
    extra_body={"thinking": {"type": "enabled"}}  # 开启思考
)

# 多模态
response = client.chat.completions.create(
    model="glm-4.5v",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "这张图是什么?"},
            {"type": "image_url", "image_url": {"url": "https://..."}}
        ]
    }]
)
```

### 4.2 本地部署(vLLM / SGLang)

```bash
# vLLM 部署
pip install vllm

# 启动服务
vllm serve zai-org/GLM-4.5-Air \
  --tensor-parallel-size 4 \
  --max-model-len 131072 \
  --enable-reasoning

# 调用
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "GLM-4.5-Air",
    "messages": [{"role": "user", "content": "解释 MoE"}]
  }'
```

**HuggingFace 模型**:
- [zai-org/GLM-4.5](https://huggingface.co/zai-org/GLM-4.5)
- [zai-org/GLM-4.5-Air](https://huggingface.co/zai-org/GLM-4.5-Air)
- [zai-org/GLM-4.5V](https://huggingface.co/zai-org/GLM-4.5V)

---

## 五、关键人物

| 人物 | 角色 |
|---|---|
| **唐杰** | 创始人,清华计算机系教授,KEG 实验室主任 |
| **刘知远** | 联合创始人,清华 NLP 负责人 |
| **张鹏** | CEO |
| **KEG 实验室** | 学术根基,孕育 THUIR、AMiner 等开源项目 |

---

## 六、技术细节深挖

### 6.1 "思考模式"双模式设计

GLM-4.5 首次在单一模型中**原生融合**思考/非思考两种模式,避免切换多个模型:

```
                    输入
                     │
        ┌────────────┴────────────┐
        │                         │
   [思考模式]                  [非思考模式]
   Thinking Type: enabled       Thinking Type: disabled
        │                         │
   CoT 思维链                  直接回答
   工具调用规划                 单轮响应
   反思与验证                   低延迟
        │                         │
        └────────────┬────────────┘
                     │
                  输出统一
```

- **思考模式**:类似 o1 / DeepSeek-R1,内部展开推理
- **非思考模式**:类似 GPT-4o,直接回答
- **API 控制**:通过 `extra_body.thinking` 切换

### 6.2 Loss-free Balance Routing

传统 MoE 用辅助 loss 平衡负载,但会损害模型质量。GLM-4.5 采用**无损失平衡**:

```
Sigmoid 门控(每个 token 对每个专家打分)
  ↓
Top-k 选择(激活 top-k 专家)
  ↓
无辅助 loss,靠路由策略本身平衡
  ↓
激活比例:32B/355B(9%)、12B/106B(11.3%)
```

### 6.3 "96 注意力头"实验发现

实验发现:**更多的注意力头不降低 train loss,但在 MMLU/BBH 等推理基准上持续提升**。

这是一个"优化指标 vs 泛化能力"取舍的绝佳案例——监控训练 loss 难以发现,只有终态评估才能验证。

---

## 七、与竞品对比

| 维度 | GLM-4.5 | DeepSeek-R1 | Kimi-K2 | Qwen3-235B |
|---|---|---|---|---|
| **总参 / 激活** | 355B / 32B | 671B / 37B | 1T+ / 32B | 235B / 22B |
| **开源** | MIT | MIT | MIT | Apache 2.0 |
| **SWE-Bench** | 高(参数效率最优) | 基线 | 中 | 中 |
| **Agent 综合** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **API 价格(in/out 元)** | 0.8/2 | 极低 | 中 | 低 |
| **思考模式** | 原生双模 | 纯推理 | 混合 | 混合 |
| **MIT 协议商用** | ✅ | ✅ | ✅ | ✅ |
| **国际化** | Z.ai 海外 | 全球 | 全球 | 全球 |

---

## 八、争议与限制

- **海外品牌切换**:Z.ai vs 智谱清言,品牌策略复杂
- **IPO 压力**:2025 Q4 启动上市,业绩兑现压力
- **GLM-4.5 仍依赖 NVIDIA**:暂未提供完整昇腾/寒武纪适配
- **特殊任务**:垂直行业(医疗/法律)需微调

---

## 九、相关概念

- [[概念/llm-architectures|LLM 架构]]
- [[概念/moe|MoE 混合专家]]
- [[概念/reasoning-models|推理模型]]
- [[概念/agent-architectures|Agent 架构]]
- [[概念/eagle|EAGLE 推测解码]]
- [[概念/long-context-llm|长上下文 LLM]]
- [[概念/llm-benchmarks|LLM 评测]]
- [[概念/llm-pretraining|预训练]]

---

## 十、See Also(深度专题)

- [GLM-4.5 官方技术博客](https://z.ai/blog/glm-4.5) — 智谱官方
- [GLM-4.5 HuggingFace](https://huggingface.co/zai-org/GLM-4.5) — 智谱官方
- [GLM-4.5 ModelScope](https://www.modelscope.cn/models/ZhipuAI/GLM-4.5) — 智谱官方
- [BigModel.cn API 平台](https://open.bigmodel.cn/) — 智谱官方
- [Z.ai 海外版](https://z.ai) — 智谱官方
- [GLM-4.5 深度技术解析](https://blog.csdn.net/m0_47999117/article/details/158734785) — 第三方解读

---

## 2026 GLM 生态速览

| 特性 / 工具 | 说明 | 状态 |
|---|---|---|
| **GLM-4.5** | 355B MoE,32B 激活,MIT 开源 | GA |
| **GLM-4.5-Air** | 106B MoE,12B 激活,MIT 开源 | GA |
| **GLM-4.5V** | 多模态,基于 Air 12B | GA |
| **思考/非思考双模** | 原生融合,API 切换 | GA |
| **Claude Code 兼容** | 一键接入 Anthropic 协议 | GA |
| **BigModel.cn** | 商业 API,聚合多模型 | GA |
| **智谱清言** | C 端,2,500 万用户 | GA |
| **Z.ai** | 海外版,服务出海 | GA |
| **CodeGeeX** | 代码补全,VS Code/JetBrains 插件 | GA |
| **AutoGLM** | 手机/浏览器 Agent | Beta |
| **CogVideoX** | 视频生成模型 | GA |

## 生产最佳实践

1. **国产开源首选**:GLM-4.5-Air(12B 激活)成本最低,适合中小团队
2. **Agent 场景**:GLM-4.5 355B 是 2025 H2 国内最佳开源选择
3. **Claude Code 迁移**:Z.ai 兼容 Anthropic 协议,零代码迁移
4. **思考模式控本**:简单任务用 non-thinking,复杂任务再开 thinking
5. **本地部署**:vLLM 0.5+ 已支持,SGLang/TensorRT-LLM 跟进中
6. **多模态**:GLM-4.5V 单卡 H800 可跑,视频理解原生支持
7. **私有化**:支持 8×H20 LoRA 微调
8. **微调框架**:MS-SWIFT、Axolotl、LLaMA-Factory 均支持
9. **评测验证**:用 OpenCompass / AlignBench / SWE-Bench 复测
10. **海外部署**:Z.ai 端点合规 + 美元计费
