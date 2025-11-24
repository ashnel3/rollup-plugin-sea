import { resolve } from 'node:path'
import { constants, scripts, useTempdirs } from '../helper/workspace.helper'
import { rollup, watch, type RollupOptions } from 'rollup'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as seaUtil from '../../util'

// rollup plugin
import sea from '../../index'

describe('plugin', () => {
  const plugin = sea()
  const config: RollupOptions = {
    input: scripts.echo,
    plugins: [plugin],
  }
  const tempdir = useTempdirs()

  afterEach(() => vi.restoreAllMocks())

  it('should throw not is-node', async () => {
    vi.spyOn(seaUtil, 'isNode').mockReturnValue(false)
    // create rollup bundle
    const bundle = await rollup(config)
    const dir = await tempdir()
    // expect failure
    await expect(bundle.write({ dir })).rejects.toThrow('Invalid base node-js')
  })

  it('should throw is-sea', async () => {
    vi.spyOn(seaUtil, 'isSea').mockReturnValue(true)
    // create rollup bundle
    const bundle = await rollup(config)
    const dir = await tempdir()
    // expect failure
    await expect(bundle.write({ dir })).rejects.toThrow('Invalid base node-js')
  })

  it('should rollup', async () => {
    // create rollup bundle
    const bundle = await rollup(config)
    const dir = await tempdir()
    await bundle.write({ dir })
    await bundle.close()
    // verify output
    await expect(resolve(dir, 'echo-sea-config.json')).not.access()
    await expect(resolve(dir, 'echo-sea-prep.blob')).not.access()
    await expect(resolve(dir, seaUtil.extExe('echo'))).access(constants.F_OK | constants.X_OK)
  })

  it('should ignore watch', async () => {
    const dir = await tempdir()
    const warnings: Array<{ message: string }> = []

    // create rollup watcher
    const watcher = watch({
      ...config,
      output: { dir, format: 'cjs' },
      onwarn: (warn) => warnings.push(warn),
    })
    // wait for watched bundle
    await new Promise<void>((resolve, reject) => {
      watcher.on('event', (event) => {
        if (event.code === 'BUNDLE_END') {
          event.result?.close()
          resolve()
        } else if (event.code === 'ERROR') {
          reject(event.error)
        }
      })
    })
    await watcher.close()

    expect(warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining('Skipping SEA builds!'),
        }),
      ]),
    )
  })
})
