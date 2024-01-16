import {Chart} from "../../core/render/charts/chart";
import {Selection} from "d3";
import {
  chartPointData,
  ChartPointUserArgs,
  ChartPointValid,
  scatterPlotRender,
  ScatterplotSelection
} from "../../points";
import {
  ChartBaseValid,
  chartWindowRender,
  ChartWindowValid,
  layouterCompute,
  rectFromString,
  resizeEventListener,
  toolbarRender
} from "../../core";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {getMaxRadius} from "../../core/data/radius/radius-util";
import {addZoom} from "../../core/data/zoom";
import {barChartValidation, chartBarRender} from "./bar-chart-validation";

export type BarChartData = ChartWindowValid & ChartBaseValid // & ChartBarValid
export type BarChartSelection = Selection<HTMLDivElement, BarChartData>

export class BarChart extends Chart {
  public windowSelection: BarChartSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: ChartPointUserArgs) {
    super({...data, type: 'bar'})
    const chartData = barChartValidation({...data, renderer: this})
    this.windowSelection = windowSelection as BarChartSelection
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  public render(): void {
    const {
      chartS,
      layouterS
    } = chartWindowRender(this.windowSelection)
    // toolbarRender(this.windowSelection)
    // chartBarRender(chartS)
    // layouterS.on('boundschange.chartwindowbar', () => {
    //   scatterPlotRender(chartS)
    //   layouterS.call((s) => layouterCompute(s, false))
    // }).call((s) => layouterCompute(s))
    // resizeEventListener(this.windowSelection)
  }

  protected addBuiltInListeners() {
  }
}
