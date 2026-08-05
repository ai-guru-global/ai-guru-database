---
title: 质量度量 (Quality Metrics)
category: 07-governance
tags: ["quality-metrics", "coverage", "consistency", "freshness", "audit"]
summary: "知识库质量度量体系：覆盖率、一致性、时效性、交叉引用密度、内容深度指标定义与自动化审计方法。"
created: 2026-07-21
updated: 2026-07-23
tier: supporting
sources: []

name_zh: "质量度量"
---
# 质量度量 (Quality Metrics)

> 中文简称：质量度量

## 1. 质量维度

```
知识库质量 = 覆盖率 × 一致性 × 时效性 × 深度 × 连通性

1. 覆盖率 (Coverage): 知识领域的完整程度
2. 一致性 (Consistency): 格式/术语/结构的统一
3. 时效性 (Freshness): 内容是否反映最新进展
4. 深度 (Depth): 每个主题的详细程度
5. 连通性 (Connectivity): 交叉引用的密度
```

## 2. 指标定义

```python
QUALITY_METRICS = {
    "覆盖率": {
        "定义": "已有文件数 / 应有文件数",
        "计算": "每个二级目录的文件数 vs 计划文件数",
        "目标": "≥ 90%",
        "检查": "每个目录至少有 索引.md + 1个主文件",
    },
    "一致性": {
        "定义": "符合格式规范的文件比例",
        "检查项": [
            "YAML frontmatter 完整 (title/category/tags/summary/created/updated)",
            "文件命名规范 (无空格/正确后缀)",
            "标题层次正确 (h1 → h2 → h3)",
        ],
        "目标": "≥ 95%",
    },
    "时效性": {
        "定义": "updated 日期在 6 个月内的文件比例",
        "计算": "updated >= 2026-01-21 的文件 / 总文件",
        "目标": "≥ 70%",
        "告警": "超过 12 个月未更新标记为 stale",
    },
    "深度": {
        "定义": "文件内容行数",
        "标准": {
            "普通文件": "≥ 100 行",
            "Deep Dive": "≥ 400 行",
            "for_dummy": "≥ 80 行 (含 Mermaid)",
        },
        "目标": "平均 ≥ 150 行",
    },
    "连通性": {
        "定义": "平均每个文件的 wikilink 数量",
        "计算": "总 wikilink 数 / 总文件数",
        "目标": "≥ 3 links/file",
        "检查": "无孤立文件 (至少被 1 个文件引用)",
    },
}
```

## 3. 自动化审计

```python
# 审计脚本伪代码:
def audit_knowledge_base(root_dir):
    """知识库质量审计"""
    results = {
        "total_files": 0,
        "missing_frontmatter": [],
        "stale_files": [],  # > 12 月未更新
        "short_files": [],  # < 100 行
        "orphan_files": [],  # 无入链
        "broken_links": [],  # 断链
    }
    
    for file in glob(f"{root_dir}/**/*.md"):
        results["total_files"] += 1
        
        # 检查 frontmatter
        if not has_valid_frontmatter(file):
            results["missing_frontmatter"].append(file)
        
        # 检查时效性
        if get_updated_date(file) < six_months_ago:
            results["stale_files"].append(file)
        
        # 检查深度
        if count_lines(file) < 100:
            results["short_files"].append(file)
    
    # 检查连通性
    all_links = extract_all_wikilinks(root_dir)
    for file in all_files:
        if file not in all_links.targets:
            results["orphan_files"].append(file)
    
    # 检查断链
    for link in all_links:
        if not os.path.exists(resolve_link(link)):
            results["broken_links"].append(link)
    
    return results
```

## 4. 交叉引用

- [[治理/|治理]]
- [[治理/Content_Governance|内容治理]]
- [[00_入门/|入门 (知识库使用)]]

## 5. 深度评分卡（Depth Scorecard）

文件深度不应只看行数。本评分卡融合行数、词数、wikilink 密度、表格/公式密度等多维信号，给出 0-100 的深度分。

