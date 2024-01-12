import {ChartBaseValid} from "../../index";
import {Selection} from "d3";

export interface IWindowChartBaseRenderer {
  selection: Selection<HTMLDivElement, ChartBaseValid>
  data: ChartBaseValid
  buildWindowChart: () => void,
  addCustomListener: (
    name: string,
    callback: (event: Event, data: ChartBaseValid) => void
  ) => void
}
