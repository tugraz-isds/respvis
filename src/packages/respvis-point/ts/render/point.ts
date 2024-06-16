import {Circle, Position, Primitive, PrimitiveArgs} from "respvis-core";
import {PointLabel, PointLabelData} from "./point-label";

export type PointArgs = Circle & PrimitiveArgs & {
  xValue: any
  yValue: any
  radiusValue?: any
  label?: PointLabelData
}

export class Point implements Circle, Primitive {
  xValue: any
  yValue: any
  tooltipLabel: string
  radiusValue?: any
  styleClass: string
  key: string
  center: Position;
  radius: number;
  color?: string | undefined;
  labelData?: PointLabelData

  constructor(args: PointArgs) {
    this.xValue = args.xValue
    this.yValue = args.yValue
    this.tooltipLabel = args.tooltipLabel
    this.radiusValue = args.radiusValue
    this.styleClass = args.styleClass
    this.key = args.key
    this.center = args.center
    this.radius = args.radius
    this.color = args.color
    this.labelData = args.label
  }

  getLabel(): PointLabel | [] {
    if (!this.labelData) return []
    return {
      ...this.labelData,
      x: this.getLabelX(),
      y: this.getLabelY(),
      key: this.key,
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
