import {CartesianChartUserArgs, CartesianChartValid, cartesianChartValidation} from "../../cartesian";
import {PointSeries, SeriesPointUserArgs} from "../point-series/point-series";

export type ScatterPlotArgs = Omit<CartesianChartUserArgs, 'series'> & {
  series: SeriesPointUserArgs
}

export type ScatterPlotValid = CartesianChartValid & {
  series: PointSeries;
}

export function scatterPlotValidation(scatterArgs: ScatterPlotArgs): ScatterPlotValid {
  const {renderer, x, y,
    legend, bounds,
    title, subTitle
  } = scatterArgs
  const series = new PointSeries({...scatterArgs.series, key: 's-0', renderer})
  const cartesianData =
    cartesianChartValidation({renderer, series, x, y, legend, bounds, title, subTitle})

  return {
    ...cartesianData,
    series,
  }
}
