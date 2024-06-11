import {genKeyObjectFromObject} from "../../constants";

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

  downloadMarginLeft: string
  downloadMarginTop: string
  downloadMarginRight: string
  downloadMarginBottom: string

  // ------------------ parcoord
  parcoordEquidistantAxes: boolean

  // zoomXActive: BooleanString
  // zoomYActive: BooleanString
  // zoomStateVisible: BooleanString
  // zoomType: ZoomType

  movableCrossActive: boolean
  // gridActive: BooleanString
}

export const defaultWindowSettings: WindowSettings = {
  downloadStyleType: 'inline',
  downloadRemoveClasses: true,
  downloadRemoveDataKeys: true,
  downloadRemoveDataStyles: true,
  downloadRemoveBgElements: true,
  downloadPrettifyActive: true,
  downloadPrettifyIndentionSpaces: '2',
  downloadMarginLeft: '0',
  downloadMarginBottom: '0',
  downloadMarginRight: '0',
  downloadMarginTop: '0',

  movableCrossActive: false,
  downloadAttributeMaxDecimals: '1',
  downloadAttributeMaxDecimalsActive: true,
  parcoordEquidistantAxes: true
} as const

export const windowSettingsKeys=
  genKeyObjectFromObject(defaultWindowSettings)
