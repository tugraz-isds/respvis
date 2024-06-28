import {Selection} from "d3";
import {CartesianAxis} from "../validate-cartesian-axis";
import {Chart, Window} from "respvis-core";
import {renderCartesianAxes, renderGrid, renderOriginLine} from "./render";
import {CartesianChartData} from "./validate-cartesian-chart";

type CartesianChartSelection = Selection<SVGSVGElement, Window & CartesianChartData>

export abstract class CartesianChartMixin extends Chart {
  _horizontalAxisS?: Selection<SVGGElement, CartesianAxis>
  abstract get chartS(): CartesianChartSelection
  get horizontalAxisS(): Selection<SVGGElement, CartesianAxis> {
    return (this._horizontalAxisS && !this._horizontalAxisS.empty()) ? this._horizontalAxisS :
      this.chartS.selectAll<SVGGElement, CartesianAxis>('.axis-bottom, .axis-top')
  }
  _verticalAxisS?: Selection<SVGGElement, CartesianAxis>
  get verticalAxisS(): Selection<SVGGElement, CartesianAxis> {
    return (this._verticalAxisS && !this._verticalAxisS.empty()) ? this._verticalAxisS :
      this.chartS.selectAll<SVGGElement, CartesianAxis>('.axis-left, .axis-right')
  }
  renderCartesianAxis() {
    const flipped = this.chartS.datum().series.responsiveState.currentlyFlipped
    this.chartS.classed('chart-cartesian', true)
      .attr('data-flipped', flipped)
    renderCartesianAxes(this.chartS)
  }
  renderOriginLine() { renderOriginLine(this.chartS) }
  renderGrid() { renderGrid(this.chartS) }
  renderCartesianComponents() {
    this.renderCartesianAxis()
    this.renderOriginLine()
    this.renderGrid()
  }
}
