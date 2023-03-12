import {Axis, ScaleAny} from "../../core";

export interface IChartParcoordData {
  axes: Axis[],
  dimensions: number[][];
  scales?: ScaleAny<any, number, number>[];
  styleClasses?: string[];
}
