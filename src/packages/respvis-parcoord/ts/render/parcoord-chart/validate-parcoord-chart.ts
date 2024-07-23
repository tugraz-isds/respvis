import {DataSeriesChartData, DataSeriesChartUserArgs, RenderArgs, validateChart, validateLegend} from "respvis-core";
import {ParcoordSeries, ParcoordSeriesUserArgs} from "../parcoord-series";

export type ParcoordChartUserArgs = Omit<DataSeriesChartUserArgs, 'series'> & {
  series: ParcoordSeriesUserArgs
}

export type ParcoordChartArgs = ParcoordChartUserArgs & RenderArgs

export type ParcoordChartData = DataSeriesChartData & {
  series: ParcoordSeries
}

export function validateParcoordChart(args: ParcoordChartArgs): ParcoordChartData {
  const {renderer} = args
  const series = new ParcoordSeries({...args.series, renderer, key: 's-0'})
  return {
    getAxes: function () { return this.series.axes },
    getSeries: function () { return [this.series] },
    getMainSeries: function () { return this.series },
    series,
    legend: validateLegend({...args.legend, renderer, series}),
    ...validateChart(args),
  }
}
