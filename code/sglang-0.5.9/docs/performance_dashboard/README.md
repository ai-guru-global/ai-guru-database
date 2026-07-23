# SGLang Performance Dashboard

A web-based dashboard for visualizing SGLang nightly test performance metrics.

## Features

- **Performance Trends**: View throughput, latency, and TTFT trends over time
- **Model Comparison**: Compare performance across different models and configurations
- **Filtering**: Filter by GPU configuration, model, variant, and batch size
- **Interactive Charts**: Zoom, pan, and hover for detailed metrics
- **Run History**: View recent benchmark runs with links to GitHub Actions

## Quick Start

### Option 1: Run with Local Server (Recommended)

For live data from GitHub Actions artifacts:

```bash
# Install requirements
pip install requests

# Run the server
python server.py --fetch-on-start

# Visit http://localhost:8000
```

The server provides:
- Automatic fetching of metrics from GitHub
- Caching to reduce API calls
- `/api/metrics` endpoint for the frontend

### Option 2: Fetch Data Manually

Use the fetch script to download metrics data:

```bash
# Fetch last 30 days of metrics
python fetch_metrics.py --output metrics_data.json

# Fetch a specific run
python fetch_metrics.py --run-id 21338741812 --output single_run.json

# Fetch only scheduled (nightly) runs
python fetch_metrics.py --scheduled-only --days 7
```

## GitHub Token

To download artifacts from GitHub, you need authentication:

1. **Using `gh` CLI** (recommended):
   ```bash
   gh auth login
   ```

2. **Using environment variable**:
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

Without a token, the dashboard will show run metadata but not detailed benchmark results.

## Data Structure

The metrics JSON has this structure:

```json
{
  "run_id": "21338741812",
  "run_date": "2026-01-25T22:24:02.090218+00:00",
  "commit_sha": "5cdb391...",
  "branch": "main",
  "results": [
    {
      "gpu_config": "8-gpu-h200",
      "partition": 0,
      "model": "deepseek-ai/DeepSeek-V3.1",
      "variant": "TP8+MTP",
      "benchmarks": [
        {
          "batch_size": 1,
          "input_len": 4096,
          "output_len": 512,
          "latency_ms": 2400.72,
          "input_throughput": 21408.64,
          "output_throughput": 231.74,
          "overall_throughput": 1919.43,
          "ttft_ms": 191.32,
          "acc_length": 3.19
        }
      ]
    }
  ]
}
```

## Deployment

### GitHub Pages

The dashboard can be deployed to GitHub Pages for public access:

1. Copy the dashboard files to `docs/performance_dashboard/`
2. Enable GitHub Pages in repository settings
3. Set up a GitHub Action to periodically update metrics data

### Self-Hosted

For a self-hosted deployment with live data:

1. Set up a server running `server.py`
2. Configure a cron job or systemd timer to refresh data
3. Optionally put behind nginx/caddy for SSL

## Metrics Explained

- **Overall Throughput**: Total tokens (input + output) processed per second
- **Input Throughput**: Input tokens processed per second (prefill speed)
- **Output Throughput**: Output tokens generated per second (decode speed)
- **Latency**: End-to-end time to complete the request
- **TTFT**: Time to First Token - time until the first output token
- **Acc Length**: Acceptance length for speculative decoding (MTP variants)

## Contributing

To add support for new metrics or visualizations:

1. Update `fetch_metrics.py` if data collection needs changes
2. Modify `app.js` to add new chart types or filters
3. Update `index.html` for UI changes

## Troubleshooting

**No data displayed**
- Check browser console for errors
- Verify GitHub API is accessible
- Try running with `server.py --fetch-on-start`

**API rate limits**
- Use a GitHub token for higher limits
- The server caches data for 5 minutes

**Charts not rendering**
- Ensure Chart.js is loading from CDN
- Check for JavaScript errors in console

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
