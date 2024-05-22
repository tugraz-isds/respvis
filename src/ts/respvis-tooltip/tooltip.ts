import {select, Selection} from 'd3';
import {Position, Size} from 'respvis-core';

export function selectOrCreateTooltip(): Selection<HTMLDivElement> {
  const tooltipSelection = select<HTMLDivElement, unknown>('.tooltip');
  return tooltipSelection.size() > 0
    ? tooltipSelection
    : select(document.body)
      .append('div')
      .classed('tooltip', true)
}

export function showTooltip(tooltipSelection: Selection<HTMLDivElement> | null) {
  tooltipSelection = tooltipSelection || selectOrCreateTooltip();
  tooltipSelection.classed('show', true);
}

export function hideTooltip(tooltipSelection: Selection<HTMLDivElement> | null) {
  tooltipSelection = tooltipSelection || selectOrCreateTooltip();
  tooltipSelection.classed('show', false);
}

export function fillTooltip(
  tooltipSelection: Selection<HTMLDivElement> | null,
  content: string
) {
  tooltipSelection = tooltipSelection || selectOrCreateTooltip();
  tooltipSelection.html(content);
}

export interface TooltipPositionConfig {
  position: Position;
  offset?: number;
  offsetDirection?: Position;
}

export function positionTooltip(
  tooltipSelection: Selection<HTMLDivElement> | null,
  config: TooltipPositionConfig
) {
  let {position, offset, offsetDirection} = config;
  tooltipSelection = tooltipSelection || selectOrCreateTooltip();

  offset = offset || 8;

  const windowSize: Size = {width: window.innerWidth, height: window.innerHeight};
  offsetDirection = config.offsetDirection || {
    x: position.x <= windowSize.width / 2 ? 1 : -1,
    y: position.y <= windowSize.height / 2 ? 1 : -1,
  };

  const left = offsetDirection.x >= 0;
  const top = offsetDirection.y >= 0;
  const leftOffset = position.x + offsetDirection.x * offset;
  const rightOffset = windowSize.width - leftOffset;
  const topOffset = position.y + offsetDirection.y * offset;
  const bottomOffset = windowSize.height - topOffset;

  tooltipSelection
    .style(left ? 'right' : 'left', null)
    .style(left ? 'left' : 'right', `${left ? leftOffset : rightOffset}px`)
    .style(top ? 'bottom' : 'top', null)
    .style(top ? 'top' : 'bottom', `${top ? topOffset : bottomOffset}px`);
}
