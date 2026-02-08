# CloudMaster

CloudMaster是一个面向程序员、架构师和运维人员的一站式云厂商云产品对比工具，提供云产品文档查询、对比等功能。

## 功能特性

- **云厂商覆盖**：支持腾讯云、华为云、火山引擎、阿里云、AWS、Azure、Google Cloud七大云厂商
- **产品文档查询**：快速查询各云厂商的产品文档
- **产品类别导航**：按计算、存储、网络等类别组织产品
- **产品详情展示**：展示产品特性、文档列表等详细信息
- **响应式设计**：适配不同屏幕尺寸

## 技术栈

- **前端框架**：React 18 + TypeScript
- **UI组件库**：Ant Design
- **路由管理**：React Router
- **构建工具**：Vite
- **测试框架**：Jest + React Testing Library

## 项目结构

```
src/
├── components/          # 核心组件
│   ├── VendorSelector.tsx   # 云厂商选择组件
│   ├── CategoryNav.tsx      # 产品类别导航组件
│   ├── ProductList.tsx       # 产品列表组件
│   └── ProductDetail.tsx     # 产品详情组件
├── data/                # 云产品数据
│   └── cloudProducts.json   # 云产品和文档数据
├── pages/               # 页面组件
│   └── DocumentCenter.tsx   # 文档中心页面
├── services/            # 数据服务
│   └── dataService.ts       # 数据加载和处理服务
├── types/               # TypeScript类型定义
│   └── index.ts             # 类型定义文件
├── App.tsx              # 应用入口
└── main.tsx             # 渲染入口
```

## 安装和运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 运行测试

```bash
npm test
```

### 生成测试覆盖率报告

```bash
npm run test:coverage
```

## 使用说明

1. **选择云厂商**：在左侧选择要查看的云厂商
2. **浏览产品类别**：在中间导航栏选择产品类别
3. **查看产品列表**：在右侧查看该类别下的产品列表
4. **查看产品详情**：点击"查看文档"按钮查看产品详情
5. **访问产品文档**：点击文档链接访问官方文档

## 云厂商支持

- 腾讯云
- 华为云
- 火山引擎
- 阿里云
- AWS
- Azure
- Google Cloud

## 常见问题和解决方案

### 1. Vite构建问题

**问题**：运行`npm run dev`或`npm run build`时出现以下错误：
```
X [ERROR] Cannot read directory "../../..": Access is denied.
X [ERROR] Could not resolve "C:\Users\Allen\Documents\GitHub\CloudMaster\vite.config.ts"
```

**解决方案**：
- 确保Vite配置文件`vite.config.ts`存在且格式正确
- 检查项目目录的访问权限
- 尝试直接使用`npx serve public -p 3000`命令来运行应用

### 2. Jest测试配置问题

**问题**：运行`npm test`时出现类型错误，如`Property 'toBeInTheDocument' does not exist on type 'JestMatchers<HTMLElement>'`

**解决方案**：
- 确保已安装`@testing-library/jest-dom`：`npm install --save-dev @testing-library/jest-dom`
- 确保在`jest.setup.ts`中正确导入：`import '@testing-library/jest-dom'`
- 确保TypeScript配置中包含Jest类型：在`tsconfig.app.json`的`types`数组中添加`"jest"`
- 安装缺少的依赖：`npm install --save-dev identity-obj-proxy`

### 3. WSL相关错误

**问题**：出现`running wslexec: The service cannot be started, either because it is disabled or because it has no enabled devices associated with it`错误

**解决方案**：

1. **检查WSL服务配置**：
   ```powershell
   sc.exe qc WSLService
   ```
   确认`START_TYPE`字段是否为`DISABLED`

2. **修改服务启动类型为自动**：
   ```powershell
   sc.exe config WSLService start= auto
   ```

3. **验证启动类型已更改**：
   ```powershell
   sc.exe qc WSLService
   ```
   确认`START_TYPE`字段显示为`AUTO_START`或`AUTO`

4. **启动WSLService服务**：
   ```powershell
   sc.exe start WSLService
   ```

5. **检查服务状态**：
   ```powershell
   sc.exe query WSLService
   ```
   确认`STATE`字段显示为`RUNNING`

6. **验证WSL功能恢复正常**：
   ```powershell
   wsl --status
   ```

7. **检查已安装的WSL分发版**：
   ```powershell
   wsl --list
   ```

8. **启动Ubuntu**：
   ```powershell
   wsl -d Ubuntu
   # 或直接运行
   ubuntu
   ```

**注意**：如果出现`ERROR_ALREADY_EXISTS`错误，说明分发版已经存在，无需重新安装，直接启动即可。

## 许可证

MIT
