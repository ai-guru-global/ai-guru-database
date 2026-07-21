---
title: 质量度量 (Quality Metrics)
category: 07-governance
tags: ["quality-metrics", "coverage", "consistency", "freshness", "audit"]
summary: "知识库质量度量体系：覆盖率、一致性、时效性、交叉引用密度、内容深度指标定义与自动化审计方法。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 质量度量 (Quality Metrics)

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
        "检查": "每个目录至少有 index.md + 1个主文件",
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
- [[治理/content-governance/|内容治理]]
- [[入门/|入门 (知识库使用)]]
