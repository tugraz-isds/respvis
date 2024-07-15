import {Selection} from 'd3';
import {CartesianChartMixin} from "respvis-cartesian";
import {LineChartData, LineChartUserArgs, validateLineChart} from "./validate-line-chart";
import {addSeriesHighlighting, applyMixins, Chart, SeriesChartMixin, Window} from "respvis-core";
import {LineSeries, renderLineSeries} from "../line-series";
import {Point} from "respvis-point";

export type WindowSelection = Selection<HTMLDivElement, Window & LineChartData>;
export type ChartSelection = Selection<SVGSVGElement, Window & LineChartData>;

export interface LineChart extends SeriesChartMixin, CartesianChartMixin {}
export class LineChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: LineChartUserArgs) {
    super(windowSelection, {...data, type: 'line'})
    const chartData = validateLineChart({...data, renderer: this})
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

  protected override renderContent() {
    super.renderContent()
    this.renderSeriesChartComponents()

    const series = this.chartS.datum().series.cloneFiltered().cloneZoomed() as LineSeries
    const seriesS = renderLineSeries(this.drawAreaS, series)

    const seriesLineS = seriesS.filter('.series-line-line')
    const seriesPointS = seriesS.filter('.series-line-point')

    const pointS = seriesS.selectAll<SVGRectElement, Point>('.point:not(.exiting):not(.exit-done)')
    const points = pointS.data()

    this.addAllSeriesFeatures(seriesPointS)
    seriesLineS.call(addSeriesHighlighting)
    this.drawAreaS.selectAll('.series-label')
      .attr( 'layout-strategy-horizontal', points[0]?.labelData?.positionStrategyHorizontal ?? null)
      .attr( 'layout-strategy-vertical', points[0]?.labelData?.positionStrategyVertical ?? null)

    this.renderCartesianComponents()
  }
}

applyMixins(LineChart, [SeriesChartMixin, CartesianChartMixin])
