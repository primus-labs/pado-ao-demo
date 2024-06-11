import { defineConfig, loadEnv } from "vite";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  const env = loadEnv(mode, process.cwd());
  console.log(1);
  const processEnvValues = {
    "process.browser": true,
    "process.env": Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      };
    }, {}),
  };
  console.log(3);
  return {
    define: Object.assign(processEnvValues, { global: {} }),
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
