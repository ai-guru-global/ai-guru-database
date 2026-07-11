#!/bin/bash
# CI 质量门禁钩子

set -e

echo "======================================"
echo "🚀 开始执行 Cloud Ops Agent 文档质量门禁"
echo "======================================"

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOCS_DIR="$BASE_DIR/docs"

ERROR_COUNT=0

# 1. 检查文档合规性（是否包含最佳实践章节）
echo "1. 检查文档内容合规性 (必需包含 '最佳实践' 章节)..."
find "$DOCS_DIR" -name "*.md" ! -path "*/templates/*" | while read file; do
    if ! grep -q "最佳实践" "$file"; then
        echo "❌ 失败: $file 缺少 '最佳实践' 章节"
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi
done
if [ $ERROR_COUNT -eq 0 ]; then echo "✅ 合规性检查通过"; fi

# 2. 检查链接有效性 (简单正则匹配本地相对链接)
echo "2. 检查本地相对链接有效性..."
LINK_ERRORS=0
find "$DOCS_DIR" -name "*.md" | while read file; do
    grep -o '\[.*\](\.\./[^)]*\.md)' "$file" | sed -e 's/.*(\(.*\))/\1/' | while read link; do
        target_path="$(dirname "$file")/$link"
        if [ ! -f "$target_path" ]; then
            echo "❌ 死链发现: 在 $file 中引用的 $link 不存在"
            LINK_ERRORS=$((LINK_ERRORS + 1))
        fi
    done
done
if [ $LINK_ERRORS -eq 0 ]; then 
    echo "✅ 链接检查通过"
else
    ERROR_COUNT=$((ERROR_COUNT + LINK_ERRORS))
fi

# 3. 示例可运行性（模拟验证，确保代码块包含语言标识）
echo "3. 检查代码块是否包含语言标识 (示例验证)..."
CODE_ERRORS=0
find "$DOCS_DIR" -name "*.md" | while read file; do
    if grep -n '^\`\`\`$' "$file" > /dev/null; then
        echo "❌ 失败: $file 包含无语言标识的代码块"
        CODE_ERRORS=$((CODE_ERRORS + 1))
    fi
done
if [ $CODE_ERRORS -eq 0 ]; then 
    echo "✅ 代码块检查通过"
else
    ERROR_COUNT=$((ERROR_COUNT + CODE_ERRORS))
fi

echo "======================================"
if [ $ERROR_COUNT -gt 0 ]; then
    echo "💥 质量门禁失败，共发现 $ERROR_COUNT 个错误。"
    exit 1
else
    echo "🎉 所有质量门禁检查均通过！可以安全合并。"
    exit 0
fi
