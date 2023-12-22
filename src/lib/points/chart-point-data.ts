import {calcDefaultScale, IChartCartesianData, chartCartesianData, ScaleAny, ScaleContinuous} from "../core";
import {Legend, legendData} from "../legend";
import {SeriesPoint, seriesPointData} from "./series-point";
import {zoom, ZoomBehavior} from "d3";

type Dimension = number | string // TODO: | date . Include this everywhere

export interface ChartPointArgs extends IChartCartesianData {
  xValues: number[][]; //TODO: add strings/dates, also for y
  xScale?: ScaleAny<any, number, number>;
  yValues: number[][];
  yScale?: ScaleAny<any, number, number>;
  radiuses?: number | {
    radiusDim: number[][],
    scale: ScaleAny<any, number, number>
  }
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  }
  zoom?: {
    in: number,
    out: number
  };
  styleClasses?: string[];
  legend?: Legend;
}

export interface ChartPointData extends IChartCartesianData {
  xScale: ScaleAny<any, number, number>;
  yScale: ScaleAny<any, number, number>;
  pointSeries: SeriesPoint[];
  maxRadius: number
  zoom?: {
    behaviour:  ZoomBehavior<Element, unknown>
    in: number,
    out: number
  }
  legend: Legend;
}

export function chartPointData(data: ChartPointArgs): ChartPointData {
  const {xValues, yValues, xScale, yScale,
    legend, flipped, radiuses, zoom : zoomData,
    color} = data
  const lowerLength = xValues.length < yValues.length ? xValues.length : yValues.length
  const xVals = xValues.slice(0, lowerLength)
  const yVals = yValues.slice(0, lowerLength)
  const xScaleValid = xScale ?? calcDefaultScale(xValues)
  const yScaleValid = yScale ?? calcDefaultScale(yValues)

  const points = xVals.map((xVal, index) => {
    const styleClasses = data.styleClasses ? data.styleClasses[index] : `categorical-${index}`
    const radiusesValid = typeof radiuses === "number" ? radiuses : typeof radiuses === "object" ? {
      scale: radiuses.scale,
      radiusDim: radiuses.radiusDim[index]
    } : 5
    const toolTipData = data.markerTooltips || {}
    return seriesPointData({
      flipped, styleClasses,
      keys: yVals[index].map((_, markerI) => `${legend?.keys?.[index] ?? index}-${markerI}`),
      xValues: xVals[index],
      yValues: yVals[index],
      radiuses: radiusesValid,
      color,
      xScale: xScaleValid,
      yScale: yScaleValid,
      ...toolTipData,
    })
  })
  const firstPoint = points[0]
  const maxRadius = typeof firstPoint.radiuses === "number" ? firstPoint.radiuses : firstPoint.radiuses.scale.range()[1]

  const labels = legend?.labels ? legend.labels : yVals.map((yVal, index) => `categorical-${index}`)
  //TODO: make zoom optional
  return {
    xScale: xScaleValid,
    yScale: yScaleValid,
    pointSeries: points,
    maxRadius,
    legend: legendData(legend ? legend : { labels }),
    ...chartCartesianData(data),
    zoom: zoomData ? {
      ...zoomData,
      behaviour: zoom()
    } : undefined
  };
}
