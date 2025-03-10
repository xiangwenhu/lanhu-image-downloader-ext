import type { BinDownloadOptions } from 'lanhu-image-downloader/dist/downloadBy.type'

const defaultMapFun = (val: any) => `${val}`.trim()

const envMapConfig: Partial<Record<keyof BinDownloadOptions, (val: any) => string>> = {
  enableTranslation(val: string) {
    return `${+val || 0}`
  },
}

export function optionsToEnv(options: BinDownloadOptions) {
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(options)) {
    const transform = envMapConfig[key as keyof BinDownloadOptions] || defaultMapFun
    const tValue = transform(value)
    result[key] = tValue
  }
  return result
}
