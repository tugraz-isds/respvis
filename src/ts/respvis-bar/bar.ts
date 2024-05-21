import {Label, Orientation, Position, Rect, RenderElement, RenderElementArgs} from "respvis-core";
import {BarLabel, BarLabelData} from "./bar-label";

export type BarArgs = Rect & RenderElementArgs & {
  xValue: any
  yValue: any
  styleClass: string;
  key: string;
  label?: BarLabelData
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
  labelData?: BarLabelData

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
    this.labelData = args.label
  }

  getLabel(orientation: Orientation): BarLabel | [] {
    if (!this.labelData) return []
    return {
      ...this.labelData,
      ...(orientation === 'horizontal' ? this.getLabelPositionHorizontal() : this.getLabelPositionVertical()),
      key: this.key,
      text: this.labelData.format(this, this.labelData.value)
    }
  }
  private getLabelPositionVertical(): (Position & Pick<Label, 'sign'>) {
    const { offset, positionStrategy, offsetX, offsetY } = this.labelData!
    const yPositive = this.yValue >= 0
    const strategyPositive = (yPositive && positionStrategy === 'dynamic') || positionStrategy === 'positive'
    return {
      x: offsetX + this.x + this.width / 2,
      y: offsetY + (strategyPositive ? this.y - offset :
        positionStrategy === 'center' ? this.y + this.height / 2 :
          this.y + this.height + offset),
      sign: yPositive ? 'positive' : 'negative',
    }
  }
  private getLabelPositionHorizontal(): (Position & Pick<Label, 'sign'>) {
    const { offset, positionStrategy, offsetX, offsetY } = this.labelData!
    const yPositive = this.yValue >= 0
    const strategyPositive = (yPositive && positionStrategy === 'dynamic') || positionStrategy === 'positive'
    return {
      x: offsetX + ( strategyPositive ? this.x + this.width + offset :
        positionStrategy === 'center' ? this.x + this.width / 2 :
          this.x - offset),
      y: offsetY + this.y + this.height / 2,
      sign: yPositive ? 'positive' : 'negative',
    }
  }
}
