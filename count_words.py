#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
计算文档总字数的脚本
统计 Markdown 文件的字符数（包括中文）
"""

import os
from pathlib import Path
from collections import defaultdict

def count_words():
    """统计文档字数"""
    print("📊 开始统计文档字数...")
    print("=" * 60)
    
    base_dir = Path(__file__).parent
    total_chars = 0
    file_count = 0
    dir_stats = defaultdict(lambda: {"files": 0, "chars": 0})
    
    # 只统计主要的文档目录 (00_* 到 19_*)
    doc_dirs = [d for d in base_dir.iterdir() 
                if d.is_dir() and (d.name.startswith('0') or d.name.startswith('1')) 
                and '_' in d.name]
    
    print(f"\n📁 找到 {len(doc_dirs)} 个主要文档目录")
    print("-" * 60)
    
    for doc_dir in sorted(doc_dirs):
        dir_chars = 0
        dir_files = 0
        
        # 统计该目录下所有 .md 文件
        for md_file in doc_dir.rglob("*.md"):
            try:
                chars = len(md_file.read_text(encoding='utf-8'))
                dir_chars += chars
                dir_files += 1
            except Exception as e:
                pass
        
        total_chars += dir_chars
        file_count += dir_files
        dir_stats[doc_dir.name] = {"files": dir_files, "chars": dir_chars}
        
        # 实时显示进度
        print(f"   {doc_dir.name:<50s} {dir_files:5d} 个文件, {dir_chars:>10,} 字符")
    
    print("\n" + "=" * 60)
    print("\n📈 统计结果：")
    print(f"   文件数量: {file_count:,}")
    print(f"   总字符数: {total_chars:,}")
    print()
    
    # 转换为万字
    if total_chars >= 10000:
        wan = total_chars / 10000
        print(f"   约合: {wan:.2f} 万字")
        print()
    
    print("✅ 统计完成！")

if __name__ == "__main__":
    count_words()
