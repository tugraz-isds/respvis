import {Selection} from "d3";
import {CartesianAxis} from "../validate-cartesian-axis";
import {Chart, getCurrentResponsiveValue, Window} from "respvis-core";
import {renderCartesianAxes, renderGrid, renderOriginLine} from "./render";
import {CartesianChartData} from "./validate-cartesian-chart";
import {CartesianRenderer} from "./cartesian-renderer";

type CartesianChartSelection = Selection<SVGSVGElement, Window & CartesianChartData>

export abstract class CartesianChartMixin extends Chart implements CartesianRenderer {
  abstract get chartS(): CartesianChartSelection

  get xAxisS(): Selection<SVGGElement, CartesianAxis> {
    return this.chartS.selectAll<SVGGElement, CartesianAxis>('.axis-x')
  }

  get yAxisS(): Selection<SVGGElement, CartesianAxis> {
    return this.chartS.selectAll<SVGGElement, CartesianAxis>('.axis-y')
  }

  get horizontalAxisS(): Selection<SVGGElement, CartesianAxis> {
    return this.chartS.selectAll<SVGGElement, CartesianAxis>('.axis-bottom, .axis-top')
  }

  get verticalAxisS(): Selection<SVGGElement, CartesianAxis> {
    return this.chartS.selectAll<SVGGElement, CartesianAxis>('.axis-left, .axis-right')
  }

  getAxisInversionState() {
    return {
      horizontal: this.horizontalAxisS.empty() ? false : getCurrentResponsiveValue(
        this.horizontalAxisS.datum().inverted, {chart: this.chartS, self: this.horizontalAxisS}),
      vertical: this.verticalAxisS.empty() ? false : getCurrentResponsiveValue(
        this.verticalAxisS.datum().inverted, {chart: this.chartS, self: this.verticalAxisS}),
      x: this.xAxisS.empty() ? false : getCurrentResponsiveValue(
        this.xAxisS.datum().inverted, {chart: this.chartS, self: this.xAxisS}),
      y: this.yAxisS.empty() ? false : getCurrentResponsiveValue(
        this.yAxisS.datum().inverted, {chart: this.chartS, self: this.yAxisS})
    }
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
