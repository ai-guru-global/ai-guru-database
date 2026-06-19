#!/usr/bin/env python3
"""Generate organized markdown from raw ModelScope JSON scrapes.

Outputs (all under the project root passed as argv[1]):
  - _sources/modelscope/README.md                      (source-layer doc)
  - 04_NLP_LLMs/Chinese_LLM_Ecosystem/ModelScope_Model_Catalog.md  (master catalog)
  - 04_NLP_LLMs/Chinese_LLM_Ecosystem/ModelScope_Model_Index.md    (full 1621-row table)
"""
import json
import glob
import os
import sys
import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))   # .../_sources/modelscope/raw
RAW_DIR = SCRIPT_DIR
TODAY = datetime.date.today().isoformat()

# display order + metadata (cn_name, en_name, user-provided org URL)
DISPLAY = [
    ("Qwen",            "阿里 · 通义千问",    "Qwen",            "https://modelscope.cn/organization/qwen"),
    ("DeepSeek",        "深度求索",            "DeepSeek",        "https://modelscope.cn/organization/deepseek-ai"),
    ("ZhipuAI",         "智谱 AI",             "ZhipuAI",         "https://modelscope.cn/organization/ZhipuAI"),
    ("01.AI",           "零一万物",            "01.AI",           "https://modelscope.cn/organization/01ai"),
    ("Baichuan",        "百川智能",            "Baichuan",        "https://modelscope.cn/organization/baichuan-inc"),
    ("StepFun",         "阶跃星辰",            "StepFun",         "https://modelscope.cn/organization/stepfun-ai"),
    ("Tencent_Hunyuan", "腾讯混元",            "Tencent Hunyuan", "https://modelscope.cn/organization/Tencent-Hunyuan"),
    ("InternLM",        "上海 AI 实验室 · 书生","InternLM",        "https://modelscope.cn/brand/view/internlm"),
    ("SenseNova",       "商汤日日新",          "SenseNova",       "https://modelscope.cn/organization/SenseNova"),
    ("Skywork",         "昆仑万维 · 天工",     "Skywork",         "https://modelscope.cn/organization/Skywork"),
    ("Moonshot",        "月之暗面",            "Moonshot AI",     "https://modelscope.cn/organization/moonshotai"),
    ("MiniMax",         "MiniMax",             "MiniMax",         "https://modelscope.cn/organization/MiniMax"),
    ("iFLYTEK",         "科大讯飞",            "iFLYTEK",         "https://modelscope.cn/organization/iflytek"),
    ("ByteDance_Seed",  "字节跳动 Seed",       "ByteDance",       "https://modelscope.cn/organization/ByteDance-Seed"),
    ("Qihoo_360",       "360 智脑",            "Qihoo 360",       "https://modelscope.cn/profile/qihoo360"),
]


def fmt_num(n):
    n = n or 0
    if n >= 1_000_000:
        return "{:.2f}M".format(n / 1_000_000)
    if n >= 1_000:
        return "{:.1f}K".format(n / 1_000)
    return str(n)


def fmt_bytes(b):
    b = b or 0
    for unit in ["B", "KB", "MB", "GB", "TB", "PB"]:
        if b < 1024:
            return "{:.1f} {}".format(b, unit)
        b /= 1024
    return "{:.1f} EB".format(b)


def fmt_date(ts):
    if not ts or ts < 0:
        return ""
    try:
        return datetime.datetime.utcfromtimestamp(ts).strftime("%Y-%m-%d")
    except Exception:
        return ""


def prose_to_text(desc):
    """Extract plain text from stringified ProseMirror JSON."""
    if not desc:
        return ""
    try:
        node = json.loads(desc) if isinstance(desc, str) else desc
    except Exception:
        return ""
    out = []

    def walk(n):
        if isinstance(n, str):
            out.append(n)
        elif isinstance(n, list):
            # [type, attrs, ...children]
            for child in n[2:] if len(n) >= 2 and isinstance(n[1], dict) else n[1:]:
                walk(child)
            if len(n) >= 1 and n[0] == "p":
                out.append("\n")
        elif isinstance(n, dict):
            for v in n.values():
                if isinstance(v, (str, list, dict)):
                    walk(v)

    walk(node)
    text = "".join(out)
    import re
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text


