import {Selection} from 'd3';
import {cartesianAxisRender, cartesianGridRender} from '../../cartesian';
import {scatterPlotRender} from "./scatter-plot-render";
import {ScatterPlotArgs, ScatterPlotValid, scatterPlotValidation} from "./scatter-plot-validation";
import {getMaxRadius} from "../../core/data/radius/radius-util";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {CartesianChart} from "../../cartesian/cartesian-chart/cartesian-chart";
import {originLineRender} from "../../cartesian/cartesian-chart/cartesian-chart-render/cartesian-chart-render";
import {rectFromString, WindowValid} from "../../core";

type WindowSelection = Selection<HTMLDivElement, WindowValid & ScatterPlotValid>;
type ChartSelection = Selection<SVGSVGElement, WindowValid & ScatterPlotValid>;
export type ScatterPlotUserArgs = Omit<ScatterPlotArgs, 'renderer'>

export class ScatterPlot extends CartesianChart {
  public windowS: WindowSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: ScatterPlotUserArgs) {
    super({...data, type: 'point'})
    const chartData = scatterPlotValidation({...data, renderer: this})
    this.windowS = windowSelection as WindowSelection
    this.windowS.datum({...this.initialWindowData, ...chartData})
  }

  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override mainRender() {
    super.mainRender()
    scatterPlotRender(this.chartS!)
    this.chartS.call(cartesianAxisRender)
    this.chartS.call(originLineRender)
    this.chartS.call(cartesianGridRender)
  }

  protected override preRender() {
    super.preRender()
    if (!this.initialRenderHappened) return
    const { series } = this.windowS.datum()
    const { radii } = series
    const { x, y } = series
    const drawArea = this.windowS.selectAll('.draw-area')
    const chartElement = elementFromSelection(this.chartS)
    const maxRadius = getMaxRadius(radii, {chart: chartElement})
    const drawAreaBounds = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    const flipped = series.responsiveState.currentlyFlipped
    //TODO: resizing is also necessary if no zoom
    x.scale.range(flipped ? [drawAreaBounds.height - maxRadius, maxRadius] : [maxRadius, drawAreaBounds.width - 2 * maxRadius])
    y.scale.range(flipped ? [maxRadius, drawAreaBounds.width - 2 * maxRadius] : [drawAreaBounds.height - maxRadius, maxRadius])
  }
}
