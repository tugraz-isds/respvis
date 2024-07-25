import {CartesianChartData, CartesianChartUserArgs, CartesianRenderer, validateCartesianChart} from "respvis-cartesian";
import {PointSeries} from "../point-series/point-series";
import {BreakpointProperty} from "respvis-core";
import {BubbleRadius} from "../../data/radius";
import {PointSeriesUserArgs} from "../point-series/validate-point-series";

export type ScatterPlotUserArgs = Omit<CartesianChartUserArgs, 'series'> & {
  series: PointSeriesUserArgs
}

export type ScatterPlotArgs = ScatterPlotUserArgs & {
  renderer: CartesianRenderer
}

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


  const {radii, color} = series.originalData
  const hasBubbleRadius = typeof radii !== 'number' && !(radii instanceof BreakpointProperty)
  cartesianData.getAxes = !hasBubbleRadius ? cartesianData.getAxes : function (this:ScatterPlotData) {
    return [this.x, this.y,
      ...(this.series.originalData.color ? [this.series.originalData.color.axis] : []),
      (this.series.originalData.radii as BubbleRadius).axis
    ]
  }
  return {
    ...cartesianData,
    series,
  }
}
