import {Rect} from "../../core";
import {RenderElement, RenderElementArgs} from "../../core/utilities/graphic-elements/render-element";
import {Label} from "../../core/render/label/todo/series-label";

export type BarArgs = Rect & RenderElementArgs & {
  xValue: any
  yValue: any
  styleClass: string;
  key: string;
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
  label?: string

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
    this.label = args.label
  }

  getLabel(): Label | [] {
    return this.label ? {
      x: this.x + this.width / 2,
      y: this.y - 13,
      key: this.key,
      text: this.label
    } : []
  }
}
