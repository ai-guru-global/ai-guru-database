# Root Makefile — forwards to tools/cmd
# 内容库为本仓库主体；Go 工具在 tools/cmd 下自包含维护。

.PHONY: build run test test-short test-coverage clean install fmt vet lint lint-fix security quality release mod tree console dataset dataset-check pages pages-check issues issues-publish mcp-test npm-test help

# 行业分层目录树：01..05 五层目录 + 节点学习页 + 叶子（_index 重新生成；叶子已存在跳过）
tree:
	python3 tools/scripts/build_tree.py

# 私人工作台：构建内嵌数据，产物 console/data.js；双击 console/index.html 即用（file://）
console:
	python3 tools/scripts/build_console.py

# 机器可读数据集：产物 data/*.json + schema/*.json（与 console/data.js 同源）
dataset:
	python3 tools/scripts/build_dataset.py
	python3 tools/scripts/validate_dataset.py

# 只校验不写盘：CI 用
dataset-check:
	python3 tools/scripts/build_dataset.py --check
	python3 tools/scripts/validate_dataset.py

# 可抓取的静态站点：节点页 / 主题页 / sitemap / JSON-LD（产物 site/，Pages 用）
pages:
	python3 tools/scripts/build_pages.py

# 贡献队列：核验台账 / 薄弱节点 / 低密度主题（产物 docs/good-first-issues.md）
issues:
	python3 tools/scripts/build_issues.py

# 把贡献队列发布成 GitHub Issue（默认 dry-run；实际创建加 ARGS="--yes"）
issues-publish:
	python3 tools/scripts/publish_issues.py $(ARGS)

# 静态站内部链接检查
pages-check:
	python3 tools/scripts/check_links.py

# MCP server 冒烟测试（initialize / tools/list / tools/call）
mcp-test:
	python3 tools/mcp/test_client.py

# npm 包冒烟测试
npm-test:
	cd packages/ai-industry-graph && node test.mjs

# 所有 Go 相关 target 转发到 tools/cmd
build run test test-short test-coverage clean install fmt vet lint lint-fix security quality release mod help:
	@$(MAKE) -C tools/cmd $@
