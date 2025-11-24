/**
 * log prefix
 * @private
 * @param name entry name
 * @param step build step
 * @returns prefix
 */
export const prefix = (name: string, step = 'main') => `(${name}|${step}):`
