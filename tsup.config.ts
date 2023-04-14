import { type Options, defineConfig } from 'tsup'

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
    target: 'node16',
  },
  {
    ...commonConfig,
    format: ['iife'],
    globalName: 'Crossbell',
    minify: !options.watch,
    platform: 'browser',
    dts: false,
    target: 'es2020',
    esbuildPlugins: [],
  },
])
