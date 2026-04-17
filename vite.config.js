import { defineConfig } from "vite-plus";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        enhancer: resolve(__dirname, "enhancer.html"),
      },
    },
  },
});
