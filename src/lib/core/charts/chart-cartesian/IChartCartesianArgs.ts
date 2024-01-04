import {AxisData} from "../../axisData";
import {ChartBaseValid} from "../chart-base";

export interface IChartCartesianArgs extends ChartBaseValid {
  xAxis?: Partial<AxisData>;
  yAxis?: Partial<AxisData>;
  flipped?: boolean;
}
