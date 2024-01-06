import {ChartBaseValid} from "../chart-base";
import {AxisValid} from "../../axes";

export interface IChartCartesianData extends ChartBaseValid {
  xAxis: AxisValid;
  yAxis: AxisValid;
  flipped?: boolean;
}
