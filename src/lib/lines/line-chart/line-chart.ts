import {Selection} from 'd3';
import {chartWindowRender, ChartWindowValid, layouterCompute, toolbarRender,} from '../../core';
import {CartesianChart} from "../../core/render/charts/chart-cartesian/cartesian-chart";
import {LineChartArgs, LineChartValid, lineChartValidation} from "./line-chart-validation";
import {lineChartRender} from "./line-chart-render";

export type LineChartSelection = Selection<HTMLDivElement, ChartWindowValid & LineChartValid>;
export type LineChartUserArgs = Omit<LineChartArgs, 'renderer'>

export class LineChart extends CartesianChart {
  public windowSelection: LineChartSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: LineChartUserArgs) {
    super({...data, type: 'line'})
    const chartData = lineChartValidation({...data, renderer: this})
    this.windowSelection = windowSelection as LineChartSelection
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  public render(): void {
    super.render()
    const {
      chartS,
      layouterS
    } = chartWindowRender(this.windowSelection)
    toolbarRender(this.windowSelection)
    lineChartRender(chartS)
    const boundsChanged = layouterCompute(layouterS)
    if (boundsChanged) this.render()
  }

  protected override addBuiltInListeners() {
    super.addBuiltInListeners()
  }
}
