#!/usr/bin/env python3
"""为顶层主章节 + 主题型二级目录添加数字前缀（2026-06）。

背景：仓库先前经 rename_to_chinese.py 去掉了英文编号前缀、改为中文短名。
本脚本按分层架构（_directory-conventions.md）为 22 个主章节重新加回
两位数字前缀（00-21），并给辅助章节分配 90/94；同时为每个主章节下的
「主题型」二级目录加两位数字前缀（01,02,...），按逻辑层次排序。

不编号：
  - 人名型（业界观点/）、岗位型（面试岗位/）的二级目录
  - assets / tests / Cloud_Ops_Agent 等非内容/项目目录
  - 根文件（README/LICENSE/index.md 等）
  - 支撑目录（概念/治理/来源/原始/归档/工具/前端应用/code/docs/release）

子命令：
  add_number_prefix_2026.py dry-run       # 预检，输出计划表，不写任何东西
  add_number_prefix_2026.py rename         # git mv 加前缀（顶层→二级），分阶段 commit
  add_number_prefix_2026.py rewrite-links  # CJK 安全地重写 wikilink/内链/路径
  add_number_prefix_2026.py verify         # 校验断链数不恶化

关键设计（相较 restructure_2026.py 的改进）：
  中文目录名同时是常用词，且是彼此的子串（学习⊂深度学习）。因此：
    1. 左边界排除前置 CJK 字符：(?<![A-Za-z0-9_\\u4e00-\\u9fff])
    2. 仅重写「以 / 结尾的路径段」，不做宽松的链接文本替换
       （否则会把作为链接文本/正文的中文词误加前缀）。
"""
import argparse
import csv
import os
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# === 单一事实源 ===

# 顶层：中文名 → 数字前缀（分层架构，见 _directory-conventions.md）
TOP_LEVEL_ORDER = {
    "入门":         "00",
    "数学基础":     "01",
    "机器学习":     "02",
    "深度学习":     "03",
    "计算机视觉":   "04",
    "大模型":       "05",
    "强化学习":     "06",
    "模型训练":     "07",
    "模型评估":     "08",
    "测试":         "09",
    "部署推理":     "10",
    "模型运维":     "11",
    "架构基建":     "12",
    "运维":         "13",
    "RAG系统":      "14",
    "智能体":       "15",
    "编程":         "16",
    "伦理安全":     "17",
    "行业应用":     "18",
    "业界观点":     "19",
    "论文精读":     "20",
    "面试岗位":     "21",
    # 辅助章节
    "学习":         "90",
    "可视化":       "94",
}

