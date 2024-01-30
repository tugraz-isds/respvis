import {Selection} from "d3";
import {chartWindowRender, ChartWindowValid, layouterCompute, toolbarRender} from "../../core";
import {BarChartArgs, BarChartValid, barChartValidation} from "./bar-chart-validation";
import {barChartRender} from "./bar-chart-render";
import {CartesianChart} from "../../core/render/charts/chart-cartesian/cartesian-chart";

export type BarChartData = ChartWindowValid & BarChartValid
export type BarChartSelection = Selection<HTMLDivElement, BarChartData>

export type BarChartUserArgs = Omit<BarChartArgs, 'renderer'>

export class BarChart extends CartesianChart {
  public windowSelection: BarChartSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: BarChartUserArgs) {
    super({...data, type: 'bar'})
    const chartData = barChartValidation({...data, renderer: this})
    this.windowSelection = windowSelection as BarChartSelection
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  public render(): void {
    super.render()
    const {
      chartS,
      layouterS
    } = chartWindowRender(this.windowSelection)
    toolbarRender(this.windowSelection)
    barChartRender(chartS)
    const boundsChanged = layouterCompute(layouterS)
    if (boundsChanged) this.render()
  }

  protected override addBuiltInListeners() {
    super.addBuiltInListeners()
  }
}