def load_all():
    data = {}
    for label, cn, en, url in DISPLAY:
        path = os.path.join(RAW_DIR, "{}.json".format(label))
        if not os.path.exists(path):
            continue
        d = json.load(open(path, encoding="utf-8"))
        d["_cn"] = cn
        d["_en"] = en
        d["_url"] = url
        data[label] = d
    return data


def task_name(m):
    ts = m.get("Tasks") or []
    names = [t.get("Name") for t in ts if isinstance(t, dict) and t.get("Name")]
    return "/".join(names) if names else "—"


def model_type(m):
    mt = m.get("ModelType") or []
    return ", ".join(mt) if mt else "—"


def top_license(models):
    lic = {}
    for m in models:
        l = (m.get("License") or "未标注").strip() or "未标注"
        lic[l] = lic.get(l, 0) + 1
    return sorted(lic.items(), key=lambda x: -x[1])


def dist(models, key):
    c = {}
    for m in models:
        vals = m.get(key) or []
        if isinstance(vals, str):
            vals = [vals]
        for v in vals:
            if isinstance(v, dict):
                v = v.get("Name")
            if v:
                c[v] = c.get(v, 0) + 1
    return sorted(c.items(), key=lambda x: -x[1])


def storage_total(models):
    return sum(m.get("StorageSize") or 0 for m in models)


# deep-dive wiki link per vendor (existing files)
DEEPDIVE = {
    "Qwen": "Qwen_Deep_Dive",
    "DeepSeek": "DeepSeek_Deep_Dive",
    "ZhipuAI": "GLM_Zhipu_Deep_Dive",
    "01.AI": "Yi_01AI_Deep_Dive",
    "Baichuan": "Baichuan_Deep_Dive",
    "StepFun": "StepFun_Deep_Dive",
    "Tencent_Hunyuan": "Tencent_Hunyuan_Deep_Dive",
    "InternLM": "InternLM_Deep_Dive",
    "SenseNova": "SenseTime_SenseNova_Deep_Dive",
    "Skywork": None,
    "Moonshot": "Kimi_Moonshot_Deep_Dive",
    "MiniMax": "MiniMax_Deep_Dive",
    "iFLYTEK": "iFlytek_Spark_Deep_Dive",
    "ByteDance_Seed": "ByteDance_Doubao_Deep_Dive",
    "Qihoo_360": None,
}


