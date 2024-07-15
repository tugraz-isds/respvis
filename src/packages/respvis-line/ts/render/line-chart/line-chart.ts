import {Selection} from 'd3';
import {CartesianChartMixin} from "respvis-cartesian";
import {LineChartData, LineChartUserArgs, validateLineChart} from "./validate-line-chart";
import {renderLineChart} from "./render-line-chart";
import {applyMixins, Chart, SeriesChartMixin, Window, windowValidation} from "respvis-core";

export type WindowSelection = Selection<HTMLDivElement, Window & LineChartData>;
export type ChartSelection = Selection<SVGSVGElement, Window & LineChartData>;

export interface LineChart extends SeriesChartMixin, CartesianChartMixin {}
export class LineChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: LineChartUserArgs) {
    super()
    const chartData = validateLineChart({...data, renderer: this})
    this._windowS = windowSelection as WindowSelection
    const initialWindowData = windowValidation({...data, type: 'line', renderer: this})
    this.windowS.datum({...initialWindowData, ...chartData})
  }

  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override renderContent() {
    super.renderContent()
    this.renderSeriesChartComponents()
    renderLineChart(this.chartS)
    this.renderCartesianComponents()
  }
}

applyMixins(LineChart, [SeriesChartMixin, CartesianChartMixin])
