import {Selection} from "d3";
import {BarChartValid} from "./bar-chart-validation";
import {BarSeries, barSeriesRender, BarStandardSeries} from "../bar-series";
import {addHighlight} from "../../core/render/series/series-add-highlight";
import {seriesConfigTooltipsHandleEvents} from "../../tooltip";
import {labelSeriesFromElementsRender} from "../../core/render/label/todo/series-label";

export type BarChartChartSelection = Selection<SVGSVGElement | SVGGElement, BarChartValid>;

export function barChartRender(chartS: BarChartChartSelection) {
  const series = chartS.datum().series.cloneFiltered().cloneZoomed() as BarSeries
  const drawAreaS = chartS.selectAll('.draw-area')
  const drawAreaClipPathS = chartS.datum().renderer.drawAreaClipPathS
  const bars = series.getBarRects()

  drawAreaS.selectAll<SVGGElement, BarStandardSeries>('.series-bar')
    .data([series])
    .join('g')
    .classed('series-bar', true)
    .attr('clip-path', `url(#${drawAreaClipPathS.attr('id')})`)
    .call((s) => barSeriesRender(s))
    .call(addHighlight)
    .call(seriesConfigTooltipsHandleEvents)
    .call(() => labelSeriesFromElementsRender(drawAreaS, {
      elements: bars,
      classes: ['series-label'],
      orientation: series.responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
    })
      .attr( 'layout-strategy', bars[0]?.labelArg?.position ?? null)
      .attr('clip-path', `url(#${drawAreaClipPathS.attr('id')})`)

    )
}
