import {Selection} from 'd3'
import {PointSeries} from '../point-series/point-series'
import {ScatterPlotData} from "./validate-scatter-plot"
import {renderPoints} from "../point-series/render-points"
import {createPoints} from "../point-series/create-points"
import {renderSeriesTooltip} from "respvis-tooltip"
import {addSeriesHighlighting, renderLabelSeries} from "respvis-core"

export type ScatterplotSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ScatterPlotData>

export function renderScatterPlotContent(chartS: ScatterplotSVGChartSelection) {
  const series = chartS.datum().series.cloneFiltered().cloneZoomed() as PointSeries
  const points = createPoints(series, false)
  const drawAreaS = chartS.datum().renderer.drawAreaS

  drawAreaS.selectAll<SVGGElement, PointSeries>('.series-point')
    .data([series])
    .join('g')
    .classed('series-point', true)
    .attr('data-ignore-layout-children', true)
    .call(s => renderPoints(s, points))
    .call(addSeriesHighlighting)
    .call(renderSeriesTooltip)
    .call(() => renderLabelSeries(drawAreaS, {
      elements: points,
      classes: ['series-label'],
      orientation: series.responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
    }).attr( 'layout-strategy-horizontal', points[0]?.labelData?.positionStrategyHorizontal ?? null)
      .attr( 'layout-strategy-vertical', points[0]?.labelData?.positionStrategyVertical ?? null)
    )
}
