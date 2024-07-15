import {Selection} from "d3";
import {BarChartData, BarChartUserArgs, validateBarChart} from "./validate-bar-chart";
import {CartesianChartMixin} from "respvis-cartesian";
import {applyMixins, Chart, SeriesChartMixin, Window, windowValidation} from "respvis-core";
import {Bar, BarSeries, renderBarSeries} from "../bar-series";

type WindowSelection = Selection<HTMLDivElement, Window & BarChartData>
type ChartSelection = Selection<SVGSVGElement, Window & BarChartData>

export interface BarChart extends CartesianChartMixin, SeriesChartMixin {}
export class BarChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: BarChartUserArgs) {
    super()
    const chartData = validateBarChart({...data, renderer: this})
    this._windowS = windowSelection as WindowSelection
    const initialWindowData = windowValidation({...data, type: 'bar', renderer: this})
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
    const seriesS = renderBarSeries(this.drawAreaS, [series])
    const barS = seriesS.selectAll<SVGRectElement, Bar>('.bar:not(.exiting):not(.exit-done)')
    const bars = barS.data()

    this.addAllSeriesFeatures(seriesS)
    this.drawAreaS.selectAll('.series-label')
      .attr( 'layout-strategy', bars[0]?.labelData?.positionStrategy ?? null)

    this.renderCartesianComponents()
  }
}

applyMixins(BarChart, [CartesianChartMixin, SeriesChartMixin])
