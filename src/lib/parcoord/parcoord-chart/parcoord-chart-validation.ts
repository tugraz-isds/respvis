import {ChartArgs, ChartValid, chartValidation} from "../../core";
import {ParcoordSeries, ParcoordSeriesUserArgs} from "../parcoord-series";

export type ParcoordChartUserArgs = Omit<ParcoordChartArgs, 'renderer'>

export type ParcoordChartArgs = ChartArgs & {
  series: ParcoordSeriesUserArgs
  // legend?: LegendUserArgs
  // zoom?: ZoomArgs
}

//TODO: create own parcoord series from arguments
export type ParcoordChartValid = ChartValid & {
  series: ParcoordSeries
  // legend: LegendValid
  // zoom?: ZoomValid
}


export function parcoordChartValidation(args: ParcoordChartArgs): ParcoordChartValid {
  const {series, renderer} = args

  return {
    series: new ParcoordSeries({...series, renderer, key: 's-0'}),
    ...chartValidation(args),
  }
}
