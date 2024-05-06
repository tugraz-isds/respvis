import {Selection} from "d3";
import {BarChartArgs, BarChartValid, barChartValidation} from "./bar-chart-validation";
import {CartesianChartMixin} from "../../cartesian/cartesian-chart/cartesian-chart-mixin";
import {Chart, WindowValid} from "core/render";
import {SeriesChartMixin} from "../../core/render/chart/series-chart/series-chart-mixin";
import {applyMixins} from "core/utilities/typescript";
import {Bar, BarSeries, barSeriesRender} from "../bar-series";

type WindowSelection = Selection<HTMLDivElement, WindowValid & BarChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & BarChartValid>

export type BarChartUserArgs = Omit<BarChartArgs, 'renderer'>

export interface BarChart extends CartesianChartMixin, SeriesChartMixin {}
export class BarChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: BarChartUserArgs) {
    super(windowSelection, {...data, type: 'bar'})
    const chartData = barChartValidation({...data, renderer: this})
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

    const series = this.chartS.datum().series.cloneFiltered().cloneZoomed() as BarSeries
    const seriesS = barSeriesRender(this.drawAreaS, [series])
    const barS = seriesS.selectAll<SVGRectElement, Bar>('.bar:not(.exiting):not(.exit-done)')
    const bars = barS.data()

    this.addSeriesFeatures(seriesS)
    this.drawAreaS.selectAll('.series-label')
      .attr( 'layout-strategy', bars[0]?.labelArg?.position ?? null)

    this.addCartesianFeatures()
    this.addFilterListener()
  }
}

applyMixins(BarChart, [CartesianChartMixin, SeriesChartMixin])
