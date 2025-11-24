import type { LoggingFunction, PluginContext } from 'rollup'

/**
 * node-js sea config
 * @see https://nodejs.org/api/single-executable-applications.html#generating-single-executable-preparation-blobs
 */
export interface SeaConfig {
  main: string
  output: string
  assets?: Record<string, string>
  disableExperimentalSEAWarning?: boolean
  useSnapshot?: boolean
  useCodeCache?: boolean
}

/** sea plugin options */
export interface PluginOptions {
  /** sea config overrides (sea-config.json) */
  config?: Omit<SeaConfig, 'main' | 'output'>
}

/**
 * Minimal required plugin context.
 * @see {@link PluginContext} rollup plugin context
 */
export interface WorkspaceContext {
  error: PluginContext['error']
  debug: LoggingFunction
  info: LoggingFunction
  warn: LoggingFunction
}

/** Sea workspace paths */
export interface WorkspacePaths {
  /** entry filename */
  filename: string
  /** path to sea-config */
  config: string
  /** path to output directory */
  outdir: string
  /** path to output executable */
  output: string
}

/** SEA workspace */
export interface Workspace {
  /** entry name */
  name: string
  /** plugin options */
  options: PluginOptions
  /** plugin context */
  context: WorkspaceContext
  /** sea configuration (sea-config.json) */
  config: SeaConfig
  /** workspace paths */
  paths: WorkspacePaths
  /** build workspace */
  build(): Promise<Workspace>
  /** build finalization (should always be run) */
  finalize(): Promise<Workspace>
}
