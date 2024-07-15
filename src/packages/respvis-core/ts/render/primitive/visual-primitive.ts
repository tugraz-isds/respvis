import {Label} from "../label";
import {Orientation, Polarity} from "../../constants";
import {CompositeKey} from "../../utilities";

export interface VisualPrimitiveArgs {
  category?: string
  categoryFormatted?: string
  styleClass: string
  key: CompositeKey
}

export interface VisualPrimitive extends VisualPrimitiveArgs {
  getLabel: (orientation: Orientation) => Label | []
  polarity?: Polarity
}
