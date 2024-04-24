import {Selection} from 'd3';
import {cartesianAxisRender, cartesianGridRender} from '../../cartesian';
import {CartesianChart} from "../../cartesian/cartesian-chart/cartesian-chart";
import {LineChartArgs, LineChartValid, lineChartValidation} from "./line-chart-validation";
import {lineChartRender} from "./line-chart-render";
import {originLineRender} from "../../cartesian/cartesian-chart/cartesian-chart-render/cartesian-chart-render";
import {WindowValid} from "../../core";

export type WindowSelection = Selection<HTMLDivElement, WindowValid & LineChartValid>;
export type ChartSelection = Selection<SVGSVGElement, WindowValid & LineChartValid>;
export type LineChartUserArgs = Omit<LineChartArgs, 'renderer'>

export class LineChart extends CartesianChart {
  public windowS: WindowSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: LineChartUserArgs) {
    super({...data, type: 'line'})
    const chartData = lineChartValidation({...data, renderer: this})
    this.windowS = windowSelection as WindowSelection
    this.windowS.datum({...this.initialWindowData, ...chartData})
  }

  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override mainRender() {
    super.mainRender()
    lineChartRender(this.chartS!)
    this.chartS.call(cartesianAxisRender)
    this.chartS.call(originLineRender)
    this.chartS.call(cartesianGridRender)
  }
}
