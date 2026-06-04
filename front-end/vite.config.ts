import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        // target: "http://playmap.xn--3e0b707e/api",
        target: "http://localhost:80/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/public": {
        target: "http://playmap.xn--3e0b707e/public",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/public/, ""),
      },
    },
  },
});
