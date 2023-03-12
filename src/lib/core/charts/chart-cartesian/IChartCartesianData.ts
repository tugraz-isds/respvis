import {IChartBaseData} from "../chart-base";
import {Axis} from "../../axis";

export interface IChartCartesianData extends IChartBaseData {
  xAxis: Axis;
  yAxis: Axis;
  flipped?: boolean;
}
