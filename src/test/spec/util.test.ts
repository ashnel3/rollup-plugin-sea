import { afterEach, describe, expect, it, vi } from 'vitest'
import { extExe, $seablob } from '../../util'
import { scripts, useWorkspace } from '../helper/workspace.helper'

describe('extExe', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('should normalize windows executables', () => {
    vi.stubGlobal('process', { ...process, platform: 'win32' })
    expect(extExe('node')).toBe('node.exe')
  })

  it('should normalize unix executables', () => {
    vi.stubGlobal('process', { ...process, platform: 'linux' })
    expect(extExe('node')).toBe('node')
    expect(extExe('node.exe')).toBe('node.exe')
  })
})

describe('$seablob', () => {
  const workspace = useWorkspace(scripts.echo)

  it('should produce seablob', async () => {
    await expect($seablob(workspace)).resolves.toBeUndefined()
    await expect(workspace.config.output).access()
  })
})
