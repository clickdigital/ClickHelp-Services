import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import * as path from "node:path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true, // Ensures index.d.ts is created
      cleanVueFileName: true, // Cleans Vue import names
      copyDtsFiles: true, // ✅ Ensures all .d.ts files are included
      outDir: "dist", // ✅ Forces all .d.ts files into dist/
      include: ["src/**/*.ts",  "src/**/*.vue"], // ✅ Ensures all TypeScript files are processed
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts"], // Exclude test files
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(process.cwd(), "src/index.ts"), // Correct entry point
      name: "ClickHelpServices",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ["vue", "pinia"], // Prevent bundling Vue/Pinia
      output: {
        globals: {
          vue: "Vue",
          pinia: "Pinia",
        },
      },
    },
  },
});