import {Position, Rect} from "../core";
import {RenderElement, RenderElementArgs} from "../core/utilities/graphic-elements/render-element";
import {Orientation} from "../core/constants/types";
import {BarLabel, BarLabelArgValid} from "./bar-label";

export type BarArgs = Rect & RenderElementArgs & {
  xValue: any
  yValue: any
  styleClass: string;
  key: string;
  labelArg?: BarLabelArgValid
}

export class Bar implements BarArgs, RenderElement {
  x: number
  y: number
  width: number
  height: number
  xValue: any
  yValue: any
  tooltipLabel: string
  styleClass: string
  key: string
  labelArg?: BarLabelArgValid

  constructor(args: BarArgs) {
    this.x = args.x
    this.y = args.y
    this.width = args.width
    this.height = args.height
    this.xValue = args.xValue
    this.yValue = args.yValue
    this.tooltipLabel = args.tooltipLabel
    this.styleClass = args.styleClass
    this.key = args.key
    this.labelArg = args.labelArg
  }

  getLabel(orientation: Orientation): BarLabel | [] {
    if (!this.labelArg) return []
    return {
      ...(orientation === 'horizontal' ? this.labelPositionHorizontal() : this.labelPositionVertical()),
      key: this.key,
      text: this.labelArg.value
    }
  }
  private labelPositionVertical(): (Position & Pick<BarLabel, 'sign'>) {
    const { offset, position } = this.labelArg!
    const yPositive = this.yValue >= 0
    const strategyPositive = (yPositive && position === 'dynamic') || position === 'positive'
    return {
      x: this.x + this.width / 2,
      y: strategyPositive ? this.y - offset : this.y + this.height + offset,
      sign: yPositive ? 'positive' : 'negative',
    }
  }
  private labelPositionHorizontal(): (Position & Pick<BarLabel, 'sign'>) {
    const { offset, position } = this.labelArg!
    const yPositive = this.yValue >= 0
    const strategyPositive = (yPositive && position === 'dynamic') || position === 'positive'
    return {
      x: strategyPositive ? this.x + this.width + offset : this.x - offset,
      y: this.y + this.height / 2,
      sign: yPositive ? 'positive' : 'negative',
    }
  }
}
