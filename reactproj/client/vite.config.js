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
    // This is the key part of the fix that you need to add.
    // It forces the build to use the production version of react-router.
    rollupOptions: {
      external: ["react-router"],
      output: {
        globals: {
          "react-router": "ReactRouter",
        },
      },
    },
  },
  resolve: {
    alias: {
      "react-router-dom": "react-router-dom/dist/main.js",
      "react-router": "react-router/dist/main.js",
    },
  },
});