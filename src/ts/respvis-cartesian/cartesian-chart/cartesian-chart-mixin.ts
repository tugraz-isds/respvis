import {Selection} from "d3";
import {CartesianAxis} from "../cartesian-axis-validation";
import {Chart, Window} from "respvis-core";
import {renderOriginLine} from "./cartesian-chart-render/origin-line-render";
import {CartesianChartData} from "./cartesian-chart-validation";
import {cartesianGridRender} from "./cartesian-chart-render/grid-render";
import {renderCartesianAxes} from "./cartesian-chart-render/cartesian-axes-render";

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
  cartesianAxisRender() {
    const flipped = this.chartS.datum().series.responsiveState.currentlyFlipped
    this.chartS.classed('chart-cartesian', true)
      .attr('data-flipped', flipped)
    renderCartesianAxes(this.chartS)
  }
  originLineRender() { renderOriginLine(this.chartS) }
  cartesianGridRender() { cartesianGridRender(this.chartS) }
  addCartesianFeatures() {
    this.cartesianAxisRender()
    this.originLineRender()
    this.cartesianGridRender()
  }
}
