import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      dts: true,
      format: 'esm',
    },
  ],
  output: {
    minify: true,
    sourceMap: {
      css: false,
      js: 'source-map',
    },
  },
  source: {
    entry: {
      'cli': './src/cli.ts',
      'no-access': './src/no-access.ts',
    },
    tsconfigPath: './tsconfig.build.json',
  },
})
