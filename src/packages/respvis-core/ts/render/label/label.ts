import {MarkerPrimitive} from "../marker-primitive";
import {Position} from "../../utilities/geometry/position";

export interface Label extends Position {
  text: string
  marker: MarkerPrimitive
}
