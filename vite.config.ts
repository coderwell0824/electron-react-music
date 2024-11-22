import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react"
import * as path from 'path';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron/renderer';
import polyfillExports from 'vite-plugin-electron/polyfill-exports';
import alias from "@rollup/plugin-alias";


export default defineConfig({
  server: {
    port: 4005,
  },
  mode: 'development', // development | production
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/index.ts',
      },
      preload: {
        // Must be use absolute path, this is the limit of rollup
        input: path.join(__dirname, 'electron/preload.ts'),
      },
    }),
    electronRenderer(),
    polyfillExports(),
    alias()
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, 'src/assets/base.less')}";`
      }
    },
  },
  // 配置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    emptyOutDir: false, // 必须配置，否则electron相关文件将不会生成build后的文件
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
});
