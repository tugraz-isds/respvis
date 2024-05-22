import {Position} from "respvis-core/utilities";
import {Sign} from "respvis-core/constants";

export interface Label extends Position {
  text: string
  key: string,
  sign?: Sign,
}
