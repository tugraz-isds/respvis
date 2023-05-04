import {IChartBaseData} from "../../index";
import {Selection} from "d3";

export interface IWindowChartBaseRenderer {
  selection: Selection<HTMLDivElement, IChartBaseData>
  data: IChartBaseData
  buildWindowChart: () => void,
  addCustomListener: (
    name: string,
    callback: (event: Event, data: IChartBaseData) => void
  ) => void
}
