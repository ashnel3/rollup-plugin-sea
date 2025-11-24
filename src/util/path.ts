import { basename, extname } from 'node:path'

/**
 * normalize executable extension
 * @private
 * @param filename filename
 * @returns filename
 */
export const extExe = (filename: string): string => {
  if (process.platform === 'win32' && !filename.endsWith('.exe')) {
    return filename + '.exe'
  }
  return filename
}

/**
 * remove file extension
 * @private
 * @param filename
 * @returns
 */
export const extNone = (filename: string) => {
  return basename(filename, extname(filename))
}
