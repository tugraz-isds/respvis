import {IChartBaseData} from "../chart-base";
import {AxisData} from "../../axisData";

export interface IChartCartesianData extends IChartBaseData {
  xAxis: AxisData;
  yAxis: AxisData;
  flipped?: boolean;
}
