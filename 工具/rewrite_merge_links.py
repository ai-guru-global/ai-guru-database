#!/usr/bin/env python3
"""重写子目录合并后的 wikilink/内链。

检测 git mv 记录，构建 old→new 路径映射，全量重写。
"""
import os
import re
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

def get_rename_map():
    """从 git status -s 提取重命名映射（R/RM 行）。"""
    r = subprocess.run(['git', 'status', '--short', '--renames'],
                       cwd=str(REPO), capture_output=True, text=True)
    moves = {}
    for line in r.stdout.splitlines():
        # 格式: R  old -> new  或  RM old -> new
        m = re.match(r'^[RM]+\s+(.+?)\s+->\s+(.+)$', line.strip())
        if m:
            old = m.group(1).strip().strip('"')
            new = m.group(2).strip().strip('"')
            # 解码 octal 转义（中文路径）
            try:
                old = old.encode('latin-1').decode('unicode-escape').encode('latin-1').decode('utf-8')
            except:
                pass
            try:
                new = new.encode('latin-1').decode('unicode-escape').encode('latin-1').decode('utf-8')
            except:
                pass
            # wikilink 用不带 .md 的形式
            old_base = old[:-3] if old.endswith('.md') else old
            new_base = new[:-3] if new.endswith('.md') else new
            moves[old] = new
            moves[old_base] = new_base
    return moves


def rewrite_all(moves):
    """全量重写 wikilink/内链/反引号。"""
    if not moves:
        print("无重命名，跳过")
        return 0
    rules = sorted(moves.items(), key=lambda kv: len(kv[0]), reverse=True)
    changed = 0
    EXCLUDE = {'.git', 'Web', 'node_modules', 'release', 'code', 'docs', '前端应用',
               '原始', '来源', '.venv', '__pycache__'}

    for root, dirs, files in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in EXCLUDE and not d.startswith('.')]
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
                if old == new:
                    continue
                pattern = re.compile(
                    r"(?<![A-Za-z0-9_/])" + re.escape(old) + r"(?![A-Za-z0-9_])"
                )
                def _repl(m, _p=pattern, _n=new):
                    return _p.sub(_n, m.group(0))
                text = re.sub(r"\[\[[^\]]+\]\]", _repl, text)
                text = re.sub(r"\[[^\]]*\]\([^)]+\)", _repl, text)
                text = re.sub(r"`[^`\n]+`", _repl, text)
                # 裸路径
                text = re.sub(
                    r"(?<![A-Za-z0-9_/])" + re.escape(old) + r"(?![A-Za-z0-9_])",
                    new, text
                )
            if text != original:
                fp.write_text(text, encoding='utf-8')
                changed += 1
    print(f"重写完成：{changed} 文件")
    return changed


if __name__ == '__main__':
    moves = get_rename_map()
    print(f"重命名映射：{len(moves)} 条（含 .md 和无后缀两种形式）")
    rewrite_all(moves)
