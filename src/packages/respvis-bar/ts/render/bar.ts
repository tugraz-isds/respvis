import {Orientation, Polarity, Position, Rect, VisualPrimitive, VisualPrimitiveArgs} from "respvis-core";
import {BarLabel, BarLabelData} from "./bar-label";

export type BarArgs = Rect & VisualPrimitiveArgs & {
  xValue: any
  yValue: any
  label?: BarLabelData
}

export class Bar implements BarArgs, VisualPrimitive {
  x: number
  y: number
  width: number
  height: number
  xValue: any
  yValue: any
  category?: string
  categoryFormatted?: string
  styleClass: string
  key: string
  labelData?: BarLabelData
  polarity: Polarity

  constructor(args: BarArgs) {
    this.x = args.x
    this.y = args.y
    this.width = args.width
    this.height = args.height
    this.xValue = args.xValue
    this.yValue = args.yValue
    this.category = args.category
    this.categoryFormatted = args.categoryFormatted
    this.styleClass = args.styleClass
    this.key = args.key
    this.labelData = args.label
    this.polarity = this.yValue >= 0 ? 'positive' : 'negative'
  }

  getLabel(orientation: Orientation): BarLabel | [] {
    if (!this.labelData) return []
    return {
      ...this.labelData,
      ...(orientation === 'horizontal' ? this.getLabelPositionHorizontal() : this.getLabelPositionVertical()),
      primitive: this,
      text: this.labelData.format(this, this.labelData.value)
    }
  }
  private getLabelPositionVertical(): Position {
    const { offset, positionStrategy, offsetX, offsetY } = this.labelData!
    const yPositive = this.yValue >= 0
    const strategyPositive = (yPositive && positionStrategy === 'dynamic') || positionStrategy === 'positive'
    return {
      x: offsetX + this.x + this.width / 2,
      y: offsetY + (strategyPositive ? this.y - offset :
        positionStrategy === 'center' ? this.y + this.height / 2 :
          this.y + this.height + offset),
    }
  }
  private getLabelPositionHorizontal(): Position {
    const { offset, positionStrategy, offsetX, offsetY } = this.labelData!
    const yPositive = this.yValue >= 0
    const strategyPositive = (yPositive && positionStrategy === 'dynamic') || positionStrategy === 'positive'
    return {
      x: offsetX + ( strategyPositive ? this.x + this.width + offset :
        positionStrategy === 'center' ? this.x + this.width / 2 :
          this.x - offset),
      y: offsetY + this.y + this.height / 2,
    }
  }
}
