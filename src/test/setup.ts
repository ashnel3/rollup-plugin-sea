import fs from 'node:fs/promises'
import { expect } from 'vitest'

interface CustomMatchers<R = unknown> {
  access(mode?: number): Promise<R>
  jsonToEqual(expected: any): Promise<R>
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  async access(path: string, mode?: number) {
    try {
      await fs.access(path, mode)
      return {
        pass: true,
        message: () => `expected '${path}' not to exist`,
      }
    } catch {
      return {
        pass: false,
        message: () => `expected '${path}' to exist`,
      }
    }
  },
  async jsonToEqual(path: string, expected: any) {
    try {
      const data = JSON.parse((await fs.readFile(path)).toString())
      expect(data).toEqual(expected)
      return {
        pass: true,
        message: () => `expected json file '${path}'`,
      }
    } catch (error) {
      return {
        pass: false,
        message: () => `expected json file '${path}'`,
      }
    }
  },
})
