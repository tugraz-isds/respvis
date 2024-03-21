import {Selection} from 'd3';
import {PointSeries} from '../point-series/point-series-validation';
import {ScatterPlotValid} from "./scatter-plot-validation";
import {pointSeriesRender} from "../point-series/point-series-render";

export type ScatterplotSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ScatterPlotValid>;

export function scatterPlotRender(selection: ScatterplotSVGChartSelection) {
  selection.call(renderAllSeriesOfPoints)
}

function renderAllSeriesOfPoints(chartS: ScatterplotSVGChartSelection) {
  const {series} = chartS.datum()
  chartS
    .selectAll('.draw-area')
    .selectAll<SVGSVGElement, ScatterPlotValid>('.series-point')
    .data<PointSeries>([series])
    .join('g')
    .call(pointSeriesRender)


  //TODO: improve this improvised label series
  // const points = seriesPointCreatePoints(pointSeries)
  // const labelData = seriesLabelData({
  //   positions: points.map((p) => {
  //     return {x: p.center.x + 13, y: p.center.y + 13}
  //   }),
  //   keys: points.map((p) => p.key),
  //   texts: points.map((p, markerI) =>
  //     p.radiusValue.toString() + '€'
  //   ),
  // });
  // chartS
  //   .selectAll('.draw-area')
  //   .selectAll<SVGGElement, SeriesLabel>('.series-label')
  //   .data([labelData])
  //   .join('g')
  //   .call((s) => seriesLabelRender(s));
}
