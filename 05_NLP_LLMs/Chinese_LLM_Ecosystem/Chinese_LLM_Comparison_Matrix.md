---
title: "中国大模型全厂商对比矩阵 (Chinese LLM Comparison Matrix)"
category: "04-nlp-llms-chinese-llm-ecosystem"
tags: ["chinese-llm", "comparison", "benchmark", "moe", "multimodal", "open-source", "api-pricing"]
summary: "中国 15 家大模型厂商的全面横向对比：技术架构、参数规模、Benchmark 性能、API 定价、开源策略、特色能力一览。(2026-06-17 更新 GLM-5.2: 1M 上下文 / IndexShare / Day 0 八家国产算力适配)"
created: "2026-06-12"
updated: "2026-06-17"
---

# 中国大模型全厂商对比矩阵 (Chinese LLM Comparison Matrix)

> **一句话理解**: 一张表看懂中国大模型全貌——从 DeepSeek 到字节豆包，15 家厂商的技术架构、性能、价格、开源策略全面对比。

---

## 1. 全厂商技术对比矩阵

| 厂商 | 旗舰模型 | 参数量 | 架构 | 上下文 | 多模态 | 开源 | 特色能力 |
|------|---------|--------|------|--------|--------|------|----------|
| DeepSeek | V4 Pro | 1.6T/49B | MoE+MLA | 1M | 文+图 | 是 | 最低训练成本 |
| Qwen 通义 | Qwen3-Max | 未公开 | MoE+GQA | 128K | 文+图+音频 | 是 | 最全开源生态 |
| 智谱 GLM | GLM-5.2 | 744B/40B | MoE+MLA+IndexShare | **1M** | 文+图+视频 | 是 (MIT) | 长程任务+国产算力 Day 0 |
| Kimi | K2.6 | 1.04T/32.6B | MoE+MLA | 128K | 文+图 | 是 | 长上下文先驱 |
| MiniMax | M2.7 | 456B/45.9B | MoE+Lightning | 4M | 全模态 | 是 | 线性注意力 |
| 小米 MiMo | V2.5-Pro | 1T/42B | MoE+MTP | 128K | 文+图 | 是 | Agent-First |
| 百度文心 | ERNIE 4.5 | ~1T+ | Dense | 128K | 文+图+视频 | 否 | 搜索增强 |
| 百川 | Baichuan-4 | ~500B+ | MoE | 128K | 文本 | 否 | 搜索增强+医疗 |
| 零一万物 Yi | Yi-1.5-34B | 34B | Dense+GQA | 200K | 文+图 | 是 | Apache 2.0 |
| 阶跃星辰 | Step-2 | ~1T+ | MoE | 128K | 文+图 | 否 | 多模态领先 |
| 腾讯混元 | Pro 2.0 | ~1T+ | MoE | 128K | 文+图+视频+3D | 部分 | 视频生成 |
| 讯飞星火 | Spark 4.5 | ~500B+ | Dense | 128K | 文+图+语音 | 否 | 语音+教育 |
| 商汤日日新 | SenseNova 5.0 | ~1T | Dense | 128K | 文+图+视频+语音 | 部分 | 数字人+CV |
| 书生浦语 | InternLM3 | 20B | Dense+GQA | 128K | 文+图 | 是 | 工具链完整 |
| 字节豆包 | Doubao-1.5 Pro | ~500B+ | Dense | 128K | 文+图+视频 | 否 | 超级App分发 |

---

## 2. Benchmark 横向对比

### 2.1 综合能力 (MMLU)

| 厂商 | 旗舰 MMLU | 级别 |
|------|----------|------|
| DeepSeek-V3 | 88.5% | GPT-4 级 |
| Kimi K2 | 89.5% | GPT-4 级 |
| Qwen3 | ~88% | GPT-4 级 |
| GLM-5.2 | ~89% (估) | GPT-4+ / Opus 4.7~4.8 |
| ERNIE 4.5 | ~88% | GPT-4 级 |
| Hunyuan-Pro 2.0 | ~86% | 近 GPT-4 |
| Step-2 | ~84% | GPT-3.5+ |
| MiniMax Text-01 | ~87% | 近 GPT-4 |
| Spark 4.5 | ~83% | GPT-3.5+ |
| Doubao-1.5 Pro | ~83% | GPT-3.5+ |
| Baichuan-4 | ~85% | GPT-3.5+ |
| Yi-1.5-34B | 79.2% | GPT-3.5 |
| InternLM3-20B | ~76% | GPT-3.5 |
| SenseNova 5.0 | ~82% | GPT-3.5+ |

