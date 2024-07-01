import {Label} from "../label";
import {Orientation, Polarity} from "../../constants";
import {Key} from "../../utilities";

export interface VisualPrimitiveArgs {
  category?: string
  categoryFormatted?: string
  styleClass: string
  key: Key
}

export interface VisualPrimitive extends VisualPrimitiveArgs {
  getLabel: (orientation: Orientation) => Label | []
  polarity?: Polarity
}
