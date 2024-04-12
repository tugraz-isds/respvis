import {Label} from "../../render/label/todo/series-label";
import {Orientation} from "../../constants/types";

export type RenderElementArgs = {
  tooltipLabel: string
  styleClass: string
  key: string
}

export type RenderElement = RenderElementArgs & {
  getLabel: (orientation: Orientation) => Label | []
}
