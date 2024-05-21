import {legendValidation, SeriesChartArgs, SeriesChartData, validateChart} from "respvis-core";
import {ParcoordSeries, ParcoordSeriesUserArgs} from "../parcoord-series";

export type ParcoordChartUserArgs = Omit<ParcoordChartArgs, 'renderer'>

export type ParcoordChartArgs = SeriesChartArgs & {
  series: ParcoordSeriesUserArgs
}

export type ParcoordChartValid = SeriesChartData & {
  series: ParcoordSeries
}


export function parcoordChartValidation(args: ParcoordChartArgs): ParcoordChartValid {
  const {renderer} = args
  const series = new ParcoordSeries({...args.series, renderer, key: 's-0'})
  return {
    getAxes: function () { return this.series.axes },
    getSeries: function () { return [this.series] },
    getMainSeries: function () { return this.series },
    series,
    legend: legendValidation({...args.legend, renderer, series}),
    ...validateChart(args),
  }
}
