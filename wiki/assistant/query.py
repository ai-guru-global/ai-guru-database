#!/usr/bin/env python3
"""AI Guru 助手 MVP · 检索与引用溯源（发展计划 §3.2）。

默认模式（无 LLM）：TF-IDF 检索 Top-K 知识块，带出处引用——开卷考「找资料」。
LLM 模式（配置环境变量后）：将检索块交给 OpenAI 兼容接口生成带引用的回答。

环境变量（可选）：
    ASSISTANT_API_BASE   如 https://dashscope.aliyuncs.com/compatible-mode/v1
    ASSISTANT_API_KEY    你的密钥（仅从环境注入，禁止写入库内任何文件）
    ASSISTANT_MODEL      如 qwen-plus

用法：
    python3 assistant/query.py "KServe 和 vLLM 什么关系"
    python3 assistant/query.py "Token 工厂和 IDC 的区别" --topk 5 --llm
"""
import gzip
import json
import math
import os
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_index import tokenize  # noqa: E402

INDEX = Path(__file__).resolve().parent.parent / '.code-up' / 'rag-index' / 'index.json.gz'


def load():
    with gzip.open(INDEX, 'rt', encoding='utf-8') as f:
        return json.load(f)


def retrieve(query: str, data: dict, topk: int):
    toks = tokenize(query)
    tf = {}
    for t in toks:
        tf[t] = tf.get(t, 0) + 1
    n, chunks, postings = data['n_chunks'], data['chunks'], data['postings']
    scores = {}
    for term, q_tf in tf.items():
        pl = postings.get(term)
        if not pl:
            continue
        idf = math.log(1 + n / len(pl))
        for cid, freq in pl:
            chunk = chunks[cid]
            w = (1 + math.log(freq)) * idf / chunk['n']
            scores[cid] = scores.get(cid, 0) + q_tf * w
    ranked = sorted(scores.items(), key=lambda kv: -kv[1])[:topk]
    out = []
    for cid, s in ranked:
        chunk = chunks[cid]
        out.append({'score': round(s * chunk['q'], 4), **chunk})
    return out


def print_hits(hits):
    print('\n📚 检索结果（带引用溯源）：')
    for i, h in enumerate(hits, 1):
        print(f'\n[{i}] {h["path"]}  ·  {h["name_zh"] or "—"}  ·  §{h["heading"]}'
              f'  （质量加权分 {h["score"]}）')
        print(f'    {h["excerpt"]}…')


def answer_with_llm(question: str, hits):
    base = os.environ['ASSISTANT_API_BASE'].rstrip('/')
    payload = json.dumps({
        'model': os.environ['ASSISTANT_MODEL'],
        'messages': [
            {'role': 'system', 'content':
                '你是 AI Guru 知识库助手。仅依据提供的资料回答，'
                '每个论断后用 [编号] 标注来源，资料不足以回答时明确说明。'},
            {'role': 'user', 'content':
                '问题：' + question + '\n\n资料：\n' + '\n'.join(
                    f'[{i}] （{h["path"]} §{h["heading"]}）{h["excerpt"]}'
                    for i, h in enumerate(hits, 1))},
        ],
    }).encode()
    req = urllib.request.Request(
        base + '/chat/completions', data=payload,
        headers={'Content-Type': 'application/json',
                 'Authorization': 'Bearer ' + os.environ['ASSISTANT_API_KEY']})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read())
    print('\n🤖 回答：\n' + data['choices'][0]['message']['content'])
    print('\n📚 来源：')
    for i, h in enumerate(hits, 1):
        print(f'[{i}] {h["path"]} §{h["heading"]}')


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    topk = int(sys.argv[sys.argv.index('--topk') + 1]) if '--topk' in sys.argv else 5
    use_llm = '--llm' in sys.argv
    if not args:
        print(__doc__)
        sys.exit(2)
    hits = retrieve(' '.join(args), load(), topk)
    if not hits:
        print('未检索到相关内容。')
        return
    if use_llm:
        try:
            answer_with_llm(' '.join(args), hits)
        except (KeyError, OSError, json.JSONDecodeError) as e:
            print(f'⚠️ LLM 调用不可用（{e.__class__.__name__}），回退检索模式。'
                  '请确认 ASSISTANT_API_BASE / ASSISTANT_API_KEY / ASSISTANT_MODEL。')
            print_hits(hits)
    else:
        print_hits(hits)


if __name__ == '__main__':
    main()
