import {Selection} from 'd3';
import {rectFromString, WindowValid,} from '../../core';
import {scatterPlotRender} from "./scatter-plot-render";
import {ScatterPlotArgs, ScatterPlotValid, scatterPlotValidation} from "./scatter-plot-validation";
import {getMaxRadius} from "../../core/data/radius/radius-util";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {CartesianChart} from "../../core/render/chart/cartesian-chart/cartesian-chart";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";

type WindowSelection = Selection<HTMLDivElement, WindowValid & ScatterPlotValid>;
type ChartSelection = Selection<SVGSVGElement, WindowValid & ScatterPlotValid>;
export type ScatterPlotUserArgs = Omit<ScatterPlotArgs, 'renderer'>

export class ScatterPlot extends CartesianChart {
  public windowSelection: WindowSelection
  public chartSelection?: ChartSelection
  constructor(windowSelection: Selection<HTMLDivElement>, data: ScatterPlotUserArgs) {
    super({...data, type: 'point'})
    const chartData = scatterPlotValidation({...data, renderer: this})
    this.windowSelection = windowSelection as WindowSelection
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  protected override mainRender() {
    super.mainRender()
    scatterPlotRender(this.chartSelection!)
    this.renderAxes()
  }

  protected override preRender() {
    super.preRender()
    if (!this.initialRenderHappened) return
    const { series } = this.windowSelection.datum()
    const { radii } = series
    const { x, y } = series
    const drawArea = this.windowSelection.selectAll('.draw-area')
    const chartElement = elementFromSelection(this.chartSelection)
    const maxRadius = getMaxRadius(radii, {chart: chartElement})
    const drawAreaBounds = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    const flipped = getCurrentRespVal(series.flipped, {chart: chartElement})
    //TODO: resizing is also necessary if no zoom
    x.scale.range(flipped ? [drawAreaBounds.height - maxRadius, maxRadius] : [maxRadius, drawAreaBounds.width - 2 * maxRadius])
    y.scale.range(flipped ? [maxRadius, drawAreaBounds.width - 2 * maxRadius] : [drawAreaBounds.height - maxRadius, maxRadius])
  }
}
