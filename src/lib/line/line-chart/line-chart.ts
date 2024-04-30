import {Selection} from 'd3';
import {CartesianChartMixin} from "../../cartesian/cartesian-chart/cartesian-chart-mixin";
import {LineChartArgs, LineChartValid, lineChartValidation} from "./line-chart-validation";
import {lineChartRender} from "./line-chart-render";
import {Chart, WindowValid} from "../../core";
import {SeriesChartMixin} from "../../core/render/chart/series-chart/series-chart-mixin";
import {applyMixins} from "../../core/utilities/typescript";

export type WindowSelection = Selection<HTMLDivElement, WindowValid & LineChartValid>;
export type ChartSelection = Selection<SVGSVGElement, WindowValid & LineChartValid>;
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
