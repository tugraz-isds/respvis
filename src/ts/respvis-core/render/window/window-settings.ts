type DownloadStyleType = 'inline' | 'embedded'
type ZoomType = 'geometric' | 'semantic' | 'fish-eye' | 'cartesian'
type DownloadType = 'svg' | 'jpg' | 'png' //TODO: add support for raster images

export type WindowSettings = {
  // ------------------ download
  // downloadType: DownloadType
  downloadStyleType: DownloadStyleType

  downloadRemoveClasses: boolean
  downloadRemoveDataKeys: boolean
  downloadRemoveDataStyles: boolean

  downloadRemoveBgElements: boolean

  downloadAttributeMaxDecimals: string
  downloadAttributeMaxDecimalsActive: boolean

  downloadPrettifyActive: boolean
  downloadPrettifyIndentionSpaces: string

  // ------------------ parcoord
  parcoordEquidistantAxes: boolean

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
  downloadPrettifyActive: 'downloadPrettifyActive',
  downloadPrettifyIndentionSpaces: 'downloadPrettifyIndentionSpaces',
  movableCrossActive: "movableCrossActive",
  downloadAttributeMaxDecimals: "downloadAttributeMaxDecimals",
  downloadAttributeMaxDecimalsActive: "downloadAttributeMaxDecimalsActive",
  parcoordEquidistantAxes: "parcoordEquidistantAxes"
}

export const defaultWindowSettings: WindowSettings = {
  downloadStyleType: 'inline',
  downloadRemoveClasses: true,
  downloadRemoveDataKeys: true,
  downloadRemoveDataStyles: true,
  downloadRemoveBgElements: true,
  downloadPrettifyActive: true,
  downloadPrettifyIndentionSpaces: '2',
  movableCrossActive: false,
  downloadAttributeMaxDecimals: '1',
  downloadAttributeMaxDecimalsActive: true,
  parcoordEquidistantAxes: true
} as const


