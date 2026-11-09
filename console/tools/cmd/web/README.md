# AI News Database Web UI

采用 CNCF 顶级开源项目设计美学的现代 Web 界面。

---

## 页面说明

| 页面 | 文件 | 用途 |
|------|------|------|
| **主站** | `index.html` | 产品官网，含 Hero、数据主权、特性、信息源、工作流、CTA |
| **灵感页** | `inspire.html` | 展示「灵感模式」捕获的 Show HN 产品/项目（独立设计风格） |

---

## 设计特点

- **配色方案**: 参考 Kubernetes、Prometheus 等 CNCF 项目
  - 主色: `#326CE5` (Kubernetes Blue)
  - 辅助色: `#00A3C4` (Cloud Native Teal)
  - 中性色: Slate 灰阶系统

- **字体**: Inter (Google Fonts)
- **设计风格**: 
  - 卡片式布局
  - 微妙阴影和渐变
  - 充足的留白
  - 现代圆角
  - 响应式设计

## 核心亮点

### 数据主权 (Data Sovereignty)

页面重点突出 AI News Database 的**本地优先**理念：

1. **Hero 区域** - 强调"你的数据你做主"，展示 100% 本地存储、0 云端依赖
2. **数据主权专页** - 详细介绍四大核心优势：
   - 完全本地存储
   - 隐私优先设计
   - 数据可导出
   - 永久可用
3. **对比表格** - AI News Database vs 云端阅读器的直观对比
4. **特性更新** - 强调本地知识库、本地 RAG 问答

---

## 文件结构

```
web/
├── index.html          # 主页面（含数据主权板块）
├── inspire.html        # 灵感模式展示页
├── css/
│   └── style.css       # 主站样式文件
├── js/
│   └── main.js         # 主站交互脚本
├── assets/
│   ├── favicon.svg     # 网站图标
│   └── .gitkeep        # 资源占位
└── README.md           # 本文件
```

---

## 本地预览

### 方式一：Python（推荐，最简单）

```bash
cd web
python3 -m http.server 8080
```

然后访问：
- 主站：http://localhost:8080
- 灵感页：http://localhost:8080/inspire.html

### 方式二：Node.js（live-reload 支持）

```bash
# 使用 serve（静态文件服务）
npx serve web

# 或使用 live-server（保存自动刷新，开发推荐）
npx live-server web --port=8080
```

### 方式三：Go（无需额外依赖）

```bash
cd web && go run net/http/file_server.go -addr=:8080 -dir=.
```

或者一行命令：

```bash
cd web && python3 -c "import http.server; http.server.SimpleHTTPRequestHandler.extensions_map['.js']='application/javascript'; http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=8080)"
```

### 方式四：Docker

```bash
docker run -d -p 8080:80 -v $(pwd)/web:/usr/share/nginx/html nginx:alpine
```

---

## 开发提示

### 修改样式

直接编辑 `css/style.css`。`index.html` 引用了外部 Google Fonts（Inter），请确保开发环境能访问 Google Fonts。

### 修改交互

直接编辑 `js/main.js`。当前包含以下交互模块：
- 导航栏滚动阴影
- 移动端菜单切换
- 安装标签页切换（macOS/Linux/Windows）
- 复制安装命令到剪贴板
- 滚动渐入动画（Intersection Observer）
- 平滑滚动（锚点链接）
- 终端光标闪烁
- 数字统计动画

### 响应式断点

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px
- Small Mobile: < 480px

建议在不同宽度的浏览器窗口下测试布局。

---

## 部署到生产环境

### GitHub Pages

1. 将 `web/` 目录内容推送到 `gh-pages` 分支
2. 或者在仓库 Settings → Pages 中选择 `main` 分支的 `/web` 目录

### Vercel / Netlify

直接拖拽 `web/` 文件夹到 Vercel 或 Netlify 的部署面板即可。

### Cloudflare Pages

连接 Git 仓库，设置构建输出目录为 `web/`（无需构建命令）。

---

## 更新日志

### 2024-04-16
- 新增 `inspire.html` 灵感展示页
- 更新本地预览文档，补充多种启动方式

### 2024-04-02
- 新增「数据主权」专页板块
- Hero 区域增加数据主权徽章
- 添加产品对比表格
- 更新 CTA 区域，突出本地优先特性
- 页脚增加数据主权标语