# 二级：主章节中文名 → 主题型子目录有序列表（列表顺序即 01,02,...）
# 未列出的章节（业界观点/面试岗位）不编号二级；未列出的子目录（assets/tests/
# Cloud_Ops_Agent）保持原名。
NESTED_ORDER = {
    "入门": [
        "Fundamentals", "Technology_Overview", "Learning_Path", "Ethics_and_Future",
    ],
    "数学基础": [
        "Math_Fundamentals", "Linear_Algebra", "Probability_Statistics",
        "Information_Theory", "Numerical_Methods", "Game_Theory",
        "Data_Structures_Algorithms", "Python_Toolkit", "Distributed_Systems",
        "AI_Hardware", "Java_Ecosystem_AI",
    ],
    "机器学习": [
        "ML_Fundamentals", "Supervised_Learning", "Unsupervised_Learning",
        "Ensemble_Learning", "Feature_Engineering", "Bayesian_Methods",
        "Causal_Inference", "Anomaly_Detection", "Time_Series",
        "Recommendation_Systems", "AutoML", "ML_Frameworks",
    ],
    "深度学习": [
        "DL_Fundamentals", "Neural_Network_Core", "Optimization",
        "Generative_Models", "Graph_Neural_Networks", "Self_Supervised_Learning",
        "World_Models", "DL_Frameworks",
    ],
    "计算机视觉": [
        "CV_Fundamentals", "Image_Classification_Detection", "Segmentation",
        "OCR_Text_Recognition", "3D_Vision", "Generative_Models",
        "Video_Generation", "Multimodal_Vision",
    ],
    "大模型": [
        "LLM_Fundamentals", "Sequence_Models", "Transformer",
        "Transformer_Revolution", "LLM_Architectures", "LLM_Data_Engineering",
        "Fine_tuning_Techniques", "Prompt_Engineering", "Reasoning_Models",
        "Multimodal_Models", "Speech_Audio_AI", "Edge_LLM", "LLM_Products",
        "Global_LLM_Ecosystem", "Chinese_LLM_Ecosystem",
    ],
    "强化学习": [
        "RL_Foundations", "Deep_RL", "RLHF_Alignment", "RL_Applications",
        "Robotics_Embodied_AI",
    ],
    "模型训练": [
        "Training_Fundamentals", "Data", "Optimization", "Distributed_Training",
        "Compression", "Alignment", "Monitoring",
    ],
    "模型评估": [
        "Evaluation_Fundamentals", "Benchmarks", "LLM_Evaluation",
        "Evaluation_Tools", "Automation",
    ],
    "测试": [
        "Testing_Fundamentals", "Testing_Frameworks",
    ],
    "部署推理": [
        "Deployment_Fundamentals", "Inference_Engines", "Inference_Optimization",
        "Inference_Performance", "Quantization", "Caching", "GPU_Infrastructure",
        "Hardware",
    ],
    "模型运维": [
        "MLOps_Fundamentals", "Data_Engineering", "Feature_Store",
        "Experiment_Tracking", "Orchestration", "CI_CD", "Model_Serving",
        "Observability", "Cost", "LLMOps", "Prompt_Ops", "Troubleshooting",
    ],
    "架构基建": [
        "Architecture_Fundamentals", "Architecture_Overview", "AI_Stack",
        "Kubernetes_Core", "CNCF_Cloud_Native_AI", "Cloud_Providers",
        "Hardware_Compute", "Networking", "Storage", "Security", "AI_Gateway",
    ],
    "运维": [
        "AIOps_Fundamentals", "SRE_Reliability", "Incident_Response",
        "Troubleshooting", "Cost_Management",
    ],
    "RAG系统": [
        "RAG_Fundamentals", "Embeddings", "Vector_Databases", "Advanced_RAG",
        "RAG_Production", "RAG_Frameworks",
    ],
    "智能体": [
        "Agent_Foundations", "Agent_Frameworks", "Agent_Workflow", "Agent_Harness",
        "Agent_Skills", "Memory_Infrastructure", "Agent_Evaluation",
        "Agentic_Coding_Tools", "Agent_Platforms", "Enterprise_Agent",
        "OpenClaw_Ecosystem", "Agent_Ecosystem_CN", "Hello_Agents",
        "GenAI_Courses", "Course_Notes",
    ],
    "编程": [
        "Coding_Fundamentals", "Theory", "Methodology", "Practice", "Tools",
        "Tool_Comparison", "OpenCode", "OpenRouter", "Security",
    ],
    "伦理安全": [
        "Ethics_Fundamentals", "Value_Alignment", "Governance",
        "AI_Safety_RedTeaming", "Mechanistic_Interpretability", "Security",
        "AI_Security_2026", "AI_Supply_Chain_Security", "Deepfake_Security",
        "Privacy_Preserving_AI", "Federated_Learning",
    ],
    "行业应用": [
        "Industry_Overview", "AI_for_Science", "Healthcare", "Finance",
        "Education",
    ],
    "论文精读": [
        "Research_Guide", "Architecture", "Scaling", "Efficiency",
        "LLM_Inference_Research", "Alignment", "RL", "Vision",
    ],
    # 业界观点（人名）、面试岗位（岗位）—— 不编号二级
}

# 遍历/重写排除：归档、快照、原始来源、构建产物、前端、隐藏目录
_EXCLUDE_DIRS = {
    '.git', 'node_modules', '.venv', '.qoder', '.obsidian', '.github',
    '__pycache__', 'release', '归档', '原始', '来源', 'code', 'docs', '前端应用',
    'Web', '_raw', '_sources', 'superpowers',
}

# CJK 安全左边界：前置不能是字母/数字/下划线/中日韩统一表意文字
_LEFT_BOUND = r"(?<![A-Za-z0-9_\u4e00-\u9fff])"


# === 构造重命名 / 重写规则 ===

def build_rename_ops():
    """返回 [(old_rel_path, new_rel_path), ...]，顶层在前，二级在后。

    二级路径用「新的顶层前缀」构造实际旧路径（因顶层先 git mv）。
    """
    ops = []
    # 顶层
    for name, num in TOP_LEVEL_ORDER.items():
        ops.append((name, f"{num}_{name}"))
    # 二级（父目录此时已是 num_name）
    for parent, subs in NESTED_ORDER.items():
        num = TOP_LEVEL_ORDER[parent]
        new_parent = f"{num}_{parent}"
        for i, sub in enumerate(subs, start=1):
            ops.append((f"{new_parent}/{sub}", f"{new_parent}/{i:02d}_{sub}"))
    return ops


