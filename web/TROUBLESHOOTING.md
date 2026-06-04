---
title: Troubleshooting Guide
category: web
tags: ["web", "frontend", "backend", "fullstack"]
summary: "**Solution A: Install Dependencies**"
created: 2026-05-31
updated: 2026-05-31
---

# Troubleshooting Guide

## Common Issues

### 1. Cannot access http://localhost:3055

#### Problem: Page not loading or connection refused

**Solution A: Install Dependencies**
```bash
# If you haven't installed dependencies yet:
npm install

# Or using pnpm (recommended)
pnpm install
```

**Solution B: Use the Start Script**
```bash
# On macOS/Linux:
./start.sh

# On Windows:
start.bat
```

**Solution C: Manual Start**
```bash
# 1. Clean old cache
rm -rf .parcel-cache

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

#### Problem: Port 3055 is already in use

**Solution: Kill the process using port 3055**

On macOS/Linux:
```bash
# Find the process
lsof -i :3055

# Kill it (replace <PID> with the actual process ID)
kill -9 <PID>
```

On Windows:
```cmd
# Find and kill the process
netstat -ano | findstr :3055
taskkill /PID <PID> /F
```

Or change the port in `vite.config.ts`:
```javascript
server: {
  port: 3056,  // Change to another port
  open: true,
},
```

### 2. Build Errors

#### Error: Cannot find module '@radix-ui/react-slot'

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Error: Cannot find module '@/utils/cn'

**Solution:**
Check that the file `src/utils/cn.ts` exists. If not:
```bash
# Create the file
mkdir -p src/utils
cat > src/utils/cn.ts << 'EOF'
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF
```

### 3. TypeScript Errors

#### Error: Cannot find type definition file

**Solution:**
```bash
# Install type definitions
npm install --save-dev @types/react @types/react-dom
```

### 4. Hot Module Replacement (HMR) Not Working

**Solution:**
1. Check your editor isn't locking files
2. Try using WSL2 if on Windows
3. Use the SWC plugin (already configured)

### 5. Browser Shows Blank Page

**Check:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests

**Common fixes:**
```bash
# Clear browser cache
# Hard reload: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

# Rebuild
npm run build
npm run preview
```

## Verification Steps

After starting the server, verify:

1. **Terminal shows:**
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3055/
   ➜  press h + enter to show help
   ```

2. **Browser shows:**
   - AI Guru Knowledge Base homepage
   - No console errors

## Still Having Issues?

1. Check Node.js version:
   ```bash
   node --version  # Should be >= 18.0.0
   ```

2. Check npm version:
   ```bash
   npm --version  # Should be >= 9.0.0
   ```

3. Reinstall everything:
   ```bash
   rm -rf node_modules .parcel-cache dist
   npm install
   npm run dev
   ```

4. Check the logs:
   ```bash
   npm run dev 2>&1 | tee dev.log
   ```

## Related

- [[Web/.trae/documents/CloudMaster应用全面修复计划]] — CloudMaster应用全面修复计划 (共享: backend, frontend, fullstack, web)
- [[Web/CHANGELOG]] — Changelog (共享: backend, frontend, fullstack, web)
- [[Web/CONTRIBUTING]] — 贡献指南 (共享: backend, frontend, fullstack, web)
- [[Web/README]] — AI Guru Knowledge Base Frontend (共享: backend, frontend, fullstack, web)
