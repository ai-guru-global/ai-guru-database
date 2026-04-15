#!/bin/bash
# 自动化构建脚本：一键生成各角色 Markdown 文档

set -e

ROLE=$1
DOC_NAME=$2

if [ -z "$ROLE" ] || [ -z "$DOC_NAME" ]; then
  echo "用法: ./generate_doc.sh <角色> <文档名称>"
  echo "角色选项: arch, dev, test, ops"
  exit 1
fi

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE_DIR="$BASE_DIR/docs/templates"

case $ROLE in
  arch)
    DEST_DIR="$BASE_DIR/docs/architecture"
    TEMPLATE_FILE="$TEMPLATE_DIR/arch_template.md"
    ;;
  dev)
    DEST_DIR="$BASE_DIR/docs/development"
    TEMPLATE_FILE="$TEMPLATE_DIR/dev_template.md"
    ;;
  test)
    DEST_DIR="$BASE_DIR/docs/testing"
    TEMPLATE_FILE="$TEMPLATE_DIR/test_template.md"
    ;;
  ops)
    DEST_DIR="$BASE_DIR/docs/operations"
    TEMPLATE_FILE="$TEMPLATE_DIR/ops_template.md"
    ;;
  *)
    echo "错误: 未知的角色 '$ROLE'"
    echo "角色选项: arch, dev, test, ops"
    exit 1
    ;;
esac

DEST_FILE="$DEST_DIR/$DOC_NAME.md"

if [ -f "$DEST_FILE" ]; then
  echo "错误: 文档 '$DEST_FILE' 已存在。"
  exit 1
fi

cp "$TEMPLATE_FILE" "$DEST_FILE"
# 替换标题占位符
sed -i.bak "s/\[文档标题\]/$DOC_NAME/g" "$DEST_FILE" && rm -f "$DEST_FILE.bak"

echo "✅ 成功生成 $ROLE 文档: $DEST_FILE"
echo "请记得在 mkdocs.yml 中更新导航链接。"
