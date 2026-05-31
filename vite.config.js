import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
      "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
      "@sirat/ui": fileURLToPath(new URL("./src/components/ui/index.js", import.meta.url)),
      "@sirat/api": fileURLToPath(new URL("./src/api/index.js", import.meta.url))
    }
  }
});
