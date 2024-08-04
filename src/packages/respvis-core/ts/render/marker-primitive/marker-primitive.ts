import {Label} from "../label";
import {Orientation, Polarity} from "../../constants";
import {Key} from "../../utilities";

export interface MarkerPrimitiveArgs {
  key: Key
  styleClass: string
  category?: string
  categoryFormatted?: string
}

//TODO: extend Position
export interface MarkerPrimitive extends MarkerPrimitiveArgs {
  getLabel: (orientation: Orientation) => Label | []
  polarity?: Polarity
}