def build_rewrite_rules():
    """返回 [(old_path, new_path), ...]，按 old 长度降序（最长优先）。

    路径均为「基于仓库根的逻辑路径段」，重写时匹配 old + '/' 形式。
    二级规则的 old 使用「原始中文父名」（因为文档里的链接是旧路径），
    如 大模型/LLM_Fundamentals → 05_大模型/01_LLM_Fundamentals。
    """
    rules = []
    # 顶层：大模型 → 05_大模型
    for name, num in TOP_LEVEL_ORDER.items():
        rules.append((name, f"{num}_{name}"))
    # 二级：大模型/LLM_Fundamentals → 05_大模型/01_LLM_Fundamentals
    for parent, subs in NESTED_ORDER.items():
        num = TOP_LEVEL_ORDER[parent]
        for i, sub in enumerate(subs, start=1):
            rules.append((f"{parent}/{sub}", f"{num}_{parent}/{i:02d}_{sub}"))
    # 最长优先：保证二级（含父名，更长）先于顶层替换
    rules.sort(key=lambda kv: len(kv[0]), reverse=True)
    return rules


# === git 封装 ===

def _git(args, cwd=REPO_ROOT):
    r = subprocess.run(["git"] + args, cwd=str(cwd),
                       capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} 失败:\n{r.stderr}")
    return r.stdout.strip()


# === Phase A: dry-run ===

def _count_refs(path_fragment):
    """统计含 'path_fragment/' 路径段的 .md 文件数（粗略）。"""
    pat = re.compile(_LEFT_BOUND + re.escape(path_fragment) + r"/")
    count = 0
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in _EXCLUDE_DIRS
                   and not d.startswith('.')]
        for fn in files:
            if not fn.endswith('.md'):
                continue
            try:
                txt = open(os.path.join(root, fn), encoding='utf-8',
                           errors='ignore').read()
                if pat.search(txt):
                    count += 1
            except OSError:
                pass
    return count


def dry_run(out_csv=REPO_ROOT / "工具" / "prefix_rename_plan.csv"):
    ops = build_rename_ops()
    rows = []
    for old, new in ops:
        # 二级 op 的 old 用了新顶层前缀（NN_父/子）；rename 前实际路径是「原父/子」
        if "/" in old:
            head, tail = old.split("/", 1)
            cur = f"{head.split('_', 1)[1]}/{tail}"
        else:
            cur = old
        exists = (REPO_ROOT / cur).exists()
        ref = _count_refs(cur) if exists else 0
        rows.append({"old": old, "new": new, "exists": exists,
                     "referenced_files": ref})
    out_csv.parent.mkdir(parents=True, exist_ok=True)
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["old", "new", "exists",
                                          "referenced_files"])
        w.writeheader()
        w.writerows(rows)
    missing = [r for r in rows if not r["exists"]]
    top = sum(1 for o, _ in ops if "/" not in o)
    nested = len(ops) - top
    print(f"dry-run 完成：{len(ops)} 条重命名（顶层 {top} + 二级 {nested}）")
    print(f"其中不存在（将跳过）：{len(missing)}")
    for r in missing:
        print(f"  ✗ 缺失: {r['old']}")
    print(f"计划表：{out_csv}")
    return rows


# === Phase B: rename ===

def rename(commit=True):
    """git mv 加前缀：先顶层，后二级（分阶段 commit）。仅添加前缀，无命名冲突。"""
    ops = build_rename_ops()
    top_ops = [(o, n) for o, n in ops if "/" not in o]
    nested_ops = [(o, n) for o, n in ops if "/" in o]

    moved = 0
    for old, new in top_ops:
        if not (REPO_ROOT / old).exists():
            print(f"  跳过(不存在): {old}"); continue
        if (REPO_ROOT / new).exists():
            print(f"  ⚠️ 目标已存在: {new}，跳过"); continue
        _git(["mv", old, new]); moved += 1
        print(f"  {old} → {new}")
    if commit and moved:
        _git(["add", "-A"])
        _git(["commit", "-m", f"refactor(prefix): 顶层章节加数字前缀（{moved} 个）"])
    print(f"✓ 顶层重命名 {moved} 个")

    moved = 0
    for old, new in nested_ops:
        if not (REPO_ROOT / old).exists():
            print(f"  跳过(不存在): {old}"); continue
        if (REPO_ROOT / new).exists():
            print(f"  ⚠️ 目标已存在: {new}，跳过"); continue
        _git(["mv", old, new]); moved += 1
    if commit and moved:
        _git(["add", "-A"])
        _git(["commit", "-m", f"refactor(prefix): 主题型二级目录加数字前缀（{moved} 个）"])
    print(f"✓ 二级重命名 {moved} 个")


