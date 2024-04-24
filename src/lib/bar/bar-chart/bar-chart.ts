import {Selection} from "d3";
import {cartesianAxisRender} from "../../cartesian";
import {BarChartArgs, BarChartValid, barChartValidation} from "./bar-chart-validation";
import {barChartRender} from "./bar-chart-render";
import {CartesianChart} from "../../cartesian/cartesian-chart/cartesian-chart";
import {originLineRender} from "../../cartesian/cartesian-chart/cartesian-chart-render/cartesian-chart-render";
import {WindowValid} from "../../core";

type WindowSelection = Selection<HTMLDivElement, WindowValid & BarChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & BarChartValid>

export type BarChartUserArgs = Omit<BarChartArgs, 'renderer'>

export class BarChart extends CartesianChart {
  public windowS: WindowSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: BarChartUserArgs) {
    super({...data, type: 'bar'})
    const chartData = barChartValidation({...data, renderer: this})
    this.windowS = windowSelection as WindowSelection
    this.windowS.datum({...this.initialWindowData, ...chartData})
  }

  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override mainRender() {
    super.mainRender()
    barChartRender(this.chartS!)
    this.chartS.call(cartesianAxisRender)
    this.chartS.call(cartesianAxisRender)
    this.chartS.call(originLineRender)
  }

  protected override addBuiltInListeners() {
    super.addBuiltInListeners()
  }
}
