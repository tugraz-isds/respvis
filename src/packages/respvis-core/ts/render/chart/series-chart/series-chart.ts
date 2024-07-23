import {ChartData, ChartDataArgs, ChartDataUserArgs} from "../chart";
import {Axis} from "../../axis";
import {DataSeries} from "../../data-series";
import {Legend, LegendUserArgs} from "../../legend";

export type DataSeriesChartUserArgs = ChartDataUserArgs & {
  legend?: LegendUserArgs
}

export type DataSeriesChartArgs = ChartDataArgs & {
  legend?: LegendUserArgs
}

export type DataSeriesChartData = ChartData & {
  getAxes: () => Axis[]
  getSeries: () => DataSeries[]
  getMainSeries: () => DataSeries
  legend: Legend
}
