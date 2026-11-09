#!/bin/bash
# ai-news-database 一键安装脚本（macOS / Linux）
# 用法: ./install.sh

set -e

APP_NAME="ai-news-database"
ALIAS_NAME="nn"
INSTALL_DIR=""
SHELL_RC=""

# 检测操作系统
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

echo "🔧 检测到系统: $OS ($ARCH)"

# 选择安装目录
if [ -d "$HOME/bin" ] && echo "$PATH" | grep -q "$HOME/bin"; then
    INSTALL_DIR="$HOME/bin"
elif [ -d "$HOME/.local/bin" ] && echo "$PATH" | grep -q "$HOME/.local/bin"; then
    INSTALL_DIR="$HOME/.local/bin"
else
    INSTALL_DIR="$HOME/bin"
    mkdir -p "$INSTALL_DIR"
fi

echo "📁 安装目录: $INSTALL_DIR"

# 检查当前目录是否有编译好的二进制
if [ -f "./$APP_NAME" ]; then
    echo "✅ 发现本地编译好的二进制: ./$APP_NAME"
    BUILD_FROM_SOURCE=false
else
    echo "⚠️  未找到 ./$APP_NAME"
    BUILD_FROM_SOURCE=true
fi

# 如果需要，从源码构建
if [ "$BUILD_FROM_SOURCE" = true ]; then
    if ! command -v go &> /dev/null; then
        echo "❌ 未找到 Go，且没有预编译的二进制"
        echo ""
        echo "请从以下方式中选择一种安装:"
        echo "  1. 安装 Go (https://go.dev/dl/) 后重新运行此脚本"
        echo "  2. 先手动编译: make build"
        exit 1
    fi

    echo "🛠️  正在从源码编译..."
    if [ -f "Makefile" ]; then
        make build
    else
        go build -o "$APP_NAME" .
    fi
    echo "✅ 编译完成"
fi

# 复制主二进制
echo "📦 安装 $APP_NAME → $INSTALL_DIR/$APP_NAME"
cp "./$APP_NAME" "$INSTALL_DIR/$APP_NAME"
chmod +x "$INSTALL_DIR/$APP_NAME"

# 创建 nn 软链接
if [ -L "$INSTALL_DIR/$ALIAS_NAME" ] || [ -f "$INSTALL_DIR/$ALIAS_NAME" ]; then
    echo "📝 移除旧的 $ALIAS_NAME"
    rm -f "$INSTALL_DIR/$ALIAS_NAME"
fi

echo "🔗 创建快捷命令: $ALIAS_NAME → $APP_NAME"
ln -sf "$INSTALL_DIR/$APP_NAME" "$INSTALL_DIR/$ALIAS_NAME"

# 检测 shell 配置文件
if [ -n "$ZSH_VERSION" ] || [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ] || [ -f "$HOME/.bashrc" ]; then
    SHELL_RC="$HOME/.bashrc"
else
    SHELL_RC="$HOME/.profile"
fi

# 确保 PATH 包含安装目录
if ! echo "$PATH" | grep -q "$INSTALL_DIR"; then
    echo ""
    echo "⚠️  $INSTALL_DIR 不在 PATH 中"
    echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$SHELL_RC"
    echo "✅ 已追加 PATH 到 $SHELL_RC"
fi

# 可选：设置 nn 为 ai-news-database 的 alias（更友好的提示）
if ! grep -q "alias nn=" "$SHELL_RC" 2>/dev/null; then
    echo "# ai-news-database 快捷别名" >> "$SHELL_RC"
    echo "alias nn='ai-news-database'" >> "$SHELL_RC"
    echo "✅ 已添加 alias nn='ai-news-database' 到 $SHELL_RC"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 安装完成！"
echo ""
echo "📍 安装路径:"
echo "   $INSTALL_DIR/$APP_NAME"
echo "   $INSTALL_DIR/$ALIAS_NAME"
echo ""
echo "🚀 使用方式:"
echo "   nn ai          # 抓取 InfoQ AI Briefs"
echo "   nn infoq       # 抓取 InfoQ 热点清单"
echo "   nn sync        # 同步所有官方源"
echo "   nn list -a     # 查看本地文章"
echo "   nn curate      # 生成今日必读"
echo ""
echo "⚡ 请执行以下命令使配置生效:"
echo "   source $SHELL_RC"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
