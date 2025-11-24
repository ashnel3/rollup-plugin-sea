declare module 'postject' {
  export interface PostjectOptions {
    machoSegmentName?: string
    overwrite?: boolean
    sentinelFuse?: string
  }

  export function inject(
    filename: string,
    resourceName: string,
    resourceData: Buffer,
    options?: PostjectOptions,
  ): Promise<void>
}
