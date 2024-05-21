import {Selection} from 'd3';
import {CartesianChartMixin} from "respvis-cartesian";
import {LineChartArgs, LineChartValid, lineChartValidation} from "./line-chart-validation";
import {lineChartRender} from "./line-chart-render";
import {applyMixins, Chart, SeriesChartMixin, Window} from "respvis-core";

export type WindowSelection = Selection<HTMLDivElement, Window & LineChartValid>;
export type ChartSelection = Selection<SVGSVGElement, Window & LineChartValid>;
export type LineChartUserArgs = Omit<LineChartArgs, 'renderer'>

export interface LineChart extends SeriesChartMixin, CartesianChartMixin {}
export class LineChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: LineChartUserArgs) {
    super(windowSelection, {...data, type: 'line'})
    const chartData = lineChartValidation({...data, renderer: this})
    this._windowS = windowSelection as WindowSelection
    const initialWindowData = this.windowS.datum()
    this.windowS.datum({...initialWindowData, ...chartData})
  }

  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override mainRender() {
    super.mainRender()
    this.seriesRequirementsRender()
    lineChartRender(this.chartS)
    this.addCartesianFeatures()
    this.addFilterListener()
  }
}

applyMixins(LineChart, [SeriesChartMixin, CartesianChartMixin])
