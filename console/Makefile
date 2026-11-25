# Root Makefile — forwards to tools/cmd
# 内容库为本仓库主体；Go 工具在 tools/cmd 下自包含维护。

.PHONY: build run test test-short test-coverage clean install fmt vet lint lint-fix security quality release mod tree console dataset dataset-check pages pages-check portal portal-check shots issues issues-publish mcp-test npm-test help

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

# 可抓取的静态站点：节点页 / 叶子学习页（C6，需 .venv 的 markdown）/ 主题页 / sitemap / JSON-LD
VENV_PAGES := $(wildcard ../.venv/bin/python)
PAGES_PY := $(if $(VENV_PAGES),../.venv/bin/python,python3)
pages:
	$(PAGES_PY) tools/scripts/build_pages.py

# 贡献队列：核验台账 / 薄弱节点 / 低密度主题（产物 docs/good-first-issues.md）
issues:
	python3 tools/scripts/build_issues.py

# 把贡献队列发布成 GitHub Issue（默认 dry-run；实际创建加 ARGS="--yes"）
issues-publish:
	python3 tools/scripts/publish_issues.py $(ARGS)

# 静态站内部链接检查
pages-check:
	python3 tools/scripts/check_links.py

# P1 统一入口数据：跨面检索索引 + md 阅读分片（产物 ../design/统一入口/data/）
VENV_PY := $(wildcard ../.venv/bin/python)
PY := $(if $(VENV_PY),../.venv/bin/python,python3)

portal:
	$(PY) tools/scripts/build_portal.py

portal-check:
	$(PY) tools/scripts/build_portal.py --check

# C4 截图资产：面改版上线后重截四面首屏（生产地址直截，playwright+系统 Chrome，2880×1800@2x）
shots:
	node tools/scripts/capture_surfaces.mjs

# MCP server 冒烟测试（initialize / tools/list / tools/call）
mcp-test:
	python3 tools/mcp/test_client.py

# npm 包冒烟测试
npm-test:
	cd packages/ai-industry-graph && node test.mjs

# 所有 Go 相关 target 转发到 tools/cmd
build run test test-short test-coverage clean install fmt vet lint lint-fix security quality release mod help:
	@$(MAKE) -C tools/cmd $@
