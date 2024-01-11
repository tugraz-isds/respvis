import {ChartCartesianArgs, chartCartesianData, ChartCartesianValid, ScaleAny, ScaleContinuous} from "../core";
import {seriesPointData, SeriesPointValid} from "./series-point";

// type Dimension = number | string // TODO: | date . Include this everywhere

export type ChartPointArgs = ChartCartesianArgs & {
  radiuses?: number | {
    radiusDim: number[],
    scale: ScaleAny<any, number, number>
  }
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  }
}

export type ChartPointData = ChartCartesianValid & {
  pointSeries: SeriesPointValid;
  maxRadius: number
}

export function chartPointData(data: ChartPointArgs): ChartPointData {
  //TODO: adapt to thought structure of labels, data-style, data-key
  const {
    legend, flipped, radiuses ,
    color} = data

  const {x, y, markerTooltips,
    ...restCartesian} = chartCartesianData(data)

  //TODO: move to cartesian or base
  const toolTipData = markerTooltips || {}
  const styleClasses = data.styleClasses ? data.styleClasses :
    x.categories.map((category) => `categorical-${x.categoryOrder[category]}`)
  const labels = legend?.labels ? legend.labels : x.categories

  const pointSeries = seriesPointData({...toolTipData,
    flipped, x, y, color, radiuses, ...toolTipData, styleClasses, labels,
    key: '0'
  })

  const maxRadius = typeof pointSeries.radiuses === "number" ? pointSeries.radiuses : pointSeries.radiuses.scale.range()[1]
  return {
    x,
    y,
    markerTooltips,
    ...restCartesian,
    pointSeries,
    maxRadius,
  };
}
