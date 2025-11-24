import { NAME, VERSION } from './const'
import { entryWorkspace } from './workspace'
import { dirname, resolve } from 'node:path'
import { isNode, isSea, prefix } from './util'
import type { OutputChunk, Plugin } from 'rollup'
import type { PluginOptions } from './types'

/**
 * NodeJS SEA plugin (Single executable applications).
 * > **Warning:** Node-Sea is experimental!
 * @see https://nodejs.org/api/single-executable-applications.html
 * @param options plugin options
 * @returns rollup plugin
 */
export const sea = (options: PluginOptions = {}): Plugin<undefined> => ({
  name: NAME,
  version: VERSION,
  writeBundle: {
    order: 'post',
    sequential: true,
    async handler(output, bundle) {
      const entries = Object.values(bundle).filter(
        (m): m is OutputChunk => m.type === 'chunk' && m.isEntry,
      )
      const outdir = output.dir
        ? output.file
          ? dirname(output.file)
          : output.dir
        : resolve('dist')

      // check nodejs
      if (isSea() || !isNode()) {
        return this.error({
          name: 'expected_node',
          message: `Invalid base node-js "${process.execPath}"!`,
        })
      }
      // skip empty or watch builds
      if (this.meta.watchMode) {
        return this.warn(`${prefix('main', 'all')} Skipping SEA builds!`)
      } else {
        this.info(`${prefix('main', 'all')} 📦 Building ${entries.length} executable(s)!`)
      }
      // build workspace per entry
      await Promise.all(
        entries.map(async (entry) => {
          const workspace = entryWorkspace(this, entry, outdir, options)
          try {
            await workspace.build()
          } finally {
            await workspace.finalize()
          }
        }),
      )
      // finished
      this.info(`${prefix('main', 'all')} 🚀 Finished!`)
    },
  },
})

export default sea
