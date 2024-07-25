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
  getScaledValuesAtScreenPosition: (horizontal: number, vertical: number) => {
    horizontal: string,
    horizontalName: string
    vertical: string,
    verticalName: string
  }
  cloneToRenderData: () => DataSeries
  applyFilter: () => DataSeries
  applyZoom: () => DataSeries
  applyInversion: () => DataSeries
}
