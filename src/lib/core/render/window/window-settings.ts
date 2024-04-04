type DownloadStyleType = 'inline' | 'embedded'
type ZoomType = 'geometric' | 'semantic' | 'fish-eye' | 'cartesian'
type DownloadType = 'svg' | 'jpg' | 'png' //TODO: add support for raster images

export type WindowSettings = {
  // downloadType: DownloadType
  downloadStyleType: DownloadStyleType

  downloadRemoveClasses: boolean
  downloadRemoveDataKeys: boolean
  downloadRemoveDataStyles: boolean

  downloadRemoveBgElements: boolean

  downloadAttributeMaxDecimals: string
  downloadAttributeMaxDecimalsActive: boolean


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
  downloadRemoveBgElements: 'downloadRemoveBgElements',
  downloadRemoveDataStyles: 'downloadRemoveDataStyles',
  movableCrossActive: "movableCrossActive",
  downloadAttributeMaxDecimals: "downloadAttributeMaxDecimals",
  downloadAttributeMaxDecimalsActive: "downloadAttributeMaxDecimalsActive"
}

export const defaultWindowSettings: WindowSettings = {
  downloadStyleType: 'inline',
  downloadRemoveClasses: true,
  downloadRemoveDataKeys: true,
  downloadRemoveDataStyles: true,
  downloadRemoveBgElements: true,
  movableCrossActive: false,
  downloadAttributeMaxDecimals: '1',
  downloadAttributeMaxDecimalsActive: true
} as const


