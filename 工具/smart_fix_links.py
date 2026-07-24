#!/usr/bin/env python3
"""智能断链修复：用文件名在仓库搜索正确路径，自动修正 wikilink。

策略：
1. 收集所有断链 target
2. 对每个 target，提取文件名，在仓库 find 正确路径
3. 若唯一匹配，自动替换所有引用该 target 的 wikilink
4. 若多匹配，跳过（保守）
"""
import json
import os
import re
import subprocess
from collections import defaultdict
from pathlib import Path

REPO = Path('.').resolve()
EXCLUDE_DIRS = {'.git', 'node_modules', 'release', '前端应用', '原始', '来源', 'code', 'docs'}

# 建立文件名→路径索引
print("建立文件索引...")
index = defaultdict(list)
for root, dirs, files in os.walk(REPO):
    dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
    for f in files:
        if f.endswith('.md'):
            index[f].append(os.path.relpath(os.path.join(root, f), REPO))

# 已知目录重命名映射（旧名→新名前缀替换）
DIR_RENAME = {
    "Agent/": "智能体/",
    "15_Agent_Production/": "智能体/",
}

def find_correct_path(target):
    """用文件名搜索正确路径。返回新路径或 None。"""
    # 先尝试目录名替换
    for old_prefix, new_prefix in DIR_RENAME.items():
        if target.startswith(old_prefix):
            replaced = new_prefix + target[len(old_prefix):]
            if os.path.exists(replaced) or os.path.exists(replaced + '.md'):
                return replaced

    # 用文件名搜索
    fname = os.path.basename(target.split('#')[0])
    if not fname:
        return None
    if fname in index:
        candidates = index[fname]
        if len(candidates) == 1:
            return candidates[0]
        # 多候选：尝试匹配 target 中的目录线索
        target_dir = os.path.dirname(target)
        target_dirs = target_dir.split('/')
        for c in candidates:
            if all(td in c for td in target_dirs[-2:]):  # 匹配最后两级目录
                return c
    return None


def main():
    # 读取断链报告
    print("读取断链报告...")
    r = subprocess.run(['python3', '工具/check_links.py', '.', '--json', '/tmp/broken_fix.json'],
                       capture_output=True, text=True)
    data = json.load(open('/tmp/broken_fix.json'))

    # 收集 target→正确路径 映射
    print(f"分析 {len(data['broken_list'])} 个断链...")
    target_map = {}
    skipped_multi = 0
    skipped_missing = 0

    for b in data['broken_list']:
        target = b['target']
        if target in target_map:
            continue
        if target.startswith(('http', '#', 'mailto:')):
            continue
        correct = find_correct_path(target)
        if correct:
            target_map[target] = correct
        elif target not in target_map:
            # 检查是否文件名存在但路径不同
            fname = os.path.basename(target.split('#')[0])
            if fname in index and len(index[fname]) > 1:
                skipped_multi += 1
            else:
                skipped_missing += 1

    print(f"可修复: {len(target_map)} 个 target")
    print(f"跳过(多候选): {skipped_multi}")
    print(f"跳过(真缺失): {skipped_missing}")

    if not target_map:
        print("无可修复项")
        return

    # 构建重写规则
    rules = sorted(target_map.items(), key=lambda kv: len(kv[0]), reverse=True)

    # 全量重写
    changed_files = 0
    for root, dirs, files in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for fn in files:
            if not fn.endswith('.md'):
                continue
            fp = Path(root) / fn
            try:
                text = fp.read_text(encoding='utf-8', errors='ignore')
            except:
                continue
            original = text
            for old, new in rules:
                # 替换 wikilink 和链接中的路径
                pattern = re.compile(r"(?<![A-Za-z0-9_/])" + re.escape(old) + r"(?![A-Za-z0-9_])")
                def _repl(m, _p=pattern, _n=new):
                    return _p.sub(_n, m.group(0))
                text = re.sub(r"\[\[[^\]]+\]\]", _repl, text)
                text = re.sub(r"\[[^\]]*\]\([^)]+\)", _repl, text)
                text = re.sub(r"`[^`\n]+`", _repl, text)
                text = re.sub(r"(?<![A-Za-z0-9_/])" + re.escape(old) + r"(?![A-Za-z0-9_])", new, text)

            if text != original:
                fp.write_text(text, encoding='utf-8')
                changed_files += 1

    print(f"\n重写完成: {changed_files} 文件")


if __name__ == '__main__':
    main()
