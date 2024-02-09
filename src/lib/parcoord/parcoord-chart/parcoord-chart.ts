import {Selection} from "d3";
import {rectFromString, WindowValid} from "../../core";
import {ParcoordChartUserArgs, ParcoordChartValid, parcoordChartValidation} from "./parcoord-chart-validation";
import {parCoordChartRender} from "./parcoord-chart-render";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";
import {SeriesChart} from "../../core/render/chart/series-chart/series-chart";

type WindowSelection = Selection<HTMLDivElement, WindowValid & ParcoordChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & ParcoordChartValid>

export class ParcoordChart extends SeriesChart {
  windowSelection: WindowSelection
  chartSelection?: ChartSelection

  constructor(windowSelection: Selection<HTMLDivElement>, data: ParcoordChartUserArgs) {
    super({...data, type: 'parcoord'})
    this.windowSelection = windowSelection as WindowSelection
    const chartData = parcoordChartValidation({...data, renderer: this})
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  protected addBuiltInListeners() {
    // throw new Error("Method not implemented.");
  }

  protected mainRender(): void {
    super.mainRender()
    parCoordChartRender(this.chartSelection!)
  }

  protected preRender() {
    if (!this.initialRenderHappened) return
    const drawArea = this.windowSelection.selectAll('.draw-area')
    const {series} = this.windowSelection.datum()
    const {axes, axesScale} = series
    const {width, height} = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    const chartElement = elementFromSelection(this.chartSelection)

    const renderState = { width, height,
      flipped: getCurrentRespVal(series.flipped, {chart: chartElement}),
      originalXRange: function (){
        return this.flipped ? [this.height, 0] : [0, this.width]
      },
      originalYRange: function (){
        return this.flipped ? [0, this.width] : [this.height, 0]
      }
    }

    axes.forEach(axis => axis.scaledValues.scale.range(renderState.originalYRange()))
    axesScale.range(renderState.originalXRange())
  }
}
