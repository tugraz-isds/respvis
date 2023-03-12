import {IWindowChartParcoordArgs} from "./IWindowChartParcoordArgs";
import {parcoordData} from "./chart-parcoord-data";

export interface WindowChartParcoordData {}

export function windowChartParcoordData(data: IWindowChartParcoordArgs): WindowChartParcoordData {
  const chartData = parcoordData(data);
  return {
    ...chartData,
  };
}