def gen_source_readme(data, project_root):
    total_models = sum(len(d["models"]) for d in data.values())
    total_dl = sum(sum(m.get("Downloads") or 0 for m in d["models"]) for d in data.values())
    lines = []
    lines.append("---")
    lines.append('title: "ModelScope 数据源 (ModelScope Source)"')
    lines.append("category: sources")
    lines.append('tags: ["modelscope", "chinese-llm", "model-hub", "data-source", "scraped"]')
    lines.append('summary: "从 ModelScope (魔搭社区) 官方 API 全量抓取 15 家中国大模型厂商的组织信息与已发布模型清单。原始数据以 JSON 形式存于 raw/ 子目录。"')
    lines.append("created: {}".format(TODAY))
    lines.append("updated: {}".format(TODAY))
    lines.append("source: https://modelscope.cn/")
    lines.append("scrape_date: {}".format(TODAY))
    lines.append("---")
    lines.append("")
    lines.append("# ModelScope 数据源 (ModelScope Source)")
    lines.append("")
    lines.append("> **一句话理解**: 本目录存放从 [ModelScope 魔搭社区](https://modelscope.cn/) 官方 API 全量抓取的 **15 家中国大模型厂商** 的组织信息与已发布模型清单原始数据。")
    lines.append("")
    lines.append("- **抓取时间**: {}".format(TODAY))
    lines.append("- **覆盖厂商**: 15 家")
    lines.append("- **模型总数**: {:,}".format(total_models))
    lines.append("- **累计下载量**: {:,}".format(total_dl))
    lines.append("- **API**: `PUT https://modelscope.cn/api/v1/dolphin/models`")
    lines.append("")
    lines.append("## 抓取方法 (Methodology)")
    lines.append("")
    lines.append("1. 通过 ModelScope 官方模型搜索接口 `PUT /api/v1/dolphin/models`，以组织命名空间 (namespace) 为关键词分页检索。")
    lines.append("2. 对返回结果按 `Path` 字段精确过滤，仅保留官方组织发布的模型（剔除社区量化版/微调版如 `bartowski`、`mlx-community`、`unsloth`、`DevQuasar` 等）。")
    lines.append("3. 对命名空间与检索词不一致的厂商采用多检索词并集去重（如 InternLM 的官方 namespace 为 `Shanghai_AI_Laboratory`；Moonshot 用 `moonshot-ai`/`kimi`；ByteDance 官方模型位于 `bytedance-community`）。")
    lines.append("4. 完整分页直至结果耗尽（Qwen 达 219 页），按下载量降序保存。")
    lines.append("")
    lines.append("## 组织 → 命名空间映射 (Org → Namespace)")
    lines.append("")
    lines.append("| 厂商 | 官方 namespace | 组织主页 | 模型数 |")
    lines.append("|------|---------------|---------|--------|")
    for label, cn, en, url in DISPLAY:
        if label not in data:
            continue
        d = data[label]
        lines.append("| {} ({}) | `{}` | [主页]({}) | {} |".format(
            cn, en, d["namespace"], url, len(d["models"])))
    lines.append("")
    lines.append("> ⚠️ **命名空间说明**: 部分厂商在 ModelScope 的组织 URL 与实际模型 namespace 不一致——")
    lines.append("> - **InternLM**: 组织 URL 为 `brand/view/internlm`，但模型实际归属于 `Shanghai_AI_Laboratory`。")
    lines.append("> - **Moonshot**: 组织 URL 为 `organization/moonshotai`，但该 URL 直接检索命中数为 0，模型需经 `moonshot-ai`/`kimi` 关键词召回。")
    lines.append("> - **ByteDance**: 用户提供的 `organization/ByteDance-Seed` 下无公开模型；官方模型位于 `bytedance-community` namespace。")
    lines.append("")
    lines.append("## 原始数据文件 (Raw Files)")
    lines.append("")
    lines.append("| 文件 | 厂商 | 模型数 | 说明 |")
    lines.append("|------|------|--------|------|")
    for label, cn, en, url in DISPLAY:
        if label not in data:
            continue
        d = data[label]
        lines.append("| [`raw/{}.json`](raw/{}.json) | {} | {} | 完整模型元数据 (名称/下载量/许可/任务/架构等) |".format(
            label, label, cn, len(d["models"])))
    lines.append("| [`raw/_summary.json`](raw/_summary.json) | — | — | 抓取汇总 |")
    lines.append("| [`raw/scraper.py`](raw/scraper.py) | — | — | 抓取脚本（可复跑） |")
    lines.append("")
    lines.append("## 数据字段 (Schema)")
    lines.append("")
    lines.append("每个 `raw/<Org>.json` 包含:")
    lines.append("- `organization`: 组织元信息（名称、简介、GitHub、创建时间）")
    lines.append("- `model_count`: 官方模型总数")
    lines.append("- `models[]`: 模型列表，每条含 `id`(Path/Name)、`Downloads`、`Stars`、`License`、`Libraries`、`ModelType`、`Architectures`、`Tasks`、`StorageSize`、`CreatedTime` 等")
    lines.append("")
    lines.append("## 相关文档 (Related)")
    lines.append("")
    lines.append("- [[Chinese_LLM_Ecosystem/ModelScope_Model_Catalog]] — 基于本数据生成的厂商模型目录（精选 Top 模型 + 统计）")
    lines.append("- [[Chinese_LLM_Ecosystem/ModelScope_Model_Index]] — 全量 1,621 个模型的完整索引表")
    lines.append("- [[Chinese_LLM_Ecosystem/README]] — 中国大模型生态全景")
    lines.append("")
    lines.append("*Source: ModelScope (https://modelscope.cn/) · Scraped: {}*".format(TODAY))
    return "\n".join(lines)


