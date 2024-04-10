import {Circle, Position} from "../../core";
import {RenderElement, RenderElementArgs} from "../../core/utilities/graphic-elements/render-element";
import {PointLabel, PointLabelArgValid} from "../point-label";

export type PointArgs = Circle & RenderElementArgs & {
  xValue: any
  yValue: any
  radiusValue?: any
  labelArg?: PointLabelArgValid
}

export class Point implements Circle, RenderElement {
  xValue: any
  yValue: any
  tooltipLabel: string
  radiusValue?: any
  styleClass: string
  key: string
  center: Position;
  radius: number;
  color?: string | undefined;
  labelArg?: PointLabelArgValid

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
    this.labelArg = args.labelArg
  }

  getLabel(): PointLabel | [] {
    if (!this.labelArg) return []
    return {
      x: this.getLabelX(),
      y: this.getLabelY(),
      key: this.key,
      text: this.labelArg.value,
    }
  }

  private getLabelX() {
    const {positionHorizontal, offset} = this.labelArg!
    return positionHorizontal === 'left' ? this.center.x - this.radius - offset :
      positionHorizontal === 'right' ? this.center.x + this.radius + offset :
        this.center.x
  }

  private getLabelY() {
    const {positionVertical, offset} = this.labelArg!
    return positionVertical === 'top' ? this.center.y - this.radius - offset :
      positionVertical === 'bottom' ? this.center.y + this.radius + offset :
        this.center.y
  }
}
