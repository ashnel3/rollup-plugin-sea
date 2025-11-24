import fs from 'node:fs/promises'
import os from 'node:os'
import { basename, resolve } from 'node:path'
import { beforeAll, afterAll, vi } from 'vitest'
import { createWorkspace } from '../../workspace'
import { extNone } from '../../util'
import type { Workspace, WorkspaceContext } from '../../types'

/** testing plugin context */
export const context: WorkspaceContext = {
  debug: vi.fn(),
  error: vi.fn((error) => {
    throw error
  }),
  info: vi.fn(),
  warn: vi.fn(),
}

/** testing scripts */
export const scripts = {
  echo: resolve(import.meta.dirname, '../static/echo.js'),
}

/**
 * tempdir helper
 * @returns tempdir path getter
 */
export const useTempdirs = () => {
  const tempdirs: string[] = []

  afterAll(async () => {
    // remove tempdirs
    await Promise.all(
      tempdirs.map(async (dir) => await fs.rm(dir, { recursive: true, force: true })),
    )
  })
  return async () => {
    const dir = await fs.mkdtemp(resolve(os.tmpdir(), 'rollup-plugin-sea-test-'))
    tempdirs.push(dir)
    return dir
  }
}

/**
 * workspace helper
 * @param filename script file
 * @returns        workspace
 */
export const useWorkspace = (path: string) => {
  const workspace = {} as Workspace
  const tempdir = useTempdirs()

  beforeAll(async () => {
    const outdir = await tempdir()
    const filepath = resolve(import.meta.dirname, '../', path)
    const filename = basename(filepath)
    const destpath = resolve(outdir, filename)
    // copy script
    await fs.copyFile(filepath, destpath)
    // create workspace
    Object.assign(workspace, createWorkspace(context, filename, extNone(filename), outdir))
  })

  return workspace
}

export { constants } from 'node:fs/promises'
