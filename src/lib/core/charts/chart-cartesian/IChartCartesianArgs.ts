import {AxisValid} from "../../axes";
import {ChartBaseValid} from "../chart-base";

export interface IChartCartesianArgs extends ChartBaseValid {
  xAxis?: Partial<AxisValid>;
  yAxis?: Partial<AxisValid>;
  flipped?: boolean;
}
