import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync } from "fs";

// Custom plugin to copy sw.js to root after build
function copyServiceWorkerPlugin() {
  return {
    name: "copy-service-worker",
    closeBundle() {
      try {
        const source = resolve(__dirname, "src/public/sw.js");
        const dest = resolve(__dirname, "dist/sw.js");
        copyFileSync(source, dest);
        console.log("✅ Service Worker copied to dist root");
      } catch (error) {
        console.error("❌ Failed to copy Service Worker:", error);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "src", "public"),
  base: process.env.NODE_ENV === "production" ? "/story-map-app/" : "/",
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src", "index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [copyServiceWorkerPlugin()],
});
