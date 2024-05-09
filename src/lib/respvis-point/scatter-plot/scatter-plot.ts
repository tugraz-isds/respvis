import {Selection} from 'd3';
import {scatterPlotRender} from "./scatter-plot-render";
import {ScatterPlotArgs, ScatterPlotValid, scatterPlotValidation} from "./scatter-plot-validation";
import {CartesianChartMixin} from "respvis-cartesian";
import {applyMixins, Chart, SeriesChartMixin, WindowValid} from "respvis-core";

type WindowSelection = Selection<HTMLElement, WindowValid & ScatterPlotValid>;
type ChartSelection = Selection<SVGSVGElement, WindowValid & ScatterPlotValid>;
export type ScatterPlotUserArgs = Omit<ScatterPlotArgs, 'renderer'>

export interface ScatterPlot extends CartesianChartMixin, SeriesChartMixin {}
export class ScatterPlot extends Chart {
    constructor(windowSelection: Selection<HTMLDivElement>, data: ScatterPlotUserArgs) {
    super(windowSelection, {...data, type: 'point'})
    const chartData = scatterPlotValidation({...data, renderer: this})
    this._windowS = windowSelection as WindowSelection
    const initialWindowData = this.windowS.datum()
    this.windowS.datum({...initialWindowData, ...chartData})
  }
  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  _chartS?: ChartSelection
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override mainRender() {
    super.mainRender()
    this.seriesRequirementsRender()
    scatterPlotRender(this.chartS)
    this.addCartesianFeatures()
    this.addFilterListener()
  }
}

applyMixins(ScatterPlot, [CartesianChartMixin, SeriesChartMixin])
