import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    environment: "jsdom",
  },
  server: {
    proxy: {
      "/api": {
        target: "https://digitalcodingtest.bupa.com.au",
        changeOrigin: true,
      },
    },
  },
});
