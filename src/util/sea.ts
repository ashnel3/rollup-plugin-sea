import { SEA_SENTINEL_FUSE } from '../const'

import $ from './spawn'
import { readFile, writeFile } from 'node:fs/promises'
import { prefix } from './logs'
import type { Workspace } from '../types'

// @ts-ignore - postject types may not be included
import { inject } from 'postject'

/**
 * Check if running in node-js
 * @private
 * @returns is node-js
 */
export const isNode = () => typeof process.versions?.node !== 'undefined'

/**
 * Check if running as sea executable
 * @private
 * @returns is node-sea
 */
export const isSea = () => {
  try {
    return process.getBuiltinModule?.('node:sea')?.isSea() || false
  } catch {
    return false
  }
}

/**
 * Generate code blob. `$ node --experimental-sea-config sea-config.json`
 * @param workspace sea workspace
 */
export const $seablob = async ({ context, config, paths, name }: Workspace) => {
  await writeFile(paths.config, JSON.stringify(config))
  await $(process.execPath, ['--experimental-sea-config', paths.config], {
    commandName: 'node',
    context,
    name,
  })
}

/**
 * Inject code blob.
 * @see https://github.com/nodejs/postject
 * @param workspace sea workspace
 */
export const $postject = async ({ context, config, paths, name }: Workspace) => {
  context.info(`${prefix(name, 'postject')} starting injection for ${paths.output}...`)
  try {
    return await inject(paths.output, 'NODE_SEA_BLOB', await readFile(config.output), {
      sentinelFuse: SEA_SENTINEL_FUSE,
      // macos macho data segment
      machoSegmentName: process.platform === 'darwin' ? 'NODE_SEA' : undefined,
    })
  } catch (cause) {
    return context.error({
      cause,
      name: 'expected_postject',
      message: 'failed to inject resource!',
    })
  }
}
