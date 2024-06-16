import {Label} from "../label";
import {Orientation} from "../../constants";

export type PrimitiveArgs = {
  tooltipLabel: string
  styleClass: string
  key: string
}

export type Primitive = PrimitiveArgs & {
  getLabel: (orientation: Orientation) => Label | []
}
