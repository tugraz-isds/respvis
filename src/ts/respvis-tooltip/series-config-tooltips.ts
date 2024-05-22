import {select, Selection} from 'd3';
import {Position} from 'respvis-core';
import {fillTooltip, hideTooltip, positionTooltip, showTooltip, TooltipPositionConfig,} from './tooltip';

export type SeriesConfigTooltipsUserArgs<ItemElement extends Element, ItemDatum> = {
  tooltipsEnabled?: boolean;
  tooltips?: (item: ItemElement, data: ItemDatum) => string;
  tooltipPosition?: (
    item: ItemElement,
    data: ItemDatum,
    mousePosition: Position
  ) => TooltipPositionConfig;
}

export type SeriesConfigTooltipsArgs<ItemElement extends Element, ItemDatum> =
  SeriesConfigTooltipsUserArgs<ItemElement, ItemDatum>

export type SeriesConfigTooltips<ItemElement extends Element, ItemDatum> =
  Required<SeriesConfigTooltipsArgs<ItemElement, ItemDatum>>

type WithSeriesTooltips<ItemElement extends Element, ItemDatum> = {
  markerTooltips: SeriesConfigTooltips<ItemElement, ItemDatum>
}

export function validateSeriesConfigTooltips<ItemElement extends Element, ItemDatum>(
  args?: SeriesConfigTooltipsArgs<ItemElement, ItemDatum>
): SeriesConfigTooltips<Element, any> {
  return {
    tooltipsEnabled: args?.tooltipsEnabled ?? true,
    tooltips: args?.tooltips || ((data) => 'Tooltip'),
    tooltipPosition:
      args?.tooltipPosition || ((item, data, mousePosition) => ({ position: mousePosition })),
  };
}

export function addSeriesConfigTooltipsEvents<ItemElement extends Element, ItemDatum>(
  seriesSelection: Selection<Element, WithSeriesTooltips<ItemElement, ItemDatum>>,
  seriesItemFinder?: (eventTarget: Element) => ItemElement | null
): void {
  seriesSelection
    .on('pointerover.tooltip', (e, d) => {
      const {tooltips, tooltipsEnabled} = d.markerTooltips
      const item = seriesItemFinder ? seriesItemFinder(<Element>e.target) : <ItemElement>e.target;
      if (!tooltipsEnabled || !item) return;
      const data = select<ItemElement, ItemDatum>(item).datum();
      showTooltip(null);
      fillTooltip(null, tooltips(item, data));
    })
    .on('pointermove.tooltip', (e: PointerEvent, d) => {
      const {tooltips, tooltipsEnabled, tooltipPosition: position} = d.markerTooltips
      const item = seriesItemFinder ? seriesItemFinder(<Element>e.target) : <ItemElement>e.target;
      if (!tooltipsEnabled || !item) return;
      const data = select<ItemElement, ItemDatum>(item).datum();
      positionTooltip(null, position(item, data, { x: e.clientX, y: e.clientY }))
    })
    .on('pointerout.tooltip', (e: PointerEvent, d) => {
      const { tooltipsEnabled } = d.markerTooltips
      if (tooltipsEnabled) hideTooltip(null)
    })
}
