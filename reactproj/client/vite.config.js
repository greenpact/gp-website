import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // This is the crucial line to add
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      external: ["react-router"],
      output: {
        globals: {
          "react-router": "ReactRouter",
        },
      },
    },
  },
});