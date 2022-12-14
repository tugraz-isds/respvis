import { select, Selection } from 'd3';
import { Position } from '../core/utilities/position';
import { Size } from '../core/utilities/size';

export function tooltip(selection: Selection<HTMLDivElement>): void {
  selection.classed('tooltip', true);
}

export function tooltipSelectOrCreate(): Selection<HTMLDivElement> {
  const tooltipSelection = select<HTMLDivElement, unknown>('.tooltip');
  return tooltipSelection.size() > 0
    ? tooltipSelection
    : select(document.body)
        .append('div')
        .call((s) => tooltip(s));
}

export function tooltipShow(tooltipSelection: Selection<HTMLDivElement> | null) {
  tooltipSelection = tooltipSelection || tooltipSelectOrCreate();
  tooltipSelection.classed('show', true);
}

export function tooltipHide(tooltipSelection: Selection<HTMLDivElement> | null) {
  tooltipSelection = tooltipSelection || tooltipSelectOrCreate();
  tooltipSelection.classed('show', false);
}

export function tooltipContent(
  tooltipSelection: Selection<HTMLDivElement> | null,
  content: string
) {
  tooltipSelection = tooltipSelection || tooltipSelectOrCreate();
  tooltipSelection.html(content);
}

export interface TooltipPositionConfig {
  position: Position;
  offset?: number;
  offsetDirection?: Position;
}

export function tooltipPosition(
  tooltipSelection: Selection<HTMLDivElement> | null,
  config: TooltipPositionConfig
) {
  let { position, offset, offsetDirection } = config;
  tooltipSelection = tooltipSelection || tooltipSelectOrCreate();

  offset = offset || 8;

  const windowSize: Size = { width: window.innerWidth, height: window.innerHeight };
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
