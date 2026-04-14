import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
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
      // Proxy /docs-content/ to serve markdown files from project root
      "/docs-content": {
        target: "http://localhost:4567",
        rewrite: (p) => p.replace(/^\/docs-content/, "/..")
      },
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
