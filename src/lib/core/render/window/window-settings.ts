type DownloadStyleType = 'inline' | 'embedded'
type BooleanString = 'true' | 'false'
type ZoomType = 'geometric' | 'semantic' | 'fish-eye' | 'cartesian'
type DownloadType = 'svg' | 'jpg' | 'png' //TODO: add support for raster images

export type WindowSettings = {
  // downloadType: DownloadType
  downloadStyleType: DownloadStyleType
  downloadRemoveClasses: BooleanString
  downloadRemoveDataKeys: BooleanString
  downloadRemoveDataStyles: BooleanString

  // zoomXActive: BooleanString
  // zoomYActive: BooleanString
  // zoomStateVisible: BooleanString
  // zoomType: ZoomType

  // movableCrossActive: BooleanString
  // gridActive: BooleanString
}

export const windowSettingsKeys: Record<keyof WindowSettings, keyof WindowSettings> = {
  downloadStyleType: 'downloadStyleType',
  downloadRemoveClasses: 'downloadRemoveClasses',
  downloadRemoveDataKeys: 'downloadRemoveDataKeys',
  downloadRemoveDataStyles: 'downloadRemoveDataStyles',
}

export const defaultWindowSettings: WindowSettings = {
  downloadStyleType: 'inline',
  downloadRemoveClasses: 'true',
  downloadRemoveDataKeys: 'true',
  downloadRemoveDataStyles: 'true'
} as const


