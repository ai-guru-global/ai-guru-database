---
title: "Streamlit 概览"
category: "10-deployment-inference"
tags: ["tool", "streamlit", "web-app", "data-app", "visualization"]
summary: "Streamlit 是用 Python 快速构建数据应用和 ML Demo 的开源框架,无需前端经验,几分钟即可将脚本变为可分享的 Web 应用。"
sources:
  - "https://streamlit.io/"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "Streamlit Overview"
  - "streamlit overview"
  - streamlit_overview

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Streamlit 概览

> **一句话理解**: 用 Python 快速构建数据应用,无需前端经验,几分钟即可将脚本变为可分享的 Web 应用。

## 核心特性

- **纯 Python**: 不需要 HTML/CSS/JavaScript
- **实时更新**: 保存代码后自动刷新
- **丰富组件**: 图表、表格、地图、文件上传等
- **一键部署**: Streamlit Community Cloud 免费托管
- **企业级**: Snowflake 集成,企业级安全和可靠性

## 快速开始

```bash
pip install streamlit
streamlit hello
```

```python
import streamlit as st
import pandas as pd

st.title("我的第一个应用")
df = pd.read_csv("data.csv")
st.line_chart(df)
```

## 典型使用场景

| 场景 | 说明 |
|------|------|
| ML Demo | 展示模型效果的交互式界面 |
| 数据仪表盘 | 实时数据可视化看板 |
| 数据探索 | 数据集的交互式浏览和分析 |
| AI 聊天 | 构建 ChatGPT 风格的对话应用 |

## 与其他方案对比

| 维度 | Streamlit | Gradio | Dash |
|------|-----------|--------|------|
| 学习曲线 | 极低 | 低 | 中 |
| 前端代码 | 不需要 | 不需要 | 需要 |
| 交互性 | 好 | 中 | 好 |
| 自定义 | 中 | 低 | 高 |

## 90% 的财富 50 强企业使用

- Google X: 生成可分享的代码工件
- Stitch Fix: 分享 ML 模型和分析
- Uber: 数据应用民主化

> **关联**: -> [[10_Deployment_Inference/README|部署推理]] | [[15_Agent_Production/Gradio_Deep_Dive|Gradio]]

## Related

- [[10_Deployment_Inference/README|模型部署与推理]]
