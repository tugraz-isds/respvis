import {Selection} from 'd3';
import {ScatterPlotData, ScatterPlotUserArgs, validateScatterPlot} from "./validate-scatter-plot";
import {CartesianChartMixin} from "respvis-cartesian";
import {addSeriesHighlighting, applyMixins, Chart, DataSeriesChartMixin, validateWindow, Window} from "respvis-core";
import {PointSeries} from "../point-series/point-series";
import {renderPointSeries} from "../point-series/render-point-series";

type WindowSelection = Selection<HTMLElement, Window & ScatterPlotData>;
type ChartSelection = Selection<SVGSVGElement, Window & ScatterPlotData>;

export interface ScatterPlot extends CartesianChartMixin, DataSeriesChartMixin {
}

export class ScatterPlot extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: ScatterPlotUserArgs) {
    super()
    this._windowS = windowSelection as WindowSelection
    const initialWindowData = validateWindow({...data, type: 'parcoord', renderer: this})
    const chartData = validateScatterPlot({...data, renderer: this})
    this.windowS.datum({...initialWindowData, ...chartData})
  }

  _windowS: WindowSelection
  get windowS(): WindowSelection {
    return this._windowS
  }

  _chartS?: ChartSelection
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override renderContent() {
    super.renderContent()
    this.renderSeriesChartComponents()

    const series = this.chartS.datum().series.cloneFiltered().cloneZoomed() as PointSeries
    const {seriesS, pointS} = renderPointSeries(this.drawAreaS, [series])

    this.addAllSeriesFeatures(seriesS)
    seriesS.call(addSeriesHighlighting)

    this.drawAreaS.selectAll('.series-label')
      .attr( 'layout-strategy-horizontal', pointS.data()[0]?.labelData?.positionStrategyHorizontal ?? null)
      .attr( 'layout-strategy-vertical', pointS.data()[0]?.labelData?.positionStrategyVertical ?? null)

    this.renderCartesianComponents()
  }
}

applyMixins(ScatterPlot, [CartesianChartMixin, DataSeriesChartMixin])
