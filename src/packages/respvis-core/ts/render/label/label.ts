import {Position} from "../../utilities";
import {Sign} from "../../constants";

export interface Label extends Position {
  text: string
  key: string,
  sign?: Sign,
}
