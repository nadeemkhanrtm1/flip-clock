import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from 'vite-plugin-dts'
import path from 'path';

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "npm-library",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      // Output is used for mapping purpose
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    emptyOutDir: true,
    sourcemap: false,
    outDir: 'dist',
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  }
});
