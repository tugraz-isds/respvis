import {Axis} from "../../axis";
import {IChartBaseData} from "../chart-base";

export interface IChartCartesianArgs extends IChartBaseData {
  xAxis?: Partial<Axis>;
  yAxis?: Partial<Axis>;
  flipped?: boolean;
}
