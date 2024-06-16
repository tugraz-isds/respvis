import {select, Selection} from 'd3';
import {Position, Size} from 'respvis-core';

const toolTipId = 'tooltip-rv'
export const tooltipSelector = `#${toolTipId}`

export type TooltipUserArgs = {
  active?: boolean
  useAutoPositioning?: boolean
  autoOffset?: number
}
export type TooltipArgs = TooltipUserArgs
type TooltipData = Required<TooltipArgs>

export class Tooltip implements TooltipData {
  useAutoPositioning: boolean;
  autoOffset: number;
  active = true
  seriesTooltipVisible = false
  movableCrossTooltipVisible = false
  constructor(args?: TooltipArgs) {
    this.useAutoPositioning = args?.useAutoPositioning ?? true
    this.autoOffset = args?.autoOffset ?? 8
    this.active = args?.active ?? true
  }
  numberOfVisibleTools() {
    return (this.seriesTooltipVisible ? 1 : 0) +
      (this.movableCrossTooltipVisible ? 1 : 0)
  }
}

export function setTooltipVisibility(visibility: 'visible' | 'hidden') {
  select(tooltipSelector)
    .classed('tooltip--visible', visibility === 'visible')
    .classed('tooltip--hidden', visibility === 'hidden')
}

export interface TooltipPosition {
  position: Position;
  offset?: number;
}

export function positionTooltipAuto(tooltipS: Selection<HTMLDivElement>, config: TooltipPosition) {
  const offset = config.offset || 8
  const position = config.position
  const windowSize: Size = {width: window.innerWidth, height: window.innerHeight};
  const offsetDirection = {
    x: position.x <= windowSize.width / 2 ? 1 : -1,
    y: position.y <= windowSize.height / 2 ? 1 : -1,
  };

  const left = offsetDirection.x >= 0;
  const top = offsetDirection.y >= 0;
  const leftOffset = position.x + offsetDirection.x * offset;
  const rightOffset = windowSize.width - leftOffset;
  const topOffset = position.y + offsetDirection.y * offset;
  const bottomOffset = windowSize.height - topOffset;

  tooltipS
    .style(left ? 'right' : 'left', null)
    .style(left ? 'left' : 'right', `${left ? leftOffset : rightOffset}px`)
    .style(top ? 'bottom' : 'top', null)
    .style(top ? 'top' : 'bottom', `${top ? topOffset : bottomOffset}px`);
}
