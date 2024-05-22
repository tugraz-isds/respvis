import {CartesianChartData, CartesianChartUserArgs, validateCartesianChart} from "respvis-cartesian";
import {PointSeries, PointSeriesUserArgs} from "../point-series/point-series";
import {RenderArgs} from "respvis-core";

export type ScatterPlotUserArgs = Omit<CartesianChartUserArgs, 'series'> & {
  series: PointSeriesUserArgs
}

export type ScatterPlotArgs = ScatterPlotUserArgs & RenderArgs

export type ScatterPlotData = Omit<CartesianChartData, 'series'> & {
  series: PointSeries;
}

export function validateScatterPlot(scatterArgs: ScatterPlotArgs): ScatterPlotData {
  const {renderer, x, y,
    legend, breakPoints,
    title, subTitle
  } = scatterArgs
  const series = new PointSeries({...scatterArgs.series, key: 's-0', renderer})
  const cartesianData =
    validateCartesianChart({renderer, series, x, y, legend, breakPoints, title, subTitle})

  return {
    ...cartesianData,
    series,
  }
}
