import {ChartArgs, ChartValid} from "../chart";
import {AxisValid} from "../../axis";
import {Series} from "../../series";
import {LegendUserArgs, LegendValid} from "../../legend";

export type SeriesChartUserArgs = ChartArgs & {
  legend?: LegendUserArgs
}

export type SeriesChartValid = ChartValid & {
  getAxes: () => AxisValid[]
  getSeries: () => Series[]
  getMainSeries: () => Series
  legend: LegendValid
}
