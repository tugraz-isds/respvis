import {Selection} from "d3";
import {CartesianAxisValid} from "../cartesian-axis-validation";
import {Chart, WindowValid} from "../../respvis-core";
import {cartesianAxisRender, originLineRender} from "./cartesian-chart-render/cartesian-chart-render";
import {CartesianChartValid} from "./cartesian-chart-validation";
import {cartesianGridRender} from "./cartesian-chart-render/cartesian-grid-render";

type CartesianChartSelection = Selection<SVGSVGElement, WindowValid & CartesianChartValid>

export abstract class CartesianChartMixin extends Chart {
  _horizontalAxisS?: Selection<SVGGElement, CartesianAxisValid>
  abstract get chartS(): CartesianChartSelection
  get horizontalAxisS(): Selection<SVGGElement, CartesianAxisValid> {
    return (this._horizontalAxisS && !this._horizontalAxisS.empty()) ? this._horizontalAxisS :
      this.chartS.selectAll<SVGGElement, CartesianAxisValid>('.axis-bottom, .axis-top')
  }
  _verticalAxisS?: Selection<SVGGElement, CartesianAxisValid>
  get verticalAxisS(): Selection<SVGGElement, CartesianAxisValid> {
    return (this._verticalAxisS && !this._verticalAxisS.empty()) ? this._verticalAxisS :
      this.chartS.selectAll<SVGGElement, CartesianAxisValid>('.axis-left, .axis-right')
  }
  cartesianAxisRender() {
    const flipped = this.chartS.datum().series.responsiveState.currentlyFlipped
    this.chartS.classed('chart-cartesian', true)
      .attr('data-flipped', flipped)
    cartesianAxisRender(this.chartS)
  }
  originLineRender() { originLineRender(this.chartS) }
  cartesianGridRender() { cartesianGridRender(this.chartS) }
  addCartesianFeatures() {
    this.cartesianAxisRender()
    this.originLineRender()
    this.cartesianGridRender()
  }
}
