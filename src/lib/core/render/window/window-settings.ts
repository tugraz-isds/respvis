type DownloadStyleType = 'inline' | 'embedded'
type ZoomType = 'geometric' | 'semantic' | 'fish-eye' | 'cartesian'
type DownloadType = 'svg' | 'jpg' | 'png' //TODO: add support for raster images

export type WindowSettings = {
  // downloadType: DownloadType
  downloadStyleType: DownloadStyleType
  downloadRemoveClasses: boolean
  downloadRemoveDataKeys: boolean
  downloadRemoveDataStyles: boolean

  // zoomXActive: BooleanString
  // zoomYActive: BooleanString
  // zoomStateVisible: BooleanString
  // zoomType: ZoomType

  movableCrossActive: boolean
  // gridActive: BooleanString
}

export const windowSettingsKeys: Record<keyof WindowSettings, keyof WindowSettings> = {
  downloadStyleType: 'downloadStyleType',
  downloadRemoveClasses: 'downloadRemoveClasses',
  downloadRemoveDataKeys: 'downloadRemoveDataKeys',
  downloadRemoveDataStyles: 'downloadRemoveDataStyles',
  movableCrossActive: "movableCrossActive"
}

export const defaultWindowSettings: WindowSettings = {
  downloadStyleType: 'inline',
  downloadRemoveClasses: true,
  downloadRemoveDataKeys: true,
  downloadRemoveDataStyles: true,
  movableCrossActive: false
} as const


