import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
    // We are keeping the rollupOptions as they can still be helpful
    // but have removed the problematic 'alias' section.
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