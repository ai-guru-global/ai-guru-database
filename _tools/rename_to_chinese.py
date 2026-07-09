#!/usr/bin/env python3
"""根目录中文化脚本：将 22 个主章节目录从英文编号改为中文短名。

执行：git mv 目录 + 全量重写 wikilink/内链/反引号中的目录路径。
保留：90-94 拓展目录、_concepts/_synthesis/_references 知识图谱层不动。
"""
import os
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# === 旧英文名 → 新中文名 ===
RENAME_MAP = {
    "00_AI_Introduction":          "AI入门",
    "01_Fundamentals":             "数学基础",
    "02_Machine_Learning":         "机器学习",
    "03_Deep_Learning":            "深度学习",
    "04_Computer_Vision":          "计算机视觉",
    "05_NLP_LLMs":                 "大模型",
    "06_Reinforcement_Learning":   "强化学习",
    "07_Model_Training":           "模型训练",
    "08_Model_Evaluation":         "模型评估",
    "09_Testing":                  "AI测试",
    "10_Deployment_Inference":     "部署推理",
    "11_MLOps_Pipeline":           "MLOps",
    "12_Architecture_Infrastructure": "架构基建",
    "13_AI_Ops":                   "AI运维",
    "14_RAG_Systems":              "RAG系统",
    "15_Agent_Production":         "Agent",
    "16_AI_Coding":                "AI编程",
    "17_Ethics_Safety":            "伦理安全",
    "18_AI_Applications_Industry": "行业应用",
    "19_Talks":                    "业界观点",
    "20_Papers_and_Research":      "论文精读",
    "21_Interviews":               "面试岗位",
}


def _git(args, cwd=REPO_ROOT):
    result = subprocess.run(["git"] + args, cwd=str(cwd),
                            capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} 失败:\n{result.stderr}")
    return result.stdout.strip()


def rename_dirs(commit=True):
    """git mv 顶层目录，英文→中文。"""
    moved = 0
    for old, new in sorted(RENAME_MAP.items(), key=lambda kv: len(kv[0]), reverse=True):
        old_abs = REPO_ROOT / old
        new_abs = REPO_ROOT / new
        if not old_abs.exists():
            print(f"  跳过(不存在): {old}")
            continue
        if new_abs.exists():
            print(f"  ⚠️ 目标已存在: {new}，跳过")
            continue
        _git(["mv", old, new])
        moved += 1
        print(f"  {old} → {new}")
    if commit and moved:
        _git(["add", "-A"])
        _git(["commit", "-m", f"refactor(i18n): 根目录中文化（{moved} 个章节英文→中文）"])
    print(f"✓ 重命名 {moved} 个目录")


def rewrite_links():
    """全量重写 wikilink/内链/反引号中的目录路径前缀。

    将所有 "旧英文名" 出现处替换为 "新中文名"，仅作用于路径上下文
   （wikilink、md 链接、反引号、裸斜杠路径），不改正文叙述性提及。
    """
    rules = sorted(RENAME_MAP.items(), key=lambda kv: len(kv[0]), reverse=True)
    changed = 0

    EXCLUDE = {'.git', 'Web', 'node_modules', '.venv', '.qoder', '.obsidian',
               '.github', '__pycache__', '_raw', '_sources', '_projects', 'superpowers'}

    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in EXCLUDE and not d.startswith('.')]
        root_path = Path(root)
        for fn in files:
            if not fn.endswith('.md'):
                continue
            fp = root_path / fn
            text = fp.read_text(encoding="utf-8", errors="ignore")
            original = text

            for old, new in rules:
                # 边界：左侧不能是字母数字下划线（避免匹配子串如 100_AI_）
                # 右侧不能是字母数字下划线
                # 但允许后跟 / (路径分隔) 或 .md 或 ] 或 ) 或 `
                pattern = re.compile(
                    r"(?<![A-Za-z0-9_])" + re.escape(old) + r"(?![A-Za-z0-9_])"
                )

                def _repl(m, _p=pattern, _n=new):
                    return _p.sub(_n, m.group(0))

                # [[wiki links]]
                text = re.sub(r"\[\[[^\]]+\]\]", _repl, text)
                # [text](link) 整体
                text = re.sub(r"\[[^\]]*\]\([^)]+\)", _repl, text)
                # `inline code`
                text = re.sub(r"`[^`\n]+`", _repl, text)
                # frontmatter sources 字段
                text = re.sub(r"sources:\s*\[[^\]]+\]", _repl, text)
                # frontmatter parent 字段
                text = re.sub(r'parent:\s*"[^"]*"', _repl, text)
                # 裸斜杠路径 old + /
                slash_pat = re.compile(
                    r"(?<![A-Za-z0-9_])" + re.escape(old) + r"/"
                )
                text = slash_pat.sub(new + "/", text)

            if text != original:
                fp.write_text(text, encoding="utf-8")
                changed += 1
    print(f"rewrite 完成：{changed} 文件被修改")
    return changed


def main():
    print("=== 根目录中文化迁移 ===")
    print(f"映射：{len(RENAME_MAP)} 个目录\n")

    if len(sys.argv) > 1 and sys.argv[1] == "--dry-run":
        print("dry-run 模式（仅展示，不执行）：")
        for old, new in RENAME_MAP.items():
            exists = "✓" if (REPO_ROOT / old).exists() else "✗"
            print(f"  {exists} {old} → {new}")
        return

    print("Step 1: git mv 目录...")
    rename_dirs()

    print("\nStep 2: 重写 wikilink/内链...")
    rewrite_links()

    _git(["add", "-A"])
    _git(["commit", "-m", "refactor(i18n): 全量重写 wikilink/内链为中文目录名"])
    print("\n✓ 全部完成")


if __name__ == "__main__":
    main()
