import {ChartBaseArgs, ChartBaseValid, chartBaseValidation} from "../../core";
import {ParcoordSeries, ParcoordSeriesUserArgs, ParcoordSeriesValid} from "../parcoord-series";

export type ParcoordChartUserArgs = Omit<ParcoordChartArgs, 'renderer'>

export type ParcoordChartArgs = ChartBaseArgs & {
  series: ParcoordSeriesUserArgs
  // legend?: LegendUserArgs
  // zoom?: ZoomArgs
}

//TODO: create own parcoord series from arguments
export type ParcoordChartValid = ChartBaseValid & {
  series: ParcoordSeriesValid
  // legend: LegendValid
  // zoom?: ZoomValid
}


export function parcoordChartValidation(args: ParcoordChartArgs): ParcoordChartValid {
  const {series, renderer} = args

  return {
    series: new ParcoordSeries({...series, renderer, key: 's-0'}),
    ...chartBaseValidation(args),
  }
}
