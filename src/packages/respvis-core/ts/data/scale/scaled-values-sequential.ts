import {ScaleSequential} from "d3";

export interface ScaledValuesSequential {
  values: number[]
  scale: ScaleSequential<number, number>
}
