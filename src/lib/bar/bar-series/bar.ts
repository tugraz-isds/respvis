import {Rect} from "../../core";

export type Bar = Rect & {
  xValue: any
  yValue: any
  label: string
  styleClass: string;
  key: string;
}
