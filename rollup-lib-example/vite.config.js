import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    include: ["rollup-code-splitting-lib-example"],
  },
  build: {
    commonjsOptions: [/node_modules/],
  },
});
