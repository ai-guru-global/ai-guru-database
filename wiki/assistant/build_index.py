#!/usr/bin/env python3
"""AI Guru 助手 MVP · 索引构建（发展计划 §3.2）。

纯标准库实现：将语料切块后构建 TF-IDF 倒排索引（CJK 二元组 + 英文词），
供 query.py 检索与引用溯源。零第三方依赖，离线可跑。

质量加权（门禁数据质检层）：
- frontmatter 8 字段完整 → ×1.2（与 link_gate 口径一致）
- tier=core → ×1.15
- stub(<500B) → ×0.5

产物：.code-up/rag-index/index.json.gz（生成物，不入库）
用法：python3 assistant/build_index.py
"""
import gzip
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '.code-up' / 'rag-index' / 'index.json.gz'
CJK_RUN = re.compile(r'[\u4e00-\u9fff]+')
ASCII_RUN = re.compile(r'[a-z0-9]+')
HEADING = re.compile(r'^(#{1,4})\s+(.*)$')
FRONTMATTER = re.compile(r'\A---\s*\n(.*?)\n---', re.S)
FIELD = re.compile(r'^(\w[\w-]*):', re.M)
REQUIRED = ('title', 'category', 'tags', 'summary',
            'created', 'updated', 'tier', 'name_zh')
ALWAYS_SKIP = {'.git', '.obsidian', '.qoder', '.claude', '.githooks', '.github',
               'node_modules', 'release'}
ROOT_ONLY_SKIP = {'前端应用', '原始', '来源', '归档', 'docs', 'code', '工具',
                  'assistant'}   # 本助手自身是工具代码，不是知识语料
CHUNK_TARGET = 600          # 单块目标字符数
MAX_DF_RATIO = 0.30         # 出现在 30% 以上块中的词视为停用


def tokenize(text: str):
    """英文小写词 + 中文二元组。"""
    low = text.lower()
    toks = ASCII_RUN.findall(low)
    for run in CJK_RUN.findall(low):
        if len(run) == 1:
            toks.append(run)
        else:
            toks.extend(run[i:i + 2] for i in range(len(run) - 1))
    return toks


def parse_frontmatter(text: str):
    m = FRONTMATTER.match(text)
    if not m:
        return {}, False
    fields = dict(re.findall(r'^(\w[\w-]*):\s*(.*)$', m.group(1), re.M))
    return fields, all(f in fields for f in REQUIRED)


def iter_chunks(rel: str):
    """按标题切块；超长段落按行窗口再切。返回 (heading, body) 序列。"""
    path = ROOT / rel
    text = path.read_text(encoding='utf-8', errors='ignore')
    body = FRONTMATTER.sub('', text, count=1)
    chunks, heading, buf = [], '（开篇）', []
    size = 0
    for line in body.split('\n'):
        hm = HEADING.match(line)
        if hm:
            if buf:
                chunks.append((heading, '\n'.join(buf)))
                buf, size = [], 0
            heading = hm.group(2).strip()[:80]
            continue
        buf.append(line)
        size += len(line)
        if size >= CHUNK_TARGET * 1.6:   # 超长节按窗口硬切
            chunks.append((heading, '\n'.join(buf)))
            buf, size = [], 0
    if buf:
        chunks.append((heading, '\n'.join(buf)))
    return chunks, len(text)


def main():
    scan_files = []
    for dp, dns, fns in os.walk(ROOT):
        dns[:] = [d for d in dns if d not in ALWAYS_SKIP]
        rel_dp = Path(dp).relative_to(ROOT)
        top = rel_dp.parts[0] if rel_dp.parts else '.'
        if top in ROOT_ONLY_SKIP:
            continue
        for f in fns:
            if f.endswith('.md'):
                scan_files.append(str(rel_dp / f) if str(rel_dp) != '.' else f)

    chunks, postings = [], {}
    for rel in sorted(scan_files):
        try:
            parts, size = iter_chunks(rel)
        except OSError:
            continue
        fm, fm_ok = parse_frontmatter((ROOT / rel).read_text(encoding='utf-8',
                                                             errors='ignore'))
        q = 1.2 if fm_ok else 1.0
        if fm.get('tier', '').strip("'\"") == 'core':
            q *= 1.15
        if size < 500:
            q *= 0.5
        name_zh = fm.get('name_zh', '').strip("'\"")
        for heading, body in parts:
            toks = tokenize(body)
            if len(toks) < 10:
                continue
            cid = len(chunks)
            chunks.append({'path': rel, 'name_zh': name_zh, 'heading': heading,
                           'q': round(q, 3), 'n': len(toks),
                           'excerpt': re.sub(r'\s+', ' ', body).strip()[:200]})
            tf = {}
            for t in toks:
                tf[t] = tf.get(t, 0) + 1
            for term, freq in tf.items():
                postings.setdefault(term, []).append([cid, freq])

    n = len(chunks)
    postings = {t: pl for t, pl in postings.items()
                if 2 <= len(pl) <= n * MAX_DF_RATIO}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(OUT, 'wt', encoding='utf-8') as f:
        json.dump({'n_chunks': n, 'chunks': chunks, 'postings': postings},
                  f, ensure_ascii=False, separators=(',', ':'))
    mb = OUT.stat().st_size / 1048576
    print(f'✅ 索引完成：{n} 块 / {len(scan_files)} 文件 / '
          f'{len(postings)} 词项 → {OUT.relative_to(ROOT)} ({mb:.1f} MB)')


if __name__ == '__main__':
    main()
