import {VisualPrimitive} from "../primitive";
import {Position} from "../../utilities/geometry/position";

export interface Label extends Position {
  text: string
  primitive: VisualPrimitive
}
