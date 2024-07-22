import {Label} from "../label";
import {Orientation, Polarity} from "../../constants";
import {Key} from "../../utilities";

export interface MarkerPrimitiveArgs {
  category?: string
  categoryFormatted?: string
  styleClass: string
  key: Key
}

//TODO: extend Position
export interface MarkerPrimitive extends MarkerPrimitiveArgs {
  getLabel: (orientation: Orientation) => Label | []
  polarity?: Polarity
}