### 2.2 中文能力 (C-Eval)

| 厂商 | C-Eval | 排名 |
|------|--------|------|
| Qwen3 | ~91% | 1 |
| DeepSeek-V3 | 90.8% | 2 |
| Kimi K2 | ~90% | 3 |
| ERNIE 4.5 | ~92% | 1 (估计) |
| GLM-4.5 | ~88% | 5 |
| Step-2 | ~88% | 5 |
| Hunyuan-Large | 86.5% | 7 |
| Spark 4.5 | ~89% | 4 |
| MiniMax | ~87% | 6 |

---

## 3. API 定价对比

| 厂商 | 旗舰模型 | 输入/千tokens | 输出/千tokens | 性价比 |
|------|---------|-------------|-------------|--------|
| DeepSeek | V3 | ¥0.002 | ¥0.008 | ★★★★★ |
| 字节豆包 | Lite | ¥0.0008 | ¥0.001 | ★★★★★ |
| 腾讯混元 | Lite | ¥0.001 | ¥0.002 | ★★★★★ |
| 讯飞星火 | Lite | ¥0.001 | ¥0.002 | ★★★★★ |
| 百度文心 | Speed | ¥0.004 | ¥0.008 | ★★★★☆ |
| 腾讯混元 | Standard | ¥0.004 | ¥0.008 | ★★★★☆ |
| 零一万物 | yi-medium | ¥0.01 | ¥0.01 | ★★★★☆ |
| Qwen | qwen-max | ¥0.04 | ¥0.08 | ★★★☆☆ |
| 百度文心 | 4.5 Ultra | ¥0.12 | ¥0.12 | ★★☆☆☆ |
| 阶跃星辰 | Step-2 | ¥0.05 | ¥0.05 | ★★★☆☆ |
| Kimi | moonshot-v1 | ¥0.012 | ¥0.012 | ★★★★☆ |
| MiniMax | abab-7 | ¥0.015 | ¥0.015 | ★★★★☆ |

---

## 4. 能力雷达评估

> ★★★★★ = 业内领先, ★★★★☆ = 优秀, ★★★☆☆ = 良好, ★★☆☆☆ = 一般, ★☆☆☆☆ = 弱

| 厂商 | 中文 | 数学 | 代码 | 多模态 | 长上下文 | Agent | 开源 |
|------|------|------|------|--------|---------|-------|------|
| DeepSeek | ★★★★★ | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★★★ |
| Qwen | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ |
| GLM | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★★ |
| Kimi | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★★☆ |
| MiniMax | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ |
| 百度文心 | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★☆☆☆ |
| 腾讯混元 | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| 讯飞星火 | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★☆☆☆ |
| 字节豆包 | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★☆☆☆☆ |
| 阶跃星辰 | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★☆☆☆ |

---

## 5. 选型决策树

