import {select, Selection} from 'd3';
import {DataSeries} from 'respvis-core';
import {tooltipSelector} from './tooltip';

/**
 * Generator for the tooltip content of series.
 */
export type SeriesTooltipGenerator<E extends Element, D> = (item: E, data: D) => string;

export function renderSeriesTooltip<E extends Element, D>(seriesS: Selection<Element, DataSeries>) {
  const tooltip = seriesS.datum().renderer.windowS.datum().tooltip

  const seriesTooltipS = select(tooltipSelector)
    .selectAll('.item.tooltip--series')
    .data(tooltip.active ? [null] : [])
    .join('div')
    .classed('item tooltip--series', true)

  seriesS.on('pointermove.tooltip', (e) => {
    const positionStrategy = tooltip.positionStrategySeries
    tooltip.applyPositionStrategy(e, positionStrategy)
  }).on('pointerover.tooltip', (e, d) => {
    const item = e.target;
    if (!d.renderData.markerTooltipGenerator || !item) return
    const data = select<E, D>(item).datum()

    tooltip.seriesTooltipVisible = true
    select(tooltipSelector).html(d.renderData.markerTooltipGenerator(item, data));
  }).on('pointerout.tooltip', () => {
    tooltip.seriesTooltipVisible = false
    select(tooltipSelector).html(null);
  })
  return seriesTooltipS
}
