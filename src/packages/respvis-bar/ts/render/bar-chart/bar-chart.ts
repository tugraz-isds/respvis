import {Selection} from "d3";
import {BarChartData, BarChartUserArgs, validateBarChart} from "./validate-bar-chart";
import {CartesianChartMixin} from "respvis-cartesian";
import {applyMixins, Chart, DataSeriesChartMixin, validateWindow, Window} from "respvis-core";
import {renderBarSeries} from "../bar-series";

type WindowSelection = Selection<HTMLDivElement, Window & BarChartData>
type ChartSelection = Selection<SVGSVGElement, Window & BarChartData>

export interface BarChart extends CartesianChartMixin, DataSeriesChartMixin {}
export class BarChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: BarChartUserArgs) {
    super()
    this._windowS = windowSelection as WindowSelection
    this.revalidate(data)
  }
  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  _chartS?: ChartSelection
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override renderContent() {
    this.renderSeriesChartComponents()

    const series = this.chartS.datum().series.cloneToRenderData().applyZoom().applyFilter()
    const {seriesS, barS} = renderBarSeries(this.drawAreaS, [series])

    this.addAllSeriesFeatures(seriesS)
    this.drawAreaS.selectAll('.series-label')
      .attr( 'layout-strategy', barS.data()[0]?.labelData?.positionStrategy ?? null)
      .attr( 'data-inverted', barS.data()[0]?.inverted ? 'true' : null)

    this.renderCartesianComponents()
  }

  public revalidate(data: BarChartUserArgs) {
    const initialWindowData = validateWindow({...data, type: 'bar', renderer: this})
    const chartData = validateBarChart({...data, renderer: this})
    this.windowS.datum({...initialWindowData, ...chartData})
  }
}

applyMixins(BarChart, [CartesianChartMixin, DataSeriesChartMixin])