### 评分维度与权重

| 维度 | 信号 | 计算 | 权重 | 说明 |
|------|------|------|------|------|
| 体量 | 行数 | `wc -l` | 20% | 反映内容规模 |
| 信息量 | 词数 | 中文按字、英文按词 | 20% | 反映信息密度 |
| 连通性 | wikilink 数 | `grep -c '\[\['` | 20% | 交叉引用密度 |
| 结构化 | 表格行数 | `grep -c '^\|'` | 15% | 结构化表达 |
| 严谨性 | 公式/代码块 | ``` 与 `$` 计数 | 15% | 技术深度 |
| 元数据 | frontmatter 完整度 | 七字段命中数 | 10% | 规范性 |

### 深度分层标准

| 深度分 | 等级 | 含义 | 文件类型门槛 |
|--------|------|------|--------------|
| 85-100 | S | 卓越 | Deep Dive 目标 |
| 70-84 | A | 优秀 | 核心主文件目标 |
| 55-69 | B | 合格 | 普通文件门槛 |
| 40-54 | C | 待提升 | 需补充 |
| < 40 | D | 不达标 | 标记整改 |

### 评分伪代码

```python
def depth_score(file_path, file_type):
    lines = count_lines(file_path)            # 行数
    words = count_words(file_path)            # 词数/字数
    wikilinks = count_wikilinks(file_path)    # [[ ]] 数
    table_rows = count_table_rows(file_path)  # | 开头行
    blocks = count_code_math(file_path)       ``` 与 $ 计数
    fm = frontmatter_completeness(file_path)  # 0-7

    # 归一化到 0-100（按文件类型用不同分位基线）
    base = QUANTILE_BASE[file_type]  # for_dummy / main / deep_dive
    s = (0.20*norm(lines, base.lines)
       + 0.20*norm(words, base.words)
       + 0.20*norm(wikilinks, base.links)
       + 0.15*norm(table_rows, base.tables)
       + 0.15*norm(blocks, base.blocks)
       + 0.10*(fm/7))
    return round(min(100, s*100))
```

### 文件类型基线（参考分位）

| 文件类型 | 行数基线 | 词数基线 | wikilink 基线 | 表格基线 | 代码/公式基线 |
|----------|----------|----------|---------------|----------|---------------|
| for_dummy | 80 | 1500 | 3 | 5 | 2 |
| 主文件 (main) | 150 | 3000 | 5 | 8 | 5 |
| Deep Dive | 450 | 9000 | 7 | 15 | 15 |

---

## 6. 覆盖率仪表板（Coverage Dashboard）

覆盖率按目录与知识域双维度度量，仪表板按周刷新。

### 目录覆盖率（示例快照）

| 章节 | 应有文件 | 已有文件 | 覆盖率 | 平均深度分 | 状态 |
|------|----------|----------|--------|------------|------|
| 深度学习 | 25 | 22 | 88% | 72 | 🟢 |
| 强化学习 | 18 | 15 | 83% | 74 | 🟢 |
| 可视化 | 15 | 9 | 60% | 48 | 🟡 |
| 治理 | 12 | 12 | 100% | 65 | 🟢 |
| 大模型 | 30 | 28 | 93% | 70 | 🟢 |
| 机器学习 | 22 | 19 | 86% | 68 | 🟢 |

> 状态阈值：🟢 ≥ 85% / 🟡 60-84% / 🔴 < 60%

### 知识域覆盖率

| 知识域 | 计划主题 | 已覆盖 | 覆盖率 | 缺口主题示例 |
|--------|----------|--------|--------|--------------|
| 基础理论 | 40 | 36 | 90% | 因果推断、贝叶斯深度 |
| 技术实践 | 50 | 44 | 88% | 模型合并、测试时计算 |
| 工程方法 | 30 | 24 | 80% | 容量规划、混沌工程 |
| 前沿趋势 | 25 | 18 | 72% | 世界模型、VLA |
| 行业应用 | 35 | 26 | 74% | 工业质检、自动驾驶 |

