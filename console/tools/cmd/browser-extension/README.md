# AI News Database Browser Extension

AI News Database 官方浏览器插件 —— 一键将任意网页保存到本地知识库。

## 功能

- **一键保存**：点击扩展图标，将当前网页标题、链接、摘要发送到 AI News Database 本地 API
- **右键菜单**：在页面或链接上右键选择「保存到 AI News Database」
- **快捷键**：`Ctrl+Shift+N`（macOS: `Cmd+Shift+N`）快速打开保存弹窗
- **自定义配置**：设置本地 API 地址和可选的 API Key

## 文件结构

```
browser-extension/
├── manifest.json      # Chrome Extension Manifest V3
├── popup.html         # 保存弹窗界面
├── popup.css          # 弹窗样式
├── popup.js           # 弹窗逻辑
├── options.html       # 设置页面
├── options.js         # 设置逻辑
├── background.js      # Service Worker（右键菜单、初始化）
├── content.js         # 内容脚本（提取页面元数据）
├── icons/             # 扩展图标（需自行准备）
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # 本文件
```

## 安装方式

### 方式 1：Chrome Web Store（推荐）

搜索 "AI News Database Clipper" 即可安装。

**自动化发布**：配置 GitHub Secrets 后，通过 GitHub Actions `Publish to Chrome Web Store` workflow 手动触发发布。

### 方式 2：开发者模式本地加载

1. 打开 Chrome / Edge，进入 `chrome://extensions/`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `browser-extension/` 目录

### 方式 3：Firefox（暂需手动打包）

1. 将 `manifest.json` 中 `background.service_worker` 改为 `scripts: ["background.js"]`（Firefox 暂不完全支持 Manifest V3 service worker）
2. 使用 `web-ext build` 打包为 `.zip` 或 `.xpi`
3. 在 `about:debugging` 中加载临时扩展

### 方式 4：Safari（需 Xcode 转换）

1. 使用 Safari 的「转换 Web 扩展」功能将本扩展导入 Xcode
2. 构建并签名后安装到 Safari

## 配置说明

插件默认连接 `http://localhost:8081`，这是 AI News Database Web Dashboard 的默认端口。

如果你修改了本地服务端口号，请在插件设置中更新 API 地址。

## 依赖

此插件需要 AI News Database 本地运行并开启 Web Dashboard（v1.0+）：

```bash
ai-news-database web --port 8081
```

或：

```bash
./ai-news-database web
```

## 隐私说明

- 插件仅与本地 `localhost` 通信，不会上传任何数据到远程服务器
- 网页内容仅在用户主动点击「保存」时才会被读取和传输
- API Key（如设置）仅存储在浏览器的本地存储中

## 开发计划

- [ ] 自动提取文章正文（Reader Mode）
- [ ] 高亮批注同步（Hypothesis 风格）
- [ ] 未读文章 badge 角标
- [ ] 快捷添加自定义订阅源
