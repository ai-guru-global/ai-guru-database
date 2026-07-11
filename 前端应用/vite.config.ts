import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
function serveDocsContent() {
  const projectRoot = path.resolve(__dirname, "..");
  return {
    name: "serve-docs-content",
    configureServer(server: { middlewares: { use: Function } }) {
      server.middlewares.use((req: any, res: any, next: Function) => {
        if (req.url?.startsWith("/docs-content/")) {
          const relativePath = decodeURIComponent(
            req.url.replace("/docs-content/", "")
          );
          const fullPath = path.resolve(projectRoot, relativePath);
          // Security: ensure the resolved path is within project root
          if (!fullPath.startsWith(projectRoot)) {
            res.statusCode = 403;
            res.end("Forbidden");
            return;
          }
          if (fs.existsSync(fullPath)) {
            res.setHeader("Content-Type", "text/markdown; charset=utf-8");
            res.end(fs.readFileSync(fullPath, "utf-8"));
            return;
          }
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        next();
      });
    },
  };
}

function serveMkDocs() {
  const mkdocsDir = path.resolve(__dirname, "public/mkdocs");

  const contentTypes: Record<string, string> = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
  };

  function serveFile(filePath: string, res: any) {
    const ext = path.extname(filePath);
    res.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
    res.end(fs.readFileSync(filePath));
  }

  function resolveMkDocsPath(urlPath: string): string | null {
    // Map root-level MkDocs paths into public/mkdocs/
    const mkdocsPrefixes = ["/assets/", "/search/"];
    for (const prefix of mkdocsPrefixes) {
      if (urlPath.startsWith(prefix)) {
        const relativePath = decodeURIComponent(urlPath.slice(1)); // remove leading /
        return path.join(mkdocsDir, relativePath);
      }
    }
    if (urlPath.startsWith("/mkdocs/")) {
      const relativePath = decodeURIComponent(urlPath.replace("/mkdocs/", ""));
      return path.join(mkdocsDir, relativePath);
    }
    return null;
  }

  return {
    name: "serve-mkdocs",
    configureServer(server: { middlewares: { use: Function } }) {
      server.middlewares.use((req: any, res: any, next: Function) => {
        // Fast-path: redirect /docs → /mkdocs/ without loading React SPA
        if (req.url === "/docs" || req.url === "/docs/") {
          res.statusCode = 302;
          res.setHeader("Location", "/mkdocs/");
          res.end();
          return;
        }
        const filePath = resolveMkDocsPath(req.url || "");
        if (!filePath) {
          next();
          return;
        }
        // Security: ensure the resolved path is within mkdocsDir
        if (!filePath.startsWith(mkdocsDir)) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }
        // If path is a directory, try index.html
        let target = filePath;
        if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
          target = path.join(target, "index.html");
        }
        if (fs.existsSync(target) && fs.statSync(target).isFile()) {
          serveFile(target, res);
          return;
        }
        res.statusCode = 404;
        res.end("Not found");
        return;
      });
    },
  };
}

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig(({ mode }) => ({
  base: isGitHubPages ? "/ai-guru-database/" : "/",
  plugins: [
    react(),
    serveDocsContent(),
    serveMkDocs(),
    mode === "analyze" &&
      visualizer({
        open: true,
        filename: "dist/stats.html",
      }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          query: ["@tanstack/react-query"],
          markdown: ["react-markdown", "remark-gfm", "rehype-highlight"],
          fuse: ["fuse.js"],
        },
      },
    },
    sourcemap: true,
  },
  server: {
    port: 4567,
    host: "0.0.0.0",
    strictPort: true,
    open: true,
    fs: {
      // Allow serving files from project root (parent of Web/)
      allow: [".."],
    },
    proxy: {
      // Proxy K8s eval API to the eval backend server
      "/api/k8s-eval": {
        target: "http://localhost:3100",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4567,
    host: "0.0.0.0",
    strictPort: true,
  },
}));