### 五维质量雷达（知识库整体）

| 维度 | 当前 | 目标 | 趋势 |
|------|------|------|------|
| 覆盖率 (Coverage) | 83% | 90% | ↑ |
| 一致性 (Consistency) | 91% | 95% | ↑ |
| 时效性 (Freshness) | 68% | 70% | → |
| 深度 (Depth) | 67 | 75 | ↑ |
| 连通性 (Connectivity) | 3.1 links/file | 4.0 | ↑ |

---

## 7. 趋势分析（Trend Analysis）

跟踪关键指标随时间的变化，识别退化和进步。

### 月度趋势指标

| 月份 | 文件数 | 平均行数 | wikilink/file | 断链数 | 孤立文件数 | 平均深度分 |
|------|--------|----------|---------------|--------|------------|------------|
| 2026-03 | 580 | 132 | 2.4 | 38 | 42 | 58 |
| 2026-04 | 612 | 138 | 2.7 | 31 | 35 | 61 |
| 2026-05 | 645 | 141 | 2.9 | 26 | 28 | 63 |
| 2026-06 | 668 | 146 | 3.0 | 22 | 24 | 65 |
| 2026-07 | 690 | 151 | 3.1 | 18 | 19 | 67 |

### 关键趋势解读

1. **连通性持续上升**：wikilink/file 从 2.4 升至 3.1，得益于交叉引用专项。
2. **断链与孤立双降**：自动化检查 + 补 stub，断链从 38 降至 18。
3. **时效性滞后**：更新日期集中在新增文件，旧文件 stale 比例仍偏高，是下一周期重点。
4. **深度稳步提升**：平均深度分 +9，Deep Dive 扩写贡献最大。

### 预警规则

| 指标 | 触发条件 | 响应动作 |
|------|----------|----------|
| 断链数 | 周增量 > 10 | 排查批量重构 PR |
| 孤立文件 | 单章节 > 5 | 在该章节 index 补引用 |
| 时效性 | 月降 > 3% | 启动该章节 freshness 刷新 |
| 平均深度分 | 周降 > 2 | 排查低质量批量合入 |

---

## 8. 质量分层标准（Quality Tiering）

按文件类型与质量分，把文件归入分层，指导维护优先级。

### 分层定义

| 分层 | 标准 | 维护优先级 | 刷新频率 | 示例 |
|------|------|------------|----------|------|
| T1 核心 (Core) | 深度分 ≥ 70 + 入链 ≥ 5 | P0 | 季度 | Deep Dive、核心主文件 |
| T2 支撑 (Supporting) | 深度分 55-69 | P1 | 半年 | 普通主文件、速查表 |
| T3 参考 (Reference) | 深度分 40-54 | P2 | 按需 | 索引、辅助说明 |
| T4 待整改 (Backlog) | 深度分 < 40 或 D 级 | P0（整改） | 立即 | stub、占位符文件 |

### 分层与治理动作映射

| 分层 | 时效要求 | 连通要求 | 不达标处理 |
|------|----------|----------|------------|
| T1 | updated ≤ 6 月 | 入链 ≥ 5 | 降级 T2 + 排入整改 |
| T2 | updated ≤ 9 月 | 入链 ≥ 3 | 降级 T3 |
| T3 | updated ≤ 12 月 | 入链 ≥ 1 | 标记 stale |
| T4 | — | — | 列入 [[治理/KNOWN_ISSUES|已知问题]] 整改 |

### 分层审计输出

每季度质量度量回顾产出分层清单，作为 [[治理/_content-supplement-plan-2026-07-01|内容补充计划]] 与 [[治理/ROADMAP|项目路线图]] 的输入，优先把 T4 提升到 T3、把 T2 提升到 T1。

---

*Last updated: 2026-07-23*
