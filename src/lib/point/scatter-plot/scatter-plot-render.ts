import {Selection} from 'd3'
import {PointSeries} from '../point-series/point-series'
import {ScatterPlotValid} from "./scatter-plot-validation"
import {pointsRender} from "../point-series/points-render"
import {pointsCreate} from "../point-series/points-create"
import {seriesConfigTooltipsHandleEvents} from "../../tooltip"
import {labelSeriesFromElementsRender} from "../../core/render/label/todo/series-label"
import {addHighlight} from "../../core/render/series/series-add-highlight"

export type ScatterplotSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ScatterPlotValid>

export function scatterPlotRender(chartS: ScatterplotSVGChartSelection) {
  const series = chartS.datum().series.cloneFiltered().cloneZoomed() as PointSeries
  const points = pointsCreate(series, false)
  const drawAreaS = chartS.datum().renderer.drawAreaS
  const drawAreaClipPathS = chartS.datum().renderer.drawAreaClipPathS

  drawAreaS.selectAll<SVGGElement, PointSeries>('.series-point')
    .data([series])
    .join('g')
    .classed('series-point', true)
    .attr('data-ignore-layout-children', true)
    .attr('clip-path', `url(#${drawAreaClipPathS.attr('id')})`)
    .call(s => pointsRender(s, points))
    .call(addHighlight)
    .call(seriesConfigTooltipsHandleEvents)
    .call(() => labelSeriesFromElementsRender(drawAreaS, {
      elements: points,
      classes: ['series-label'],
      orientation: series.responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
    }).attr( 'layout-strategy-horizontal', points[0]?.labelArg?.positionHorizontal ?? null)
      .attr( 'layout-strategy-vertical', points[0]?.labelArg?.positionVertical ?? null)
    )
}
