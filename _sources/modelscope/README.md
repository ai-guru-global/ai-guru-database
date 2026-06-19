---
title: "ModelScope 数据源 (ModelScope Source)"
category: sources
tags: ["modelscope", "chinese-llm", "model-hub", "data-source", "scraped"]
summary: "从 ModelScope (魔搭社区) 官方 API 全量抓取 15 家中国大模型厂商的组织信息与已发布模型清单。原始数据以 JSON 形式存于 raw/ 子目录。"
created: 2026-06-19
updated: 2026-06-19
source: https://modelscope.cn/
scrape_date: 2026-06-19
---

# ModelScope 数据源 (ModelScope Source)

> **一句话理解**: 本目录存放从 [ModelScope 魔搭社区](https://modelscope.cn/) 官方 API 全量抓取的 **15 家中国大模型厂商** 的组织信息与已发布模型清单原始数据。

- **抓取时间**: 2026-06-19
- **覆盖厂商**: 15 家
- **模型总数**: 1,621
- **累计下载量**: 197,281,034
- **API**: `PUT https://modelscope.cn/api/v1/dolphin/models`

## 抓取方法 (Methodology)

1. 通过 ModelScope 官方模型搜索接口 `PUT /api/v1/dolphin/models`，以组织命名空间 (namespace) 为关键词分页检索。
2. 对返回结果按 `Path` 字段精确过滤，仅保留官方组织发布的模型（剔除社区量化版/微调版如 `bartowski`、`mlx-community`、`unsloth`、`DevQuasar` 等）。
3. 对命名空间与检索词不一致的厂商采用多检索词并集去重（如 InternLM 的官方 namespace 为 `Shanghai_AI_Laboratory`；Moonshot 用 `moonshot-ai`/`kimi`；ByteDance 官方模型位于 `bytedance-community`）。
4. 完整分页直至结果耗尽（Qwen 达 219 页），按下载量降序保存。

## 组织 → 命名空间映射 (Org → Namespace)

| 厂商 | 官方 namespace | 组织主页 | 模型数 |
|------|---------------|---------|--------|
| 阿里 · 通义千问 (Qwen) | `qwen` | [主页](https://modelscope.cn/organization/qwen) | 437 |
| 深度求索 (DeepSeek) | `deepseek-ai` | [主页](https://modelscope.cn/organization/deepseek-ai) | 88 |
| 智谱 AI (ZhipuAI) | `ZhipuAI` | [主页](https://modelscope.cn/organization/ZhipuAI) | 168 |
| 零一万物 (01.AI) | `01ai` | [主页](https://modelscope.cn/organization/01ai) | 28 |
| 百川智能 (Baichuan) | `baichuan-inc` | [主页](https://modelscope.cn/organization/baichuan-inc) | 24 |
| 阶跃星辰 (StepFun) | `stepfun-ai` | [主页](https://modelscope.cn/organization/stepfun-ai) | 57 |
| 腾讯混元 (Tencent Hunyuan) | `Tencent-Hunyuan` | [主页](https://modelscope.cn/organization/Tencent-Hunyuan) | 84 |
| 上海 AI 实验室 · 书生 (InternLM) | `Shanghai_AI_Laboratory` | [主页](https://modelscope.cn/brand/view/internlm) | 443 |
| 商汤日日新 (SenseNova) | `SenseNova` | [主页](https://modelscope.cn/organization/SenseNova) | 30 |
| 昆仑万维 · 天工 (Skywork) | `Skywork` | [主页](https://modelscope.cn/organization/Skywork) | 74 |
| 月之暗面 (Moonshot AI) | `moonshotai` | [主页](https://modelscope.cn/organization/moonshotai) | 18 |
| MiniMax (MiniMax) | `MiniMax` | [主页](https://modelscope.cn/organization/MiniMax) | 18 |
| 科大讯飞 (iFLYTEK) | `iflytek` | [主页](https://modelscope.cn/organization/iflytek) | 4 |
| 字节跳动 Seed (ByteDance) | `bytedance-community` | [主页](https://modelscope.cn/organization/ByteDance-Seed) | 141 |
| 360 智脑 (Qihoo 360) | `qihoo360` | [主页](https://modelscope.cn/profile/qihoo360) | 7 |

> ⚠️ **命名空间说明**: 部分厂商在 ModelScope 的组织 URL 与实际模型 namespace 不一致——
> - **InternLM**: 组织 URL 为 `brand/view/internlm`，但模型实际归属于 `Shanghai_AI_Laboratory`。
> - **Moonshot**: 组织 URL 为 `organization/moonshotai`，但该 URL 直接检索命中数为 0，模型需经 `moonshot-ai`/`kimi` 关键词召回。
> - **ByteDance**: 用户提供的 `organization/ByteDance-Seed` 下无公开模型；官方模型位于 `bytedance-community` namespace。

## 原始数据文件 (Raw Files)

| 文件 | 厂商 | 模型数 | 说明 |
|------|------|--------|------|
| [`raw/Qwen.json`](raw/Qwen.json) | 阿里 · 通义千问 | 437 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/DeepSeek.json`](raw/DeepSeek.json) | 深度求索 | 88 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/ZhipuAI.json`](raw/ZhipuAI.json) | 智谱 AI | 168 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/01.AI.json`](raw/01.AI.json) | 零一万物 | 28 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/Baichuan.json`](raw/Baichuan.json) | 百川智能 | 24 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/StepFun.json`](raw/StepFun.json) | 阶跃星辰 | 57 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/Tencent_Hunyuan.json`](raw/Tencent_Hunyuan.json) | 腾讯混元 | 84 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/InternLM.json`](raw/InternLM.json) | 上海 AI 实验室 · 书生 | 443 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/SenseNova.json`](raw/SenseNova.json) | 商汤日日新 | 30 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/Skywork.json`](raw/Skywork.json) | 昆仑万维 · 天工 | 74 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/Moonshot.json`](raw/Moonshot.json) | 月之暗面 | 18 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/MiniMax.json`](raw/MiniMax.json) | MiniMax | 18 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/iFLYTEK.json`](raw/iFLYTEK.json) | 科大讯飞 | 4 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/ByteDance_Seed.json`](raw/ByteDance_Seed.json) | 字节跳动 Seed | 141 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/Qihoo_360.json`](raw/Qihoo_360.json) | 360 智脑 | 7 | 完整模型元数据 (名称/下载量/许可/任务/架构等) |
| [`raw/_summary.json`](raw/_summary.json) | — | — | 抓取汇总 |
| [`raw/scraper.py`](raw/scraper.py) | — | — | 抓取脚本（可复跑） |

## 数据字段 (Schema)

每个 `raw/<Org>.json` 包含:
- `organization`: 组织元信息（名称、简介、GitHub、创建时间）
- `model_count`: 官方模型总数
- `models[]`: 模型列表，每条含 `id`(Path/Name)、`Downloads`、`Stars`、`License`、`Libraries`、`ModelType`、`Architectures`、`Tasks`、`StorageSize`、`CreatedTime` 等

## 相关文档 (Related)

- [[Chinese_LLM_Ecosystem/ModelScope_Model_Catalog]] — 基于本数据生成的厂商模型目录（精选 Top 模型 + 统计）
- [[Chinese_LLM_Ecosystem/ModelScope_Model_Index]] — 全量 1,621 个模型的完整索引表
- [[Chinese_LLM_Ecosystem/README]] — 中国大模型生态全景

*Source: ModelScope (https://modelscope.cn/) · Scraped: 2026-06-19*