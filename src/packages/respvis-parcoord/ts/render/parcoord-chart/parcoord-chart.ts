import {Selection} from "d3";
import {addSeriesHighlighting, applyMixins, Chart, DataSeriesChartMixin, validateWindow, Window} from "respvis-core";
import {ParcoordChartData, ParcoordChartUserArgs, validateParcoordChart} from "./validate-parcoord-chart";
import {ParcoordSeries} from "../parcoord-series";
import {renderParcoordSeries} from "../parcoord-series/render/render-parcoord-series";

type WindowSelection = Selection<HTMLDivElement, Window & ParcoordChartData>
type ChartSelection = Selection<SVGSVGElement, Window & ParcoordChartData>

export interface ParcoordChart extends DataSeriesChartMixin {}
export class ParcoordChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: ParcoordChartUserArgs) {
    super()
    this._windowS = windowSelection as WindowSelection
    const initialWindowData = validateWindow({...data, type: 'parcoord', renderer: this})
    const chartData = validateParcoordChart({...data, renderer: this})
    this.windowS.datum({...initialWindowData, ...chartData})
  }

  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected renderContent() {
    this.renderSeriesChartComponents()

    const series = this.chartS.datum().series.cloneFiltered().cloneZoomed().cloneInverted() as ParcoordSeries
    const {lineSeriesS} = renderParcoordSeries(this.drawAreaS, [series])

    lineSeriesS.call(addSeriesHighlighting)
  }
}

applyMixins(ParcoordChart, [DataSeriesChartMixin])

