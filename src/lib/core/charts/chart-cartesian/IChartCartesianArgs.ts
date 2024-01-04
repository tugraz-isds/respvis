import {AxisData} from "../../axisData";
import {IChartBaseData} from "../chart-base";

export interface IChartCartesianArgs extends IChartBaseData {
  xAxis?: Partial<AxisData>;
  yAxis?: Partial<AxisData>;
  flipped?: boolean;
}