```
你的需求是什么？
════════════════════════════════════════════════════════════════════

  需要开源模型本地部署:
  ├── 最佳综合能力 → Qwen2.5-72B (Apache 2.0)
  ├── 最佳性价比   → DeepSeek-V3 (MIT)
  ├── 最轻量端侧   → Qwen2.5-0.5B / Yi-1.5-6B
  ├── 编程专用     → Yi-Coder-9B / DeepSeek-Coder
  └── 多模态       → InternVL2-76B / Qwen2.5-VL

  需要 API 服务:
  ├── 极致性价比   → DeepSeek API (¥0.002/千tokens)
  ├── 最高质量     → DeepSeek-V3 / Qwen-Max / Kimi K2
  ├── 中文场景     → ERNIE 4.5 / Qwen
  ├── 搜索增强     → ERNIE 4.5 / Baichuan-4
  ├── 视频生成     → HunyuanVideo / MiniMax Hailuo
  ├── 语音对话     → 讯飞星火 / ERNIE
  └── 开发者平台   → Coze (字节) / 千帆 (百度)

  行业场景:
  ├── 教育         → 讯飞星火 / 百度文心
  ├── 医疗         → 百川 Baichuan-M1 / 百度文心
  ├── 金融         → 百度文心 / 百川
  ├── 智慧城市     → 商汤日日新
  ├── 数字人       → 商汤如影
  ├── 自动驾驶     → 商汤绝影 / 小米 MiMo
  └── 企业办公     → 字节豆包(飞书) / 腾讯混元(企业微信)

  国产算力:
  ├── 昇腾NPU      → 讯飞星火 (飞星一号)
  ├── 昆仑芯片     → 百度文心
  └── 全国产化     → 讯飞 + 华为昇腾组合
```

---

## 6. 融资与估值

| 厂商 | 最新估值 | 投资方 | 备注 |
|------|---------|--------|------|
| DeepSeek | ~$15B+ | 幻方量化 (自有) | 不对外融资 |
| Qwen (阿里) | N/A (阿里子业务) | 阿里巴巴 | 阿里云 |
| 智谱 AI | ~$5B+ | 社保基金、美团等 | 2024 年融资 |
| Kimi 月之暗面 | ~$3B+ | 阿里、小红书等 | 2024 年融资 |
| MiniMax | ~$2.5B+ | 腾讯、阿里等 | 2024 年融资 |
| 百川智能 | ~$5B | 腾讯、小米等 | 2023 年融资 |
| 零一万物 | ~$1B+ | 阿里云等 | 2025 年战略调整 |
| 阶跃星辰 | ~$1B+ | 多家机构 | 2024 年融资 |
| 小米 MiMo | N/A (小米子业务) | 小米集团 | 小米汽车联动 |
| 百度文心 | N/A (百度子业务) | 百度 | 百度智能云 |
| 腾讯混元 | N/A (腾讯子业务) | 腾讯 | 腾讯云 |
| 讯飞星火 | ~$12B (科大讯飞市值) | 上市公司 | A股 002230 |
| 商汤 | ~$3B (港股) | 上市公司 | 港股 0020 |
| 字节豆包 | N/A (字节子业务) | 字节跳动 | 未上市 |
| 书生浦语 | N/A (国家级实验室) | 政府拨款 | 上海AI Lab |

---

## 7. 训练基础设施对比

| 厂商 | GPU 集群 | 训练框架 | 并行策略 | 精度 | 估算训练成本 |
|------|---------|---------|---------|------|------------|
| DeepSeek | 2,048 H800 | HAI-LLM | DP×TP×PP×EP + DualPipe | **FP8** | **$5.6M** |
| Qwen | 大规模 H100/A100 | Megatron | DP×TP×PP | BF16 | 未公开 (~$10M+) |
| GLM | A100/H100 + 8 家国产芯片 Day 0 | DeepSpeed + **Slime** | DP×TP×PP + ZeRO-3 + 大规模 Agentic RL | BF16 | 未公开 |
| Kimi | 大规模 H100 | 自研 | DP×TP×PP×EP | BF16 | 未公开 |
| 百度文心 | 万卡级(昆仑+A100) | PaddlePaddle | DP×TP×PP | BF16 | 未公开 |
| 腾讯混元 | 大规模 H100 | Megatron+自研 | DP×TP×PP×EP | BF16 | 未公开 |
| 讯飞星火 | **数千昇腾910B** | **MindSpore** | 自动并行 | FP16 | 未公开 |
| 书生浦语 | 中等 A100 | InternEvo | DP×TP×PP | BF16 | 较低 (20B级) |

> 详细训练架构、MoE 训练配置、RLHF 流水线参见 [[Chinese_LLM_Training_Inference_Platforms]]

## 8. 推理部署方案对比

