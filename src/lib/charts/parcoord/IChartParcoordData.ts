import {Axis, IChartBaseData, ScaleAny} from "../../core";
import {ScalePoint} from "d3";

export interface IChartParcoordData extends IChartBaseData {
  axes: Axis[],
  dimensions: number[][];
  axisScale:  ScalePoint<string>
  scales?: ScaleAny<any, number, number>[];
  styleClasses?: string[];
}
