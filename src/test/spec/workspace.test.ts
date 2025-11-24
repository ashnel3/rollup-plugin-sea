import spawn from 'nano-spawn'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { constants, scripts, useWorkspace } from '../helper/workspace.helper'

describe('workspace', () => {
  const workspace = useWorkspace(scripts.echo)

  afterEach(() => vi.restoreAllMocks())

  it('should throw failed to copy', async () => {
    vi.spyOn(workspace.paths, 'output', 'get').mockReturnValue('/x/y/z')
    await expect(workspace.build()).rejects.toThrow('Failed to copy')
  })

  it.sequential('should build', async () => {
    await expect(workspace.build()).resolves.toBe(workspace)
    // verify workspace is valid
    await expect(workspace.paths.config).access()
    await expect(workspace.paths.config).jsonToEqual(workspace.config)
    // verify sea-blob
    await expect(workspace.config.output).access()
  })

  it.sequential('should finalize', async () => {
    await expect(workspace.finalize()).resolves.toBe(workspace)
    // temporary files should be removed
    await expect(workspace.paths.config).not.access()
    await expect(workspace.config.output).not.access()
    // verify executable
    await expect(workspace.paths.output).access(constants.F_OK | constants.X_OK)
  })

  it.sequential('should execute', async () => {
    const arg = 'testing'
    const child = spawn(workspace.paths.output, [arg])
    await expect(child).resolves.toMatchObject({
      stderr: '',
      stdout: arg,
    })
  })
})
