import {CartesianChartArgs, CartesianChartData, cartesianChartValidation} from "respvis-cartesian";
import {PointSeries, SeriesPointUserArgs} from "../point-series/point-series";

export type ScatterPlotArgs = Omit<CartesianChartArgs, 'series'> & {
  series: SeriesPointUserArgs
}

export type ScatterPlotValid = Omit<CartesianChartData, 'series'> & {
  series: PointSeries;
}

export function scatterPlotValidation(scatterArgs: ScatterPlotArgs): ScatterPlotValid {
  const {renderer, x, y,
    legend, breakPoints,
    title, subTitle
  } = scatterArgs
  const series = new PointSeries({...scatterArgs.series, key: 's-0', renderer})
  const cartesianData =
    cartesianChartValidation({renderer, series, x, y, legend, breakPoints, title, subTitle})

  return {
    ...cartesianData,
    series,
  }
}
