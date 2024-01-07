import {select, Selection} from 'd3';
import {rectFromString} from '../core';
import {chartCartesianAxisRender} from '../core';
import {seriesPointRender, SeriesPointValid} from './series-point';
import {LegendValid, LegendItem, legendRender} from "../legend";
import {ChartPointData} from "./chart-point-data";
import {chartBaseRender} from "../core";
import {splitKey} from "../core/utilities/dom/key";

export type ChartPointSelection = Selection<SVGSVGElement | SVGGElement, ChartPointData>;

export function chartPointRender(selection: ChartPointSelection): void {
  selection
    .call((s) => chartBaseRender(s))
    .classed('chart-point', true)
    .each((chartD, i, g) => {
      setScale(chartD, g[i])
      renderAllSeriesOfPoints(chartD, g[i])
      renderLegend(chartD, g[i])

      // chartD.xAxis.scale = chartD.xScale;
      // chartD.yAxis.scale = chartD.yScale;
    })
    .call((s) => chartCartesianAxisRender(s));

  function setScale (data: ChartPointData, g: SVGSVGElement | SVGGElement) {
    const drawAreaS = select(g).selectAll('.draw-area');
    const drawAreaBounds = rectFromString(drawAreaS.attr('bounds') || '0, 0, 600, 400');
    const { flipped, x, y, maxRadius } = data;
    const {scale: xScale} = x
    const {scale: yScale} = y

    xScale.range(flipped ? [drawAreaBounds.height - maxRadius, maxRadius] : [maxRadius, drawAreaBounds.width - 2 * maxRadius])
    yScale.range(flipped ? [maxRadius, drawAreaBounds.width - 2 * maxRadius] : [drawAreaBounds.height - maxRadius, maxRadius])
  }

  function renderAllSeriesOfPoints (data: ChartPointData, g: SVGSVGElement | SVGGElement) {
    const {pointSeries, x } = data;
    select(g)
      .selectAll('.draw-area')
      .selectAll<SVGSVGElement, ChartPointData>('.series-point')
      .data<SeriesPointValid>([pointSeries])
      .join('svg')
      .call((s) => seriesPointRender(s))
  }

  function renderLegend(chartD: ChartPointData, g: SVGSVGElement | SVGGElement) {
    const drawAreaS = select(g).selectAll('.draw-area');
    const {legend, selection: chartSelection} = chartD
    selection
      .selectAll<SVGGElement, LegendValid>('.legend')
      .data([{...legend, selection: chartSelection}])
      .join('g')
      .call((s) => legendRender(s))
    .on('pointerover.chartpointhighlight pointerout.chartpointhighlight', (e) => { //TODO: Hover
      chartPointHoverLegendItem(
        drawAreaS,
        select(e.target.closest('.legend-item')),
        e.type.endsWith('over')
      );
    });
  }
}

export function chartPointHoverLegendItem(
  chartS: Selection,
  legendItemS: Selection<Element, LegendItem>,
  hover: boolean
): void {
  legendItemS.each((_, i, g) => {
    const key = g[i].getAttribute('data-key')!
    const tokens = splitKey(key)
    tokens.reduce((sel, token, index) => {
      if (index === 0) return sel.selectAll(`.point[data-key~="${token}"]`)
      return sel.filter(`.point[data-key~="${token}"]`)
    }, chartS).classed('highlight', hover)
  });
}
