import {ChartArgs, ChartValid} from "../chart";
import {AxisValid} from "../../axis";
import {Series} from "../../series";
import {LegendUserArgs, LegendValid} from "../../legend";
import {ZoomArgs, ZoomValid} from "../../../data/zoom";

export type SeriesChartUserArgs = ChartArgs & {
  legend?: LegendUserArgs
  zoom?: ZoomArgs
}

export type SeriesChartValid = ChartValid & {
  getAxes: () => AxisValid[]
  getSeries: () => Series[]
  legend: LegendValid
  zoom?: ZoomValid
}
