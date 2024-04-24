import {Selection} from "d3";
import {WindowValid} from "../../core/render/window";
import {CartesianChartValid} from "./cartesian-chart-validation";
import {SeriesChart} from "../../core/render/chart/series-chart/series-chart";
import {CartesianAxisValid} from "../cartesian-axis-validation";

type ChartSelection = Selection<SVGSVGElement, CartesianChartValid & WindowValid>

export abstract class CartesianChart extends SeriesChart {
  abstract windowS: Selection<HTMLDivElement, CartesianChartValid & WindowValid>
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }
  _horizontalAxisS?: Selection<SVGGElement, CartesianAxisValid>
  get horizontalAxisS(): Selection<SVGGElement, CartesianAxisValid> {
    return (this._horizontalAxisS && !this._horizontalAxisS.empty()) ? this._horizontalAxisS :
      this.chartS.selectAll<SVGGElement, CartesianAxisValid>('.axis-bottom, .axis-top')
  }
  _verticalAxisS?: Selection<SVGGElement, CartesianAxisValid>
  get verticalAxisS(): Selection<SVGGElement, CartesianAxisValid> {
    return (this._verticalAxisS && !this._verticalAxisS.empty()) ? this._verticalAxisS :
      this.chartS.selectAll<SVGGElement, CartesianAxisValid>('.axis-left, .axis-right')
  }

  protected addBuiltInListeners() {
    super.addBuiltInListeners()
  }

  protected preRender() {
    if (!this.initialRenderHappened) return
  }
}