# === Phase C: rewrite-links ===

def rewrite_links_in_file(filepath, rules):
    """CJK 安全地重写单文件：仅替换「以 / 结尾的路径段」old/ → new/。"""
    path_obj = Path(filepath)
    text = path_obj.read_text(encoding="utf-8", errors="ignore")
    original = text
    for old, new in rules:
        pat = re.compile(_LEFT_BOUND + re.escape(old) + r"/")
        text = pat.sub(new + "/", text)
    if text != original:
        path_obj.write_text(text, encoding="utf-8")
        return True
    return False


def rewrite_links():
    rules = build_rewrite_rules()
    changed = 0
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in _EXCLUDE_DIRS
                   and not d.startswith('.')]
        root_path = Path(root)
        for fn in files:
            if not fn.endswith('.md'):
                continue
            if rewrite_links_in_file(root_path / fn, rules):
                changed += 1
    print(f"rewrite-links 完成：{changed} 个文件被修改")
    return changed


# === Phase C2: rewrite-intra（章节内裸子目录引用） ===

def rewrite_intra_chapter():
    """重写「章节内部」对子目录的裸名引用（不含父目录名）。

    典型形式：./Architecture_Overview/xxx.md、[[Agent_Skills/xxx]]、
    `Vector_Databases/`。第一轮全路径规则（父名/子名/）覆盖不到这类。

    安全约束：
      1. 作用域限定在各章节目录树内，且只用该章节自己的子目录映射
         （Optimization/Security 等名称跨章节重复，全局替换会错编号）。
      2. 只在链接目标上下文中替换：md 链接目标 ](...)、wikilink [[...]]、
         反引号、frontmatter sources/parent；不碰普通正文。
      3. 左边界同样用 _LEFT_BOUND，已加前缀的 02_Architecture_Overview 中
         子名前是 '_'，不会被重复加前缀。
    """
    changed = 0
    for parent, subs in NESTED_ORDER.items():
        num = TOP_LEVEL_ORDER[parent]
        chapter_dir = REPO_ROOT / f"{num}_{parent}"
        if not chapter_dir.exists():
            print(f"  跳过(不存在): {chapter_dir.name}")
            continue
        # 该章节内的裸子目录规则，最长优先
        rules = sorted(
            [(sub, f"{i:02d}_{sub}") for i, sub in enumerate(subs, start=1)],
            key=lambda kv: len(kv[0]), reverse=True)
        for root, dirs, files in os.walk(chapter_dir):
            dirs[:] = [d for d in dirs if d not in _EXCLUDE_DIRS
                       and not d.startswith('.')]
            for fn in files:
                if not fn.endswith('.md'):
                    continue
                fp = Path(root) / fn
                if _rewrite_intra_file(fp, rules):
                    changed += 1
    print(f"rewrite-intra 完成：{changed} 个文件被修改")
    return changed


def _rewrite_intra_file(filepath, rules):
    """在链接目标上下文中把裸 sub/ 替换为 NN_sub/。"""
    text = Path(filepath).read_text(encoding="utf-8", errors="ignore")
    original = text
    for old, new in rules:
        pat = re.compile(_LEFT_BOUND + re.escape(old) + r"/")

        def _sub_in(m, _p=pat, _n=new):
            return _p.sub(_n + "/", m.group(0))

        # md 链接目标部分 ](...)（不碰链接文本）
        text = re.sub(r"\]\(([^)]+)\)", _sub_in, text)
        # wikilink [[...]]
        text = re.sub(r"\[\[[^\]]+\]\]", _sub_in, text)
        # 反引号内联代码
        text = re.sub(r"`[^`\n]+`", _sub_in, text)
        # frontmatter sources / parent
        text = re.sub(r"sources:\s*\[[^\]]+\]", _sub_in, text)
        text = re.sub(r'parent:\s*"[^"]*"', _sub_in, text)
    if text != original:
        Path(filepath).write_text(text, encoding="utf-8")
        return True
    return False


# === Phase C3: rewrite-tails（无尾斜杠的子目录引用） ===

