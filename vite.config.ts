// https://vite.dev/config

import { defineConfig } from 'vitest/config'

// plugins
import dts from 'vite-plugin-dts'

// environment
export const define = () => {
  const { npm_package_name = 'sea', npm_package_version = '0.0.0' } = process.env
  return {
    'import.meta.env.npm_package_name': JSON.stringify(npm_package_name),
    'import.meta.env.npm_package_version': JSON.stringify(npm_package_version),
  }
}

// config
export default defineConfig({
  define: define(),
  build: {
    lib: {
      entry: {
        index: './src/plugin.ts',
        workspace: './src/workspace.ts',
      },
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      output: { exports: 'named' },
      treeshake: {
        moduleSideEffects: false,
      },
    },
    ssr: true,
  },
  plugins: [
    dts({
      compilerOptions: {
        skipLibCheck: true,
      },
      copyDtsFiles: true,
      exclude: ['src/bin', 'src/build', 'src/test', 'src/const.ts', 'src/postject.d.ts'],
      tsconfigPath: './tsconfig.json',
    }),
  ],
  test: {
    include: ['./src/test/spec/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
    silent: !!process.env.CI,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/**/*.ts'],
      exclude: ['src/test/**', 'src/build/**', 'src/bin/**', 'src/**/*.d.ts'],
    },
    testTimeout: 30_000,
  },
})
