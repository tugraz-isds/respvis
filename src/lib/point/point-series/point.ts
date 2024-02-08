import {Circle} from "../../core";

export interface Point extends Circle {
  xValue: any
  yValue: any
  label: string
  radiusValue?: any
  styleClass: string
  key: string
}
