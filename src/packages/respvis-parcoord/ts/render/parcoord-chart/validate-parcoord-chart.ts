import {RenderArgs, SeriesChartData, SeriesChartUserArgs, validateChart, validateLegend} from "respvis-core";
import {ParcoordSeries, ParcoordSeriesUserArgs, prepareParcoordSeriesArgs} from "../parcoord-series";

export type ParcoordChartUserArgs = Omit<SeriesChartUserArgs, 'series'> & {
  series: ParcoordSeriesUserArgs
}

export type ParcoordChartArgs = ParcoordChartUserArgs & RenderArgs

export type ParcoordChartData = SeriesChartData & {
  series: ParcoordSeries
}

export function validateParcoordChart(args: ParcoordChartArgs): ParcoordChartData {
  const {renderer} = args
  const parcoordArgs = prepareParcoordSeriesArgs({...args.series, renderer})
  const series = new ParcoordSeries(parcoordArgs)
  return {
    getAxes: function () { return this.series.axes },
    getSeries: function () { return [this.series] },
    getMainSeries: function () { return this.series },
    series,
    legend: validateLegend({...args.legend, renderer, series}),
    ...validateChart(args),
  }
}
