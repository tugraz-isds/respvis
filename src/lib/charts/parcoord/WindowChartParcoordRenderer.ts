import {IWindowChartBaseRenderer} from "../../core/charts/chart-base/IWindowChartBaseRenderer";
import * as ParcoordData from "./window-chart-parcoord-data";
import {IWindowChartParcoordArgs} from "./IWindowChartParcoordArgs";
import {Selection} from "d3";
import {IChartBaseData} from "../../core";
import {WindowChartParcoordData} from "./window-chart-parcoord-data";

export class WindowChartParcoordRenderer implements IWindowChartBaseRenderer {
  data: ParcoordData.WindowChartParcoordData;

  constructor(public selection: Selection<HTMLDivElement, WindowChartParcoordData>, data: IWindowChartParcoordArgs) {
    this.data = ParcoordData.windowChartParcoordData(data)
  }
  addCustomListener(name: string, callback: (selection: Selection<HTMLDivElement, IChartBaseData>, data: IChartBaseData) => void): void {
  }

  buildWindowChart(): void {
  }

}
