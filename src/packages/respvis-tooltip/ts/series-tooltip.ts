import {select, Selection} from 'd3';
import {Series} from 'respvis-core';
import {tooltipSelector} from './tooltip';

const seriesTooltipClass = 'tooltip--series-content'
const seriesTooltipSelector = `.${seriesTooltipClass}`

/**
 * Generator for the tooltip content of series.
 */
export type SeriesTooltipGenerator<E extends Element, D> = (item: E, data: D) => string;

export function renderSeriesTooltip<E extends Element, D>(seriesS: Selection<Element, Series>) {
  const tooltip = seriesS.datum().renderer.windowS.datum().tooltip
  if (!tooltip.active) return
  const seriesTooltipS = select(tooltipSelector).selectAll(seriesTooltipSelector)
    .data([null])
    .join('div')
    .classed(seriesTooltipClass, true)

  seriesS.on('pointerover.tooltip', (e, d) => {
      const item = e.target;
      if (!d.markerTooltipGenerator || !item) return;
      const data = select<E, D>(item).datum();
      tooltip.seriesTooltipVisible = true
      seriesTooltipS.html(d.markerTooltipGenerator(item, data));
    }).on('pointerout.tooltip', () => {
      tooltip.seriesTooltipVisible = false
    })
  return seriesTooltipS
}

// export function addSeriesConfigTooltipsEvents<ItemElement extends Element, ItemDatum>(
//   seriesS: Selection<Element, WithSeriesTooltip<ItemElement, ItemDatum>>,
//   seriesItemFinder?: (eventTarget: Element) => ItemElement | null
// ): void {
//   seriesS
//     .on('pointerover.tooltip', (e, d) => {
//       const {tooltips, tooltipsEnabled} = d.markerTooltipsGenerator
//       const item = seriesItemFinder ? seriesItemFinder(<Element>e.target) : <ItemElement>e.target;
//       if (!tooltipsEnabled || !item) return;
//       const data = select<ItemElement, ItemDatum>(item).datum();
//       setTooltipVisibility('visible');
//       fillTooltip(null, tooltips(item, data));
//     })
//     .on('pointermove.tooltip', (e: PointerEvent, d) => {
//       const {tooltips, tooltipsEnabled, tooltipPosition: position} = d.markerTooltipsGenerator
//       const item = seriesItemFinder ? seriesItemFinder(<Element>e.target) : <ItemElement>e.target;
//       if (!tooltipsEnabled || !item) return;
//       const data = select<ItemElement, ItemDatum>(item).datum();
//       positionTooltipAuto(null, position(item, data, { x: e.clientX, y: e.clientY }))
//     })
//     .on('pointerout.tooltip', (e: PointerEvent, d) => {
//       const { tooltipsEnabled } = d.markerTooltipsGenerator
//       if (tooltipsEnabled) setTooltipVisibility('hidden')
//     })
// }
