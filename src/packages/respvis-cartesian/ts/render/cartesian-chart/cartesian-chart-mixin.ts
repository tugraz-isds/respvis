import {Selection} from "d3";
import {CartesianAxis} from "../validate-cartesian-axis";
import {Chart, getCurrentResponsiveValue, Window} from "respvis-core";
import {renderCartesianAxes, renderGrid, renderOriginLine} from "./render";
import {CartesianChartData} from "./validate-cartesian-chart";
import {CartesianRenderer} from "./cartesian-renderer";

type CartesianChartSelection = Selection<SVGSVGElement, Window & CartesianChartData>

export abstract class CartesianChartMixin extends Chart implements CartesianRenderer {
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

  updateAxisInversionState() {
    const inversionState = {
      horizontal: this.horizontalAxisS.empty() ? false : getCurrentResponsiveValue(
        this.horizontalAxisS.datum().inverted, {chart: this.chartS, self: this.horizontalAxisS}),
      vertical: this.verticalAxisS.empty() ? false : getCurrentResponsiveValue(
        this.verticalAxisS.datum().inverted, {chart: this.chartS, self: this._verticalAxisS})
    }

    if (!this.horizontalAxisS.empty()) this.horizontalAxisS.datum().scaledValues.inverted = inversionState.horizontal
    if (!this.verticalAxisS.empty()) this.verticalAxisS.datum().scaledValues.inverted = inversionState.vertical
    return inversionState
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
