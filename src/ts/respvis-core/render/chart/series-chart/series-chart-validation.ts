import {ChartData, ChartDataArgs, ChartDataUserArgs} from "../chart";
import {Axis} from "../../axis";
import {Series} from "../../series";
import {LegendUserArgs, LegendValid} from "../../legend";

export type SeriesChartUserArgs = ChartDataUserArgs & {
  legend?: LegendUserArgs
}

export type SeriesChartArgs = ChartDataArgs & {
  legend?: LegendUserArgs
}

export type SeriesChartData = ChartData & {
  getAxes: () => Axis[]
  getSeries: () => Series[]
  getMainSeries: () => Series
  legend: LegendValid
}
