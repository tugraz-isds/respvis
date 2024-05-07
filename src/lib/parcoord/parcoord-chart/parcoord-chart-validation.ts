import {chartValidation} from "../../respvis-core";
import {ParcoordSeries, ParcoordSeriesUserArgs} from "../parcoord-series";
import {SeriesChartUserArgs, SeriesChartValid} from "respvis-core/render/chart/series-chart/series-chart-validation";
import {legendValidation} from "respvis-core/render/legend";

export type ParcoordChartUserArgs = Omit<ParcoordChartArgs, 'renderer'>

export type ParcoordChartArgs = SeriesChartUserArgs & {
  series: ParcoordSeriesUserArgs
}

export type ParcoordChartValid = SeriesChartValid & {
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
    ...chartValidation(args),
  }
}
