import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import process from "node:process";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_BUPA_API_BASE_URL } = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    test: {
      environment: "jsdom",
    },
    server: {
      proxy: {
        "/api": {
          target:
            VITE_BUPA_API_BASE_URL || "https://digitalcodingtest.bupa.com.au",
          changeOrigin: true,
        },
      },
    },
  };
});
