import {select, Selection} from 'd3';
import {Position} from 'respvis-core';
import {tooltipContent, tooltipHide, tooltipPosition, TooltipPositionConfig, tooltipShow,} from './tooltip';

export interface SeriesConfigTooltips<ItemElement extends Element, ItemDatum> {
  tooltipsEnabled: boolean;
  tooltips: (item: ItemElement, data: ItemDatum) => string;
  tooltipPosition: (
    item: ItemElement,
    data: ItemDatum,
    mousePosition: Position
  ) => TooltipPositionConfig;
}

type WithSeriesTooltips<ItemElement extends Element, ItemDatum> = {
  markerTooltips: SeriesConfigTooltips<ItemElement, ItemDatum>
}

export function seriesConfigTooltipsData<ItemElement extends Element, ItemDatum>(
  data?: Partial<SeriesConfigTooltips<ItemElement, ItemDatum>>
): SeriesConfigTooltips<Element, any> {
  return {
    tooltipsEnabled: data?.tooltipsEnabled ?? true,
    tooltips: data?.tooltips || ((data) => 'Tooltip'),
    tooltipPosition:
      data?.tooltipPosition || ((item, data, mousePosition) => ({ position: mousePosition })),
  };
}

export function seriesConfigTooltipsHandleEvents<ItemElement extends Element, ItemDatum>(
  seriesSelection: Selection<Element, WithSeriesTooltips<ItemElement, ItemDatum>>,
  seriesItemFinder?: (eventTarget: Element) => ItemElement | null
): void {
  seriesSelection
    .on('pointerover.tooltip', (e, d) => {
      const {tooltips, tooltipsEnabled} = d.markerTooltips
      const item = seriesItemFinder ? seriesItemFinder(<Element>e.target) : <ItemElement>e.target;
      if (!tooltipsEnabled || !item) return;
      const data = select<ItemElement, ItemDatum>(item).datum();
      tooltipShow(null);
      tooltipContent(null, tooltips(item, data));
    })
    .on('pointermove.tooltip', (e: PointerEvent, d) => {
      const {tooltips, tooltipsEnabled, tooltipPosition: position} = d.markerTooltips
      const item = seriesItemFinder ? seriesItemFinder(<Element>e.target) : <ItemElement>e.target;
      if (!tooltipsEnabled || !item) return;
      const data = select<ItemElement, ItemDatum>(item).datum();
      tooltipPosition(null, position(item, data, { x: e.clientX, y: e.clientY }))
    })
    .on('pointerout.tooltip', (e: PointerEvent, d) => {
      const { tooltipsEnabled } = d.markerTooltips
      if (tooltipsEnabled) tooltipHide(null)
    })
}