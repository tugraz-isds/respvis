import {CartesianChartData, CartesianChartUserArgs, validateCartesianChart} from "respvis-cartesian";
import {PointSeries, PointSeriesUserArgs} from "../point-series/point-series";
import {BubbleRadius, RenderArgs, RespValInterpolated} from "respvis-core";

export type ScatterPlotUserArgs = Omit<CartesianChartUserArgs, 'series'> & {
  series: PointSeriesUserArgs
}

export type ScatterPlotArgs = ScatterPlotUserArgs & RenderArgs

export type ScatterPlotData = Omit<CartesianChartData, 'series'> & {
  series: PointSeries;
}

export function validateScatterPlot(scatterArgs: ScatterPlotArgs): ScatterPlotData {
  const {renderer, x, y,
    legend, breakpoints,
    title, subTitle
  } = scatterArgs
  const series = new PointSeries({...scatterArgs.series, key: 's-0', renderer})
  const cartesianData =
    validateCartesianChart({renderer, series, x, y, legend, breakpoints, title, subTitle})


  const radii = series.radii
  const hasBubbleRadius = typeof radii !== 'number' && !(radii instanceof RespValInterpolated)
  cartesianData.getAxes = !hasBubbleRadius ? cartesianData.getAxes : function (this:ScatterPlotData) {
    return [this.x, this.y,
      ...(this.series.color ? [this.series.color.axis] : []),
      (this.series.radii as BubbleRadius).axis
    ]
  }
  return {
    ...cartesianData,
    series,
  }
}
