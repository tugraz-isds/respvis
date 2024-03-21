import {Selection} from "d3";
import {WindowValid} from "../../core";
import {BarChartArgs, BarChartValid, barChartValidation} from "./bar-chart-validation";
import {barChartRender} from "./bar-chart-render";
import {CartesianChart} from "../../core/render/chart/cartesian-chart/cartesian-chart";

type WindowSelection = Selection<HTMLDivElement, WindowValid & BarChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & BarChartValid>

export type BarChartUserArgs = Omit<BarChartArgs, 'renderer'>

export class BarChart extends CartesianChart {
  public windowSelection: WindowSelection
  public chartSelection?: ChartSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: BarChartUserArgs) {
    super({...data, type: 'bar'})
    const chartData = barChartValidation({...data, renderer: this})
    this.windowSelection = windowSelection as WindowSelection
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  protected override mainRender() {
    super.mainRender()
    barChartRender(this.chartSelection!)
    this.renderAxes()
  }

  protected override addBuiltInListeners() {
    super.addBuiltInListeners()
  }
}