def gen_catalog(data):
    total_models = sum(len(d["models"]) for d in data.values())
    total_dl = sum(sum(m.get("Downloads") or 0 for m in d["models"]) for d in data.values())
    total_stars = sum(sum(m.get("Stars") or 0 for m in d["models"]) for d in data.values())
    lines = []
    lines.append("---")
    lines.append('title: "ModelScope 模型目录全景 (ModelScope Model Catalog)"')
    lines.append("category: 04-nlp-llms-chinese-llm")
    lines.append('tags: ["modelscope", "chinese-llm", "model-hub", "qwen", "deepseek", "glm", "open-source", "catalog"]')
    lines.append('summary: "基于 ModelScope 官方 API 全量抓取的 15 家中国大模型厂商模型目录：每家的组织信息、模型矩阵、下载量统计、Top 模型精选与许可证分布。共 {:,} 个官方模型、{:,} 次累计下载。"'.format(total_models, total_dl))
    lines.append("created: {}".format(TODAY))
    lines.append("updated: {}".format(TODAY))
    lines.append("source: https://modelscope.cn/")
    lines.append("---")
    lines.append("")
    lines.append("# ModelScope 模型目录全景 (ModelScope Model Catalog)")
    lines.append("")
    lines.append("> **一句话理解**: ModelScope 魔搭社区上 15 家中国大模型厂商的**全量官方模型目录**——从 Qwen 的 437 个模型舰队到 DeepSeek 的 88 个开源模型，一张图看清各家在国产模型托管平台上的真实家底。")
    lines.append("")
    lines.append("## 总览 (Overview)")
    lines.append("")
    lines.append("| 指标 | 数值 |")
    lines.append("|------|------|")
    lines.append("| 覆盖厂商 | 15 家 |")
    lines.append("| 官方模型总数 | **{:,}** |".format(total_models))
    lines.append("| 累计下载量 | **{:,}** |".format(total_dl))
    lines.append("| 累计收藏量 | {:,} |".format(total_stars))
    lines.append("| 数据来源 | [ModelScope 官方 API](https://modelscope.cn/) |")
    lines.append("| 抓取时间 | {} |".format(TODAY))
    lines.append("")
    lines.append("## 厂商排名 (Vendor Ranking)")
    lines.append("")
    lines.append("按 ModelScope 累计下载量排序：")
    lines.append("")
    lines.append("| # | 厂商 | Namespace | 模型数 | 累计下载 | 人均下载 | 主力任务 | 深度文档 |")
    lines.append("|---|------|-----------|--------|---------|---------|---------|---------|")
    ranked = sorted(data.items(), key=lambda kv: -sum(m.get("Downloads") or 0 for m in kv[1]["models"]))
    for i, (label, d) in enumerate(ranked, 1):
        models = d["models"]
        dl = sum(m.get("Downloads") or 0 for m in models)
        avg = int(dl / len(models)) if models else 0
        tasks = dist(models, "Tasks")[:3]
        task_str = ", ".join("{}({})".format(n, c) for n, c in tasks) if tasks else "—"
        dd = DEEPDIVE.get(label)
        ddlink = "[[{}]]".format(dd) if dd else "—"
        lines.append("| {} | **{}** | `{}` | {} | {:,} | {} | {} | {} |".format(
            i, d["_cn"], d["namespace"], len(models), dl, fmt_num(avg), task_str, ddlink))
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 各厂商模型目录 (Per-Vendor Catalog)")
    lines.append("")

    for label, cn, en, url in DISPLAY:
        if label not in data:
            continue
        d = data[label]
        models = d["models"]
        org = d.get("organization") or {}
        desc = prose_to_text(org.get("Description"))
        dl = sum(m.get("Downloads") or 0 for m in models)
        stars = sum(m.get("Stars") or 0 for m in models)
        licenses = top_license(models)
        libs = dist(models, "Libraries")
        archs = dist(models, "Architectures")
        mtypes = dist(models, "ModelType")
        tasks = dist(models, "Tasks")
        dd = DEEPDIVE.get(label)
        ddlink = "（详见 [[{}]]）".format(dd) if dd else ""

        lines.append("### {} ({}){}".format(cn, en, ddlink))
        lines.append("")
        lines.append("| 维度 | 详情 |")
        lines.append("|------|------|")
        lines.append("| **ModelScope 主页** | [{}]({}) |".format(url, url))
        lines.append("| **官方 namespace** | `{}` |".format(d["namespace"]))
        if org.get("FullName"):
            lines.append("| **组织全称** | {} |".format(org.get("FullName")))
        if org.get("GithubAddress"):
            lines.append("| **GitHub** | {} |".format(org.get("GithubAddress").strip()))
        if org.get("GmtCreated"):
            lines.append("| **组织创建时间** | {} |".format(org.get("GmtCreated")[:10]))
        lines.append("| **模型总数** | {} |".format(len(models)))
        lines.append("| **累计下载** | {:,} |".format(dl))
        lines.append("| **累计收藏** | {:,} |".format(stars))
        lines.append("| **总存储** | {} |".format(fmt_bytes(storage_total(models))))
        if licenses:
            lic_str = "; ".join("{} ({})".format(l, c) for l, c in licenses[:4])
            lines.append("| **许可证分布** | {} |".format(lic_str))
        if mtypes:
            mt_str = ", ".join("{} ({})".format(n, c) for n, c in mtypes[:5])
            lines.append("| **主要模型类型** | {} |".format(mt_str))
        if tasks:
            tk_str = ", ".join("{} ({})".format(n, c) for n, c in tasks[:5])
            lines.append("| **主要任务** | {} |".format(tk_str))
        if archs:
            ar_str = ", ".join("{} ({})".format(n, c) for n, c in archs[:5])
            lines.append("| **主要架构** | {} |".format(ar_str))
        lines.append("")

        if desc:
            lines.append("> 📝 **组织简介**: {}".format(desc.replace("\n", " ")[:300]))
            lines.append("")

        # Top 15 models table
        top_n = min(15, len(models))
        if models:
            lines.append("**Top {} 模型（按下载量）**:".format(top_n))
            lines.append("")
            lines.append("| # | 模型 | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 |")
            lines.append("|---|------|------|------|------|------|------|------|------|")
            for i, m in enumerate(models[:top_n], 1):
                lines.append("| {} | [{}]({}) | {} | {} | {} | {:,} | {} | {} | {} |".format(
                    i,
                    m["Name"],
                    m["url"],
                    (m.get("ModelType") or ["—"])[0] if m.get("ModelType") else "—",
                    task_name(m),
                    (m.get("License") or "—"),
                    m.get("Downloads") or 0,
                    m.get("Stars") or 0,
                    fmt_bytes(m.get("StorageSize")),
                    fmt_date(m.get("LastUpdatedTime")),
                ))
            if len(models) > top_n:
                lines.append("")
                lines.append("> 📋 完整 {} 个模型清单见 [[ModelScope_Model_Index]]。".format(len(models)))
            lines.append("")

        # special note for namespace quirks
        if label == "ByteDance_Seed":
            lines.append("> ⚠️ **注意**: 字节跳动提供的组织主页 `ByteDance-Seed` 下无公开模型；ModelScope 上字节系模型实际发布于 `bytedance-community` namespace，本目录以该 namespace 为准。")
            lines.append("")
        if label == "InternLM":
            lines.append("> ℹ️ 书生浦语模型归属上海 AI 实验室 `Shanghai_AI_Laboratory` namespace（品牌页 `internlm`）。")
            lines.append("")

        lines.append("---")
        lines.append("")

    lines.append("## 跨厂商统计 (Cross-Vendor Stats)")
    lines.append("")
    # aggregate license distribution
    all_lic = {}
    for d in data.values():
        for m in d["models"]:
            l = (m.get("License") or "未标注").strip() or "未标注"
            all_lic[l] = all_lic.get(l, 0) + 1
    lines.append("### 许可证分布 (License Distribution)")
    lines.append("")
    lines.append("| 许可证 | 模型数 | 占比 |")
    lines.append("|--------|--------|------|")
    for l, c in sorted(all_lic.items(), key=lambda x: -x[1])[:12]:
        lines.append("| {} | {} | {:.1f}% |".format(l, c, 100.0 * c / total_models))
    lines.append("")
    # aggregate task distribution
    all_tasks = {}
    for d in data.values():
        for m in d["models"]:
            for t in (m.get("Tasks") or []):
                n = t.get("Name") if isinstance(t, dict) else None
                if n:
                    all_tasks[n] = all_tasks.get(n, 0) + 1
    lines.append("### 任务类型分布 (Task Distribution)")
    lines.append("")
    lines.append("| 任务 | 模型数 |")
    lines.append("|------|--------|")
    for n, c in sorted(all_tasks.items(), key=lambda x: -x[1])[:12]:
        lines.append("| {} | {} |".format(n, c))
    lines.append("")
    lines.append("## 数据说明 (Data Notes)")
    lines.append("")
    lines.append("- 本目录数据抓取自 ModelScope 官方 API（`PUT /api/v1/dolphin/models`），仅含各厂商**官方 namespace** 下发布的模型，已剔除社区量化/微调版本。")
    lines.append("- 下载量、收藏量为抓取时点 ({}) 的累计值，会随时间变化。".format(TODAY))
    lines.append("- 原始完整数据见 `_sources/modelscope/raw/`。")
    lines.append("- 抓取脚本可复跑：`python3 _sources/modelscope/raw/scraper.py`")
    lines.append("")
    lines.append("## 相关文档 (Related)")
    lines.append("")
    lines.append("- [[ModelScope_Model_Index]] — 全量 {:,} 个模型的完整索引表".format(total_models))
    lines.append("- [[README|中国大模型生态全景]] — 15 家厂商技术路线总览")
    lines.append("- [[Chinese_LLM_Comparison_Matrix]] — 全厂商技术/Benchmark 横向对比")
    lines.append("- [[Chinese_Open_Source_Top100]] — 中国开源大模型 Top 100")
    lines.append("")
    lines.append("*Data source: [ModelScope](https://modelscope.cn/) · Scraped: {} · Models: {:,}*".format(TODAY, total_models))
    return "\n".join(lines)


