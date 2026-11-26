#!/usr/bin/env python3
"""P2-1：md 内部链接解析的单一事实源（single source of truth）。

check_links.py 与 link_gate.py 的 md 链接分类共用本模块，消灭
"门禁 43 / check_links 946" 式口径漂移（ISS-102 家族）。

语义（ISS-109 定版，2026-11-24）：
- `/` 开头：vault 根绝对路径；
- 其余：先按源文件目录解析（标准 Markdown / Obsidian 语义）；
- 源目录不存在而 vault 根存在 → `root_relative_bare`（渲染站与 Obsidian
  内实为 404，单列类别便于批量改写收敛，见 KNOWN_ISSUES ISS-110）；
- 两处皆无 → `missing`。

wikilink 侧的解析已由 link_gate.py 经 runpy 复用 check_wikilinks.py
（三级解析 + aliases 兜底），不在本模块范围。
"""
import os
from pathlib import Path

CATEGORIES = ('ok', 'root_relative_bare', 'missing')


def classify_md_link(link_path, source_dir, content_root):
    """md 内部链接分类。

    参数：link_path（md 链接目标原文，可含 `./` `../` `/` 前缀与 `#锚点`
    ——锚点应由调用方先剥离）、source_dir（源文件目录，绝对路径）、
    content_root（vault 根，绝对路径）。

    返回 (category, resolved_abs)：
    - category ∈ CATEGORIES；
    - resolved_abs 为 os.path.normpath 后的绝对路径（category == 'ok' 时
      指向真实文件，供入链统计换算 wiki 相对路径；其余为 None）。

    注意：文件存在性判断依赖宿主文件系统。macOS 大小写不敏感会造成
    `X.md`/`x.md` 双通过，Linux CI 不会——需要跨平台精确匹配时调用方
    应改用 link_gate.exists_exact 的逐组件精确匹配（wikilink 侧已如此）。
    """
    content_root = Path(content_root)
    source_dir = Path(source_dir)
    if link_path.startswith('/'):
        hit = content_root / link_path.lstrip('/')
        if hit.is_file():
            return 'ok', os.path.normpath(hit)
        return 'missing', None
    src_hit = Path(os.path.normpath(source_dir / link_path))
    if src_hit.is_file():
        return 'ok', os.path.normpath(src_hit)
    root_hit = Path(os.path.normpath(content_root / link_path))
    if root_hit.is_file():
        return 'root_relative_bare', os.path.normpath(root_hit)
    return 'missing', None