| 厂商 | 官方推理引擎 | 量化方案 | KV Cache 优化 | 开源推理支持 | 端侧方案 |
|------|------------|---------|-------------|------------|---------|
| DeepSeek | 自研 | **FP8 原生** | MLA 压缩 95% | vLLM, SGLang | llama.cpp |
| Qwen | 自研 | AWQ/GPTQ | GQA + PagedAttn | vLLM, TGI, SGLang | Qwen2.5-0.5B + Ollama |
| GLM | 自研 | INT8 + **FP8** + **IndexShare** 稀疏注意力 | GQA + 每4层共享 indexer | vLLM, TGI, SGLang | ChatGLM.cpp + 国产芯片原生 |
| 百度文心 | 千帆平台 | INT8 | 搜索增强缓存 | 有限 | ERNIE Tiny |
| 腾讯混元 | TI 平台 | INT8 | PagedAttn | vLLM (Hunyuan-Large) | Hunyuan Lite |
| MiniMax | 自研 | INT8 | **Lightning O(n)** | 有限 | - |
| 讯飞星火 | 开放平台 | INT8 | **昇腾 NPU 优化** | 有限 | Spark Mini |
| 书生浦语 | **LMDeploy** | W4A16 | KV 量化 | vLLM, LMDeploy | InternLM2-1.8B |
| 字节豆包 | 火山方舟 | INT8 | - | 有限 | Doubao Lite |

> 详细推理优化、部署配置、成本分析参见 [[Chinese_LLM_Training_Inference_Platforms]]

## 9. 国产算力适配矩阵

| 厂商 | NVIDIA GPU | 华为昇腾 | 百度昆仑 | 寒武纪 | 燧原 |
|------|-----------|---------|---------|--------|------|
| DeepSeek | H800 (主力) | - | - | - | - |
| Qwen | H100/A100 | 适配中 | - | - | - |
| GLM | A100/H100 | **昇腾 / 平头哥 / 摩尔线程 / 寒武纪 / 昆仑芯 / 沐曦 / 海光 / 壁仞 (Day 0 全适配)** | - | - | - |
| 百度文心 | A100 | - | **主力** | - | - |
| 腾讯混元 | H100 | - | - | - | - |
| 讯飞星火 | - | **昇腾910B (主力)** | - | - | - |
| 书生浦语 | A100 | 适配中 | - | - | - |
| 商汤 | A100/H100 | - | - | - | - |

## 10. 扩展阅读

### 训推平台深度参考

- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Chinese_LLM_Training_Inference_Platforms]] — **训练推理平台实战参考** (核心文档)
- [[09_Deployment_Inference/vLLM_Deep_Dive]] — vLLM 推理引擎深度解析
- [[09_Deployment_Inference/SGLang_Deep_Dive]] — SGLang 推理引擎
- [[09_Deployment_Inference/LMDeploy_Deep_Dive]] — LMDeploy (InternLM)
- [[09_Deployment_Inference/TensorRT_LLM_Deep_Dive]] — TensorRT-LLM
- [[09_Deployment_Inference/Quantization_Techniques_2026]] — 量化技术全景
- [[09_Deployment_Inference/Prompt_Caching_and_KV_Cache_Optimization]] — KV Cache 优化
- [[09_Deployment_Inference/Speculative_Decoding_Advanced_2026]] — 投机解码

### 厂商深度解析

- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/README]] — 中国大模型生态总览
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/DeepSeek_Deep_Dive]] — DeepSeek 深度解析
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Qwen_Deep_Dive]] — 通义千问深度解析
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/GLM_Zhipu_Deep_Dive]] — 智谱 GLM 深度解析
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Baidu_ERNIE_Deep_Dive]] — 百度文心深度解析
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Tencent_Hunyuan_Deep_Dive]] — 腾讯混元深度解析
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/iFlytek_Spark_Deep_Dive]] — 讯飞星火深度解析
- [[04_NLP_LLMs/LLM_Architectures/MoE_Routing_and_Load_Balancing]] — MoE 路由与负载均衡
- [[90_Learn/courses/microsoft/microsoft_genai_for_beginners]] — 生成式 AI 入门课程

---

*Last updated: 2026-06-12*
