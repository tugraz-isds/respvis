import {ChartData, ChartDataArgs, ChartDataUserArgs} from "../chart";
import {Axis} from "../../axis";
import {DataSeries} from "../../data-series";
import {Legend, LegendUserArgs} from "../../legend";

export type SeriesChartUserArgs = ChartDataUserArgs & {
  legend?: LegendUserArgs
}

export type SeriesChartArgs = ChartDataArgs & {
  legend?: LegendUserArgs
}

export type SeriesChartData = ChartData & {
  getAxes: () => Axis[]
  getSeries: () => DataSeries[]
  getMainSeries: () => DataSeries
  legend: Legend
}
