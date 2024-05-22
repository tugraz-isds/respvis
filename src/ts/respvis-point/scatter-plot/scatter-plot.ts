import {Selection} from 'd3';
import {renderScatterPlot} from "./render-scatter-plot";
import {ScatterPlotData, ScatterPlotUserArgs, validateScatterPlot} from "./validate-scatter-plot";
import {CartesianChartMixin} from "respvis-cartesian";
import {applyMixins, Chart, SeriesChartMixin, Window} from "respvis-core";

type WindowSelection = Selection<HTMLElement, Window & ScatterPlotData>;
type ChartSelection = Selection<SVGSVGElement, Window & ScatterPlotData>;

export interface ScatterPlot extends CartesianChartMixin, SeriesChartMixin {}
export class ScatterPlot extends Chart {
    constructor(windowSelection: Selection<HTMLDivElement>, data: ScatterPlotUserArgs) {
    super(windowSelection, {...data, type: 'point'})
    const chartData = validateScatterPlot({...data, renderer: this})
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
    renderScatterPlot(this.chartS)
    this.addCartesianFeatures()
    this.addFilterListener()
  }
}

applyMixins(ScatterPlot, [CartesianChartMixin, SeriesChartMixin])
