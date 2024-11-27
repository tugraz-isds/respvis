import {RenderArgs} from "../chart/renderer";
import {Selection} from "d3";
import {LegendSelection} from "../legend";
import {DataSeriesData} from "./validate-data-series";
import {ResponsiveState} from "./responsive-state";

export interface DataSeries extends RenderArgs {
  originalData: DataSeriesData
  renderData: DataSeriesData
  responsiveState: ResponsiveState

  renderTool?: (toolbarS: Selection<HTMLDivElement>) => void
  renderLegendInfo?: (legendS: LegendSelection) => void
  getScaledValuesAtScreenPosition: (horizontal: number, vertical: number) => ScreenPositionInfo
  cloneToRenderData: () => DataSeries
  applyFilter: () => DataSeries
  applyZoom: () => DataSeries
  applyInversion: () => DataSeries
}

export type ScreenPositionInfo = {
  horizontal: string,
  horizontalName: string
  horizontalNearestRealValue: any,
  horizontalScreenValue: any,
  vertical: string,
  verticalName: string
  verticalNearestRealValue: any,
  verticalScreenValue: any,
}
