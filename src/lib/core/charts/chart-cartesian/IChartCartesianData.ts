import {ChartBaseValid} from "../chart-base";
import {AxisData} from "../../axisData";

export interface IChartCartesianData extends ChartBaseValid {
  xAxis: AxisData;
  yAxis: AxisData;
  flipped?: boolean;
}
