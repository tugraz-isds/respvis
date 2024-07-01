import {Circle, Key, Position, VisualPrimitive, VisualPrimitiveArgs} from "respvis-core";
import {PointLabel, PointLabelData} from "./point-label";

export type PointArgs = Circle & VisualPrimitiveArgs & {
  xValue: any
  yValue: any
  radiusValue?: any
  colorValue?: any
  label?: PointLabelData
}

export class Point implements Circle, VisualPrimitive {
  xValue: any
  yValue: any
  center: Position;
  category?: string
  categoryFormatted?: string
  radius: number;
  radiusValue?: any
  color?: number | undefined;
  colorValue?: any;
  styleClass: string
  key: Key
  labelData?: PointLabelData

  constructor(args: PointArgs) {
    this.xValue = args.xValue
    this.yValue = args.yValue
    this.category = args.category
    this.categoryFormatted = args.categoryFormatted
    this.radiusValue = args.radiusValue
    this.styleClass = args.styleClass
    this.key = args.key
    this.center = args.center
    this.radius = args.radius
    this.color = args.color
    this.colorValue = args.colorValue
    this.labelData = args.label
  }

  getLabel(): PointLabel | [] {
    if (!this.labelData) return []
    return {
      ...this.labelData,
      x: this.getLabelX(),
      y: this.getLabelY(),
      primitive: this,
      text: this.labelData.format(this, this.labelData.value),
    }
  }

  private getLabelX() {
    const {positionStrategyHorizontal, offset} = this.labelData!
    return positionStrategyHorizontal === 'left' ? this.center.x - this.radius - offset :
      positionStrategyHorizontal === 'right' ? this.center.x + this.radius + offset :
        this.center.x
  }

  private getLabelY() {
    const {positionStrategyVertical, offset} = this.labelData!
    return positionStrategyVertical === 'top' ? this.center.y - this.radius - offset :
      positionStrategyVertical === 'bottom' ? this.center.y + this.radius + offset :
        this.center.y
  }
}
