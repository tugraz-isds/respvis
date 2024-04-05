import {Label} from "../../render/label/todo/series-label";

export type RenderElementArgs = {
  label?: string
  tooltipLabel: string
  styleClass: string
  key: string
}

export type RenderElement = RenderElementArgs & {
  getLabel: () => Label | []
}