def rewrite_tail_refs():
    """修复「新父 + 旧子」混合路径：NN_父/子名 → NN_父/MM_子名。

    成因：引用写法不带尾斜杠（如 [[大模型/LLM_Products]]、
    ../../模型评估/Evaluation_Fundamentals），第一轮只改了父级前缀，
    子目录名未被全路径规则（需要尾斜杠）命中。

    安全性：模式含「NN_中文父名/英文子名」强路径特征，正文不会误中；
    右边界 (?![A-Za-z0-9_/]) 避免截断更长名称或重复处理带斜杠路径；
    已编号的 NN_父/MM_子 不会匹配（字面不同）。
    """
    rules = []
    for parent, subs in NESTED_ORDER.items():
        num = TOP_LEVEL_ORDER[parent]
        for i, sub in enumerate(subs, start=1):
            old = f"{num}_{parent}/{sub}"
            new = f"{num}_{parent}/{i:02d}_{sub}"
            rules.append((re.compile(re.escape(old) + r"(?![A-Za-z0-9_/])"), new))
    changed = 0
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in _EXCLUDE_DIRS
                   and not d.startswith('.')]
        for fn in files:
            if not fn.endswith('.md'):
                continue
            fp = Path(root) / fn
            text = fp.read_text(encoding="utf-8", errors="ignore")
            original = text
            for pat, new in rules:
                text = pat.sub(new, text)
            if text != original:
                fp.write_text(text, encoding="utf-8")
                changed += 1
    print(f"rewrite-tails 完成：{changed} 个文件被修改")
    return changed


# === Phase C4: rewrite-bare（无斜杠的裸章节 wikilink） ===

def rewrite_bare_wikilinks():
    """修复裸章节名 wikilink：[[机器学习]] / [[大模型|文本]] → 加数字前缀。

    成因：无斜杠引用不被「old + /」路径段规则命中；目录改名前这类
    wikilink 被 checker 识别为目录引用（跳过），改名后成为断链。

    安全性：仅匹配「[[ 紧跟章节名，且后接 ]/|/#」的 wikilink 目标位，
    不碰正文与链接文本；已带前缀的 [[NN_章节]] 因 [[ 后是数字不会命中。
    """
    rules = []
    for name, num in TOP_LEVEL_ORDER.items():
        pat = re.compile(r"\[\[" + re.escape(name) + r"(?=[\]|#])")
        rules.append((pat, f"[[{num}_{name}"))
    changed = 0
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in _EXCLUDE_DIRS
                   and not d.startswith('.')]
        for fn in files:
            if not fn.endswith('.md'):
                continue
            fp = Path(root) / fn
            text = fp.read_text(encoding="utf-8", errors="ignore")
            original = text
            for pat, new in rules:
                text = pat.sub(new, text)
            if text != original:
                fp.write_text(text, encoding="utf-8")
                changed += 1
    print(f"rewrite-bare 完成：{changed} 个文件被修改")
    return changed


# === Phase D: verify ===

def _count_broken():
    script = REPO_ROOT / "工具" / "check_links.py"
    r = subprocess.run([sys.executable, str(script), str(REPO_ROOT)],
                       capture_output=True, text=True)
    m = re.search(r"Broken:\s*(\d+)", r.stdout)
    return int(m.group(1)) if m else -1


def verify(baseline=None):
    after = _count_broken()
    if baseline is None:
        print(f"verify：当前断链数 = {after}")
    else:
        ok = after <= baseline
        print(f"verify：断链 {after}（基线 {baseline}）→ {'OK 未恶化' if ok else 'FAIL 恶化'}")
    return after


# === CLI ===

def main():
    p = argparse.ArgumentParser(description="顶层+二级目录加数字前缀迁移")
    p.add_argument("cmd", choices=["dry-run", "rename", "rewrite-links",
                                   "rewrite-intra", "rewrite-tails",
                                   "rewrite-bare", "verify"])
    p.add_argument("--no-commit", action="store_true")
    p.add_argument("--baseline", type=int, default=None,
                   help="verify 用的断链基线")
    args = p.parse_args()
    if args.cmd == "dry-run":
        dry_run()
    elif args.cmd == "rename":
        rename(commit=not args.no_commit)
    elif args.cmd == "rewrite-links":
        rewrite_links()
    elif args.cmd == "rewrite-intra":
        rewrite_intra_chapter()
    elif args.cmd == "rewrite-tails":
        rewrite_tail_refs()
    elif args.cmd == "rewrite-bare":
        rewrite_bare_wikilinks()
    elif args.cmd == "verify":
        verify(baseline=args.baseline)


if __name__ == "__main__":
    main()
