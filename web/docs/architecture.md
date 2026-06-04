---
title: Architecture Documentation
category: web-docs
tags: ["web", "frontend", "backend", "fullstack"]
summary: "The AI Guru Knowledge Base Frontend is built with a modern, scalable architecture following CNCF best practices."
created: 2026-05-31
updated: 2026-05-31
---

# Architecture Documentation

## Overview

The AI Guru Knowledge Base Frontend is built with a modern, scalable architecture following CNCF best practices.

## Project Structure

```
web/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Button, Card, Input)
│   │   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   │   └── search/         # Search-specific components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand state management
│   ├── services/           # API and data services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── i18n/               # Internationalization
│   └── styles/             # Global styles
├── console/                # Management console sub-project
│   └── src/                # Console source code
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Technology Stack

### Core
- **React 18**: UI library with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool with HMR

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **CSS Variables**: Theme support (light/dark mode)

### State Management
- **Zustand**: Lightweight state management
- **React Query**: Server state management

### Routing
- **React Router 6**: Declarative routing

### Content
- **React Markdown**: Markdown rendering
- **Fuse.js**: Client-side fuzzy search

## Key Features

### 1. Dark Mode Support
- System preference detection
- Manual toggle
- CSS variable-based theming

### 2. Full-Text Search
- Fuse.js integration
- Real-time search results
- Highlighting support

### 3. Responsive Design
- Mobile-first approach
- Breakpoint system
- Touch-friendly interfaces

### 4. Performance
- Code splitting
- Lazy loading
- Optimized builds

## Data Flow

```
User Action
    ↓
Component Event
    ↓
Hook/Store Update
    ↓
React Query (if server data)
    ↓
UI Re-render
```

## Build Optimization

### Code Splitting
```javascript
// Routes are lazy-loaded
const DocsPage = lazy(() => import('./pages/docs'));
```

### Chunk Strategy
- Vendor chunks (React, Router)
- Feature chunks (Markdown, Search)
- Route-based chunks

## Development Guidelines

### Component Structure
```typescript
// Component with proper TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementation
};
```

### State Management Pattern
```typescript
// Zustand store
interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

## Deployment

### Build Process
```bash
# Production build
pnpm build

# Analyze bundle
pnpm build:analyze
```

### Environment Variables
```env
VITE_API_URL=https://api.example.com
VITE_ENABLE_ANALYTICS=true
```

## Console Architecture

The Console is a separate sub-project for content management:

### Features
- Dashboard with analytics
- Content management
- User management
- Settings configuration

### Tech Stack
- Same as main web app
- Recharts for data visualization
- TanStack Table for data tables

## Future Enhancements

1. **SSR**: Next.js migration for SEO
2. **PWA**: Service worker for offline access
3. **i18n**: Full internationalization
4. **Testing**: E2E tests with Playwright

## Related

- [[Web/.trae/documents/CloudMaster应用全面修复计划]] — CloudMaster应用全面修复计划 (共享: backend, frontend, fullstack, web)
- [[Web/CHANGELOG]] — Changelog (共享: backend, frontend, fullstack, web)
- [[Web/CONTRIBUTING]] — 贡献指南 (共享: backend, frontend, fullstack, web)
- [[Web/README]] — AI Guru Knowledge Base Frontend (共享: backend, frontend, fullstack, web)
