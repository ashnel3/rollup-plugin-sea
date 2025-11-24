import $ from './spawn'
import { prefix } from './logs'
import type { Workspace } from '../types'

/**
 * add code signature
 * @param workspace plugin workspace
 */
export const $signAdd = (workspace: Workspace) => {
  // TODO: custom signatures
  return $signAdHoc(workspace)
}

/**
 * add development signature
 * @param workspace plugin workspace
 */
export const $signAdHoc = async ({ context, name, paths }: Workspace) => {
  switch (process.platform) {
    case 'darwin': {
      context.warn(`${prefix(name, 'codesign')} WARNING, Using ad-hoc signature!`)
      return await $('codesign', ['--sign', '-', '--force', paths.output], { context, name })
    }
    case 'win32':
      return context.warn(`${prefix(name, 'signtool')} WARNING, skipping code-signature!`)
    default:
  }
}

/**
 * remove signature
 * @param workspace plugin workspace
 */
export const $signRemove = async ({ context, name, paths }: Workspace) => {
  switch (process.platform) {
    case 'darwin':
      return await $('codesign', ['--remove-signature', paths.output], { context, name })
    case 'win32':
      return await $('signtool', ['remove', '/s', paths.output], { context, name })
    default:
  }
}

export const $signVerify = async (workspace: Workspace) => {
  // TODO: verify signatures
  throw {}
}
