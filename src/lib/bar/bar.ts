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
      text: this.labelArg.format(this, this.labelArg.value)
    }
  }
  private labelPositionVertical(): (Position & Pick<BarLabel, 'sign'>) {
    const { offset, position, offsetX, offsetY, value } = this.labelArg!
    const yPositive = this.yValue >= 0
    const strategyPositive = (yPositive && position === 'dynamic') || position === 'positive'
    return {
      x: offsetX + this.x + this.width / 2,
      y: offsetY + (strategyPositive ? this.y - offset :
        position === 'center' ? this.y + this.height / 2 :
          this.y + this.height + offset),
      sign: yPositive ? 'positive' : 'negative',
    }
  }
  private labelPositionHorizontal(): (Position & Pick<BarLabel, 'sign'>) {
    const { offset, position, offsetX, offsetY } = this.labelArg!
    const yPositive = this.yValue >= 0
    const strategyPositive = (yPositive && position === 'dynamic') || position === 'positive'
    return {
      x: offsetX + ( strategyPositive ? this.x + this.width + offset :
        position === 'center' ? this.x + this.width / 2 :
          this.x - offset),
      y: offsetY + this.y + this.height / 2,
      sign: yPositive ? 'positive' : 'negative',
    }
  }
}
