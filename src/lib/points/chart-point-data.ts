import {calcDefaultScale, ChartCartesian, chartCartesianData, ScaleAny, ScaleContinuous} from "../core";
import {Legend, legendData} from "../legend";
import {SeriesPoint, seriesPointData} from "./series-point";
import {zoom, ZoomBehavior} from "d3";

type Dimension = number | string // TODO: | date . Include this everywhere

export interface ChartPointArgs extends ChartCartesian {
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

export interface ChartPointData extends ChartCartesian {
  xScale: ScaleAny<any, number, number>;
  yScale: ScaleAny<any, number, number>;
  pointSeries: SeriesPoint[];
  zoom?: {
    behaviour:  ZoomBehavior<Element, unknown>
    in: number,
    out: number
  }
  legend: Legend;
}

export function chartPointData(data: ChartPointArgs): ChartPointData {
  const {xValues, yValues, xScale, yScale, legend, styleClasses, flipped, radiuses, zoom : zoomData, color} = data

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
    return seriesPointData({
      flipped, styleClasses,
      keys: yVals[index].map((_, markerI) => `${index}-${markerI}`),
      xValues: xVals[index],
      yValues: yVals[index],
      radiuses: radiusesValid,
      color,
      xScale: xScaleValid,
      yScale: yScaleValid,
    })
  })

  const labels = legend?.labels ? legend.labels : yVals.map((yVal, index) => `categorical-${index}`)
  //TODO: make zoom optional
  return {
    xScale: xScaleValid,
    yScale: yScaleValid,
    pointSeries: points,
    legend: legendData(legend ? legend : { }),
    ...chartCartesianData(data),
    zoom: zoomData ? {
      ...zoomData,
      behaviour: zoom()
    } : undefined
  };
}
