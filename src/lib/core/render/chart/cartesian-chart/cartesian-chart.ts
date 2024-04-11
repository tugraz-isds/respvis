import {Selection} from "d3";
import {WindowValid} from "../../window";
import {CartesianChartValid} from "./cartesian-chart-validation";
import {SeriesChart} from "../series-chart/series-chart";

type ChartSelection = Selection<SVGSVGElement, CartesianChartValid & WindowValid>

export abstract class CartesianChart extends SeriesChart {
  abstract windowS: Selection<HTMLDivElement, CartesianChartValid & WindowValid>
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected addBuiltInListeners() {
    super.addBuiltInListeners()
  }

  protected preRender() {
    if (!this.initialRenderHappened) return
  }
}
