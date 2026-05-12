import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    preserveSymlinks: false,
  },
  server: {
    port: 5173,
    fs: {
      allow: [path.resolve(__dirname, ".."), path.resolve(__dirname, "./")],
    },
    proxy: {
      "/onboarding":         { target: "http://localhost:8000", changeOrigin: true },
      "/start/ai-onboarding": { target: "http://localhost:8000", changeOrigin: true },
      "/finsh/ai-onboarding": { target: "http://localhost:8000", changeOrigin: true },
    },
  },
});
