import { defineConfig } from "vite-plus";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        enhancer: resolve(__dirname, "enhancer.html"),
      },
    },
  },
});
