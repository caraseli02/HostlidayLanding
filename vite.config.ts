import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {},
  lint: {
    options: {
      typeAware: false,
      typeCheck: false
    }
  }
});
