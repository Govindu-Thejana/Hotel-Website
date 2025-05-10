import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define explicit paths to React to avoid duplicate instances
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    force: true, // Force dependency optimization
  },
  // Fix for import_react3 not defined error
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
