import { fileURLToPath, URL } from "node:url";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/portfolio-lky/",
  plugins: [viteReact()],
  server: {
    port: 8820,
    host: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
