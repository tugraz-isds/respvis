import {Axis, IChartBaseData, ScaleAny} from "../../core";
import {ScalePoint} from "d3";

export type TParcoordDimensionData = {
  values: number[]
  scale: ScaleAny<any, number, number>
  axis: Axis
  styleClass: string
}

export interface IChartParcoordData extends IChartBaseData {
  dimensions: TParcoordDimensionData[]
  axisScale:  ScalePoint<string>
}
