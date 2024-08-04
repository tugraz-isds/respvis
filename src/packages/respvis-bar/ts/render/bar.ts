import {Key, MarkerPrimitive, MarkerPrimitiveArgs, Orientation, Polarity, Position, Rect} from "respvis-core";
import {BarLabel, BarLabelData} from "./bar-label";

export type BarArgs = Rect & MarkerPrimitiveArgs & {
  xValue: any
  yValue: any
  label?: BarLabelData
  inverted?: boolean
}

export class Bar implements BarArgs, MarkerPrimitive {
  x: number
  y: number
  width: number
  height: number
  xValue: any
  yValue: any
  category?: string
  categoryFormatted?: string
  styleClass: string
  key: Key
  labelData?: BarLabelData
  polarity: Polarity
  inverted: boolean

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
    this.inverted = args.inverted ?? false
    this.polarity = this.positionOnTop() ? 'positive' : 'negative'
  }

  getLabel(orientation: Orientation): BarLabel | [] {
    if (!this.labelData) return []
    return {
      ...this.labelData,
      ...(orientation === 'horizontal' ? this.getLabelPositionHorizontal() : this.getLabelPositionVertical()),
      marker: this,
      text: this.labelData.format(this, this.labelData.value)
    }
  }
  private getLabelPositionVertical(): Position {
    const { offset, positionStrategy, offsetX, offsetY } = this.labelData!
    return {
      x: offsetX + this.x + this.width / 2,
      y: offsetY + this.y + (positionStrategy === 'center' ? this.height / 2 :
        this.positionOnTop() ? (-1 * offset) : (this.height + offset)),
    }
  }
  private getLabelPositionHorizontal(): Position {
    const { offset, positionStrategy, offsetX, offsetY } = this.labelData!
    return {
      x: offsetX + this.x + (positionStrategy === 'center' ? this.width / 2 :
        this.positionOnTop() ? (this.width + offset) : (-1 * offset)),
      y: offsetY + this.y + this.height / 2,
    }
  }
  private positionOnTop() {
    const positionStrategy = this.labelData?.positionStrategy ?? 'dynamic'
    const yPositive = this.yValue >= 0
    return ((this.inverted !== yPositive) && positionStrategy === 'dynamic') ||
      (!this.inverted && positionStrategy === 'positive') ||
      (this.inverted && positionStrategy === 'negative')
  }
}
