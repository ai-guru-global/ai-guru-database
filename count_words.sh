#!/bin/bash

# 计算文档总字数的脚本
# 统计 Markdown 文件的字数（字符数，包括中文）

echo "📊 开始统计文档字数..."
echo "================================"

# 使用 find 和 xargs 高效统计（排除 .git 和其他隐藏目录）
echo ""
echo "📁 正在统计..."

# 只统计非隐藏目录下的 .md 文件
total=$(find . -name "*.md" -not -path "./.git/*" -not -path './.*/*' -type f -print0 | xargs -0 wc -m 2>/dev/null | grep total | awk '{print $1}')

file_count=$(find . -name "*.md" -not -path "./.git/*" -not -path './.*/*' -type f | wc -l | tr -d ' ')

# 统计各主要目录的文件数
echo ""
echo "📁 各主要目录文档数量："
echo "--------------------------------"
find . -name "*.md" -not -path "./.git/*" -not -path './.*/*' -type f -maxdepth 2 | awk -F/ '{print $2}' | sort | uniq -c | sort -rn | while read count dir; do
    [ -n "$dir" ] && printf "   %-50s %5d 个文件\n" "$dir" "$count"
done

echo ""
echo "================================"
echo ""
echo "📈 统计结果（仅实际文档，排除隐藏目录）："
echo "   文件数量: $file_count"
echo "   总字符数: $total"
echo ""

# 转换为万字单位
if [ -n "$total" ] && [ "$total" -ge 10000 ] 2>/dev/null; then
    wan=$((total / 10000))
    remainder=$((total % 10000))
    remainder_formatted=$(printf "%04d" $remainder)
    echo "   约合: ${wan}.${remainder_formatted} 万字"
    echo ""
fi

echo "✅ 统计完成！"
