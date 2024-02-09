import {Selection} from "d3";
import {WindowValid} from "../../core";
import {BarChartArgs, BarChartValid, barChartValidation} from "./bar-chart-validation";
import {barChartRender} from "./bar-chart-render";
import {CartesianChart} from "../../core/render/chart/chart-cartesian/cartesian-chart";

export type BarChartData = WindowValid & BarChartValid
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

  protected override mainRender() {
    super.mainRender()
    barChartRender(this.chartSelection)
  }

  protected override addBuiltInListeners() {
    super.addBuiltInListeners()
  }
}
