import {select, Selection} from 'd3';
import {Position, Size} from 'respvis-core';

const toolTipId = 'tooltip-rv'
export const tooltipSelector = `#${toolTipId}`
export const tooltipPositionStrategies = ['none', 'sticky'] as const
export type TooltipPositionStrategy = typeof tooltipPositionStrategies[number]

export type TooltipUserArgs = {
  active?: boolean
  positionStrategySeries?: TooltipPositionStrategy
  positionStrategyInspect?: TooltipPositionStrategy
  autoOffset?: number
}
export type TooltipArgs = TooltipUserArgs
type TooltipData = Required<TooltipArgs>

export class Tooltip implements TooltipData {
  positionStrategySeries: TooltipPositionStrategy;
  positionStrategyInspect: TooltipPositionStrategy;
  autoOffset: number;
  active = true
  seriesTooltipVisible = false
  movableCrossTooltipVisible = false
  constructor(args?: TooltipArgs) {
    this.positionStrategySeries = args?.positionStrategySeries ?? 'sticky'
    this.positionStrategyInspect = args?.positionStrategyInspect ?? 'sticky'
    this.autoOffset = args?.autoOffset ?? 8
    this.active = args?.active ?? true
  }
  isVisible() {
    return this.seriesTooltipVisible || this.movableCrossTooltipVisible
  }
  applyPositionStrategy(e: PointerEvent, positionStrategy: TooltipPositionStrategy) {
    const tooltipS = select<HTMLDivElement, any>(tooltipSelector)
    const mousePosition = { x: e.clientX, y: e.clientY }
    switch (positionStrategy) {
      case 'sticky': {
        updateTooltipPositionCSSVars(tooltipS, {position: mousePosition, offset: this.autoOffset})
      } break;
      case "none": default: {}
    }
    tooltipPositionStrategies.forEach(strategy => {
      tooltipS.classed(`tooltip-position-${strategy}`, false)
    })
    tooltipS.classed(`tooltip-position-${positionStrategy}`, true)
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

export function updateTooltipPositionCSSVars(tooltipS: Selection<HTMLDivElement>, config: TooltipPosition) {
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
    .style('--place-left', left ? ' ' : 'initial')
    .style('--place-right', !left ? ' ' : 'initial')
    .style('--place-top', top ? ' ' : 'initial')
    .style('--place-bottom', !top ? ' ' : 'initial')
    .style('--left-offset', leftOffset + 'px')
    .style('--right-offset', rightOffset + 'px')
    .style('--top-offset', topOffset + 'px')
    .style('--bottom-offset', bottomOffset + 'px')
}
