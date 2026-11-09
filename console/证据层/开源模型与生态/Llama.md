---
线索: Llama
主题: 开源模型与生态
别名: [LLaMA, Llama 2, Llama 3, Llama 4]
状态: 活跃
创建: 2026-07-30
更新: 2026-09-04
关键角色: [Meta]
---

# Llama

> Meta 的开放权重模型系列，一度定义了「开源 AI」的天花板，也是巨头开源战略的最大实验。

## 概述

Llama 是 Meta 的开放权重大模型系列。2023 年 2 月首代以研究许可发布（权重随即遭泄露，意外催生开源微调生态）；Llama 2 转向可商用开放；Llama 3.1 405B 首次让开放权重模型逼近闭源旗舰。Llama 生态（下载量以亿计）是 Hugging Face 社区、微调工具链与端侧推理（llama.cpp）繁荣的土壤。

该线索追踪 Llama 的版本演进、许可策略与其在开源生态中地位的起落。

### 2026-09

- **2026-09-02** · [Meta 发布 Muse Spark 1.3，智能体与科学推理能力提升](https://aihot.virxact.com/items/cmtkkcguj04aurollf1lq9a9s)
  Meta 首席 AI 官 Alexandr Wang 官宣；Artificial Analysis 口径 Intelligence Index 61-62，逼近 Claude 与 GPT-5.6——Muse 闭源路线持续挤压 Llama 的产品位置。

### 2026-07

- **2026-07-24** · [英伟达、微软和 Meta 联合警告：避免对开放权重模型过度监管](https://aihot.virxact.com/items/cmrzbx19q0032roqz8nwff6am)
  已转向闭源 Muse Spark 的 Meta 仍与英伟达、微软联手捍卫 Llama 所代表的开放权重生态，联合警告监管机构勿过度监管开放权重模型。
- **2026-07-09** · [Muse Spark 1.1 发布](https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/)
  面向 agentic 任务，100 万 token 上下文窗口；首个 Meta 要求付费的模型。Llama 在智能眼镜等产品上的位置持续被 Muse Spark 取代。
- **2026-07-07** · [Meta 推出 Muse Image 与 Muse Video](https://aihot.virxact.com/items/cmrb2mxmc0072ihl1mx0aw1bz)
  Meta Superintelligence Labs 官方 X 宣布 Muse 家族从语言扩展至图像与视频生成，闭源专有路线全面铺开，进一步压缩 Llama 在 Meta 产品矩阵中的位置。

### 2026-04

- **2026-04** · [Meta 战略大转向：发布 Muse Spark，首个闭源专有模型](https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs/)
  Meta Superintelligence Labs 发布首个**闭源专有**模型 Muse Spark，实质取代 Llama 系列成为 Meta 的旗舰路线；约 9 个月构建，号称以 1/10 算力达到 Llama 4 Maverick 同等性能；开始在智能眼镜上取代 Llama。**Llama 4 Behemoth 至此仍未正式发布**（整个 2026 年 1-8 月持续推迟），社区开源底座已转向 Qwen / DeepSeek。

### 2025-04

- **2025-04** · [Llama 4 发布，口碑受挫](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
  Scout/Maverick 两款 MoE 模型发布，原生多模态 + 超长上下文，但基准表现与实际体验的落差（LMArena 特调版争议）引发社区信任危机；巨型旗舰 Behemoth 推迟，团队随后并入超级智能实验室重组。

### 2024-07

- **2024-07-23** · [Llama 3.1 405B 发布](https://ai.meta.com/blog/meta-llama-3-1/)
  首个逼近 GPT-4 级的开放权重模型，Zuckerberg 同步发表《Open Source AI Is the Path Forward》宣言，开放权重路线达到声望顶点。

### 2024-04

- **2024-04-18** · [Llama 3 发布](https://ai.meta.com/blog/meta-llama-3/)
  8B/70B 双尺寸，15T token 训练，8B 模型即超越前代 70B 的表现，成为此后一年开源微调生态的默认底座。

### 2023-07

- **2023-07-18** · [Llama 2 发布并开放商用](https://ai.meta.com/blog/llama-2/)
  与微软联合发布，许可允许商用（月活 7 亿以下），「开放权重 + 商用许可」的组合正式确立 Meta 的生态战略。

### 2023-02

- **2023-02-24** · LLaMA 首代发布
  仅限研究申请，但权重一周内在 4chan 泄露，社区随即涌现 Alpaca、Vicuna 等微调模型与 llama.cpp 端侧推理——开源 LLM 生态的「寒武纪爆发」由此开始。

## 分析

1. **开源作为武器**：Meta 开放权重的战略逻辑是商品化补充品——模型不是 Meta 的收入来源，开放它可以瓦解对手（OpenAI）的 API 溢价、聚拢生态与人才、影响监管叙事。Llama 3.1 时期这一战略几乎完胜。

2. **王座易主的警示**：2025 年 Llama 4 的失速与 DeepSeek/Qwen 的崛起表明，开源领导地位没有护城河——它只属于「最新最强且真开放」的那个模型。开源社区的忠诚以月计。

3. **「开放权重」≠「开源」**：Llama 许可的使用限制（月活门槛、命名要求）使 OSI 等组织拒绝称其为开源。这场定义之争实质是「谁有资格代表开源 AI」的话语权之争。

## 关联线索

- [[开源模型与生态/DeepSeek]]
- [[消费级AI应用/Meta-AI]]
- [[推理与基础设施/vLLM与推理引擎]]
