import { defineConfig, Options } from 'tsup'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

const commonConfig: Options = {
  entry: ['./src/index.ts'],
  outDir: 'dist',
  clean: true,
  sourcemap: true,
}

export default defineConfig((options) => [
  {
    ...commonConfig,
    format: ['cjs', 'esm'],
    minify: !options.watch,
    platform: 'node',
    dts: options.dts,
    target: 'node14',
  },
  {
    ...commonConfig,
    format: ['iife'],
    globalName: 'Crossbell',
    minify: !options.watch,
    platform: 'browser',
    dts: false,
    target: 'es2018',
    esbuildPlugins: [NodeModulesPolyfillPlugin()],
  },
])
