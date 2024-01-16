import {Chart} from "../../core/render/charts/chart";
import {Selection} from "d3";
import {
  scatterPlotValidation,
  ChartPointUserArgs,
  ChartPointValid,
  scatterPlotRender,
  ScatterplotSelection, ChartPointArgs
} from "../../points";
import {
  ChartBaseValid, ChartCartesianValid,
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
import {BarChartArgs, barChartValidation, chartBarRender} from "./bar-chart-validation";
import {barChartRender} from "./bar-chart-render";

export type BarChartData = ChartWindowValid & ChartCartesianValid // & ChartBarValid
export type BarChartSelection = Selection<HTMLDivElement, BarChartData>

export type BarChartUserArgs = Omit<BarChartArgs, 'renderer'>

export class BarChart extends Chart {
  public windowSelection: BarChartSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: BarChartUserArgs) {
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
    toolbarRender(this.windowSelection)
    barChartRender(chartS)
    // layouterS.on('boundschange.chartwindowbar', () => {
    //   scatterPlotRender(chartS)
    //   layouterS.call((s) => layouterCompute(s, false))
    // }).call((s) => layouterCompute(s))
    // resizeEventListener(this.windowSelection)
  }

  protected addBuiltInListeners() {
  }
}