def gen_index(data):
    total_models = sum(len(d["models"]) for d in data.values())
    lines = []
    lines.append("---")
    lines.append('title: "ModelScope 全量模型索引 (ModelScope Model Index)"')
    lines.append("category: 04-nlp-llms-chinese-llm")
    lines.append('tags: ["modelscope", "chinese-llm", "model-hub", "index", "reference"]')
    lines.append('summary: "ModelScope 上 15 家中国大模型厂商全部 {:,} 个官方模型的完整索引表（按厂商分组、按下载量排序），含模型 ID、类型、任务、许可、下载量与链接。为可检索的全量参考资料。"'.format(total_models))
    lines.append("created: {}".format(TODAY))
    lines.append("updated: {}".format(TODAY))
    lines.append("source: https://modelscope.cn/")
    lines.append("---")
    lines.append("")
    lines.append("# ModelScope 全量模型索引 (ModelScope Model Index)")
    lines.append("")
    lines.append("> **一句话理解**: 本页是 ModelScope 魔搭社区上 15 家中国大模型厂商全部 **{:,} 个官方模型** 的完整索引——按厂商分组、按下载量排序，便于检索与选型。".format(total_models))
    lines.append("")
    lines.append("- 数据来源: [ModelScope 官方 API](https://modelscope.cn/) · 抓取时间: {}".format(TODAY))
    lines.append("- 统计口径: 仅官方 namespace 下模型，已剔除社区量化/微调版")
    lines.append("- 统计精选见 [[ModelScope_Model_Catalog]]")
    lines.append("")
    lines.append("---")
    lines.append("")

    for label, cn, en, url in DISPLAY:
        if label not in data:
            continue
        d = data[label]
        models = d["models"]
        if not models:
            continue
        lines.append("## {} ({})".format(cn, en))
        lines.append("")
        lines.append("Namespace: `{}` · 组织主页: [{}]({}) · 模型数: **{}**".format(
            d["namespace"], url, url, len(models)))
        lines.append("")
        lines.append("| # | 模型 ID | 类型 | 任务 | 许可 | 下载 | 收藏 | 大小 | 更新 | 链接 |")
        lines.append("|---|---------|------|------|------|------|------|------|------|------|")
        for i, m in enumerate(models, 1):
            mt = (m.get("ModelType") or ["—"])
            mt = mt[0] if mt else "—"
            lines.append("| {} | `{}` | {} | {} | {} | {:,} | {} | {} | {} | [↗]({}) |".format(
                i,
                m["id"],
                mt,
                task_name(m),
                (m.get("License") or "—"),
                m.get("Downloads") or 0,
                m.get("Stars") or 0,
                fmt_bytes(m.get("StorageSize")),
                fmt_date(m.get("LastUpdatedTime")),
                m["url"],
            ))
        lines.append("")
        lines.append("---")
        lines.append("")

    lines.append("## 统计汇总 (Summary)")
    lines.append("")
    lines.append("| 厂商 | 模型数 |")
    lines.append("|------|--------|")
    for label, cn, en, url in DISPLAY:
        if label not in data:
            continue
        lines.append("| {} | {} |".format(cn, len(data[label]["models"])))
    lines.append("| **合计** | **{:,}** |".format(total_models))
    lines.append("")
    lines.append("*Full data: `_sources/modelscope/raw/` · Scraped: {}*".format(TODAY))
    return "\n".join(lines)


def main():
    project_root = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(
        os.path.join(RAW_DIR, "..", "..", ".."))
    data = load_all()
    print("Loaded {} orgs, {} models total".format(
        len(data), sum(len(d["models"]) for d in data.values())))

    # source README
    src_dir = os.path.join(project_root, "_sources", "modelscope")
    with open(os.path.join(src_dir, "README.md"), "w", encoding="utf-8") as f:
        f.write(gen_source_readme(data, project_root))
    print("Wrote", os.path.join(src_dir, "README.md"))

    # catalog + index in Chinese_LLM_Ecosystem
    eco_dir = os.path.join(project_root, "04_NLP_LLMs", "Chinese_LLM_Ecosystem")
    cat_path = os.path.join(eco_dir, "ModelScope_Model_Catalog.md")
    with open(cat_path, "w", encoding="utf-8") as f:
        f.write(gen_catalog(data))
    print("Wrote", cat_path)

    idx_path = os.path.join(eco_dir, "ModelScope_Model_Index.md")
    with open(idx_path, "w", encoding="utf-8") as f:
        f.write(gen_index(data))
    print("Wrote", idx_path)


if __name__ == "__main__":
    main()
