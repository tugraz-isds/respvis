import {Selection} from 'd3';
import {WindowValid,} from '../../core';
import {CartesianChart} from "../../core/render/chart/cartesian-chart/cartesian-chart";
import {LineChartArgs, LineChartValid, lineChartValidation} from "./line-chart-validation";
import {lineChartRender} from "./line-chart-render";

export type WindowSelection = Selection<HTMLDivElement, WindowValid & LineChartValid>;
export type ChartSelection = Selection<SVGSVGElement, WindowValid & LineChartValid>;
export type LineChartUserArgs = Omit<LineChartArgs, 'renderer'>

export class LineChart extends CartesianChart {
  public windowSelection: WindowSelection
  public chartSelection?: ChartSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: LineChartUserArgs) {
    super({...data, type: 'line'})
    const chartData = lineChartValidation({...data, renderer: this})
    this.windowSelection = windowSelection as WindowSelection
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  protected override mainRender() {
    super.mainRender()
    lineChartRender(this.chartSelection!)
    this.renderAxes()
  }
}
