import { chmod, copyFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { $postject, $seablob, $signAdd, $signRemove, extExe, prefix } from './util'
import type { OutputChunk } from 'rollup'
import type { WorkspaceContext, Workspace, PluginOptions } from './types'

/**
 * Create minimal default context (works without vite or rollup).
 * @returns plugin context
 */
export const defaultContext = (): WorkspaceContext => ({
  error: (error) => {
    throw error
  },
  debug: console.debug,
  info: console.log,
  warn: console.error,
})

/**
 * create workspace for build-system entry
 * @param context plugin context
 * @param entry   entry chunk
 * @param outdir  output directory
 * @param options plugin options
 * @returns       workspace
 */
export const entryWorkspace = (
  context: WorkspaceContext,
  entry: OutputChunk,
  outdir?: string,
  options?: PluginOptions,
) => {
  // TODO: check for file / package imports
  return createWorkspace(context, entry.fileName, entry.name, outdir, options)
}

/**
 * Create plugin workspace
 * @param context  plugin context
 * @param options  plugin options
 * @param name     entry name
 * @param filename entry path
 * @param outdir   root output directory
 * @returns        plugin workspace
 */
export const createWorkspace = (
  context: WorkspaceContext,
  filename: string,
  name: string,
  outdir: string = process.cwd(),
  options: PluginOptions = {},
): Workspace => ({
  name,
  context,
  options,
  config: {
    disableExperimentalSEAWarning: true,
    main: resolve(outdir, filename),
    output: resolve(outdir, `${name}-sea-prep.blob`),
    // merge config overrides
    ...options.config,
  },
  paths: {
    filename,
    outdir,
    output: resolve(outdir, extExe(name)),
    config: resolve(outdir, `${name}-sea-config.json`),
  },
  async build() {
    context.info(`${prefix(name)} Preparing workspace...`)
    // 1. copy nodejs executable
    await Promise.resolve()
      .then(async () => await copyFile(process.execPath, this.paths.output))
      .then(async () => await chmod(this.paths.output, 0o755))
      .catch((cause) =>
        context.error({ message: `Failed to copy node "${process.execPath}"!`, cause }),
      )

    // 2. prep code blob & executable
    await Promise.all([$signRemove(this), $seablob(this)])
    // 3. inject code blob
    await $postject(this)
    // 4. add finished signature
    await $signAdd(this)
    // done!
    context.info(`${prefix(name)} Generated executable (${this.paths.output})`)
    return this
  },
  async finalize() {
    // clean temporary files
    await Promise.all([
      rm(this.paths.config, { force: true }),
      rm(this.config.output, { force: true }),
    ])
    return this
  },
})

export { $postject, $seablob, $signAdHoc, $signAdd, $signRemove } from './util'
export default createWorkspace
