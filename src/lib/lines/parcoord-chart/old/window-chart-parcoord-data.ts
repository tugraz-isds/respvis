import {IChartParcoordArgs} from "./IChartParcoordArgs";
import {parcoordData} from "./chart-parcoord-data";
import {IChartParcoordData} from "./IChartParcoordData";

export function windowChartParcoordData(data: IChartParcoordArgs): IChartParcoordData {
  const chartData = parcoordData(data);
  return {
    ...chartData,
  };
}


