import {Selection} from "d3";
import {BarChartData, BarChartUserArgs, validateBarChart} from "./validate-bar-chart";
import {CartesianChartMixin} from "respvis-cartesian";
import {applyMixins, Chart, DataSeriesChartMixin, validateWindow, Window} from "respvis-core";
import {BarSeries, renderBarSeries} from "../bar-series";

type WindowSelection = Selection<HTMLDivElement, Window & BarChartData>
type ChartSelection = Selection<SVGSVGElement, Window & BarChartData>

export interface BarChart extends CartesianChartMixin, DataSeriesChartMixin {}
export class BarChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: BarChartUserArgs) {
    super()
    this._windowS = windowSelection as WindowSelection
    const initialWindowData = validateWindow({...data, type: 'bar', renderer: this})
    const chartData = validateBarChart({...data, renderer: this})
    this.windowS.datum({...initialWindowData, ...chartData})
  }
  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  _chartS?: ChartSelection
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override renderContent() {
    super.renderContent()
    this.renderSeriesChartComponents()

    const series = this.chartS.datum().series.cloneFiltered().cloneZoomed() as BarSeries
    const {seriesS, barS} = renderBarSeries(this.drawAreaS, [series])

    this.addAllSeriesFeatures(seriesS)
    this.drawAreaS.selectAll('.series-label')
      .attr( 'layout-strategy', barS.data()[0]?.labelData?.positionStrategy ?? null)
      .attr( 'data-inverted', barS.data()[0]?.inverted ? 'true' : null)

    this.renderCartesianComponents()
  }
}

applyMixins(BarChart, [CartesianChartMixin, DataSeriesChartMixin])
