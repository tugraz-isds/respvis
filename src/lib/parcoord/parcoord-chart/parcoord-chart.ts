import {Selection} from "d3";
import {WindowValid} from "../../core";
import {ParcoordChartUserArgs, ParcoordChartValid, parcoordChartValidation} from "./parcoord-chart-validation";
import {parCoordChartRender} from "./parcord-chart-render/parcoord-chart-render";
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

  protected mainRender(): void {
    super.mainRender()
    parCoordChartRender(this.chartSelection!)
  }
}
