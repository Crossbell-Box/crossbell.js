import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'
import UnoCSS from 'unocss/vite'

export default defineConfig(async ({ mode }) => {
  const env = await loadEnv(mode, process.cwd(), '')
  return {
    resolve: {
      alias: {
        'crossbell.js': path.resolve(__dirname, '../../src/index.ts'),
      },
    },
    define: {
      'globalThis.process.env.CROSSBELL_RPC_ADDRESS': JSON.stringify(
        env.CROSSBELL_RPC_ADDRESS,
      ),
    },
    plugins: [Vue(), nodePolyfills({ protocolImports: true }), UnoCSS()],
  }
})
