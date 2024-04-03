import {CartesianChartUserArgs, CartesianChartValid, cartesianChartValidation} from "../../core";
import {LineSeries, LineSeriesUserArgs} from "../line-series/line-series-validation";

export type LineChartArgs = Omit<CartesianChartUserArgs, 'series'> & {
  series: LineSeriesUserArgs
}

export type LineChartValid = CartesianChartValid & {
  series: LineSeries;
}

export function lineChartValidation(lineArgs: LineChartArgs): LineChartValid {
  const {renderer, x, y,
    legend, bounds,
    title, subTitle
  } = lineArgs
  const series = new LineSeries({...lineArgs.series, key: 's-0', renderer})
  const cartesianData =
    cartesianChartValidation({renderer, series, x, y, legend, bounds, title, subTitle})

  return {
    ...cartesianData,
    series,
  }
}
