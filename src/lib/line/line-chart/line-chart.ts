import {Selection} from 'd3';
import {WindowValid,} from '../../core';
import {CartesianChart} from "../../core/render/chart/chart-cartesian/cartesian-chart";
import {LineChartArgs, LineChartValid, lineChartValidation} from "./line-chart-validation";
import {lineChartRender} from "./line-chart-render";

export type LineChartSelection = Selection<HTMLDivElement, WindowValid & LineChartValid>;
export type LineChartUserArgs = Omit<LineChartArgs, 'renderer'>

export class LineChart extends CartesianChart {
  public windowSelection: LineChartSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: LineChartUserArgs) {
    super({...data, type: 'line'})
    const chartData = lineChartValidation({...data, renderer: this})
    this.windowSelection = windowSelection as LineChartSelection
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  protected override mainRender() {
    super.mainRender()
    lineChartRender(this.chartSelection)
  }
}
