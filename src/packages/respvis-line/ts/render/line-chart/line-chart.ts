import {Selection} from 'd3';
import {CartesianChartMixin} from "respvis-cartesian";
import {LineChartData, LineChartUserArgs, validateLineChart} from "./validate-line-chart";
import {addSeriesHighlighting, applyMixins, Chart, DataSeriesChartMixin, validateWindow, Window} from "respvis-core";
import {renderLineSeries} from "../line-series";

export type WindowSelection = Selection<HTMLDivElement, Window & LineChartData>;
export type ChartSelection = Selection<SVGSVGElement, Window & LineChartData>;

export interface LineChart extends DataSeriesChartMixin, CartesianChartMixin {}
export class LineChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: LineChartUserArgs) {
    super()
    this._windowS = windowSelection as WindowSelection
    const initialWindowData = validateWindow({...data, type: 'line', renderer: this})
    const chartData = validateLineChart({...data, renderer: this})
    this.windowS.datum({...initialWindowData, ...chartData})
  }

  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override renderContent() {
    this.renderSeriesChartComponents()

    const series = this.chartS.datum().series.cloneToRenderData().applyFilter().applyZoom()
    const {lineSeriesS, pointSeriesS,
      pointS} = renderLineSeries(this.drawAreaS, [series])

    this.addAllSeriesFeatures(pointSeriesS)
    lineSeriesS.call(addSeriesHighlighting)
    this.drawAreaS.selectAll('.series-label')
      .attr( 'layout-strategy-horizontal', pointS.data()[0]?.labelData?.positionStrategyHorizontal ?? null)
      .attr( 'layout-strategy-vertical', pointS.data()[0]?.labelData?.positionStrategyVertical ?? null)

    this.renderCartesianComponents()
  }
}

applyMixins(LineChart, [DataSeriesChartMixin, CartesianChartMixin])
