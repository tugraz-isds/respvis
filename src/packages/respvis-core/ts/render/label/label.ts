import {Position, VisualPrimitive} from "../../utilities";

export interface Label extends Position {
  text: string
  primitive: VisualPrimitive
}
