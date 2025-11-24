import $ from './spawn'
import { prefix } from './logs'
import type { Workspace } from '../types'

export const $signAdd = (workspace: Workspace) => {
  // TODO: custom signatures
  return $signAdHoc(workspace)
}

export const $signAdHoc = ({ context, name, paths }: Workspace) => {
  switch (process.platform) {
    case 'darwin': {
      context.warn(`${prefix(name, 'codesign')} WARNING, Using ad-hoc signature!`)
      return $('codesign', ['--sign', '-', '--force', paths.output], { context, name })
    }
    case 'win32': {
      context.warn(`${prefix(name, 'signtool')} WARNING, skipping code-signature!`)
    }
    default:
  }
}

export const $signRemove = async ({ context, name, paths }: Workspace) => {
  switch (process.platform) {
    case 'darwin': {
      await $('codesign', ['--remove-signature', paths.output], { context, name })
      break
    }
    case 'win32': {
      await $('signtool', ['remove', '/s', paths.output], { context, name })
      break
    }
    default:
  }
}

export const $signVerify = async (workspace: Workspace) => {
  // TODO: verify signatures
  throw {}
}
