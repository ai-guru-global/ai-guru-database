---
title: "AgentScope 语料加载与挂载指南"
tags: [cloud-ops, agentScope, corpus, nas, deployment]
summary: "> AgentScope Agent 如何加载本语料库作为工单诊断知识库。"
created: 2026-07-01
tier: core
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# AgentScope 语料加载与挂载指南

## 1. NAS 挂载

```bash
# 假设 NAS 挂载点
NAS_PATH=/mnt/nas/agent-corpus

# 导出语料到 NAS
cd /path/to/ai-guru-database
python3 _tools/export_corpus.py --output $NAS_PATH --clean
```

## 2. AgentScope 加载示例

```python
import json
import os
from pathlib import Path

class WorkOrderCorpus:
    """工单智能体语料加载器（LLM-Wiki 模式）"""

    def __init__(self, corpus_path: str):
        self.base = Path(corpus_path)
        self.manifest = json.loads(
            (self.base / "corpus_manifest.json").read_text()
        )
        # 构建页面索引
        self.pages = {p["path"]: p for p in self.manifest["pages"]}

    def get_entry(self) -> str:
        """获取诊断入口页面内容"""
        entry_path = self.manifest["categories"]["diagnosis_hub"]
        return self.read_page(entry_path)

    def route(self, ticket_category: str) -> str:
        """按工单类型路由到对应决策树"""
        category_map = {
            "pod": "pod_failure",
            "network": "network_failure",
            "storage": "storage_failure",
            "gpu": "gpu_failure",
        }
        key = category_map.get(ticket_category, "diagnosis_hub")
        page_path = self.manifest["categories"][key]
        return self.read_page(page_path)

    def read_page(self, path: str) -> str:
        """读取单个页面"""
        fp = self.base / path
        if fp.exists():
            return fp.read_text()
        return ""

    def get_core_pages(self) -> list:
        """获取所有 tier:core 页面路径"""
        return [p["path"] for p in self.manifest["pages"] if p["tier"] == "core"]

    def follow_wikilinks(self, content: str, max_pages: int = 5) -> list:
        """从内容中提取 wikilink 并读取关联页面"""
        import re
        links = re.findall(r'\[\[([^\]]+)\]\]', content)
        results = []
        for link in links[:max_pages]:
            target = link.split("|")[0].split("#")[0].strip()
            # 尝试按 basename 匹配
            for path in self.pages:
                if path.endswith(target + ".md") or path.endswith(target):
                    page_content = self.read_page(path)
                    if page_content:
                        results.append({"path": path, "content": page_content})
                    break
        return results


# ── 使用示例 ──

corpus = WorkOrderCorpus("/mnt/nas/agent-corpus")

# 1. 获取诊断入口
entry = corpus.get_entry()

# 2. 按工单类型路由
pod_diagnosis = corpus.route("pod")

# 3. 沿 wikilink 展开关联知识
related = corpus.follow_wikilinks(pod_diagnosis, max_pages=5)

# 4. 组装上下文给 LLM
context = entry + "\n\n" + pod_diagnosis
for r in related:
    context += f"\n\n--- {r['path']} ---\n{r['content'][:2000]}"
```

## 3. 目录结构

```
/mnt/nas/agent-corpus/
├── corpus_manifest.json           ← AgentScope 加载入口
├── README.md
├── _synthesis/diagnosis-work-order-hub.md  ← 智能体诊断入口
├── _synthesis/diagnosis-k8s-pod-failure.md
├── _synthesis/diagnosis-k8s-network-failure.md
├── _synthesis/diagnosis-k8s-storage-failure.md
├── _synthesis/diagnosis-gpu-ai-workload-failure.md
├── _concepts/                      ← 84 个 K8s/GPU/云概念页
├── 12_Architecture_Infrastructure/ ← K8s 深度页 + 专有云上下文
├── 13_AI_Ops/                      ← 排障 Playbook + Runbook
├── 07_Model_Training/              ← 训练故障 Runbook
├── 10_Deployment_Inference/        ← 推理部署 Runbook
├── 11_MLOps_Pipeline/              ← MLOps 排障
└── _projects/Cloud_Ops_Agent/      ← 云运维 Agent 项目文档
```

## 4. 更新语料

当 wiki 内容更新后，重新导出：

```bash
python3 _tools/export_corpus.py --output /mnt/nas/agent-corpus --clean
```

## Related

- [[diagnosis-work-order-hub]] — 工单诊断总入口
- [[Cloud_Product_Ops_2026]] — 云产品运维 Agent 体系
