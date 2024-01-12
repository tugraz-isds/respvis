import {select, Selection} from 'd3';
import {chartBaseRender, chartCartesianAxisRender} from '../core';
import {SeriesPointValid} from './series-point';
import {LegendItem, legendRender, LegendValid} from "../legend";
import {ChartPointData} from "./chart-point-data";
import {splitKey} from "../core/utilities/dom/key";
import {seriesPointRender} from "./series-point-render";

export type ChartPointSelection = Selection<SVGSVGElement | SVGGElement, ChartPointData>;

export function chartPointRender(selection: ChartPointSelection) {
  chartBaseRender(selection).chart
    .classed('chart-point', true)
    .call(renderAllSeriesOfPoints)
    .call(renderLegend)
  selection.call(chartCartesianAxisRender)
}

function renderAllSeriesOfPoints(selection: ChartPointSelection) {
  const {pointSeries} = selection.datum()
  selection
    .selectAll('.draw-area')
    .selectAll<SVGSVGElement, ChartPointData>('.series-point')
    .data<SeriesPointValid>([pointSeries])
    .join('svg')
    .call(seriesPointRender)
}

function renderLegend(selection: ChartPointSelection) {
  const drawAreaS = selection.selectAll('.draw-area');
  const {legend, selection: chartSelection} = selection.datum()
  return selection
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
