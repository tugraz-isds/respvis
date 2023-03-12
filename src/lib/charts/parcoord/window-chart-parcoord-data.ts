import {IWindowChartParcoordArgs} from "./IWindowChartParcoordArgs";
import {parcoordData} from "./chart-parcoord-data";
import {IChartParcoordData} from "./IChartParcoordData";

export function windowChartParcoordData(data: IWindowChartParcoordArgs): IChartParcoordData {
  const chartData = parcoordData(data);
  return {
    ...chartData,
  };
}


