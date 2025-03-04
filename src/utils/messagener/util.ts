import type { BinDownloadOptions } from 'lanhu-image-downloader'

const defaultMapFun = (val: any) => `${val}`.trim()

const envMapConfig: Record<keyof BinDownloadOptions, (val: any) => string> = {
  configFilePath: defaultMapFun,
  sectorName: defaultMapFun,
  type: defaultMapFun,
  targetFolder: defaultMapFun,
  downloadScale: defaultMapFun,
  resizeScale: defaultMapFun,
  enableTranslation(val: string) {
    return `${+val || 0}`
  },
  teamId: defaultMapFun,
  projectId: defaultMapFun,
  imageId: defaultMapFun,
}

export function optionsToEnv(options: BinDownloadOptions) {
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(options)) {
    const transform = envMapConfig[key as keyof BinDownloadOptions]
    const tValue = transform(value)
    result[key] = tValue
  }
  return result
}
