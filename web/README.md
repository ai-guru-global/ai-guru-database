---
title: AI Guru Knowledge Base Frontend
category: web
tags: ["web", "frontend", "backend", "fullstack"]
summary: "A modern, high-performance knowledge base frontend built to CNCF open-source standards."
created: 2026-05-31
updated: 2026-05-31
---

# AI Guru Knowledge Base Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)](https://tailwindcss.com/)

A modern, high-performance knowledge base frontend built to CNCF open-source standards.

## 🚀 Features

- **📚 Knowledge Base**: Browse and search 290+ AI documentation files
- **🔍 Full-Text Search**: Powered by Fuse.js with real-time results
- **🌓 Dark Mode**: Automatic theme switching with system preference
- **📱 Responsive**: Mobile-first design, works on all devices
- **🌍 i18n**: Multi-language support (English, Chinese)
- **⚡ Performance**: Optimized with Vite, lazy loading, code splitting
- **♿ Accessible**: WCAG 2.1 AA compliant
- **🎨 Modern UI**: Built with shadcn/ui and Tailwind CSS

## 📁 Project Structure

```
web/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand state management
│   ├── services/            # API and data services
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   ├── i18n/                # Internationalization
│   └── styles/              # Global styles
├── console/                 # Management console sub-project
├── public/                  # Static assets
└── docs/                    # Project documentation
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3.4 |
| Components | shadcn/ui |
| State | Zustand |
| Data Fetching | React Query |
| Routing | React Router 6 |
| Search | Fuse.js |
| Markdown | React Markdown |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+ (recommended) or npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ai-guru-knowledge-base.git
cd ai-guru-knowledge-base/Web

# Install dependencies
pnpm install
# or: npm install

# Start development server (port 3055)
pnpm dev
# or: npm run dev
# or use the start script: ./start.sh (macOS/Linux) or start.bat (Windows)
```

**Access the application:**
- Main App: http://localhost:3055
- Console: http://localhost:3056 (run from `console/` directory)

### Build for Production

```bash
# Build for production
pnpm build

# Preview production build (port 3055)
pnpm preview
```

### Run Tests

```bash
# Run unit tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## 📖 Documentation

- [Architecture](./docs/architecture.md)
- [Contributing](./CONTRIBUTING.md)
- [Troubleshooting](./TROUBLESHOOTING.md) - Solutions for common issues
- [Changelog](./CHANGELOG.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the next-generation frontend tooling

## Related

- [[Web/.trae/documents/CloudMaster应用全面修复计划]] — CloudMaster应用全面修复计划 (共享: backend, frontend, fullstack, web)
- [[Web/CHANGELOG]] — Changelog (共享: backend, frontend, fullstack, web)
- [[Web/CONTRIBUTING]] — 贡献指南 (共享: backend, frontend, fullstack, web)
- [[Web/TROUBLESHOOTING]] — Troubleshooting Guide (共享: backend, frontend, fullstack, web)
- [[Web/docs/architecture]] — Architecture Documentation
- [[Web/README_for_dummy.md|README_for_dummy]]
