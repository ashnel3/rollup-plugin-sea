import spawn, { type Options as SpawnOptions } from 'nano-spawn'
import { prefix } from './logs'
import type { WorkspaceContext } from '../types'

/**
 * Spawner options
 * @private
 */
export type SpawnerOptions = SpawnOptions & {
  commandName?: string
  name: string
  context: WorkspaceContext
}

/**
 * Spawn handled process
 * @private
 * @param command process command
 * @param args    process arguments
 * @param options spawner options
 */
export const $ = async (
  command: string,
  args: string[],
  { commandName = command, context, name, ...options }: SpawnerOptions,
): Promise<void> => {
  try {
    const subprocess = spawn(command, args, options)
    for await (const line of subprocess) {
      context.info(`${prefix(name, commandName)} ${line}`)
    }
    await subprocess
  } catch (cause) {
    return context.error({
      message: `${prefix(name, commandName)} command failed!\n\n\n${cause}`,
      cause,
    })
  }
}

export default $
