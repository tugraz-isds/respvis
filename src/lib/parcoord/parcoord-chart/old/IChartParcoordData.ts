import {AxisValid, ChartBaseValid, ScaleAny} from "../../../core";
import {ScalePoint} from "d3";

export type TParcoordDimensionData = {
  values: number[]
  scale: ScaleAny<any, number, number>
  axis: AxisValid
  styleClass: string
}

export interface IChartParcoordData extends ChartBaseValid {
  dimensions: TParcoordDimensionData[]
  axisScale:  ScalePoint<string>
}
