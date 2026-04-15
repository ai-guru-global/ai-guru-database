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

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    serveDocsContent(),
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
