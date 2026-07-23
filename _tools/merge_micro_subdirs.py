#!/usr/bin/env python3
"""子目录合并脚本：消除微型子目录（≤2 文件），提升内容到父目录。

策略：
1. 删除真空目录（0 文件）
2. ≤2 文件的子目录：文件 git mv 到父目录根，删除空壳
3. 特例：业界观点/面试岗位 按"人物/岗位"组织的不合并（语义需要）
4. 前端应用/ 不动（构建产物）
"""
import os
import re
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# 不处理的目录
SKIP_DIRS = {'Web', 'release', 'node_modules', 'code', 'docs', '前端应用',
             '.git', '.venv', '__pycache__', '原始', '概念', '来源', '可视化', '归档', '学习'}

# 保留微型子目录的特例（按人物/岗位组织，每个子目录是独立实体）
PRESERVE_TINY = {
    '业界观点',  # 每位演讲者一目录
    '面试岗位',  # 每个岗位一目录
}


def _git(args, cwd=REPO):
    r = subprocess.run(['git'] + args, cwd=str(cwd), capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} 失败:\n{r.stderr}")
    return r.stdout.strip()


def count_md(d):
    return sum(1 for r, ds, fs in os.walk(d) for f in fs if f.endswith('.md'))


def merge_micro_subdirs():
    """主逻辑：遍历所有一级目录，合并微型子目录。"""
    total_deleted_empty = 0
    total_promoted = 0
    total_files_moved = 0

    for d in sorted(os.listdir('.')):
        if not os.path.isdir(d) or d.startswith('.') or d in SKIP_DIRS:
            continue
        if d in PRESERVE_TINY:
            print(f"⏭️  {d}: 保留（按实体组织，不合并）")
            continue

        subdirs = sorted([s for s in os.listdir(d)
                         if os.path.isdir(os.path.join(d, s)) and not s.startswith('.')])

        for sd in subdirs:
            sdpath = os.path.join(d, sd)
            n = count_md(sdpath)

            if n == 0:
                # 空目录，删除（除非有非 md 内容）
                other = sum(1 for r, ds, fs in os.walk(sdpath) for f in fs)
                if other == 0:
                    os.rmdir(sdpath)
                    total_deleted_empty += 1
                    print(f"  🗑️  删除空目录: {d}/{sd}")
                continue

            if n <= 2:
                # 微型子目录：提升文件到父目录
                # 文件名冲突检查（加前缀避免覆盖）
                for r, ds, files in os.walk(sdpath):
                    for f in files:
                        if not f.endswith('.md'):
                            continue
                        old = os.path.join(r, f)
                        # 相对路径
                        rel_old = os.path.relpath(old, '.')
                        # 新路径：父目录/文件名（如果冲突则加子目录名前缀）
                        new_name = f
                        new_path = os.path.join(d, new_name)
                        if os.path.exists(new_path) and os.path.abspath(old) != os.path.abspath(new_path):
                            # 冲突：用 子目录_文件名
                            new_name = f"{sd}_{f}"
                            new_path = os.path.join(d, new_name)

                        if os.path.abspath(old) == os.path.abspath(new_path):
                            continue  # 已在目标位置

                        rel_new = os.path.relpath(new_path, '.')
                        try:
                            _git(['mv', rel_old, rel_new])
                            total_files_moved += 1
                        except RuntimeError as e:
                            print(f"  ⚠️ 移动失败: {rel_old} → {rel_new}: {e}")
                            continue

                # 检查子目录是否已空，删除
                remaining = sum(1 for r, ds, fs in os.walk(sdpath) for f in fs)
                if remaining == 0:
                    os.rmdir(sdpath)
                    total_promoted += 1

        print(f"✓ {d}: 处理完成")

    print(f"\n=== 汇总 ===")
    print(f"  删除空目录: {total_deleted_empty}")
    print(f"  合并微型子目录: {total_promoted}")
    print(f"  移动文件: {total_files_moved}")


def main():
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == '--dry-run':
        print("dry-run 模式（仅统计，不执行）")
        # 统计将受影响的
        count = 0
        files = 0
        for d in sorted(os.listdir('.')):
            if not os.path.isdir(d) or d.startswith('.') or d in SKIP_DIRS or d in PRESERVE_TINY:
                continue
            for sd in sorted(os.listdir(d)):
                sdpath = os.path.join(d, sd)
                if not os.path.isdir(sdpath) or sd.startswith('.'):
                    continue
                n = count_md(sdpath)
                if n == 0:
                    other = sum(1 for r, ds, fs in os.walk(sdpath) for f in fs)
                    if other == 0:
                        count += 1
                        print(f"  将删除空目录: {d}/{sd}")
                elif n <= 2:
                    count += 1
                    files += n
                    print(f"  将合并: {d}/{sd} ({n} 文件)")
        print(f"\n将影响: {count} 子目录, {files} 文件")
        return

    print("=== 子目录合并 ===\n")
    merge_micro_subdirs()


if __name__ == '__main__':
    main()
