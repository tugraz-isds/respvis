import {Label} from "../label";
import {Orientation, Polarity} from "../../constants";

export interface VisualPrimitiveArgs {
  category?: string
  categoryFormatted?: string
  styleClass: string
  key: string
}

export interface VisualPrimitive extends VisualPrimitiveArgs {
  getLabel: (orientation: Orientation) => Label | []
  polarity?: Polarity
}
