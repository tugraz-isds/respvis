import {Circle, Position} from "../../core";
import {RenderElement, RenderElementArgs} from "../../core/utilities/graphic-elements/render-element";
import {Label} from "../../core/render/label/todo/series-label";

export type PointArgs = Circle & RenderElementArgs & {
  xValue: any
  yValue: any
  radiusValue?: any
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
  label?: string

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
    this.label = args.label
  }

  getLabel(): Label | [] {
    return this.label ? {
      x: this.center.x,
      y: this.center.y - this.radius - 13,
      key: this.key,
      text: this.label
    } : []
  }
}
