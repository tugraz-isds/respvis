import {Label} from "../../render/label";
import {Orientation} from "../../constants";

export type RenderElementArgs = {
  tooltipLabel: string
  styleClass: string
  key: string
}

export type RenderElement = RenderElementArgs & {
  getLabel: (orientation: Orientation) => Label | []
}
